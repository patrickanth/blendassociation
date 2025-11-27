import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Helmet } from 'react-helmet';
import { eventiService } from '../../services/eventiService';
import { Evento } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import Header from '../common/Header';

// Animazioni
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glitch = keyframes`
  0% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    transform: translate(0);
  }
  2% {
    clip-path: polygon(0 10%, 100% 10%, 100% 90%, 0 90%);
    transform: translate(-5px, 0);
  }
  4% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    transform: translate(5px, 0);
  }
  6% {
    clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%);
    transform: translate(5px, 0);
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

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #000000;
  color: white;
  font-family: 'Montserrat', sans-serif;
  overflow-x: hidden;
`;

const FilterBar = styled.div`
  background: #000;
  padding: 30px 5%;
  display: flex;
  gap: 30px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 20px 3%;
    gap: 15px;
  }
`;

const FilterButton = styled.button<{ active: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.active ? '#87ceeb' : 'rgba(255, 255, 255, 0.5)'};
  padding: 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '400'};
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: ${props => props.active ? '100%' : '0'};
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

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const MainContent = styled.main`
  padding: 40px 5%;

  @media (max-width: 768px) {
    padding: 20px 3%;
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
  animation: ${fadeIn} 2s ease;
`;

interface GlitchLetterProps {
  delay: number;
}

const GlitchLetter = styled.span<GlitchLetterProps>`
  display: inline-block;
  position: relative;
  opacity: 0;
  animation: ${glitch} 0.8s ${props => props.delay}s forwards;
`;

const ComingSoonText = styled.p`
  font-size: 18px;
  font-weight: 300;
  letter-spacing: 3px;
  margin-top: 30px;
  opacity: 0;
  animation: ${fadeIn} 1s 2.5s forwards;
  color: rgba(255, 255, 255, 0.8);
`;

const EventSection = styled.div`
  margin-bottom: 40px;
  animation: ${fadeIn} 0.8s ease;
`;

const EventContainer = styled.div<{ hasImage: boolean }>`
  display: grid;
  grid-template-columns: ${props => props.hasImage ? '400px 1fr' : '1fr'};
  gap: 40px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(70, 130, 180, 0.5);
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

    .event-image {
      transform: scale(1.05);
    }
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: transform 0.6s ease;

  @media (max-width: 1024px) {
    height: 250px;
  }
`;

const EventInfo = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const EventDate = styled.div`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #87ceeb;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const EventCategory = styled.div`
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 15px;
`;

const EventTitle = styled.h2`
  font-size: 32px;
  font-weight: 600;
  letter-spacing: 2px;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const EventLocation = styled.div`
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 15px;
`;

const EventLineup = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 20px;

  span {
    color: #87ceeb;
    font-weight: 600;
  }
`;

const ViewDetails = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover {
    background: white;
    color: black;
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

  useEffect(() => {
    loadEventi();
  }, []);

  const loadEventi = async () => {
    try {
      setIsLoading(true);
      // Usa il metodo ottimizzato che carica solo eventi pubblici
      const eventiData = await eventiService.getEventiPubblici();
      setEventi(eventiData);
    } catch (error) {
      console.error('Errore nel caricamento degli eventi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtra eventi con useMemo per ottimizzare performance
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

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner fullscreen text="Loading events..." />
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

      {/* Mostra filtri solo se ci sono eventi */}
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
              <div style={{ 
                fontSize: 'clamp(48px, 8vw, 96px)', 
                fontWeight: '300',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginBottom: '20px'
              }}>
                {"Next Event".split('').map((letter, index) => (
                  <GlitchLetter key={index} delay={index * 0.1}>
                    {letter === ' ' ? '\u00A0' : letter}
                  </GlitchLetter>
                ))}
              </div>
              <ComingSoonText>Coming Soon</ComingSoonText>
            </NoEventsText>
          </NoEventsContainer>
        ) : (
          filteredEventi.map((evento) => (
            <EventSection key={evento.id}>
              <EventContainer hasImage={evento.immagini.length > 0}>
                {evento.immagini.length > 0 && (
                  <EventImage 
                    className="event-image"
                    src={evento.immagini[0]} 
                  />
                )}
                
                <EventInfo className="event-info">
                  <EventDate className="event-date">
                    <span>{formatDate(evento.data)}</span>
                  </EventDate>
                  
                  <EventCategory>
                    {getCategoryLabel(evento.categoria)}
                  </EventCategory>
                  
                  <EventTitle>{evento.titolo}</EventTitle>
                  
                  <EventLocation>
                    {evento.location.nome} • {evento.location.citta}
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