import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/common/Header';
import blendLogo from '../assets/logowbig.png';

// Styled Components
const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  background-color: #000000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const LogoContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 80px);
  position: relative;
  z-index: 5;
  flex-direction: column;
`;

// Nuovo componente per l'effetto glitch
const GlitchText = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: 300;
  font-size: 1.8rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-bottom: 2.5rem;
  position: relative;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  animation: final-flicker 0.5s 2.4s forwards;
  width: 100%;
  padding: 0 10px;
  
  /* Responsive per dispositivi mobili */
  @media (max-width: 768px) {
    font-size: 1.2rem;
    letter-spacing: 0.2em;
    margin-bottom: 1.5rem;
  }
  
  /* Per schermi molto piccoli */
  @media (max-width: 480px) {
    font-size: 1rem;
    letter-spacing: 0.15em;
    margin-bottom: 1rem;
  }
  
  @keyframes final-flicker {
    0% {
      opacity: 1;
    }
    10% {
      opacity: 0;
      text-shadow: none;
    }
    13% {
      opacity: 1;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    }
    15% {
      opacity: 0;
      text-shadow: none;
    }
    17% {
      opacity: 1;
      text-shadow: 0 0 8px rgba(70, 130, 180, 0.6);
    }
    22% {
      opacity: 0;
      text-shadow: none;
    }
    25% {
      opacity: 1;
      text-shadow: 0 0 12px rgba(255, 255, 255, 0.9), 0 0 20px rgba(70, 130, 180, 0.5);
    }
    30% {
      opacity: 0;
      text-shadow: none;
    }
    33% {
      opacity: 1;
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    }
    100% {
      opacity: 1;
      text-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
    }
  }
`;

interface GlitchLetterProps {
  delay: number;
  effectType?: 'teleport' | 'flicker' | 'normal';
}

const GlitchLetter = styled.span<GlitchLetterProps>`
  display: inline-block;
  position: relative;
  opacity: 0;
  animation: ${props => {
    switch(props.effectType) {
      case 'teleport':
        return `glitch-teleport 1s ${props.delay}s forwards`;
      case 'flicker':
        return `glitch-flicker 1s ${props.delay}s forwards`;
      default:
        return `glitch-assemble 0.8s ${props.delay}s forwards`;
    }
  }};

  @keyframes glitch-assemble {
    0% {
      opacity: 0;
      transform: translateY(5px);
      filter: blur(8px);
    }
    30% {
      opacity: 0.7;
      transform: translateY(-2px);
      filter: blur(0);
    }
    33% {
      opacity: 1;
      transform: translateY(0) skewX(10deg);
      filter: blur(2px);
    }
    38% {
      transform: skewX(-5deg);
      filter: blur(0);
    }
    42% {
      transform: skewX(2deg);
      filter: blur(1px);
    }
    50% {
      transform: skewX(0);
      filter: blur(0);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
      filter: blur(0);
    }
  }

  @keyframes glitch-teleport {
    0% {
      opacity: 0;
      transform: translate(15px, 5px);
      filter: blur(8px);
    }
    10% {
      opacity: 1;
      transform: translate(-30px, -10px);
      filter: blur(0);
    }
    15% {
      transform: translate(5px, 10px) skewX(20deg);
      filter: blur(1px);
    }
    25% {
      opacity: 0.8;
      transform: translate(-15px, 0) skewX(-10deg);
    }
    40% {
      opacity: 1;
      transform: translate(25px, -5px);
      filter: blur(2px);
    }
    50% {
      transform: translate(0, 0) skewX(5deg);
      filter: blur(0);
    }
    60% {
      transform: translate(0, 0) skewX(-2deg);
    }
    100% {
      opacity: 1;
      transform: translate(0, 0);
      filter: blur(0);
    }
  }

  @keyframes glitch-flicker {
    0% {
      opacity: 0;
      transform: translateY(5px);
      filter: blur(8px);
    }
    20% {
      opacity: 1;
      filter: blur(0);
    }
    25% {
      opacity: 0;
    }
    30% {
      opacity: 1;
      transform: translateY(-2px) skewX(5deg);
    }
    35% {
      opacity: 0;
    }
    40% {
      opacity: 1;
      transform: translateY(0) skewX(-5deg);
    }
    50% {
      opacity: 0.7;
    }
    55% {
      opacity: 1;
      transform: skewX(2deg);
    }
    70% {
      transform: skewX(0);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
      filter: blur(0);
    }
  }
`;

