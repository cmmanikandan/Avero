import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export default function ProductImageViewerModal({
  images = [],
  initialIndex = 0,
  title = '',
  isOpen,
  onClose
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setScale(1);
  }, [initialIndex, isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const handleNext = () => {
    setScale(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setScale(1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  // Touch swipe support
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    if (e.touches.length === 1 && scale === 1) {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 1 && scale === 1) {
      setTouchEnd(e.targetTouches[0].clientX);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const modalContent = (
    <div
      className="product-lightbox-root"
      style={{
        position: 'fixed',
        inset: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#F1F5F9', // Clean Light Theme Background
        zIndex: 9999999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 0,
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      {/* Top Header Controls Bar (Light Theme) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#0F172A',
          zIndex: 20,
          padding: '12px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #CBD5E1',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, paddingRight: '16px' }}>
          <div style={{
            fontSize: '15px',
            fontWeight: '800',
            color: '#0F172A',
            maxWidth: '680px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {title}
          </div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', fontWeight: '600' }}>
            Image {currentIndex + 1} of {images.length}
          </div>
        </div>

        {/* Zoom & Close Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 1}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: '#F8FAFC',
              color: '#334155',
              border: '1px solid #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: scale <= 1 ? 'not-allowed' : 'pointer',
              opacity: scale <= 1 ? 0.35 : 1,
              transition: 'all 0.15s ease'
            }}
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 3}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: '#F8FAFC',
              color: '#334155',
              border: '1px solid #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: scale >= 3 ? 'not-allowed' : 'pointer',
              opacity: scale >= 3 ? 0.35 : 1,
              transition: 'all 0.15s ease'
            }}
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>

          {scale > 1 && (
            <button
              type="button"
              onClick={handleResetZoom}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                color: '#334155',
                border: '1px solid #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Reset Zoom (100%)"
            >
              <RotateCcw size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              height: '38px',
              padding: '0 16px',
              borderRadius: '8px',
              backgroundColor: '#EF4444',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              marginLeft: '6px',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.35)'
            }}
            title="Close Lightbox (Esc)"
          >
            <X size={18} /> Close
          </button>
        </div>
      </div>

      {/* Main Image Stage (Light Theme) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '24px 20px',
          width: '100%',
          height: '100%',
          minHeight: 0,
          backgroundColor: '#F1F5F9'
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Left Nav Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: '24px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              border: '1.5px solid #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
              transition: 'all 0.15s ease'
            }}
            title="Previous Image (Left Arrow)"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Enlarged Centered Image Container */}
        <div
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)'
          }}
        >
          <img
            ref={imgRef}
            src={images[currentIndex]}
            alt={`${title} view ${currentIndex + 1}`}
            style={{
              maxWidth: '80vw',
              maxHeight: '66vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '8px',
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: scale > 1 ? 'grab' : 'zoom-in',
              userSelect: 'none'
            }}
            onClick={() => {
              if (scale === 1) handleZoomIn();
              else handleResetZoom();
            }}
          />
        </div>

        {/* Right Nav Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: '24px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              border: '1.5px solid #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
              transition: 'all 0.15s ease'
            }}
            title="Next Image (Right Arrow)"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip Bar (Light Theme) */}
      {images.length > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '14px 20px',
            zIndex: 20,
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #CBD5E1',
            width: '100%',
            boxSizing: 'border-box'
          }}
          className="no-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setScale(1);
                  setCurrentIndex(idx);
                }}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '8px',
                  border: isActive ? '2px solid var(--primary-600)' : '1.5px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  padding: '4px',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  opacity: isActive ? 1 : 0.6,
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 0 0 2px var(--primary-600)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
}
