import { GlobalStyle } from "../styles";
import { Container } from "../components/common/Container";
import { Header } from "../components/common/Header";
import React, { useEffect, useState } from "react";
import { Card, Divider, Typography, Spin, Row, Col, Descriptions, Statistic } from "antd";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { getForecastById } from "../queries/forecast";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { format } from "date-fns";
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
  
  /* Стилизация скроллбара */
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
  
  scroll-behavior: smooth;
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
`;

const formatDate = (dateString) => {
    try {
        return format(new Date(dateString), 'dd MMM yyyy', { locale: ru });
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

    if (loading) {
        return (
            <Container>
                <Header />
                <Spin
                    size="large"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "80vh",
                    }}
                />
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
            Продажи: value
        }));

    return (
        <>
            <GlobalStyle />
            <Container>
                <Header />
                <StyledCard>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <Title level={2}>
                                Прогноз для книги: {forecastData.bookTitle}
                            </Title>
                            <Text type="secondary">
                                ID прогноза: {forecastData.id}
                            </Text>
                        </Col>

                        {/* Основные параметры */}
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

                        {/* График продаж */}
                        <Col span={24}>
                            <SectionTitle level={4}>История продаж</SectionTitle>
                            <ChartContainer>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ angle: -45, textAnchor: 'end' }}
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

                        {/* Параметры запасов */}
                        <Col span={24}>
                            <SectionTitle level={4}>Оптимальные параметры запасов</SectionTitle>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={12}>
                                    <ParameterCard>
                                        <Title level={5}>Страховой запас</Title>
                                        <Descriptions column={1}>
                                            <Descriptions.Item label="Расчетное значение">
                                                {forecastData.insuranceStock}
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
                                                {forecastData.orderPoint}
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
                                                {forecastData.optimalBatchSize}
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

                        {/* Экономические показатели */}
                        <Col span={24}>
                            <SectionTitle level={4}>Экономические параметры</SectionTitle>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12}>
                                    <ParameterCard>
                                        <Statistic
                                            title="Стоимость хранения"
                                            value={formatCurrency(forecastData.storageCostPerUnit)}
                                        />
                                        <Text type="secondary">
                                            Стоимость хранения одной единицы в день
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