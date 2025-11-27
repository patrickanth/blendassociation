import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Helmet } from 'react-helmet';
import Header from '../common/Header';

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

const textReveal = keyframes`
  0% {
    clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
  }
  100% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
`;

const scanline = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100vh);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #000000;
  color: white;
  font-family: 'Montserrat', sans-serif;
  position: relative;
  overflow-x: hidden;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.3), transparent);
    animation: ${scanline} 7s linear infinite;
    pointer-events: none;
    z-index: 1000;
  }
`;

const MainContent = styled.main`
  position: relative;
  z-index: 1;
  padding: 120px 5% 100px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 100px 5% 60px;
  }
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 120px;
  animation: ${fadeIn} 1s ease;

  @media (max-width: 768px) {
    margin-bottom: 80px;
  }
`;

const PageTitle = styled.h1`
  font-size: clamp(48px, 10vw, 100px);
  font-weight: 200;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  margin-bottom: 40px;
  animation: ${textReveal} 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(135,206,235,0.5) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled.p`
  font-size: 16px;
  font-weight: 300;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(135, 206, 235, 0.6);
  opacity: 0;
  animation: ${fadeIn} 1s 0.5s forwards;
`;

const ContentSection = styled.section<{ delay?: number }>`
  margin-bottom: 100px;
  animation: ${fadeIn} 0.8s ease;
  animation-delay: ${props => props.delay || 0}s;
  animation-fill-mode: both;

  @media (max-width: 768px) {
    margin-bottom: 70px;
  }
`;

const SectionDivider = styled.div`
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, rgba(135, 206, 235, 0.6), transparent);
  margin: 0 auto 40px;
`;

const SectionTitle = styled.h2`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: #87ceeb;
  margin-bottom: 30px;
  text-align: center;
`;

const ParagraphLarge = styled.p`
  font-size: 24px;
  font-weight: 300;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  max-width: 900px;
  margin: 0 auto 30px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Paragraph = styled.p`
  font-size: 16px;
  font-weight: 300;
  line-height: 2;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 70px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 50px;
  }
`;

const ValueCard = styled.div`
  text-align: center;
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(135, 206, 235, 0.08);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 1px;
    background: rgba(135, 206, 235, 0.4);
    transition: width 0.4s ease;
  }

  &:hover {
    border-color: rgba(135, 206, 235, 0.2);
    background: rgba(135, 206, 235, 0.03);

    &::before {
      width: 80px;
    }
  }
`;

const ValueNumber = styled.div`
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 3px;
  color: rgba(135, 206, 235, 0.5);
  margin-bottom: 20px;
`;

const ValueTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.9);
`;

const ValueDescription = styled.p`
  font-size: 13px;
  font-weight: 300;
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.5);
`;

const QuoteSection = styled.section`
  text-align: center;
  padding: 80px 0;
  margin: 60px 0;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.3), transparent);
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
  }
`;

const Quote = styled.blockquote`
  font-size: 28px;
  font-weight: 200;
  letter-spacing: 2px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-top: 80px;
  padding: 50px 0;
  border-top: 1px solid rgba(135, 206, 235, 0.08);
  border-bottom: 1px solid rgba(135, 206, 235, 0.08);

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 42px;
  font-weight: 200;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const StatLabel = styled.div`
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(135, 206, 235, 0.6);
`;

const ContactSection = styled.section`
  text-align: center;
  padding: 80px 40px;
  background: rgba(135, 206, 235, 0.02);
  border: 1px solid rgba(135, 206, 235, 0.08);
  margin-top: 80px;
  animation: ${fadeIn} 0.8s ease;
  animation-delay: 0.6s;
  animation-fill-mode: both;
`;

const ContactTitle = styled.h2`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: #87ceeb;
  margin-bottom: 25px;
`;

const ContactText = styled.p`
  font-size: 15px;
  font-weight: 300;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 35px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const ContactButton = styled.a`
  display: inline-block;
  background: transparent;
  border: 1px solid rgba(135, 206, 235, 0.4);
  color: rgba(255, 255, 255, 0.9);
  padding: 16px 45px;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    border-color: rgba(135, 206, 235, 0.7);
    color: #87ceeb;
    box-shadow: 0 0 30px rgba(135, 206, 235, 0.15);

    &::before {
      left: 100%;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 40px;
`;

const SocialLink = styled.a`
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 1px;
    background: #87ceeb;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #87ceeb;

    &::after {
      width: 100%;
    }
  }
`;

const BackgroundGlow = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(135, 206, 235, 0.03) 0%, transparent 70%);
  pointer-events: none;
  animation: ${pulseGlow} 8s ease-in-out infinite;
  z-index: 0;
