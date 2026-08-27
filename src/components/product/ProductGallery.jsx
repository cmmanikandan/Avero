import React, { useState, useRef, useEffect } from 'react';
import { Heart, Share2, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ProductImageViewerModal from './ProductImageViewerModal';

export default function ProductGallery({ images = [], title = '', productId }) {
  const { isInWishlist, toggleWishlist, showToast } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Touch swipe state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const isWishlisted = isInWishlist(productId);
  const galleryImages = images && images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80'];

  const handleMouseMove = (e) => {
    // Only desktop hover zoom
    if (window.innerWidth < 1024) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'success');
    } catch (err) {
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast('Product link copied to clipboard!', 'success');
    }
  };

  // Touch Swipe Handlers for Mobile
  const minSwipeDistance = 45;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      // Swiped Left -> Next Image
      setActiveIndex((prev) => (prev + 1) % galleryImages.length);
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev Image
      setActiveIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  return (
    <>
      <div className="pdp-gallery-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        {/* Main Gallery Frame */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', width: '100%' }}>
          
          {/* Desktop Left Vertical Thumbnails (Width 72px, Height 72px, Gap 12px, Rounded 10px) */}
          <div
            className="pdp-desktop-thumbnails no-scrollbar"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              width: '72px',
              flexShrink: 0,
              maxHeight: '480px',
              overflowY: 'auto'
            }}
          >
            {galleryImages.map((img, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className={`pdp-thumbnail-item ${isActive ? 'active' : ''}`}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '10px',
                    border: isActive ? '2px solid var(--primary-600)' : '1.5px solid var(--border-subtle)',
                    padding: '4px',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.16s ease',
                    boxShadow: isActive ? '0 0 0 1.5px var(--primary-600)' : 'none',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <img
                    src={img}
                    alt={`${title} thumbnail ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </button>
              );
            })}
          </div>

          {/* Large Centered Hero Display (Height 420-500px, 16px inner padding) */}
          <div
            className="pdp-main-stage"
            style={{
              flex: 1,
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              height: '480px',
              minHeight: '420px',
              maxHeight: '500px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              overflow: 'hidden',
              userSelect: 'none'
            }}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={() => setIsLightboxOpen(true)}
          >
            {/* Center Product Image (Enlarged, contain fit, centered horizontally & vertically) */}
            <img
              src={galleryImages[activeIndex]}
              alt={title}
              style={{
                maxWidth: '86%',
                maxHeight: '86%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                margin: 'auto',
                display: 'block',
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />

            {/* Desktop Zoom Magnifier Overlay */}
            {isZoomed && (
              <div
                className="zoom-lens desktop-only-zoom"
                style={{
                  backgroundImage: `url(${galleryImages[activeIndex]})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: '240%'
                }}
              />
            )}

            {/* Floating Action Icons (Wishlist, Share, Fullscreen - Horizontal Row) */}
            <div
              className="pdp-floating-actions"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '8px',
                zIndex: 10
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(productId)}
                className={`pdp-floating-btn ${isWishlisted ? 'heart-pulse' : ''}`}
                aria-label="Add to wishlist"
                title="Add to Wishlist"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '1px solid #CBD5E1',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                  color: isWishlisted ? '#EF4444' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <Heart size={17} fill={isWishlisted ? '#EF4444' : 'none'} />
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="pdp-floating-btn"
                aria-label="Share product"
                title="Share Product"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '1px solid #CBD5E1',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <Share2 size={16} />
              </button>

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="pdp-floating-btn"
                aria-label="View fullscreen image"
                title="View Fullscreen"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '1px solid #CBD5E1',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <Maximize2 size={16} />
              </button>
            </div>

            {/* Mobile Carousel Indicators / Dots */}
            {galleryImages.length > 1 && (
              <div
                className="mobile-gallery-dots"
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 8,
                  backgroundColor: 'rgba(15, 23, 42, 0.4)',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-full)',
                  backdropFilter: 'blur(4px)'
                }}
              >
                {galleryImages.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(idx);
                    }}
                    style={{
                      width: activeIndex === idx ? '16px' : '6px',
                      height: '6px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: activeIndex === idx ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Horizontal Thumbnail Strip */}
        <div
          className="mobile-thumbnails-strip no-scrollbar"
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            padding: '2px 0'
          }}
        >
          {galleryImages.map((img, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                style={{
                  width: '56px',
                  height: '56px',
                  flexShrink: 0,
                  borderRadius: 'var(--radius-sm)',
                  border: isActive ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                  padding: '3px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isActive ? '0 0 0 1px var(--primary-600)' : 'none'
                }}
              >
                <img
                  src={img}
                  alt={`View ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <ProductImageViewerModal
        images={galleryImages}
        initialIndex={activeIndex}
        title={title}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />

      <style>{`
        @media (min-width: 768px) {
          .mobile-thumbnails-strip {
            display: none !important;
          }
          .mobile-gallery-dots {
            display: none !important;
          }
          .pdp-desktop-thumbnails {
            display: flex !important;
          }
        }
        @media (max-width: 767px) {
          .pdp-desktop-thumbnails {
            display: none !important;
          }
          .desktop-only-zoom {
            display: none !important;
          }
          .mobile-thumbnails-strip {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
