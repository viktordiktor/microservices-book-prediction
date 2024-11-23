import {GlobalStyle} from "../styles";
import {Container} from "../components/common/Container";
import {Header} from "../components/common/Header";
import React, {useState} from "react";
import styled from "styled-components";
import {BookTableList} from "../components/BookTableList";
import {BookIconList} from "../components/BookIconList";
import {ContentContainer} from "../components/common/ContentContainer";
import AddEditBookModal from "../components/modal/AddEditBookModal";
import {useQueryClient} from "@tanstack/react-query";
import {TableContainer} from "../components/common/TableContener";
import ButtonGroup from "antd/es/button/button-group";
import {AddButton} from "../components/common/AddButton";

const Button = styled.button`
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${({active}) => (active ? '#007bff' : '#6c757d')};
  color: white;
  transition: background-color 0.3s ease;
  font-family: 'Consolas', sans-serif;

  &:hover {
    background-color: ${({active}) => (active ? '#0069d9' : '#5a6268')};
  }
`;

const IconContainer = styled.div`
  width: 90%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
`;



const Books = () => {
    const [view, setView] = useState('table');
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
    const [books, setBooks] = useState([]); // Добавлено состояние для книг

    const queryClient = useQueryClient(); // Получаем queryClient

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSave = (newBook) => {
        setBooks([...books, newBook]);
        setIsModalVisible(false);
        queryClient.invalidateQueries("books"); // Инвалидируем кеш
    };

    return (
        <>
            <GlobalStyle/>
            <Container>
                <Header/>
                <ButtonGroup style={{marginTop: '20px', marginBottom: '5px'}}>
                    <Button active={view === 'table'} onClick={() => setView('table')}>
                        Таблица
                    </Button>
                    <Button active={view === 'cards'} onClick={() => setView('cards')}>
                        Карточки
                    </Button>
                    <AddButton onClick={showModal}>
                        Добавить книгу
                    </AddButton>
                </ButtonGroup>
                <ContentContainer>
                    {view === 'table' && (
                        <TableContainer>
                            <BookTableList books={books}/>
                        </TableContainer>
                    )}
                    {view === 'cards' && (
                        <IconContainer>
                            <BookIconList books={books}/>
                        </IconContainer>
                    )}
                </ContentContainer>
                <AddEditBookModal
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    onSave={handleSave}/>
            </Container>
        </>
    );
};

export default Books;