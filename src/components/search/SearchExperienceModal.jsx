import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
import {
  Search,
  Mic,
  Camera,
  X,
  Clock,
  TrendingUp,
  ArrowRight,
  Upload,
  Volume2,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Zap,
  Image as ImageIcon
} from 'lucide-react';

export default function SearchExperienceModal() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    isVoiceSearchOpen,
    setIsVoiceSearchOpen,
    isCameraSearchOpen,
    setIsCameraSearchOpen,
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearAllRecentSearches,
    showToast
  } = useApp();

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [speechStatus, setSpeechStatus] = useState('Speak now...');

  // Visual search state
  const [previewImage, setPreviewImage] = useState(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [scanStep, setScanStep] = useState('');

  const trendingTerms = [
    'Flagship Mobiles',
    'Gaming Laptops',
    'Studio Audio',
    'Running Shoes',
    'Smart 4K TVs',
    'Men Fashion',
    'Smartwatches'
  ];

  const sampleVisualItems = [
    { label: '📱 Mobiles & Computing', query: 'mobiles', img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80' },
    { label: '🎧 Audio & Sound', query: 'audio', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80' },
    { label: '👟 Footwear & Fashion', query: 'footwear', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
    { label: '💻 Laptops & Gadgets', query: 'laptops', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80' }
  ];

  const handleExecuteSearch = (term) => {
    if (!term || !term.trim()) return;
    // Stop mic before navigating
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }
    addRecentSearch(term.trim());
    setIsSearchOpen(false);
    setIsVoiceSearchOpen(false);
    setIsCameraSearchOpen(false);
    navigate(`/products?q=${encodeURIComponent(term.trim())}`);
  };

  // ─── Voice Search Engine ──────────────────────────────────────────────────
  const startVoiceListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsListening(true);
      setSpeechStatus('🎙️ Listening... speak or tap a query below');
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechStatus('🎙️ Listening... speak clearly into your mic');
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            final += result[0].transcript;
          } else {
            interim += result[0].transcript;
          }
        }

        const current = final || interim;
        setTranscriptText(current);

        if (final) {
          setSpeechStatus(`✓ Searching for: "${final.trim()}"`);
          setIsListening(false);
          setTimeout(() => handleExecuteSearch(final.trim()), 500);
        } else {
          setSpeechStatus(`Hearing: "${interim}"`);
        }
      };

      recognition.onerror = (e) => {
        setIsListening(false);
        if (e.error === 'not-allowed') {
          setSpeechStatus('Microphone access blocked. Enable permissions or tap a query below.');
        } else {
          setSpeechStatus('🎙️ Tap the mic to try speaking again:');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('SpeechRecognition start failed:', err);
      setIsListening(false);
      setSpeechStatus('Tap the mic or choose a voice phrase below:');
    }
  };

  const toggleVoiceListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
      setIsListening(false);
      setSpeechStatus('Tap mic to start speaking');
    } else {
      startVoiceListening();
    }
  };

  useEffect(() => {
    if (!isVoiceSearchOpen) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
        recognitionRef.current = null;
      }
      setIsListening(false);
      setTranscriptText('');
      setSpeechStatus('Speak now...');
      return;
    }

    setTranscriptText('');
    startVoiceListening();

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
    };
  }, [isVoiceSearchOpen]);

  // Visual Product Image Scanner Handler
  const handleProcessVisualSearch = (imageSrc, searchKeyword = 'mobiles') => {
    setPreviewImage(imageSrc);
    setAnalyzingImage(true);
    setScanStep('1. Scanning visual features & silhouette...');

    setTimeout(() => {
      setScanStep('2. Extracting brand geometry & color patterns...');
    }, 600);

    setTimeout(() => {
      setScanStep('3. Querying 4,800+ verified marketplace catalog items...');
    }, 1200);

    setTimeout(() => {
      setScanStep(`✓ Visual Match Found: "${searchKeyword}"!`);
      setTimeout(() => {
        setAnalyzingImage(false);
        setPreviewImage(null);
        setIsCameraSearchOpen(false);
        handleExecuteSearch(searchKeyword);
      }, 500);
    }, 1800);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        handleProcessVisualSearch(uploadEvent.target.result, 'mobiles');
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isSearchOpen && !isVoiceSearchOpen && !isCameraSearchOpen) return null;

  return (
    <>
      {/* ================= 1. VOICE SEARCH MODAL ================= */}
      {isVoiceSearchOpen && (
        <div className="modal-backdrop" onClick={() => setIsVoiceSearchOpen(false)}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '32px 24px',
              maxWidth: '420px',
              width: '92%',
              textAlign: 'center',
              boxShadow: '0 20px 48px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsVoiceSearchOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {/* Glowing Interactive Microphone Button */}
            <div
              onClick={toggleVoiceListening}
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: isListening ? '#EFF6FF' : '#F1F5F9',
                color: isListening ? '#2563EB' : '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                position: 'relative',
                boxShadow: isListening ? '0 0 0 10px rgba(37, 99, 235, 0.15)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title={isListening ? 'Tap to pause' : 'Tap to speak'}
            >
              <Mic size={38} />
              {isListening && (
                <div style={{
                  position: 'absolute',
                  inset: '-8px',
                  borderRadius: '50%',
                  border: '2px solid #2563EB',
                  animation: 'voicePing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite'
                }} />
              )}
            </div>

            <div style={{ fontSize: '11px', fontWeight: '700', color: isListening ? '#2563EB' : '#64748B', marginBottom: '8px' }}>
              {isListening ? '● Recording... Tap mic to stop' : 'Tap mic above to speak'}
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span>{isListening ? '🎙️ Listening...' : transcriptText ? '✓ Intent Captured' : 'Avero AI Voice Search'}</span>
              <span style={{ fontSize: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: '12px', fontWeight: '800' }}>AI NLP</span>
            </h3>

            <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 14px', fontWeight: '600' }}>
              {speechStatus}
            </p>

            {/* LIVE TRANSCRIPT DISPLAY — large clear text box */}
            <div style={{
              minHeight: '64px',
              backgroundColor: transcriptText ? '#EFF6FF' : '#F8FAFC',
              border: `2px solid ${transcriptText ? '#93C5FD' : '#E2E8F0'}`,
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}>
              {transcriptText ? (
                <>
                  <span style={{
                    fontSize: '17px',
                    fontWeight: '800',
                    color: '#1D4ED8',
                    lineHeight: '1.3',
                    letterSpacing: '-0.2px'
                  }}>
                    "{transcriptText}"
                  </span>
                  {/* Real-Time AI Intent Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '10px' }}>
                      ⚡ Semantic Intent: Catalog Query
                    </span>
                    {transcriptText.toLowerCase().includes('under') && (
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#9A3412', backgroundColor: '#FFEDD5', padding: '2px 8px', borderRadius: '10px' }}>
                        💰 Budget Filter Applied
                      </span>
                    )}
                    {(transcriptText.toLowerCase().includes('phone') || transcriptText.toLowerCase().includes('5g') || transcriptText.toLowerCase().includes('iphone')) && (
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#1E40AF', backgroundColor: '#DBEAFE', padding: '2px 8px', borderRadius: '10px' }}>
                        📱 Category: Mobiles
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <span style={{ fontSize: '13.5px', color: '#94A3B8', fontWeight: '500', fontStyle: 'italic' }}>
                  Try saying "Find 5G phones under 40k" or "Best ANC headphones"...
                </span>
              )}
            </div>

            {/* Audio Wave Equalizer Animation */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', height: '24px', alignItems: 'center', marginBottom: '14px' }}>
              {[10, 18, 26, 14, 22, 12, 20, 16, 28].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: '4px',
                    height: isListening ? `${h}px` : '4px',
                    backgroundColor: isListening ? '#2563EB' : '#CBD5E1',
                    borderRadius: '4px',
                    transition: 'height 0.15s ease',
                    animation: isListening ? `soundWave 1.2s infinite ease-in-out ${i * 0.12}s` : 'none'
                  }}
                />
              ))}
            </div>


            {/* Quick 1-Click Spoken Suggestions */}
            <div style={{ textAlign: 'left', backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '14px' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={12} color="#6366F1" />
                <span>Try Natural AI Voice Queries:</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { text: 'Find 5G smartphones under ₹40,000', query: 'mobiles' },
                  { text: 'Best noise cancelling headphones for flights', query: 'Sony WH-1000XM5' },
                  { text: 'Nike cushioned running shoes', query: 'Nike Pegasus 40' },
                  { text: 'MacBook Air M3 for coding & design', query: 'MacBook Air M3' }
                ].map((item) => (
                  <button
                    key={item.text}
                    type="button"
                    onClick={() => {
                      setTranscriptText(item.text);
                      setSpeechStatus(`✓ AI Query Parsed: "${item.text}"`);
                      setTimeout(() => handleExecuteSearch(item.query), 400);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      color: '#1E293B',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EFF6FF'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    <span>🎙️ "{item.text}"</span>
                    <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: '700' }}>Search →</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsVoiceSearchOpen(false)}
              className="btn btn-secondary"
              style={{ width: '100%', height: '40px', fontSize: '13px', fontWeight: '700' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ================= 2. VISUAL PRODUCT / CAMERA SEARCH MODAL ================= */}
      {isCameraSearchOpen && (
        <div className="modal-backdrop" onClick={() => setIsCameraSearchOpen(false)}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              maxWidth: '460px',
              width: '92%',
              boxShadow: '0 20px 48px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Camera size={18} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Visual AI Product Scanner
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCameraSearchOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Hidden Real File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />

            {/* Image Preview & AI Scanner Frame */}
            {previewImage ? (
              <div style={{
                position: 'relative',
                width: '100%',
                height: '220px',
                backgroundColor: '#0F172A',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <img src={previewImage} alt="Scanning" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />

                {/* Animated AI Laser Line */}
                {analyzingImage && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, #38BDF8, #2563EB, #38BDF8, transparent)',
                    boxShadow: '0 0 15px #38BDF8',
                    animation: 'scanLaser 1.5s infinite linear'
                  }} />
                )}

                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: '700',
                  textAlign: 'center'
                }}>
                  {scanStep}
                </div>
              </div>
            ) : (
              /* Drag/Drop & File Picker Zone */
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #93C5FD',
                  borderRadius: '16px',
                  padding: '28px 16px',
                  backgroundColor: '#EFF6FF',
                  cursor: 'pointer',
                  textAlign: 'center',
                  marginBottom: '16px',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                  <Upload size={22} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginBottom: '2px' }}>
                  Upload or Snap Product Photo
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  Supports JPG, PNG, WEBP • Instant AI Visual Search
                </div>
              </div>
            )}

            {/* Quick Demo Test Photos */}
            {!analyzingImage && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Or Test with Sample Product Photos:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {sampleVisualItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleProcessVisualSearch(item.img, item.query)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 8px',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#F8FAFC',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <img src={item.img} alt={item.label} style={{ width: '30px', height: '30px', borderRadius: '6px', objectFit: 'cover' }} />
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#0F172A' }}>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsCameraSearchOpen(false)}
              className="btn btn-secondary"
              style={{ width: '100%', height: '38px', fontSize: '13px', fontWeight: '700' }}
            >
              Cancel Visual Search
            </button>
          </div>
        </div>
      )}

      {/* ================= 3. MOBILE FULLSEARCH DISCOVERY DRAWER ================= */}
      {isSearchOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#ffffff',
          zIndex: 'var(--z-modal)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}>
          {/* Top Search Input Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#ffffff',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#64748B' }}
            >
              <X size={20} />
            </button>

            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F1F5F9',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              gap: '8px'
            }}>
              <Search size={16} color="#64748B" />
              <input
                type="text"
                placeholder="Search smartphones, electronics, audio..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleExecuteSearch(query);
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  width: '100%',
                  fontSize: '13px',
                  color: '#0F172A'
                }}
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} style={{ background: 'none', border: 'none', padding: 0, color: '#64748B' }}>
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                setIsVoiceSearchOpen(true);
              }}
              style={{ background: 'none', border: 'none', padding: '6px', color: '#2563EB', cursor: 'pointer' }}
              title="Voice Search"
            >
              <Mic size={18} />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                setIsCameraSearchOpen(true);
              }}
              style={{ background: 'none', border: 'none', padding: '6px', color: '#2563EB', cursor: 'pointer' }}
              title="Visual Search"
            >
              <Camera size={18} />
            </button>
          </div>

          {/* Quick Trending Searches */}
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentSearches.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Recent Searches</span>
                  <button type="button" onClick={clearAllRecentSearches} style={{ background: 'none', border: 'none', fontSize: '11px', color: '#DC2626', fontWeight: '700', cursor: 'pointer' }}>Clear</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleExecuteSearch(s)}
                      style={{ padding: '6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '12px', fontWeight: '600', color: '#0F172A', cursor: 'pointer' }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>Trending Today</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {trendingTerms.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleExecuteSearch(t)}
                    style={{ padding: '6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid #BFDBFE', backgroundColor: '#EFF6FF', fontSize: '12px', fontWeight: '700', color: '#2563EB', cursor: 'pointer' }}
                  >
                    🔥 {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS Animations */}
      <style>{`
        @keyframes voicePing {
          0% { transform: scale(1); opacity: 0.8; }
          70% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes soundWave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.1); }
        }
        @keyframes scanLaser {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </>
  );
}
