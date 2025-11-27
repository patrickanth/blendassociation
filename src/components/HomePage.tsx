import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import blendLogo from '../assets/logowbig.png';

// ============================================================================
// KEYFRAMES - Animazioni
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
  70% {
    transform: translateY(-2px) skewX(2deg);
  }
  85% {
    transform: translateY(1px) skewX(-1deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) skewX(0);
    filter: blur(0);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(135, 206, 235, 0.3),
                0 0 10px rgba(135, 206, 235, 0.2),
                0 0 20px rgba(70, 130, 180, 0.1);
  }
  50% {
    box-shadow: 0 0 10px rgba(135, 206, 235, 0.5),
                0 0 20px rgba(135, 206, 235, 0.3),
                0 0 40px rgba(70, 130, 180, 0.2);
  }
`;

const igniteGlow = keyframes`
  0% {
    opacity: 0.3;
    box-shadow: 0 0 2px rgba(135, 206, 235, 0.2);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 8px rgba(135, 206, 235, 0.8),
                0 0 16px rgba(135, 206, 235, 0.5),
                0 0 24px rgba(70, 130, 180, 0.3);
  }
  100% {
    opacity: 0.6;
    box-shadow: 0 0 4px rgba(135, 206, 235, 0.5),
                0 0 8px rgba(135, 206, 235, 0.3);
  }
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

const ParticleField = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.4;
  background-image:
    radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 60% 20%, rgba(255,255,255,0.7), transparent),
    radial-gradient(1.5px 1.5px at 80% 50%, rgba(255,255,255,0.5), transparent),
    radial-gradient(1px 1px at 10% 80%, rgba(255,255,255,0.6), transparent),
    radial-gradient(1.5px 1.5px at 90% 10%, rgba(255,255,255,0.4), transparent);
  background-size: 250px 250px;
  animation: ${fadeIn} 2s ease-out;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 20px 40px;
  position: relative;
  z-index: 5;
`;

// ============================================================================
// STYLED COMPONENTS - Title
// ============================================================================

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

interface LetterProps {
  delay: number;
}

const AnimatedLetter = styled.span<LetterProps>`
  display: inline-block;
  font-family: 'Montserrat', sans-serif;
  font-weight: 200;
  font-size: clamp(1.2rem, 4vw, 2rem);
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.4em;
  text-transform: uppercase;
  opacity: 0;
  animation: ${textReveal} 0.8s ease-out forwards;
  animation-delay: ${props => props.delay}s;

  &:hover {
    animation: ${glitchFlicker} 0.3s ease-out;
  }
