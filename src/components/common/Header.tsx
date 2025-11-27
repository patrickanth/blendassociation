import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  position: relative;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  z-index: 10;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 0 0 50% 50% / 0 0 20px 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  /* Responsive per dispositivi mobili */
  @media (max-width: 768px) {
    padding: 0 3%;
    height: 70px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    height: auto;
    padding: 10px 3%;
    justify-content: center;
  }
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-decoration: none;
  background: linear-gradient(45deg, #4682b4, #87ceeb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  z-index: 1;
  position: relative;
  
  @media (max-width: 480px) {
    margin-bottom: 10px;
  }
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 40px;
  z-index: 1;
  
  @media (max-width: 768px) {
    gap: 20px;
  }
  
  @media (max-width: 480px) {
    gap: 15px;
    margin: 5px 0;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  position: relative;
  padding: 5px 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: white;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
    letter-spacing: 0.5px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 3px 0;
  }
`;

interface HeaderProps {
  showLogo?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  showLogo = true
}) => {
  return (
    <HeaderContainer>
      <NavContainer>
        {showLogo && (
          <Logo to="/">Blend</Logo>
        )}
        
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/eventi">Eventi</NavLink>
          <NavLink to="/galleria">Galleria</NavLink>
        </NavLinks>
        
        <NavLinks>
          <NavLink to="/chi-siamo">Chi Siamo</NavLink>
          <NavLink to="/admin/login">Admin</NavLink>
        </NavLinks>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header;