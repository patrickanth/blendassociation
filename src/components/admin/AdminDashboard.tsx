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

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #000000;
  color: white;
  font-family: 'Montserrat', sans-serif;
  position: relative;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.2), transparent);
    animation: ${scanline} 8s linear infinite;
    pointer-events: none;
    z-index: 1000;
  }
`;

const Header = styled.header`
  background: rgba(0, 0, 0, 0.95);
  border-bottom: 1px solid rgba(135, 206, 235, 0.1);
  padding: 25px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 20px;
    flex-direction: column;
    gap: 15px;
  }
`;

const Logo = styled.div`
  font-size: 18px;
  font-weight: 300;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);

  span {
    color: rgba(135, 206, 235, 0.7);
    font-weight: 500;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
`;

const UserName = styled.span`
  font-size: 12px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.5);

  @media (max-width: 768px) {
    display: none;
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid rgba(135, 206, 235, 0.3);
  color: rgba(255, 255, 255, 0.7);
  padding: 10px 20px;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(135, 206, 235, 0.6);
    color: #87ceeb;
  }
`;

const Navigation = styled.nav`
  display: flex;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(135, 206, 235, 0.05);
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const NavButton = styled.button<{ $active: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.$active ? '#87ceeb' : 'rgba(255, 255, 255, 0.4)'};
  padding: 20px 30px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: ${props => props.$active ? '600' : '400'};
  text-transform: uppercase;
  letter-spacing: 3px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${props => props.$active ? '100%' : '0'};
    height: 1px;
    background: #87ceeb;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #87ceeb;
    &::after { width: 100%; }
  }

  @media (max-width: 768px) {
    padding: 15px 20px;
    font-size: 10px;
    letter-spacing: 2px;
  }
`;

const MainContent = styled.main`
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
  animation: ${fadeIn} 0.6s ease;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const WelcomeSection = styled.div`
  margin-bottom: 50px;
`;

const WelcomeTitle = styled.h1`
  font-size: 28px;
  font-weight: 200;
  letter-spacing: 4px;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.9);
`;

const WelcomeSubtitle = styled.p`
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 2px;
  color: rgba(135, 206, 235, 0.5);
  text-transform: uppercase;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  margin-bottom: 50px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div<{ $delay: number }>`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(135, 206, 235, 0.08);
  padding: 30px;
  animation: ${fadeIn} 0.6s ease;
  animation-delay: ${props => props.$delay}s;
  animation-fill-mode: both;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(135, 206, 235, 0.2);
    transform: translateY(-3px);
  }
`;

const StatLabel = styled.div`
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(135, 206, 235, 0.6);
  margin-bottom: 15px;
`;

const StatNumber = styled.div`
  font-size: 36px;
  font-weight: 200;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 5px;
`;

const StatChange = styled.div<{ $positive: boolean }>`
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 1px;
  color: ${props => props.$positive ? 'rgba(100, 200, 150, 0.7)' : 'rgba(200, 100, 100, 0.7)'};
`;

const SectionTitle = styled.h2`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(135, 206, 235, 0.7);
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(135, 206, 235, 0.1);
`;

const ManagementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-bottom: 50px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ManagementCard = styled.div<{ $delay: number }>`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(135, 206, 235, 0.08);
  padding: 30px;
  animation: ${fadeIn} 0.6s ease;
  animation-delay: ${props => props.$delay}s;
  animation-fill-mode: both;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: rgba(135, 206, 235, 0.25);
    background: rgba(135, 206, 235, 0.03);
  }
`;

const CardIcon = styled.div`
  font-size: 24px;
  margin-bottom: 20px;
  opacity: 0.6;
`;

const CardTitle = styled.h3`
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 10px;
`;

const CardDescription = styled.p`
  font-size: 11px;
  font-weight: 300;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 20px;
`;

const CardCount = styled.div`
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 2px;
  color: rgba(135, 206, 235, 0.6);
`;

const RecentActivity = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(135, 206, 235, 0.08);
  padding: 30px;
  margin-bottom: 50px;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(135, 206, 235, 0.05);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(135, 206, 235, 0.15);
  }
`;

const ActivityDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$color};
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 4px;
`;

const ActivityTime = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
`;

const ComingSoonBadge = styled.span`
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(135, 206, 235, 0.6);
  background: rgba(135, 206, 235, 0.1);
  padding: 4px 8px;
  margin-left: 10px;
`;

type ActiveTab = 'dashboard' | 'eventi' | 'galleria' | 'merch' | 'media';

interface DashboardStats {
  weeklyUsers: number;
  totalEventi: number;
  eventiPubblicati: number;
  totalGalleria: number;
  galleriaPubblicata: number;
  merchItems: number;
  mediaItems: number;
}

