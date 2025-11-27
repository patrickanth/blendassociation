import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

const orbit = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(135, 206, 235, 0.2),
                0 0 40px rgba(135, 206, 235, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(135, 206, 235, 0.4),
                0 0 60px rgba(135, 206, 235, 0.2);
  }
`;

const letterReveal = keyframes`
  0% {
    opacity: 0;
    transform: translateY(5px);
  }
  50% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0.5;
    transform: translateY(-2px);
  }
`;

const SpinnerContainer = styled.div<{ $fullscreen?: boolean }>`
  ${props => props.$fullscreen ? `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #000000;
    z-index: 9999;
  ` : `
    width: 100%;
    min-height: 300px;
  `}
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  animation: ${fadeIn} 0.5s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.3), transparent);
    animation: ${scanline} 4s linear infinite;
    pointer-events: none;
  }
`;

const OrbitalSystem = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 40px;
`;

const OrbitRing = styled.div<{ $size: number; $duration: number; $delay: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  margin-top: ${props => -props.$size / 2}px;
  margin-left: ${props => -props.$size / 2}px;
  border: 1px solid rgba(135, 206, 235, 0.15);
  border-radius: 50%;
  animation: ${orbit} ${props => props.$duration}s linear infinite;
  animation-delay: ${props => props.$delay}s;

  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: 50%;
    width: 6px;
    height: 6px;
    margin-left: -3px;
    background: rgba(135, 206, 235, 0.8);
    border-radius: 50%;
    animation: ${glowPulse} 2s ease-in-out infinite;
  }
`;

const CenterDot = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  background: rgba(135, 206, 235, 0.9);
  border-radius: 50%;
  animation: ${pulse} 2s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(135, 206, 235, 0.5),
              0 0 40px rgba(135, 206, 235, 0.3);
`;

const LoadingTextContainer = styled.div`
  display: flex;
  gap: 3px;
  margin-bottom: 20px;
`;

const LoadingLetter = styled.span<{ $index: number }>`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
  animation: ${letterReveal} 1.5s ease-in-out infinite;
  animation-delay: ${props => props.$index * 0.1}s;
`;

const SubText = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(135, 206, 235, 0.4);
  animation: ${pulse} 3s ease-in-out infinite;
`;

const BackgroundGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(135, 206, 235, 0.05) 0%, transparent 70%);
  pointer-events: none;
  animation: ${pulse} 4s ease-in-out infinite;
`;

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullscreen?: boolean;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullscreen = false,
  text = 'BLEND'
}) => {
  return (
    <SpinnerContainer $fullscreen={fullscreen}>
      <BackgroundGlow />

      <OrbitalSystem>
        <OrbitRing $size={100} $duration={4} $delay={0} />
        <OrbitRing $size={70} $duration={3} $delay={0.5} />
        <OrbitRing $size={40} $duration={2} $delay={1} />
        <CenterDot />
      </OrbitalSystem>

      <LoadingTextContainer>
        {text.split('').map((letter, index) => (
          <LoadingLetter key={index} $index={index}>
            {letter}
          </LoadingLetter>
        ))}
      </LoadingTextContainer>

      <SubText>loading</SubText>
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
