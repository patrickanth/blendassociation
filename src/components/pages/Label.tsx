import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Helmet } from 'react-helmet';
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

const textReveal = keyframes`
  0% {
    clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
  }
  100% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #000000;
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
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.3), transparent);
    animation: ${scanline} 6s linear infinite;
    pointer-events: none;
    z-index: 1000;
  }
`;

const MainContent = styled.main`
  position: relative;
  z-index: 1;
  padding: 120px 5% 100px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 100px 4% 60px;
  }
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 80px;
  animation: ${fadeIn} 1s ease;
`;

const PageTitle = styled.h1`
  font-size: clamp(40px, 8vw, 80px);
  font-weight: 200;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 20px;
  animation: ${textReveal} 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(135,206,235,0.5) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PageSubtitle = styled.p`
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(135, 206, 235, 0.6);
  opacity: 0;
  animation: ${fadeIn} 1s 0.5s forwards;
`;

const SectionTitle = styled.h2`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(135, 206, 235, 0.7);
  margin-bottom: 40px;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 30px;
    height: 1px;
    background: rgba(135, 206, 235, 0.5);
  }
`;

const Section = styled.section<{ $delay: number }>`
  margin-bottom: 100px;
  animation: ${fadeIn} 0.8s ease;
  animation-delay: ${props => props.$delay}s;
  animation-fill-mode: both;
`;

const TracksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const TrackCard = styled.div<{ $index: number }>`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(135, 206, 235, 0.08);
  padding: 25px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeIn} 0.6s ease;
  animation-delay: ${props => props.$index * 0.1}s;
  animation-fill-mode: both;

  &:hover {
    border-color: rgba(135, 206, 235, 0.25);
    transform: translateY(-4px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  }
`;

const TrackInfo = styled.div`
  margin-bottom: 20px;
`;

const TrackTitle = styled.h3`
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
`;

const TrackArtist = styled.div`
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 1px;
  color: rgba(135, 206, 235, 0.6);
`;

const SoundCloudEmbed = styled.div`
  width: 100%;
  height: 120px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(135, 206, 235, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const PlaceholderEmbed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.3);
`;

const PlaceholderIcon = styled.div`
  font-size: 24px;
  opacity: 0.5;
`;

const PlaceholderText = styled.div`
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const VideoSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const VideoCard = styled.div<{ $index: number }>`
  animation: ${fadeIn} 0.6s ease;
  animation-delay: ${props => 0.3 + props.$index * 0.15}s;
  animation-fill-mode: both;
`;

const VideoWrapper = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(135, 206, 235, 0.08);
  overflow: hidden;
  transition: all 0.4s ease;

  &:hover {
    border-color: rgba(135, 206, 235, 0.25);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const VideoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(20, 20, 30, 1) 0%, rgba(10, 10, 15, 1) 100%);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 60px;
    height: 60px;
    border: 2px solid rgba(135, 206, 235, 0.2);
    border-radius: 50%;
    animation: ${pulseGlow} 3s ease-in-out infinite;
  }
`;

const PlayIcon = styled.div`
  width: 0;
  height: 0;
  border-left: 18px solid rgba(255, 255, 255, 0.3);
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  margin-left: 5px;
`;

const VideoInfo = styled.div`
  padding: 20px 0;
`;

const VideoTitle = styled.h3`
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 8px;
`;

const VideoMeta = styled.div`
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.4);
`;

const FeaturedRelease = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(135, 206, 235, 0.1);
  padding: 50px;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 50px;
  margin-bottom: 60px;
  transition: all 0.4s ease;

  &:hover {
    border-color: rgba(135, 206, 235, 0.2);
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 30px;
  }
`;

const ReleaseArtwork = styled.div`
  aspect-ratio: 1;
  background: linear-gradient(135deg, rgba(30, 30, 40, 1) 0%, rgba(15, 15, 20, 1) 100%);
  border: 1px solid rgba(135, 206, 235, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 120px;
    height: 120px;
    border: 1px solid rgba(135, 206, 235, 0.15);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    width: 80px;
    height: 80px;
    border: 1px solid rgba(135, 206, 235, 0.1);
    border-radius: 50%;
  }
`;

const VinylIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(135, 206, 235, 0.2);
  border: 2px solid rgba(135, 206, 235, 0.3);
`;

const ReleaseInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ReleaseLabel = styled.div`
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(135, 206, 235, 0.6);
  margin-bottom: 15px;
`;

const ReleaseTitle = styled.h3`
  font-size: 28px;
  font-weight: 300;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.9);

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const ReleaseArtist = styled.div`
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 25px;
`;

const ReleaseDescription = styled.p`
  font-size: 13px;
  font-weight: 300;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 30px;
`;

const ListenButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: 1px solid rgba(135, 206, 235, 0.4);
  color: rgba(255, 255, 255, 0.9);
  padding: 14px 30px;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  align-self: flex-start;

  &:hover {
    border-color: rgba(135, 206, 235, 0.8);
    color: #87ceeb;
    box-shadow: 0 0 25px rgba(135, 206, 235, 0.2);
  }
`;

interface Track {
  id: string;
  title: string;
  artist: string;
  soundcloudUrl?: string;
}

interface Video {
  id: string;
  title: string;
  artist: string;
  venue?: string;
  youtubeId?: string;
}

const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Midnight Protocol',
    artist: 'BLEND Collective',
    soundcloudUrl: ''
  },
  {
    id: '2',
    title: 'Deep State',
    artist: 'Various Artists',
    soundcloudUrl: ''
  },
  {
    id: '3',
    title: 'Analog Dreams',
    artist: 'BLEND Collective',
    soundcloudUrl: ''
  },
  {
    id: '4',
    title: 'Warehouse Sessions Vol.1',
    artist: 'Various Artists',
    soundcloudUrl: ''
  }
];

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'DJ Set @ Warehouse',
    artist: 'BLEND Resident',
    venue: 'Milan Underground',
    youtubeId: ''
  },
  {
    id: '2',
    title: 'Live Session',
    artist: 'Guest Artist',
    venue: 'BLEND HQ',
    youtubeId: ''
  },
  {
    id: '3',
    title: 'Closing Set',
    artist: 'BLEND Collective',
    venue: 'Summer Edition',
    youtubeId: ''
  },
  {
    id: '4',
    title: 'Afterhours',
    artist: 'Resident DJ',
    venue: 'Secret Location',
    youtubeId: ''
  }
];

const Label: React.FC = () => {
  const [tracks] = useState<Track[]>(mockTracks);
  const [videos] = useState<Video[]>(mockVideos);

  return (
    <PageContainer>
      <Helmet>
        <title>Label - BLEND | Music & Releases</title>
        <meta name="description" content="BLEND Label - Minimal deep tech releases, DJ sets, and live sessions." />
      </Helmet>

      <Header showLogo={true} />

      <MainContent>
        <HeroSection>
          <PageTitle>Label</PageTitle>
          <PageSubtitle>Music & Releases</PageSubtitle>
        </HeroSection>

        <Section $delay={0.2}>
          <SectionTitle>Featured Release</SectionTitle>
          <FeaturedRelease>
            <ReleaseArtwork>
              <VinylIcon />
            </ReleaseArtwork>
            <ReleaseInfo>
              <ReleaseLabel>Latest Release</ReleaseLabel>
              <ReleaseTitle>Compilation Vol. I</ReleaseTitle>
              <ReleaseArtist>BLEND Collective</ReleaseArtist>
              <ReleaseDescription>
                Una raccolta delle migliori tracce dalla nostra community.
                Deep tech, minimal e sonorità underground che definiscono il sound BLEND.
              </ReleaseDescription>
              <ListenButton
                href="https://soundcloud.com/blend"
                target="_blank"
                rel="noopener noreferrer"
              >
                Listen Now
              </ListenButton>
            </ReleaseInfo>
          </FeaturedRelease>
        </Section>

        <Section $delay={0.4}>
          <SectionTitle>Tracks</SectionTitle>
          <TracksGrid>
            {tracks.map((track, index) => (
              <TrackCard key={track.id} $index={index}>
                <TrackInfo>
                  <TrackTitle>{track.title}</TrackTitle>
                  <TrackArtist>{track.artist}</TrackArtist>
                </TrackInfo>
                <SoundCloudEmbed>
                  {track.soundcloudUrl ? (
                    <iframe
                      title={track.title}
                      src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(track.soundcloudUrl)}&color=%2387ceeb&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
                      allow="autoplay"
                    />
                  ) : (
                    <PlaceholderEmbed>
                      <PlaceholderIcon>♫</PlaceholderIcon>
                      <PlaceholderText>Coming Soon</PlaceholderText>
                    </PlaceholderEmbed>
                  )}
                </SoundCloudEmbed>
              </TrackCard>
            ))}
          </TracksGrid>
        </Section>

        <Section $delay={0.6}>
          <SectionTitle>DJ Sets & Live Sessions</SectionTitle>
          <VideoSection>
            {videos.map((video, index) => (
              <VideoCard key={video.id} $index={index}>
                <VideoWrapper>
                  {video.youtubeId ? (
                    <iframe
                      title={video.title}
                      src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <VideoPlaceholder>
                      <PlayIcon />
                    </VideoPlaceholder>
                  )}
                </VideoWrapper>
                <VideoInfo>
                  <VideoTitle>{video.title}</VideoTitle>
                  <VideoMeta>{video.artist} — {video.venue}</VideoMeta>
                </VideoInfo>
              </VideoCard>
            ))}
          </VideoSection>
        </Section>
      </MainContent>
    </PageContainer>
  );
};

export default Label;