// Nuovo componente per il logo con effetto glitch avanzato
interface GlitchLogoProps {
  src: string;
}

const GlitchLogo = styled.div<GlitchLogoProps>`
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  animation: float 6s ease-in-out infinite, logo-flicker 8s infinite;
  z-index: 1;
  
  &::before, &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${props => props.src});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    z-index: -1;
  }
  
  &::before {
    mix-blend-mode: screen;
    transform: translateX(-2%) skewX(2deg);
    filter: hue-rotate(320deg) brightness(1.3) contrast(1.5);
    opacity: 0;
    animation: glitch-layer1 4s infinite;
  }
  
  &::after {
    mix-blend-mode: multiply;
    transform: translateX(2%) skewY(-1deg);
    filter: hue-rotate(180deg) brightness(1.7) contrast(1.2);
    opacity: 0;
    animation: glitch-layer2 5s infinite;
  }
  
  @keyframes glitch-layer1 {
    0%, 93%, 100% { opacity: 0; }
    10% { opacity: 0.4; transform: translate(-5px, 2px) skewX(4deg); }
    12% { opacity: 0; transform: translate(0, 0) skewX(0); }
    35% { opacity: 0.3; transform: translate(3px, -1px) skewY(-2deg); }
    37% { opacity: 0; transform: translate(0, 0) skewY(0); }
    60% { opacity: 0.2; transform: translate(-5px, -2px) scale(1.02); }
    63% { opacity: 0; transform: translate(0, 0) scale(1); }
    80% { opacity: 0.5; transform: translate(5px, 1px) skewX(-4deg); }
    83% { opacity: 0; transform: translate(0, 0) skewX(0); }
  }
  
  @keyframes glitch-layer2 {
    0%, 93%, 100% { opacity: 0; }
    20% { opacity: 0.3; transform: translate(5px, 2px) skewY(3deg); }
    22% { opacity: 0; transform: translate(0, 0) skewY(0); }
    45% { opacity: 0.4; transform: translate(-3px, -1px) skewX(-2deg) scale(0.98); }
    47% { opacity: 0; transform: translate(0, 0) skewX(0) scale(1); }
    70% { opacity: 0.2; transform: translate(5px, 2px) scale(1.02); }
    73% { opacity: 0; transform: translate(0, 0) scale(1); }
    88% { opacity: 0.3; transform: translate(-3px, -2px) skewY(-3deg); }
    90% { opacity: 0; transform: translate(0, 0) skewY(0); }
  }
  
  @keyframes logo-flicker {
    0%, 100% { 
      filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 40px rgba(70, 130, 180, 0.3));
    }
    3% { filter: drop-shadow(0 0 30px rgba(70, 130, 180, 0.8)); }
    5% { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5)); }
    10% { filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.8)); }
    11% { filter: drop-shadow(0 0 20px rgba(70, 130, 180, 0.5)); }
    40% { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5)); }
    42% { filter: drop-shadow(0 0 35px rgba(255, 255, 255, 0.7)); }
    43% { filter: drop-shadow(0 0 15px rgba(70, 130, 180, 0.4)); }
    65% { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5)); }
    68% { filter: drop-shadow(0 0 30px rgba(70, 130, 180, 0.6)); }
    70% { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5)); }
    89% { filter: drop-shadow(0 0 25px rgba(255, 255, 255, 0.6)); }
    91% { filter: drop-shadow(0 0 30px rgba(70, 130, 180, 0.7)); }
    92% { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5)); }
  }
  
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

// Componente per l'effetto anello di Saturno
const SaturnRingContainer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  perspective: 1000px;
  transform-style: preserve-3d;
`;

