import React, {useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {GlobalStyle} from "../styles";
import {Container} from "../components/common/Container";
import {Header} from "../components/common/Header";
import {ContentContainer} from "../components/common/ContentContainer";
import {TableContainer} from "../components/common/TableContener";
import {SellTableList} from "../components/SellTableList";
import AddEditSellModal from "../components/modal/AddEditSellModal";
import ButtonGroup from "antd/es/button/button-group";
import styled from "styled-components";
import {AddButton} from "../components/common/AddButton";

const Sells = () => {
    const [view, setView] = useState('table');
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
    const [sells, setSells] = useState([]);

    const queryClient = useQueryClient(); // Получаем queryClient

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSave = (newSell) => {
        setSells([...sells, newSell]);
        setIsModalVisible(false);
        queryClient.invalidateQueries("sells"); // Инвалидируем кеш
    };

    return (
        <>
            <GlobalStyle/>
            <Container>
                <Header/>
                <ButtonGroup style={{marginTop: '20px', marginBottom: '5px'}}>
                    <AddButton onClick={showModal}>
                        Добавить продажу
                    </AddButton>
                </ButtonGroup>
                <ContentContainer>
                    <TableContainer>
                        <SellTableList sells={sells}/>
                    </TableContainer>
                </ContentContainer>
                <AddEditSellModal
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    onSave={handleSave}/>
            </Container>
        </>
    );
};

export default Sells;