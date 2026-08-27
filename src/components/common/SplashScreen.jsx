import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [fadeState, setFadeState] = useState('visible'); // 'visible' | 'fading' | 'hidden'
  const [progress, setProgress] = useState(18);

  useEffect(() => {
    // Progressive loading steps
    const t1 = setTimeout(() => setProgress(58), 280);
    const t2 = setTimeout(() => setProgress(88), 700);
    const t3 = setTimeout(() => setProgress(100), 1050);

    // Trigger smooth fade out
    const fadeTimer = setTimeout(() => {
      setFadeState('fading');
    }, 1300);

    // Unmount
    const finishTimer = setTimeout(() => {
      setFadeState('hidden');
      if (typeof onFinish === 'function') onFinish();
    }, 1700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  if (fadeState === 'hidden') return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: '#FFFFFF',
        background: 'radial-gradient(circle at 50% 32%, rgba(238, 242, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 50%, #FFFFFF 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#0F172A',
        opacity: fadeState === 'fading' ? 0 : 1,
        transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s ease',
        transform: fadeState === 'fading' ? 'scale(1.02)' : 'scale(1)',
        pointerEvents: fadeState === 'fading' ? 'none' : 'auto',
        fontFamily: "'Inter', sans-serif",
        userSelect: 'none'
      }}
    >
      {/* Decorative ambient background glows */}
      <div
        style={{
          position: 'absolute',
          top: '22%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.04) 60%, rgba(255,255,255,0) 75%)',
          filter: 'blur(36px)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Logo & Content Stage */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 2
        }}
      >
        {/* Modern 3D Elevated Logo Card */}
        <div
          style={{
            position: 'relative',
            width: '92px',
            height: '92px',
            borderRadius: '26px',
            background: 'linear-gradient(145deg, #FFFFFF 0%, #F1F5F9 100%)',
            border: '1.5px solid rgba(226, 232, 240, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 40px -10px rgba(79, 70, 229, 0.18), 0 10px 20px -5px rgba(15, 23, 42, 0.06)',
            marginBottom: '22px',
            animation: 'averoLightPulse 2.4s infinite ease-in-out'
          }}
        >
          <img
            src="/logo.png"
            alt="Avero Logo"
            style={{
              width: '64px',
              height: '64px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 10px rgba(19, 102, 226, 0.22))'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Brand Name */}
        <h1
          style={{
            fontSize: '34px',
            fontWeight: '900',
            letterSpacing: '-0.6px',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #4338CA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          AVERO
        </h1>

        {/* Tagline Pill Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#EEF2FF',
            border: '1px solid #E0E7FF',
            padding: '5px 14px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: '#4F46E5',
            marginBottom: '32px',
            boxShadow: '0 2px 6px rgba(79, 70, 229, 0.08)'
          }}
        >
          <Sparkles size={12} color="#4F46E5" />
          India's Premier Marketplace
        </div>

        {/* Modern Crisp Progress Bar */}
        <div
          style={{
            width: '180px',
            height: '4px',
            backgroundColor: '#E2E8F0',
            borderRadius: '9999px',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: '18px'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #4F46E5 0%, #06B6D4 100%)',
              borderRadius: '9999px',
              transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 10px rgba(79, 70, 229, 0.45)'
            }}
          />
        </div>

        {/* Trust & Speed Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '11.5px',
            color: '#64748B',
            fontWeight: '600'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#475569' }}>
            <Zap size={12} color="#4F46E5" /> Fast Delivery
          </span>
          <span style={{ color: '#CBD5E1' }}>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#475569' }}>
            <ShieldCheck size={12} color="#059669" /> 100% Genuine
          </span>
        </div>
      </div>

      <style>{`
        @keyframes averoLightPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 20px 40px -10px rgba(79, 70, 229, 0.18), 0 10px 20px -5px rgba(15, 23, 42, 0.06);
          }
          50% {
            transform: scale(1.035);
            box-shadow: 0 24px 48px -8px rgba(79, 70, 229, 0.28), 0 12px 24px -4px rgba(6, 182, 212, 0.15);
          }
        }
      `}</style>
    </div>
  );
}