// Componenti per l'effetto Saturno
interface SaturnRingProps {
  angle: number;
  scale: number;
  opacity: number;
  rotationSpeed: number;
  isActive: boolean;
}

const SaturnRing = styled.div<SaturnRingProps>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 50%;
  transform: ${props => `rotateX(${props.angle}deg) scale(${props.scale})`};
  opacity: ${props => props.isActive ? props.opacity : 0};
  transition: opacity 0.8s ease-in-out;
  transform-style: preserve-3d;
  animation: ${props => props.isActive ? `ring-rotation ${props.rotationSpeed}s linear infinite` : 'none'};
  pointer-events: none;
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 20px rgba(70, 130, 180, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.3);
  }
`;

// Componente per i piccoli loghi che orbitano
interface OrbitalLogoProps {
  logoSrc: string;
  orbit: number;
  size: number;
  speedMultiplier: number;
  startAngle: number;
  verticalOffset: number;
  isActive: boolean;
  orbitOpacity: number;
  glitchFrequency: number;
  disappearDelay: number;
}

const OrbitalLogo = styled.div<OrbitalLogoProps>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  top: calc(50% - ${props => props.size / 2}px + ${props => props.verticalOffset}px);
  left: calc(50% - ${props => props.size / 2}px);
  background-image: url(${props => props.logoSrc});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: ${props => props.isActive ? 1 : 0};
  transition: opacity 0.5s ease-in-out;
  filter: brightness(1.5) contrast(1.3) drop-shadow(0 0 10px rgba(70, 130, 180, 0.7));
  mix-blend-mode: screen;
  transform-origin: center center;
  animation: ${props => props.isActive 
    ? `orbital-motion-${props.orbit} ${12 / props.speedMultiplier}s linear infinite, 
       orbital-pulse ${props.glitchFrequency}s ease-in-out infinite,
       fade-out ${10 + props.disappearDelay}s ${props.disappearDelay}s cubic-bezier(0.42, 0, 0.58, 1) forwards`
    : 'none'};
  animation-delay: ${_props => _props.startAngle * 0.1}s, 0s, 0s;
  z-index: ${_props => Math.round(_props.orbit * 10)};
  
  @keyframes orbital-motion-${_props => _props.orbit} {
    0% {
      transform: rotate(${_props => _props.startAngle}deg) 
                translateY(${_props => _props.orbit}px) 
                rotate(-${_props => _props.startAngle}deg);
    }
    25% {
      transform: rotate(${_props => _props.startAngle + 90}deg) 
                translateY(${_props => _props.orbit}px) 
                rotate(-${_props => _props.startAngle + 90}deg)
                scale(${_props => 0.8 + Math.random() * 0.4});
    }
    50% {
      transform: rotate(${_props => _props.startAngle + 180}deg) 
                translateY(${_props => _props.orbit}px) 
                rotate(-${_props => _props.startAngle + 180}deg);
    }
    75% {
      transform: rotate(${_props => _props.startAngle + 270}deg) 
                translateY(${_props => _props.orbit}px) 
                rotate(-${_props => _props.startAngle + 270}deg)
                scale(${_props => 0.9 + Math.random() * 0.2});
    }
    100% {
      transform: rotate(${_props => _props.startAngle + 360}deg) 
                translateY(${_props => _props.orbit}px) 
                rotate(-${_props => _props.startAngle + 360}deg);
    }
  }
  
  @keyframes orbital-pulse {
    0%, 100% {
      filter: brightness(1.5) contrast(1.3) drop-shadow(0 0 10px rgba(70, 130, 180, 0.7));
      opacity: 1;
    }
    ${_props => (25 + Math.random() * 10).toFixed(1)}% {
      filter: brightness(0.2) contrast(0.5) drop-shadow(0 0 5px rgba(70, 130, 180, 0.2));
      opacity: 0.3;
      transform: scale(0.8) rotate(${Math.random() * 20 - 10}deg);
    }
    ${_props => (30 + Math.random() * 5).toFixed(1)}% {
      filter: brightness(1.8) contrast(1.5) drop-shadow(0 0 15px rgba(255, 255, 255, 0.8));
      opacity: 1;
      transform: scale(1.2) rotate(0deg);
    }
    ${_props => (60 + Math.random() * 10).toFixed(1)}% {
      filter: brightness(0.5) contrast(0.8) drop-shadow(0 0 3px rgba(70, 130, 180, 0.5));
      opacity: 0.5;
    }
    ${_props => (65 + Math.random() * 5).toFixed(1)}% {
      filter: brightness(1.7) contrast(1.4) drop-shadow(0 0 12px rgba(255, 255, 255, 0.7));
      opacity: 1;
    }
  }
  
  @keyframes fade-out {
    0% { 
      opacity: 1; 
      filter: brightness(1.5) contrast(1.3) drop-shadow(0 0 10px rgba(70, 130, 180, 0.7));
    }
    80% { 
      opacity: 0.8; 
      filter: brightness(1.5) contrast(1.3) drop-shadow(0 0 10px rgba(70, 130, 180, 0.7));
    }
    90% { 
      opacity: 0.3; 
      filter: brightness(1.2) contrast(1) drop-shadow(0 0 5px rgba(70, 130, 180, 0.3));
      transform: scale(0.8);
    }
    100% { 
      opacity: 0; 
      filter: brightness(0.5) contrast(0.5) drop-shadow(0 0 0 transparent);
      transform: scale(0.2) translateY(50px);
    }
  }
`;

