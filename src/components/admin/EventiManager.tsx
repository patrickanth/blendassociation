import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { eventiService } from '../../services/eventiService';
import { Evento } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ImageUpload from '../common/ImageUpload';

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

const Container = styled.div`
  animation: ${fadeIn} 0.6s ease;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 300;
  margin: 0;
  letter-spacing: 2px;
  background: linear-gradient(45deg, #4682b4, #87ceeb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const AddButton = styled.button`
  background: linear-gradient(45deg, rgba(40, 167, 69, 0.8), rgba(25, 135, 84, 0.8));
  border: 1px solid rgba(40, 167, 69, 0.5);
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(40, 167, 69, 0.4);
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EventCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.8s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const EventImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(45deg, rgba(70, 130, 180, 0.3), rgba(100, 149, 237, 0.3));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const EventContent = styled.div`
  padding: 20px;
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const EventTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
  flex: 1;
`;

const StatusBadge = styled.span<{ pubblicato: boolean }>`
  background: ${props => props.pubblicato 
    ? 'rgba(40, 167, 69, 0.3)' 
    : 'rgba(255, 193, 7, 0.3)'};
  color: ${props => props.pubblicato ? '#28a745' : '#ffc107'};
  border: 1px solid ${props => props.pubblicato 
    ? 'rgba(40, 167, 69, 0.5)' 
    : 'rgba(255, 193, 7, 0.5)'};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-left: 10px;
`;

const EventMeta = styled.div`
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 15px;
`;

