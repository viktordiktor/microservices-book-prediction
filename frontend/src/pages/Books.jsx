import { GlobalStyle } from "../styles";
import { Container } from "../components/common/Container";
import { Header } from "../components/common/Header";
import React, { useState } from "react";
import styled from "styled-components";
import { BookTableList } from "../components/BookTableList";
import { BookIconList } from "../components/BookIconList";
import { ContentContainer } from "../components/common/ContentContainer";
import AddEditBookModal from "../components/modal/AddEditBookModal";
import { useQueryClient } from "@tanstack/react-query";
import { TableContainer } from "../components/common/TableContener";
import { Button, message } from "antd";
import { PlusOutlined, TableOutlined, AppstoreOutlined } from "@ant-design/icons";

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

const ViewButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-right: 20px;
`;

const Books = () => {
    const [view, setView] = useState('table');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [books, setBooks] = useState([]);
    const queryClient = useQueryClient();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSave = (newBook) => {
        setBooks([...books, newBook]);
        setIsModalVisible(false);
        queryClient.invalidateQueries("books");
    };

    return (
        <>
            <GlobalStyle/>
            <Container>
                <Header/>
                <PageHeaderWrapper>
                    <PageHeader>
                        <PageTitle>Книги</PageTitle>
                        <ViewButtons>
                            <Button
                                type={view === 'table' ? 'primary' : 'default'}
                                icon={<TableOutlined />}
                                onClick={() => setView('table')}
                            >
                                Таблица
                            </Button>
                            <Button
                                type={view === 'cards' ? 'primary' : 'default'}
                                icon={<AppstoreOutlined />}
                                onClick={() => setView('cards')}
                            >
                                Карточки
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={showModal}
                            >
                                Добавить книгу
                            </Button>
                        </ViewButtons>
                    </PageHeader>
                </PageHeaderWrapper>

                <ContentContainer>
                    {view === 'table' ? (
                        <TableContainer>
                            <BookTableList books={books}/>
                        </TableContainer>
                    ) : (
                        <BookIconList books={books}/>
                    )}
                </ContentContainer>

                <AddEditBookModal
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    onSave={handleSave}
                />
            </Container>
        </>
    );
};

export default Books;