`;

const valori = [
  {
    number: '01',
    title: 'Il Suono',
    description: 'Minimal deep tech nella sua forma più pura. Groove ipnotici, bassi profondi, percussioni che parlano al corpo. Nessun compromesso commerciale.'
  },
  {
    number: '02',
    title: 'Lo Spazio',
    description: 'Location selezionate con cura. Acustica, atmosfera, capienza. Ogni dettaglio tecnico è pensato per esaltare la musica e chi la vive.'
  },
  {
    number: '03',
    title: 'La Comunità',
    description: 'Non un pubblico, ma una comunità. Persone che condividono la stessa passione per il suono underground e il rispetto reciproco.'
  }
];

const ChiSiamo: React.FC = () => {
  const [yearsActive, setYearsActive] = useState(0);

  useEffect(() => {
    const startYear = 2019;
    const currentYear = new Date().getFullYear();
    setYearsActive(currentYear - startYear);
  }, []);

  return (
    <PageContainer>
      <Helmet>
        <title>Chi Siamo - BLEND | Minimal Deep Tech Collective</title>
        <meta name="description" content="BLEND è un collettivo dedicato alla musica elettronica underground. Minimal deep tech, tech house, atmosfere notturne." />
      </Helmet>

      <BackgroundGlow />

      <Header showLogo={true} />

      <MainContent>
        <HeroSection>
          <PageTitle>Blend</PageTitle>
          <HeroSubtitle>Minimal Deep Tech Collective</HeroSubtitle>
        </HeroSection>

        <ContentSection delay={0.2}>
          <SectionDivider />
          <ParagraphLarge>
            BLEND nasce dalla passione per il suono underground e dalla volontà di creare
            esperienze sonore autentiche, lontane dai circuiti mainstream.
          </ParagraphLarge>
          <Paragraph>
            Dal 2019 organizziamo eventi dedicati al minimal deep tech e tech house,
            selezionando artisti che condividono la nostra visione musicale.
            Non cerchiamo grandi numeri, cerchiamo le persone giuste.
          </Paragraph>
        </ContentSection>

        <QuoteSection>
          <Quote>
            "La musica elettronica non si ascolta, si vive.
            E si vive meglio insieme."
          </Quote>
        </QuoteSection>

        <ContentSection delay={0.3}>
          <SectionTitle>I Nostri Principi</SectionTitle>
          <ValuesGrid>
            {valori.map((valore) => (
              <ValueCard key={valore.number}>
                <ValueNumber>{valore.number}</ValueNumber>
                <ValueTitle>{valore.title}</ValueTitle>
                <ValueDescription>{valore.description}</ValueDescription>
              </ValueCard>
            ))}
          </ValuesGrid>
        </ContentSection>

        <ContentSection delay={0.4}>
          <StatsSection>
            <StatItem>
              <StatNumber>{yearsActive}+</StatNumber>
              <StatLabel>Anni di attività</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>50+</StatNumber>
              <StatLabel>Eventi organizzati</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>100+</StatNumber>
              <StatLabel>Artisti ospitati</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>1</StatNumber>
              <StatLabel>Obiettivo</StatLabel>
            </StatItem>
          </StatsSection>
        </ContentSection>

        <ContentSection delay={0.5}>
          <SectionTitle>La Nostra Storia</SectionTitle>
          <Paragraph>
            Tutto è iniziato in una cantina di Bologna, tra vinili e casse autocostruite.
            Un gruppo di amici con la stessa ossessione per il groove minimale e le atmosfere
            notturne. Niente pretese, solo musica vera e voglia di condividerla.
          </Paragraph>
          <br /><br />
          <Paragraph>
            Col tempo le cantine sono diventate club, i pochi amici una comunità.
            Ma la sostanza non è cambiata: selezione musicale rigorosa, attenzione maniacale
            al suono, rispetto per chi viene a ballare. Il resto viene da sé.
          </Paragraph>
        </ContentSection>

        <ContactSection>
          <ContactTitle>Contatti</ContactTitle>
          <ContactText>
            Per booking, collaborazioni o semplicemente per salutare.
            Rispondiamo sempre, a volte ci mettiamo un po'.
          </ContactText>
          <ContactButton href="mailto:info@blendassociation.com">
            Scrivici
          </ContactButton>
          <SocialLinks>
            <SocialLink href="https://instagram.com/blend" target="_blank" rel="noopener noreferrer">
              Instagram
            </SocialLink>
            <SocialLink href="https://soundcloud.com/blend" target="_blank" rel="noopener noreferrer">
              Soundcloud
            </SocialLink>
            <SocialLink href="https://ra.co/promoters/blend" target="_blank" rel="noopener noreferrer">
              Resident Advisor
            </SocialLink>
          </SocialLinks>
        </ContactSection>
      </MainContent>
    </PageContainer>
  );
};

export default ChiSiamo;
