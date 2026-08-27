import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { BRAND_DIRECTORY } from '../data/mockBrands';
import ProductCard from '../components/product/ProductCard';
import CategoryBar from '../components/navigation/CategoryBar';
import FlashDealsCarousel from '../components/home/FlashDealsCarousel';
import {
  Zap,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight,
  Clock,
  ShieldCheck,
  Percent,
  Truck,
  RotateCcw,
  Headphones,
  Tag,
  Star,
  CheckCircle2,
  Gift,
  Flame,
  ArrowRight,
  HeartHandshake,
  Compass
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 'hero-1',
    tag: 'NEXT-GEN HYPER-COMMERCE',
    title: 'Discover Curated Marketplace Collections',
    subtitle: 'High-converting discovery, sub-second search, and genuine certified products with express last-mile fulfillment.',
    accent: '#818CF8',
    bg: 'radial-gradient(ellipse at 80% 50%, rgba(99, 102, 241, 0.25), transparent 60%), #090D16',
    link: '/products',
    img: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=700&q=80',
    stat: '100% Genuine Guaranteed'
  },
  {
    id: 'hero-2',
    tag: 'OFFICIAL BOUTIQUES',
    title: 'Verified Brand Flagship Stores',
    subtitle: 'Direct manufacturer warranties, authenticated serials, and dedicated brand support for top global labels.',
    accent: '#06B6D4',
    bg: 'radial-gradient(ellipse at 80% 50%, rgba(6, 182, 212, 0.25), transparent 60%), #090D16',
    link: '/brands',
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=80',
    stat: 'Direct Brand Fulfillment'
  },
  {
    id: 'hero-3',
    tag: 'SCALE YOUR STORE',
    title: 'Become an Avero Merchant Partner',
    subtitle: 'Reach millions of buyers across India with zero onboarding friction, automated GST invoicing, and daily T+1 payouts.',
    accent: '#F43F5E',
    bg: 'radial-gradient(ellipse at 80% 50%, rgba(244, 63, 94, 0.25), transparent 60%), #090D16',
    link: '/seller',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80',
    stat: 'Instant Onboarding & KYC'
  }
];

const LUXURY_BRANDS = [
  { name: 'Apple', icon: '🍎', tagline: 'iPhone & MacBooks', link: '/brand/apple' },
  { name: 'Sony', icon: '🎧', tagline: 'Bravia & Audio', link: '/brand/sony' },
  { name: 'Samsung', icon: '🌌', tagline: 'Galaxy AI & OLED', link: '/brand/samsung' },
  { name: 'Nike', icon: '✔️', tagline: 'Footwear & Street', link: '/brand/nike' },
  { name: 'ASUS ROG', icon: '🎮', tagline: 'Gaming Laptops', link: '/brand/asus' },
  { name: 'OnePlus', icon: '⚡', tagline: 'Fast Charging', link: '/brand/oneplus' }
];

