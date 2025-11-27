import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Helmet } from 'react-helmet';

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

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
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
    height: 100%;
    background-image: 
      radial-gradient(1px 1px at 25px 5px, white, rgba(255, 255, 255, 0)),
      radial-gradient(1px 1px at 50px 25px, white, rgba(255, 255, 255, 0)),
      radial-gradient(1px 1px at 125px 20px, white, rgba(255, 255, 255, 0));
    background-repeat: repeat;
    background-size: 350px 350px;
    opacity: 0.1;
    animation: ${float} 20s ease-in-out infinite;
    z-index: 0;
  }
`;

const Header = styled.header`
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
  
  @media (max-width: 768px) {
    padding: 0 3%;
    height: 70px;
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
`;

const NavLinks = styled.div`
  display: flex;
  gap: 40px;
  z-index: 1;
  
  @media (max-width: 768px) {
    gap: 20px;
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
  }
`;

const MainContent = styled.main`
  position: relative;
  z-index: 1;
  padding: 60px 5% 80px;
  
  @media (max-width: 768px) {
    padding: 40px 3% 60px;
  }
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 100px;
  animation: ${fadeIn} 0.8s ease;
  
  @media (max-width: 768px) {
    margin-bottom: 60px;
  }
`;

const PageTitle = styled.h1`
  font-size: 56px;
  font-weight: 300;
  margin-bottom: 30px;
  letter-spacing: 8px;
  text-transform: uppercase;
  background: linear-gradient(45deg, #4682b4, #87ceeb, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 40px;
    letter-spacing: 4px;
  }
  
  @media (max-width: 480px) {
    font-size: 32px;
    letter-spacing: 2px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 24px;
  opacity: 0.9;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const ContentSection = styled.section`
  max-width: 1200px;
  margin: 0 auto 100px;
  
  @media (max-width: 768px) {
    margin-bottom: 60px;
  }
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  margin-bottom: 100px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
    margin-bottom: 60px;
  }
`;

const TextColumn = styled.div<{ reverse?: boolean }>`
  animation: ${props => props.reverse ? slideInRight : slideInLeft} 1s ease;
  
  @media (max-width: 768px) {
    order: ${props => props.reverse ? 1 : 0};
  }
`;

const ImageColumn = styled.div<{ reverse?: boolean }>`
  animation: ${props => props.reverse ? slideInLeft : slideInRight} 1s ease;
  
  @media (max-width: 768px) {
    order: ${props => props.reverse ? 0 : 1};
  }
`;

const SectionTitle = styled.h2`
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 30px;
  letter-spacing: 3px;
  color: #4682b4;
  
  @media (max-width: 768px) {
    font-size: 32px;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const SectionText = styled.p`
  font-size: 18px;
  line-height: 1.8;
  opacity: 0.9;
  margin-bottom: 25px;
  
  @media (max-width: 768px) {
    font-size: 16px;
    text-align: center;
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 400px;
  background: linear-gradient(45deg, rgba(70, 130, 180, 0.3), rgba(100, 149, 237, 0.3));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transform: translateX(-100%);
    animation: shimmer 3s infinite;
  }
  
  @keyframes shimmer {
    to {
      transform: translateX(100%);
    }
  }
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const ValuesSection = styled.section`
  margin-bottom: 100px;
  text-align: center;
  animation: ${fadeIn} 1.2s ease;
  
  @media (max-width: 768px) {
    margin-bottom: 60px;
  }
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
    margin-top: 40px;
  }
`;

const ValueCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px 30px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
    border-color: rgba(70, 130, 180, 0.5);
    animation: ${pulse} 2s infinite;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #4682b4, #87ceeb);
    transform: scaleX(0);
    transition: transform 0.4s ease;
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
`;

const ValueIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
  animation: ${float} 3s ease-in-out infinite;
`;

const ValueTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #4682b4;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const ValueDescription = styled.p`
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.8;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const TeamSection = styled.section`
  margin-bottom: 100px;
  animation: ${fadeIn} 1.4s ease;
  
  @media (max-width: 768px) {
    margin-bottom: 60px;
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  margin-top: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-top: 40px;
  }
`;

const TeamCard = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  transition: all 0.4s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    border-color: rgba(70, 130, 180, 0.5);
  }
`;

const TeamImagePlaceholder = styled.div`
  width: 150px;
  height: 150px;
  background: linear-gradient(45deg, rgba(70, 130, 180, 0.4), rgba(100, 149, 237, 0.4));
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  color: rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transform: translateX(-100%);
    animation: shimmer 3s infinite;
  }
