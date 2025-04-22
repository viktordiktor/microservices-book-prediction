import styled from "styled-components";
import React from "react";
import {Link, useLocation} from "react-router-dom";

const HeaderContainer = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px;
  box-shadow: 0px 2px 4px rgba(0.25, 0.25, 0.25, 0.4);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
`;

const LogoIcon = styled.div`
  width: 160px;
  height: 60px;
  margin-left: 20px;
  background-image: url('https://imgur.com/4fJSfNP.png');
  background-size: cover; 
  background-position: center; 
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const NavItem = styled.div`
  margin: 0 35px;
  cursor: pointer;
  color: ${props => props.$isActive ? '#FFD700' : 'white'};
  font-weight: bold;
  font-size: 1.3em;
  text-decoration: none;
  position: relative;
  
  &:hover {
    color: ${props => props.$isActive ? '#FFC000' : '#ddd'};
    text-decoration: ${props => props.$isActive ? 'none' : 'underline'};
  }

  ${props => props.$isActive && `
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #FFD700;
      transform: scaleX(1);
    }
  `}
`;

const VerticalDivider = styled.div`
  height: 30px;
  width: 1px;
  background-color: rgba(255, 255, 255, 0.3);
  margin: 0 10px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

export const Header = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    }

    return(
        <HeaderContainer>
            <Logo>
                <Link to="/">
                    <LogoIcon />
                </Link>
            </Logo>
            <Nav>
                <StyledLink to="/accounting">
                    <NavItem $isActive={isActive('/accounting')}>Учет</NavItem>
                </StyledLink>

                <VerticalDivider />

                <StyledLink to="/books"><NavItem $isActive={isActive('/books')}>Книги</NavItem></StyledLink>
                <StyledLink to="/sells"><NavItem $isActive={isActive('/sells')}>Продажи</NavItem></StyledLink>
                <StyledLink to="/orders"><NavItem $isActive={isActive('/orders')}>Заказы</NavItem></StyledLink>
                <StyledLink to="/forecasts"><NavItem $isActive={isActive('/forecasts')}>Прогнозы</NavItem></StyledLink>
                <StyledLink to="/about"><NavItem $isActive={isActive('/about')}>О сервисе</NavItem></StyledLink>
            </Nav>
        </HeaderContainer>
    );
}