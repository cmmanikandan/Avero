import React from 'react';
import { Check } from 'lucide-react';

export default function VariantSelector({ variants, selectedVariant, onSelectVariant }) {
  if (!variants) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '4px 0' }}>
      {/* Color Swatches */}
      {variants.colors && variants.colors.length > 0 && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Color:</span>
            <strong style={{ color: 'var(--primary-600)', fontWeight: '700' }}>
              {selectedVariant?.color || variants.colors[0]?.name}
            </strong>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {variants.colors.map((col) => {
              const isSelected = (selectedVariant?.color || variants.colors[0]?.name) === col.name;
              return (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => onSelectVariant('color', col.name)}
                  className={`pdp-pill-btn ${isSelected ? 'active' : ''}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    height: '44px',
                    minHeight: '44px',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: col.hex,
                      border: '1px solid rgba(0,0,0,0.2)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {isSelected && (
                      <Check size={11} color={['#ffffff', '#F0EFEA'].includes(col.hex) ? '#000' : '#fff'} strokeWidth={3} />
                    )}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: isSelected ? '700' : '600' }}>
                    {col.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Storage / Configuration Pills */}
      {variants.storage && variants.storage.length > 0 && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Storage / Variant:</span>
            <strong style={{ color: 'var(--primary-600)', fontWeight: '700' }}>
              {selectedVariant?.storage ||
                variants.storage.find((s) => s.selected)?.label ||
                variants.storage[0].label}
            </strong>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {variants.storage.map((st) => {
              const currentSelected =
                selectedVariant?.storage ||
                variants.storage.find((s) => s.selected)?.label ||
                variants.storage[0].label;
              const isSelected = currentSelected === st.label;

              return (
                <button
                  key={st.label}
                  type="button"
                  onClick={() => onSelectVariant('storage', st.label, st.price)}
                  className={`pdp-pill-btn ${isSelected ? 'active' : ''}`}
                  style={{
                    height: '44px',
                    minHeight: '44px',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: isSelected ? '700' : '600' }}>
                    {st.label}
                  </span>
                  {st.price && (
                    <span style={{ fontSize: '11px', color: isSelected ? 'var(--primary-700)' : 'var(--text-secondary)' }}>
                      • ₹{st.price.toLocaleString('en-IN')}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {variants.sizes && variants.sizes.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Size:</span>
              <strong style={{ color: 'var(--primary-600)', fontWeight: '700' }}>
                {selectedVariant?.size ||
                  variants.sizes.find((s) => s.selected)?.label ||
                  variants.sizes[0].label}
              </strong>
            </div>
            <button
              type="button"
              onClick={() => alert('Standard Brand Size Chart: True to Size.')}
              style={{ fontSize: '12px', color: 'var(--primary-600)', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Size Chart
            </button>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {variants.sizes.map((sz) => {
              const currentSelected =
                selectedVariant?.size ||
                variants.sizes.find((s) => s.selected)?.label ||
                variants.sizes[0].label;
              const isSelected = currentSelected === sz.label;
              const isOutOfStock = sz.inStock === false;

              return (
                <button
                  key={sz.label}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => onSelectVariant('size', sz.label)}
                  className={`pdp-pill-btn ${isSelected ? 'active' : ''}`}
                  style={{
                    minWidth: '60px',
                    height: '44px',
                    minHeight: '44px',
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-full)',
                    textAlign: 'center'
                  }}
                >
                  {sz.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
