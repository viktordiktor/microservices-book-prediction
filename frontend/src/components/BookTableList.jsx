import {useQuery, useQueryClient} from "@tanstack/react-query";
import {Button, Modal, Pagination, Space, Table} from 'antd';
import {AreaChartOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useState} from "react";
import AddEditBookModal from "./modal/AddEditBookModal";
import {fetchBooks} from "../queries/books";
import {Link, useNavigate} from "react-router-dom";
import {getSellByAuthorAndDates, getSellByGenreAndDates} from "../queries/sells";
import {getDates} from "../utils/utilFuncs";
import SalesChart from "./SalesChart";
import styled from "styled-components";

const ModalContent = styled.div`
  display: flex;
  justify-content: center;  /* Центруем содержимое по горизонтали */
  align-items: center;  /* Центруем содержимое по вертикали */
  width: 100%;  /* Занимаем всю ширину */
  padding: 20px;  /* Добавляем отступы */
  box-sizing: border-box;  /* Учитываем отступы в ширине */
`;

const ChartModal = styled(Modal)`
    margin-right: 350px;
  .ant-modal-content {
    width: 80vw;  /* Ширина модального окна */
    max-width: 900px;  /* Максимальная ширина */
  }
  .ant-modal-body {
    padding: 0;  /* Убираем внутренние отступы */
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

    const handleGenreClick = async (genre) => {
        const { startDate, endDate } = getDates();
        try {
            const data = await getSellByGenreAndDates(genre, startDate, endDate);
            const formattedChartData = data.map(item => ({ // Format data for SalesChart
                name: item.date,
                value: item.amount,
            }));
            setChartData(formattedChartData);  // Set the formatted data
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
            const formattedChartData = data.map(item => ({ // Format data for SalesChart
                name: item.date,
                value: item.amount,
            }));
            setChartData(formattedChartData);  // Set the formatted data
            setChartTitle("График продаж по автору за последний месяц");
            setChartModalVisible(true);
        } catch (error) {
            console.error("Ошибка при загрузке данных о продажах по автору:", error);
        }
    };

    const genres = [
        {value: 'NOVEL', label: 'Роман'},
        {value: 'POEMS', label: 'Стихи'},
        {value: 'FANTASY', label: 'Фентези'},
        {value: 'SCIENTIFIC', label: 'Научная литература'},
        {value: 'TALE', label: 'Сказка'},
        {value: 'BIOGRAPHY', label: 'Биография'},
        {value: 'OTHER', label: 'Другое'},
    ];

    const {data, isLoading, isError, error} = useQuery({
        queryKey: ['books', pageNumber, pageSize],
        queryFn: () => fetchBooks(pageNumber, pageSize),
        keepPreviousData: true,
    });

    const handlePageChange = (page, pageSize) => {
        setPageNumber(page - 1);
        setPageSize(pageSize);
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [bookToEdit, setBookToEdit] = useState(null); // Состояние для книги, которую нужно редактировать

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (id) => ( // Custom render function for the ID column
                <Link to={`/books/${id}`} onClick={(e) => {e.preventDefault(); navigate(`/books/${id}`)}}> {/* Add Link and onClick handler */}
                    {id}
                </Link>
            ),
        },
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
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
                    <Button type="primary" shape="circle" icon={<AreaChartOutlined/>}
                            onClick={() => handlePrediction(record.id)}/>
                    <Button type="primary" shape="circle" icon={<EditOutlined/>} onClick={() => handleEdit(record.id)}/>
                    <Button type="primary" danger shape="circle" icon={<DeleteOutlined/>}
                            onClick={() => handleDelete(record.id)}/>
                </Space>
            ),
        },
    ];

    const handleSave = (savedBook) => {
        if (bookToEdit) { // Editing existing book
            queryClient.setQueryData(['books', pageNumber, pageSize], oldData => {
                if (!oldData || !oldData.objectList) return oldData;
                const newObjectList = oldData.objectList.map(book =>
                    book.id === savedBook.id ? savedBook : book
                );
                return { ...oldData, objectList: newObjectList };
            });
        } else { // Adding new book - less critical to update immediately
            queryClient.invalidateQueries(['books']); // Refetch the list later
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
            <AddEditBookModal visible={isModalVisible} onCancel={handleCancel}  onSave={handleSave}
                              book={bookToEdit}/>
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