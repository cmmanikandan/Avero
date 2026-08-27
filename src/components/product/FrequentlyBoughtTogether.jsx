import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Plus, Check, ShoppingBag, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export default function FrequentlyBoughtTogether({ mainProduct, comboData }) {
  const { addToCart, showToast } = useApp();

  // Always declare hooks unconditionally at the top level
  const [includeCompanion, setIncludeCompanion] = useState(true);

  const primaryDuo = comboData?.primaryDuo;
  const companionProduct = primaryDuo?.products?.[1] || null;

  // Re-sync state when main product or companion changes
  useEffect(() => {
    setIncludeCompanion(true);
  }, [mainProduct?.id, companionProduct?.id]);

  // Early return after hooks
  if (!mainProduct || !primaryDuo || !companionProduct) {
    return null;
  }

  const selectedProducts = includeCompanion ? [mainProduct, companionProduct] : [mainProduct];
  const totalOriginalPrice = includeCompanion ? (mainProduct.price + companionProduct.price) : mainProduct.price;
  const bundleDiscountPercent = includeCompanion ? (primaryDuo.discountPercent || 8) : 0;
  const finalComboPrice = includeCompanion ? Math.round(totalOriginalPrice * (1 - bundleDiscountPercent / 100)) : mainProduct.price;
  const totalSavings = totalOriginalPrice - finalComboPrice;

  const handleAddBundleToCart = () => {
    selectedProducts.forEach(p => {
      addToCart(p, null, 1);
    });
    showToast(
      includeCompanion
        ? `Added both items to Cart with ${bundleDiscountPercent}% Instant Bundle Savings!`
        : `Added ${mainProduct.title.slice(0, 24)}... to Cart!`,
      'success'
    );
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '20px',
        padding: '22px 24px',
        margin: '24px 0',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}
    >
      {/* Header with FP-Growth Confidence Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            backgroundColor: '#EFF6FF',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={17} />
          </div>
          <div>
            <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
              Frequently Bought Together
            </h3>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              Mined with FP-Growth Market Basket Association Engine
            </span>
          </div>
        </div>

        {/* Association Confidence Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#F5F3FF',
          border: '1px solid #DDD6FE',
          color: '#7C3AED',
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '11px',
          fontWeight: '800'
        }}>
          <TrendingUp size={13} />
          <span>{Math.round((primaryDuo.confidence || 0.84) * 100)}% Confidence • {primaryDuo.lift || 3.8}x Lift Score</span>
        </div>
      </div>

      {/* Main Bundle Horizontal Grid */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        {/* Products Visual Strip (Side-by-side compact cards) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Main Product Card */}
          <div style={{
            width: '180px',
            backgroundColor: '#F8FAFC',
            borderRadius: '14px',
            border: '2px solid #2563EB',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              top: '-9px',
              left: '10px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              fontSize: '9.5px',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '9999px'
            }}>
              Current Item
            </span>

            <div style={{ width: '100%', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={mainProduct.thumbnail}
                alt={mainProduct.title}
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
            <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#0F172A', lineHeight: 1.3, height: '30px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {mainProduct.title}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '900', color: '#0F172A' }}>
              ₹{mainProduct.price.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Plus Connector Icon */}
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#F1F5F9',
            border: '1px solid #CBD5E1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
            flexShrink: 0
          }}>
            <Plus size={16} strokeWidth={2.5} />
          </div>

          {/* Companion Product Card (With Checkbox toggle) */}
          <div
            onClick={() => setIncludeCompanion(prev => !prev)}
            style={{
              width: '180px',
              backgroundColor: includeCompanion ? '#F8FAFC' : '#FFFFFF',
              borderRadius: '14px',
              border: includeCompanion ? '2px solid #8B5CF6' : '1px solid #CBD5E1',
              opacity: includeCompanion ? 1 : 0.6,
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                backgroundColor: '#EDE9FE',
                color: '#7C3AED',
                fontSize: '9.5px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '9999px'
              }}>
                Companion Match
              </span>
              <input
                type="checkbox"
                checked={includeCompanion}
                onChange={() => {}}
                style={{ width: '15px', height: '15px', accentColor: '#7C3AED', cursor: 'pointer' }}
              />
            </div>

            <div style={{ width: '100%', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={companionProduct.thumbnail}
                alt={companionProduct.title}
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
            <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#0F172A', lineHeight: 1.3, height: '30px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {companionProduct.title}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '900', color: '#7C3AED' }}>
              ₹{companionProduct.price.toLocaleString('en-IN')}
            </div>
          </div>

        </div>

        {/* Pricing Summary & 1-Click CTA Box */}
        <div style={{
          flex: '1 1 280px',
          maxWidth: '380px',
          backgroundColor: '#F8FAFC',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Combo Price ({selectedProducts.length} item{selectedProducts.length > 1 ? 's' : ''}):
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '24px', fontWeight: '950', color: '#0F172A' }}>
                ₹{finalComboPrice.toLocaleString('en-IN')}
              </span>
              {includeCompanion && (
                <>
                  <span style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'line-through', fontWeight: '600' }}>
                    ₹{totalOriginalPrice.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: '800', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '6px' }}>
                    Save ₹{totalSavings.toLocaleString('en-IN')} ({bundleDiscountPercent}% OFF)
                  </span>
                </>
              )}
            </div>
          </div>

          <p style={{ fontSize: '11.5px', color: '#475569', margin: 0, lineHeight: 1.35 }}>
            {primaryDuo.insight}
          </p>

          <button
            type="button"
            onClick={handleAddBundleToCart}
            style={{
              width: '100%',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.12)',
              transition: 'all 0.15s ease'
            }}
          >
            <ShoppingBag size={15} />
            Add {includeCompanion ? 'Both Items' : 'Item'} to Cart
          </button>
        </div>

      </div>

    </div>
  );
}
