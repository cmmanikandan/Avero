
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Trash2, CheckCircle2, Search, Flag } from 'lucide-react';

export default function AdminReviewsModeration() {
  const { showToast } = useApp();
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('avero_moderated_reviews') || '[]');
      return Array.isArray(saved) ? saved.filter(r => !r.product?.includes('iPhone 15') && !r.product?.includes('Pegasus 40')) : [];
    } catch {
      return [];
    }
  });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const approve = (id) => { 
    const updated = reviews.map(r => r.id === id ? { ...r, status: 'VERIFIED' } : r);
    setReviews(updated); 
    localStorage.setItem('avero_moderated_reviews', JSON.stringify(updated));
    showToast('Review approved and flag dismissed', 'success'); 
  };

  const remove = (id) => { 
    const updated = reviews.filter(r => r.id !== id);
    setReviews(updated); 
    localStorage.setItem('avero_moderated_reviews', JSON.stringify(updated));
    showToast('Review permanently removed', 'info'); 
  };

  const filtered = reviews.filter(r => {
    const matchSearch = !search || r.product?.toLowerCase().includes(search.toLowerCase()) || r.author?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || r.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0F172A' }}>Review & Rating Moderation</h1>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0' }}>Audit flagged customer ratings, purge spam and remove inappropriate content</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
        {[
          { label: 'Total Reviewed', value: reviews.length, color: '#2563EB' },
          { label: 'Pending Action', value: reviews.filter(r => r.status === 'FLAGGED').length, color: '#DC2626' },
          { label: 'Verified Clean', value: reviews.filter(r => r.status === 'VERIFIED').length, color: '#16A34A' },
          { label: 'Auto-Removed (7d)', value: 0, color: '#64748B' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px 18px' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '8px 12px', flex: 1, minWidth: '200px' }}>
          <Search size={14} color="#94A3B8" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by product or reviewer..." style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '13px', color: '#1E293B', flex: 1 }} />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '13px', color: '#374151', backgroundColor: '#fff', fontWeight: '600' }}>
          {['ALL', 'FLAGGED', 'VERIFIED'].map(f => <option key={f}>{f}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(rev => (
          <div key={rev.id} style={{ backgroundColor: '#fff', borderRadius: '12px', border: rev.status === 'FLAGGED' ? '1px solid #FEE2E2' : '1px solid #DCFCE7', padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>{rev.product}</div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>by <strong>{rev.author}</strong> · {rev.date}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', backgroundColor: rev.status === 'FLAGGED' ? '#FEE2E2' : '#DCFCE7', color: rev.status === 'FLAGGED' ? '#DC2626' : '#16A34A', whiteSpace: 'nowrap' }}>
                {rev.status === 'FLAGGED' ? '⚑ Flagged' : '✓ Verified'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= rev.rating ? '#FBBF24' : 'none'} color={s <= rev.rating ? '#FBBF24' : '#D1D5DB'} />)}
            </div>

            <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 10px', lineHeight: '1.5', fontStyle: 'italic', backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '8px' }}>"{rev.comment}"</p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#EA580C', fontWeight: '700', backgroundColor: '#FFF7ED', padding: '3px 10px', borderRadius: '6px' }}>
                <Flag size={11} /> {rev.reason}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {rev.status === 'FLAGGED' && (
                  <button type="button" onClick={() => approve(rev.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #DCFCE7', backgroundColor: '#F0FDF4', color: '#16A34A', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                    <CheckCircle2 size={13} /> Approve
                  </button>
                )}
                <button type="button" onClick={() => remove(rev.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #FEE2E2', backgroundColor: '#FFF5F5', color: '#DC2626', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748B', backgroundColor: '#fff', borderRadius: '14px', border: '1px dashed #CBD5E1' }}>
            <CheckCircle2 size={36} color="#16A34A" style={{ margin: '0 auto 10px', display: 'block' }} />
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>All Product Reviews Clean & Verified</div>
            <div style={{ fontSize: '12.5px', color: '#64748B' }}>No flagged ratings or spam reports require moderation action.</div>
          </div>
        )}
      </div>
    </div>
  );
}
