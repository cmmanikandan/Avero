import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Store, ShieldAlert, ShoppingCart } from 'lucide-react';

export default function RoleSwitcher() {
  const { activeRole, setActiveRole } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleChange = (role) => {
    setActiveRole(role);
    if (role === 'seller') {
      navigate('/seller');
    } else if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{
      backgroundColor: '#0F172A',
      color: '#94A3B8',
      fontSize: '11px',
      padding: '4px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #1E293B'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#E2E8F0', fontWeight: '600' }}>Avero Ecosystem:</span>
        <span>Switch portal view:</span>
      </div>

      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={() => handleRoleChange('customer')}
          style={{
            padding: '3px 8px',
            borderRadius: 'var(--radius-xs)',
            fontSize: '11px',
            fontWeight: '600',
            backgroundColor: activeRole === 'customer' ? 'var(--primary-600)' : 'transparent',
            color: activeRole === 'customer' ? '#ffffff' : '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <ShoppingCart size={12} /> Marketplace
        </button>

        <button
          onClick={() => handleRoleChange('seller')}
          style={{
            padding: '3px 8px',
            borderRadius: 'var(--radius-xs)',
            fontSize: '11px',
            fontWeight: '600',
            backgroundColor: activeRole === 'seller' ? '#F59E0B' : 'transparent',
            color: activeRole === 'seller' ? '#0F172A' : '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Store size={12} /> Seller Hub
        </button>

        <button
          onClick={() => handleRoleChange('admin')}
          style={{
            padding: '3px 8px',
            borderRadius: 'var(--radius-xs)',
            fontSize: '11px',
            fontWeight: '600',
            backgroundColor: activeRole === 'admin' ? '#10B981' : 'transparent',
            color: activeRole === 'admin' ? '#0F172A' : '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <ShieldAlert size={12} /> Super Admin
        </button>
      </div>
    </div>
  );
}
