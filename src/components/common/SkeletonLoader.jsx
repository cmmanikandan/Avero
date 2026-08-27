import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: 'var(--radius-md)',
      padding: '12px',
      border: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div className="skeleton" style={{ width: '100%', aspectRatio: '1/1', borderRadius: 'var(--radius-sm)' }} />
      <div className="skeleton" style={{ width: '60%', height: '14px' }} />
      <div className="skeleton" style={{ width: '90%', height: '16px' }} />
      <div className="skeleton" style={{ width: '40%', height: '20px' }} />
      <div className="skeleton" style={{ width: '50%', height: '12px' }} />
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="skeleton" style={{
      width: '100%',
      aspectRatio: '21/9',
      borderRadius: 'var(--radius-lg)',
      minHeight: '160px'
    }} />
  );
}

export function ListSkeleton({ count = 4 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'flex',
          gap: '14px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="skeleton" style={{ width: '70%', height: '16px' }} />
            <div className="skeleton" style={{ width: '40%', height: '14px' }} />
            <div className="skeleton" style={{ width: '30%', height: '18px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
