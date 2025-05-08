import { GlobalStyle } from "../styles";
import { Container } from "../components/common/Container";
import { Header } from "../components/common/Header";
import React, { useEffect, useState } from "react";
import {
    Card,
    Divider,
    Typography,
    Spin,
    Row,
    Col,
    Descriptions,
    Statistic,
    Tag,
    Alert
} from "antd";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    ReferenceLine,
    ReferenceArea,
    Legend
} from "recharts";
import { getForecastById } from "../queries/forecast";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const { Title, Text } = Typography;

const StyledCard = styled(Card)`
  margin-top: 20px;
  width: 90%;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding-bottom: 20px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #1890ff;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #1478d4;
  }
`;

const SectionTitle = styled(Title)`
  margin-top: 30px !important;
  color: #1890ff !important;
`;

const ParameterCard = styled(Card)`
  margin: 15px 0;
  border-left: 4px solid #1890ff;
  border-radius: 8px;
`;

const ChartContainer = styled.div`
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 24px 0;
  overflow: visible; // Добавляем это свойство
`;

const InventoryChartContainer = styled.div`
  margin: 40px 0;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const formatDate = (dateString) => {
    try {
        // Пробуем разные форматы дат
        const date = isNaN(new Date(dateString).getTime())
            ? parseISO(dateString)
            : new Date(dateString);
        return format(date, 'dd MMM yyyy', { locale: ru });
    } catch (e) {
        console.error('Date formatting error:', e);
        return dateString; // Возвращаем оригинальную строку если не удалось распарсить
    }
};

const formatShortDate = (dateString) => {
    try {
        return format(parseISO(dateString), 'dd.MM', { locale: ru }); // Только день и месяц
    } catch {
        return dateString;
    }
};

const formatCurrency = (value) =>
    new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2
    }).format(value);

const ForecastPage = () => {
    const { forecastId } = useParams();
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getForecastById(forecastId);
                setForecastData(data);
            } catch (error) {
                console.error("Error fetching forecast:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [forecastId]);

    const needsOrder = forecastData &&
        forecastData.currentAmount <= forecastData.roundedOrderPoint;

    const generateInventoryData = () => {
        if (!forecastData) return [];

        const dailyConsumption = forecastData.roundedOrderPoint / forecastData.orderLeadTime;
        const data = [];
        let stock = forecastData.currentAmount;
        let orderPlaced = false;
        let orderArrived = false;
        let day = 1;
        let daysAfterArrival = 0;

        // Добавляем текущий день
        data.push({ day, stock, event: 'current' });

        while ((!orderArrived || daysAfterArrival < 3) && day < 60) {
            day++;

            // Уменьшаем запас В НАЧАЛЕ дня (кроме дня получения заказа)
            if (!(orderArrived && day === data.find(d => d.event === 'order_arrived')?.day)) {
                stock = Math.max(stock - dailyConsumption, 0);
            }

            // Если достигли точки заказа - размещаем заказ
            if (stock <= forecastData.roundedOrderPoint && !orderPlaced) {
                orderPlaced = true;
                data.push({ day, stock, event: 'order_placed', orderDay: day });
            }
            // Если заказ размещен и прошло время доставки - получаем заказ
            else if (orderPlaced && !orderArrived &&
                day === data.find(d => d.event === 'order_placed').day + forecastData.orderLeadTime) {
                stock += forecastData.roundedOptimalBatchSize;
                orderArrived = true;
                data.push({ day, stock, event: 'order_arrived' });
                daysAfterArrival = 0;
                continue;
            }

            // Увеличиваем счётчик дней после прибытия
            if (orderArrived) {
                daysAfterArrival++;
            }

            // Добавляем данные дня
            data.push({
                day,
                stock,
                event: orderArrived ? 'after_arrival' : 'normal'
            });
        }

        return data;
    };

    const renderInventoryChart = () => {
        const inventoryData = generateInventoryData();
        const orderPlacedDay = inventoryData.find(d => d.event === 'order_placed')?.day;
        const orderArrivedDay = inventoryData.find(d => d.event === 'order_arrived')?.day;

        return (
            <InventoryChartContainer>
                <Title level={4}>Рекомендуемая стратегия управления запасами</Title>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={inventoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" label={{ value: 'Дни', position: 'insideBottomRight', offset: -5 }} />
                        <YAxis label={{ value: 'Количество книг', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />

                        <Line
                            type="monotone"
                            dataKey="stock"
                            name="Запас на складе"
                            stroke="#1890ff"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />

                        <ReferenceLine
                            y={forecastData.roundedOrderPoint}
                            label={{
                                value: 'Точка заказа',
                                position: 'insideBottomLeft',
                                fill: '#f5222d'
                            }}
                            stroke="#f5222d"
                            strokeDasharray="3 3"
                        />

                        <ReferenceLine
                            y={forecastData.roundedInsuranceStock}
                            label={{
                                value: 'Страховой запас',
                                position: 'insideBottomLeft',
                                fill: '#52c41a'
                            }}
                            stroke="#52c41a"
                            strokeDasharray="3 3"
                        />

                        {orderPlacedDay && orderArrivedDay && (
                            <ReferenceArea
                                x1={orderPlacedDay}
                                x2={orderArrivedDay}
                                label={{
                                    value: 'Период доставки',
                                    position: 'top',
                                    fill: 'rgba(0, 0, 0, 0.5)'
                                }}
                                fill="rgba(250, 200, 0, 0.2)"
                            />
                        )}

                        {orderPlacedDay && (
                            <ReferenceLine
                                x={orderPlacedDay}
                                stroke="#fa8c16"
                                label={{
                                    value: 'Размещение заказа',
                                    position: 'top',
                                    fill: '#fa8c16'
                                }}
                            />
                        )}

                        {orderArrivedDay && (
                            <ReferenceLine
                                x={orderArrivedDay}
                                stroke="#52c41a"
                                label={{
                                    value: 'Прибытие заказа',
                                    position: 'top',
                                    fill: '#52c41a'
                                }}
                            />
                        )}

                        <ReferenceLine
                            x={1}
                            stroke="#1890ff"
                            label={{
                                value: 'Текущий запас',
                                position: 'right',
                                fill: '#1890ff'
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>

                <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small">
                            <Statistic
                                title="Текущий запас"
                                value={forecastData.currentAmount}
                                suffix="книг"
                                valueStyle={{
                                    color: needsOrder ? '#f5222d' : '#3f8600'
                                }}
                            />
                            <Text type={needsOrder ? 'danger' : 'success'}>
                                {needsOrder ? 'Требуется заказ!' : 'Нормальный уровень'}
                            </Text>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small">
                            <Statistic
                                title="Точка заказа (ROP)"
                                value={forecastData.roundedOrderPoint}
                                suffix="книг"
                            />
                            <Text type="secondary">Уровень для нового заказа</Text>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small">
                            <Statistic
                                title="Страховой запас"
                                value={forecastData.roundedInsuranceStock}
                                suffix="книг"
                            />
                            <Text type="secondary">Буфер на время доставки</Text>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small">
                            <Statistic
                                title="EOQ"
                                value={forecastData.roundedOptimalBatchSize}
                                suffix="книг"
                            />
                            <Text type="secondary">Оптимальный размер заказа</Text>
                        </Card>
                    </Col>
                </Row>
            </InventoryChartContainer>
        );
    };

    if (loading) {
        return (
            <Container>
                <Header />
                <Spin size="large" style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh"
                }} />
            </Container>
        );
    }

    if (!forecastData) {
        return (
            <Container>
                <Header />
                <div style={{ marginTop: 20 }}>Ошибка загрузки данных прогноза</div>
            </Container>
        );
    }

    const chartData = Object.entries(forecastData.previousSales)
        .map(([date, value]) => ({
            date: formatDate(date),
            originalDate: date, // сохраняем оригинальную дату для сортировки
            Продажи: value
        }))
        .sort((a, b) => new Date(a.originalDate) - new Date(b.originalDate)); // сортируем по дате

    return (
        <>
            <GlobalStyle />
            <Container>
                <Header />
                <StyledCard>
                    {needsOrder ? (
                        <Alert
                            message="ТРЕБУЕТСЯ ЗАКАЗ!"
                            description={`Текущий запас (${forecastData.currentAmount}) ниже точки заказа (${forecastData.roundedOrderPoint}). Рекомендуемый размер заказа: ${forecastData.roundedOptimalBatchSize} ед.`}
                            type="error"
                            showIcon
                            style={{ marginBottom: 24 }}
                        />
                    ) : (
                        <Alert
                            message="Запас в норме"
                            description={`Текущий запас (${forecastData.currentAmount}) выше точки заказа (${forecastData.roundedOrderPoint}).`}
                            type="success"
                            showIcon
                            style={{ marginBottom: 24 }}
                        />
                    )}

                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <Title level={2}>
                                Прогноз для книги: {forecastData.bookTitle}
                                <Tag color="blue" style={{ marginLeft: 16 }}>
                                    на {formatShortDate(forecastData.createdDate || new Date().toISOString())}
                                </Tag>
                            </Title>
                            <Text type="secondary">
                                ID прогноза: {forecastData.id} | Текущий запас: {forecastData.currentAmount} ед.
                            </Text>
                        </Col>

                        <Col span={24}>
                            <SectionTitle level={4}>Основные параметры</SectionTitle>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12} md={8}>
                                    <ParameterCard>
                                        <Statistic
                                            title="Страховые дни"
                                            value={forecastData.insuranceDays}
                                            suffix="дней"
                                        />
                                        <Text type="secondary">
                                            Буфер безопасности для непредвиденных ситуаций
                                        </Text>
                                    </ParameterCard>
                                </Col>

                                <Col xs={24} sm={12} md={8}>
                                    <ParameterCard>
                                        <Statistic
                                            title="Срок доставки"
                                            value={forecastData.orderLeadTime}
                                            suffix="дней"
                                        />
                                        <Text type="secondary">
                                            Время от заказа до получения товара
                                        </Text>
                                    </ParameterCard>
                                </Col>

                                <Col xs={24} sm={12} md={8}>
                                    <ParameterCard>
                                        <Statistic
                                            title="Стоимость заказа"
                                            value={formatCurrency(forecastData.orderPlacementCost)}
                                        />
                                        <Text type="secondary">
                                            Средние расходы на оформление заказа
                                        </Text>
                                    </ParameterCard>
                                </Col>
                            </Row>
                        </Col>

                        <Col span={24}>
                            <SectionTitle level={4}>История продаж</SectionTitle>
                            <ChartContainer>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart
                                        data={chartData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }} // Увеличиваем нижний margin
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ angle: -45, textAnchor: 'end' }}
                                            interval={0}
                                            height={80} // Увеличиваем высоту оси
                                        />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="Продажи"
                                            stroke="#1890ff"
                                            strokeWidth={2}
                                            dot={{ fill: '#1890ff' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </Col>

                        <Col span={24}>
                            {renderInventoryChart()}
                        </Col>

                        <Col span={24}>
                            <SectionTitle level={4}>Оптимальные параметры запасов</SectionTitle>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={12}>
                                    <ParameterCard>
                                        <Title level={5}>Страховой запас</Title>
                                        <Descriptions column={1}>
                                            <Descriptions.Item label="Расчетное значение">
                                                {forecastData.insuranceStock.toFixed(2)}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Рекомендуемое">
                                                <Text strong>
                                                    {forecastData.roundedInsuranceStock}
                                                </Text>
                                            </Descriptions.Item>
                                        </Descriptions>
                                        <Text type="secondary">
                                            Минимальный запас для поддержания бесперебойных продаж
                                        </Text>
                                    </ParameterCard>
                                </Col>

                                <Col xs={24} md={12}>
                                    <ParameterCard>
                                        <Title level={5}>Точка заказа</Title>
                                        <Descriptions column={1}>
                                            <Descriptions.Item label="Расчетное значение">
                                                {forecastData.orderPoint.toFixed(2)}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Рекомендуемое">
                                                <Text strong>
                                                    {forecastData.roundedOrderPoint}
                                                </Text>
                                            </Descriptions.Item>
                                        </Descriptions>
                                        <Text type="secondary">
                                            Уровень запаса для запуска нового заказа
                                        </Text>
                                    </ParameterCard>
                                </Col>

                                <Col span={24}>
                                    <ParameterCard>
                                        <Title level={5}>Оптимальный размер заказа</Title>
                                        <Descriptions column={1}>
                                            <Descriptions.Item label="По формуле EOQ">
                                                {forecastData.optimalBatchSize.toFixed(2)}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Рекомендуемый размер">
                                                <Text strong>
                                                    {forecastData.roundedOptimalBatchSize}
                                                </Text>
                                            </Descriptions.Item>
                                        </Descriptions>
                                        <Text type="secondary">
                                            Экономически эффективный размер партии с учетом
                                            стоимости заказа и хранения
                                        </Text>
                                    </ParameterCard>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </StyledCard>
            </Container>
        </>
    );
};

export default ForecastPage;