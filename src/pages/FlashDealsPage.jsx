import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FLASH_DROPS_SCHEDULE, getCountdownTimeRemaining } from '../services/flashDealsService';
import {
  Zap,
  Clock,
  Flame,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Star,
  Sparkles,
  TrendingDown,
  Bell,
  CheckCircle2,
  Filter,
  Layers,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';

export default function FlashDealsPage() {
  const { addToCart, showToast } = useApp();
  const [selectedSlotId, setSelectedSlotId] = useState('drop-slot-1');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [reminders, setReminders] = useState({});

  const activeSlot = useMemo(() => {
    return FLASH_DROPS_SCHEDULE.find(s => s.id === selectedSlotId) || FLASH_DROPS_SCHEDULE[0];
  }, [selectedSlotId]);

  const targetDate = activeSlot.endsAt || activeSlot.startsAt || new Date(Date.now() + 3 * 3600 * 1000).toISOString();
  const [timeRemaining, setTimeRemaining] = useState(() => getCountdownTimeRemaining(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getCountdownTimeRemaining(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const filteredDeals = useMemo(() => {
    if (selectedCategory === 'ALL') return activeSlot.deals;
    return activeSlot.deals.filter(d => d.category === selectedCategory);
  }, [activeSlot, selectedCategory]);

  const handleClaimDeal = (deal, e) => {
    e.preventDefault();
    e.stopPropagation();

    const productPayload = {
      id: deal.productId,
      title: deal.title,
      price: deal.dealPrice,
      mrp: deal.originalPrice,
      discount: deal.discountPercent,
      thumbnail: deal.thumbnail,
      brand: deal.brand,
      category: deal.category,
      inStock: true
    };

    addToCart(productPayload, null, 1);
    showToast(`Claimed Lightning Deal for ${deal.brand}! Added to Cart with ${deal.discountPercent}% Instant Savings.`, 'success');
  };

  const handleToggleReminder = (dealId, dealTitle, e) => {
    e.preventDefault();
    e.stopPropagation();

    setReminders(prev => {
      const newState = !prev[dealId];
      showToast(
        newState
          ? `🔔 Reminder set for "${dealTitle.slice(0, 24)}...". We'll notify you 5 mins before drop!`
          : `Cancelled reminder for ${dealTitle.slice(0, 20)}`,
        'info'
      );
      return { ...prev, [dealId]: newState };
    });
  };

  const categories = [
    { id: 'ALL', label: 'All Drops' },
    { id: 'mobiles', label: 'Mobiles' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'audio', label: 'Audio & ANC' },
    { id: 'footwear', label: 'Footwear' },
    { id: 'accessories', label: 'Accessories' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', paddingBottom: '60px' }}>
      
      {/* Hero Banner with Live Countdown Clock */}
      <div style={{
        background: 'linear-gradient(135deg, #7F1D1D 0%, #991B1B 40%, #B91C1C 100%)',
        color: '#FFFFFF',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Effect */}
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(245, 158, 11, 0) 70%)', filter: 'blur(30px)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ maxWidth: '640px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '4px 14px', borderRadius: '9999px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>
                <Zap size={13} fill="#FEF08A" color="#FEF08A" /> Avero Lightning Flash Drops
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: '950', margin: 0, letterSpacing: '-0.6px', lineHeight: 1.15 }}>
                Doorbuster Flash Sales & Drops
              </h1>
              <p style={{ fontSize: '14px', color: '#FECACA', margin: '8px 0 0', lineHeight: 1.5 }}>
                Deep warehouse clearance discounts on flagship brands. Limited stock claims with real-time stock velocity tracking.
              </p>
            </div>

            {/* Countdown Flip Box */}
            <div style={{ backgroundColor: '#0B0F19', borderRadius: '20px', padding: '20px 24px', border: '1px solid rgba(255, 255, 255, 0.15)', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>
                {activeSlot.status === 'LIVE_NOW' ? '⚡ CURRENT DROP ENDS IN' : '⏰ NEXT DROP STARTS IN'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'monospace', fontWeight: '950', fontSize: '28px', color: '#FEF08A' }}>
                <div style={{ backgroundColor: '#1E293B', padding: '6px 12px', borderRadius: '10px' }}>{timeRemaining.hours}</div>
                <span>:</span>
                <div style={{ backgroundColor: '#1E293B', padding: '6px 12px', borderRadius: '10px' }}>{timeRemaining.minutes}</div>
                <span>:</span>
                <div style={{ backgroundColor: '#1E293B', padding: '6px 12px', borderRadius: '10px', color: '#EF4444' }}>{timeRemaining.seconds}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748B', fontWeight: '800', marginTop: '4px', textTransform: 'uppercase' }}>
                <span>Hours</span>
                <span>Minutes</span>
                <span>Seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '24px' }}>
        
        {/* Drop Slots Schedule Bar */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px' }} className="no-scrollbar">
          {FLASH_DROPS_SCHEDULE.map(slot => {
            const isSelected = selectedSlotId === slot.id;
            return (
              <button
                key={slot.id}
                onClick={() => setSelectedSlotId(slot.id)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '16px',
                  border: isSelected ? '2px solid #DC2626' : '1px solid #E2E8F0',
                  backgroundColor: isSelected ? '#FEF2F2' : '#FFFFFF',
                  color: isSelected ? '#DC2626' : '#475569',
                  fontSize: '13.5px',
                  fontWeight: isSelected ? '900' : '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 4px 12px rgba(220, 38, 38, 0.1)' : '0 1px 3px rgba(0,0,0,0.02)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{slot.title}</span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  backgroundColor: slot.badgeColor,
                  color: '#FFFFFF',
                  padding: '2px 8px',
                  borderRadius: '9999px'
                }}>
                  {slot.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '24px' }} className="no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '7px 16px',
                borderRadius: '9999px',
                border: selectedCategory === cat.id ? '1px solid #0F172A' : '1px solid #CBD5E1',
                backgroundColor: selectedCategory === cat.id ? '#0F172A' : '#FFFFFF',
                color: selectedCategory === cat.id ? '#FFFFFF' : '#475569',
                fontSize: '12.5px',
                fontWeight: selectedCategory === cat.id ? '800' : '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Deals Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {filteredDeals.map(deal => {
            const isLive = activeSlot.status === 'LIVE_NOW';
            const isReminded = reminders[deal.id];

            return (
              <div
                key={deal.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  position: 'relative',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease'
                }}
                className="hover-card-elevation"
              >
                {/* Discount Badge */}
                <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 2 }}>
                  <span style={{
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: '900',
                    padding: '3px 9px',
                    borderRadius: '6px',
                    boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)'
                  }}>
                    {deal.discountPercent}% OFF
                  </span>
                </div>

                <Link
                  to={`/product/${deal.productId}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {/* Product Thumbnail */}
                  <div style={{ width: '100%', height: '160px', backgroundColor: '#F8FAFC', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                    <img
                      src={deal.thumbnail}
                      alt={deal.title}
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ marginTop: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '800', textTransform: 'uppercase' }}>
                      {deal.brand}
                    </span>
                    <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', margin: '4px 0 0', lineHeight: 1.35, height: '38px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {deal.title}
                    </h3>

                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
                      <span style={{ fontSize: '21px', fontWeight: '950', color: '#0F172A' }}>
                        ₹{deal.dealPrice.toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontSize: '12.5px', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{deal.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Live Claim Meter */}
                    {isLive ? (
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '800', marginBottom: '4px' }}>
                          <span style={{ color: '#DC2626' }}>{deal.claimedPercent}% Claimed</span>
                          <span style={{ color: '#D97706' }}>Only {deal.remainingUnits} left!</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ width: `${deal.claimedPercent}%`, height: '100%', background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)' }} />
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: '12px', fontSize: '11.5px', color: '#64748B', fontWeight: '700', backgroundColor: '#F8FAFC', padding: '6px 10px', borderRadius: '8px' }}>
                        📅 Total Drops Batch: {deal.totalStock} units
                      </div>
                    )}
                  </div>
                </Link>

                {/* Action CTA */}
                {isLive ? (
                  <button
                    type="button"
                    onClick={(e) => handleClaimDeal(deal, e)}
                    style={{
                      width: '100%',
                      padding: '11px 0',
                      borderRadius: '12px',
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(15, 23, 42, 0.12)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <ShoppingBag size={15} /> Claim Deal Now
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleToggleReminder(deal.id, deal.title, e)}
                    style={{
                      width: '100%',
                      padding: '10px 0',
                      borderRadius: '12px',
                      backgroundColor: isReminded ? '#ECFDF5' : '#FFFFFF',
                      border: isReminded ? '1px solid #10B981' : '1px solid #CBD5E1',
                      color: isReminded ? '#059669' : '#0F172A',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Bell size={14} fill={isReminded ? '#10B981' : 'none'} />
                    {isReminded ? 'Reminder Set!' : 'Set Drop Reminder'}
                  </button>
                )}

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
