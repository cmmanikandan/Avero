import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BRAND_DIRECTORY } from '../data/mockBrands';
import { PRODUCTS } from '../data/products';
import {
  Store,
  Sparkles,
  ShieldCheck,
  Search,
  Star,
  Users,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Grid,
  Filter,
  CheckCircle2,
  Package
} from 'lucide-react';

export default function BrandsDirectoryPage() {
  const navigate = useNavigate();
  const { products = [] } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Load custom seller registered brand stores from localStorage
  const allBrands = useMemo(() => {
    const defaultList = [...BRAND_DIRECTORY];
    try {
      const customStores = JSON.parse(localStorage.getItem('avero_brand_stores') || '[]');
      customStores.forEach(cs => {
        if (!defaultList.some(b => b.slug === cs.slug || b.name.toLowerCase() === cs.name?.toLowerCase())) {
          defaultList.push({
            id: `br-${cs.slug || Date.now()}`,
            name: cs.name,
            slug: cs.slug || cs.name.toLowerCase().replace(/\s+/g, '-'),
            logo: cs.logo || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&q=80',
            banner: cs.banner || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1400&q=80',
            tagline: cs.tagline || 'Verified Marketplace Brand Partner',
            category: cs.category || 'Lifestyle & Electronics',
            rating: cs.rating || 4.8,
            reviewsCount: cs.reviewsCount || 120,
            followerCount: cs.followerCount || '15K',
            verified: true,
            accentColor: '#3B82F6',
            description: cs.description || `Welcome to the official ${cs.name} flagship storefront on Avero.`
          });
        }
      });
    } catch (_) {}
    return defaultList;
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(allBrands.map(b => b.category).filter(Boolean));
    return ['ALL', ...Array.from(cats)];
  }, [allBrands]);

  const filteredBrands = useMemo(() => {
    return allBrands.filter(b => {
      const matchCat = selectedCategory === 'ALL' || b.category === selectedCategory;
      const matchSearch = !searchQuery.trim() || 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allBrands, selectedCategory, searchQuery]);

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Hero Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #090D16 0%, #1E1B4B 50%, #090D16 100%)',
        padding: '48px 20px',
        color: '#FFFFFF',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            padding: '4px 14px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: '800',
            color: '#60A5FA',
            letterSpacing: '0.8px'
          }}>
            <Sparkles size={13} /> OFFICIAL BRAND BOUTIQUES
          </div>

          <h1 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: '950', margin: 0, letterSpacing: '-0.8px', color: '#FFFFFF' }}>
            Explore Verified Global & Luxury Brands
          </h1>

          <p style={{ fontSize: '14.5px', color: '#94A3B8', maxWidth: '560px', margin: 0, lineHeight: 1.5 }}>
            Direct brand storefronts with 100% authentic merchandise, official manufacturer warranties, and exclusive platform vouchers.
          </p>

          {/* Search Box */}
          <div style={{
            width: '100%',
            maxWidth: '520px',
            marginTop: '12px',
            position: 'relative'
          }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search Apple, Sony, Nike, Samsung, ASUS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '48px',
                padding: '0 16px 0 46px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                color: '#FFFFFF',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '28px' }}>
        
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px' }} className="no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: selectedCategory === cat ? '2px solid #2563EB' : '1px solid #E2E8F0',
                backgroundColor: selectedCategory === cat ? '#EFF6FF' : '#FFFFFF',
                color: selectedCategory === cat ? '#2563EB' : '#475569',
                fontSize: '12.5px',
                fontWeight: selectedCategory === cat ? '800' : '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {cat === 'ALL' ? '🌟 All Flagship Brands' : cat}
            </button>
          ))}
        </div>

        {/* Brands Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '18px',
          marginTop: '12px'
        }}>
          {filteredBrands.map(brand => {
            // Count products for this brand
            const allAvailable = products.length > 0 ? products : PRODUCTS;
            const brandProductCount = allAvailable.filter(p => p.brand?.toLowerCase() === brand.name.toLowerCase()).length;

            return (
              <div
                key={brand.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#BFDBFE';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                {/* Banner Thumbnail */}
                <div style={{ position: 'relative', height: '110px', overflow: 'hidden' }}>
                  <img
                    src={brand.banner}
                    alt={brand.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)' }} />
                  
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    color: '#FFFFFF',
                    backdropFilter: 'blur(4px)',
                    fontSize: '10.5px',
                    fontWeight: '800',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Star size={11} color="#FBBF24" fill="#FBBF24" /> {brand.rating} ({brand.reviewsCount})
                  </span>
                </div>

                {/* Brand Logo & Info */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginTop: '-36px' }}>
                    {/* Brand Logo Image */}
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #FFFFFF',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ paddingTop: '28px', flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {brand.name}
                        </h3>
                        <ShieldCheck size={16} color="#059669" />
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
                        {brand.category}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {brand.tagline}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '10px', marginTop: 'auto' }}>
                    <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Package size={13} color="#2563EB" /> {brandProductCount} Products Live
                    </span>

                    <Link
                      to={`/brand/${brand.slug}`}
                      style={{
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        border: '1px solid #BFDBFE',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '800',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      Visit Store <ArrowRight size={13} />
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