`;

const TeamName = styled.h3`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #4682b4;
`;

const TeamRole = styled.div`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 15px;
  opacity: 0.8;
`;

const TeamDescription = styled.p`
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.7;
`;

const ContactSection = styled.section`
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  padding: 60px 40px;
  animation: ${fadeIn} 1.6s ease;
  
  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const ContactTitle = styled.h2`
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #4682b4;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const ContactText = styled.p`
  font-size: 18px;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ContactButton = styled.button`
  background: linear-gradient(45deg, #4682b4, #87ceeb);
  border: none;
  color: white;
  padding: 18px 40px;
  border-radius: 50px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
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
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(70, 130, 180, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  @media (max-width: 768px) {
    padding: 15px 30px;
    font-size: 14px;
  }
`;

const valori = [
  {
    icon: '✨',
    title: 'Eccellenza',
    description: 'Ogni dettaglio è curato con la massima attenzione per garantire eventi di altissimo livello.'
  },
  {
    icon: '🎯',
    title: 'Personalizzazione',
    description: 'Ogni evento è unico, progettato su misura per riflettere la personalità dei nostri clienti.'
  },
  {
    icon: '💫',
    title: 'Innovazione',
    description: 'Utilizziamo le tecnologie più avanzate e le tendenze più attuali del settore.'
  },
  {
    icon: '🤝',
    title: 'Affidabilità',
    description: 'Il nostro team è sempre presente per garantire la perfetta riuscita di ogni evento.'
  }
];

const teamMembers = [
  {
    name: 'Marco Rossini',
    role: 'Founder & Creative Director',
    description: 'Con oltre 15 anni di esperienza nel settore, Marco è la mente creativa dietro i nostri eventi più spettacolari.'
  },
  {
    name: 'Giulia Bianchi',
    role: 'Event Manager',
    description: 'Specialista nella gestione operativa, Giulia coordina ogni aspetto logistico con precisione maniacale.'
  },
  {
    name: 'Alessandro Verdi',
    role: 'Technical Director',
    description: 'Esperto in tecnologie audio-video e allestimenti, Alessandro trasforma le idee creative in realtà.'
  },
  {
    name: 'Sofia Neri',
    role: 'Marketing & Social Media',
    description: 'Sofia gestisce la comunicazione e le relazioni pubbliche, portando i nostri eventi sotto i riflettori.'
  }
];

