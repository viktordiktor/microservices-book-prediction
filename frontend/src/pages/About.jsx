import { GlobalStyle } from "../styles";
import { Container } from "../components/common/Container";
import { Header } from "../components/common/Header";
import React from "react";
import {Card, Typography, Divider, Row, Col, Tag, Statistic} from "antd";
import styled from "styled-components";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    ReferenceLine,
    ReferenceArea
} from "recharts";

const { Title, Paragraph, Text } = Typography;

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

const InventoryChartContainer = styled.div`
  margin: 40px 0;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MethodCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  border-left: 3px solid ${props => props.color || '#1890ff'};
`;

const AboutPage = () => {
    // Данные для графика управления запасами
    const inventoryData = [
        { day: 1, stock: 100 },
        { day: 2, stock: 95 },
        { day: 3, stock: 90 },
        { day: 4, stock: 85 },
        { day: 5, stock: 80 },
        { day: 6, stock: 75 },
        { day: 7, stock: 70 }, // Точка заказа (Order Point)
        { day: 8, stock: 65 }, // Заказ размещен
        { day: 9, stock: 60 },
        { day: 10, stock: 55 },
        { day: 11, stock: 50 }, // Начало использования страхового запаса
        { day: 12, stock: 45 },
        { day: 13, stock: 40 },
        { day: 14, stock: 35 },
        { day: 15, stock: 30 }, // Прибытие заказа (+EOQ)
        { day: 16, stock: 130 }, // Запас пополнен
        { day: 17, stock: 125 },
        { day: 18, stock: 120 },
        { day: 19, stock: 115 },
        { day: 20, stock: 110 },
    ];

    // Параметры системы управления запасами
    const inventoryParams = {
        eoq: 100, // Оптимальный размер заказа
        orderPoint: 70, // Точка заказа
        safetyStock: 30, // Страховой запас
        leadTime: 7, // Время доставки (дней)
    };

    const renderInventoryChart = () => {
        return (
            <InventoryChartContainer>
                <Title level={4} style={{ marginBottom: 24 }}>Система управления запасами</Title>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={inventoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" label={{ value: 'Дни', position: 'insideBottomRight', offset: -5 }} />
                        <YAxis label={{ value: 'Количество книг', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />

                        {/* Основной график запасов */}
                        <Line
                            type="monotone"
                            dataKey="stock"
                            name="Запас на складе"
                            stroke="#1890ff"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />

                        {/* Точка заказа */}
                        <ReferenceLine
                            y={inventoryParams.orderPoint}
                            label={{
                                value: 'Точка заказа',
                                position: 'insideBottomLeft',
                                fill: '#f5222d'
                            }}
                            stroke="#f5222d"
                            strokeDasharray="3 3"
                        />

                        {/* Страховой запас */}
                        <ReferenceLine
                            y={inventoryParams.safetyStock}
                            label={{
                                value: 'Страховой запас',
                                position: 'insideBottomLeft',
                                fill: '#52c41a'
                            }}
                            stroke="#52c41a"
                            strokeDasharray="3 3"
                        />

                        {/* Период доставки */}
                        <ReferenceArea
                            x1={7}
                            x2={15}
                            label={{
                                value: 'Период доставки',
                                position: 'top',
                                fill: 'rgba(0, 0, 0, 0.5)'
                            }}
                            fill="rgba(250, 200, 0, 0.2)"
                        />

                        {/* Момент заказа */}
                        <ReferenceLine
                            x={7}
                            stroke="#fa8c16"
                            label={{
                                value: 'Размещение заказа',
                                position: 'top',
                                fill: '#fa8c16'
                            }}
                        />

                        {/* Момент прибытия заказа */}
                        <ReferenceLine
                            x={15}
                            stroke="#52c41a"
                            label={{
                                value: 'Прибытие заказа',
                                position: 'top',
                                fill: '#52c41a'
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>

                <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small">
                            <Statistic
                                title="Точка заказа (ROP)"
                                value={inventoryParams.orderPoint}
                                suffix="книг"
                            />
                            <Text type="secondary">Уровень для нового заказа</Text>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small">
                            <Statistic
                                title="Страховой запас"
                                value={inventoryParams.safetyStock}
                                suffix="книг"
                            />
                            <Text type="secondary">Буфер на время доставки</Text>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small">
                            <Statistic
                                title="EOQ"
                                value={inventoryParams.eoq}
                                suffix="книг"
                            />
                            <Text type="secondary">Оптимальный размер заказа</Text>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card size="small">
                            <Statistic
                                title="Срок доставки"
                                value={inventoryParams.leadTime}
                                suffix="дней"
                            />
                            <Text type="secondary">Время выполнения заказа</Text>
                        </Card>
                    </Col>
                </Row>
            </InventoryChartContainer>
        );
    };

    return (
        <>
            <GlobalStyle />
            <Container>
                <Header />
                <StyledCard>
                    <Title level={2}>Система учета и управления книжными запасами</Title>
                    <Paragraph style={{ fontSize: 16 }}>
                        Наш сервис помогает автоматизировать процесс управления книжными запасами, используя современные методы анализа и прогнозирования. Система рассчитывает оптимальные параметры для минимизации затрат при поддержании необходимого уровня запасов.
                    </Paragraph>

                    <Divider />

                    {renderInventoryChart()}

                    <Title level={3}>Ключевые параметры системы</Title>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12}>
                            <MethodCard color="#1890ff">
                                <Title level={4}>Точка заказа (Reorder Point)</Title>
                                <Paragraph>
                                    Это минимальный уровень запаса, при достижении которого необходимо разместить новый заказ. Рассчитывается на основе:
                                </Paragraph>
                                <ul>
                                    <li>Среднего спроса в день</li>
                                    <li>Времени доставки (lead time)</li>
                                    <li>Страхового запаса</li>
                                </ul>
                                <Text strong>Формула: Точка заказа = (Средний спрос × Время доставки) + Страховой запас</Text>
                            </MethodCard>
                        </Col>

                        <Col xs={24} sm={24} md={12}>
                            <MethodCard color="#52c41a">
                                <Title level={4}>Страховой запас (Safety Stock)</Title>
                                <Paragraph>
                                    Дополнительный запас для защиты от непредвиденных колебаний спроса или задержек поставки. Определяется на основе:
                                </Paragraph>
                                <ul>
                                    <li>Волатильности спроса</li>
                                    <li>Надежности поставщика</li>
                                    <li>Желаемого уровня сервиса</li>
                                </ul>
                                <Text strong>Формула: Страховой запас = Z × σ × √(Время доставки)</Text>
                            </MethodCard>
                        </Col>

                        <Col xs={24} sm={24} md={12}>
                            <MethodCard color="#722ed1">
                                <Title level={4}>EOQ (Economic Order Quantity)</Title>
                                <Paragraph>
                                    Оптимальный размер заказа, который минимизирует суммарные затраты на хранение и размещение заказов. Учитывает:
                                </Paragraph>
                                <ul>
                                    <li>Годовой спрос</li>
                                    <li>Затраты на размещение заказа</li>
                                    <li>Затраты на хранение</li>
                                </ul>
                                <Text strong>Формула: EOQ = √((2 × Годовой спрос × Затраты на заказ) / Затраты на хранение)</Text>
                            </MethodCard>
                        </Col>

                        <Col xs={24} sm={24} md={12}>
                            <MethodCard color="#fa8c16">
                                <Title level={4}>Цикл управления запасами</Title>
                                <Paragraph>
                                    Процесс непрерывного контроля и пополнения запасов включает:
                                </Paragraph>
                                <ul>
                                    <li>Мониторинг текущего уровня запасов</li>
                                    <li>Автоматическое создание заказов при достижении точки заказа</li>
                                    <li>Использование страхового запаса при задержках</li>
                                    <li>Пополнение запасов до оптимального уровня</li>
                                </ul>
                            </MethodCard>
                        </Col>
                    </Row>
                </StyledCard>
            </Container>
        </>
    );
};

export default AboutPage;