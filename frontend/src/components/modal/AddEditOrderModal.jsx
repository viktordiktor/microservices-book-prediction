import React, { useEffect, useState } from 'react';
import { Button, Form, InputNumber, message, Select } from 'antd';
import { StyledModal } from "./StyledModal";
import { addOrder, updateOrder } from "../../queries/orders";
import { fetchBooks } from "../../queries/books";
import { Option } from "antd/es/mentions";

const AddEditOrderModal = ({ visible, onCancel, order, onSave }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const data = await fetchBooks(0, 100);
                setBooks(data.objectList);
            } catch (error) {
                message.error(`Ошибка при загрузке списка книг: ${error.message}`);
                console.error("Error fetching books:", error);
            }
        };

        fetchBookData();
    }, []);

    useEffect(() => {
        if (order) {
            form.setFieldsValue({
                bookId: order.bookId,
                amount: order.amount,
                orderLeadTime: order.orderLeadTime
            });
        } else {
            form.resetFields();
        }
    }, [order, form]);

    const onFinish = async (values) => {
        setIsLoading(true);
        setError(null);
        try {
            let data;
            if (!order) {
                data = await addOrder(values);
            } else {
                data = await updateOrder({ ...values, id: order.id });
            }

            if (data) {
                onSave(data);
                onCancel();
            }
        } catch (error) {
            message.error(`Произошла ошибка: ${error.message}`);
            console.error("Error:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelModal = () => {
        if (!order) {
            form.resetFields();
        }
        onCancel();
    };

    return (
        <StyledModal
            title={order ? "Редактировать заказ" : "Добавить заказ"}
            visible={visible}
            onCancel={handleCancelModal}
            footer={[
                <Button key="back" onClick={handleCancelModal}>Отмена</Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isLoading}
                    form="add-edit-order-form"
                    htmlType="submit"
                >
                    Сохранить
                </Button>,
            ]}
            width={700}
        >
            <Form
                form={form}
                name="add-edit-order-form"
                id="add-edit-order-form"
                onFinish={onFinish}
                initialValues={order || {}}
            >
                <Form.Item
                    name="bookId"
                    label="Книга"
                    rules={[{ required: true, message: 'Пожалуйста, выберите книгу!' }]}
                >
                    <Select
                        showSearch
                        placeholder="Выберите книгу"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {books.map(book => (
                            <Option key={book.id} value={book.id}>
                                {book.title} ({book.id.substring(0, 8)}...)
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="amount"
                    label="Количество"
                    rules={[
                        { required: true, message: 'Пожалуйста, укажите количество!' },
                        { type: 'number', min: 1, message: 'Количество должно быть больше 0' },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="orderLeadTime"
                    label="Срок выполнения (дни)"
                    rules={[
                        { required: true, message: 'Пожалуйста, укажите срок выполнения!' },
                        { type: 'number', min: 1, message: 'Срок должен быть больше 0 дней' },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </StyledModal>
    );
};

export default AddEditOrderModal;