import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare, Sparkles, Smartphone, CheckCircle2 } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Check if already installed / running in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Check if iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // 3. Listen for native Android/Desktop Chrome install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user dismissed previously in this session
      const dismissed = sessionStorage.getItem('avero_pwa_dismissed');
      if (!dismissed) {
        // Show after 2 seconds for a natural browsing experience
        setTimeout(() => setShowPrompt(true), 2500);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for custom trigger from Navbar / Drawer
    const handleCustomTrigger = () => {
      if (deferredPrompt) {
        setShowPrompt(true);
      } else if (isIosDevice) {
        setShowIosGuide(true);
      } else {
        setShowPrompt(true);
      }
    };

    window.addEventListener('open-pwa-install', handleCustomTrigger);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('open-pwa-install', handleCustomTrigger);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    } else {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIosGuide(false);
    sessionStorage.setItem('avero_pwa_dismissed', 'true');
  };

  if (isInstalled) return null;

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. STANDARD FLOATING BOTTOM INSTALL BANNER (Mobile & Web)
      ─────────────────────────────────────────────────────────────── */}
      {showPrompt && !showIosGuide && (
        <div
          style={{
            position: 'fixed',
            bottom: '76px', // Above mobile bottom nav
            left: '16px',
            right: '16px',
            maxWidth: '460px',
            margin: '0 auto',
            zIndex: 9999,
            backgroundColor: '#071228',
            borderRadius: '16px',
            padding: '12px 14px',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            animation: 'pwaSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            color: '#FFFFFF',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          {/* Logo & App Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #1366E2 0%, #00C3F8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(19, 102, 226, 0.4)'
              }}
            >
              <img src="/logo.png" alt="Avero" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
                  Install Avero App
                </strong>
                <span style={{ fontSize: '10px', backgroundColor: 'rgba(0, 195, 248, 0.2)', color: '#00C3F8', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                  Fast & Light
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#94A3B8', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Instant access, offline orders & deals
              </p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              type="button"
              onClick={handleInstallClick}
              style={{
                backgroundColor: '#1366E2',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 4px 12px rgba(19, 102, 226, 0.35)'
              }}
            >
              <Download size={13} />
              Install
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close install prompt"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#94A3B8',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. iOS SAFARI "ADD TO HOME SCREEN" MODAL GUIDE
      ─────────────────────────────────────────────────────────────── */}
      {showIosGuide && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(7, 18, 40, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={handleDismiss}
        >
          <div
            style={{
              backgroundColor: '#0F2042',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '24px',
              maxWidth: '420px',
              width: '100%',
              color: '#FFFFFF',
              boxShadow: '0 20px 48px rgba(0, 0, 0, 0.6)',
              animation: 'pwaSlideUp 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/logo.png" alt="Avero" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0 }}>Install on iPhone / iPad</h3>
                  <span style={{ fontSize: '11px', color: '#93C5FD' }}>Add to Home Screen for fast native app speed</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDismiss}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '10px 14px', borderRadius: '12px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#1366E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '11px', flexShrink: 0 }}>1</span>
                <span>Tap the <strong style={{ color: '#00C3F8' }}>Share</strong> button <Share size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> in Safari's bottom toolbar.</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '10px 14px', borderRadius: '12px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#1366E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '11px', flexShrink: 0 }}>2</span>
                <span>Scroll down and select <strong style={{ color: '#00C3F8' }}>"Add to Home Screen"</strong> <PlusSquare size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />.</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '10px 14px', borderRadius: '12px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '11px', flexShrink: 0 }}>3</span>
                <span>Tap <strong style={{ color: '#10B981' }}>"Add"</strong> in top right corner. Enjoy fullscreen shopping!</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              style={{
                width: '100%',
                marginTop: '18px',
                backgroundColor: '#1366E2',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '11px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pwaSlideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
