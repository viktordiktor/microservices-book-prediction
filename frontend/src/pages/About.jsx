import { GlobalStyle } from "../styles";
import { Container } from "../components/common/Container";
import { Header } from "../components/common/Header";
import React from "react";
import { Card, Typography, Divider, Row, Col } from "antd";
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
} from "recharts";

const { Title, Paragraph } = Typography;

const StyledCard = styled(Card)`
  margin-top: 20px;
  padding: 20px;
  padding-bottom: 0px;
  padding-top: 0px;
  width: 90%;
  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
  }
`;


const AboutPage = () => {

    const chartData = {
        linearRegression: {
            before: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5]].map(([x, y]) => ({ x, y })),
            after: [[5, 5], [6, 6], [7, 7]].map(([x, y]) => ({ x, y })),
        },
        exponentialSmoothing: {
            before: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5]].map(([x, y]) => ({ x, y })),
            after: [[5, 4], [6, 4], [7, 4]].map(([x, y]) => ({ x, y })),
        },
        average: {
            before: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5]].map(([x, y]) => ({ x, y })),
            after: [[5, 2.5], [6, 2.5], [7, 2.5]].map(([x, y]) => ({ x, y })),
        },
    };

    const renderLineChart = (dataBefore, dataAfter) => {
        return (
            <ResponsiveContainer width="100%" height={150}>
                <LineChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line dataKey="y" name="Исходные данные" data={dataBefore} stroke="#8884d8" strokeWidth={2} dot={false} />
                    <Line dataKey="y" name="Прогноз" data={dataAfter} stroke="green" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        );
    };

    return (
        <>
            <GlobalStyle />
            <Container>
                <Header />
                <StyledCard>
                    <Title level={2}>О сервисе</Title>
                    <Paragraph>
                        Этот сервис предназначен для прогнозирования спроса на книги. Он помогает оптимизировать запасы, предотвращая дефицит или избыток книг на складе.  Сервис анализирует данные о прошлых продажах и, используя различные методы прогнозирования, предсказывает будущий спрос.  Это позволяет принимать обоснованные решения о закупке книг и управлять ассортиментом.
                    </Paragraph>

                    <Divider />

                    <Title level={3}>Методы прогнозирования</Title>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Card title="Линейная регрессия">
                                {renderLineChart(chartData.linearRegression.before, chartData.linearRegression.after)}
                                <Paragraph>
                                    Метод, который используется для нахождения зависимости между одной переменной и одной или несколькими другими переменными. Линейная регрессия учитывает тренд — направление, в котором движется зависимая переменная со временем.  Хорошо подходит для данных с четким трендом.
                                </Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Card title="Экспоненциальное сглаживание">
                                {renderLineChart(chartData.exponentialSmoothing.before, chartData.exponentialSmoothing.after)}
                                <Paragraph>
                                    Этот метод используется для прогнозирования временных рядов. Он придает больший вес более свежим данным, что помогает лучше учитывать изменения во времени. Сглаживание помогает уменьшить влияние случайных колебаний. Подходит для данных с сезонностью и трендом.
                                </Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Card title="Среднее значение">
                                {renderLineChart(chartData.average.before, chartData.average.after)}
                                <Paragraph>
                                    Простой метод, который вычисляет среднее значение набора данных и использует его для прогноза. Это подходит для случаев, когда данные не имеют явного тренда или сезонности, и считается хорошим ориентиром для будущих значений.  Полезен для стабильных продаж.
                                </Paragraph>
                            </Card>
                        </Col>
                    </Row>
                </StyledCard>
            </Container>
        </>
    );
};

export default AboutPage;