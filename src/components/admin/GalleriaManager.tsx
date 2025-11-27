import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { galleriaService } from '../../services/galleriaService';
import { eventiService } from '../../services/eventiService';
import { GalleriaItem, Evento } from '../../types';
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

const ManagerContainer = styled.div`
  animation: ${fadeIn} 0.6s ease;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 600;
  margin: 0;
  color: #4682b4;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${props => {
    switch (props.variant) {
      case 'danger':
        return `
          background: rgba(220, 53, 69, 0.2);
          border: 1px solid rgba(220, 53, 69, 0.5);
          color: #ff6b6b;
          
          &:hover {
            background: rgba(220, 53, 69, 0.4);
            transform: translateY(-2px);
          }
        `;
      case 'secondary':
        return `
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          
          &:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
          }
        `;
      default:
        return `
          background: rgba(70, 130, 180, 0.3);
          border: 1px solid rgba(70, 130, 180, 0.5);
          color: white;
          
          &:hover {
            background: rgba(70, 130, 180, 0.5);
            transform: translateY(-2px);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const GalleryGrid = styled.div`
  columns: 3;
  column-gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 1200px) {
    columns: 2;
  }
  
  @media (max-width: 768px) {
    columns: 1;
  }
`;

const GalleryCard = styled.div`
  break-inside: avoid;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(70, 130, 180, 0.5);
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const GalleryImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(45deg, rgba(70, 130, 180, 0.3), rgba(100, 149, 237, 0.3));
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
`;

const ItemContent = styled.div`
  padding: 20px;
`;

const ItemTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: white;
`;

const ItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 12px;
  opacity: 0.8;
`;

const ItemCategory = styled.span`
  background: rgba(70, 130, 180, 0.3);
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: 600;
`;

const ItemStatus = styled.span<{ pubblicato: boolean }>`
  background: ${props => props.pubblicato ? 'rgba(40, 167, 69, 0.3)' : 'rgba(255, 193, 7, 0.3)'};
  color: ${props => props.pubblicato ? '#28a745' : '#ffc107'};
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 10px;
`;

const ItemDescription = styled.p`
  font-size: 13px;
  line-height: 1.5;
  opacity: 0.8;
  margin-bottom: 15px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 15px;
`;

const Tag = styled.span`
  background: rgba(70, 130, 180, 0.2);
  color: rgba(70, 130, 180, 1);
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const SmallButton = styled.button<{ variant?: 'edit' | 'delete' | 'toggle' }>`
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${props => {
    switch (props.variant) {
      case 'delete':
        return `
          background: rgba(220, 53, 69, 0.3);
          color: #ff6b6b;
          &:hover { background: rgba(220, 53, 69, 0.5); }
        `;
      case 'toggle':
        return `
          background: rgba(255, 193, 7, 0.3);
          color: #ffc107;
          &:hover { background: rgba(255, 193, 7, 0.5); }
        `;
      default:
        return `
          background: rgba(70, 130, 180, 0.3);
          color: white;
          &:hover { background: rgba(70, 130, 180, 0.5); }
        `;
    }
  }}
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #4682b4;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  
  &:hover {
    opacity: 0.7;
  }
`;

const Form = styled.form`
  display: grid;
  gap: 25px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: white;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
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
  transition: all 0.3s ease;
  min-height: 80px;
  resize: vertical;

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
  align-items: center;
  gap: 10px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #4682b4;
`;

const TagInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  min-height: 44px;

  input {
    background: none;
    border: none;
    color: white;
    outline: none;
    flex: 1;
    min-width: 120px;
    padding: 4px;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

const TagItem = styled.span`
  background: rgba(70, 130, 180, 0.3);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;

  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    
    &:hover {
      opacity: 0.7;
    }
  }
