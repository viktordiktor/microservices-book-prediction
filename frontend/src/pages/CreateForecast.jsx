import React, {useState, useEffect, useRef} from "react";
import { GlobalStyle } from "../styles";
import { Container } from "../components/common/Container";
import { Header } from "../components/common/Header";
import { Select, InputNumber, Button, Form, Alert, message, Input } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { addForecast } from "../queries/forecast";
import { getSellByBookIdAndDates } from "../queries/sells"; // Импортируем ваш метод

const StyledForm = styled(Form)`
  background: white;
  padding: 20px;
  width: 60%;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  color: white;

  .ant-form-item {
    margin-bottom: 20px;
  }

  .ant-form-item-label {
    color: white;
    font-weight: bold;
  }

  .ant-input-number, .ant-input {
    width: 100%;
  }

  .ant-input-number-input {
    color: black;
  }

  .ant-btn-primary {
    background-color: #FFD700;
    color: #333;
    border-color: #FFD700;
  }

  .ant-btn-primary:hover {
    background-color: #FFD700;
    color: #333;
    border-color: #FFD700;
  }

  .ant-btn-primary[disabled] {
    background-color: #f5f5f5;
    color: rgba(0, 0, 0, 0.25);
    border-color: #d9d9d9;
  }
`;

const StyledTitle = styled.h1`
  font-size: 3.5em;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  margin-top: 60px;
`;

const CreateForecastPage = () => {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [form] = Form.useForm();
    const [loadingBooks, setLoadingBooks] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [searchParams] = useSearchParams();
    const initialBookId = searchParams.get('bookId');
    const navigate = useNavigate();
    const [hasSales, setHasSales] = useState(true);
    const [checkingSales, setCheckingSales] = useState(false);
    const notificationShown = useRef(false);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const requestBody = {
                bookId: values.book,
                insuranceDays: values.insuranceDays,
                orderLeadTime: values.orderLeadTime,
                orderPlacementCost: values.orderPlacementCost,
                storageCostPerUnit: values.storageCostPerUnit
            };

            const forecastData = await addForecast(requestBody);
            message.success('Параметры успешно сохранены!');
            navigate(`/forecast/${forecastData.id}`);
        } catch (error) {
            message.error(`Ошибка: ${error.message}`);
        }
    };

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const pageSize = 1000;
                const data = await fetchBooks(0, pageSize);
                setBooks(data.objectList);
            } catch (error) {
                setFetchError(error.message);
            } finally {
                setLoadingBooks(false);
            }
        };

        fetchAllBooks();
    }, []);

    useEffect(() => {
        if (initialBookId) {
            setSelectedBook(initialBookId);
            form.setFieldsValue({ book: initialBookId });
            checkBookSales(initialBookId);
        }
    }, [initialBookId, form]);

    const fetchBooks = async (pageNumber, pageSize) => {
        const response = await fetch(`http://localhost:8010/proxy/api/v1/books?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    };

    const checkBookSales = async (bookId) => {
        if (!bookId) return;

        setCheckingSales(true);
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);

            const formatDate = (date) => date.toISOString().split('T')[0];

            const sales = await getSellByBookIdAndDates(
                bookId,
                formatDate(startDate),
                formatDate(endDate)
            );

            const validSales = sales.filter(item => item.amount > 0);
            setHasSales(validSales.length > 0);

            // Показываем уведомление только если продаж нет и уведомление еще не показывалось
            if (validSales.length === 0 && !notificationShown.current) {
                message.warning('Эта книга не продавалась за последний месяц. Прогноз невозможен.');
                notificationShown.current = true;
            }
        } catch (error) {
            message.error(`Ошибка при проверке продаж: ${error.message}`);
            setHasSales(false);
        } finally {
            setCheckingSales(false);
        }
    };

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const pageSize = 1000;
                const data = await fetchBooks(0, pageSize);
                setBooks(data.objectList);
            } catch (error) {
                setFetchError(error.message);
            } finally {
                setLoadingBooks(false);
            }
        };

        fetchAllBooks();
    }, []);

    useEffect(() => {
        if (initialBookId) {
            setSelectedBook(initialBookId);
            form.setFieldsValue({ book: initialBookId });
            checkBookSales(initialBookId);
        }
    }, [initialBookId, form]);

    const handleBookChange = async (value) => {
        notificationShown.current = false; // Сбрасываем флаг при изменении книги
        setSelectedBook(value);
        await checkBookSales(value);
    };

    return (
        <>
            <GlobalStyle />
            <Container>
                <Header />
                <StyledTitle level={2}>Настройка параметров</StyledTitle>
                <StyledForm form={form} layout="vertical" onFinish={handleSubmit}>
                    {fetchError && (
                        <Alert message={`Ошибка при загрузке книг: ${fetchError}`} type="error" showIcon />
                    )}

                    <Form.Item
                        label="Книга"
                        name="book"
                        rules={[{ required: true, message: 'Пожалуйста, выберите книгу!' }]}
                    >
                        <Select
                            loading={loadingBooks || checkingSales}
                            placeholder="Выберите книгу"
                            onChange={handleBookChange}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {books.map((book) => (
                                <Select.Option key={book.id} value={book.id}>
                                    {book.title} (ID: {book.id})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Количество дней страховки"
                        name="insuranceDays"
                        rules={[{ required: true, message: 'Введите количество дней!' }]}
                    >
                        <InputNumber min={1} max={365} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Дни доставки"
                        name="orderLeadTime"
                        rules={[{ required: true, message: 'Введите количество дней!' }]}
                    >
                        <InputNumber min={1} max={365} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Цена размещения заказа"
                        name="orderPlacementCost"
                        rules={[{ required: true, message: 'Введите стоимость!' }]}
                    >
                        <Input type="number" step="0.01" min="0" />
                    </Form.Item>

                    <Form.Item
                        label="Цена хранения одной книги"
                        name="storageCostPerUnit"
                        rules={[{ required: true, message: 'Введите стоимость!' }]}
                    >
                        <Input type="number" step="0.01" min="0" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={!hasSales || checkingSales}
                            loading={checkingSales}
                        >
                            {hasSales ? 'Сохранить параметры' : 'Книга не продавалась за месяц'}
                        </Button>
                        {!hasSales && (
                            <Alert
                                message="Невозможно создать прогноз: книга не продавалась за последний месяц"
                                type="error"
                                showIcon
                                style={{ marginTop: '10px' }}
                            />
                        )}
                    </Form.Item>
                </StyledForm>
            </Container>
        </>
    );
};

export default CreateForecastPage;