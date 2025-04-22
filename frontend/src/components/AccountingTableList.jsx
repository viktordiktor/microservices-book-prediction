import { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Table, Space, Tag, message, Tooltip } from 'antd';
import {
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    WarningOutlined,
    LineChartOutlined,
    SyncOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";
import { getOrderForecasts } from "../queries/books";
import styled from "styled-components";

// Стилизованные компоненты
const StyledTable = styled(Table)`
  .ant-table-row {
    &.warning-row {
      background-color: #fff1f0;
      
      &:hover td {
        background-color: #ffccc7 !important;
      }
    }
    
    &.alert-row {
      background-color: #fff7e6;
      
      &:hover td {
        background-color: #ffe7ba !important;
      }
    }
    
    &.success-row {
      background-color: #f6ffed;
      
      &:hover td {
        background-color: #d9f7be !important;
      }
    }
  }

  .ant-pagination {
    margin: 16px 0;
    padding: 0 16px;
  }
`;

export const AccountingTableList = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 7; // Фиксированный размер страницы

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['orderForecasts', currentPage],
        queryFn: () => getOrderForecasts(currentPage - 1, pageSize, "id", "asc"),
    });

    const getRowClassName = (record) => {
        if (!record.isForecastCreated) return 'warning-row';
        if (record.isOrderRequired) return 'alert-row';
        return 'success-row';
    };

    const getStatusTag = (record) => {
        if (!record.isForecastCreated) {
            return {
                icon: <WarningOutlined />,
                color: 'red',
                text: 'Прогноз не создан',
            };
        }
        if (record.isOrderRequired) {
            return {
                icon: <ExclamationCircleOutlined />,
                color: 'orange',
                text: 'Требуется заказ',
            };
        }
        return {
            icon: <CheckCircleOutlined />,
            color: 'green',
            text: 'Заказ не требуется',
        };
    };

    const handleCreateForecast = (bookId) => {
        navigate(`/forecast/create?bookId=${bookId}`);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const columns = [
        {
            title: 'Статус',
            key: 'status',
            width: 80,
            align: 'center',
            render: (_, record) => {
                const status = getStatusTag(record);
                return (
                    <Tooltip title={status.text}>
                        <Tag icon={status.icon} color={status.color} />
                    </Tooltip>
                );
            },
        },
        {
            title: 'Название книги',
            dataIndex: 'bookTitle',
            key: 'bookTitle',
            render: (bookTitle, record) => (
                <Link to={`/books/${record.bookId}`}>
                    {bookTitle}
                </Link>
            ),
        },
        {
            title: 'Прогноз',
            key: 'forecast',
            render: (_, record) => {
                if (!record.isForecastCreated) {
                    return <Tag color="error">Прогноз не создан</Tag>;
                }
                return (
                    <Link to={`/forecast/${record.forecastId}`}>
                        <Tag color="processing">Просмотр прогноза</Tag>
                    </Link>
                );
            },
        },
        {
            title: 'Текущий остаток',
            dataIndex: 'currentAmount',
            key: 'currentAmount',
            align: 'center',
            width: 120,
            render: (amount) => amount ?? '-',
        },
        {
            title: 'Точка заказа',
            dataIndex: 'roundedOrderPoint',
            key: 'roundedOrderPoint',
            align: 'center',
            width: 120,
            render: (point) => point ?? '-',
        },
        {
            title: 'Оптимальная партия (EOQ)',
            dataIndex: 'roundedOptimalBatchSize',
            key: 'roundedOptimalBatchSize',
            align: 'center',
            width: 180,
            render: (size) => size ?? '-',
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title={record.isForecastCreated ? "Обновить прогноз" : "Создать прогноз"}>
                        <Button
                            type="primary"
                            shape="circle"
                            icon={record.isForecastCreated ? <SyncOutlined /> : <LineChartOutlined />}
                            onClick={() => handleCreateForecast(record.bookId)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    if (isLoading) return <p>Загрузка...</p>;
    if (isError) return <p>Ошибка: {error.message}</p>;

    return (
        <>
            {contextHolder}
            <StyledTable
                columns={columns}
                dataSource={data?.objectList || []}
                rowKey="id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: data?.totalElements || 0,
                    onChange: handlePageChange,
                    showSizeChanger: false, // Скрываем выбор размера страницы
                    position: ['bottomCenter'], // Размещаем пагинацию внизу по центру
                }}
                scroll={{ x: 1100 }}
                rowClassName={getRowClassName}
            />
        </>
    );
};