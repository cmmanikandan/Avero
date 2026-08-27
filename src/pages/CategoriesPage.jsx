import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  Laptop,
  Headphones,
  Shirt,
  Footprints,
  Tv,
  Watch,
  Sparkles,
  Home,
  ShoppingBag,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Tag
} from 'lucide-react';

const ICON_MAP = {
  Smartphone,
  Laptop,
  Headphones,
  Shirt,
  Footprints,
  Tv,
  Watch,
  Sparkles,
  Home,
  ShoppingBag
};

// Subcategory Image Map for visual thumbnails
const SUBCAT_IMAGES = {
  'Flagship Phones': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&q=80',
  '5G Mobiles': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80',
  'Budget Smartphones': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&q=80',
  'iPads & Tablets': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80',
  'Mobile Accessories': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&q=80',
  'Power Banks': 'https://images.unsplash.com/photo-1609592424364-d6526eb6fb9e?w=300&q=80',
  'Gaming Laptops': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&q=80',
  'Thin & Light Laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80',
  'MacBooks': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80',
  'Monitors': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80',
  'PC Components': 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=300&q=80',
  'Printers & Inks': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300&q=80',
  'TWS Earbuds': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&q=80',
  'Over-Ear Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
  'Bluetooth Speakers': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&q=80',
  'Soundbars': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&q=80',
  'Neckbands': 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=300&q=80',
  'Party Speakers': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&q=80',
  "Men's Shirts": 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&q=80',
  "Men's Jeans": 'https://images.unsplash.com/photo-1542272604-780c96856592?w=300&q=80',
  "Women's Kurtas": 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80',
  "Women's Dresses": 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&q=80',
  'T-Shirts': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80',
  'Jackets & Hoodies': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&q=80',
  'Running Shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80',
  'Sneakers': 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300&q=80',
  'Casual Shoes': 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&q=80',
  'Formal Shoes': 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=300&q=80',
  'Sandals & Slippers': 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=300&q=80',
  'Smart 4K TVs': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300&q=80',
  'Air Conditioners': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&q=80',
  'Refrigerators': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&q=80',
  'Washing Machines': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&q=80'
};

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { products = [] } = useApp();
  const [selectedCatId, setSelectedCatId] = useState(CATEGORIES[0].id);

  const activeCategory = CATEGORIES.find(c => c.id === selectedCatId) || CATEGORIES[0];
  const activeIcon = ICON_MAP[activeCategory.icon] || ShoppingBag;

  // Products in this category for trending preview
  const categoryProducts = products.filter(p => p.category === activeCategory.id).slice(0, 4);

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '70px' }}>
      
      {/* ── Desktop View (Rich Multi-Column Grid) ── */}
      <div className="desktop-categories-view container" style={{ paddingTop: '20px' }}>
        <div style={{
          backgroundColor: '#ffffff',
          padding: '20px 24px',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '900', margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={22} color="#2563EB" /> All Marketplace Departments
            </h1>
            <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', margin: '4px 0 0' }}>
              Browse certified catalog collections across 10 official retail categories
            </p>
          </div>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#2563EB', backgroundColor: '#EFF6FF', padding: '6px 14px', borderRadius: '20px', border: '1px solid #BFDBFE' }}>
            10 Main Departments • 60+ Subcategories
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {CATEGORIES.map(cat => {
            const IconComp = ICON_MAP[cat.icon] || ShoppingBag;
            return (
              <div
                key={cat.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                {/* Header Banner */}
                <div style={{
                  height: '120px',
                  position: 'relative',
                  backgroundImage: `url(${cat.banner || cat.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '14px 18px'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 100%)'
                  }} />

                  <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(6px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff'
                    }}>
                      <IconComp size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                        {cat.name}
                      </h3>
                      <span style={{ fontSize: '11px', color: '#93C5FD', fontWeight: '700' }}>
                        Min. 30% to 70% Off
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subcategories Chips Grid */}
                <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                    {(cat.subcategories || []).map((sub, sIdx) => (
                      <Link
                        key={sIdx}
                        to={`/products?category=${cat.id}&q=${encodeURIComponent(sub)}`}
                        style={{
                          fontSize: '12px',
                          color: '#334155',
                          backgroundColor: '#F1F5F9',
                          padding: '5px 10px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          border: '1px solid #E2E8F0',
                          fontWeight: '600',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>

                  <Link
                    to={`/products?category=${cat.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: '#EFF6FF',
                      color: '#2563EB',
                      fontSize: '13px',
                      fontWeight: '800',
                      textDecoration: 'none',
                      border: '1px solid #BFDBFE'
                    }}
                  >
                    <span>Explore All in {cat.name}</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile 2-Pane Split Explorer (Left Rail + Right Subcategory Panel) ── */}
      <div className="mobile-categories-view">
        
        {/* Left Category Selection Rail */}
        <div
          className="no-scrollbar"
          style={{
            width: '84px',
            backgroundColor: '#F1F5F9',
            borderRight: '1px solid #E2E8F0',
            overflowY: 'auto',
            height: 'calc(100vh - 120px)',
            position: 'sticky',
            top: '56px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {CATEGORIES.map(cat => {
            const IconComp = ICON_MAP[cat.icon] || ShoppingBag;
            const isSelected = selectedCatId === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                style={{
                  padding: '12px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                  borderLeft: isSelected ? '4px solid #2563EB' : '4px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                    border: isSelected ? '2px solid #2563EB' : '1px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? '#2563EB' : '#64748B',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: isSelected ? '800' : '600',
                    color: isSelected ? '#1D4ED8' : '#64748B',
                    lineHeight: '1.2'
                  }}
                >
                  {cat.name.split('&')[0]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Active Category Content Pane */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            height: 'calc(100vh - 120px)',
            padding: '12px 14px',
            backgroundColor: '#FFFFFF'
          }}
        >
          {/* Active Category Hero Card */}
          <div
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              height: '110px',
              backgroundImage: `url(${activeCategory.banner || activeCategory.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '12px',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 100%)'
              }}
            />

            <div style={{ position: 'relative', zIndex: 2, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: '900', margin: 0, color: '#FFFFFF' }}>
                  {activeCategory.name}
                </h2>
                <span style={{ fontSize: '11px', color: '#FDE047', fontWeight: '700' }}>
                  Up to 60% Off Deals
                </span>
              </div>

              <Link
                to={`/products?category=${activeCategory.id}`}
                style={{
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                View All <ChevronRight size={13} />
              </Link>
            </div>
          </div>

          {/* Subcategories Visual Grid */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Explore Subcategories
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px'
              }}
            >
              {(activeCategory.subcategories || []).map((sub, sIdx) => {
                const subImg = SUBCAT_IMAGES[sub] || activeCategory.image;
                return (
                  <Link
                    key={sIdx}
                    to={`/products?category=${activeCategory.id}&q=${encodeURIComponent(sub)}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      padding: '8px 4px',
                      borderRadius: '10px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      textDecoration: 'none'
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        marginBottom: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img
                        src={subImg}
                        alt={sub}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#1E293B', lineHeight: '1.2' }}>
                      {sub}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Popular Brands Strip */}
          {activeCategory.filterGroups?.find(f => f.id === 'brand') && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Featured Brands
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {activeCategory.filterGroups.find(f => f.id === 'brand').options.slice(0, 6).map(brand => (
                  <Link
                    key={brand}
                    to={`/products?category=${activeCategory.id}&brand=${encodeURIComponent(brand)}`}
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#EFF6FF',
                      color: '#1D4ED8',
                      border: '1px solid #BFDBFE',
                      textDecoration: 'none'
                    }}
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Trending Deals Mini Shelf */}
          {categoryProducts.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={14} color="#EA580C" /> Trending in {activeCategory.name.split('&')[0]}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {categoryProducts.map(p => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      textDecoration: 'none'
                    }}
                  >
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      style={{ width: '48px', height: '48px', objectFit: 'contain', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '900', color: '#0F172A' }}>₹{p.price.toLocaleString('en-IN')}</span>
                        <span style={{ fontSize: '10px', color: '#059669', fontWeight: '700' }}>{p.discount}% off</span>
                      </div>
                    </div>
                    <ChevronRight size={14} color="#94A3B8" />
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        .desktop-categories-view { display: block; }
        .mobile-categories-view { display: none; }

        @media (max-width: 768px) {
          .desktop-categories-view { display: none !important; }
          .mobile-categories-view { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
