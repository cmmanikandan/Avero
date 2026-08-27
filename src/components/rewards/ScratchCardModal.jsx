import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Award, Coins, X, CheckCircle2, Gift } from 'lucide-react';

export default function ScratchCardModal({ isOpen, onClose, orderId }) {
  const { addRewardCoins } = useApp();
  const canvasRef = useRef(null);

  const [isScratched, setIsScratched] = useState(false);
  const [rewardAmount] = useState(() => Math.floor(75 + Math.random() * 225)); // 75 - 300 coins
  const [isClaimed, setIsClaimed] = useState(false);

  useEffect(() => {
    if (!isOpen || isScratched) return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      // Fill foil cover
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#94A3B8');
      gradient.addColorStop(0.5, '#CBD5E1');
      gradient.addColorStop(1, '#64748B');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add silver foil text & glitter
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ Scratch Here to Reveal ✨', canvas.width / 2, canvas.height / 2);
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen, isScratched]);

  if (!isOpen) return null;

  const handleScratch = (e) => {
    if (isScratched) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Auto reveal when sufficiently scratched
    setIsScratched(true);
  };

  const handleClaimReward = () => {
    if (isClaimed) return;
    addRewardCoins(rewardAmount);
    setIsClaimed(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        style={{
          maxWidth: '420px',
          width: '90%',
          margin: 'auto',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 20px 48px rgba(0,0,0,0.2)',
          border: '1px solid #E2E8F0',
          textAlign: 'center',
          color: '#0F172A'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gift size={20} color="#D97706" />
            <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: '#0F172A' }}>
              Avero SuperCoins Scratch Card
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px', lineHeight: '1.4' }}>
          Order {orderId ? `#${orderId}` : ''} Reward! Rub the metallic scratch card to reveal your guaranteed SuperCoins:
        </p>

        {/* Scratch Area Wrapper */}
        <div style={{
          position: 'relative',
          width: '280px',
          height: '160px',
          margin: '0 auto 18px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
          border: '2px solid #F59E0B'
        }}>
          {/* Underlying Revealed Reward */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}>
            <Coins size={36} color="#D97706" />
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#B45309' }}>
              +{rewardAmount} SuperCoins
            </div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#92400E' }}>
              ₹1 = 1 SuperCoin Instant Checkout Discount
            </div>
          </div>

          {/* Foil Canvas on Top */}
          {!isScratched && (
            <canvas
              ref={canvasRef}
              width={280}
              height={160}
              onMouseMove={handleScratch}
              onTouchMove={handleScratch}
              onClick={() => setIsScratched(true)}
              style={{
                position: 'absolute',
                inset: 0,
                cursor: 'pointer',
                touchAction: 'none'
              }}
            />
          )}
        </div>

        {/* Claim Action */}
        <button
          type="button"
          onClick={handleClaimReward}
          disabled={isClaimed}
          className="btn btn-primary"
          style={{
            width: '100%',
            height: '44px',
            fontSize: '14px',
            fontWeight: '800',
            backgroundColor: isClaimed ? '#059669' : '#D97706',
            borderColor: isClaimed ? '#059669' : '#D97706',
            gap: '6px'
          }}
        >
          {isClaimed ? (
            <>
              <CheckCircle2 size={16} /> Credited to Wallet!
            </>
          ) : (
            <>
              <Sparkles size={16} /> Claim {rewardAmount} SuperCoins
            </>
          )}
        </button>
      </div>
    </div>
  );
}
