import {useQuery, useQueryClient} from "@tanstack/react-query";
import {Button, Pagination, Space, Table} from 'antd';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useState} from "react";
import AddEditSellModal from "./modal/AddEditSellModal";
import {fetchSells} from "../queries/sells";
import {Link, useNavigate} from "react-router-dom";

export const SellTableList = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {data, isLoading, isError, error} = useQuery({
        queryKey: ['sells', pageNumber, pageSize],
        queryFn: () => fetchSells(pageNumber, pageSize),
        keepPreviousData: true,
    });

    const handlePageChange = (page, pageSize) => {
        setPageNumber(page - 1);
        setPageSize(pageSize);
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [sellToEdit, setSellToEdit] = useState(null);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Количество',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'ID книги',
            dataIndex: 'bookId',
            key: 'bookId',
            render: (bookId) => ( // Custom render function for the ID column
                <Link to={`/books/${bookId}`} onClick={(e) => {e.preventDefault(); navigate(`/books/${bookId}`)}}> {/* Add Link and onClick handler */}
                    {bookId}
                </Link>
            ),
        },
        {
            title: 'Действия',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" shape="circle" icon={<EditOutlined/>} onClick={() => handleEdit(record.id)}/>
                    <Button type="primary" danger shape="circle" icon={<DeleteOutlined/>}
                            onClick={() => handleDelete(record.id)}/>
                </Space>
            ),
        },
    ];

    const handleSave = (savedSell) => {
        if (sellToEdit) {
            queryClient.setQueryData(['sells', pageNumber, pageSize], oldData => {
                if (!oldData || !oldData.objectList) return oldData;
                const newObjectList = oldData.objectList.map(sell =>
                    sell.id === savedSell.id ? savedSell : sell
                );
                return {...oldData, objectList: newObjectList};
            });
        } else {
            queryClient.invalidateQueries(['sells']);
        }
        setIsModalVisible(false);
        setSellToEdit(null);
    };

    const handleEdit = (id) => {
        const sellToEdit = data?.objectList?.find(sell => sell.id === id);
        if (sellToEdit) {
            setIsModalVisible(true);
            setSellToEdit(sellToEdit);
        } else {
            console.error(`Продажа с ID ${id} не найдена.`);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSellToEdit(null);
    };

    const handleDelete = (id) => {
        console.log(`Deleting sell with ID: ${id}`);
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
            <AddEditSellModal visible={isModalVisible} onCancel={handleCancel} onSave={handleSave}
                              sell={sellToEdit}/>
        </>
    );
};