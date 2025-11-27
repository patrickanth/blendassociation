import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glitch = keyframes`
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
`;

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(1px 1px at 25px 5px, white, rgba(255, 255, 255, 0)),
      radial-gradient(1px 1px at 50px 25px, white, rgba(255, 255, 255, 0)),
      radial-gradient(1px 1px at 125px 20px, white, rgba(255, 255, 255, 0));
    background-repeat: repeat;
    background-size: 350px 350px;
    opacity: 0.1;
    animation: float 20s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
`;

const LoginForm = styled.form`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.8s ease-out;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    padding: 30px 20px;
    margin: 0 10px;
  }
`;

const Title = styled.h1`
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 28px;
  font-weight: 300;
  text-align: center;
  margin-bottom: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  position: relative;

  &::after {
    content: 'ADMIN';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0.1;
    animation: ${glitch} 2s infinite;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  text-align: center;
  margin-bottom: 40px;
  letter-spacing: 1px;
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
  position: relative;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: block;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 15px;
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(70, 130, 180, 0.8);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 20px rgba(70, 130, 180, 0.3);
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  background: linear-gradient(45deg, rgba(70, 130, 180, 0.8), rgba(100, 149, 237, 0.8));
  border: 1px solid rgba(70, 130, 180, 0.5);
  border-radius: 10px;
  padding: 15px;
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(70, 130, 180, 0.4);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(220, 53, 69, 0.2);
  border: 1px solid rgba(220, 53, 69, 0.5);
  border-radius: 8px;
  padding: 12px;
  color: #ff6b6b;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  text-align: center;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.3s ease;
`;

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    try {
      clearError();
      await login(email, password);
    } catch (err) {
      // L'errore viene gestito dal context
      console.error('Errore nel login:', err);
    }
  };

  const handleInputChange = () => {
    if (error) {
      clearError();
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullscreen text="Accesso in corso..." />;
  }

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Blend</Title>
        <Subtitle>Pannello di Amministrazione</Subtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              handleInputChange();
            }}
            placeholder="admin@blend.com"
            required
            autoComplete="email"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              handleInputChange();
            }}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </FormGroup>
        
        <LoginButton type="submit" disabled={isLoading || !email || !password}>
          {isLoading ? 'Accesso...' : 'Accedi'}
        </LoginButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default AdminLogin;