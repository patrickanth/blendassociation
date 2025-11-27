import React from 'react';
import styled, { keyframes } from 'styled-components';

const glitch = keyframes`
  0% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    transform: translate(0);
  }
  2% {
    clip-path: polygon(0 10%, 100% 10%, 100% 90%, 0 90%);
    transform: translate(-2px, 0);
  }
  4% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    transform: translate(2px, 0);
  }
  6% {
    clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%);
    transform: translate(-1px, 0);
  }
  8% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    transform: translate(0);
  }
  100% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    transform: translate(0);
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const SpinnerContainer = styled.div<{ fullscreen?: boolean }>`
  ${props => props.fullscreen ? `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #000000;
    z-index: 9999;
  ` : `
    width: 100%;
    height: 100px;
  `}
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const LoadingText = styled.div`
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 4px;
  text-transform: uppercase;
  animation: ${glitch} 2s infinite, ${pulse} 2s ease-in-out infinite;
`;

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullscreen?: boolean;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  fullscreen = false, 
  text = 'LOADING'
}) => {
  return (
    <SpinnerContainer fullscreen={fullscreen}>
      <LoadingText>{text}...</LoadingText>
    </SpinnerContainer>
  );
};

export default LoadingSpinner;