import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, Zap, Tag, ShieldCheck, CheckCircle2, Layers } from 'lucide-react';

export default function MoreSmartCombos({ comboData }) {
  const { addToCart, showToast } = useApp();

  if (!comboData) return null;

  const allCombos = [];
  if (comboData.alternativeCombos && comboData.alternativeCombos.length > 0) {
    allCombos.push(...comboData.alternativeCombos);
  }
  if (comboData.completeSuite) {
    allCombos.push(comboData.completeSuite);
  }

  if (allCombos.length === 0) return null;

  const handleAddCombo = (combo) => {
    combo.products.forEach(p => {
      addToCart(p, null, 1);
    });
    showToast(`Added ${combo.name} (${combo.products.length} items) to Cart!`, 'success');
  };

  return (
    <div style={{ marginTop: '28px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="#2563EB" /> More Smart Combos & Bundle Offers
          </h3>
          <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0' }}>
            Pair compatible accessories and hardware with exclusive bundle discounts
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px'
      }}>
        {allCombos.map(combo => (
          <div
            key={combo.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              border: '1px solid #E2E8F0',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              gap: '14px',
              transition: 'all 0.2s ease'
            }}
          >
            {/* Combo Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: '900', color: '#0F172A' }}>
                  {combo.name}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#059669',
                  backgroundColor: '#ECFDF5',
                  padding: '2px 8px',
                  borderRadius: '9999px'
                }}>
                  {combo.discountPercent}% Instant Off
                </span>
              </div>

              {/* Products Thumbnails Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }} className="no-scrollbar">
                {combo.products.map((prod, idx) => (
                  <React.Fragment key={prod.id}>
                    {idx > 0 && <span style={{ color: '#94A3B8', fontWeight: '800', fontSize: '14px' }}>+</span>}
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }} title={prod.title}>
                      <img src={prod.thumbnail} alt={prod.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Items Titles List */}
              <ul style={{ paddingLeft: '16px', margin: '8px 0 0', fontSize: '11.5px', color: '#475569', lineHeight: 1.5 }}>
                {combo.products.map(p => (
                  <li key={p.id} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing & CTA */}
            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '950', color: '#0F172A' }}>
                  ₹{combo.comboPrice.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                  <span style={{ textDecoration: 'line-through' }}>₹{combo.originalPrice.toLocaleString('en-IN')}</span> • Save ₹{combo.savings.toLocaleString('en-IN')}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAddCombo(combo)}
                style={{
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  border: '1px solid #BFDBFE',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease'
                }}
              >
                <ShoppingBag size={14} /> Add Combo
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
