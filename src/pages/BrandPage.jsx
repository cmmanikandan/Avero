import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { getBrandBySlug, BRAND_DIRECTORY } from '../data/mockBrands';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/product/ProductCard';
import {
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Tag,
  Star,
  Users,
  Store,
  ExternalLink,
  Plus,
  Package,
  Award,
  Clock,
  Truck,
  ShoppingBag
} from 'lucide-react';

export default function BrandPage() {
  const { brandName } = useParams();
  const navigate = useNavigate();
  const { user, showToast, products = [], vendorSubmissions = [] } = useApp();

  const decodedBrand = decodeURIComponent(brandName || '').trim();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortOption, setSortOption] = useState('POPULARITY');
  const [isFollowing, setIsFollowing] = useState(false);

  // Exact Brand Lookup (from directory or custom stores)
  const brandMeta = useMemo(() => {
    if (!decodedBrand) return null;
    const fromDirectory = getBrandBySlug(decodedBrand);
    if (fromDirectory) return fromDirectory;

    // Check active seller profile if current user is the brand owner
    const activeStore = user?.storeName || (user?.role === 'seller' ? user.name : null);
    if (activeStore && (activeStore.toLowerCase() === decodedBrand.toLowerCase() || activeStore.toLowerCase().replace(/\s+/g, '-') === decodedBrand.toLowerCase())) {
      return {
        id: `br-${decodedBrand}`,
        name: activeStore,
        slug: decodedBrand.toLowerCase().replace(/\s+/g, '-'),
        category: user.category || 'Electronics',
        verified: true,
        tagline: 'Direct Manufacturer & Verified Flagship Storefront',
        rating: 4.9,
        reviewsCount: 142,
        followerCount: '24K',
        logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&q=80',
        banner: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1400&q=80',
        description: `Welcome to the official ${activeStore} Brand Storefront on Avero.`
      };
    }

    // Dynamic brand profile (never defaults to Apple!)
    const formattedName = decodedBrand.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      id: `br-${decodedBrand.toLowerCase().replace(/\s+/g, '-')}`,
      name: formattedName,
      slug: decodedBrand.toLowerCase().replace(/\s+/g, '-'),
      category: 'Brand Boutique',
      verified: true,
      tagline: `Official ${formattedName} Boutique on Avero`,
      rating: 4.8,
      reviewsCount: 840,
      followerCount: '45K',
      logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&q=80',
      banner: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1400&q=80',
      description: `Discover genuine certified products and collections from ${formattedName}.`
    };
  }, [decodedBrand, user]);

  // Combine live marketplace products + seller vendor submissions + mock products
  const allProducts = useMemo(() => {
    const combined = [...products, ...vendorSubmissions, ...PRODUCTS];
    const seen = new Set();
    return combined.filter(p => {
      if (!p || !p.id || seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [products, vendorSubmissions]);

  // Match products strictly for this brand
  const brandProducts = useMemo(() => {
    if (!decodedBrand) return [];
    const targetLower = decodedBrand.toLowerCase().trim();
    const targetSlug = targetLower.replace(/\s+/g, '-');
    const brandTitleLower = brandMeta?.name?.toLowerCase() || targetLower;

    return allProducts.filter((p) => {
      const bLower = p.brand ? p.brand.toLowerCase().trim() : '';
      const sLower = p.seller?.name ? p.seller.name.toLowerCase().trim() : '';
      const titleLower = p.title ? p.title.toLowerCase() : '';
      const bSlug = bLower.replace(/\s+/g, '-');
      const sSlug = sLower.replace(/\s+/g, '-');

      return (
        bLower === targetLower ||
        bSlug === targetSlug ||
        bLower === brandTitleLower ||
        sLower === targetLower ||
        sSlug === targetSlug ||
        sLower === brandTitleLower ||
        titleLower.startsWith(targetLower + ' ') ||
        titleLower.includes(` ${targetLower} `)
      );
    });
  }, [allProducts, decodedBrand, brandMeta]);

  const actualBrandTitle = brandMeta?.name || decodedBrand;

  // Available categories for this brand
  const categories = useMemo(() => {
    const cats = new Set(brandProducts.map((p) => p.category).filter(Boolean));
    return ['ALL', ...Array.from(cats)];
  }, [brandProducts]);

  const filteredProducts = useMemo(() => {
    return brandProducts
      .filter((p) => {
        if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'PRICE_LOW') return a.price - b.price;
        if (sortOption === 'PRICE_HIGH') return b.price - a.price;
        if (sortOption === 'RATING') return b.rating - a.rating;
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      });
  }, [brandProducts, selectedCategory, sortOption]);

  const handleToggleFollow = () => {
    setIsFollowing((prev) => !prev);
    showToast(
      !isFollowing
        ? `You are now following ${actualBrandTitle}! You'll receive alert vouchers.`
        : `Unfollowed ${actualBrandTitle}`,
      'info'
    );
  };

  const isStoreOwner = user?.role === 'seller' && user?.storeName?.toLowerCase() === actualBrandTitle.toLowerCase();

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Top Header Navigation Bar */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '12px 20px', position: 'sticky', top: 0, zIndex: 30 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/brands" style={{ fontSize: '12px', color: '#64748B', textDecoration: 'none', fontWeight: '600' }}>
                All Brands
              </Link>
              <span style={{ fontSize: '12px', color: '#CBD5E1' }}>/</span>
              <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#0F172A' }}>
                {actualBrandTitle}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              to="/brands"
              style={{
                fontSize: '12px',
                color: '#2563EB',
                fontWeight: '700',
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                padding: '6px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Store size={13} /> View All Brands
            </Link>

            <button
              type="button"
              onClick={handleToggleFollow}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                backgroundColor: isFollowing ? '#ECFDF5' : '#2563EB',
                color: isFollowing ? '#065F46' : '#FFFFFF',
                border: isFollowing ? '1px solid #A7F3D0' : 'none',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Users size={13} /> {isFollowing ? 'Following ✓' : '+ Follow'}
            </button>
          </div>
        </div>
      </div>

      {/* Brand Hero Studio Banner */}
      <div className="container" style={{ paddingTop: '20px' }}>
        <div
          style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.15)',
            border: '1px solid #E2E8F0',
            backgroundColor: '#0F172A',
            color: '#FFFFFF'
          }}
        >
          {/* Cover Photo */}
          <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
            <img
              src={brandMeta?.banner || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1400&q=80'}
              alt={actualBrandTitle}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)' }} />
          </div>

          {/* Profile Header Floating Card */}
          <div style={{ padding: '0 28px 24px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', position: 'relative', marginTop: '-42px' }}>
            
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
              {/* Brand Logo Avatar */}
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '20px',
                backgroundColor: '#FFFFFF',
                border: '3px solid #FFFFFF',
                boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img
                  src={brandMeta?.logo || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&q=80'}
                  alt={actualBrandTitle}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: '950', color: '#FFFFFF', margin: 0, letterSpacing: '-0.4px' }}>
                    {actualBrandTitle}
                  </h1>
                  <span style={{ backgroundColor: '#059669', color: '#FFFFFF', padding: '2px 8px', borderRadius: '9999px', fontSize: '10px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <ShieldCheck size={12} /> Verified Flagship
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>
                  {brandMeta?.tagline || `Official ${actualBrandTitle} Destination`}
                </p>
              </div>
            </div>

            {/* Metrics Chips */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '8px 16px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '900', color: '#FBBF24', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Star size={14} fill="#FBBF24" /> {brandMeta?.rating || 4.8}
                </div>
                <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px' }}>{brandMeta?.reviewsCount || 840} Ratings</div>
              </div>

              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '8px 16px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '900', color: '#38BDF8' }}>
                  {brandMeta?.followerCount || '45K'}
                </div>
                <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px' }}>Followers</div>
              </div>

              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '8px 16px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '900', color: '#34D399' }}>
                  {brandProducts.length}
                </div>
                <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px' }}>Catalog SKUs</div>
              </div>
            </div>

          </div>

          {/* Guarantee Badge Bar */}
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#94A3B8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={14} color="#FBBF24" /> 100% Brand Certified Original
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Truck size={14} color="#34D399" /> Free Express Delivery on All Orders
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#38BDF8" /> 7-Day Hassle-Free Replacement
            </span>
          </div>

        </div>
      </div>

      {/* Main Catalog View with Filter Pills */}
      <div className="container" style={{ paddingTop: '24px' }}>
        
        {/* Category Pills & Sort Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            backgroundColor: '#FFFFFF',
            padding: '12px 18px',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            marginBottom: '20px',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)'
          }}
        >
          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', flex: 1 }} className="no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  minHeight: '34px',
                  padding: '4px 16px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: selectedCategory === cat ? '800' : '600',
                  backgroundColor: selectedCategory === cat ? '#2563EB' : '#F1F5F9',
                  color: selectedCategory === cat ? '#FFFFFF' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat === 'ALL' ? `All ${actualBrandTitle} Products (${brandProducts.length})` : `${cat.toUpperCase()}`}
              </button>
            ))}
          </div>

          {/* Sort Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={14} color="#64748B" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
                fontWeight: '700',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="POPULARITY">Most Popular</option>
              <option value="PRICE_LOW">Price: Low to High</option>
              <option value="PRICE_HIGH">Price: High to Low</option>
              <option value="RATING">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* Product Catalog Grid or Empty State */}
        {filteredProducts.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              No Products Found for {actualBrandTitle}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '400px', margin: 0 }}>
              This brand has not published active catalog listings in this category yet.
            </p>
            <Link
              to="/brands"
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '800',
                textDecoration: 'none',
                marginTop: '6px'
              }}
            >
              Explore Other Brands →
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '16px'
          }}>
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
