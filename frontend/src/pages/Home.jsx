import React from 'react';
import styled from 'styled-components';
import {motion} from 'framer-motion';
import {GlobalStyle} from "../styles";
import {Container} from "../components/common/Container";
import {Header} from "../components/common/Header";
import {useNavigate} from "react-router-dom";


const Hero = styled.section`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const HeroContent = styled.div`
  flex: 1;
  margin-left: 30px;
  padding-right: 20px;
  text-align: left;
`;

const HeroTitle = styled.h1`
  font-size: 5em;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
`;

const HeroTitleLine = styled.span`
  display: block;
  margin-bottom: 3px;
`;

const HeroSubtitle = styled.p`
  font-size: 1.5em;
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  margin-bottom: 30px;
`;

const Button = styled(motion.button)`
  background-color: #f0544f;
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 5px;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #e0443f;
  }
`;

const BookPlaceholder = styled.div`
  flex: 0 0 480px;
  height: 480px;
  background-image: url('https://imgur.com/gXa7ExB.png');
  background-size: cover, cover; // Устанавливаем размер для обоих фонов
  background-position: center, center;
  border-radius: 10px 0 10px 10px;
  border: none;
  margin-top: 30px;

  @media (max-width: 768px) {
    margin-top: 20px;
    width: 100%;
    height: auto;
  }
`;

const Home = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/forecast/create');
    };

    return (
        <>
            <GlobalStyle/>
            <Container>
                <Header/>
                <Hero>
                    <HeroContent>
                        <HeroTitle>
                            <HeroTitleLine>Средство учета и</HeroTitleLine>
                            <HeroTitleLine>прогнозирования спроса книг</HeroTitleLine>
                        </HeroTitle>
                        <HeroSubtitle>
                            Программное средство, позволяющее вести учет книг и продаж, визуализировать их,
                            а также выполнять прогнозирование спроса на основе данных за предыдущие периоды
                        </HeroSubtitle>
                        <Button onClick={handleClick}>Сделать прогноз</Button>
                    </HeroContent>
                    <BookPlaceholder/>
                </Hero>
            </Container>

        </>
    );
};

export default Home;