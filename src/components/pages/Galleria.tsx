import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Helmet } from 'react-helmet';
import { galleriaService } from '../../services/galleriaService';
import { GalleriaItem } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import Header from '../common/Header';

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

const zoomIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
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

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
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
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.4), transparent);
    animation: ${scanline} 6s linear infinite;
    pointer-events: none;
    z-index: 1000;
  }
`;

const MainContent = styled.main`
  position: relative;
  width: 100%;
  padding-top: 80px;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3px;
  background-color: #000;
  padding: 3px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2px;
    padding: 2px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const GalleryItem = styled.div<{ index: number }>`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
  animation: ${fadeIn} 0.6s ease;
  animation-delay: ${props => Math.min(props.index * 0.03, 0.5)}s;
  animation-fill-mode: both;
  background: rgba(135, 206, 235, 0.03);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      180deg,
      transparent 0%,
      transparent 60%,
      rgba(0, 0, 0, 0.8) 100%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:hover {
    z-index: 10;

    &::after {
      opacity: 1;
    }

    .gallery-image {
      transform: scale(1.08);
      filter: brightness(0.7) contrast(1.1);
    }

    .gallery-overlay {
      opacity: 1;
      transform: translateY(0);
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
  filter: brightness(0.85) saturate(0.9);
`;

const GalleryOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
`;

const OverlayCategory = styled.div`
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #87ceeb;
  margin-bottom: 6px;
`;

const OverlayTitle = styled.h3`
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 4px;
  line-height: 1.3;
`;

const OverlayDate = styled.div`
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.5);
`;

const FilterBar = styled.div`
  background: rgba(0, 0, 0, 0.98);
  padding: 35px 5%;
  display: flex;
  gap: 35px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(135, 206, 235, 0.08);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.4), transparent);
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
  font-size: 12px;
  font-weight: ${props => props.active ? '600' : '400'};
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: ${props => props.active ? '100%' : '0'};
    height: 1px;
    background: #87ceeb;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    color: #87ceeb;
    text-shadow: 0 0 15px rgba(135, 206, 235, 0.4);

    &::after {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    font-size: 10px;
    letter-spacing: 2px;
  }
`;

const ImageModal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.97);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 10000;
  cursor: zoom-out;
  backdrop-filter: blur(20px);
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  animation: ${zoomIn} 0.3s ease;
`;

const ModalImage = styled.img`
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border: 1px solid rgba(135, 206, 235, 0.1);
`;

const ModalInfo = styled.div`
  position: absolute;
  bottom: -50px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
`;

const ModalTitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
`;

const ModalCategory = styled.div`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #87ceeb;
`;

const CloseButton = styled.button`
  position: fixed;
  top: 40px;
  right: 40px;
  background: transparent;
  border: 1px solid rgba(135, 206, 235, 0.3);
  color: rgba(255, 255, 255, 0.8);
  width: 50px;
  height: 50px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 300;
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: rgba(135, 206, 235, 0.6);
    color: #87ceeb;
    transform: rotate(90deg);
    box-shadow: 0 0 20px rgba(135, 206, 235, 0.2);
  }

  @media (max-width: 768px) {
    top: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
  }
`;

const NoImagesContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #000000;
`;

const NoImagesText = styled.div`
  text-align: center;
  animation: ${fadeIn} 1.5s ease;
`;

const ArchiveTitle = styled.div`
  font-size: clamp(40px, 8vw, 100px);
  font-weight: 200;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  margin-bottom: 25px;
  animation: ${textReveal} 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  background: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(135,206,235,0.6) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ComingSoonText = styled.p`
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 5px;
  text-transform: uppercase;
  opacity: 0;
  animation: ${fadeIn} 1s 1s forwards;
  color: rgba(135, 206, 235, 0.6);
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 50px auto;
  background: transparent;
  border: 1px solid rgba(135, 206, 235, 0.3);
  color: rgba(255, 255, 255, 0.8);
  padding: 16px 50px;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(135, 206, 235, 0.1) 50%,
      transparent 100%
    );
    animation: ${shimmer} 2s infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(135, 206, 235, 0.6);
    color: #87ceeb;
    box-shadow: 0 0 30px rgba(135, 206, 235, 0.15);

    &::before {
      opacity: 1;
    }
  }
