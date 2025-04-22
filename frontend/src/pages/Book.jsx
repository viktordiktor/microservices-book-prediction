import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from '../components/common/Container';
import { Header } from '../components/common/Header';
import { getBookById } from "../queries/books";
import { GlobalStyle } from "../styles";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { getSellByBookIdAndDates } from "../queries/sells";
import { getDates } from "../utils/utilFuncs";
import { Card, Divider, Typography, Spin, Row, Col, Statistic, Tag } from 'antd';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const { Title, Text } = Typography;

const genres = [
    { value: 'NOVEL', label: 'Роман', color: '#f50' },
    { value: 'POEMS', label: 'Стихи', color: '#2db7f5' },
    { value: 'FANTASY', label: 'Фентези', color: '#87d068' },
    { value: 'SCIENTIFIC', label: 'Научная литература', color: '#108ee9' },
    { value: 'TALE', label: 'Сказка', color: '#ff85c0' },
    { value: 'BIOGRAPHY', label: 'Биография', color: '#722ed1' },
    { value: 'OTHER', label: 'Другое', color: '#8c8c8c' },
];

const StyledCard = styled(Card)`
  margin-top: 20px;
  width: 90%;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding-bottom: 20px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #1890ff;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #1478d4;
  }
`;

const BookMainSection = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const BookImagesSection = styled.div`
  flex: 0 0 40%;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const BookInfoSection = styled.div`
  flex: 1;
`;

const CarouselContainer = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: contain;
  background: #f5f5f5;
  display: block;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.3);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s;
  color: white;

  &:hover {
    background: rgba(0, 0, 0, 0.5);
  }

  &[disabled] {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const PrevButton = styled(ArrowButton)`
  left: 15px;
`;

const NextButton = styled(ArrowButton)`
  right: 15px;
`;

const BookTitle = styled(Title)`
  margin-bottom: 20px !important;
  font-weight: 600 !important;
  color: #333 !important;
`;

const BookAuthor = styled(Text)`
  font-size: 18px;
  color: #666;
  display: block;
  margin-bottom: 20px;
`;

const BookDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const DetailItem = styled.div`
  background: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
`;

const DetailLabel = styled(Text)`
  display: block;
  color: #888;
  font-size: 14px;
`;

const DetailValue = styled(Text)`
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #333;
`;

const PriceTag = styled.div`
  background: #1890ff;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 20px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 20px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;

  &:first-child {
    background: #1890ff;
    color: white;

    &:hover {
      background: #40a9ff;
    }
  }

  &:nth-child(2) {
    background: #f5f5f5;
    color: #666;

    &:hover {
      background: #e8e8e8;
    }
  }

  &:last-child {
    background: #52c41a;
    color: white;
    flex: 1;
    min-width: 200px;

    &:hover {
      background: #73d13d;
    }
  }
`;

const ChartCard = styled(Card)`
  margin-top: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
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
            {images.length > 1 && (
                <>
                    <PrevButton onClick={prevImage}>
                        <MdNavigateBefore size={24} />
                    </PrevButton>
                    <NextButton onClick={nextImage}>
                        <MdNavigateNext size={24} />
                    </NextButton>
                </>
            )}
        </CarouselContainer>
    );
};

const BookPage = () => {
    const { bookId } = useParams();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [salesData, setSalesData] = useState([]);
    const [salesError, setSalesError] = useState(null);
    const [salesLoading, setSalesLoading] = useState(true);
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

    if (loading) return (
        <Container>
            <Header />
            <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }} />
        </Container>
    );

    if (error) return (
        <Container>
            <Header />
            <div style={{ marginTop: 20, textAlign: 'center' }}>
                Ошибка при загрузке информации о книге
            </div>
        </Container>
    );

    if (!book) return (
        <Container>
            <Header />
            <div style={{ marginTop: 20, textAlign: 'center' }}>
                Книга не найдена
            </div>
        </Container>
    );

    const allImages = [book.imageLink, ...book.additionalImagesLinks];
    const genreInfo = genres.find(genre => genre.value === book.genre) || { label: "Неизвестный жанр", color: '#8c8c8c' };
    const chartData = salesData.map(item => ({
        date: item.date,
        sales: item.amount
    }));

    return (
        <>
            <GlobalStyle />
            <Container>
                <Header />
                <StyledCard>
                    <BookMainSection>
                        <BookImagesSection>
                            <Carousel images={allImages} />
                        </BookImagesSection>

                        <BookInfoSection>
                            <BookTitle level={2}>{book.title}</BookTitle>
                            <BookAuthor>{book.author}</BookAuthor>

                            <Tag color={genreInfo.color} style={{ fontSize: 14, padding: '4px 12px' }}>
                                {genreInfo.label}
                            </Tag>

                            <PriceTag>{book.price} ₽</PriceTag>

                            <BookDetailsGrid>
                                <DetailItem>
                                    <DetailLabel>Количество страниц</DetailLabel>
                                    <DetailValue>{book.pages}</DetailValue>
                                </DetailItem>

                                <DetailItem>
                                    <DetailLabel>ISBN</DetailLabel>
                                    <DetailValue>{book.isbn}</DetailValue>
                                </DetailItem>

                                <DetailItem>
                                    <DetailLabel>Год издания</DetailLabel>
                                    <DetailValue>{book.publicationYear}</DetailValue>
                                </DetailItem>

                                <DetailItem>
                                    <DetailLabel>На складе</DetailLabel>
                                    <DetailValue>
                                        <Text strong style={{ color: book.amount > 0 ? '#52c41a' : '#f5222d' }}>
                                            {book.amount} шт.
                                        </Text>
                                    </DetailValue>
                                </DetailItem>
                            </BookDetailsGrid>

                            <ActionButtons>
                                <ActionButton>Редактировать</ActionButton>
                                <ActionButton>Удалить</ActionButton>
                                <ActionButton onClick={handleCreateForecastClick}>
                                    Сделать прогноз
                                </ActionButton>
                            </ActionButtons>
                        </BookInfoSection>
                    </BookMainSection>

                    <ChartCard>
                        <Title level={4} style={{ marginBottom: 24 }}>Продажи за последний месяц</Title>
                        {salesLoading ? (
                            <Spin size="large" style={{ display: 'flex', justifyContent: 'center', padding: 40 }} />
                        ) : salesError ? (
                            <Text type="danger">Ошибка загрузки данных о продажах</Text>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="#1890ff"
                                        strokeWidth={2}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </ChartCard>
                </StyledCard>
            </Container>
        </>
    );
};

export default BookPage;