// Componente per creare l'effetto visuale degli anelli di Saturno
const SaturnRingEffect = styled.div<{isActive: boolean}>`
  position: absolute;
  width: 500px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  clip-path: ellipse(250px 100px at center);
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: radial-gradient(
      ellipse at center,
      transparent 40%,
      rgba(70, 130, 180, 0.2) 42%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(70, 130, 180, 0.2) 58%,
      transparent 60%
    );
    opacity: ${props => props.isActive ? 0.4 : 0};
    transition: opacity 1.5s ease-in-out;
    box-shadow: 0 0 40px rgba(70, 130, 180, 0.4);
    filter: blur(3px);
    animation: ${props => props.isActive ? 'ring-pulse 8s ease-in-out infinite, ring-fade 12s ease-in-out forwards' : 'none'};
  }
  
  @keyframes ring-pulse {
    0%, 100% { 
      opacity: 0.4;
    }
    50% { 
      opacity: 0.6;
    }
  }
  
  @keyframes ring-fade {
    0% { opacity: 0; }
    10% { opacity: 0.4; }
    90% { opacity: 0.4; }
    100% { opacity: 0; }
  }
`;

const CTAButton = styled(Link)`
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  padding: 15px 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-50%) translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

// Particles effect
const Particles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  overflow: hidden;
  opacity: 0.5;
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background-image: 
      radial-gradient(1px 1px at 25px 5px, white, rgba(255, 255, 255, 0)),
      radial-gradient(1px 1px at 50px 25px, white, rgba(255, 255, 255, 0)),
      radial-gradient(1px 1px at 125px 20px, white, rgba(255, 255, 255, 0)),
      radial-gradient(1.5px 1.5px at 50px 75px, white, rgba(255, 255, 255, 0)),
      radial-gradient(2px 2px at 175px 135px, white, rgba(255, 255, 255, 0)),
      radial-gradient(2.5px 2.5px at 200px 50px, white, rgba(255, 255, 255, 0)),
      radial-gradient(2px 2px at 250px 225px, white, rgba(255, 255, 255, 0));
    background-repeat: repeat;
    background-size: 350px 350px;
  }
`;

