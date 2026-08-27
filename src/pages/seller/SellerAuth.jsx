import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Store, Mail, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, ArrowRight, X } from 'lucide-react';

export default function SellerAuth() {
  const { setUser, setActiveRole, showToast } = useApp();
  const navigate = useNavigate();

  const [mode, setMode] = useState('LOGIN'); // 'LOGIN' | 'REGISTER'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Registration Form
  const [regData, setRegData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter your vendor email and password', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const formattedName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const sellerUser = {
        isAuth: true,
        name: formattedName || 'Vendor Partner',
        email: email.trim(),
        role: 'seller',
        storeName: `${formattedName} Official Store`,
        firebaseUid: 'fb_seller_' + Date.now(),
        supabaseId: 'sp_seller_' + Date.now(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=F59E0B&color=fff`,
        emailVerified: true
      };
      setUser(sellerUser);
      localStorage.setItem('avero_user', JSON.stringify(sellerUser));
      setActiveRole('seller');
      navigate('/seller');
      showToast('Welcome back to Avero Seller Central!', 'success');
      setIsLoading(false);
    }, 600);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regData.businessName.trim() || !regData.email.trim() || !regData.password.trim()) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    if (regData.password !== regData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newSeller = {
        isAuth: true,
        name: regData.ownerName || regData.businessName,
        email: regData.email,
        role: 'seller',
        storeName: regData.businessName,
        firebaseUid: 'fb_seller_' + Date.now(),
        supabaseId: 'sp_seller_' + Date.now(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(regData.businessName)}&background=F59E0B&color=fff`,
        emailVerified: true
      };
      setUser(newSeller);
      localStorage.setItem('avero_user', JSON.stringify(newSeller));
      setActiveRole('seller');
      navigate('/seller');
      showToast('Store registered! Welcome to Seller Central.', 'success');
      setIsLoading(false);
    }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      {/* Standalone Seller Auth Header */}
      <header style={{
        backgroundColor: '#0F172A',
        borderBottom: '1px solid #1E293B',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <img src="/logo.png" alt="Avero" style={{ width: '28px', height: '28px' }} />
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>Avero</span>
          </Link>
          <span style={{ fontSize: '11px', fontWeight: '700', backgroundColor: '#10B981', color: '#ffffff', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
            Seller Central
          </span>
        </div>

        <Link
          to="/"
          style={{
            fontSize: '13px',
            color: '#94A3B8',
            textDecoration: 'none',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ← Return to Marketplace
        </Link>
      </header>

      {/* Centered Auth Card Container */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div style={{
          maxWidth: '460px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ backgroundColor: '#0F172A', padding: '24px', color: '#ffffff', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#10B981' }}>
              <Store size={26} />
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>
              {mode === 'LOGIN' ? 'Seller Central Login' : 'Sell on Avero — Register Store'}
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
              Vendor Portal • Email Authentication
            </p>
          </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-divider)' }}>
          <button
            type="button"
            onClick={() => setMode('LOGIN')}
            style={{
              flex: 1,
              padding: '12px',
              fontWeight: '700',
              fontSize: '13px',
              backgroundColor: mode === 'LOGIN' ? '#ffffff' : '#F1F5F9',
              color: mode === 'LOGIN' ? 'var(--primary-600)' : 'var(--text-secondary)',
              borderBottom: mode === 'LOGIN' ? '2px solid var(--primary-600)' : 'none',
              borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer'
            }}
          >
            Vendor Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('REGISTER')}
            style={{
              flex: 1,
              padding: '12px',
              fontWeight: '700',
              fontSize: '13px',
              backgroundColor: mode === 'REGISTER' ? '#ffffff' : '#F1F5F9',
              color: mode === 'REGISTER' ? 'var(--primary-600)' : 'var(--text-secondary)',
              borderBottom: mode === 'REGISTER' ? '2px solid var(--primary-600)' : 'none',
              borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer'
            }}
          >
            Register Store (KYC Later)
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {mode === 'LOGIN' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Registered Vendor Email *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="email"
                    placeholder="e.g. contact@yourstore.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Password *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your vendor password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 38px 10px 38px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
                style={{ height: '44px', fontSize: '14px', marginTop: '6px' }}
              >
                {isLoading ? 'Signing In...' : 'Sign In to Seller Central'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Business / Store Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Electronics LLP"
                  value={regData.businessName}
                  onChange={(e) => setRegData({ ...regData, businessName: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Owner / Director Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  value={regData.ownerName}
                  onChange={(e) => setRegData({ ...regData, ownerName: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Business Email *</label>
                <input
                  type="email"
                  placeholder="contact@apexstore.com"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Password *</label>
                  <input
                    type="password"
                    placeholder="Min 8 chars"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Confirm *</label>
                  <input
                    type="password"
                    placeholder="Re-enter"
                    value={regData.confirmPassword}
                    onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span style={{ fontWeight: '700', color: 'var(--primary-600)' }}>KYC Step:</span> GSTIN, PAN, and Bank details can be submitted in Store Settings anytime after email confirmation.
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
                style={{ height: '44px', fontSize: '14px', marginTop: '4px' }}
              >
                {isLoading ? 'Creating Store...' : 'Register Vendor Store'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}
