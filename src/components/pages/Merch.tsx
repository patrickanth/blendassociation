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

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
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

const CategoryFilter = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 60px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 15px;
  }
`;

const FilterButton = styled.button<{ $active: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.$active ? '#87ceeb' : 'rgba(255, 255, 255, 0.4)'};
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: ${props => props.$active ? '600' : '400'};
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  padding: 8px 0;

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
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ProductCard = styled.div<{ $index: number }>`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(135, 206, 235, 0.08);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeIn} 0.6s ease;
  animation-delay: ${props => props.$index * 0.1}s;
  animation-fill-mode: both;

  &:hover {
    border-color: rgba(135, 206, 235, 0.3);
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

    .product-image {
      transform: scale(1.05);
    }
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(20, 20, 30, 1) 0%, rgba(10, 10, 15, 1) 100%);
`;

const ProductImage = styled.div<{ $src: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$src});
  background-size: cover;
  background-position: center;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ProductPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(20, 20, 30, 1) 0%, rgba(10, 10, 15, 1) 100%);
`;

const PlaceholderIcon = styled.div`
  font-size: 48px;
  margin-bottom: 15px;
  opacity: 0.3;
`;

const PlaceholderText = styled.div`
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.2);
`;

const ProductInfo = styled.div`
  padding: 25px;
`;

const ProductCategory = styled.div`
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(135, 206, 235, 0.6);
  margin-bottom: 10px;
`;

const ProductName = styled.h3`
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.9);
`;

const ProductPrice = styled.div`
  font-size: 18px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
`;

const BuyButton = styled.a`
  display: inline-block;
  background: transparent;
  border: 1px solid rgba(135, 206, 235, 0.4);
  color: rgba(255, 255, 255, 0.9);
  padding: 12px 30px;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-decoration: none;
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
    background: linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.1), transparent);
    animation: ${shimmer} 3s infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(135, 206, 235, 0.8);
    color: #87ceeb;
    box-shadow: 0 0 25px rgba(135, 206, 235, 0.2);

    &::before {
      opacity: 1;
    }
  }
`;

const SoldOutBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
`;

const ComingSoonSection = styled.div`
  text-align: center;
  padding: 100px 20px;
  border: 1px solid rgba(135, 206, 235, 0.08);
  background: rgba(255, 255, 255, 0.01);
  margin-top: 60px;
`;

const ComingSoonTitle = styled.h3`
  font-size: 24px;
  font-weight: 200;
  letter-spacing: 6px;
  text-transform: uppercase;
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.6);
`;

const ComingSoonText = styled.p`
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 2px;
  color: rgba(135, 206, 235, 0.5);
`;

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  image?: string;
  link?: string;
  soldOut?: boolean;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Blend Tee Black',
    category: 'apparel',
    price: '€35',
    link: 'https://instagram.com/blend',
    soldOut: false
  },
  {
    id: '2',
    name: 'Blend Hoodie',
    category: 'apparel',
    price: '€65',
    link: 'https://instagram.com/blend',
    soldOut: false
  },
  {
    id: '3',
    name: 'Blend Cap',
    category: 'accessories',
    price: '€28',
    link: 'https://instagram.com/blend',
    soldOut: true
  },
  {
    id: '4',
    name: 'Vinyl Slipmat',
    category: 'accessories',
    price: '€18',
    link: 'https://instagram.com/blend',
    soldOut: false
  },
  {
    id: '5',
    name: 'Tote Bag',
    category: 'accessories',
    price: '€22',
    link: 'https://instagram.com/blend',
    soldOut: false
  },
  {
    id: '6',
    name: 'Blend Sticker Pack',
    category: 'accessories',
    price: '€8',
    link: 'https://instagram.com/blend',
    soldOut: false
  }
];

const categories = [
  { key: 'all', label: 'All' },
  { key: 'apparel', label: 'Apparel' },
  { key: 'accessories', label: 'Accessories' }
];

const Merch: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = selectedCategory === 'all'
    ? mockProducts
    : mockProducts.filter(p => p.category === selectedCategory);

  return (
    <PageContainer>
      <Helmet>
        <title>Merch - BLEND | Official Merchandise</title>
        <meta name="description" content="Official BLEND merchandise. Apparel e accessori per la community underground." />
      </Helmet>

      <Header showLogo={true} />

      <MainContent>
        <HeroSection>
          <PageTitle>Merch</PageTitle>
          <PageSubtitle>Official Merchandise</PageSubtitle>
        </HeroSection>

        <CategoryFilter>
          {categories.map(cat => (
            <FilterButton
              key={cat.key}
              $active={selectedCategory === cat.key}
              onClick={() => setSelectedCategory(cat.key)}
            >
              {cat.label}
            </FilterButton>
          ))}
        </CategoryFilter>

        <ProductGrid>
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} $index={index}>
              <ProductImageContainer>
                {product.image ? (
                  <ProductImage className="product-image" $src={product.image} />
                ) : (
                  <ProductPlaceholder>
                    <PlaceholderIcon>◯</PlaceholderIcon>
                    <PlaceholderText>Image Coming Soon</PlaceholderText>
                  </ProductPlaceholder>
                )}
                {product.soldOut && <SoldOutBadge>Sold Out</SoldOutBadge>}
              </ProductImageContainer>

              <ProductInfo>
                <ProductCategory>{product.category}</ProductCategory>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{product.price}</ProductPrice>

                {product.soldOut ? (
                  <BuyButton as="span" style={{ opacity: 0.4, cursor: 'not-allowed' }}>
                    Sold Out
                  </BuyButton>
                ) : (
                  <BuyButton
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Shop Now
                  </BuyButton>
                )}
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>

        <ComingSoonSection>
          <ComingSoonTitle>More Coming Soon</ComingSoonTitle>
          <ComingSoonText>Nuovi prodotti in arrivo. Stay tuned.</ComingSoonText>
        </ComingSoonSection>
      </MainContent>
    </PageContainer>
  );
};

export default Merch;
