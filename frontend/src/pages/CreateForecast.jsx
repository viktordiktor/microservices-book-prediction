import React, { useState, useEffect } from "react";
import { GlobalStyle } from "../styles";
import { Container } from "../components/common/Container";
import { Header } from "../components/common/Header";
import {Select, Checkbox, DatePicker, InputNumber, Button, Form, Alert, message} from "antd";
import moment from "moment";
import "moment/locale/ru";
import {useNavigate, useSearchParams} from "react-router-dom";
import styled from "styled-components";
import {getSellByBookIdAndDates} from "../queries/sells";
import {addForecast} from "../queries/forecast";


moment.locale("ru");

const { Option } = Select;
const { RangePicker } = DatePicker;


const StyledForm = styled(Form)`
  background: white; /* Голубовато-сине-фиолетовый градиент */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  color: white;

  .ant-form-item { /* Target the Form.Item directly */
    margin-bottom: 20px; /* Increased spacing between items */
  }

  .ant-form-item-label {
    color: white;
    font-weight: bold; /* Make labels bolder */
  }

  .ant-form-item-control-input { /* Target the input container */
    min-height: 40px;
    display: flex;
    align-items: center;
  }

  .ant-select, .ant-input-number, .ant-date-picker { 
    width: 100%; 
  }

  .ant-form-item-control-input-content {
    color: white;
  }

  .ant-select-selection__rendered {
    color: white;
  }

  .ant-input-number-input {
    color: black;
    background-color: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.5);
  }

  .ant-btn-primary {
    background-color: #FFD700; /* Золотистый цвет для кнопки */
    color: #333;
    border-color: #FFD700;
  }

  .ant-btn-primary:hover {
    background-color: #FFD700; /* Золотистый цвет для кнопки */
    color: #333;
    border-color: #FFD700;
  }

  & > .ant-typography { //This is the key change.
    color: white;
  }
`;

const StyledTitle = styled.h1`
  font-size: 3.5em;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  margin-top: 60px;
`;

const StyledAlert = styled(Alert)`
  background-color: rgba(255, 0, 0, 0.2); /* Красный с прозрачностью для Alert */
  color: white;
  border: 1px solid rgba(255, 0, 0, 0.5);
`;


const CreateForecastPage = () => {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [forecastMethods, setForecastMethods] = useState([]);
    const [dateRange, setDateRange] = useState(null);
    const [forecastDays, setForecastDays] = useState(1);
    const [form] = Form.useForm();
    const [loadingBooks, setLoadingBooks] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [searchParams] = useSearchParams();
    const initialBookId = searchParams.get('bookId');
    const [salesData, setSalesData] = useState(null); // New state for sales data
    const [salesError, setSalesError] = useState(null); // New state for sales errors
    const navigate = useNavigate(); // Хук для навигации

    const handleSubmit = async () => {
        form.validateFields()
            .then(async (values) => {
                const { book, methods, dateRange, days } = values;
                const [startDate, endDate] = dateRange;

                const requestBody = {
                    bookId: book,
                    fromDate: startDate.format('YYYY-MM-DD'),
                    toDate: endDate.format('YYYY-MM-DD'),
                    methods: methods,
                    daysNecessaryTo: days,
                };

                try {
                    const forecastData = await addForecast(requestBody);
                    message.success('Прогноз успешно сформирован!');
                    navigate(`/forecast/${forecastData.id}`); // Перенаправление
                } catch (error) {
                    message.error(`Ошибка при создании прогноза: ${error.message}`);
                }
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };


    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const pageSize = 1000; // Достаточно большое число, чтобы получить все книги
                const data = await fetchBooks(0, pageSize);
                setBooks(data.objectList);
                console.log('data: ' + data);
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
        }
    }, [initialBookId, form]);


    const fetchBooks = async (pageNumber, pageSize) => {
        const response = await fetch(`http://localhost:8010/proxy/api/v1/books?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    };


    const handleBookChange = (value) => {
        setSelectedBook(value);
    };

    const handleMethodChange = (checkedValues) => {
        setForecastMethods(checkedValues);
    };

    const disabledDate = (current) => {
        // Can only select days before today
        return current && current >= moment().startOf('day');
    };

    const handleForecastDaysChange = (value) => {
        setForecastDays(value);
    };

    const rangeConfig = {
        rules: [{ type: 'array', required: true, message: 'Пожалуйста, выберите диапазон дат!' }],
    };

    const handleDateRangeChange = async (dates, dateStrings) => {
        setDateRange(dates);
        setSalesData(null); // Clear previous sales data
        setSalesError(null); // Clear previous sales error

        if (dates && selectedBook) {
            const startDate = dateStrings[0];
            const endDate = dateStrings[1];
            try {
                const data = await getSellByBookIdAndDates(selectedBook, startDate, endDate);
                setSalesData(data);
            } catch (error) {
                setSalesError(error.message);
            }
        }
    };

    const totalSalesDays = salesData ? salesData.filter(sale => sale.amount > 0).length : 0;

    return (
        <>
            <GlobalStyle />
            <Container>
                <Header />
                <StyledTitle level={2}>Создать прогноз</StyledTitle>
                <StyledForm form={form} layout="vertical" onFinish={handleSubmit}>
                    {fetchError && (
                        <StyledAlert message={`Ошибка при загрузке книг: ${fetchError}`} type="error" showIcon />
                    )}
                    <Form.Item label="Книга" name="book" rules={[{ required: true, message: 'Пожалуйста, выберите книгу!' }]}>
                        <Select
                            loading={loadingBooks}
                            placeholder="Выберите книгу"
                            onChange={handleBookChange}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {books.map((book) => (
                                <Option key={book.id} value={book.id}>
                                    {book.title} (ID: {book.id})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Методы прогнозирования" name="methods" rules={[{ required: true, message: 'Пожалуйста, выберите хотя бы один метод!' }]}>
                        <Checkbox.Group onChange={handleMethodChange} disabled={!salesData || totalSalesDays === 0}>
                            {totalSalesDays === 0 ? (
                                <StyledAlert message="Книга не была продана ни разу за указанный период - прогноз невозможен" type="error" showIcon />
                            ) : totalSalesDays < 7 ? (
                                <>
                                    <Checkbox value="EXPONENTIAL_SMOOTHING">Экспоненциальное сглаживание</Checkbox>
                                    <Checkbox value="AVERAGE">По среднему значению</Checkbox>
                                    <Alert message="Книга была продана менее 7 дней за указанный период - линейная регрессия слишком неточна" type="warning" showIcon />
                                </>
                            ) : (
                                <>
                                    <Checkbox value="LINEAR_REGRESSION">Линейная регрессия</Checkbox>
                                    <Checkbox value="EXPONENTIAL_SMOOTHING">Экспоненциальное сглаживание</Checkbox>
                                    <Checkbox value="AVERAGE">По среднему значению</Checkbox>
                                </>
                            )}
                        </Checkbox.Group>
                    </Form.Item>


                    <Form.Item label="Диапазон дат" name="dateRange" {...rangeConfig}>
                        <RangePicker
                            disabledDate={disabledDate}
                            format="DD.MM.YYYY"
                            onChange={handleDateRangeChange}
                        />
                    </Form.Item>

                    <Form.Item label="Количество дней для прогноза" name="days" rules={[{ required: true}]}>
                        <InputNumber min={1} max={30} defaultValue={1} onChange={handleForecastDaysChange} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Создать прогноз
                        </Button>
                    </Form.Item>
                </StyledForm>
            </Container>
        </>
    );
};

export default CreateForecastPage;