const EventDescription = styled.p`
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
  opacity: 0.8;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const EventLineup = styled.div`
  font-size: 12px;
  margin-bottom: 15px;
  color: #87ceeb;
  
  span {
    font-weight: 600;
    color: white;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' | 'toggle' }>`
  background: ${props => {
    switch (props.variant) {
      case 'edit': return 'rgba(23, 162, 184, 0.3)';
      case 'delete': return 'rgba(220, 53, 69, 0.3)';
      case 'toggle': return 'rgba(255, 193, 7, 0.3)';
      default: return 'rgba(108, 117, 125, 0.3)';
    }
  }};
  border: 1px solid ${props => {
    switch (props.variant) {
      case 'edit': return 'rgba(23, 162, 184, 0.5)';
      case 'delete': return 'rgba(220, 53, 69, 0.5)';
      case 'toggle': return 'rgba(255, 193, 7, 0.5)';
      default: return 'rgba(108, 117, 125, 0.5)';
    }
  }};
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${fadeIn} 0.3s ease;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const ModalTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px;
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(70, 130, 180, 0.8);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px;
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(70, 130, 180, 0.8);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px;
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(70, 130, 180, 0.8);
    background: rgba(255, 255, 255, 0.15);
  }

  option {
    background: #1a1a1a;
    color: white;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;

  input[type="checkbox"] {
    accent-color: #4682b4;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  flex-wrap: wrap;
`;

const SubmitButton = styled.button`
  background: linear-gradient(45deg, rgba(40, 167, 69, 0.8), rgba(25, 135, 84, 0.8));
  border: 1px solid rgba(40, 167, 69, 0.5);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(40, 167, 69, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled.button`
  background: rgba(108, 117, 125, 0.3);
  border: 1px solid rgba(108, 117, 125, 0.5);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const LineupInput = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;

  input {
    flex: 1;
  }

  button {
    background: rgba(70, 130, 180, 0.3);
    border: 1px solid rgba(70, 130, 180, 0.5);
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(70, 130, 180, 0.5);
    }
  }
`;

const LineupList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const LineupTag = styled.span`
  background: rgba(70, 130, 180, 0.2);
  border: 1px solid rgba(70, 130, 180, 0.5);
  color: #87ceeb;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }
`;

interface EventiManagerProps {
  onStatsUpdate?: () => void;
}

const EventiManager: React.FC<EventiManagerProps> = ({ onStatsUpdate }) => {
  const { user } = useAuth();
  const [eventi, setEventi] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lineupArtist, setLineupArtist] = useState('');

  const [formData, setFormData] = useState({
    titolo: '',
    descrizione: '',
    descrizioneBreve: '',
    data: '',
    dataFine: '',
    locationNome: '',
    locationIndirizzo: '',
    locationCitta: '',
    categoria: 'deep-tech' as 'deep-tech' | 'tech-house' | 'minimal' | 'afterparty' | 'special',
    lineup: [] as string[],
    ticketLink: '',
    prezzoDa: '',
    prezzoA: '',
    maxPartecipanti: '',
    caratteristiche: [] as string[],
    pubblicato: false,
    inEvidenza: false,
    immagini: [] as string[]
  });

  useEffect(() => {
    loadEventi();
  }, []);

  const loadEventi = async () => {
    try {
      setIsLoading(true);
      const eventiData = await eventiService.getEventi();
      setEventi(eventiData);
      if (onStatsUpdate) onStatsUpdate();
    } catch (error) {
      console.error('Errore nel caricamento degli eventi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (evento?: Evento) => {
    if (evento) {
      setEditingEvento(evento);
      setFormData({
        titolo: evento.titolo,
        descrizione: evento.descrizione,
        descrizioneBreve: evento.descrizioneBreve || '',
        data: evento.data.toISOString().slice(0, 16),
        dataFine: evento.dataFine ? evento.dataFine.toISOString().slice(0, 16) : '',
        locationNome: evento.location.nome,
        locationIndirizzo: evento.location.indirizzo,
        locationCitta: evento.location.citta,
        categoria: evento.categoria,
        lineup: evento.lineup || [],
        ticketLink: evento.ticketLink || '',
        prezzoDa: evento.prezzo?.da.toString() || '',
        prezzoA: evento.prezzo?.a?.toString() || '',
        maxPartecipanti: evento.maxPartecipanti?.toString() || '',
        caratteristiche: evento.caratteristiche,
        pubblicato: evento.pubblicato,
        inEvidenza: evento.inEvidenza,
        immagini: evento.immagini
      });
    } else {
      setEditingEvento(null);
      setFormData({
        titolo: '',
        descrizione: '',
        descrizioneBreve: '',
        data: '',
        dataFine: '',
        locationNome: '',
        locationIndirizzo: '',
        locationCitta: '',
        categoria: 'deep-tech',
        lineup: [],
        ticketLink: '',
        prezzoDa: '',
        prezzoA: '',
        maxPartecipanti: '',
        caratteristiche: [],
        pubblicato: false,
        inEvidenza: false,
        immagini: []
      });
    }
    setLineupArtist('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvento(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      setIsSubmitting(true);

      const eventoData: Omit<Evento, 'id' | 'createdAt' | 'updatedAt'> = {
        titolo: formData.titolo,
        descrizione: formData.descrizione,
        descrizioneBreve: formData.descrizioneBreve,
        data: new Date(formData.data),
        dataFine: formData.dataFine ? new Date(formData.dataFine) : undefined,
        location: {
          nome: formData.locationNome,
          indirizzo: formData.locationIndirizzo,
          citta: formData.locationCitta
        },
        categoria: formData.categoria,
        lineup: formData.lineup,
        ticketLink: formData.ticketLink || undefined,
        prezzo: formData.prezzoDa ? {
          da: parseInt(formData.prezzoDa),
          a: formData.prezzoA ? parseInt(formData.prezzoA) : undefined,
          valuta: 'EUR'
        } : undefined,
        maxPartecipanti: formData.maxPartecipanti ? parseInt(formData.maxPartecipanti) : undefined,
        caratteristiche: formData.caratteristiche,
        pubblicato: formData.pubblicato,
        inEvidenza: formData.inEvidenza,
        immagini: formData.immagini,
        createdBy: user.uid
      };

      if (editingEvento) {
        await eventiService.updateEvento(editingEvento.id, eventoData);
      } else {
        await eventiService.createEvento(eventoData);
      }

      closeModal();
      loadEventi();
    } catch (error) {
      console.error('Errore nel salvataggio dell\'evento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (eventoId: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo evento?')) return;

    try {
      await eventiService.deleteEvento(eventoId);
      loadEventi();
    } catch (error) {
      console.error('Errore nell\'eliminazione dell\'evento:', error);
    }
  };

  const togglePubblicazione = async (evento: Evento) => {
    try {
      await eventiService.updateEvento(evento.id, {
        pubblicato: !evento.pubblicato
      });
      loadEventi();
    } catch (error) {
      console.error('Errore nel cambio di pubblicazione:', error);
    }
  };

  const handleCaratteristicheChange = (caratteristica: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        caratteristiche: [...prev.caratteristiche, caratteristica]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        caratteristiche: prev.caratteristiche.filter(c => c !== caratteristica)
      }));
    }
  };

  const addLineupArtist = () => {
    if (lineupArtist.trim()) {
      setFormData(prev => ({
        ...prev,
        lineup: [...prev.lineup, lineupArtist.trim()]
      }));
      setLineupArtist('');
    }
  };

  const removeLineupArtist = (index: number) => {
    setFormData(prev => ({
      ...prev,
      lineup: prev.lineup.filter((_, i) => i !== index)
    }));
  };

  const caratteristicheDisponibili = [
    'Sound System Funktion One', 'Visual Show', 'Open Air', 'Rooftop', 
    'Underground', '360° Stage', 'Live Stream', 'After Hours', 
    'Limited Capacity', 'BYOB', 'Art Installation', 'Secret Location'
  ];

  if (isLoading) {
    return <LoadingSpinner text="Caricamento eventi..." />;
  }

  return (
    <Container>
      <Header>
        <Title>Gestione Eventi</Title>
        <AddButton onClick={() => openModal()}>
          + Nuovo Evento
        </AddButton>
      </Header>

      <EventsGrid>
        {eventi.map(evento => (
          <EventCard key={evento.id}>
            {evento.immagini.length > 0 ? (
              <EventImage src={evento.immagini[0]} alt={evento.titolo} />
            ) : (
              <EventImagePlaceholder>
                Nessuna Immagine
              </EventImagePlaceholder>
            )}
            
            <EventContent>
              <EventHeader>
                <EventTitle>{evento.titolo}</EventTitle>
                <StatusBadge pubblicato={evento.pubblicato}>
                  {evento.pubblicato ? 'Live' : 'Draft'}
                </StatusBadge>
              </EventHeader>

              <EventMeta>
                📅 {evento.data.toLocaleDateString('it-IT')} • 
                📍 {evento.location.citta} • 
                🎵 {evento.categoria}
              </EventMeta>

              {evento.lineup && evento.lineup.length > 0 && (
                <EventLineup>
                  <span>Line-up:</span> {evento.lineup.slice(0, 3).join(', ')}
                  {evento.lineup.length > 3 && ` +${evento.lineup.length - 3}`}
                </EventLineup>
              )}

              <EventDescription>{evento.descrizione}</EventDescription>

              <ActionButtons>
                <ActionButton variant="edit" onClick={() => openModal(evento)}>
                  Modifica
                </ActionButton>
                <ActionButton variant="toggle" onClick={() => togglePubblicazione(evento)}>
                  {evento.pubblicato ? 'Nascondi' : 'Pubblica'}
                </ActionButton>
                <ActionButton variant="delete" onClick={() => handleDelete(evento.id)}>
                  Elimina
                </ActionButton>
              </ActionButtons>
            </EventContent>
          </EventCard>
        ))}
      </EventsGrid>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingEvento ? 'Modifica Evento' : 'Nuovo Evento'}
            </ModalTitle>
            <CloseButton onClick={closeModal}>×</CloseButton>
          </ModalHeader>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Titolo *</Label>
              <Input
                type="text"
                value={formData.titolo}
                onChange={(e) => setFormData(prev => ({ ...prev, titolo: e.target.value }))}
                required
                placeholder="Nome dell'evento"
              />
            </FormGroup>

            <FormGroup>
              <Label>Descrizione *</Label>
              <TextArea
                value={formData.descrizione}
                onChange={(e) => setFormData(prev => ({ ...prev, descrizione: e.target.value }))}
                required
                placeholder="Descrizione completa dell'evento"
              />
            </FormGroup>

            <FormGroup>
              <Label>Descrizione Breve</Label>
              <Input
                type="text"
                value={formData.descrizioneBreve}
                onChange={(e) => setFormData(prev => ({ ...prev, descrizioneBreve: e.target.value }))}
                placeholder="Breve descrizione per l'anteprima"
              />
            </FormGroup>

            <FormGroup>
              <Label>Data Inizio *</Label>
              <Input
                type="datetime-local"
                value={formData.data}
                onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Data Fine</Label>
              <Input
                type="datetime-local"
                value={formData.dataFine}
                onChange={(e) => setFormData(prev => ({ ...prev, dataFine: e.target.value }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Venue *</Label>
              <Input
                type="text"
                value={formData.locationNome}
                onChange={(e) => setFormData(prev => ({ ...prev, locationNome: e.target.value }))}
                required
                placeholder="Nome del locale/venue"
              />
            </FormGroup>

            <FormGroup>
              <Label>Indirizzo *</Label>
              <Input
                type="text"
                value={formData.locationIndirizzo}
                onChange={(e) => setFormData(prev => ({ ...prev, locationIndirizzo: e.target.value }))}
                required
                placeholder="Indirizzo completo"
              />
            </FormGroup>

            <FormGroup>
              <Label>Città *</Label>
              <Input
                type="text"
                value={formData.locationCitta}
                onChange={(e) => setFormData(prev => ({ ...prev, locationCitta: e.target.value }))}
                required
                placeholder="Città"
              />
            </FormGroup>

            <FormGroup>
              <Label>Genere *</Label>
              <Select
                value={formData.categoria}
                onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value as any }))}
                required
              >
                <option value="deep-tech">Deep Tech</option>
                <option value="tech-house">Tech House</option>
                <option value="minimal">Minimal</option>
                <option value="afterparty">Afterparty</option>
                <option value="special">Special Event</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Line-up</Label>
              <LineupInput>
                <Input
                  type="text"
                  value={lineupArtist}
                  onChange={(e) => setLineupArtist(e.target.value)}
                  placeholder="Nome artista/DJ"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addLineupArtist();
                    }
                  }}
                />
                <button type="button" onClick={addLineupArtist}>
                  Aggiungi
                </button>
              </LineupInput>
              <LineupList>
                {formData.lineup.map((artist, index) => (
                  <LineupTag key={index}>
                    {artist}
                    <button type="button" onClick={() => removeLineupArtist(index)}>
                      ×
                    </button>
                  </LineupTag>
                ))}
              </LineupList>
            </FormGroup>

            <FormGroup>
              <Label>Link Biglietti</Label>
              <Input
                type="url"
                value={formData.ticketLink}
                onChange={(e) => setFormData(prev => ({ ...prev, ticketLink: e.target.value }))}
                placeholder="https://..."
              />
            </FormGroup>

            <FormGroup>
              <Label>Prezzo (€)</Label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Input
                  type="number"
                  value={formData.prezzoDa}
                  onChange={(e) => setFormData(prev => ({ ...prev, prezzoDa: e.target.value }))}
                  placeholder="Da"
                />
                <Input
                  type="number"
                  value={formData.prezzoA}
                  onChange={(e) => setFormData(prev => ({ ...prev, prezzoA: e.target.value }))}
                  placeholder="A (opzionale)"
                />
              </div>
            </FormGroup>

            <FormGroup>
              <Label>Max Partecipanti</Label>
              <Input
                type="number"
                value={formData.maxPartecipanti}
                onChange={(e) => setFormData(prev => ({ ...prev, maxPartecipanti: e.target.value }))}
                placeholder="Capacità massima"
              />
            </FormGroup>

            <FormGroup>
              <Label>Caratteristiche</Label>
              <CheckboxGroup>
                {caratteristicheDisponibili.map(caratteristica => (
                  <CheckboxLabel key={caratteristica}>
                    <input
                      type="checkbox"
                      checked={formData.caratteristiche.includes(caratteristica)}
                      onChange={(e) => handleCaratteristicheChange(caratteristica, e.target.checked)}
                    />
                    {caratteristica}
                  </CheckboxLabel>
                ))}
              </CheckboxGroup>
            </FormGroup>

            <FormGroup>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={formData.pubblicato}
                  onChange={(e) => setFormData(prev => ({ ...prev, pubblicato: e.target.checked }))}
                />
                Pubblica evento
              </CheckboxLabel>
            </FormGroup>

            <FormGroup>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={formData.inEvidenza}
                  onChange={(e) => setFormData(prev => ({ ...prev, inEvidenza: e.target.checked }))}
                />
                Metti in evidenza
              </CheckboxLabel>
            </FormGroup>

            <FormGroup>
              <Label>Immagini</Label>
              <ImageUpload
                onFilesChange={(files) => {
                  console.log('Files selected:', files);
                }}
                existingImages={formData.immagini}
                onRemoveExisting={(url) => {
                  setFormData(prev => ({
                    ...prev,
                    immagini: prev.immagini.filter(img => img !== url)
                  }));
                }}
              />
            </FormGroup>

            <FormActions>
              <CancelButton type="button" onClick={closeModal}>
                Annulla
              </CancelButton>
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvataggio...' : 'Salva Evento'}
              </SubmitButton>
            </FormActions>
          </Form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default EventiManager;