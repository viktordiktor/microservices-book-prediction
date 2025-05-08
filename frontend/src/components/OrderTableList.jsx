import { useQuery, useQueryClient } from "@tanstack/react-query";
import {Button, Table, Space, Tag, message, Input} from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    CheckOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { useState } from "react";
import AddEditOrderModal from "./modal/AddEditOrderModal";
import { fetchOrders, processOrder } from "../queries/orders";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

export const OrderTableList = () => {
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['orders'],
        queryFn: () => fetchOrders(0, 100, "createdDate", "desc"), // Без пагинации
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const handleProcessOrder = async (orderId) => {
        try {
            await processOrder(orderId);
            messageApi.success('Заказ успешно обработан');
            queryClient.invalidateQueries(['orders']);
        } catch (err) {
            messageApi.error('Ошибка при обработке заказа');
            console.error(err);
        }
    };


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

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            render: (id) => id.substring(0, 8) + '...'
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
            ...getColumnSearchProps('bookTitle'),
        },
        {
            title: 'Количество',
            dataIndex: 'amount',
            key: 'amount',
            align: 'center',
            width: 100,
        },
        {
            title: 'Срок выполнения (дни)',
            dataIndex: 'orderLeadTime',
            key: 'orderLeadTime',
            align: 'center',
            width: 150,
        },
        {
            title: 'Статус',
            dataIndex: 'completed',
            key: 'completed',
            align: 'center',
            width: 120,
            render: (completed) => (
                <Tag
                    icon={completed ? <CheckOutlined /> : <ClockCircleOutlined />}
                    color={completed ? 'success' : 'warning'}
                >
                    {completed ? 'Завершён' : 'В процессе'}
                </Tag>
            ),
        },
        {
            title: 'Дата создания',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: 150,
            render: (date) => dayjs(date).format('DD.MM.YYYY'),
        },
        {
            title: 'Дата завершения',
            dataIndex: 'completeDate',
            key: 'completeDate',
            width: 150,
            render: (date) => date ? dayjs(date).format('DD.MM.YYYY') : '-',
        },
        {
            title: 'Действия',
            key: 'action',
            width: 180,
            render: (_, record) => (
                <Space size="middle">
                    {!record.completed && (
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<CheckCircleOutlined />}
                            onClick={() => handleProcessOrder(record.id)}
                            title="Обработать заказ"
                        />
                    )}
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record.id)}
                        disabled={record.completed}
                        title={record.completed ? 'Редактирование завершённых заказов запрещено' : 'Редактировать'}
                    />
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

    const handleSave = (savedOrder) => {
        queryClient.invalidateQueries(['orders']);
        setIsModalVisible(false);
        setOrderToEdit(null);
    };

    const handleEdit = (id) => {
        const order = data?.objectList?.find(o => o.id === id);
        if (order && !order.completed) {
            setOrderToEdit(order);
            setIsModalVisible(true);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setOrderToEdit(null);
    };

    const handleDelete = (id) => {
        console.log(`Удаление заказа с ID: ${id}`);
        // Здесь должна быть логика удаления
    };

    if (isLoading) return <p>Загрузка...</p>;
    if (isError) return <p>Ошибка: {error.message}</p>;

    return (
        <>
            {contextHolder}
            <Table
                columns={columns}
                dataSource={data?.objectList || []}
                rowKey="id"
                pagination={false}
                scroll={{ x: 1000 }}
            />

            <AddEditOrderModal
                visible={isModalVisible}
                onCancel={handleCancel}
                onSave={handleSave}
                order={orderToEdit}
            />
        </>
    );
};