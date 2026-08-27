import React, { useState } from 'react';
import { AVAILABLE_COUPONS } from '../../data/coupons';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, Copy, X, Calendar, Users } from 'lucide-react';

const INP = { width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13px', color: '#1E293B', backgroundColor: '#F8FAFC', outline: 'none', boxSizing: 'border-box' };

export default function AdminCoupons() {
  const { showToast } = useApp();
  const [coupons, setCoupons] = useState(
    AVAILABLE_COUPONS.map((c, i) => ({
      ...c,
      id: 'cp-' + i,
      uses: 0,
      active: true,
      minOrder: c.minOrder || 1000,
    }))
  );
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ code: '', value: '', type: 'fixed', minOrder: '', expiry: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.value) return;
    const created = {
      id: 'cp-' + Date.now(),
      code: form.code.toUpperCase().trim(),
      description: 'Platform voucher: ' + (form.type === 'percent' ? form.value + '% off' : '₹' + form.value + ' flat discount'),
      type: form.type,
      value: Number(form.value),
      minOrder: Number(form.minOrder) || 1000,
      expiry: form.expiry || '31 Dec 2026',
      uses: 0,
      active: true,
    };
    setCoupons(prev => [created, ...prev]);
    setForm({ code: '', value: '', type: 'fixed', minOrder: '', expiry: '' });
    setShowAdd(false);
    showToast('Coupon ' + created.code + ' activated!', 'success');
  };

  const handleDelete = (id) => { setCoupons(prev => prev.filter(c => c.id !== id)); showToast('Coupon disabled', 'info'); };
  const handleToggle = (id) => { setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c)); };
  const handleCopy = (code) => { try { navigator.clipboard.writeText(code); } catch (_) {} showToast('Copied: ' + code, 'success'); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0F172A' }}>Coupon & Voucher Manager</h1>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0' }}>Create platform-wide discount codes, flash vouchers and referral coupons</p>
        </div>
        <button type="button" onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', border: 'none', backgroundColor: '#2563EB', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px' }}>
        {[
          { label: 'Total Coupons', value: coupons.length, color: '#2563EB' },
          { label: 'Active Now', value: coupons.filter(c => c.active).length, color: '#16A34A' },
          { label: 'Total Uses', value: coupons.reduce((s, c) => s + (c.uses || 0), 0).toLocaleString('en-IN'), color: '#7C3AED' },
          { label: 'Avg Discount', value: '₹' + Math.round(coupons.filter(c => c.type === 'fixed').reduce((s, c) => s + c.value, 0) / Math.max(coupons.filter(c => c.type === 'fixed').length, 1)), color: '#EA580C' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px 18px' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                {['Code', 'Type & Value', 'Min. Order', 'Uses', 'Expiry', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '14px', color: '#1D4ED8', backgroundColor: '#EFF6FF', padding: '3px 8px', borderRadius: '6px', letterSpacing: '1px' }}>{c.code}</span>
                      <button type="button" onClick={() => handleCopy(c.code)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}><Copy size={13} /></button>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontWeight: '700', color: '#0F172A' }}>{c.type === 'percent' ? c.value + '% OFF' : '₹' + (c.value || 0).toLocaleString('en-IN') + ' OFF'}</span>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{c.type === 'percent' ? 'Percentage' : 'Flat'}</div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#374151', fontWeight: '600' }}>₹{(c.minOrder || 0).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#374151', fontWeight: '600' }}><Users size={12} color="#94A3B8" />{(c.uses || 0).toLocaleString('en-IN')}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#374151', fontSize: '12px' }}><Calendar size={12} color="#94A3B8" /> {c.expiry}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', backgroundColor: c.active ? '#DCFCE7' : '#F1F5F9', color: c.active ? '#16A34A' : '#64748B' }}>{c.active ? 'Active' : 'Paused'}</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button type="button" onClick={() => handleToggle(c.id)} style={{ padding: '5px 10px', borderRadius: '7px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#374151', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>{c.active ? 'Pause' : 'Resume'}</button>
                      <button type="button" onClick={() => handleDelete(c.id)} style={{ padding: '5px 8px', borderRadius: '7px', border: '1px solid #FEE2E2', backgroundColor: '#FFF5F5', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0F172A' }}>Create Platform Coupon</h2>
              <button type="button" onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '5px' }}>Coupon Code *</label>
                  <input style={INP} placeholder="AVERO50" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '5px' }}>Type</label>
                  <select style={INP} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    <option value="fixed">Flat (₹)</option>
                    <option value="percent">Percent (%)</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '5px' }}>Value *</label>
                  <input type="number" style={INP} placeholder={form.type === 'percent' ? '20' : '500'} value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '5px' }}>Min. Order (₹)</label>
                  <input type="number" style={INP} placeholder="1500" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '5px' }}>Expiry Date</label>
                <input type="date" style={INP} value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button type="button" onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#374151', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '10px', borderRadius: '10px', border: 'none', backgroundColor: '#2563EB', color: '#fff', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>Activate Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
