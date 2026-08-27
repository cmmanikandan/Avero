import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActiveLiveFlashDeals, getCountdownTimeRemaining } from '../../services/flashDealsService';
import {
  Zap,
  Clock,
  Flame,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Tag,
  TrendingDown
} from 'lucide-react';

export default function FlashDealsCarousel() {
  const { slot, deals } = getActiveLiveFlashDeals();
  const [timeRemaining, setTimeRemaining] = useState(() => getCountdownTimeRemaining(slot?.endsAt));

  // Live second-by-second countdown interval
  useEffect(() => {
    if (!slot?.endsAt) return;
    const timer = setInterval(() => {
      setTimeRemaining(getCountdownTimeRemaining(slot.endsAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [slot?.endsAt]);

  if (!slot || !deals || deals.length === 0) {
    return null;
  }

  const topDeals = deals.slice(0, 4);

  return (
    <section style={{ margin: '28px 0', position: 'relative' }}>
      <Link
        to="/flash-deals"
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'block'
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #311042 50%, #450A0A 100%)',
            borderRadius: '24px',
            border: '1.5px solid rgba(244, 63, 94, 0.3)',
            padding: '24px 32px',
            boxShadow: '0 12px 36px -8px rgba(225, 29, 72, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 20px 45px -8px rgba(225, 29, 72, 0.35)';
            e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 12px 36px -8px rgba(225, 29, 72, 0.25)';
            e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.3)';
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-40%',
              right: '-10%',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
              position: 'relative',
              zIndex: 2
            }}
          >
            {/* Left Content Column */}
            <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* Badge & Live Timer Pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: '900',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 10px rgba(239, 68, 68, 0.4)'
                  }}
                >
                  <Zap size={13} fill="#FFFFFF" /> LIGHTNING FLASH DROPS • LIVE NOW
                </span>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    color: '#FFFFFF',
                    fontSize: '12px'
                  }}
                >
                  <Clock size={14} color="#F87171" />
                  <span style={{ color: '#CBD5E1', fontSize: '11px', fontWeight: '700' }}>ENDS IN:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: '900', color: '#FDE047', letterSpacing: '1px' }}>
                    {timeRemaining.hours} : {timeRemaining.minutes} : <span style={{ color: '#F87171' }}>{timeRemaining.seconds}</span>
                  </span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: '950',
                    color: '#FFFFFF',
                    margin: '4px 0 6px',
                    letterSpacing: '-0.5px',
                    lineHeight: '1.25'
                  }}
                >
                  Doorbuster Flash Sales & Drops
                </h2>
                <p
                  style={{
                    fontSize: '13.5px',
                    color: '#E2E8F0',
                    margin: 0,
                    lineHeight: '1.4',
                    maxWidth: '520px'
                  }}
                >
                  Deep warehouse clearance discounts on flagship brands (Samsung, Apple, Sony, Nike, ASUS) with real-time stock claim velocity.
                </p>
              </div>

              {/* Brand Tags */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                {['Samsung 65" 4K', 'iPhone 15 Pro', 'Sony WH-1000XM5', 'Nike Pegasus', 'ROG Zephyrus'].map((brand, bIdx) => (
                  <span
                    key={bIdx}
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.85)',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      padding: '3px 10px',
                      borderRadius: '8px'
                    }}
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Product Thumbnails Preview + CTA Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap'
              }}
            >
              {/* Product Thumbnail Stack */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {topDeals.map((deal, idx) => (
                  <div
                    key={deal.id}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '14px',
                      backgroundColor: '#FFFFFF',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={deal.thumbnail}
                      alt={deal.title}
                      style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        backgroundColor: '#DC2626',
                        color: '#FFFFFF',
                        fontSize: '8.5px',
                        fontWeight: '900',
                        padding: '1px 3px',
                        borderRadius: '3px'
                      }}
                    >
                      -{deal.discountPercent}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  padding: '12px 22px',
                  borderRadius: '14px',
                  fontSize: '13.5px',
                  fontWeight: '900',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                  flexShrink: 0
                }}
              >
                <span>View All Flash Drops</span>
                <ArrowRight size={16} color="#DC2626" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
