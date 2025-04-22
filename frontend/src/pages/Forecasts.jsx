import React, { useState } from "react";
import { GlobalStyle } from "../styles";
import { Container } from "../components/common/Container";
import { Header } from "../components/common/Header";
import { ContentContainer } from "../components/common/ContentContainer";
import { TableContainer } from "../components/common/TableContener";
import { Button } from "antd";
import ForecastTableList from "../components/ForecastTableList";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PlusOutlined } from "@ant-design/icons";

const PageHeaderWrapper = styled.div`
  width: 100%;
  padding: 0 20px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 15px;
  max-width: 1200px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;

const PageTitle = styled.h1`
  font-size: 40px;
  font-weight: 600;
  color: white;
  margin: 0;
  padding: 0;
`;

const Forecasts = () => {
    const [forecasts, setForecasts] = useState([]);
    const navigate = useNavigate();

    const handleCreateForecast = () => {
        navigate('/forecast/create');
    };

    return (
        <>
            <GlobalStyle/>
            <Container>
                <Header/>
                <PageHeaderWrapper>
                    <PageHeader>
                        <PageTitle>Прогнозы</PageTitle>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleCreateForecast}
                        >
                            Сделать прогноз
                        </Button>
                    </PageHeader>
                </PageHeaderWrapper>

                <ContentContainer>
                    <TableContainer>
                        <ForecastTableList forecasts={forecasts}/>
                    </TableContainer>
                </ContentContainer>
            </Container>
        </>
    );
};

export default Forecasts;