const mockActivities = [
  { title: 'Nuovo evento creato: "Summer Closing"', time: '2 ore fa', color: 'rgba(135, 206, 235, 0.8)' },
  { title: '3 nuove foto aggiunte alla galleria', time: '5 ore fa', color: 'rgba(100, 200, 150, 0.8)' },
  { title: 'Registrazione evento: +12 partecipanti', time: '1 giorno fa', color: 'rgba(200, 150, 100, 0.8)' },
  { title: 'Merch aggiornato: "Blend Tee Black"', time: '2 giorni fa', color: 'rgba(150, 100, 200, 0.8)' },
];

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [stats, setStats] = useState<DashboardStats>({
    weeklyUsers: 127,
    totalEventi: 0,
    eventiPubblicati: 0,
    totalGalleria: 0,
    galleriaPubblicata: 0,
    merchItems: 6,
    mediaItems: 8
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);

      const timeoutPromise = new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 2000);
      });

      const statsPromise = (async () => {
        const [tuttiEventi, eventiPubblicati] = await Promise.all([
          eventiService.getEventiAdmin(),
          eventiService.getEventiPubblici()
        ]);

        const [tuttaGalleria, galleriaPubblicata] = await Promise.all([
          galleriaService.getGalleriaAdmin(),
          galleriaService.getGalleriaPubblica()
        ]);

        setStats(prev => ({
          ...prev,
          totalEventi: tuttiEventi.length,
          eventiPubblicati: eventiPubblicati.length,
          totalGalleria: tuttaGalleria.length,
          galleriaPubblicata: galleriaPubblicata.length
        }));
      })();

      await Promise.race([statsPromise, timeoutPromise]);
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
      case 'merch':
        return (
          <div>
            <SectionTitle>Gestione Merchandise</SectionTitle>
            <ManagementGrid>
              {[
                { title: 'Blend Tee Black', desc: 'Apparel - €35', count: 'In Stock' },
                { title: 'Blend Hoodie', desc: 'Apparel - €65', count: 'In Stock' },
                { title: 'Blend Cap', desc: 'Accessories - €28', count: 'Sold Out' },
                { title: 'Vinyl Slipmat', desc: 'Accessories - €18', count: 'In Stock' },
                { title: 'Tote Bag', desc: 'Accessories - €22', count: 'In Stock' },
                { title: 'Sticker Pack', desc: 'Accessories - €8', count: 'In Stock' },
              ].map((item, index) => (
                <ManagementCard key={index} $delay={index * 0.1}>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                  <CardCount>{item.count}</CardCount>
                </ManagementCard>
              ))}
            </ManagementGrid>
          </div>
        );
      case 'media':
        return (
          <div>
            <SectionTitle>Gestione Media</SectionTitle>
            <ManagementGrid>
              <ManagementCard $delay={0}>
                <CardIcon>♫</CardIcon>
                <CardTitle>SoundCloud Tracks</CardTitle>
                <CardDescription>Gestisci i link delle tracce SoundCloud da mostrare nella pagina Label.</CardDescription>
                <CardCount>4 tracce</CardCount>
              </ManagementCard>
              <ManagementCard $delay={0.1}>
                <CardIcon>▶</CardIcon>
                <CardTitle>YouTube Videos</CardTitle>
                <CardDescription>Aggiungi e gestisci i video dei DJ set e live session.</CardDescription>
                <CardCount>4 video</CardCount>
              </ManagementCard>
              <ManagementCard $delay={0.2}>
                <CardIcon>◎</CardIcon>
                <CardTitle>Featured Release</CardTitle>
                <CardDescription>Configura la release in evidenza nella pagina Label.</CardDescription>
                <CardCount>1 release</CardCount>
              </ManagementCard>
            </ManagementGrid>
          </div>
        );
      default:
        return (
          <>
            <WelcomeSection>
              <WelcomeTitle>Dashboard</WelcomeTitle>
              <WelcomeSubtitle>Panoramica delle attività</WelcomeSubtitle>
            </WelcomeSection>

            {isLoading ? (
              <LoadingSpinner text="BLEND" />
            ) : (
              <>
                <StatsGrid>
                  <StatCard $delay={0}>
                    <StatLabel>Utenti Settimanali</StatLabel>
                    <StatNumber>{stats.weeklyUsers}</StatNumber>
                    <StatChange $positive={true}>+12% vs settimana scorsa</StatChange>
                  </StatCard>

                  <StatCard $delay={0.1}>
                    <StatLabel>Eventi Totali</StatLabel>
                    <StatNumber>{stats.totalEventi || 3}</StatNumber>
                    <StatChange $positive={true}>{stats.eventiPubblicati || 2} pubblicati</StatChange>
                  </StatCard>

                  <StatCard $delay={0.2}>
                    <StatLabel>Galleria</StatLabel>
                    <StatNumber>{stats.totalGalleria || 24}</StatNumber>
                    <StatChange $positive={true}>{stats.galleriaPubblicata || 18} pubbliche</StatChange>
                  </StatCard>

                  <StatCard $delay={0.3}>
                    <StatLabel>Registrazioni</StatLabel>
                    <StatNumber>48</StatNumber>
                    <StatChange $positive={true}>+8 questa settimana</StatChange>
                  </StatCard>
                </StatsGrid>

                <SectionTitle>Gestione Contenuti</SectionTitle>
                <ManagementGrid>
                  <ManagementCard $delay={0.1} onClick={() => setActiveTab('eventi')}>
                    <CardIcon>◈</CardIcon>
                    <CardTitle>Eventi</CardTitle>
                    <CardDescription>Crea e gestisci gli eventi, date, location e lineup.</CardDescription>
                    <CardCount>{stats.totalEventi || 3} eventi</CardCount>
                  </ManagementCard>

                  <ManagementCard $delay={0.2} onClick={() => setActiveTab('galleria')}>
                    <CardIcon>▣</CardIcon>
                    <CardTitle>Galleria</CardTitle>
                    <CardDescription>Carica foto e video degli eventi passati.</CardDescription>
                    <CardCount>{stats.totalGalleria || 24} elementi</CardCount>
                  </ManagementCard>

                  <ManagementCard $delay={0.3} onClick={() => setActiveTab('merch')}>
                    <CardIcon>◉</CardIcon>
                    <CardTitle>Merchandise</CardTitle>
                    <CardDescription>Gestisci prodotti, prezzi e disponibilità.</CardDescription>
                    <CardCount>{stats.merchItems} prodotti</CardCount>
                  </ManagementCard>

                  <ManagementCard $delay={0.4} onClick={() => setActiveTab('media')}>
                    <CardIcon>♫</CardIcon>
                    <CardTitle>Media</CardTitle>
                    <CardDescription>Link SoundCloud, video YouTube e release.</CardDescription>
                    <CardCount>{stats.mediaItems} media</CardCount>
                  </ManagementCard>

                  <ManagementCard $delay={0.5}>
                    <CardIcon>◷</CardIcon>
                    <CardTitle>Analytics<ComingSoonBadge>Soon</ComingSoonBadge></CardTitle>
                    <CardDescription>Statistiche dettagliate e report.</CardDescription>
                    <CardCount>—</CardCount>
                  </ManagementCard>

                  <ManagementCard $delay={0.6}>
                    <CardIcon>⚙</CardIcon>
                    <CardTitle>Settings<ComingSoonBadge>Soon</ComingSoonBadge></CardTitle>
                    <CardDescription>Configurazioni generali del sito.</CardDescription>
                    <CardCount>—</CardCount>
                  </ManagementCard>
                </ManagementGrid>

                <SectionTitle>Attività Recenti</SectionTitle>
                <RecentActivity>
                  <ActivityList>
                    {mockActivities.map((activity, index) => (
                      <ActivityItem key={index}>
                        <ActivityDot $color={activity.color} />
                        <ActivityContent>
                          <ActivityTitle>{activity.title}</ActivityTitle>
                          <ActivityTime>{activity.time}</ActivityTime>
                        </ActivityContent>
                      </ActivityItem>
                    ))}
                  </ActivityList>
                </RecentActivity>
              </>
            )}
          </>
        );
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <Logo>BLEND <span>Admin</span></Logo>
        <UserInfo>
          <UserName>{user?.email || 'admin@blend.it'}</UserName>
          <LogoutButton onClick={handleLogout}>
            Esci
          </LogoutButton>
        </UserInfo>
      </Header>

      <Navigation>
        <NavButton
          $active={activeTab === 'dashboard'}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </NavButton>
        <NavButton
          $active={activeTab === 'eventi'}
          onClick={() => setActiveTab('eventi')}
        >
          Eventi
        </NavButton>
        <NavButton
          $active={activeTab === 'galleria'}
          onClick={() => setActiveTab('galleria')}
        >
          Galleria
        </NavButton>
        <NavButton
          $active={activeTab === 'merch'}
          onClick={() => setActiveTab('merch')}
        >
          Merch
        </NavButton>
        <NavButton
          $active={activeTab === 'media'}
          onClick={() => setActiveTab('media')}
        >
          Media
        </NavButton>
      </Navigation>

      <MainContent>
        {renderContent()}
      </MainContent>
    </DashboardContainer>
  );
};

export default AdminDashboard;
