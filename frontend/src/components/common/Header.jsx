import styled from "styled-components";
import React from "react";
import {Link} from "react-router-dom";

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
`;

const NavItem = styled.div`
  margin: 0 35px;
  cursor: pointer;
  color: white;
  font-weight: bold;
  font-size: 1.3em;
  text-decoration: none; /* Remove underline */

  &:hover {
    text-decoration: underline; /* Add underline on hover */
    color: #ddd; /* Optionally change color on hover */
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none; /* Remove underline */
  color: white; /* Maintain color */
  &:hover {
    text-decoration: underline; /* Add underline on hover */
    color: #ddd; /* Optional hover color change */
  }
`;

export const Header = () => {
    return(
        <HeaderContainer>
            <Logo>
                <Link to="/">
                    <LogoIcon />
                </Link>
            </Logo>
            <Nav>
                <StyledLink to="/books"><NavItem>Книги</NavItem></StyledLink>
                <StyledLink to="/sells"><NavItem>Продажи</NavItem></StyledLink>
                <StyledLink to="/forecasts"><NavItem>Прогнозы</NavItem></StyledLink>
                <StyledLink to="/about"><NavItem>О сервисе</NavItem></StyledLink>
            </Nav>
        </HeaderContainer>
    );
}