`;

// ============================================================================
// STYLED COMPONENTS - Logo & Orbital System
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

const CentralLogo = styled.div<{ src: string }>`
  position: absolute;
  inset: 60px;
  background-image: url(${props => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 10;
  animation: ${float} 6s ease-in-out infinite, ${subtleGlow} 4s ease-in-out infinite;
`;

// Orbital Logo con animazione complessa: orbita -> convergenza -> dissolve
interface OrbitalLogoProps {
  index: number;
  totalLogos: number;
  animationPhase: 'orbit' | 'converge' | 'dissolve' | 'hidden';
  orbitRadius: number;
  size: number;
  speed: number;
  initialAngle: number;
}

const getOrbitAnimation = (props: OrbitalLogoProps) => {
  const { orbitRadius, initialAngle, speed } = props;

  return keyframes`
    0% {
      transform: rotate(${initialAngle}deg) translateX(${orbitRadius}px) rotate(-${initialAngle}deg);
      opacity: 0;
    }
    10% {
      opacity: 0.9;
    }
    100% {
      transform: rotate(${initialAngle + 360 * speed}deg) translateX(${orbitRadius}px) rotate(-${initialAngle + 360 * speed}deg);
      opacity: 0.9;
    }
  `;
};

const getConvergeAnimation = (props: OrbitalLogoProps) => {
  const { orbitRadius, initialAngle } = props;
  const currentAngle = initialAngle + 360; // Posizione finale dell'orbita

  return keyframes`
    0% {
      transform: rotate(${currentAngle}deg) translateX(${orbitRadius}px) rotate(-${currentAngle}deg);
      opacity: 0.9;
      filter: blur(0) brightness(1);
    }
    30% {
      transform: rotate(${currentAngle + 45}deg) translateX(${orbitRadius * 0.7}px) rotate(-${currentAngle + 45}deg);
      opacity: 0.95;
    }
    60% {
      transform: rotate(${currentAngle + 90}deg) translateX(${orbitRadius * 0.4}px) rotate(-${currentAngle + 90}deg);
      opacity: 1;
      filter: blur(0) brightness(1.2);
    }
    85% {
      transform: rotate(${currentAngle + 120}deg) translateX(${orbitRadius * 0.15}px) rotate(-${currentAngle + 120}deg);
      opacity: 0.9;
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
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  top: calc(50% - ${props => props.size / 2}px);
  left: calc(50% - ${props => props.size / 2}px);
  background-image: url(${blendLogo});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0;
  filter: brightness(1.3) contrast(1.1) drop-shadow(0 0 8px rgba(135, 206, 235, 0.6));
  transform-origin: center center;
  z-index: ${props => 5 - props.index};

  ${props => {
    switch (props.animationPhase) {
      case 'orbit':
        return css`
          animation: ${getOrbitAnimation(props)} ${8 / props.speed}s linear forwards;
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
// STYLED COMPONENTS - Navigation Buttons
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

interface NavButtonProps {
  isActive: boolean;
  isPulsing: boolean;
}

const NavButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const NavButton = styled.button<NavButtonProps>`
  position: relative;
  padding: 14px 32px;
  background: transparent;
  border: 1px solid rgba(135, 206, 235, ${props => props.isActive ? 0.8 : 0.25});
  color: rgba(255, 255, 255, ${props => props.isActive ? 1 : 0.7});
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  ${props => props.isActive && css`
    background: rgba(135, 206, 235, 0.08);
    animation: ${pulseGlow} 2s ease-in-out infinite;
  `}

  /* Effetto bordo luminoso */
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
    opacity: ${props => props.isActive ? 1 : 0};
    transition: opacity 0.4s ease;
  }

  /* Effetto hover glow interno */
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

    &::before {
      opacity: 1;
    }

    &::after {
      width: 200%;
      height: 200%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 12px 24px;
    font-size: 10px;
    letter-spacing: 2px;
  }
`;

// ============================================================================
// STYLED COMPONENTS - Ignition Indicator (Effetto Accensione)
// ============================================================================

interface IgnitionProps {
  isLit: boolean;
}

const IgnitionIndicator = styled.div<IgnitionProps>`
  position: relative;
  width: 40px;
  height: 6px;
  background: rgba(20, 20, 20, 0.8);
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  /* Bordo sottile */
  border: 1px solid rgba(135, 206, 235, ${props => props.isLit ? 0.4 : 0.15});

  /* Core luminoso */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${props => props.isLit ? '70%' : '20%'};
    height: 2px;
    background: ${props => props.isLit
      ? 'linear-gradient(90deg, rgba(135, 206, 235, 0.6), rgba(255, 255, 255, 0.9), rgba(135, 206, 235, 0.6))'
      : 'rgba(135, 206, 235, 0.2)'
    };
    border-radius: 1px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    ${props => props.isLit && css`
      animation: ${igniteGlow} 1.5s ease-in-out infinite;
    `}
  }

  /* Riflesso superiore */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    height: 1px;
    background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, ${props => props.isLit ? 0.3 : 0.1}),
      transparent
    );
  }

  &:hover {
    transform: scale(1.05);
    border-color: rgba(135, 206, 235, 0.5);
  }
`;

// Etichetta sotto l'indicatore
const IgnitionLabel = styled.span<IgnitionProps>`
  font-family: 'Montserrat', sans-serif;
  font-size: 8px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(135, 206, 235, ${props => props.isLit ? 0.8 : 0.4});
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

  // Stati per animazioni
  const [orbitalPhase, setOrbitalPhase] = useState<'orbit' | 'converge' | 'dissolve' | 'hidden'>('orbit');
  const [activeButtons, setActiveButtons] = useState<Set<string>>(new Set());
  const [pulsingButton, setPulsingButton] = useState<string | null>(null);

  // Ref per gestire i timeout
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Gestione fasi animazione orbitale (una volta sola)
  useEffect(() => {
    // Fase 1: Orbita per 6 secondi
    animationTimeoutRef.current = setTimeout(() => {
      setOrbitalPhase('converge');

      // Fase 2: Convergenza per 2.5 secondi, poi dissolve
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

  // Handler per i pulsanti
  const handleButtonClick = useCallback((item: NavigationItem) => {
    // Attiva l'indicatore
    setActiveButtons(prev => new Set(prev).add(item.id));
    setPulsingButton(item.id);

    // Naviga dopo un breve delay per l'effetto visivo
    setTimeout(() => {
      navigate(item.path);
    }, 300);
  }, [navigate]);

  // Toggle indicatore accensione
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
      <ParticleField />

      <MainContent>
        {/* Titolo animato */}
        <TitleContainer>
          {title.split('').map((letter, index) => (
            <AnimatedLetter
              key={index}
              delay={0.5 + index * 0.05}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </AnimatedLetter>
          ))}
        </TitleContainer>

        {/* Sistema Logo con orbite */}
        <LogoSystemContainer>
          {/* Loghi orbitanti */}
          {orbitalConfigs.map((config, index) => (
            <OrbitalLogoElement
              key={index}
              index={index}
              totalLogos={orbitalConfigs.length}
              animationPhase={orbitalPhase}
              orbitRadius={config.orbitRadius}
              size={config.size}
              speed={config.speed}
              initialAngle={config.initialAngle}
            />
          ))}

          {/* Logo centrale */}
          <CentralLogo src={blendLogo} />
        </LogoSystemContainer>

        {/* Navigazione con effetto accensione */}
        <NavigationContainer>
          {navigationItems.map((item) => {
            const isActive = activeButtons.has(item.id);
            const isPulsing = pulsingButton === item.id;

            return (
              <NavButtonWrapper key={item.id}>
                <NavButton
                  isActive={isActive}
                  isPulsing={isPulsing}
                  onClick={() => handleButtonClick(item)}
                >
                  {item.label}
                </NavButton>

                {/* Indicatore di accensione */}
                <IgnitionIndicator
                  isLit={isActive}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIgnitionToggle(item.id);
                  }}
                />
                <IgnitionLabel isLit={isActive}>
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
