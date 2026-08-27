import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Layers, X, ArrowRight, Trash2, CheckCircle2 } from 'lucide-react';

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare } = useApp();
  const navigate = useNavigate();

  if (!compareList || compareList.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        borderRadius: '16px',
        padding: '12px 18px',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        maxWidth: '520px',
        width: 'auto',
        animation: 'slideUp 0.25s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#2563EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          flexShrink: 0
        }}>
          <Layers size={18} />
        </div>

        <div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Compare ({compareList.length}/4)
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>
            Side-by-side AI specs & price
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {compareList.map((item) => (
          <div
            key={item.id}
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              padding: '2px',
              overflow: 'hidden',
              border: '1px solid #334155'
            }}
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
            <button
              type="button"
              onClick={() => removeFromCompare(item.id)}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: '#FFFFFF',
                border: 'none',
                width: '14px',
                height: '14px',
                borderRadius: '0 0 0 4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
              title="Remove"
            >
              <X size={10} />
            </button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={() => navigate('/compare')}
          className="btn btn-primary"
          style={{
            height: '34px',
            padding: '0 14px',
            fontSize: '12px',
            fontWeight: '800',
            gap: '4px',
            whiteSpace: 'nowrap'
          }}
        >
          Compare Now <ArrowRight size={13} />
        </button>

        <button
          type="button"
          onClick={clearCompare}
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Clear all"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
