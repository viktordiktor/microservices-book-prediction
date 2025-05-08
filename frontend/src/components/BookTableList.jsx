import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Modal, Pagination, Space, Table } from 'antd';
import { AreaChartOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from "react";
import AddEditBookModal from "./modal/AddEditBookModal";
import { fetchBooks } from "../queries/books";
import { Link, useNavigate } from "react-router-dom";
import { getSellByAuthorAndDates, getSellByGenreAndDates } from "../queries/sells";
import { getDates } from "../utils/utilFuncs";
import SalesChart from "./SalesChart";
import styled from "styled-components";

const ModalContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
`;

const ChartModal = styled(Modal)`
  margin-right: 350px;
  .ant-modal-content {
    width: 80vw;
    max-width: 900px;
  }
  .ant-modal-body {
    padding: 0;
  }
`;

export const BookTableList = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(7);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [chartModalVisible, setChartModalVisible] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [chartTitle, setChartTitle] = useState("");
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const handleGenreClick = async (genre) => {
        const { startDate, endDate } = getDates();
        try {
            const data = await getSellByGenreAndDates(genre, startDate, endDate);
            const formattedChartData = data.map(item => ({
                name: item.date,
                value: item.amount,
            }));
            setChartData(formattedChartData);
            setChartTitle("График продаж по жанру за последний месяц");
            setChartModalVisible(true);
        } catch (error) {
            console.error("Ошибка при загрузке данных о продажах по жанру:", error);
        }
    };

    const handleAuthorClick = async (author) => {
        const { startDate, endDate } = getDates();
        try {
            const data = await getSellByAuthorAndDates(author, startDate, endDate);
            const formattedChartData = data.map(item => ({
                name: item.date,
                value: item.amount,
            }));
            setChartData(formattedChartData);
            setChartTitle("График продаж по автору за последний месяц");
            setChartModalVisible(true);
        } catch (error) {
            console.error("Ошибка при загрузке данных о продажах по автору:", error);
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

    const genres = [
        { value: 'NOVEL', label: 'Роман' },
        { value: 'POEMS', label: 'Стихи' },
        { value: 'FANTASY', label: 'Фентези' },
        { value: 'SCIENTIFIC', label: 'Научная литература' },
        { value: 'TALE', label: 'Сказка' },
        { value: 'BIOGRAPHY', label: 'Биография' },
        { value: 'OTHER', label: 'Другое' },
    ];

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['books', pageNumber, pageSize],
        queryFn: () => fetchBooks(pageNumber, pageSize),
        keepPreviousData: true,
    });

    const handlePageChange = (page, pageSize) => {
        setPageNumber(page - 1);
        setPageSize(pageSize);
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [bookToEdit, setBookToEdit] = useState(null);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (id) => (
                <Link to={`/books/${id}`} onClick={(e) => { e.preventDefault(); navigate(`/books/${id}`); }}>
                    {id}
                </Link>
            ),
        },
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            ...getColumnSearchProps('title'),
        },
        {
            title: 'Жанр',
            dataIndex: 'genre',
            key: 'genre',
            render: (genre) => {
                const genreObj = genres.find(g => g.value === genre);
                const genreLabel = genreObj ? genreObj.label : genre;
                return (
                    <Link onClick={(e) => { e.preventDefault(); handleGenreClick(genre); }} style={{ cursor: 'pointer' }}>
                        {genreLabel}
                    </Link>
                );
            },
        },
        {
            title: 'Автор',
            dataIndex: 'author',
            key: 'author',
            render: (author) => (
                <Link onClick={(e) => { e.preventDefault(); handleAuthorClick(author); }} style={{ cursor: 'pointer' }}>
                    {author}
                </Link>
            ),
        },
        {
            title: 'Цена',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Количество',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Действия',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" shape="circle" icon={<AreaChartOutlined />}
                            onClick={() => handlePrediction(record.id)} />
                    <Button type="primary" shape="circle" icon={<EditOutlined />}
                            onClick={() => handleEdit(record.id)} />
                    <Button type="primary" danger shape="circle" icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id)} />
                </Space>
            ),
        },
    ];

    const handleSave = (savedBook) => {
        if (bookToEdit) {
            queryClient.setQueryData(['books', pageNumber, pageSize], oldData => {
                if (!oldData || !oldData.objectList) return oldData;
                const newObjectList = oldData.objectList.map(book =>
                    book.id === savedBook.id ? savedBook : book
                );
                return { ...oldData, objectList: newObjectList };
            });
        } else {
            queryClient.invalidateQueries(['books']);
        }
        setIsModalVisible(false);
        setBookToEdit(null);
    };

    const handlePrediction = (id) => {
        navigate(`/forecast/create?bookId=${id}`);
    };

    const handleEdit = (id) => {
        const bookToEdit = data?.objectList?.find(book => book.id === id);
        if (bookToEdit) {
            setIsModalVisible(true);
            setBookToEdit(bookToEdit);
        } else {
            console.error(`Книга с ID ${id} не найдена.`);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setBookToEdit(null);
    };

    const handleDelete = (id) => {
        console.log(`Deleting book with ID: ${id}`);
        // Add your delete logic here
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
                style={{ width: '100%' }}
                pagination={false}
            />
            <Pagination
                current={pageNumber + 1}
                pageSize={pageSize}
                total={data?.totalElements}
                onChange={handlePageChange}
                style={{ justifyContent: 'center', marginTop: '10px' }}
            />
            <AddEditBookModal
                visible={isModalVisible}
                onCancel={handleCancel}
                onSave={handleSave}
                book={bookToEdit}
            />
            <ChartModal
                centered
                visible={chartModalVisible}
                onCancel={() => setChartModalVisible(false)}
                footer={null}
            >
                <ModalContent>
                    <SalesChart title={chartTitle} chartData={chartData} />
                </ModalContent>
            </ChartModal>
        </>
    );
};