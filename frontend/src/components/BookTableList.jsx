import {useQuery, useQueryClient} from "@tanstack/react-query";
import {Button, Pagination, Space, Table} from 'antd';
import {AreaChartOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useState} from "react";
import AddEditBookModal from "./modal/AddEditBookModal";
import {fetchBooks} from "../queries/books";
import {Link, useNavigate} from "react-router-dom";

export const BookTableList = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(8);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

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
            title: 'Автор',
            dataIndex: 'author',
            key: 'author',
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
        </>
    );
};