import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Package,
  Truck,
  RotateCcw,
  Tag,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Zap,
  ShoppingBag
} from 'lucide-react';

import { aiService } from '../../services/aiService';

export default function AiShoppingBot() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, orders, products, rewardCoins } = useApp();

  // Only show on main shopping pages — Home, Products listing, Flash Deals, My Orders
  const ALLOWED_PATHS = ['/', '/products', '/deals', '/flash-deals', '/orders'];
  const isAllowed =
    ALLOWED_PATHS.includes(location.pathname) ||
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/orders') ||
    location.pathname.startsWith('/deals') ||
    location.pathname.startsWith('/flash-deals');

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hello ${user?.isAuth ? user.name : 'there'}! 👋 I am your 24x7 Avero AI Shopping Assistant powered by Groq & Gemini. How can I help?`,
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isAllowed) return null;

  const handleSend = async (textToSend = null) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const botResponse = await aiService.askShoppingAssistant({
        query,
        context: { user, orders, rewardCoins },
        history: messages
      });

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse,
          time: 'Just now'
        }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: "I'm ready to help you explore products, orders, and warranty terms!",
          time: 'Just now'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Glowing Bot Circular Icon Button (Icon Only) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title="Avero AI Assistant"
          aria-label="Avero AI Assistant"
          style={{
            position: 'fixed',
            bottom: '84px',
            right: '20px',
            zIndex: 9999,
            width: '52px',
            height: '52px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            border: '2px solid #38BDF8',
            borderRadius: '50%',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(56, 189, 248, 0.45), 0 4px 12px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer',
            animation: 'pulseGlow 2.5s infinite',
            transition: 'transform 0.2s ease'
          }}
        >
          <img
            src="/logo.png"
            alt="Avero AI"
            style={{
              width: '32px',
              height: '32px',
              objectFit: 'contain',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              padding: '3px'
            }}
          />
        </button>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '20px',
            zIndex: 99999,
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '520px',
            maxHeight: 'calc(100vh - 100px)',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #CBD5E1',
            boxShadow: '0 20px 48px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div style={{
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}>
                <img
                  src="/logo.png"
                  alt="Avero AI"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Avero AI Assistant
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                  24x7 Instant Support & Advice
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            backgroundColor: '#F8FAFC'
          }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  backgroundColor: m.sender === 'user' ? '#2563EB' : '#FFFFFF',
                  color: m.sender === 'user' ? '#FFFFFF' : '#1E293B',
                  padding: '10px 14px',
                  borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
                  border: m.sender === 'bot' ? '1px solid #E2E8F0' : 'none',
                  fontSize: '13px',
                  lineHeight: '1.5'
                }}
              >
                {m.sender === 'user' ? (
                  m.text
                ) : (
                  m.text.split('\n').map((line, lineIdx, arr) => {
                    const parts = line.split(/(\*\*[^*]+\*\*)/g);
                    return (
                      <div
                        key={lineIdx}
                        style={{
                          marginBottom: lineIdx === arr.length - 1 ? 0 : line.trim() ? '4px' : '6px',
                          minHeight: line.trim() ? 'auto' : '6px'
                        }}
                      >
                        {parts.map((part, partIdx) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return (
                              <strong key={partIdx} style={{ fontWeight: '800', color: '#0F172A' }}>
                                {part.slice(2, -2)}
                              </strong>
                            );
                          }
                          return <span key={partIdx}>{part}</span>;
                        })}
                      </div>
                    );
                  })
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                backgroundColor: '#FFFFFF',
                padding: '8px 14px',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                fontSize: '12px',
                color: '#64748B',
                fontStyle: 'italic'
              }}>
                Avero AI is typing...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }} className="no-scrollbar">
            {[
              { label: '📦 Track My Order', query: 'Track my latest order status' },
              { label: '📱 Best 5G Phones', query: 'Recommend best 5G phones under ₹40,000' },
              { label: '↩️ Returns Policy', query: 'How does the 7-day return policy work?' },
              { label: '🏷️ Active Coupons', query: 'What active discount coupons can I use today?' }
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p.query)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#F8FAFC',
                  color: '#334155',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '10px 12px',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              placeholder="Ask anything about products, orders..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                outline: 'none',
                backgroundColor: '#F8FAFC'
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(56, 189, 248, 0); }
          100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