`;

interface GalleriaManagerProps {
  onStatsUpdate: () => void;
}

const defaultGalleriaItem: Omit<GalleriaItem, 'id' | 'createdAt' | 'updatedAt'> = {
  titolo: '',
  descrizione: '',
  immagini: [],
  video: [],
  categoria: 'events',
  tags: [],
  data: new Date(),
  pubblicato: false,
  inEvidenza: false,
  createdBy: ''
};

const GalleriaManager: React.FC<GalleriaManagerProps> = ({ onStatsUpdate }) => {
  const { user } = useAuth();
  const [galleriaItems, setGalleriaItems] = useState<GalleriaItem[]>([]);
  const [eventi, setEventi] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleriaItem | null>(null);
  const [formData, setFormData] = useState(defaultGalleriaItem);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [galleriaData, eventiData] = await Promise.all([
        galleriaService.getGalleriaItems(),
        eventiService.getEventi()
      ]);
      setGalleriaItems(galleriaData);
      setEventi(eventiData);
      onStatsUpdate();
    } catch (error) {
      console.error('Errore nel caricamento dei dati:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (item?: GalleriaItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        ...item,
        createdBy: item.createdBy
      });
    } else {
      setEditingItem(null);
      setFormData({
        ...defaultGalleriaItem,
        createdBy: user?.uid || ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(defaultGalleriaItem);
    setTagInput('');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await galleriaService.updateGalleriaItem(editingItem.id, formData);
      } else {
        await galleriaService.createGalleriaItem({
          ...formData,
          createdBy: user.uid
        });
      }
      
      closeModal();
      loadData();
    } catch (error) {
      console.error('Errore nel salvare l\'elemento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo elemento?')) return;

    try {
      await galleriaService.deleteGalleriaItem(itemId);
      loadData();
    } catch (error) {
      console.error('Errore nell\'eliminazione dell\'elemento:', error);
    }
  };

  const togglePubblicazione = async (item: GalleriaItem) => {
    try {
      await galleriaService.updateGalleriaItem(item.id, {
        pubblicato: !item.pubblicato
      });
      loadData();
    } catch (error) {
      console.error('Errore nel toggle della pubblicazione:', error);
    }
  };

  const handleImagesChange = (files: File[]) => {
    console.log('Immagini selezionate:', files);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return <LoadingSpinner text="Caricamento galleria..." />;
  }

  return (
    <ManagerContainer>
      <Header>
        <Title>Gestione Galleria</Title>
        <ActionButtons>
          <Button onClick={() => loadData()}>
            🔄 Aggiorna
          </Button>
          <Button variant="primary" onClick={() => openModal()}>
            ➕ Nuovo Elemento
          </Button>
        </ActionButtons>
      </Header>

      <GalleryGrid>
        {galleriaItems.map(item => (
          <GalleryCard key={item.id}>
            {item.immagini && item.immagini.length > 0 ? (
              <GalleryImage src={item.immagini[0]} alt={item.titolo} />
            ) : (
              <GalleryImagePlaceholder>
                Nessuna Immagine
              </GalleryImagePlaceholder>
            )}
            
            <ItemContent>
              <ItemTitle>{item.titolo}</ItemTitle>
              
              <ItemMeta>
                <ItemCategory>{item.categoria}</ItemCategory>
                <ItemStatus pubblicato={item.pubblicato}>
                  {item.pubblicato ? 'Pubblicato' : 'Bozza'}
                </ItemStatus>
              </ItemMeta>
              
              {item.descrizione && (
                <ItemDescription>
                  {item.descrizione.length > 80 
                    ? item.descrizione.substring(0, 80) + '...'
                    : item.descrizione
                  }
                </ItemDescription>
              )}
              
              {item.tags.length > 0 && (
                <TagsContainer>
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                  {item.tags.length > 3 && <Tag>+{item.tags.length - 3}</Tag>}
                </TagsContainer>
              )}
              
              <div style={{ fontSize: '11px', opacity: '0.7', marginBottom: '15px' }}>
                📅 {formatDate(item.data)}
              </div>
              
              <ItemActions>
                <SmallButton onClick={() => openModal(item)}>
                  ✏️ Edit
                </SmallButton>
                <SmallButton 
                  variant="toggle"
                  onClick={() => togglePubblicazione(item)}
                >
                  {item.pubblicato ? '👁️' : '👁️‍🗨️'}
                </SmallButton>
                <SmallButton 
                  variant="delete"
                  onClick={() => handleDelete(item.id)}
                >
                  🗑️
                </SmallButton>
              </ItemActions>
            </ItemContent>
          </GalleryCard>
        ))}
      </GalleryGrid>

      {/* Modal per creazione/modifica elemento galleria */}
      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingItem ? 'Modifica Elemento' : 'Nuovo Elemento'}
            </ModalTitle>
            <CloseButton onClick={closeModal}>×</CloseButton>
          </ModalHeader>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Titolo</Label>
              <Input
                type="text"
                value={formData.titolo}
                onChange={(e) => handleInputChange('titolo', e.target.value)}
                placeholder="Titolo dell'elemento"
                required
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label>Categoria</Label>
                <Select
                  value={formData.categoria}
                  onChange={(e) => handleInputChange('categoria', e.target.value)}
                  required
                >
                  <option value="eventi">Eventi</option>
                  <option value="matrimoni">Matrimoni</option>
                  <option value="corporate">Corporate</option>
                  <option value="party">Party</option>
                  <option value="altro">Altro</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Data</Label>
                <Input
                  type="date"
                  value={formData.data.toISOString().slice(0, 10)}
                  onChange={(e) => handleInputChange('data', new Date(e.target.value))}
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>Descrizione</Label>
              <TextArea
                value={formData.descrizione || ''}
                onChange={(e) => handleInputChange('descrizione', e.target.value)}
                placeholder="Descrizione dell'elemento (opzionale)"
              />
            </FormGroup>

            <FormGroup>
              <Label>Evento Collegato (opzionale)</Label>
              <Select
                value={formData.eventoId || ''}
                onChange={(e) => handleInputChange('eventoId', e.target.value || undefined)}
              >
                <option value="">Nessun evento collegato</option>
                {eventi.map(evento => (
                  <option key={evento.id} value={evento.id}>
                    {evento.titolo}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Tags</Label>
              <TagInput>
                {formData.tags.map((tag, index) => (
                  <TagItem key={index}>
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>×</button>
                  </TagItem>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Aggiungi tag (premi Enter)"
                />
              </TagInput>
            </FormGroup>

            <FormGroup>
              <Label>Immagini</Label>
              <ImageUpload
                onFilesChange={handleImagesChange}
                existingImages={formData.immagini}
                maxFiles={20}
              />
            </FormGroup>

            <FormRow>
              <CheckboxGroup>
                <Checkbox
                  type="checkbox"
                  checked={formData.pubblicato}
                  onChange={(e) => handleInputChange('pubblicato', e.target.checked)}
                />
                <Label>Pubblica immediatamente</Label>
              </CheckboxGroup>

              <CheckboxGroup>
                <Checkbox
                  type="checkbox"
                  checked={formData.inEvidenza}
                  onChange={(e) => handleInputChange('inEvidenza', e.target.checked)}
                />
                <Label>Metti in evidenza</Label>
              </CheckboxGroup>
            </FormRow>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={closeModal}>
                Annulla
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salva Elemento'}
              </Button>
            </div>
          </Form>
        </ModalContent>
      </Modal>
    </ManagerContainer>
  );
};

export default GalleriaManager;