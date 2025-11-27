import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { eventiService } from '../../services/eventiService';
import { galleriaService } from '../../services/galleriaService';
import LoadingSpinner from '../common/LoadingSpinner';
import EventiManager from './EventiManager';
import GalleriaManager from './GalleriaManager';

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

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
  color: white;
  font-family: 'Montserrat', sans-serif;
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 15px 20px;
    flex-direction: column;
    gap: 15px;
  }
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  background: linear-gradient(45deg, #4682b4, #87ceeb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 15px;
  }
`;

const UserName = styled.span`
  font-size: 14px;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const LogoutButton = styled.button`
  background: rgba(220, 53, 69, 0.2);
  border: 1px solid rgba(220, 53, 69, 0.5);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(220, 53, 69, 0.4);
    transform: translateY(-2px);
  }
`;

const Navigation = styled.nav`
  display: flex;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;

  @media (max-width: 768px) {
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const NavButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'rgba(70, 130, 180, 0.3)' : 'transparent'};
  border: none;
  color: white;
  padding: 20px 30px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
  border-bottom: 3px solid ${props => props.active ? '#4682b4' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${props => props.active ? '100%' : '0'};
    height: 3px;
    background: linear-gradient(90deg, #4682b4, #87ceeb);
    transition: width 0.3s ease;
  }

  @media (max-width: 768px) {
    padding: 15px 20px;
    font-size: 12px;
  }
`;

const MainContent = styled.main`
  padding: 30px;
  animation: ${fadeIn} 0.6s ease;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.8s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    animation: ${pulse} 2s infinite;
  }
`;

const StatNumber = styled.div`
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(45deg, #4682b4, #87ceeb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.8;
  font-weight: 600;
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
  animation: ${fadeIn} 0.4s ease;
`;

const WelcomeTitle = styled.h1`
  font-size: 36px;
  font-weight: 300;
  margin-bottom: 10px;
  letter-spacing: 3px;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 16px;
  opacity: 0.8;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

type ActiveTab = 'dashboard' | 'eventi' | 'galleria' | 'configurazioni';

interface DashboardStats {
  totalEventi: number;
  eventiPubblicati: number;
  totalGalleria: number;
  galleriaPubblicata: number;
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [stats, setStats] = useState<DashboardStats>({
    totalEventi: 0,
    eventiPubblicati: 0,
    totalGalleria: 0,
    galleriaPubblicata: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      
      // Carica statistiche eventi
      const [tuttiEventi, eventiPubblicati] = await Promise.all([
        eventiService.getEventi(),
        eventiService.getEventi({ solo_pubblicati: true })
      ]);

      // Carica statistiche galleria
      const [tuttaGalleria, galleriaPubblicata] = await Promise.all([
        galleriaService.getGalleriaItems(),
        galleriaService.getGalleriaItems({ solo_pubblicati: true })
      ]);

      setStats({
        totalEventi: tuttiEventi.length,
        eventiPubblicati: eventiPubblicati.length,
        totalGalleria: tuttaGalleria.length,
        galleriaPubblicata: galleriaPubblicata.length
      });
    } catch (error) {
      console.error('Errore nel caricamento delle statistiche:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Errore nel logout:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'eventi':
        return <EventiManager onStatsUpdate={loadDashboardStats} />;
      case 'galleria':
        return <GalleriaManager onStatsUpdate={loadDashboardStats} />;
      case 'configurazioni':
        return <div>Configurazioni in arrivo...</div>;
      default:
        return (
          <>
            <WelcomeSection>
              <WelcomeTitle>Benvenuto, {user?.displayName || 'Admin'}</WelcomeTitle>
              <WelcomeSubtitle>Gestisci i contenuti di BLEND dal pannello di controllo</WelcomeSubtitle>
            </WelcomeSection>

            {isLoading ? (
              <LoadingSpinner text="Caricamento statistiche..." />
            ) : (
              <StatsGrid>
                <StatCard>
                  <StatNumber>{stats.totalEventi}</StatNumber>
                  <StatLabel>Eventi Totali</StatLabel>
                </StatCard>
                
                <StatCard>
                  <StatNumber>{stats.eventiPubblicati}</StatNumber>
                  <StatLabel>Eventi Pubblicati</StatLabel>
                </StatCard>
                
                <StatCard>
                  <StatNumber>{stats.totalGalleria}</StatNumber>
                  <StatLabel>Elementi Galleria</StatLabel>
                </StatCard>
                
                <StatCard>
                  <StatNumber>{stats.galleriaPubblicata}</StatNumber>
                  <StatLabel>Galleria Pubblicata</StatLabel>
                </StatCard>
              </StatsGrid>
            )}
          </>
        );
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <Logo>Blend Admin</Logo>
        <UserInfo>
          <UserName>👋 {user?.email}</UserName>
          <LogoutButton onClick={handleLogout}>
            Esci
          </LogoutButton>
        </UserInfo>
      </Header>

      <Navigation>
        <NavButton
          active={activeTab === 'dashboard'}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </NavButton>
        <NavButton
          active={activeTab === 'eventi'}
          onClick={() => setActiveTab('eventi')}
        >
          Eventi
        </NavButton>
        <NavButton
          active={activeTab === 'galleria'}
          onClick={() => setActiveTab('galleria')}
        >
          Galleria
        </NavButton>
        <NavButton
          active={activeTab === 'configurazioni'}
          onClick={() => setActiveTab('configurazioni')}
        >
          Configurazioni
        </NavButton>
      </Navigation>

      <MainContent>
        {renderContent()}
      </MainContent>
    </DashboardContainer>
  );
};

export default AdminDashboard;