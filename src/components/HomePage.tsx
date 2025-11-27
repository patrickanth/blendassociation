import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import blendLogo from '../assets/logowbig.png';

// ============================================================================
// KEYFRAMES
// ============================================================================

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

const subtleGlow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(135, 206, 235, 0.3))
            drop-shadow(0 0 40px rgba(70, 130, 180, 0.2));
  }
  50% {
    filter: drop-shadow(0 0 30px rgba(135, 206, 235, 0.5))
            drop-shadow(0 0 60px rgba(70, 130, 180, 0.3));
  }
`;

const glitchFlicker = keyframes`
  0%, 100% { opacity: 1; transform: translate(0); }
  92% { opacity: 1; transform: translate(0); }
  93% { opacity: 0.8; transform: translate(-2px, 1px); }
  94% { opacity: 1; transform: translate(2px, -1px); }
  95% { opacity: 0.9; transform: translate(-1px, 2px); }
  96% { opacity: 1; transform: translate(0); }
`;

const textReveal = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
    filter: blur(4px);
  }
  60% {
    opacity: 1;
    filter: blur(0);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(135, 206, 235, 0.3),
                0 0 10px rgba(135, 206, 235, 0.2);
  }
  50% {
    box-shadow: 0 0 10px rgba(135, 206, 235, 0.5),
                0 0 20px rgba(135, 206, 235, 0.3);
  }
`;

const igniteGlow = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const planetOrbit = keyframes`
  0% { transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg); }
`;

const celestialDrift = keyframes`
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.15;
  }
  33% {
    transform: translate(10px, -15px) scale(1.02);
    opacity: 0.2;
  }
  66% {
    transform: translate(-5px, 10px) scale(0.98);
    opacity: 0.12;
  }
`;

const atmosphereGlow = keyframes`
  0%, 100% {
    box-shadow:
      inset -20px -20px 40px rgba(0, 0, 0, 0.6),
      inset 10px 10px 30px rgba(135, 206, 235, 0.1),
      0 0 60px rgba(135, 206, 235, 0.05);
  }
  50% {
    box-shadow:
      inset -20px -20px 40px rgba(0, 0, 0, 0.5),
      inset 10px 10px 30px rgba(135, 206, 235, 0.15),
      0 0 80px rgba(135, 206, 235, 0.08);
  }
`;

const lineGlow = keyframes`
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.3; }
`;

const floatText = keyframes`
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.06;
  }
  25% {
    transform: translateY(-10px) translateX(5px);
    opacity: 0.1;
  }
  50% {
    transform: translateY(-5px) translateX(-5px);
    opacity: 0.08;
  }
  75% {
    transform: translateY(-15px) translateX(3px);
    opacity: 0.12;
  }
`;

const scanlineMove = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

// ============================================================================
// STYLED COMPONENTS - Layout
// ============================================================================

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #000000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

// Scanline effect
const Scanline = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.2), transparent);
  animation: ${scanlineMove} 6s linear infinite;
  pointer-events: none;
  z-index: 100;
`;

// Particle field
const ParticleField = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.5;
  background-image:
    radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 60% 20%, rgba(255,255,255,0.7), transparent),
    radial-gradient(1.5px 1.5px at 80% 50%, rgba(255,255,255,0.5), transparent),
    radial-gradient(1px 1px at 10% 80%, rgba(255,255,255,0.6), transparent),
    radial-gradient(1.5px 1.5px at 90% 10%, rgba(255,255,255,0.4), transparent),
    radial-gradient(1px 1px at 50% 50%, rgba(135,206,235,0.3), transparent),
    radial-gradient(1px 1px at 70% 80%, rgba(135,206,235,0.2), transparent);
  background-size: 250px 250px;
  animation: ${fadeIn} 2s ease-out;
`;

// Elegant grid lines
const GridLines = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(135, 206, 235, 0.1) 20%,
      rgba(135, 206, 235, 0.2) 50%,
      rgba(135, 206, 235, 0.1) 80%,
      transparent 100%
    );
    animation: ${lineGlow} 4s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 1px;
    height: 100%;
    background: linear-gradient(180deg,
      transparent 0%,
      rgba(135, 206, 235, 0.1) 30%,
      rgba(135, 206, 235, 0.15) 50%,
      rgba(135, 206, 235, 0.1) 70%,
      transparent 100%
    );
    animation: ${lineGlow} 5s ease-in-out infinite;
    animation-delay: 1s;
  }
