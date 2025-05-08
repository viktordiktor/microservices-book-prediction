import {useQuery, useQueryClient} from "@tanstack/react-query";
import {Button, Input, Pagination, Space, Table} from 'antd';
import {DeleteOutlined, SearchOutlined} from '@ant-design/icons';
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {fetchForecasts} from "../queries/forecast";

export const ForecastTableList = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const {data, isLoading, isError, error} = useQuery({
        queryKey: ['forecast', pageNumber, pageSize],
        queryFn: () => fetchForecasts(pageNumber, pageSize),
        keepPreviousData: true,
    });

    const handlePageChange = (page, pageSize) => {
        setPageNumber(page - 1);
        setPageSize(pageSize);
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
            render: (id) => (
                <Link to={`/forecast/${id}`} onClick={(e) => {
                    e.preventDefault();
                    navigate(`/forecast/${id}`);
                }}>
                    {id}
                </Link>
            ),
        },
        {
            title: 'Название книги',
            dataIndex: 'bookTitle',
            key: 'bookTitle',
            render: (bookTitle, record) => (
                <Link
                    to={`/books/${record.bookId}`}
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(`/books/${record.bookId}`);
                    }}
                >
                    {bookTitle}
                </Link>
            ),
            ...getColumnSearchProps('bookTitle'),
        },
        {
            title: 'Страховой запас',
            dataIndex: 'roundedInsuranceStock',
            key: 'insuranceStock',
            align: 'center',
            render: (value) => `${value} шт.`
        },
        {
            title: 'Точка заказа',
            dataIndex: 'roundedOrderPoint',
            key: 'orderPoint',
            align: 'center',
            render: (value) => `${value} шт.`
        },
        {
            title: 'Оптимальная партия',
            dataIndex: 'roundedOptimalBatchSize',
            key: 'optimalBatchSize',
            align: 'center',
            render: (value) => `${value} шт.`
        },
        {
            title: 'Срок выполнения заказа',
            dataIndex: 'orderLeadTime',
            key: 'orderLeadTime',
            align: 'center',
            render: (value) => `${value} дней`
        },
        {
            title: 'Дата прогноза',
            dataIndex: 'createdDate',
            key: 'createdDate',
            align: 'center',
            render: (value) => `${value}`
        },
        {
            title: 'Действия',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        danger
                        shape="circle"
                        icon={<DeleteOutlined/>}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    const handleDelete = (id) => {
        console.log(`Deleting forecast with ID: ${id}`); // Corrected message
        // Add your actual delete logic here using `queryClient.setQueryData` or similar
    };


    if (isLoading) {
        return <p>Загрузка...</p>;
    }

    if (isError) {
        return <p>Ошибка: {error.message}</p>;
    }

    const dataSource = data?.objectList || [];

    return (
        <>
            <Table
                columns={columns}
                dataSource={dataSource}
                style={{width: '100%'}}
                pagination={false}
            />
            <Pagination
                current={pageNumber + 1}
                pageSize={pageSize}
                total={data?.totalElements}
                onChange={handlePageChange}
                style={{justifyContent: 'center', marginTop: '10px'}}
            />
        </>
    );
};

export default ForecastTableList;