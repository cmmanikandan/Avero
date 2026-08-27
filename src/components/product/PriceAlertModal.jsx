import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, X, ShieldCheck, CheckCircle2, TrendingDown, Mail, Phone } from 'lucide-react';

export default function PriceAlertModal({ product, isOpen, onClose }) {
  const { user, addPriceAlert, showToast } = useApp();

  const [targetPrice, setTargetPrice] = useState(() => {
    return Math.floor(product?.price * 0.9); // Default 10% lower
  });

  const [contact, setContact] = useState(() => {
    return user?.email || user?.phone || '+91 98450 12345';
  });

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetPrice || targetPrice >= product.price) {
      showToast('Target price should be lower than current selling price', 'error');
      return;
    }
    if (!contact.trim()) {
      showToast('Please enter an email or phone number for alerts', 'error');
      return;
    }

    addPriceAlert(product, targetPrice, contact);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  const discountPercent = Math.round(((product.price - targetPrice) / product.price) * 100);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        style={{
          maxWidth: '440px',
          width: '90%',
          margin: 'auto',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          border: '1px solid #E2E8F0',
          color: '#0F172A'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bell size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#0F172A' }}>
                Set Price Drop Alert
              </h3>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Instant SMS & Email Notifications</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Alert Activated!</h4>
            <p style={{ fontSize: '13px', color: '#64748B', marginTop: '6px' }}>
              We will notify you at <strong>{contact}</strong> the moment this item drops to ₹{Number(targetPrice).toLocaleString('en-IN')}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Product Summary Box */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              padding: '12px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '2px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.title}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-price)', marginTop: '2px' }}>
                  Current Price: ₹{product.price?.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Target Price Slider & Input */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>
                  Notify me when price drops to (₹):
                </label>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#059669', backgroundColor: '#DCFCE7', padding: '2px 6px', borderRadius: '4px' }}>
                  {discountPercent}% Drop
                </span>
              </div>

              <input
                type="number"
                required
                min={1}
                max={product.price - 1}
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #2563EB',
                  backgroundColor: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '800',
                  color: '#0F172A',
                  outline: 'none'
                }}
              />

              {/* Quick Preset Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                {[
                  { label: '5% Drop', calc: Math.floor(product.price * 0.95) },
                  { label: '10% Drop', calc: Math.floor(product.price * 0.90) },
                  { label: '15% Drop', calc: Math.floor(product.price * 0.85) }
                ].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTargetPrice(p.calc)}
                    style={{
                      flex: 1,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: targetPrice === p.calc ? '1px solid #2563EB' : '1px solid #CBD5E1',
                      backgroundColor: targetPrice === p.calc ? '#EFF6FF' : '#FFFFFF',
                      color: targetPrice === p.calc ? '#1D4ED8' : '#475569',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {p.label} (₹{p.calc.toLocaleString('en-IN')})
                  </button>
                ))}
              </div>
            </div>

            {/* Email / Mobile Input */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Notification Email / Mobile Number:
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="email@example.com or +91 98450 12345"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '13px',
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                style={{ flex: 1, height: '42px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2, height: '42px', fontSize: '13px', fontWeight: '800', gap: '6px' }}
              >
                <Bell size={15} /> Set Price Alert
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
