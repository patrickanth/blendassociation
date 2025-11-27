import React, { useState, useEffect } from 'react';
import styled, { keyframes} from 'styled-components';
import { Helmet } from 'react-helmet';
import { galleriaService } from '../../services/galleriaService';
import { GalleriaItem } from '../../types';
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

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #000000;
  color: white;
  font-family: 'Montserrat', sans-serif;
  overflow-x: hidden;
`;

const MainContent = styled.main`
  position: relative;
  width: 100%;
  padding-top: 80px;
`;

// Grid Layout Minimal
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  background-color: #000;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const GalleryItem = styled.div<{ index: number }>`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
  animation: ${fadeIn} 0.8s ease;
  animation-delay: ${props => props.index * 0.05}s;
  animation-fill-mode: both;
  
  &:hover {
    .gallery-image {
      transform: scale(1.1);
      filter: brightness(0.4);
    }
    
    .gallery-overlay {
      opacity: 1;
    }
  }
`;

const GalleryImage = styled.div<{ src: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(0.8);
`;

const GalleryOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.4s ease;
  backdrop-filter: blur(10px);
`;

const OverlayTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 10px;
  text-align: center;
`;

const OverlayCategory = styled.div`
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #4682b4;
  margin-bottom: 5px;
`;

const OverlayDate = styled.div`
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 1px;
  opacity: 0.8;
`;

// Filtri minimal
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

// Full Screen Image Modal
const ImageModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.98);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 10000;
  cursor: zoom-out;
`;

const ModalImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  animation: ${fadeIn} 0.3s ease;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 0;
  cursor: pointer;
  font-size: 20px;
  font-weight: 300;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.8);
    transform: rotate(90deg);
  }
`;

// No Images Component
const NoImagesContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #000000;
`;

const NoImagesText = styled.div`
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

const categorie = [
  { key: 'tutti', label: 'All' },
  { key: 'events', label: 'Events' },
  { key: 'venue', label: 'Venue' },
  { key: 'crowd', label: 'Crowd' },
  { key: 'artists', label: 'Artists' },
  { key: 'backstage', label: 'Backstage' }
];

const Galleria: React.FC = () => {
  const [galleriaItems, setGalleriaItems] = useState<GalleriaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleriaItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('tutti');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadGalleria();
  }, []);

  useEffect(() => {
    filterItems();
  }, [galleriaItems, selectedCategory]);

  const loadGalleria = async () => {
    try {
      setIsLoading(true);
      const galleriaData = await galleriaService.getGalleriaItems({ solo_pubblicati: true });
      // Ordina per data più recente
      const sortedGalleria = galleriaData.sort((a, b) => b.data.getTime() - a.data.getTime());
      setGalleriaItems(sortedGalleria);
    } catch (error) {
      console.error('Errore nel caricamento della galleria:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    if (selectedCategory === 'tutti') {
      setFilteredItems(galleriaItems);
    } else {
      setFilteredItems(galleriaItems.filter(item => item.categoria === selectedCategory));
    }
  };

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

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner fullscreen text="Loading gallery..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Helmet>
        <title>Gallery - BLEND | Visual Archive</title>
        <meta name="description" content="Esplora l'archivio visuale degli eventi BLEND. Foto e video dei nostri eventi minimal deep tech e tech house." />
      </Helmet>

      <Header showLogo={true} />

      <MainContent>
        {galleriaItems.length === 0 ? (
          <NoImagesContainer>
            <NoImagesText>
              <div style={{ 
                fontSize: 'clamp(48px, 8vw, 96px)', 
                fontWeight: '300',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginBottom: '20px'
              }}>
                {"Visual Archive".split('').map((letter, index) => (
                  <GlitchLetter key={index} delay={index * 0.05}>
                    {letter === ' ' ? '\u00A0' : letter}
                  </GlitchLetter>
                ))}
              </div>
              <ComingSoonText>Coming Soon</ComingSoonText>
            </NoImagesText>
          </NoImagesContainer>
        ) : (
          <>
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

            <GalleryGrid>
              {filteredItems.map((item, index) => (
                <GalleryItem key={item.id} index={index}>
                  {item.immagini && item.immagini.length > 0 && (
                    <>
                      <GalleryImage 
                        className="gallery-image"
                        src={item.immagini[0]}
                        onClick={() => openImageModal(item.immagini[0])}
                      />
                      
                      <GalleryOverlay className="gallery-overlay">
                        <OverlayCategory>
                          {getCategoryLabel(item.categoria)}
                        </OverlayCategory>
                        <OverlayTitle>{item.titolo}</OverlayTitle>
                        <OverlayDate>
                          {formatDate(item.data)}
                        </OverlayDate>
                      </GalleryOverlay>
                    </>
                  )}
                </GalleryItem>
              ))}
            </GalleryGrid>
          </>
        )}
      </MainContent>

      {/* Modal per visualizzare le immagini */}
      <ImageModal isOpen={!!selectedImage} onClick={closeImageModal}>
        <CloseButton onClick={(e) => {
          e.stopPropagation();
          closeImageModal();
        }}>
          ✕
        </CloseButton>
        {selectedImage && (
          <ModalImage 
            src={selectedImage} 
            alt="Full size image"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </ImageModal>
    </PageContainer>
  );
};

export default Galleria;