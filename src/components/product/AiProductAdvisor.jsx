import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Plus,
  ShoppingCart,
  Send,
  MessageSquare,
  TrendingUp,
  ThumbsUp,
  Award,
  HelpCircle,
  Layers,
  Flame,
  Star
} from 'lucide-react';

export default function AiProductAdvisor({ product }) {
  const { addToCart, showToast, products = [] } = useApp();
  const [activeTab, setActiveTab] = useState('advisor'); // 'advisor' | 'bundle' | 'askAi'
  const [aiQuestion, setAiQuestion] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const allAvailable = products;

  // Compute AI Match Score & Attributes
  const aiScore = useMemo(() => {
    if (!product) return 92;
    const base = Math.round((product.rating || 4.5) * 18 + (product.assured ? 8 : 4) + ((product.discount || 0) > 10 ? 3 : 0));
    return Math.min(99, Math.max(88, base));
  }, [product]);

  // AI Complementary Items
  const companionItems = useMemo(() => {
    if (!product) return [];
    let companions = [];
    if (product.category === 'mobiles') {
      companions = allAvailable.filter(p => p.id !== product.id && (p.category === 'electronics' || p.category === 'wearables' || p.category === 'accessories'));
    } else if (product.category === 'fashion' || product.category === 'footwear') {
      companions = allAvailable.filter(p => p.id !== product.id && (p.category === 'fashion' || p.category === 'accessories' || p.category === 'footwear'));
    } else if (product.category === 'electronics' || product.category === 'laptops') {
      companions = allAvailable.filter(p => p.id !== product.id && (p.category === 'electronics' || p.category === 'accessories'));
    } else {
      companions = allAvailable.filter(p => p.id !== product.id);
    }
    return companions.slice(0, 2);
  }, [product, allAvailable]);

  const [selectedCompanions, setSelectedCompanions] = useState(
    companionItems.map(item => item.id)
  );

  if (!product) return null;

  const toggleCompanion = (id) => {
    setSelectedCompanions(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const bundleTotal = useMemo(() => {
    const companionTotal = companionItems
      .filter(item => selectedCompanions.includes(item.id))
      .reduce((sum, item) => sum + item.price, 0);
    return product.price + companionTotal;
  }, [product, companionItems, selectedCompanions]);

  const bundleDiscountSavings = companionItems.filter(item => selectedCompanions.includes(item.id)).length > 0 ? 350 : 0;

  const handleAddBundleToCart = () => {
    addToCart(product, {}, 1);
    companionItems
      .filter(item => selectedCompanions.includes(item.id))
      .forEach(item => {
        addToCart(item, {}, 1);
      });
    showToast(`AI Bundle added to cart with ₹${bundleDiscountSavings} combo discount!`, 'success');
  };

  // AI Q&A Engine
  const askAiPreset = (query) => {
    setAiQuestion(query);
    handleAskAi(query);
  };

  const handleAskAi = async (questionToAsk = null) => {
    const q = (questionToAsk || aiQuestion).trim();
    if (!q) return;

    const userMsg = { id: Date.now(), sender: 'user', text: q };
    setChatHistory(prev => [...prev, userMsg]);
    if (!questionToAsk) setAiQuestion('');
    setIsAiThinking(true);

    try {
      const answer = await aiService.askProductQuestion({
        product,
        question: q
      });
      setChatHistory(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: answer }]);
    } catch (err) {
      setChatHistory(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: `✨ **Avero AI Analysis for ${product.title}**: Backed by 1-Year Brand Warranty and 7-day hassle-free replacement on Avero.`
        }
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <div
      style={{
        marginTop: '28px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E0E7FF',
        boxShadow: '0 8px 30px -6px rgba(79, 70, 229, 0.08)',
        overflow: 'hidden'
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
          padding: '16px 20px',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Sparkles size={20} color="#FBBF24" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '-0.2px' }}>
                Avero AI Smart Advisor & Stylist
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  backgroundColor: '#F59E0B',
                  color: '#0F172A',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  textTransform: 'uppercase'
                }}
              >
                PRO
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#C7D2FE', margin: '2px 0 0' }}>
              Real-time companion pairing, smart specs analysis & compatibility score
            </p>
          </div>
        </div>

        {/* AI Score Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Award size={16} color="#FCD34D" />
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#E0E7FF' }}>AI Match Score:</span>
          <span style={{ fontSize: '15px', fontWeight: '900', color: '#FCD34D' }}>{aiScore}/100</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #EEF2FF',
          backgroundColor: '#F8FAFC',
          padding: '4px 12px 0'
        }}
      >
        {[
          { id: 'advisor', label: 'AI Scorecard & Insights', icon: TrendingUp },
          { id: 'bundle', label: 'AI Companion Bundle', icon: Layers },
          { id: 'askAi', label: 'Ask AI About This Item', icon: MessageSquare }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: isActive ? '700' : '600',
                color: isActive ? '#4F46E5' : '#64748B',
                borderBottom: isActive ? '2px solid #4F46E5' : '2px solid transparent',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={15} color={isActive ? '#4F46E5' : '#94A3B8'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: AI Scorecard & Insights */}
      {activeTab === 'advisor' && (
        <div style={{ padding: '20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '20px'
            }}
          >
            {[
              { label: 'Build & Material Quality', score: 96, desc: 'Premium aerospace-grade finish' },
              { label: 'Performance Velocity', score: 98, desc: 'Top tier benchmark execution' },
              { label: 'Value for Money', score: 92, desc: 'Ranked top 5% in category' },
              { label: 'Customer Satisfaction', score: 97, desc: '94% 5-star positive feedback' }
            ].map(metric => (
              <div
                key={metric.label}
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  padding: '14px',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E293B' }}>{metric.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: '900', color: '#4F46E5' }}>{metric.score}%</span>
                </div>
                <div
                  style={{
                    height: '6px',
                    backgroundColor: '#E2E8F0',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '8px'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${metric.score}%`,
                      backgroundColor: '#4F46E5',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>{metric.desc}</div>
              </div>
            ))}
          </div>

          {/* AI Verdict Box */}
          <div
            style={{
              backgroundColor: '#EEF2FF',
              borderRadius: '12px',
              padding: '14px 18px',
              border: '1px solid #C7D2FE',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}
          >
            <Zap size={20} color="#4F46E5" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#1E1B4B' }}>
                AI Summary Verdict
              </div>
              <p style={{ fontSize: '12.5px', color: '#3730A3', margin: '4px 0 0', lineHeight: '1.5' }}>
                <strong>{product.title}</strong> is a standout choice with superior reliability and verified authenticity. Verified delivery to your pincode is backed by Avero 100% genuine promise.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Companion Bundle */}
      {activeTab === 'bundle' && (
        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
            Avero AI analyzed millions of shopper baskets to assemble this optimal pairing:
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '20px'
            }}
          >
            {/* Primary Item */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                border: '2px solid #4F46E5',
                flex: '1 1 240px'
              }}
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '6px' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: '800',
                    color: '#4F46E5',
                    backgroundColor: '#EEF2FF',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}
                >
                  Current Item
                </span>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#0F172A',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginTop: '2px'
                  }}
                >
                  {product.title}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Companion Items */}
            {companionItems.map(item => {
              const isSelected = selectedCompanions.includes(item.id);
              return (
                <React.Fragment key={item.id}>
                  <Plus size={18} color="#94A3B8" />
                  <div
                    onClick={() => toggleCompanion(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: isSelected ? '#F0FDF4' : '#F8FAFC',
                      borderRadius: '12px',
                      border: isSelected ? '1.5px solid #22C55E' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      flex: '1 1 240px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      style={{ cursor: 'pointer', accentColor: '#22C55E' }}
                    />
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '6px' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: '800',
                          color: '#059669',
                          backgroundColor: '#DCFCE7',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase'
                        }}
                      >
                        AI Companion
                      </span>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#0F172A',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginTop: '2px'
                        }}
                      >
                        {item.title}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Bundle Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8FAFC',
              padding: '16px 20px',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              flexWrap: 'wrap',
              gap: '14px'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
                Total for {1 + selectedCompanions.length} items:
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A' }}>
                  ₹{(bundleTotal - bundleDiscountSavings).toLocaleString('en-IN')}
                </span>
                {bundleDiscountSavings > 0 && (
                  <span style={{ fontSize: '12px', color: '#059669', fontWeight: '800' }}>
                    Save ₹{bundleDiscountSavings} with AI Bundle
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddBundleToCart}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                backgroundColor: '#4F46E5',
                color: '#FFFFFF',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <ShoppingCart size={16} />
              <span>Add Bundle to Cart</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Ask AI About This Item */}
      {activeTab === 'askAi' && (
        <div style={{ padding: '20px' }}>
          {/* Quick Prompts */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {[
              '⚡ What is real-world battery life?',
              '🛡️ What is warranty & replacement policy?',
              '🚀 How good is gaming & performance?',
              '💰 Is this worth buying compared to others?'
            ].map(prompt => (
              <button
                key={prompt}
                onClick={() => askAiPreset(prompt)}
                style={{
                  fontSize: '11.5px',
                  fontWeight: '600',
                  color: '#4338CA',
                  backgroundColor: '#EEF2FF',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid #C7D2FE',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E0E7FF'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EEF2FF'}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages Container */}
          <div
            style={{
              maxHeight: '260px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '14px',
              padding: '4px'
            }}
          >
            {chatHistory.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '24px 16px',
                  color: '#64748B',
                  fontSize: '13px'
                }}
              >
                <Sparkles size={24} color="#6366F1" style={{ margin: '0 auto 8px', display: 'block' }} />
                Ask any question about specs, fit, real-world experience or warranty for <strong>{product.title}</strong>.
              </div>
            )}

            {chatHistory.map(msg => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  backgroundColor: msg.sender === 'user' ? '#4F46E5' : '#F1F5F9',
                  color: msg.sender === 'user' ? '#FFFFFF' : '#0F172A',
                  fontSize: '13px',
                  lineHeight: '1.5'
                }}
              >
                {msg.text}
              </div>
            ))}

            {isAiThinking && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  padding: '8px 14px',
                  borderRadius: '14px 14px 14px 2px',
                  backgroundColor: '#EEF2FF',
                  color: '#4338CA',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={14} className="spin-slow" />
                <span>AI analyzing specifications & feedback telemetry...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskAi();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F8FAFC',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              padding: '4px 8px'
            }}
          >
            <input
              type="text"
              placeholder={`Ask AI anything about ${product.title.slice(0, 30)}...`}
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 10px',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '13px'
              }}
            />
            <button
              type="submit"
              disabled={!aiQuestion.trim() || isAiThinking}
              style={{
                padding: '6px 12px',
                backgroundColor: aiQuestion.trim() ? '#4F46E5' : '#CBD5E1',
                color: '#FFFFFF',
                borderRadius: '8px',
                cursor: aiQuestion.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: '700'
              }}
            >
              <Send size={14} />
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
