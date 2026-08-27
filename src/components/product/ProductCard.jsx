import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Heart, Star, ShieldCheck } from 'lucide-react';

export const getCategoryFallbackImage = (category = '', title = '') => {
  const text = `${category || ''} ${title || ''}`.toLowerCase();
  if (text.includes('mob') || text.includes('phone') || text.includes('apple') || text.includes('oneplus') || text.includes('samsung galaxy')) {
    return 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80';
  }
  if (text.includes('lap') || text.includes('macbook') || text.includes('asus') || text.includes('dell') || text.includes('rog')) {
    return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80';
  }
  if (text.includes('aud') || text.includes('sound') || text.includes('head') || text.includes('speaker') || text.includes('sony') || text.includes('boat')) {
    return 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80';
  }
  if (text.includes('tv') || text.includes('oled') || text.includes('screen') || text.includes('display')) {
    return 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80';
  }
  if (text.includes('foot') || text.includes('shoe') || text.includes('sneak') || text.includes('nike') || text.includes('puma')) {
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80';
  }
  if (text.includes('fash') || text.includes('cloth') || text.includes('jean') || text.includes('shirt') || text.includes('levi')) {
    return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80';
  }
  if (text.includes('groc') || text.includes('coffee') || text.includes('food') || text.includes('bean') || text.includes('tokai')) {
    return 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80';
  }
  if (text.includes('home') || text.includes('kitchen') || text.includes('appl')) {
    return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80';
  }
  return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80';
};

export default function ProductCard({ product, layout = 'grid', claimProgress = null }) {
  const { isInWishlist, toggleWishlist } = useApp();
  const isWishlisted = isInWishlist(product.id);

  const rawImg = product.thumbnail || product.image || (Array.isArray(product.images) && product.images[0]) || '';
  const initialImg = rawImg && typeof rawImg === 'string' && rawImg.trim().length > 5 
    ? rawImg 
    : getCategoryFallbackImage(product.category, product.title);

  const [imgSrc, setImgSrc] = React.useState(initialImg);

  React.useEffect(() => {
    const nextImg = product.thumbnail || product.image || (Array.isArray(product.images) && product.images[0]) || '';
    setImgSrc(nextImg && typeof nextImg === 'string' && nextImg.trim().length > 5 
      ? nextImg 
      : getCategoryFallbackImage(product.category, product.title));
  }, [product.thumbnail, product.image, product.images, product.category, product.title]);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleImageError = () => {
    const fallback = getCategoryFallbackImage(product.category, product.title);
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  if (layout === 'list') {
    return (
      <Link
        to={`/product/${product.id}`}
        style={{
          display: 'flex',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '16px',
          gap: '16px',
          textDecoration: 'none',
          color: 'inherit',
          position: 'relative',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 28px -6px rgba(15, 23, 42, 0.08)';
          e.currentTarget.style.borderColor = '#CBD5E1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.03)';
          e.currentTarget.style.borderColor = '#E2E8F0';
        }}
      >
        {/* Left: Product Media Frame */}
        <div style={{
          width: '120px',
          height: '120px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8FAFC',
          borderRadius: '12px',
          padding: '8px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <img
            src={imgSrc}
            alt={product.title || 'Product'}
            loading="lazy"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={handleImageError}
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Right: Product Details */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                {product.brand}
              </span>
              <button
                type="button"
                onClick={handleWishlistClick}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  color: isWishlisted ? '#EF4444' : '#94A3B8',
                  display: 'flex'
                }}
              >
                <Heart size={17} fill={isWishlisted ? '#EF4444' : 'none'} />
              </button>
            </div>

            <h3 style={{
              fontSize: '14.5px',
              fontWeight: '700',
              color: '#0F172A',
              lineHeight: '1.35',
              margin: '0 0 6px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {product.title}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                backgroundColor: '#F1F5F9',
                color: '#0F172A',
                fontSize: '11px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '9999px'
              }}>
                <Star size={10} fill="#F59E0B" color="#F59E0B" /> {product.rating}
              </span>
              <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                ({product.ratingsCount ? product.ratingsCount.toLocaleString('en-IN') : 840})
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <>
                <span style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'line-through' }}>
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#059669' }}>
                  {product.discount}% off
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Modern Luxury Minimalist Grid Card
  return (
    <Link
      to={`/product/${product.id}`}
      className="home-product-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        padding: '14px',
        textDecoration: 'none',
        color: 'inherit',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 32px -10px rgba(15, 23, 42, 0.09)';
        e.currentTarget.style.borderColor = '#CBD5E1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.03)';
        e.currentTarget.style.borderColor = '#E2E8F0';
      }}
    >
      {/* Top Floating Badges */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 3, display: 'flex', gap: '6px' }}>
        {product.discount >= 15 && (
          <span style={{
            fontSize: '10.5px',
            fontWeight: '800',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '3px 8px',
            borderRadius: '9999px',
            letterSpacing: '0.2px'
          }}>
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Floating Wishlist Heart */}
      <button
        type="button"
        onClick={handleWishlistClick}
        aria-label="Save to Wishlist"
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
          color: isWishlisted ? '#EF4444' : '#64748B',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          cursor: 'pointer'
        }}
      >
        <Heart size={15} fill={isWishlisted ? '#EF4444' : 'none'} />
      </button>

      {/* Minimalist Image Canvas Frame */}
      <div className="home-card-stage" style={{
        width: '100%',
        height: '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: '14px',
        padding: '12px',
        marginBottom: '12px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <img
          src={imgSrc}
          alt={product.title || 'Product'}
          loading="lazy"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={handleImageError}
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </div>

      {/* Product Content */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            {product.brand}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11.5px', fontWeight: '700', color: '#0F172A' }}>
            <Star size={11} fill="#F59E0B" color="#F59E0B" /> {product.rating}
          </div>
        </div>

        {/* Product Title */}
        <h3 style={{
          fontSize: '13.5px',
          fontWeight: '700',
          color: '#0F172A',
          lineHeight: '1.4',
          margin: '0 0 8px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '38px'
        }}>
          {product.title}
        </h3>

        {/* Clean Luxury Price Row */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: '6px', paddingTop: '4px' }}>
          <span className="price-val" style={{ fontSize: '17px', fontWeight: '900', color: '#0F172A' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.mrp > product.price && (
            <span style={{ fontSize: '12px', color: '#94A3B8', textDecoration: 'line-through', fontWeight: '500' }}>
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Claim Progress bar for Flash Deals */}
        {claimProgress && (
          <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontWeight: '800', color: '#EA580C', marginBottom: '3px' }}>
              <span>🔥 {claimProgress.claimed}% Claimed</span>
              <span>Only {claimProgress.unitsLeft || 2} Left</span>
            </div>
            <div style={{ height: '4px', backgroundColor: '#FEE2E2', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${claimProgress.claimed}%`, backgroundColor: '#DC2626', borderRadius: '9999px' }} />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