export default function HomePage() {
  const { user, products = [] } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 12 });
  const [recCategory, setRecCategory] = useState('ALL'); // 'ALL' | 'mobiles' | 'electronics' | 'footwear'

  const heroSlides = useMemo(() => {
    try {
      const saved = localStorage.getItem('avero_home_banners');
      if (saved) {
        const parsed = JSON.parse(saved);
        const activeBanners = parsed.filter(b => b.active !== false);
        if (activeBanners.length > 0) {
          return activeBanners.map(b => ({
            ...b,
            bg: b.bg || `radial-gradient(ellipse at 80% 50%, ${(b.accent || '#3B82F6')}40, transparent 60%), #090D16`
          }));
        }
      }
    } catch (_) {}
    return HERO_SLIDES;
  }, []);

  useEffect(() => {
    if (isHovered || heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered, heroSlides.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const allAvailable = products;

  // Filter pools
  const flashDeals = allAvailable.slice(0, 4);

  const recommendedProducts = (
    recCategory === 'ALL'
      ? allAvailable.filter(p => p.rating >= 4.6 || p.discount >= 10)
      : allAvailable.filter(p => p.category === recCategory)
  ).slice(0, 4);

  const customerPreferences = allAvailable.filter(p => (p.reviewsCount > 1500 || p.tags?.includes('Bestseller'))).slice(0, 4);
  const trendingElectronics = allAvailable.filter((p) => ['mobiles', 'electronics', 'audio'].includes(p.category)).slice(0, 4);
  const bestSellers = allAvailable.filter((p) => p.rating >= 4.7).slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* 1. Top Category Bar */}
      <CategoryBar />

      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* 2. Modern Luxury Hero Studio Carousel */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px -15px rgba(15, 23, 42, 0.25)',
            backgroundColor: '#090D16',
            minHeight: '320px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          {heroSlides.map((slide, idx) => {
            const isActive = activeSlide === idx;
            return (
              <div
                key={slide.id}
                style={{
                  display: isActive ? 'grid' : 'none',
                  gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
                  alignItems: 'center',
                  background: slide.bg || `radial-gradient(ellipse at 80% 50%, ${(slide.accent || '#3B82F6')}35, transparent 65%), #090D16`,
                  padding: '48px 56px',
                  minHeight: '340px',
                  position: 'relative'
                }}
              >
                {/* Left Text */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      backgroundColor: `${slide.accent || '#3B82F6'}20`,
                      color: slide.accent || '#3B82F6',
                      border: `1px solid ${slide.accent || '#3B82F6'}40`,
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: '800',
                      letterSpacing: '1px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Sparkles size={12} /> {slide.tag}
                    </span>
                  </div>

                  <h1 style={{
                    fontSize: '34px',
                    fontWeight: '900',
                    color: '#FFFFFF',
                    lineHeight: 1.15,
                    margin: 0,
                    letterSpacing: '-0.5px'
                  }}>
                    {slide.title}
                  </h1>

                  <p style={{
                    fontSize: '14.5px',
                    color: '#94A3B8',
                    lineHeight: 1.5,
                    maxWidth: '460px',
                    margin: 0
                  }}>
                    {slide.subtitle}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                    <Link
                      to={slide.link}
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#090D16',
                        padding: '12px 24px',
                        borderRadius: '9999px',
                        fontSize: '13.5px',
                        fontWeight: '800',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 8px 20px rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Explore Collection <ArrowRight size={16} />
                    </Link>

                    {slide.stat && (
                      <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>
                        {slide.stat}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Visual Image */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                  <div style={{
                    width: '320px',
                    height: '240px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
                  }}>
                    <img
                      src={slide.img}
                      alt={slide.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Carousel Dots */}
          <div style={{ position: 'absolute', bottom: '16px', left: '56px', display: 'flex', gap: '8px', zIndex: 10 }}>
            {heroSlides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setActiveSlide(dotIdx)}
                style={{
                  width: activeSlide === dotIdx ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  backgroundColor: activeSlide === dotIdx ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* 3. ⚡ Dynamic Lightning Flash Drops Engine (Live Countdown + Stock Meter) */}
        <FlashDealsCarousel />

        {/* 3. ⚡ Dynamic Lightning Flash Drops Engine */}
        <FlashDealsCarousel />

        {/* 4. ✨ Recommended For You */}
        {recommendedProducts.length > 0 && (
          <section className="home-section-container" style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#EEF2FF',
                  color: '#4F46E5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sparkles size={19} />
                </div>
                <div>
                  <h2 style={{ fontSize: '17.5px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    Recommended For You
                  </h2>
                  <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                    AI tailored selections based on your browsing & cart preferences
                  </span>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { id: 'ALL', label: 'All Picks' },
                  { id: 'mobiles', label: '📱 Mobiles' },
                  { id: 'electronics', label: '💻 Electronics' },
                  { id: 'footwear', label: '👟 Fashion' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setRecCategory(cat.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '11.5px',
                      fontWeight: recCategory === cat.id ? '800' : '600',
                      backgroundColor: recCategory === cat.id ? '#4F46E5' : '#F1F5F9',
                      color: recCategory === cat.id ? '#FFFFFF' : '#475569',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="home-2x2-grid">
              {recommendedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* 5. 🎯 Customer Preferences & Trending Now */}
        {customerPreferences.length > 0 && (
          <section className="home-section-container" style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <HeartHandshake size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '17.5px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    Customer Preferences & Trends
                  </h2>
                  <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                    Most loved items with verified high buyer satisfaction
                  </span>
                </div>
              </div>

              <Link to="/deals" style={{ fontSize: '12.5px', fontWeight: '700', color: '#059669', textDecoration: 'none' }}>
                View Trending Picks →
              </Link>
            </div>

            <div className="home-2x2-grid">
              {customerPreferences.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* 6. 👑 Featured Brand Boutiques */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '17.5px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Featured Brand Boutiques
              </h2>
              <span style={{ fontSize: '10.5px', backgroundColor: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: '9999px', fontWeight: '800' }}>
                100% Genuine
              </span>
            </div>
            <Link to="/brands" style={{ fontSize: '12.5px', fontWeight: '700', color: '#2563EB', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All Brands →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px'
          }}>
            {BRAND_DIRECTORY.slice(0, 6).map((b) => (
              <Link
                key={b.name}
                to={`/brand/${b.slug}`}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(37, 99, 235, 0.08)';
                  e.currentTarget.style.borderColor = '#93C5FD';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  overflow: 'hidden'
                }}>
                  <img
                    src={b.logo}
                    alt={b.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>{b.name}</strong>
                  <ShieldCheck size={13} color="#059669" />
                </div>
                <span style={{ fontSize: '11px', color: '#64748B', marginTop: '3px', lineHeight: 1.2, maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {b.tagline.split(':')[0]}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 7. 💻 Trending in Flagships & Electronics */}
        {trendingElectronics.length > 0 && (
          <section className="home-section-container" style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '17.5px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Trending in Flagships & Electronics
                </h2>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  Zero-cost EMI and express next-day delivery on verified gadgets
                </span>
              </div>
              <Link to="/products?category=electronics" style={{ fontSize: '12.5px', fontWeight: '700', color: '#6366F1', textDecoration: 'none' }}>
                Explore Category →
              </Link>
            </div>

            <div className="home-2x2-grid">
              {trendingElectronics.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* 8. ⭐ Community Bestsellers */}
        {bestSellers.length > 0 && (
          <section className="home-section-container" style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '17.5px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Top Rated Community Bestsellers
                </h2>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  Rated 4.7★ and above by verified Indian buyers
                </span>
              </div>
              <Link to="/products" style={{ fontSize: '12.5px', fontWeight: '700', color: '#6366F1', textDecoration: 'none' }}>
                View All Products →
              </Link>
            </div>

            <div className="home-2x2-grid">
              {bestSellers.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* If no products are uploaded yet, show Department & Onboarding Highlight */}
        {allAvailable.length === 0 && (
          <section style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            padding: '36px 24px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Sparkles size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A', margin: '0 0 8px' }}>
              Welcome to the Avero Marketplace Catalog
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '520px', margin: '0 auto 24px', lineHeight: '1.6' }}>
              Explore official brand boutiques above or visit our departments to discover fresh items added by verified sellers.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to="/categories"
                className="btn btn-primary"
                style={{ borderRadius: '9999px', padding: '12px 24px', fontSize: '13.5px', fontWeight: '800' }}
              >
                Browse All Departments
              </Link>
              <Link
                to="/seller"
                className="btn btn-secondary"
                style={{ borderRadius: '9999px', padding: '12px 24px', fontSize: '13.5px', fontWeight: '800' }}
              >
                Become a Seller Partner
              </Link>
            </div>
          </section>
        )}

        {/* 9. 🛡️ Trust Pillars Grid */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px'
        }}>
          {[
            { icon: Truck, title: 'Express Fast Delivery', desc: 'Free courier on orders above ₹499' },
            { icon: ShieldCheck, title: '100% Authentic Products', desc: 'Direct from brand authorized distributors' },
            { icon: RotateCcw, title: '7-Day Easy Doorstep Returns', desc: 'Instant replacement or full refund to bank' },
            { icon: Headphones, title: '24x7 Customer Helpline', desc: 'Dedicated support via chat & phone' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#EEF2FF',
                  color: '#4F46E5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block' }}>{item.title}</strong>
                  <span style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', display: 'block' }}>{item.desc}</span>
                </div>
              </div>
            );
          })}
        </section>

      </div>
    </div>
  );
}