// Configurazione degli anelli e satelliti
interface Ring {
  angle: number;
  scale: number;
  opacity: number;
  rotationSpeed: number;
}

interface Satellite {
  orbit: number;
  size: number;
  speedMultiplier: number;
  startAngle: number;
  verticalOffset: number;
  glitchFrequency: number;
  disappearDelay: number;
}

const HomePage: React.FC = () => {
  // Suddivido la scritta in due parole per una migliore animazione
  const firstWord = "Blend";
  const secondWord = "Association";
  
  // Funzione per determinare il tipo di effetto per ogni lettera
  const getEffectType = (wordPosition: string, letterIndex: number): 'teleport' | 'flicker' | 'normal' => {
    // Lettere specifiche che avranno effetti speciali
    if (wordPosition === 'first') {
      // Per la parola "Blend"
      if (letterIndex === 0) return 'teleport'; // B
      if (letterIndex === 2) return 'flicker';  // e
      return 'normal';
    } else {
      // Per la parola "Association"
      if (letterIndex === 1) return 'flicker';  // s
      if (letterIndex === 4) return 'teleport'; // c
      if (letterIndex === 7) return 'flicker';  // i
      if (letterIndex === 9) return 'teleport'; // o
      return 'normal';
    }
  };
  
  // Stato per gli effetti di glitch
  const [shouldGlitch, setShouldGlitch] = useState<boolean>(false);
  const [saturnEffectActive, setSaturnEffectActive] = useState<boolean>(false);
  
  // Riferimento per effetti di timeouts multipli
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  
  // Configurazione per gli anelli di Saturno
  const rings: Ring[] = [
    { angle: 75, scale: 1.2, opacity: 0.7, rotationSpeed: 60 },
    { angle: 75, scale: 1.4, opacity: 0.5, rotationSpeed: 80 },
    { angle: 75, scale: 1.6, opacity: 0.3, rotationSpeed: 100 }
  ];
  
  // Configurazione per i satelliti (loghi orbitanti)
  const satellites: Satellite[] = [
    { orbit: 140, size: 60, speedMultiplier: 0.8, startAngle: 0, verticalOffset: 0, glitchFrequency: 3, disappearDelay: 2 },
    { orbit: 180, size: 80, speedMultiplier: 0.6, startAngle: 120, verticalOffset: 10, glitchFrequency: 4, disappearDelay: 4 },
    { orbit: 220, size: 70, speedMultiplier: 0.7, startAngle: 240, verticalOffset: -15, glitchFrequency: 5, disappearDelay: 1 },
    { orbit: 160, size: 50, speedMultiplier: 0.9, startAngle: 60, verticalOffset: -5, glitchFrequency: 2.5, disappearDelay: 3 },
    { orbit: 200, size: 65, speedMultiplier: 0.5, startAngle: 180, verticalOffset: 5, glitchFrequency: 3.5, disappearDelay: 5 },
    { orbit: 240, size: 55, speedMultiplier: 0.4, startAngle: 300, verticalOffset: -10, glitchFrequency: 4.5, disappearDelay: 2.5 }
  ];
  
  // Funzione per attivare e disattivare l'effetto Saturno
  const triggerSaturnEffect = () => {
    // Disattiva eventuali timeouts precedenti
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
    
    // Attiva l'effetto
    setSaturnEffectActive(true);
    
    // Disattiva l'effetto dopo un certo tempo
    const timeout = setTimeout(() => {
      setSaturnEffectActive(false);
    }, 12000); // 12 secondi, corrispondenti alla durata dell'animazione
    
    timeoutsRef.current.push(timeout);
  };
  
  useEffect(() => {
    // Attiva l'effetto Saturno dopo un breve ritardo iniziale
    const initialTimeout = setTimeout(() => {
      triggerSaturnEffect();
    }, 2000);
    
    timeoutsRef.current.push(initialTimeout);
    
    // Imposta un timer per attivare l'effetto glitch in modo casuale
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.65) { // 35% di probabilità di attivare il glitch
        setShouldGlitch(true);
        setTimeout(() => setShouldGlitch(false), 200); // Durata del glitch principale
        
        // 20% di probabilità di attivare anche l'effetto Saturno dopo un glitch
        if (Math.random() > 0.8 && !saturnEffectActive) {
          setTimeout(() => triggerSaturnEffect(), 300);
        }
      }
    }, 5000); // Controlla ogni 5 secondi
    
    // Cleanup
    return () => {
      clearInterval(glitchInterval);
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, [saturnEffectActive]);
  
  return (
    <PageContainer>
      <Particles />
      
      {/* Header separato */}
      <Header showLogo={false} />

      <LogoContainer>
        {/* Componente di testo con effetto glitch avanzato e finale sci-fi */}
        <GlitchText>
          {/* Animazione della prima parola con effetti differenziati */}
          {firstWord.split('').map((letter, index) => (
            <GlitchLetter 
              key={`first-${index}`} 
              delay={index * 0.07}
              effectType={getEffectType('first', index)}
            >
              {letter}
            </GlitchLetter>
          ))}
          {/* Spazio */}
          <GlitchLetter key="space" delay={firstWord.length * 0.07 + 0.1} effectType="normal">&nbsp;</GlitchLetter>
          {/* Animazione della seconda parola con effetti differenziati */}
          {secondWord.split('').map((letter, index) => (
            <GlitchLetter 
              key={`second-${index}`} 
              delay={(firstWord.length + 1) * 0.07 + (index * 0.07)}
              effectType={getEffectType('second', index)}
            >
              {letter}
            </GlitchLetter>
          ))}
        </GlitchText>
        
        {/* Wrapper per il logo e gli elementi di Saturno */}
        <div style={{ position: 'relative' }}>
          {/* Effetto anelli di Saturno - CONDIZIONALE */}
          {saturnEffectActive && <SaturnRingEffect isActive={saturnEffectActive} />}
          
          {/* Anelli orbitali di Saturno */}
          <SaturnRingContainer>
            {rings.map((ring, index) => (
              <SaturnRing 
                key={`ring-${index}`}
                angle={ring.angle}
                scale={ring.scale}
                opacity={ring.opacity}
                rotationSpeed={ring.rotationSpeed}
                isActive={saturnEffectActive}
              />
            ))}
            
            {/* Loghi che orbitano come satelliti */}
            {satellites.map((satellite, index) => (
              <OrbitalLogo
                key={`satellite-${index}`}
                logoSrc={blendLogo}
                orbit={satellite.orbit}
                size={satellite.size}
                speedMultiplier={satellite.speedMultiplier}
                startAngle={satellite.startAngle}
                verticalOffset={satellite.verticalOffset}
                isActive={saturnEffectActive}
                orbitOpacity={0.7 - (index * 0.1)}
                glitchFrequency={satellite.glitchFrequency}
                disappearDelay={satellite.disappearDelay}
              />
            ))}
          </SaturnRingContainer>
          
          {/* Logo principale con effetto glitch */}
          <div style={{ width: '300px', height: '300px', position: 'relative', margin: '10px 0 20px' }}>
            <GlitchLogo 
              src={blendLogo} 
              style={shouldGlitch ? { 
                transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) skew(${Math.random() * 4 - 2}deg)`,
                filter: `hue-rotate(${Math.random() * 60}deg) brightness(${1 + Math.random() * 0.5})`
              } : {}}
            />
          </div>
        </div>
        <CTAButton to="/eventi">Scopri gli Eventi</CTAButton>
      </LogoContainer>
    </PageContainer>
  );
};

export default HomePage;