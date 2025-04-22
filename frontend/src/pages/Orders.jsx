import styled from "styled-components";
import React, {useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {downloadExcelTemplate, uploadExcelFile} from "../queries/orders";
import {Button, message, Tooltip} from "antd";
import {GlobalStyle} from "../styles";
import {Container} from "../components/common/Container";
import {Header} from "../components/common/Header";
import {ContentContainer} from "../components/common/ContentContainer";
import {TableContainer} from "../components/common/TableContener";
import {OrderTableList} from "../components/OrderTableList";
import AddEditOrderModal from "../components/modal/AddEditOrderModal";
import {DownloadOutlined, UploadOutlined, PlusOutlined} from "@ant-design/icons";

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

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const Orders = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [orders, setOrders] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.createRef();
    const queryClient = useQueryClient();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSave = (newOrder) => {
        setOrders([...orders, newOrder]);
        setIsModalVisible(false);
        queryClient.invalidateQueries("orders");
    };

    const handleDownloadTemplate = async () => {
        try {
            const blob = await downloadExcelTemplate();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sales_template.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            message.success('Шаблон успешно скачан');
        } catch (error) {
            message.error(`Ошибка при скачивании шаблона: ${error.message}`);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const result = await uploadExcelFile(file);
            message.success(`Успешно импортировано ${result.length} записей`);
            queryClient.invalidateQueries("orders");
        } catch (error) {
            message.error(`Ошибка при импорте: ${error.message}`);
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    return (
        <>
            <GlobalStyle />
            <Container>
                <Header />
                <PageHeaderWrapper>
                    <PageHeader>
                        <PageTitle>Заказы</PageTitle>
                        <ActionButtons>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={showModal}
                            >
                                Добавить заказ
                            </Button>
                            <Button
                                type="primary"
                                icon={<UploadOutlined />}
                                loading={isUploading}
                                onClick={() => fileInputRef.current.click()}
                            >
                                Импорт Excel
                            </Button>
                            <Tooltip title="Скачать шаблон Excel">
                                <Button
                                    type="default"
                                    icon={<DownloadOutlined />}
                                    onClick={handleDownloadTemplate}
                                />
                            </Tooltip>
                            <HiddenFileInput
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept=".xlsx, .xls"
                            />
                        </ActionButtons>
                    </PageHeader>
                </PageHeaderWrapper>

                <ContentContainer>
                    <TableContainer>
                        <OrderTableList orders={orders} />
                    </TableContainer>
                </ContentContainer>

                <AddEditOrderModal
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    onSave={handleSave}
                />
            </Container>
        </>
    );
};

export default Orders;