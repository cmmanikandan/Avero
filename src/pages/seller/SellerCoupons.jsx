import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AVAILABLE_COUPONS } from '../../data/coupons';
import { Tag, Plus, CheckCircle2, Trash2, Calendar, X } from 'lucide-react';

export default function SellerCoupons() {
  const { showToast } = useApp();

  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('avero_seller_coupons');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    title: '',
    discountType: 'percentage',
    discountVal: '',
    minOrder: '',
    usageLimit: 100,
    expiry: '2026-11-30'
  });

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim() || !newCoupon.discountVal) {
      showToast('Enter coupon code and discount value', 'error');
      return;
    }

    const cleanCode = newCoupon.code.toUpperCase().trim();
    const isPercentage = newCoupon.discountType === 'percentage';
    const numVal = Number(newCoupon.discountVal) || 10;
    const minVal = Number(newCoupon.minOrder) || 999;

    const created = {
      code: cleanCode,
      title: newCoupon.title || 'Store Promo Voucher',
      discountType: isPercentage ? `${numVal}% Off` : `₹${numVal} Flat`,
      minOrder: minVal,
      usedCount: 0,
      usageLimit: Number(newCoupon.usageLimit) || 100,
      expiry: newCoupon.expiry,
      active: true
    };

    // Register into global AVAILABLE_COUPONS
    AVAILABLE_COUPONS.unshift({
      code: cleanCode,
      title: newCoupon.title || `${cleanCode} Store Promo`,
      discountType: isPercentage ? 'percentage' : 'fixed',
      discountPercentage: isPercentage ? numVal : undefined,
      discountAmount: !isPercentage ? numVal : undefined,
      minOrderValue: minVal,
      description: `Store exclusive discount on min purchase of ₹${minVal.toLocaleString('en-IN')}`,
      expiry: `Valid till ${newCoupon.expiry}`
    });

    setCoupons([created, ...coupons]);
    setIsCreateModalOpen(false);
    showToast(`🎉 Store coupon "${cleanCode}" created and published to checkout engine!`, 'success');
  };

  const handleDelete = (code) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    showToast('Promotion voucher deleted', 'info');
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '16px 20px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
            Store Promotions & Discount Coupons
          </h1>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Run customized percentage or flat discount campaigns for your products
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary"
          style={{ gap: '6px' }}
        >
          <Plus size={16} /> Create Promo Code
        </button>
      </div>

      {coupons.length === 0 ? (
        <div style={{ backgroundColor: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '48px 20px', textAlign: 'center', color: '#64748B' }}>
          <Tag size={40} color="#94A3B8" style={{ marginBottom: '10px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px' }}>No Active Promotions</h3>
          <p style={{ fontSize: '13px', margin: '0 0 16px', color: '#64748B' }}>Create discount coupons to boost conversions and incentivize buyers.</p>
          <button type="button" onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 18px' }}>
            <Plus size={15} /> Create First Coupon
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {coupons.map(coupon => (
          <div
            key={coupon.code}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1.5px dashed var(--primary-300)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '15px',
                  fontWeight: '800',
                  color: 'var(--primary-700)',
                  backgroundColor: 'var(--primary-50)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-xs)',
                  letterSpacing: '0.5px'
                }}>
                  {coupon.code}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--savings-green)', backgroundColor: '#E8F5E9', padding: '2px 6px', borderRadius: 'var(--radius-xs)', fontWeight: '700' }}>
                  Live
                </span>
              </div>

              <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', margin: '6px 0' }}>
                {coupon.title}
              </h3>

              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Benefit: <strong>{coupon.discountType}</strong><br />
                Min Cart Value: ₹{coupon.minOrder.toLocaleString('en-IN')}<br />
                Usage: <strong>{coupon.usedCount} / {coupon.usageLimit}</strong> redeemed
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', borderTop: '1px solid var(--border-divider)', paddingTop: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Valid till: {coupon.expiry}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(coupon.code)}
                style={{ color: '#DC2626', padding: '4px' }}
                title="Delete coupon"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Create Coupon Modal */}
      {isCreateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div
            className="bottom-sheet"
            style={{
              maxWidth: '480px',
              margin: 'auto',
              borderRadius: '16px',
              backgroundColor: '#ffffff',
              padding: '24px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-divider)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Create Store Promo Code</h3>
              <button onClick={() => setIsCreateModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Coupon Code *</label>
                <input
                  type="text"
                  placeholder="e.g. FESTIVE20"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px', textTransform: 'uppercase' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Campaign Title</label>
                <input
                  type="text"
                  placeholder="e.g. Diwali Weekend Special Discount"
                  value={newCoupon.title}
                  onChange={(e) => setNewCoupon({ ...newCoupon, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Discount Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Value *</label>
                  <input
                    type="number"
                    placeholder="e.g. 15"
                    value={newCoupon.discountVal}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountVal: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Min Order Value (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1999"
                    value={newCoupon.minOrder}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Usage Limit</label>
                  <input
                    type="number"
                    value={newCoupon.usageLimit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', height: '44px' }}>
                Launch Promotion
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
