import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useNavigate, useParams} from 'react-router-dom'; // Импортируем useParams
import {Container} from '../components/common/Container';
import {Header} from '../components/common/Header';
import {getBookById} from "../queries/books";
import {GlobalStyle} from "../styles";
import {MdNavigateBefore, MdNavigateNext} from "react-icons/md";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {getSellByBookIdAndDates} from "../queries/sells";
import {Tooltip, Typography} from "antd";


const genres = [
    {value: 'NOVEL', label: 'Роман'},
    {value: 'POEMS', label: 'Стихи'},
    {value: 'FANTASY', label: 'Фентези'},
    {value: 'SCIENTIFIC', label: 'Научная литература'},
    {value: 'TALE', label: 'Сказка'},
    {value: 'BIOGRAPHY', label: 'Биография'},
    {value: 'OTHER', label: 'Другое'},
];
const { Title } = Typography;

const BookPageContainer = styled.section`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between; // Align content to left and right
  gap: 20px; // Adjust gap as needed
  padding: 20px;
  margin-top: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; // Reset justification for mobile
    gap: 20px;
  }
`;

const BookInfoAndImageContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 60px;
    width: calc(100% - 400px); // Уменьшите ширину для создания пространства для графика

    @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
    }
`;

const ChartContainer = styled.div`
  width: 550px;
  height: 500px;
  padding-bottom: 60px; /* Добавили padding */

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 5px;
  }
`;

const BookImages = styled.div`
  width: 40%;
  max-width: 480px;
  margin-right: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;


const CarouselContainer = styled.div`
  width: 100%;
  position: relative;
  border-radius: 10px;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%; // Make image fill container
  object-fit: contain; // Maintain aspect ratio and contain within container
  display: block;  
  border-radius: 10px;
`;


const BookInfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.2);
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  z-index: 1;
  border-radius: 50%; // Makes the button round
  opacity: 0.7;
  transition: opacity 0.3s; // Smooth transition for hover effect

  &:hover {
    opacity: 1;
  }

  &[disabled] {
    opacity: 0.2;
    cursor: default;
  }

  svg {
    fill: white;
  }
`;

const PrevButton = styled(ArrowButton)`
  left: 10px;
`;

const NextButton = styled(ArrowButton)`
  right: 10px;
`;

const Carousel = ({ images }) => {
    const [currentImage, setCurrentImage] = useState(0);

    const nextImage = () => {
        setCurrentImage((currentImage + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImage((currentImage - 1 + images.length) % images.length);
    };

    return (
        <CarouselContainer>
            <CarouselImage src={images[currentImage]} alt={`Изображение ${currentImage + 1}`} />
            <PrevButton onClick={prevImage} disabled={images.length <= 1}>
                <MdNavigateBefore size={30} />
            </PrevButton>
            <NextButton onClick={nextImage} disabled={images.length <= 1}>
                <MdNavigateNext size={30} />
            </NextButton>
        </CarouselContainer>
    );
};

const BookTitle = styled.h1`
  font-size: 3.5em;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
  margin-top: 0;
`;

const BookDetail = styled.p`
  font-size: 1.2em;
  color: white;
  margin-bottom: 10px; // Reduced margin between details
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px 20px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  background-color: #2196F3; // Modern blue color
  color: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); // Subtle shadow by default

  &:hover {
    background-color: #1976D2; // Darker blue on hover
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15); // More pronounced shadow
    transform: translateY(-2px); // Slight lift on hover
  }

  &:focus {
    outline: none;
  }

  flex: ${({ size }) => (size === 'large' ? '1 0 100%' : '1 0 calc(50% - 5px)')};
  margin-top: ${({ size, largeMargin }) => (size === 'large' && largeMargin ? '10px' : '0')};
`;

function getDates() {
    const today = new Date(); // Текущая дата

    // endDate - текущая дата в формате 'YYYY-MM-DD'
    const endDate = today.toISOString().slice(0, 10);

    // Вычисляем startDate - месяц назад от текущей даты
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    const startDateString = startDate.toISOString().slice(0, 10);


    return { startDate: startDateString, endDate };
}

const BookPage = () => {
    const { bookId } = useParams();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [salesData, setSalesData] = useState([]); // Состояние для данных о продажах
    const [salesError, setSalesError] = useState(null); // Состояние для ошибок при получении данных о продажах
    const [salesLoading, setSalesLoading] = useState(true); // Состояние загрузки данных о продажах
    const navigate = useNavigate();

    const handleCreateForecastClick = () => {
        navigate(`/forecast/create?bookId=${bookId}`);
    };

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const fetchedBook = await getBookById(bookId);
                setBook(fetchedBook);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [bookId]);

    useEffect(() => {
        const fetchSalesData = async () => {
            if (book) {
                const { startDate, endDate } = getDates();
                try {
                    const data = await getSellByBookIdAndDates(bookId, startDate, endDate);
                    setSalesData(data);
                } catch (err) {
                    setSalesError(err);
                } finally {
                    setSalesLoading(false);
                }
            }
        };

        fetchSalesData();
    }, [bookId, book]);


    if (loading) return <div>Загрузка информации о книге...</div>;
    if (error) return <div>Ошибка при загрузке информации о книге: {error.message}</div>;
    if (!book) return <div>Книга не найдена</div>;
    if (salesLoading) return <div>Загрузка данных о продажах...</div>;
    if (salesError) return <div>Ошибка при загрузке данных о продажах: {salesError.message}</div>;


    const allImages = [book.imageLink, ...book.additionalImagesLinks];
    const genreLabel = genres.find(genre => genre.value === book.genre)?.label || "Неизвестный жанр";

    // Преобразование данных для Recharts
    const chartData = salesData.map(item => ({
        name: item.date,
        value: item.amount
    }));


    return (
        <>
            <GlobalStyle />
            <Container>
                <Header />
                <BookPageContainer>
                    <BookInfoAndImageContainer> {/* Wrap book info and images */}
                        <BookImages>
                            <Carousel images={allImages} />
                        </BookImages>
                        <BookInfoContainer>
                        <BookTitle>{book.title}</BookTitle>
                        <BookDetail>Автор: {book.author}</BookDetail>
                        <BookDetail>Жанр: {genreLabel}</BookDetail>
                        <BookDetail>Количество страниц: {book.pages}</BookDetail>
                        <BookDetail>ISBN: {book.isbn}</BookDetail>
                        <BookDetail>Год издания: {book.publicationYear}</BookDetail>
                        <BookDetail>Количество на складе: {book.amount}</BookDetail>
                        <BookDetail>Цена: {book.price} руб.</BookDetail>
                        <ButtonContainer>
                            <Button>Редактировать</Button>
                            <Button>Удалить</Button>
                            <Button size="large" largeMargin onClick={handleCreateForecastClick}>Сделать прогноз</Button>
                        </ButtonContainer>
                        </BookInfoContainer>
                    </BookInfoAndImageContainer>
                    <ChartContainer style={{ backgroundColor: 'white' }}>
                        <Title level={5} style={{ textAlign: 'center'}}>
                            График продаж за последний месяц
                        </Title>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 5, bottom: 5 }}> {/* Увеличен верхний отступ */}
                                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                                <XAxis dataKey="name" />
                                <YAxis label={{ value: 'Продажи', angle: -90, position: 'insideLeft' }}/>
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" name="Продажи/дн" dataKey="value" stroke="#007bff" strokeWidth={3} dot={{ stroke: '#007bff', strokeWidth: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </BookPageContainer>
            </Container>
        </>
    );
};

export default BookPage;