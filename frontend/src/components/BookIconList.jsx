import {Pagination} from "antd";
import {useState} from "react";
import styled from "styled-components";
import {useQuery} from "@tanstack/react-query";
import {fetchBooks} from "../queries/books";
import {useNavigate} from "react-router-dom";

const Card = styled.div`
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  background-color: white;
  margin: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
  width: calc(20% - 20px);
  min-width: 200px;
  max-width: 250px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 8px 8px 15px rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }

  @media (max-width: 768px) {
    width: calc(33.33% - 20px);
  }
  @media (max-width: 500px) {
    width: calc(50% - 20px);
  }
  @media (max-width: 350px) {
    width: 100%;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 180px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 15px;
`;

const CardTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
`;

const CardAuthor = styled.p`
  margin-bottom: 0;
  color: #555;
  font-style: italic;
`;

const RowWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 20px;
  width: 100%;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 0 auto; 
  overflow-y: auto;
  max-height: 500px;
  padding: 20px;
  background-color: #f4f4f4;
`;

export const BookIconList = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(8);
    const navigate = useNavigate(); // Get the navigate function

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["books", pageNumber, pageSize],
        queryFn: () => fetchBooks(pageNumber, pageSize),
        keepPreviousData: true,
    });

    const handlePageChange = (page, pageSize) => {
        setPageNumber(page - 1);
        setPageSize(pageSize);
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
            <CardContainer>
                <RowWrapper>
                    {dataSource.map((book) => (
                        <Card key={book.id} onClick={() => navigate(`/books/${book.id}`)}>
                            <CardImage src={book.imageLink} alt={book.title} />
                            <CardContent>
                                <CardTitle>{book.title}</CardTitle>
                                <CardAuthor>{book.author}</CardAuthor>
                                <div>
                                    Количество: {book.amount}
                                </div>
                                <div>
                                    Цена: {book.price} руб.
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </RowWrapper>
            </CardContainer>
            <Pagination
                current={pageNumber + 1}
                pageSize={pageSize}
                total={data?.totalElements}
                onChange={handlePageChange}
                style={{ justifyContent: 'center', marginTop: '10px' }}
            />
        </>
    );
};