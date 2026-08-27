import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  const faqs = [
    {
      id: 1,
      category: 'ORDERS',
      question: 'How do I track my order in real-time?',
      answer: 'You can track all active shipments by navigating to "My Orders" in your profile menu or tapping the tracking link sent via SMS and email. Avero provides step-by-step courier tracking with BlueDart & Delhivery dispatch hubs.'
    },
    {
      id: 2,
      category: 'ORDERS',
      question: 'What is the delivery verification OTP?',
      answer: 'For high-value electronics and verified parcels, a 4-digit Delivery OTP is displayed on your Order Tracking page. Share this OTP with the delivery executive at your doorstep to securely complete the handover.'
    },
    {
      id: 3,
      category: 'PAYMENTS',
      question: 'Which payment methods are accepted on Avero?',
      answer: 'We accept all major Indian payment methods: UPI (Google Pay, PhonePe, Paytm, CRED), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking (50+ Indian banks), No-Cost EMI, and Cash on Delivery (COD) for eligible pincodes.'
    },
    {
      id: 4,
      category: 'PAYMENTS',
      question: 'When will I receive my refund for a cancelled or returned order?',
      answer: 'Instant refunds are initiated within 15 minutes of cancellation. For UPI and wallet transactions, refunds reflect within 2-4 hours. For credit and debit cards, banks typically credit funds within 2-4 business days.'
    },
    {
      id: 5,
      category: 'RETURNS',
      question: 'What is Avero\'s 7-Day Replacement & Return Policy?',
      answer: 'Products purchased on Avero are covered by a hassle-free 7-day return policy. If an item arrives damaged, defective, or different from the catalog listing, you can request a doorstep replacement or full refund with free reverse courier pickup.'
    },
    {
      id: 6,
      category: 'SHIPPING',
      question: 'How fast is Avero Lightning Delivery?',
      answer: 'Avero Lightning Delivery offers same-day delivery in major metropolitan zones (Bengaluru, Mumbai, Delhi NCR) for orders placed before 12:00 PM, and guaranteed next-day delivery across 28,000+ pincodes.'
    },
    {
      id: 7,
      category: 'ACCOUNT',
      question: 'How do I change my registered delivery addresses?',
      answer: 'Sign in to your account, visit "My Profile" -> "Saved Addresses", and click "Add New Address" or edit existing addresses. You can also designate a default address for 1-click checkout.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    if (activeCategory !== 'ALL' && faq.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Header with Search */}
      <div style={{ backgroundColor: '#0F172A', color: '#ffffff', padding: '50px 20px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>Avero Help & FAQ Center</h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '8px' }}>
            Find quick answers to common questions about orders, payments, shipping, and returns.
          </p>

          <div style={{
            position: 'relative',
            marginTop: '24px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={18} color="#64748B" style={{ position: 'absolute', left: '16px' }} />
            <input
              type="text"
              placeholder="Search help articles, refunds, delivery questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                color: '#0F172A',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
              }}
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '880px', margin: '-24px auto 0', padding: '0 16px' }}>
        
        {/* Quick Category Tiles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px',
          marginBottom: '24px'
        }}>
          {[
            { id: 'ALL', label: 'All Topics', icon: HelpCircle },
            { id: 'ORDERS', label: 'Orders & Tracking', icon: Package },
            { id: 'PAYMENTS', label: 'Payments & Refunds', icon: CreditCard },
            { id: 'SHIPPING', label: 'Shipping & Delivery', icon: Truck },
            { id: 'RETURNS', label: 'Returns & Exchange', icon: RotateCcw }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                style={{
                  backgroundColor: isActive ? 'var(--primary-600)' : '#ffffff',
                  color: isActive ? '#ffffff' : 'var(--text-primary)',
                  border: isActive ? '1px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '14px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={20} color={isActive ? '#ffffff' : 'var(--primary-600)'} />
                <span style={{ fontSize: '12px', fontWeight: '700' }}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQs Accordion */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px' }}>
            Frequently Asked Questions ({filteredFaqs.length})
          </h2>

          {filteredFaqs.length > 0 ? (
            filteredFaqs.map(faq => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  style={{
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: isExpanded ? '#F8FAFC' : '#ffffff'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      fontWeight: '700',
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      gap: '12px'
                    }}
                  >
                    <span>{faq.question}</span>
                    {isExpanded ? <ChevronUp size={18} color="var(--primary-600)" flexShrink={0} /> : <ChevronDown size={18} color="var(--text-secondary)" flexShrink={0} />}
                  </button>

                  {isExpanded && (
                    <div style={{ padding: '0 16px 16px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', borderTop: '1px solid var(--border-divider)' }}>
                      <p style={{ margin: '10px 0 0' }}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)', fontSize: '13px' }}>
              No help articles found matching "{searchQuery}". Please try another search term or contact support.
            </div>
          )}
        </div>

        {/* Still need help banner */}
        <div style={{
          marginTop: '24px',
          backgroundColor: '#EFF6FF',
          border: '1px solid #DBEAFE',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary-900)', margin: 0 }}>
              Still have questions or need assistance?
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Our customer care representatives are available 24x7 to assist you.
            </p>
          </div>
          <Link
            to="/contact"
            className="btn btn-primary"
            style={{ height: '40px', padding: '0 20px', fontSize: '13px', fontWeight: '700', gap: '6px' }}
          >
            <MessageSquare size={15} /> Contact Support
          </Link>
        </div>

      </div>
    </div>
  );
}
