import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [fadeState, setFadeState] = useState('visible'); // 'visible' | 'fading' | 'hidden'
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Step progress
    const t1 = setTimeout(() => setProgress(55), 300);
    const t2 = setTimeout(() => setProgress(90), 750);
    const t3 = setTimeout(() => setProgress(100), 1100);

    // Trigger smooth fade out
    const fadeTimer = setTimeout(() => {
      setFadeState('fading');
    }, 1350);

    // Complete and unmount
    const finishTimer = setTimeout(() => {
      setFadeState('hidden');
      if (typeof onFinish === 'function') onFinish();
    }, 1750);

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
        backgroundColor: '#071228',
        background: 'radial-gradient(circle at 50% 35%, #0F2856 0%, #071228 75%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#ffffff',
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
          top: '20%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(19, 102, 226, 0.25) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Logo & Animated Shield Container */}
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
        {/* Glowing Logo Icon */}
        <div
          style={{
            position: 'relative',
            width: '88px',
            height: '88px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #1366E2 0%, #00C3F8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 36px rgba(19, 102, 226, 0.45), 0 0 0 2px rgba(255, 255, 255, 0.15)',
            marginBottom: '20px',
            animation: 'averoPulse 2.2s infinite ease-in-out'
          }}
        >
          <img
            src="/logo.png"
            alt="Avero Logo"
            style={{
              width: '64px',
              height: '64px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Brand Name */}
        <h1
          style={{
            fontSize: '32px',
            fontWeight: '900',
            letterSpacing: '-0.5px',
            margin: '0 0 6px 0',
            background: 'linear-gradient(135deg, #FFFFFF 30%, #93C5FD 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          AVERO
        </h1>

        {/* Tagline Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '6px 14px',
            borderRadius: '100px',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: '#93C5FD',
            marginBottom: '32px'
          }}
        >
          <Sparkles size={12} color="#00C3F8" />
          India's Premier Marketplace
        </div>

        {/* Minimal Progress Bar */}
        <div
          style={{
            width: '180px',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '100px',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: '16px'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #1366E2 0%, #00C3F8 100%)',
              borderRadius: '100px',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 12px rgba(0, 195, 248, 0.6)'
            }}
          />
        </div>

        {/* Security & Speed Indicators */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '11px',
            color: '#64748B',
            fontWeight: '600'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={11} color="#00C3F8" /> Express 24h
          </span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={11} color="#10B981" /> 100% Genuine
          </span>
        </div>
      </div>

      <style>{`
        @keyframes averoPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 12px 36px rgba(19, 102, 226, 0.45), 0 0 0 2px rgba(255, 255, 255, 0.15);
          }
          50% {
            transform: scale(1.04);
            box-shadow: 0 16px 44px rgba(19, 102, 226, 0.65), 0 0 0 4px rgba(0, 195, 248, 0.3);
          }
        }
      `}</style>
    </div>
  );
}