const ChiSiamo: React.FC = () => {
  return (
    <PageContainer>
      <Helmet>
        <title>Chi Siamo - BLEND | La Nostra Storia</title>
        <meta name="description" content="Scopri la storia di BLEND, il nostro team e i valori che ci guidano nell'organizzazione di eventi esclusivi e memorabili." />
      </Helmet>

      <Header>
        <Logo to="/">Blend</Logo>
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/eventi">Eventi</NavLink>
          <NavLink to="/galleria">Galleria</NavLink>
          <NavLink to="/chi-siamo">Chi Siamo</NavLink>
        </NavLinks>
      </Header>

      <MainContent>
        <HeroSection>
          <PageTitle>Chi Siamo</PageTitle>
          <HeroSubtitle>
            Siamo i narratori di momenti indimenticabili, gli architetti di emozioni 
            e i custodi dei vostri sogni più preziosi.
          </HeroSubtitle>
        </HeroSection>

        <ContentSection>
          <TwoColumnLayout>
            <TextColumn>
              <SectionTitle>La Nostra Storia</SectionTitle>
              <SectionText>
                Fondata nel 2018 da un gruppo di professionisti appassionati del settore eventi, 
                BLEND nasce dall'idea di creare esperienze che vanno oltre le aspettative. 
                Il nostro nome rappresenta la perfetta fusione di creatività, professionalità 
                e attenzione ai dettagli.
              </SectionText>
              <SectionText>
                In questi anni abbiamo organizzato oltre 300 eventi, dai matrimoni più romantici 
                agli eventi corporate più innovativi, sempre con lo stesso obiettivo: 
                trasformare le vostre visioni in realtà spettacolari.
              </SectionText>
            </TextColumn>
            <ImageColumn>
              <ImagePlaceholder>La Nostra Storia</ImagePlaceholder>
            </ImageColumn>
          </TwoColumnLayout>

          <TwoColumnLayout>
            <ImageColumn reverse>
              <ImagePlaceholder>La Nostra Missione</ImagePlaceholder>
            </ImageColumn>
            <TextColumn reverse>
              <SectionTitle>La Nostra Missione</SectionTitle>
              <SectionText>
                Crediamo che ogni evento sia un'opportunità unica per creare connessioni autentiche 
                e momenti che rimarranno nel cuore per sempre. La nostra missione è quella di 
                trasformare ogni celebrazione in un'esperienza straordinaria.
              </SectionText>
              <SectionText>
                Attraverso un approccio personalizzato e una cura maniacale per i dettagli, 
                ci impegniamo a superare ogni aspettativa, creando eventi che riflettono 
                perfettamente la personalità e i desideri dei nostri clienti.
              </SectionText>
            </TextColumn>
          </TwoColumnLayout>
        </ContentSection>

        <ValuesSection>
          <SectionTitle style={{ textAlign: 'center', fontSize: '48px', marginBottom: '20px' }}>
            I Nostri Valori
          </SectionTitle>
          <SectionText style={{ textAlign: 'center', fontSize: '20px', maxWidth: '800px', margin: '0 auto' }}>
            Questi principi guidano ogni nostra decisione e caratterizzano il nostro approccio al lavoro.
          </SectionText>
          
          <ValuesGrid>
            {valori.map((valore, index) => (
              <ValueCard key={index} style={{ animationDelay: `${index * 0.2}s` }}>
                <ValueIcon>{valore.icon}</ValueIcon>
                <ValueTitle>{valore.title}</ValueTitle>
                <ValueDescription>{valore.description}</ValueDescription>
              </ValueCard>
            ))}
          </ValuesGrid>
        </ValuesSection>

        <TeamSection>
          <SectionTitle style={{ textAlign: 'center', fontSize: '48px', marginBottom: '20px' }}>
            Il Nostro Team
          </SectionTitle>
          <SectionText style={{ textAlign: 'center', fontSize: '20px', maxWidth: '800px', margin: '0 auto' }}>
            Un gruppo di professionisti appassionati, ognuno con competenze uniche e 
            una visione condivisa dell'eccellenza.
          </SectionText>
          
          <TeamGrid>
            {teamMembers.map((member, index) => (
              <TeamCard key={index} style={{ animationDelay: `${index * 0.2}s` }}>
                <TeamImagePlaceholder>👤</TeamImagePlaceholder>
                <TeamName>{member.name}</TeamName>
                <TeamRole>{member.role}</TeamRole>
                <TeamDescription>{member.description}</TeamDescription>
              </TeamCard>
            ))}
          </TeamGrid>
        </TeamSection>

        <ContactSection>
          <ContactTitle>Pronto a Creare Qualcosa di Straordinario?</ContactTitle>
          <ContactText>
            Ogni grande evento inizia con una conversazione. Raccontaci la tua visione 
            e lascia che trasformiamo i tuoi sogni in una realtà indimenticabile.
          </ContactText>
          <ContactButton onClick={() => window.location.href = 'mailto:info@blend-eventi.com'}>
            Contattaci Ora
          </ContactButton>
        </ContactSection>
      </MainContent>
    </PageContainer>
  );
};

export default ChiSiamo;