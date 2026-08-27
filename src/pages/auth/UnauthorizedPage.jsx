import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ArrowLeft, Home, LogIn, Lock, CheckCircle2 } from 'lucide-react';

export default function UnauthorizedPage({ requiredRole = 'admin' }) {
  const { user, logoutUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{
      minHeight: '85vh',
      backgroundColor: '#0B0F19',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      color: '#FFFFFF',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '540px',
        width: '100%',
        backgroundColor: '#111827',
        borderRadius: '24px',
        border: '1px solid #1F2937',
        padding: '36px 32px',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top Glow Accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '240px',
          height: '4px',
          background: 'linear-gradient(90deg, #DC2626 0%, #EF4444 50%, #F59E0B 100%)'
        }} />

        {/* Shield Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          color: '#EF4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)'
        }}>
          <ShieldAlert size={32} />
        </div>

        {/* Error Title */}
        <span style={{
          fontSize: '11px',
          fontWeight: '900',
          letterSpacing: '1px',
          color: '#EF4444',
          textTransform: 'uppercase',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          padding: '4px 12px',
          borderRadius: '9999px'
        }}>
          403 Access Forbidden
        </span>

        <h1 style={{ fontSize: '24px', fontWeight: '950', margin: '14px 0 8px', letterSpacing: '-0.5px' }}>
          Restricted Master Governance Area
        </h1>

        <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.5, margin: '0 0 20px' }}>
          This route (<code style={{ color: '#F3F4F6', backgroundColor: '#1F2937', padding: '2px 6px', borderRadius: '6px' }}>{location.pathname}</code>) requires elevated <strong>{requiredRole.toUpperCase()}</strong> permissions.
        </p>

        {/* Current Auth Status Card */}
        <div style={{
          backgroundColor: '#1F2937',
          borderRadius: '14px',
          padding: '14px 18px',
          marginBottom: '24px',
          textAlign: 'left',
          fontSize: '12.5px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#9CA3AF' }}>Authenticated As:</span>
            <strong style={{ color: '#FFFFFF' }}>{user?.email || 'Guest User'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#9CA3AF' }}>Current Role:</span>
            <span style={{
              color: user?.role === 'admin' ? '#10B981' : '#F59E0B',
              fontWeight: '800',
              textTransform: 'uppercase'
            }}>
              {user?.role || 'customer'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#9CA3AF' }}>Required Permission:</span>
            <strong style={{ color: '#EF4444' }}>role === '{requiredRole}'</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            to="/"
            style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: '#3B82F6',
              color: '#FFFFFF',
              fontWeight: '800',
              fontSize: '13.5px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
          >
            <Home size={16} /> Return to Marketplace Storefront
          </Link>

          <button
            type="button"
            onClick={() => {
              logoutUser();
              navigate('/login', { state: { returnUrl: location.pathname } });
            }}
            style={{
              padding: '11px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              border: '1px solid #374151',
              color: '#D1D5DB',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <LogIn size={15} /> Switch to Authorized Account
          </button>
        </div>

      </div>
    </div>
  );
}
