import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Helmet } from 'react-helmet';
import { eventiService } from '../../services/eventiService';
import { Evento } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
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

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(135, 206, 235, 0.1);
  }
  50% {
    box-shadow: 0 0 40px rgba(135, 206, 235, 0.2);
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

const textReveal = keyframes`
  0% {
    clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
  }
  100% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #000000;
  color: white;
  font-family: 'Montserrat', sans-serif;
  overflow-x: hidden;
  position: relative;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.3), transparent);
    animation: ${scanline} 8s linear infinite;
    pointer-events: none;
    z-index: 1000;
  }
`;

const FilterBar = styled.div`
  background: rgba(0, 0, 0, 0.95);
  padding: 40px 5%;
  display: flex;
  gap: 40px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(135, 206, 235, 0.1);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.5), transparent);
  }

  @media (max-width: 768px) {
    padding: 25px 3%;
    gap: 20px;
  }
`;

const FilterButton = styled.button<{ active: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.active ? '#87ceeb' : 'rgba(255, 255, 255, 0.4)'};
  padding: 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: ${props => props.active ? '600' : '400'};
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: ${props => props.active ? '100%' : '0'};
    height: 1px;
    background: #87ceeb;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    color: #87ceeb;
    text-shadow: 0 0 20px rgba(135, 206, 235, 0.5);

    &::after {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    font-size: 11px;
    letter-spacing: 2px;
  }
`;

const MainContent = styled.main`
  padding: 60px 5%;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 30px 4%;
  }
`;

const NoEventsContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #000000;
`;

const NoEventsText = styled.div`
  text-align: center;
  animation: ${fadeIn} 1.5s ease;
`;

const NextEventTitle = styled.div`
  font-size: clamp(48px, 10vw, 120px);
  font-weight: 200;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  margin-bottom: 30px;
  animation: ${textReveal} 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  background: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(135,206,235,0.6) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ComingSoonText = styled.p`
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 6px;
  text-transform: uppercase;
  opacity: 0;
  animation: ${fadeIn} 1s 1s forwards;
  color: rgba(135, 206, 235, 0.7);
`;

const EventSection = styled.div`
  margin-bottom: 60px;
  animation: ${fadeIn} 0.8s ease;
  animation-fill-mode: both;

  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
`;

const EventContainer = styled.div<{ hasImage: boolean }>`
  display: grid;
  grid-template-columns: ${props => props.hasImage ? '450px 1fr' : '1fr'};
  gap: 50px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(135, 206, 235, 0.08);
  border-radius: 2px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(135, 206, 235, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(135, 206, 235, 0.2);
    transform: translateY(-3px);
    animation: ${pulseGlow} 2s ease infinite;

    .event-image {
      transform: scale(1.03);
      filter: brightness(1.1);
    }

    .event-date-text {
      text-shadow: 0 0 20px rgba(135, 206, 235, 0.8);
    }
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const EventImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 350px;

  @media (max-width: 1024px) {
    height: 280px;
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(0.9);
`;

const EventInfo = styled.div`
  padding: 45px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;

  @media (max-width: 768px) {
    padding: 30px 25px;
  }
`;

const EventDate = styled.div`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 4px;
  color: #87ceeb;
  margin-bottom: 12px;
  text-transform: uppercase;
  transition: all 0.3s ease;
`;

const EventCategory = styled.div`
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 20px;
`;

const EventTitle = styled.h2`
  font-size: 36px;
  font-weight: 300;
  letter-spacing: 4px;
  margin-bottom: 18px;
  text-transform: uppercase;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 26px;
    letter-spacing: 2px;
  }
`;

const EventLocation = styled.div`
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    width: 4px;
    height: 4px;
    background: rgba(135, 206, 235, 0.6);
    border-radius: 50%;
  }
`;

const EventLineup = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 30px;
  line-height: 1.8;

  span {
    color: rgba(135, 206, 235, 0.8);
    font-weight: 500;
    letter-spacing: 1px;
  }
`;

const ViewDetails = styled.button`
  background: transparent;
  border: 1px solid rgba(135, 206, 235, 0.3);
  color: rgba(255, 255, 255, 0.9);
  padding: 14px 32px;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  align-self: flex-start;
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
    border-color: rgba(135, 206, 235, 0.6);
    color: #87ceeb;
    box-shadow: 0 0 30px rgba(135, 206, 235, 0.15);

    &::before {
      left: 100%;
    }
  }
`;

