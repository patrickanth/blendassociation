import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { eventiService } from '../../services/eventiService';
import { Evento } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import Header from '../common/Header';

// ... (mantieni tutti gli styled components esistenti) ...

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #000000;
  color: white;
  font-family: 'Montserrat', sans-serif;
  overflow-x: hidden;
`;

// ... (resto degli styled components) ...

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