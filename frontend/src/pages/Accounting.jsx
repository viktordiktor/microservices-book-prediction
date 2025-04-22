import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { GlobalStyle } from "../styles";
import { Container } from "../components/common/Container";
import { Header } from "../components/common/Header";
import { ContentContainer } from "../components/common/ContentContainer";
import { TableContainer } from "../components/common/TableContener";
import { AccountingTableList } from "../components/AccountingTableList";
import AddEditSellModal from "../components/modal/AddEditSellModal";
import styled from "styled-components";
import { Button, message } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import { exportForecastsToExcel } from "../queries/books";

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

const ExportButton = styled(Button)`
  margin-right: 20px;
`;

const Accounting = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const queryClient = useQueryClient();

    const handleExportToExcel = async () => {
        try {
            setIsExporting(true);
            await exportForecastsToExcel();
            message.success('Экспорт в Excel выполнен успешно');
        } catch (error) {
            message.error(`Ошибка при экспорте: ${error.message}`);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <>
            <GlobalStyle />
            <Container>
                <Header />
                <PageHeaderWrapper>
                    <PageHeader>
                        <PageTitle>Учет</PageTitle>
                        <ExportButton
                            type="primary"
                            icon={<FileExcelOutlined />}
                            loading={isExporting}
                            onClick={handleExportToExcel}
                        >
                            Экспорт в Excel
                        </ExportButton>
                    </PageHeader>
                </PageHeaderWrapper>

                <ContentContainer>
                    <TableContainer>
                        <AccountingTableList />
                    </TableContainer>
                </ContentContainer>
            </Container>
        </>
    );
};

export default Accounting;