`;

// Diagonal lines
const DiagonalLines = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0.5;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -50%;
    width: 200%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.1), transparent);
    transform: rotate(25deg);
    transform-origin: center;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 30%;
    right: -50%;
    width: 200%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.08), transparent);
    transform: rotate(-15deg);
    transform-origin: center;
  }
`;

// Floating ambient text
const AmbientText = styled.div<{ $top: string; $left: string; $delay: number; $size: number }>`
  position: absolute;
  top: ${props => props.$top};
  left: ${props => props.$left};
  font-family: 'Montserrat', sans-serif;
  font-size: ${props => props.$size}px;
  font-weight: 200;
  letter-spacing: 8px;
  text-transform: uppercase;
  color: rgba(135, 206, 235, 0.08);
  white-space: nowrap;
  z-index: 2;
  pointer-events: none;
  animation: ${floatText} ${props => 15 + props.$delay}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  user-select: none;

  @media (max-width: 768px) {
    font-size: ${props => props.$size * 0.6}px;
    letter-spacing: 4px;
  }
`;

// Celestial Bodies
const CelestialContainer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  overflow: hidden;
`;

// Main large planet - elegant gas giant style
const GasGiant = styled.div<{ $size: number; $top: string; $left: string; $hue: number }>`
  position: absolute;
  top: ${props => props.$top};
  left: ${props => props.$left};
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border-radius: 50%;
  background:
    radial-gradient(
      ellipse 80% 50% at 30% 20%,
      hsla(${props => props.$hue}, 30%, 40%, 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 35% 35%,
      hsla(${props => props.$hue}, 25%, 25%, 0.3) 0%,
      hsla(${props => props.$hue}, 20%, 15%, 0.2) 40%,
      hsla(${props => props.$hue}, 15%, 8%, 0.15) 70%,
      transparent 100%
    );
  animation: ${celestialDrift} ${props => 25 + props.$size / 5}s ease-in-out infinite;
  animation-delay: ${props => props.$hue / 30}s;

  &::before {
    content: '';
    position: absolute;
    inset: 5%;
    border-radius: 50%;
    background:
      linear-gradient(
        135deg,
        transparent 0%,
        hsla(${props => props.$hue}, 40%, 60%, 0.03) 40%,
        transparent 60%
      );
    animation: ${atmosphereGlow} ${props => 8 + props.$size / 20}s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    inset: -5%;
    border-radius: 50%;
    background: radial-gradient(
      circle at 30% 30%,
      hsla(${props => props.$hue}, 50%, 70%, 0.04) 0%,
      transparent 50%
    );
  }
`;

// Small distant moons
const CelestialMoon = styled.div<{ $size: number; $top: string; $right: string; $hue: number }>`
  position: absolute;
  top: ${props => props.$top};
  right: ${props => props.$right};
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 40% 40%,
    hsla(${props => props.$hue}, 20%, 50%, 0.2) 0%,
    hsla(${props => props.$hue}, 15%, 20%, 0.1) 60%,
    transparent 100%
  );
  box-shadow:
    inset -3px -3px 8px rgba(0, 0, 0, 0.4),
    0 0 ${props => props.$size * 0.5}px hsla(${props => props.$hue}, 30%, 50%, 0.05);
  animation: ${celestialDrift} ${props => 18 + props.$size}s ease-in-out infinite;
  animation-delay: ${props => props.$hue / 20}s;
`;

// Orbiting particle
const OrbitingParticle = styled.div<{ $orbitRadius: number; $size: number; $duration: number; $hue: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  margin: ${props => -props.$size / 2}px;
  --orbit-radius: ${props => props.$orbitRadius}px;
  animation: ${planetOrbit} ${props => props.$duration}s linear infinite;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(
      circle at 40% 40%,
      hsla(${props => props.$hue}, 50%, 70%, 0.6) 0%,
      hsla(${props => props.$hue}, 40%, 40%, 0.3) 50%,
      transparent 100%
    );
    box-shadow: 0 0 ${props => props.$size * 2}px hsla(${props => props.$hue}, 50%, 60%, 0.15);
  }
`;

