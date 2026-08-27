import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import ProductCard from '../components/product/ProductCard';
import FilterSidebar from '../components/filter/FilterSidebar';
import MobileFilterModal from '../components/filter/MobileFilterModal';
import {
  SlidersHorizontal,
  Sparkles,
  ChevronDown,
  Percent,
  Star,
  ShieldCheck,
  Truck
} from 'lucide-react';

export default function ProductListingPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('q') || '';
  const initialSort = searchParams.get('sort') || 'popularity';

  const { products } = useApp();
  const liveCatalog = products && products.length > 0 ? products : PRODUCTS;

  const [activeFilters, setActiveFilters] = useState({
    minRating: searchParams.get('rating') ? Number(searchParams.get('rating')) : null,
    minDiscount: searchParams.get('discount') ? 10 : null,
    assured: false,
    freeDelivery: false,
    brand: []
  });

  const [sortBy, setSortBy] = useState(initialSort);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  // Mobile always list, desktop always grid (auto responsive)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Category Info
  const currentCategory = CATEGORIES.find(c => c.id === categoryParam);

  // Filter Handlers
  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({ minRating: null, minDiscount: null, assured: false, freeDelivery: false, brand: [] });
  };

  const handleRemoveSingleFilter = (key, option = null) => {
    setActiveFilters(prev => {
      if (option && Array.isArray(prev[key])) {
        const nextArr = prev[key].filter(item => item !== option);
        return { ...prev, [key]: nextArr };
      }
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  // Multi-Token Search & Intelligent Ranking Engine
  const { results: filteredProducts, relatedProducts, relatedHeading, isFallback, fallbackMessage } = useMemo(() => {
    const applyFilters = (p) => {
      if (activeFilters.assured && !p.assured) return false;
      if (activeFilters.minRating && p.rating < activeFilters.minRating) return false;
      if (activeFilters.minDiscount && p.discount < activeFilters.minDiscount) return false;
      if (activeFilters.freeDelivery && !p.freeDelivery) return false;
      if (activeFilters.brand && activeFilters.brand.length > 0 && !activeFilters.brand.includes(p.brand)) return false;

      for (const key of Object.keys(activeFilters)) {
        if (['minRating', 'minDiscount', 'assured', 'freeDelivery', 'brand'].includes(key)) continue;
        const filterVals = activeFilters[key];
        if (Array.isArray(filterVals) && filterVals.length > 0) {
          const productAttrVal = p.attributes?.[key];
          if (!productAttrVal || !filterVals.includes(productAttrVal)) return false;
        }
      }
      return true;
    };

    const sortFn = (a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discount - a.discount;
      return (b.ratingsCount || 0) - (a.ratingsCount || 0); // popularity
    };

    // 1. Search Query Flow (e.g. "apple mobiles", "iphone", "nike shoes")
    if (searchParam) {
      const query = searchParam.toLowerCase().trim();
      const tokens = query.split(/\s+/).filter(Boolean);

      // Exact matches: matches ALL tokens
      const exactMatches = liveCatalog.filter(p => {
        const text = `${p.title} ${p.brand} ${p.category} ${p.subcategory || ''} ${(p.tags || []).join(' ')} ${(p.highlights || []).join(' ')} ${JSON.stringify(p.attributes || {})}`.toLowerCase();
        const allMatch = tokens.every(token => text.includes(token));
        return allMatch && applyFilters(p);
      }).sort(sortFn);

      if (exactMatches.length > 0) {
        // Find category of the exact matches (e.g. mobiles)
        const primaryCat = exactMatches[0]?.category;
        const exactIds = new Set(exactMatches.map(p => p.id));

        // Related matches from same category or matching ANY token
        const related = liveCatalog.filter(p => {
          if (exactIds.has(p.id)) return false;
          if (primaryCat && p.category === primaryCat) return true;
          const text = `${p.title} ${p.brand} ${p.category}`.toLowerCase();
          return tokens.some(t => text.includes(t));
        }).slice(0, 8);

        const categoryObj = CATEGORIES.find(c => c.id === primaryCat);
        const heading = categoryObj ? `Other Popular ${categoryObj.name} You May Like` : 'Related Recommendations';

        return {
          results: exactMatches,
          relatedProducts: related,
          relatedHeading: heading,
          isFallback: false,
          fallbackMessage: ''
        };
      }

      // If no exact matches, try partial token matches
      const partialMatches = liveCatalog.filter(p => {
        const text = `${p.title} ${p.brand} ${p.category} ${(p.tags || []).join(' ')}`.toLowerCase();
        return tokens.some(t => text.includes(t)) && applyFilters(p);
      }).sort(sortFn);

      if (partialMatches.length > 0) {
        return {
          results: partialMatches,
          relatedProducts: [],
          relatedHeading: '',
          isFallback: true,
          fallbackMessage: `Showing best matching results for "${searchParam}":`
        };
      }
    }

    // 2. Category Browse Flow
    let matched = liveCatalog.filter(p => {
      if (categoryParam && p.category !== categoryParam) return false;
      return applyFilters(p);
    }).sort(sortFn);

    if (matched.length > 0) {
      return { results: matched, relatedProducts: [], relatedHeading: '', isFallback: false, fallbackMessage: '' };
    }

    // 3. Fallback to top recommendations
    const trendingPicks = liveCatalog.filter(p => p.rating >= 4.4 || p.assured).slice(0, 8);
    return {
      results: trendingPicks,
      relatedProducts: [],
      relatedHeading: '',
      isFallback: true,
      fallbackMessage: 'Showing top recommended products for you:'
    };
  }, [liveCatalog, categoryParam, searchParam, activeFilters, sortBy]);

  // Active filter tags for chip bar
  const activeChips = useMemo(() => {
    const chips = [];
    if (activeFilters.assured) chips.push({ key: 'assured', label: 'Avero Assured' });
    if (activeFilters.minRating) chips.push({ key: 'minRating', label: `${activeFilters.minRating}★ & above` });
    if (activeFilters.minDiscount) chips.push({ key: 'minDiscount', label: `${activeFilters.minDiscount}%+ off` });
    if (activeFilters.freeDelivery) chips.push({ key: 'freeDelivery', label: 'Free Delivery' });

    if (activeFilters.brand && activeFilters.brand.length > 0) {
      activeFilters.brand.forEach(b => chips.push({ key: 'brand', label: b, option: b }));
    }

    Object.keys(activeFilters).forEach(key => {
      if (['assured', 'minRating', 'minDiscount', 'freeDelivery', 'brand'].includes(key)) return;
      const val = activeFilters[key];
      if (Array.isArray(val)) {
        val.forEach(item => chips.push({ key, label: item, option: item }));
      }
    });
    return chips;
  }, [activeFilters]);

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '40px' }}>
      
      {/* Horizontal Filter Pills Bar */}
      {/* Mobile Sticky Filter Strip */}
      <div
        style={{
          position: 'sticky',
          top: '52px',
          zIndex: 40,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #E2E8F0',
          padding: '10px 16px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}
        className="mobile-filter-strip no-scrollbar"
      >
        <button
          type="button"
          onClick={() => setIsSortModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid #CBD5E1',
            backgroundColor: '#ffffff',
            color: '#1E293B',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Sort ⌵
        </button>

        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid #CBD5E1',
            backgroundColor: '#ffffff',
            color: '#1E293B',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Filter ☷
        </button>

        <button
          type="button"
          onClick={() => handleFilterChange('minDiscount', activeFilters.minDiscount === 50 ? null : 50)}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            border: activeFilters.minDiscount === 50 ? '1px solid var(--primary-600)' : '1px solid #CBD5E1',
            backgroundColor: activeFilters.minDiscount === 50 ? '#EFF6FF' : '#ffffff',
            color: activeFilters.minDiscount === 50 ? 'var(--primary-600)' : '#1E293B',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          50% or more
        </button>

        <button
          type="button"
          onClick={() => handleFilterChange('minRating', activeFilters.minRating === 4 ? null : 4)}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            border: activeFilters.minRating === 4 ? '1px solid var(--primary-600)' : '1px solid #CBD5E1',
            backgroundColor: activeFilters.minRating === 4 ? '#EFF6FF' : '#ffffff',
            color: activeFilters.minRating === 4 ? 'var(--primary-600)' : '#1E293B',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          ★ 4★ & above
        </button>

        <button
          type="button"
          onClick={() => handleFilterChange('assured', !activeFilters.assured)}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            border: activeFilters.assured ? '1px solid var(--primary-600)' : '1px solid #CBD5E1',
            backgroundColor: activeFilters.assured ? '#EFF6FF' : '#ffffff',
            color: activeFilters.assured ? 'var(--primary-600)' : '#1E293B',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Avero Assured
        </button>
      </div>

      {/* Main Content Area */}
      <div className="container" style={{ paddingTop: '14px' }}>

        {/* Layout: Sidebar Filter (Desktop) + Products (Right) */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          
          {/* Desktop Left Persistent Sidebar */}
          <div className="desktop-filter-container" style={{ width: '270px', flexShrink: 0 }}>
            <FilterSidebar
              selectedCategory={categoryParam}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Right Products Container */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            
            {/* Desktop Header Bar: Results count & Sort Tabs */}
            <div
              className="desktop-plp-header"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                marginBottom: '14px',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <h1 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  {searchParam ? `Results for "${searchParam}"` : currentCategory ? currentCategory.name : 'All Products'}
                </h1>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Showing {filteredProducts.length} products
                </span>
              </div>

              {/* Desktop Sort Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginRight: '4px' }}>Sort By:</span>
                {[
                  { label: 'Popularity', value: 'popularity' },
                  { label: 'Price: Low to High', value: 'price_low' },
                  { label: 'Price: High to Low', value: 'price_high' },
                  { label: 'Top Rated', value: 'rating' },
                  { label: 'Discount', value: 'discount' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSortBy(opt.value)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      border: '1px solid ' + (sortBy === opt.value ? '#0F172A' : '#E2E8F0'),
                      backgroundColor: sortBy === opt.value ? '#0F172A' : '#FFFFFF',
                      color: sortBy === opt.value ? '#FFFFFF' : '#475569',
                      fontWeight: sortBy === opt.value ? '800' : '600',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: sortBy === opt.value ? '0 4px 12px rgba(15, 23, 42, 0.15)' : 'none'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Fallback Notice */}
            {isFallback && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: 'var(--primary-600)',
                fontWeight: '700',
                backgroundColor: '#EFF6FF',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '12px'
              }}>
                <Sparkles size={14} />
                <span>{fallbackMessage}</span>
              </div>
            )}

            {/* Active Filters Chip Row */}
            {activeChips.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {activeChips.map((chip, idx) => (
                  <span
                    key={`${chip.key}-${idx}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--primary-50)',
                      color: 'var(--primary-600)',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}
                  >
                    {chip.label}
                    <button
                      type="button"
                      onClick={() => handleRemoveSingleFilter(chip.key, chip.option)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-600)', cursor: 'pointer', padding: 0, display: 'flex' }}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={handleClearFilters}
                  style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: '11px', fontWeight: '700', cursor: 'pointer', padding: '2px 4px' }}
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Products — Mobile: always list, Desktop: grid */}
            <div className="plp-products-area">
              {filteredProducts.length === 0 ? (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '60px 24px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748B'
                  }}>
                    <SlidersHorizontal size={28} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    No Products Found
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '380px', margin: 0, lineHeight: '1.5' }}>
                    {searchParam ? `No catalog items matched "${searchParam}". Try clearing active filters or searching for another keyword.` : 'There are currently no product listings in this department.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="btn btn-secondary"
                    style={{ marginTop: '8px', fontSize: '12.5px', fontWeight: '700' }}
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Desktop Grid View */}
                  <div className="plp-grid-view">
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '16px',
                        alignItems: 'stretch',
                        width: '100%'
                      }}
                    >
                      {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} layout="grid" />
                      ))}
                    </div>

                    {relatedProducts && relatedProducts.length > 0 && (
                      <div style={{ marginTop: '32px', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Sparkles size={16} color="#2563EB" />
                          {relatedHeading || 'Other Popular Products You May Like'}
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 260px))',
                            gap: '16px',
                            alignItems: 'stretch',
                            justifyContent: 'start'
                          }}
                        >
                          {relatedProducts.map(product => (
                            <ProductCard key={product.id} product={product} layout="grid" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile List View */}
                  <div className="plp-list-view" style={{ paddingBottom: '90px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} layout="list" />
                      ))}
                    </div>

                    {relatedProducts && relatedProducts.length > 0 && (
                      <div style={{ marginTop: '24px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginBottom: '10px', paddingLeft: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Sparkles size={15} color="#2563EB" />
                          {relatedHeading || 'Other Popular Products You May Like'}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {relatedProducts.map(product => (
                            <ProductCard key={product.id} product={product} layout="list" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <style>{`
              .desktop-filter-container { display: block !important; }
              .desktop-plp-header { display: flex; }
              .mobile-filter-strip { display: none !important; }
              .plp-grid-view { display: grid; }
              .plp-list-view { display: none; }

              @media (max-width: 1023px) {
                .desktop-filter-container { display: none !important; }
                .desktop-plp-header { display: flex !important; }
                .mobile-filter-strip { display: flex !important; }
              }

              @media (max-width: 767px) {
                .desktop-plp-header { display: none !important; }
                .plp-grid-view { display: none !important; }
                .plp-list-view { display: block !important; }
              }
            `}</style>

          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        selectedCategory={categoryParam}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        totalResults={filteredProducts.length}
      />
    </div>
  );
}
