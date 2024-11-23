import { GlobalStyle } from "../styles";
import { Container } from "../components/common/Container";
import { Header } from "../components/common/Header";
import React, { useEffect, useState } from "react";
import { Card, Divider, Space, Typography, Spin, Row, Col, Descriptions } from "antd";
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
import { getForecastById } from "../queries/forecast";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const { Title, Text, Paragraph } = Typography;

const StyledCard = styled(Card)`
  margin-top: 20px;
  overflow-y: auto;
  max-height: calc(100vh - 100px);
  width: 90%; 
`;

const InfoSection = styled.div`
  margin-bottom: 20px;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
`;

const MethodDescription = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
`;

const SummarySection = styled.div`
  margin-top: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const SummaryText = styled(Text)`
  font-size: 16px; /* Slightly larger font size */
  font-weight: bold;
  color: #337ab7; /* Ant Design's blue */
`;

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
        return <div>Error loading forecast data.</div>;
    }

    const methodNames = {
        EXPONENTIAL_SMOOTHING: "Экспоненциальное сглаживание",
        LINEAR_REGRESSION: "Линейная регрессия",
        AVERAGE: "По среднему",
    };

    const methodDescriptions = {
        LINEAR_REGRESSION: "Метод, который используется для нахождения зависимости между одной переменной (зависимой) и одной или несколькими другими переменными (независимыми). Линейная регрессия учитывает тренд — направление, в котором движется зависимая переменная со временем.",
        EXPONENTIAL_SMOOTHING: "Этот метод используется для прогнозирования временных рядов. Он придает больший вес более свежим данным, что помогает лучше учитывать изменения во времени. Сглаживание помогает уменьшить влияние случайных колебаний.",
        AVERAGE: "Простой метод, который вычисляет среднее значение набора данных и использует его для прогноза. Это подходит для случаев, когда данные не имеют явного тренда или сезонности, и считается хорошим ориентиром для будущих значений.",
    };

    const combinedChartData = Object.entries(forecastData.previousSales).reduce((acc, [date, value]) => {
        acc[date] = acc[date] || { date, value };
        return acc;
    }, {});

    forecastData.forecastResponses.forEach((response) => {
        Object.entries(response.dayForecast).forEach(([date, value]) => {
            combinedChartData[date] = combinedChartData[date] || { date };
            combinedChartData[date][response.method] = value;
        });
    });

    const combinedChartDataArray = Object.values(combinedChartData);

    const previousSalesDataArray = Object.entries(forecastData.previousSales).map(([date, value]) => ({
        date,
        value,
    }));

    const showCombinedChart = forecastData.forecastResponses.length > 1;

    return (
        <>
            <GlobalStyle />
            <Container>
                <Header />
                <StyledCard>
                    <Title level={2}>Прогноз</Title>
                    <InfoSection>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Text strong>Период прогноза:</Text> <br/>
                                <Text>С {forecastData.fromDate} по {forecastData.toDate}</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>Продолжительность прогноза:</Text> <br/>
                                <Text>{forecastData.daysNecessaryTo} дней</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>Текущее количество книг:</Text> <br/>
                                <Text>{forecastData.currentAmount}</Text>
                            </Col>
                        </Row>
                    </InfoSection>
                    <Divider />

                    {showCombinedChart && (
                        <div>
                            <Title level={4}>Общий график</Title>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={combinedChartDataArray}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    {forecastData.forecastResponses.map((response) => (
                                        <Line
                                            key={response.method}
                                            type="monotone"
                                            dataKey={response.method}
                                            stroke={"#" + Math.floor(Math.random()*16777215).toString(16)}
                                            name={methodNames[response.method]}
                                        />
                                    ))}
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="green"
                                        name="Предыдущие продажи"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                            <Divider />
                        </div>
                    )}

                    {forecastData.forecastResponses.map((response) => (
                        <div key={response.id}>
                            <Title level={4}>{methodNames[response.method]}</Title>
                            <MethodDescription>
                                <Paragraph>{methodDescriptions[response.method]}</Paragraph>
                            </MethodDescription>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={Object.entries(response.dayForecast).map(([date, value]) => ({ date, value }))}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="value" stroke="#8884d8" name={methodNames[response.method]} />
                                </LineChart>
                            </ResponsiveContainer>
                            <SummarySection>
                                <Space direction="vertical">
                                    <SummaryText strong>Итоговый прогноз: {response.summaryForecast}</SummaryText>
                                    <SummaryText strong>
                                        Итоговый округленный прогноз: {response.summaryRoundedForecast}
                                    </SummaryText>
                                </Space>
                            </SummarySection>
                            <Divider />
                        </div>
                    ))}
                </StyledCard>
            </Container>
        </>
    );
};

export default ForecastPage;