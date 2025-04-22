import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {Typography} from "antd";
import styled from "styled-components";

const { Title } = Typography;

const ChartContainer = styled.div`
width: 550px;
height: 500px;
padding-bottom: 60px; /* Добавили padding */

@media (max-width: 768px) {
width: 100%;
margin-top: 5px;
}
`;

const SalesChart = ({ title, chartData }) => {
    return (
        <ChartContainer style={{ backgroundColor: 'white' }}>
            <Title level={5} style={{ textAlign: 'center' }}>
                {title}
            </Title>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Продажи', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" name="Продажи/дн" dataKey="value" stroke="#007bff" strokeWidth={3} dot={{ stroke: '#007bff', strokeWidth: 3 }} />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};

export default SalesChart;