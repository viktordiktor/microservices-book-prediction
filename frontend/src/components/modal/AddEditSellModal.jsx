import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Form, InputNumber, message, Select} from 'antd';
import {StyledModal} from "./StyledModal";
import {addSell, updateSell} from "../../queries/sells";
import dayjs from 'dayjs';
import {fetchBooks} from "../../queries/books";
import {Option} from "antd/es/mentions";

const AddEditSellModal = ({visible, onCancel, sell, onSave}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const data = await fetchBooks(0, 100);
                console.log('DATA: ', data);
                setBooks(data.objectList)
            } catch (error) {
                message.error(`Ошибка при загрузке списка книг: ${error.message}`);
                console.error("Error fetching books:", error);
            }
        };

        fetchBookData();
    }, []);


    useEffect(() => {
        if (sell) {
            form.setFieldsValue({
                ...sell,
                date: dayjs(sell.date),
                bookId: sell.bookId // Assuming sell object has bookId property
            });
        } else {
            form.resetFields();
        }
    }, [sell, form]);

    const onFinish = async (values) => {
        setIsLoading(true);
        setError(null);
        try {
            const formattedValues = {...values, date: dayjs(values.date).format('YYYY-MM-DD')};

            let data;
            if (!sell) {
                data = await addSell(formattedValues);
            } else {
                data = await updateSell({...formattedValues, id: sell.id}); // Include sell.id
            }

            if (data) {
                onSave(data);
                onCancel();
            }
        } catch (error) {
            message.error(`Произошла ошибка: ${error.message}`);
            console.error("Error:", error);
            setError(error.message); // Set error for display
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelModal = () => {
        if (!sell) {
            form.resetFields();
        }
        onCancel();
    };


    return (
        <StyledModal
            title={sell ? "Редактировать продажу" : "Добавить продажу"}
            visible={visible}
            onCancel={handleCancelModal}
            footer={[
                <Button key="back" onClick={handleCancelModal}>Отмена</Button>,
                <Button key="submit" type="primary" loading={isLoading} form="add-edit-sell-form"
                        htmlType="submit">Сохранить</Button>,
            ]}
            width={700}
        >
            <Form
                form={form}
                name="add-edit-sell-form"
                id="add-edit-sell-form"
                onFinish={onFinish}
                initialValues={sell ? {...sell, date: dayjs(sell.date)} : {}}
            >
                <Form.Item
                    name="amount"
                    label="Количество"
                    rules={[
                        {required: true, message: 'Пожалуйста, укажите количество!'},
                        {type: 'number', min: 1, message: 'Количество должно быть больше 0'},
                    ]}
                >
                    <InputNumber style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item
                    name="date"
                    label="Дата"
                    rules={[
                        {required: true, message: 'Пожалуйста, укажите дату!'},
                        {
                            validator(_, value) {
                                if (!value || dayjs(value).isValid()) { // Check if value exists and is a valid moment object
                                    if (value && dayjs(value).isAfter(dayjs())) {
                                        return Promise.reject(new Error('Дата не может быть в будущем'));
                                    }
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Пожалуйста, укажите корректную дату!'));
                            },
                        },
                    ]}
                >
                    <DatePicker style={{width: '100%'}} format="YYYY-MM-DD"/>
                </Form.Item>
                <Form.Item
                    name="bookId"
                    label="Книга"
                    rules={[{required: true, message: 'Пожалуйста, выберите книгу!'}]}
                >
                    <Select
                        showSearch
                        placeholder="Выберите книгу"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {books.map(book => (
                            <Option key={book.id} value={book.id}>
                                {book.title} ({book.id})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </StyledModal>
    )
        ;
};

export default AddEditSellModal;