`;

const categorie = [
  { key: 'tutti', label: 'All' },
  { key: 'events', label: 'Events' },
  { key: 'venue', label: 'Venue' },
  { key: 'crowd', label: 'Crowd' },
  { key: 'artists', label: 'Artists' },
  { key: 'backstage', label: 'Backstage' }
];

const ITEMS_PER_PAGE = 16;

const Galleria: React.FC = () => {
  const [galleriaItems, setGalleriaItems] = useState<GalleriaItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('tutti');
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleriaItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    loadGalleria();
  }, []);

  const loadGalleria = async () => {
    try {
      // Quick timeout - if no response in 3 seconds, show empty state
      const timeoutPromise = new Promise<GalleriaItem[]>((resolve) => {
        setTimeout(() => resolve([]), 3000);
      });

      const galleriaPromise = galleriaService.getGalleriaPubblica();
      const galleriaData = await Promise.race([galleriaPromise, timeoutPromise]);
      const sortedGalleria = galleriaData.sort(
        (a: GalleriaItem, b: GalleriaItem) => b.data.getTime() - a.data.getTime()
      );
      setGalleriaItems(sortedGalleria);
    } catch (error) {
      console.error('Errore nel caricamento della galleria:', error);
      setGalleriaItems([]);
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  };

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'tutti') return galleriaItems;
    return galleriaItems.filter(item => item.categoria === selectedCategory);
  }, [galleriaItems, selectedCategory]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const hasMore = visibleCount < filteredItems.length;

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
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

  const openImageModal = (item: GalleriaItem) => {
    setSelectedItem(item);
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setSelectedItem(null);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedItem) {
        closeImageModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem]);

  // Show loading only briefly, then show content
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
        <title>Gallery - BLEND | Visual Archive</title>
        <meta name="description" content="Esplora l'archivio visuale degli eventi BLEND. Momenti catturati dalle nostre notti minimal deep tech." />
      </Helmet>

      <Header showLogo={true} />

      <MainContent>
        {galleriaItems.length === 0 ? (
          <NoImagesContainer>
            <NoImagesText>
              <ArchiveTitle>Archive</ArchiveTitle>
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
                  onClick={() => handleCategoryChange(categoria.key)}
                >
                  {categoria.label}
                </FilterButton>
              ))}
            </FilterBar>

            <GalleryGrid>
              {visibleItems.map((item, index) => (
                <GalleryItem
                  key={item.id}
                  index={index}
                  onClick={() => item.immagini && item.immagini.length > 0 && openImageModal(item)}
                >
                  {item.immagini && item.immagini.length > 0 && (
                    <>
                      <GalleryImage
                        className="gallery-image"
                        src={item.immagini[0]}
                      />

                      <GalleryOverlay className="gallery-overlay">
                        <OverlayCategory>
                          {getCategoryLabel(item.categoria)}
                        </OverlayCategory>
                        <OverlayTitle>{item.titolo}</OverlayTitle>
                        <OverlayDate>{formatDate(item.data)}</OverlayDate>
                      </GalleryOverlay>
                    </>
                  )}
                </GalleryItem>
              ))}
            </GalleryGrid>

            {hasMore && (
              <LoadMoreButton onClick={loadMore}>
                Load More
              </LoadMoreButton>
            )}
          </>
        )}
      </MainContent>

      <ImageModal $isOpen={!!selectedItem} onClick={closeImageModal}>
        <CloseButton onClick={(e) => {
          e.stopPropagation();
          closeImageModal();
        }}>
          +
        </CloseButton>
        {selectedItem && selectedItem.immagini && selectedItem.immagini.length > 0 && (
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalImage
              src={selectedItem.immagini[0]}
              alt={selectedItem.titolo}
            />
            <ModalInfo>
              <ModalTitle>{selectedItem.titolo}</ModalTitle>
              <ModalCategory>{getCategoryLabel(selectedItem.categoria)}</ModalCategory>
            </ModalInfo>
          </ModalContent>
        )}
      </ImageModal>
    </PageContainer>
  );
};

export default Galleria;
