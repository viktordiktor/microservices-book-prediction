import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Pagination, Space, Table, message } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from "react";
import { fetchSells, deleteSell } from "../queries/sells";
import { Link, useNavigate } from "react-router-dom";

export const SellTableList = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['sells', pageNumber, pageSize],
        queryFn: () => fetchSells(pageNumber, pageSize, "date", "desc"),
        keepPreviousData: true,
    });

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
            <div style={{ padding: 8 }}>
                <Input
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    size="small"
                    style={{ width: 90 }}
                >
                    Поиск
                </Button>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handlePageChange = (page, pageSize) => {
        setPageNumber(page - 1);
        setPageSize(pageSize);
    };

    const handleDelete = async (sellId) => {
        try {
            await deleteSell(sellId);
            messageApi.success('Продажа успешно удалена');
            queryClient.invalidateQueries(['sells', pageNumber, pageSize]);
        } catch (error) {
            messageApi.error(`Ошибка при удалении продажи: ${error.message}`);
            console.error('Delete error:', error);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            render: (id) => id.substring(0, 8) + '...'
        },
        {
            title: 'Количество',
            dataIndex: 'amount',
            key: 'amount',
            align: 'center',
            width: 100,
        },
        {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date',
            width: 120,
        },
        {
            title: 'Название книги',
            dataIndex: 'bookName',
            key: 'bookName',
            ...getColumnSearchProps('bookName'), // Добавляем поиск для колонки
            render: (bookName, record) => (
                <Link to={`/books/${record.bookId}`}>
                    {bookName}
                </Link>
            ),
        },
        {
            title: 'Действия',
            key: 'action',
            width: 80,
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        danger
                        shape="circle"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    if (isLoading) {
        return <p>Загрузка...</p>;
    }

    if (isError) {
        return <p>Ошибка: {error.message}</p>;
    }

    const dataSource = data?.objectList || [];

    return (
        <>
            {contextHolder}
            <Table
                columns={columns}
                dataSource={dataSource}
                style={{ width: '100%' }}
                pagination={false}
            />
            <Pagination
                current={pageNumber + 1}
                pageSize={pageSize}
                total={data?.totalElements}
                onChange={handlePageChange}
                style={{ justifyContent: 'center', marginTop: '10px' }}
                showSizeChanger={false}
            />
        </>
    );
};