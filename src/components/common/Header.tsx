import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeaderContainer = styled.header<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.$scrolled
    ? 'rgba(0, 0, 0, 0.95)'
    : 'transparent'};
  backdrop-filter: ${props => props.$scrolled ? 'blur(20px)' : 'none'};
  border-bottom: 1px solid ${props => props.$scrolled
    ? 'rgba(135, 206, 235, 0.08)'
    : 'transparent'};
  animation: ${fadeIn} 0.6s ease;

  @media (max-width: 768px) {
    padding: 0 4%;
    height: 60px;
  }
`;

const LogoContainer = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const LogoText = styled.span`
  font-size: 20px;
  font-weight: 300;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 18px;
    letter-spacing: 4px;
  }
`;

const LogoSubtext = styled.span`
  font-size: 8px;
  font-weight: 400;
  letter-spacing: 4px;
  text-transform: lowercase;
  color: rgba(135, 206, 235, 0.5);
  margin-top: 2px;

  @media (max-width: 768px) {
    font-size: 7px;
    letter-spacing: 3px;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 40px;

  @media (max-width: 768px) {
    gap: 20px;
  }

  @media (max-width: 480px) {
    gap: 15px;
  }
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  color: ${props => props.$active ? '#87ceeb' : 'rgba(255, 255, 255, 0.5)'};
  text-decoration: none;
  font-size: 11px;
  font-weight: ${props => props.$active ? '500' : '400'};
  letter-spacing: 2px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  position: relative;
  padding: 8px 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${props => props.$active ? '100%' : '0'};
    height: 1px;
    background: #87ceeb;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    color: #87ceeb;

    &::after {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    font-size: 10px;
    letter-spacing: 1px;
  }

  @media (max-width: 480px) {
    font-size: 9px;
  }
`;

const AdminLink = styled(NavLink)`
  color: ${props => props.$active ? 'rgba(135, 206, 235, 0.6)' : 'rgba(255, 255, 255, 0.25)'};

  &:hover {
    color: rgba(135, 206, 235, 0.6);
  }

  &::after {
    background: rgba(135, 206, 235, 0.4);
  }
`;

const Separator = styled.span`
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 5px;

  @media (max-width: 480px) {
    display: none;
  }
`;

interface HeaderProps {
  showLogo?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showLogo = true }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <HeaderContainer $scrolled={scrolled}>
      {showLogo && (
        <LogoContainer to="/">
          <LogoText>Blend</LogoText>
          <LogoSubtext>association</LogoSubtext>
        </LogoContainer>
      )}

      <Nav>
        <NavLink to="/" $active={isActive('/')}>
          Home
        </NavLink>
        <NavLink to="/eventi" $active={isActive('/eventi')}>
          Eventi
        </NavLink>
        <NavLink to="/galleria" $active={isActive('/galleria')}>
          Galleria
        </NavLink>
        <NavLink to="/label" $active={isActive('/label')}>
          Label
        </NavLink>
        <NavLink to="/merch" $active={isActive('/merch')}>
          Merch
        </NavLink>
        <NavLink to="/chi-siamo" $active={isActive('/chi-siamo')}>
          Chi Siamo
        </NavLink>
        <Separator />
        <AdminLink to="/admin/login" $active={isActive('/admin/login') || location.pathname.startsWith('/admin')}>
          Admin
        </AdminLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