const categorie = [
  { key: 'tutti', label: 'All Events' },
  { key: 'deep-tech', label: 'Deep Tech' },
  { key: 'tech-house', label: 'Tech House' },
  { key: 'minimal', label: 'Minimal' },
  { key: 'afterparty', label: 'Afterparty' },
  { key: 'special', label: 'Special' }
];

const Eventi: React.FC = () => {
  const [eventi, setEventi] = useState<Evento[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('tutti');
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    loadEventi();
  }, []);

  const loadEventi = async () => {
    try {
      // Quick timeout - if no response in 3 seconds, show empty state
      const timeoutPromise = new Promise<Evento[]>((resolve) => {
        setTimeout(() => resolve([]), 3000);
      });

      const eventiPromise = eventiService.getEventiPubblici();
      const eventiData = await Promise.race([eventiPromise, timeoutPromise]);
      setEventi(eventiData);
    } catch (error) {
      console.error('Errore nel caricamento degli eventi:', error);
      setEventi([]);
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  };

  const filteredEventi = useMemo(() => {
    if (selectedCategory === 'tutti') return eventi;
    return eventi.filter(evento => evento.categoria === selectedCategory);
  }, [eventi, selectedCategory]);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getCategoryLabel = (category: string): string => {
    const cat = categorie.find(c => c.key === category);
    return cat ? cat.label : category;
  };

  const formatLineup = (lineup?: string[]): string => {
    if (!lineup || lineup.length === 0) return '';
    if (lineup.length <= 3) return lineup.join(' • ');
    return `${lineup.slice(0, 3).join(' • ')} +${lineup.length - 3}`;
  };

  // Show loading only for first 1 second max, then show content
  if (isLoading && !hasLoaded) {
    return (
      <PageContainer>
        <LoadingSpinner fullscreen text="BLEND" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Helmet>
        <title>Eventi - BLEND | Minimal Deep Tech Events</title>
        <meta name="description" content="Scopri i prossimi eventi minimal deep tech e tech house organizzati da BLEND." />
      </Helmet>

      <Header showLogo={true} />

      {eventi.length > 0 && (
        <FilterBar>
          {categorie.map(categoria => (
            <FilterButton
              key={categoria.key}
              active={selectedCategory === categoria.key}
              onClick={() => setSelectedCategory(categoria.key)}
            >
              {categoria.label}
            </FilterButton>
          ))}
        </FilterBar>
      )}

      <MainContent>
        {filteredEventi.length === 0 ? (
          <NoEventsContainer>
            <NoEventsText>
              <NextEventTitle>Next Event</NextEventTitle>
              <ComingSoonText>Coming Soon</ComingSoonText>
            </NoEventsText>
          </NoEventsContainer>
        ) : (
          filteredEventi.map((evento) => (
            <EventSection key={evento.id}>
              <EventContainer hasImage={evento.immagini.length > 0}>
                {evento.immagini.length > 0 && (
                  <EventImageWrapper>
                    <EventImage
                      className="event-image"
                      src={evento.immagini[0]}
                      alt={evento.titolo}
                    />
                  </EventImageWrapper>
                )}

                <EventInfo>
                  <EventDate className="event-date-text">
                    {formatDate(evento.data)}
                  </EventDate>

                  <EventCategory>
                    {getCategoryLabel(evento.categoria)}
                  </EventCategory>

                  <EventTitle>{evento.titolo}</EventTitle>

                  <EventLocation>
                    {evento.location.nome} — {evento.location.citta}
                  </EventLocation>

                  {evento.lineup && evento.lineup.length > 0 && (
                    <EventLineup>
                      <span>Line-up:</span> {formatLineup(evento.lineup)}
                    </EventLineup>
                  )}

                  <ViewDetails>
                    {evento.ticketLink ? 'Get Tickets' : 'View Details'}
                  </ViewDetails>
                </EventInfo>
              </EventContainer>
            </EventSection>
          ))
        )}
      </MainContent>
    </PageContainer>
  );
};

export default Eventi;
