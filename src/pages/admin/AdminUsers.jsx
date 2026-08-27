import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { supabaseService } from '../../services/supabase';
import { Users, Search, Shield, Ban, CheckCircle2, Trash2, UserPlus, Check, X, ShieldAlert } from 'lucide-react';

const ROLE_COLORS = {
  CUSTOMER: { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  SELLER: { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
  ADMIN: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
  DELIVERY: { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' }
};

export default function AdminUsers() {
  const { user, showToast } = useApp();

  const [users, setUsers] = useState(() => {
    const list = [];
    if (user?.email) {
      list.push({
        id: user.firebaseUid || 'USR-CURRENT',
        name: user.name || user.email.split('@')[0],
        email: user.email,
        phone: user.phone || '+91 98450 00000',
        role: (user.role || 'CUSTOMER').toUpperCase(),
        joined: 'Today',
        orders: 0,
        status: 'ACTIVE',
        avatarBg: '#2563EB'
      });
    }
    return list;
  });

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    supabaseService.getUsers().then(liveUsers => {
      if (liveUsers && liveUsers.length > 0) {
        const mapped = liveUsers.map((u, i) => ({
          id: u.id || u.firebase_uid || `USR-${100 + i}`,
          name: u.name || u.email?.split('@')[0] || 'User',
          email: u.email,
          phone: u.phone || '',
          role: (u.role || 'CUSTOMER').toUpperCase(),
          joined: u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently',
          orders: 0,
          status: u.is_suspended ? 'SUSPENDED' : 'ACTIVE',
          avatarBg: '#2563EB'
        }));
        setUsers(mapped);
      }
    }).catch(console.warn);
  }, []);

  const toggleStatus = (id) => {
    setUsers(p => p.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u));
    const u = users.find(u => u.id === id);
    showToast((u?.status === 'ACTIVE' ? 'Account suspended: ' : 'Account reactivated: ') + u?.name, u?.status === 'ACTIVE' ? 'info' : 'success');
  };

  const deleteUser = (id) => {
    setUsers(p => p.filter(u => u.id !== id));
    showToast('User account deleted from platform registry', 'info');
  };

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        borderRadius: '16px',
        padding: '22px 28px',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
          }}>
            <Users size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '19px', fontWeight: '900', margin: 0, color: '#FFFFFF' }}>
              User Accounts & Role Permissions Matrix
            </h1>
            <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: '2px 0 0' }}>
              Govern buyer accounts, merchant permissions, delivery fleet riders, and root administrators
            </p>
          </div>
        </div>
      </div>

      {/* Colorful Summary Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Total Registered Accounts', value: users.length, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
          { label: 'Marketplace Buyers', value: users.filter(u => u.role === 'CUSTOMER').length, color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
          { label: 'Verified Sellers', value: users.filter(u => u.role === 'SELLER').length, color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
          { label: 'Suspended Accounts', value: users.filter(u => u.status === 'SUSPENDED').length, color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: s.bg, borderRadius: '12px', border: `1px solid ${s.border}`, padding: '14px 16px' }}>
            <div style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: '950', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '8px 14px', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="#64748B" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or User ID..."
            style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '13px', color: '#0F172A', flex: 1 }}
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          style={{ padding: '9px 16px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0F172A', backgroundColor: '#FFFFFF', fontWeight: '700' }}
        >
          {['ALL', 'CUSTOMER', 'SELLER', 'ADMIN', 'DELIVERY'].map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Users Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }} className="no-scrollbar">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#0F172A', color: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
                {['User Profile', 'Contact Information', 'Platform Role', 'Member Since', 'Orders', 'Account Status', 'Governance Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                    No matching users found
                  </td>
                </tr>
              ) : (
                filtered.map((user, idx) => {
                  const rc = ROLE_COLORS[user.role] || { bg: '#F1F5F9', text: '#64748B', border: '#CBD5E1' };
                  const isSuspended = user.status === 'SUSPENDED';

                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFCFF' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            backgroundColor: user.avatarBg,
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: '900',
                            flexShrink: 0
                          }}>
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: '800', color: '#0F172A' }}>{user.name}</div>
                            <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace' }}>{user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ color: '#0F172A', fontWeight: '600' }}>{user.email}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{user.phone}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          backgroundColor: rc.bg,
                          color: rc.text,
                          border: `1px solid ${rc.border}`
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#64748B', fontSize: '12px' }}>
                        {user.joined}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: '800', color: '#0F172A' }}>
                        {user.orders} Orders
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          backgroundColor: isSuspended ? '#FEF2F2' : '#ECFDF5',
                          color: isSuspended ? '#DC2626' : '#059669',
                          border: `1px solid ${isSuspended ? '#FECACA' : '#A7F3D0'}`
                        }}>
                          ● {user.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => toggleStatus(user.id)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: isSuspended ? '1px solid #A7F3D0' : '1px solid #FECACA',
                              backgroundColor: isSuspended ? '#ECFDF5' : '#FEF2F2',
                              color: isSuspended ? '#059669' : '#DC2626',
                              fontSize: '11px',
                              fontWeight: '800',
                              cursor: 'pointer'
                            }}
                          >
                            {isSuspended ? 'Reactivate' : 'Suspend'}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteUser(user.id)}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '6px',
                              border: '1px solid #E2E8F0',
                              backgroundColor: '#F8FAFC',
                              color: '#64748B',
                              cursor: 'pointer'
                            }}
                            title="Delete user"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
