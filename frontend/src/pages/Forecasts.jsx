import React, {useState} from "react";
import {GlobalStyle} from "../styles";
import {Container} from "../components/common/Container";
import {Header} from "../components/common/Header";
import {ContentContainer} from "../components/common/ContentContainer";
import {TableContainer} from "../components/common/TableContener";
import ButtonGroup from "antd/es/button/button-group";
import {AddButton} from "../components/common/AddButton";
import ForecastTableList from "../components/ForecastTableList";
import {useNavigate} from "react-router-dom";

const Forecasts = () => {
    const [view, setView] = useState('table');
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
    const [forecasts, setForecasts] = useState([]);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/forecast/create');
    };

    return (
        <>
            <GlobalStyle/>
            <Container>
                <Header/>
                <ButtonGroup style={{marginTop: '20px', marginBottom: '5px'}}>
                    <AddButton onClick={handleClick}>
                        Сделать прогноз
                    </AddButton>
                </ButtonGroup>
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