// Subtle orbit rings
const SubtleOrbitRing = styled.div<{ $size: number; $opacity: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  margin: ${props => -props.$size / 2}px;
  border: 1px solid rgba(135, 206, 235, ${props => props.$opacity});
  border-radius: 50%;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(circle, transparent 60%, rgba(135, 206, 235, 0.01) 100%);
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 20px 40px;
  position: relative;
  z-index: 10;
`;

// ============================================================================
// STYLED COMPONENTS - Title
// ============================================================================

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const AnimatedLetter = styled.span<{ $delay: number }>`
  display: inline-block;
  font-family: 'Montserrat', sans-serif;
  font-weight: 200;
  font-size: clamp(1.2rem, 4vw, 2rem);
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.4em;
  text-transform: uppercase;
  opacity: 0;
  animation: ${textReveal} 0.8s ease-out forwards;
  animation-delay: ${props => props.$delay}s;

  &:hover {
    animation: ${glitchFlicker} 0.3s ease-out;
  }
`;

// ============================================================================
// STYLED COMPONENTS - Logo
// ============================================================================

const LogoSystemContainer = styled.div`
  position: relative;
  width: 320px;
  height: 320px;
  margin: 1rem 0 3rem;

  @media (max-width: 480px) {
    width: 260px;
    height: 260px;
  }
`;

const CentralLogo = styled.div<{ $src: string }>`
  position: absolute;
  inset: 60px;
  background-image: url(${props => props.$src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 10;
  animation: ${float} 6s ease-in-out infinite, ${subtleGlow} 4s ease-in-out infinite;
`;

// Orbital animation
interface OrbitalLogoProps {
  $index: number;
  $totalLogos: number;
  $animationPhase: 'orbit' | 'converge' | 'dissolve' | 'hidden';
  $orbitRadius: number;
  $size: number;
  $speed: number;
  $initialAngle: number;
}

const getOrbitAnimation = (props: OrbitalLogoProps) => {
  const { $orbitRadius, $initialAngle, $speed } = props;

  return keyframes`
    0% {
      transform: rotate(${$initialAngle}deg) translateX(${$orbitRadius}px) rotate(-${$initialAngle}deg);
      opacity: 0;
    }
    10% {
      opacity: 0.9;
    }
    100% {
      transform: rotate(${$initialAngle + 360 * $speed}deg) translateX(${$orbitRadius}px) rotate(-${$initialAngle + 360 * $speed}deg);
      opacity: 0.9;
    }
  `;
};

const getConvergeAnimation = (props: OrbitalLogoProps) => {
  const { $orbitRadius, $initialAngle } = props;
  const currentAngle = $initialAngle + 360;

  return keyframes`
    0% {
      transform: rotate(${currentAngle}deg) translateX(${$orbitRadius}px) rotate(-${currentAngle}deg);
      opacity: 0.9;
      filter: blur(0) brightness(1);
    }
    60% {
      transform: rotate(${currentAngle + 90}deg) translateX(${$orbitRadius * 0.4}px) rotate(-${currentAngle + 90}deg);
      opacity: 1;
      filter: blur(0) brightness(1.2);
    }
    100% {
      transform: rotate(${currentAngle + 135}deg) translateX(0) rotate(-${currentAngle + 135}deg) scale(0.5);
      opacity: 0;
      filter: blur(8px) brightness(2);
    }
  `;
};

const OrbitalLogoElement = styled.div<OrbitalLogoProps>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  top: calc(50% - ${props => props.$size / 2}px);
  left: calc(50% - ${props => props.$size / 2}px);
  background-image: url(${blendLogo});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0;
  filter: brightness(1.3) contrast(1.1) drop-shadow(0 0 8px rgba(135, 206, 235, 0.6));
  transform-origin: center center;
  z-index: ${props => 5 - props.$index};

  ${props => {
    switch (props.$animationPhase) {
      case 'orbit':
        return css`
          animation: ${getOrbitAnimation(props)} ${8 / props.$speed}s linear forwards;
        `;
      case 'converge':
        return css`
          animation: ${getConvergeAnimation(props)} 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        `;
      case 'dissolve':
      case 'hidden':
        return css`
          opacity: 0;
          pointer-events: none;
        `;
      default:
        return '';
    }
  }}
`;

// ============================================================================
// STYLED COMPONENTS - Navigation
// ============================================================================

const NavigationContainer = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 2rem;
  padding: 0 20px;

  @media (max-width: 600px) {
    gap: 15px;
  }
`;

const NavButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const NavButton = styled.button<{ $isActive: boolean; $isPulsing: boolean }>`
  position: relative;
  padding: 14px 32px;
  background: transparent;
  border: 1px solid rgba(135, 206, 235, ${props => props.$isActive ? 0.8 : 0.25});
  color: rgba(255, 255, 255, ${props => props.$isActive ? 1 : 0.7});
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  ${props => props.$isActive && css`
    background: rgba(135, 206, 235, 0.08);
    animation: ${pulseGlow} 2s ease-in-out infinite;
  `}

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid transparent;
    background: linear-gradient(135deg,
      rgba(135, 206, 235, 0.3) 0%,
      transparent 50%,
      rgba(70, 130, 180, 0.3) 100%
    ) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: ${props => props.$isActive ? 1 : 0};
    transition: opacity 0.4s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, rgba(135, 206, 235, 0.15) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: width 0.5s ease, height 0.5s ease;
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(135, 206, 235, 0.6);
    color: rgba(255, 255, 255, 1);
    transform: translateY(-2px);

    &::before { opacity: 1; }
    &::after { width: 200%; height: 200%; }
  }

  @media (max-width: 480px) {
    padding: 12px 24px;
    font-size: 10px;
  }
`;

const IgnitionIndicator = styled.div<{ $isLit: boolean }>`
  position: relative;
  width: 40px;
  height: 6px;
  background: rgba(20, 20, 20, 0.8);
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(135, 206, 235, ${props => props.$isLit ? 0.4 : 0.15});

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${props => props.$isLit ? '70%' : '20%'};
    height: 2px;
    background: ${props => props.$isLit
      ? 'linear-gradient(90deg, rgba(135, 206, 235, 0.6), rgba(255, 255, 255, 0.9), rgba(135, 206, 235, 0.6))'
      : 'rgba(135, 206, 235, 0.2)'
    };
    border-radius: 1px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    ${props => props.$isLit && css`
      animation: ${igniteGlow} 1.5s ease-in-out infinite;
    `}
  }

  &:hover {
    transform: scale(1.05);
    border-color: rgba(135, 206, 235, 0.5);
  }
`;

const IgnitionLabel = styled.span<{ $isLit: boolean }>`
  font-family: 'Montserrat', sans-serif;
  font-size: 8px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(135, 206, 235, ${props => props.$isLit ? 0.8 : 0.4});
  transition: color 0.3s ease;
  margin-top: 4px;
`;

// ============================================================================
// COMPONENT
// ============================================================================

interface NavigationItem {
  id: string;
  label: string;
  path: string;
}

const navigationItems: NavigationItem[] = [
  { id: 'eventi', label: 'Eventi', path: '/eventi' },
  { id: 'galleria', label: 'Galleria', path: '/galleria' },
  { id: 'chi-siamo', label: 'Chi Siamo', path: '/chi-siamo' },
];

interface OrbitalConfig {
  orbitRadius: number;
  size: number;
  speed: number;
  initialAngle: number;
}

const orbitalConfigs: OrbitalConfig[] = [
  { orbitRadius: 130, size: 35, speed: 1.2, initialAngle: 0 },
  { orbitRadius: 145, size: 28, speed: 0.9, initialAngle: 72 },
  { orbitRadius: 125, size: 32, speed: 1.0, initialAngle: 144 },
  { orbitRadius: 140, size: 30, speed: 1.1, initialAngle: 216 },
  { orbitRadius: 135, size: 26, speed: 0.85, initialAngle: 288 },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const title = "Blend Association";

  const [orbitalPhase, setOrbitalPhase] = useState<'orbit' | 'converge' | 'dissolve' | 'hidden'>('orbit');
  const [activeButtons, setActiveButtons] = useState<Set<string>>(new Set());
  const [pulsingButton, setPulsingButton] = useState<string | null>(null);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    animationTimeoutRef.current = setTimeout(() => {
      setOrbitalPhase('converge');
      animationTimeoutRef.current = setTimeout(() => {
        setOrbitalPhase('hidden');
      }, 2500);
    }, 6000);

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  const handleButtonClick = useCallback((item: NavigationItem) => {
    setActiveButtons(prev => new Set(prev).add(item.id));
    setPulsingButton(item.id);
    setTimeout(() => navigate(item.path), 300);
  }, [navigate]);

  const handleIgnitionToggle = useCallback((itemId: string) => {
    setActiveButtons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  return (
    <PageContainer>
      <Scanline />
      <ParticleField />
      <GridLines />
      <DiagonalLines />

      {/* Floating ambient text */}
      <AmbientText $top="15%" $left="5%" $delay={0} $size={14}>underground music</AmbientText>
      <AmbientText $top="75%" $left="70%" $delay={3} $size={12}>minimal deep tech</AmbientText>
      <AmbientText $top="85%" $left="10%" $delay={5} $size={10}>blend association</AmbientText>
      <AmbientText $top="25%" $left="75%" $delay={2} $size={11}>electronic culture</AmbientText>
      <AmbientText $top="60%" $left="3%" $delay={4} $size={9}>since 2019</AmbientText>

      {/* Celestial Bodies */}
      <CelestialContainer>
        {/* Large gas giant - top left, partially hidden */}
        <GasGiant $size={280} $top="-5%" $left="-8%" $hue={210} />

        {/* Medium planet - bottom left */}
        <GasGiant $size={180} $top="75%" $left="-4%" $hue={200} />

        {/* Distant moons */}
        <CelestialMoon $size={50} $top="18%" $right="8%" $hue={195} />
        <CelestialMoon $size={30} $top="65%" $right="5%" $hue={220} />
        <CelestialMoon $size={20} $top="35%" $right="3%" $hue={205} />

        {/* Subtle orbit rings for central system */}
        <SubtleOrbitRing $size={600} $opacity={0.02} />
        <SubtleOrbitRing $size={480} $opacity={0.03} />
        <SubtleOrbitRing $size={360} $opacity={0.025} />

        {/* Orbiting particles */}
        <OrbitingParticle $orbitRadius={300} $size={6} $duration={80} $hue={200} />
        <OrbitingParticle $orbitRadius={240} $size={4} $duration={55} $hue={210} />
        <OrbitingParticle $orbitRadius={180} $size={3} $duration={40} $hue={195} />
      </CelestialContainer>

      <MainContent>
        <TitleContainer>
          {title.split('').map((letter, index) => (
            <AnimatedLetter key={index} $delay={0.5 + index * 0.05}>
              {letter === ' ' ? '\u00A0' : letter}
            </AnimatedLetter>
          ))}
        </TitleContainer>

        <LogoSystemContainer>
          {orbitalConfigs.map((config, index) => (
            <OrbitalLogoElement
              key={index}
              $index={index}
              $totalLogos={orbitalConfigs.length}
              $animationPhase={orbitalPhase}
              $orbitRadius={config.orbitRadius}
              $size={config.size}
              $speed={config.speed}
              $initialAngle={config.initialAngle}
            />
          ))}
          <CentralLogo $src={blendLogo} />
        </LogoSystemContainer>

        <NavigationContainer>
          {navigationItems.map((item) => {
            const isActive = activeButtons.has(item.id);
            const isPulsing = pulsingButton === item.id;

            return (
              <NavButtonWrapper key={item.id}>
                <NavButton
                  $isActive={isActive}
                  $isPulsing={isPulsing}
                  onClick={() => handleButtonClick(item)}
                >
                  {item.label}
                </NavButton>
                <IgnitionIndicator
                  $isLit={isActive}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIgnitionToggle(item.id);
                  }}
                />
                <IgnitionLabel $isLit={isActive}>
                  {isActive ? 'on' : 'off'}
                </IgnitionLabel>
              </NavButtonWrapper>
            );
          })}
        </NavigationContainer>
      </MainContent>
    </PageContainer>
  );
};

export default HomePage;
