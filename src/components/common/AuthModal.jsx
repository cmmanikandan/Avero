import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { firebaseAuthService } from '../../services/firebase';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginWithEmail,
    loginWithGoogle,
    showToast
  } = useApp();

  const navigate = useNavigate();

  // Mode: 'LOGIN' | 'FORGOT'
  const [modalView, setModalView] = useState('LOGIN');

  // Form Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your registered email address', 'error');
      return;
    }
    if (!password || password.length < 4) {
      showToast('Please enter your password', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
      setIsAuthModalOpen(false);
      setEmail('');
      setPassword('');
    } catch (err) {
      showToast(err.message || 'Failed to sign in. Check your email & password.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      setIsAuthModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Google Sign-In failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your registered email address', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await firebaseAuthService.sendPasswordResetEmail(email.trim());
      setResetSent(true);
      showToast(`Password recovery link dispatched to ${email.trim()}`, 'success');
    } catch (err) {
      showToast('Error dispatching password reset link', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToRegister = () => {
    setIsAuthModalOpen(false);
    navigate('/register');
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        className="auth-modal-card"
        style={{
          maxWidth: '680px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'row',
          position: 'relative',
          minHeight: '440px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsAuthModalOpen(false)}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#F1F5F9',
            border: 'none',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.15s ease'
          }}
          title="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Left Side: Flipkart-style Blue Branding Banner */}
        <div
          style={{
            width: '260px',
            backgroundColor: 'var(--primary-600)',
            background: 'linear-gradient(180deg, #1366E2 0%, #0D4EB0 100%)',
            color: '#ffffff',
            padding: '36px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
          className="auth-modal-left-banner"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <img src="/logo.png" alt="Avero" style={{ width: '32px', height: '32px', filter: 'brightness(0) invert(1)' }} />
              <span style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px' }}>Avero</span>
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 10px', lineHeight: '1.2' }}>
              {modalView === 'LOGIN' ? 'Login' : 'Reset Password'}
            </h2>
            <p style={{ fontSize: '13px', lineHeight: '1.5', opacity: 0.9, margin: 0 }}>
              {modalView === 'LOGIN'
                ? 'Get access to your Orders, Wishlist, Express Checkout and Personalized Recommendations.'
                : 'Enter your registered email ID to receive a secure password recovery link.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.85, fontSize: '11px', fontWeight: '600' }}>
            <ShieldCheck size={16} /> 100% Secure & Genuine Marketplace
          </div>
        </div>

        {/* Right Side: Pop Up Sign In Card Form */}
        <div style={{ flex: 1, padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {modalView === 'LOGIN' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Email Input */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={16} color="#64748B" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="email"
                    placeholder="Enter Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-subtle)',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => { setModalView('FORGOT'); setResetSent(false); }}
                    style={{ fontSize: '11px', color: 'var(--primary-600)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    Forgot?
                  </button>
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '11px 38px 11px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-subtle)',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
                style={{
                  height: '44px',
                  fontSize: '14px',
                  fontWeight: '700',
                  marginTop: '4px',
                  justifyContent: 'center'
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '2px 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-divider)' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>OR</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-divider)' }} />
              </div>

              {/* 1-Click Continue with Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                style={{
                  height: '42px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-xs)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>

              {/* Bottom Link: Flipkart-style "New to Avero? Create an account" */}
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={handleGoToRegister}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-600)',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}
                >
                  New to Avero? Create an account
                </button>
              </div>
            </form>
          ) : (
            /* FORGOT PASSWORD VIEW */
            <div>
              {resetSent ? (
                <div style={{ textAlign: 'center', padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={30} />
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                    Recovery Link Dispatched
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                    Check your inbox at <strong>{email}</strong> for instructions to reset your password.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setModalView('LOGIN'); setResetSent(false); }}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '12px', height: '42px', fontSize: '13px', fontWeight: '700' }}
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                      Registered Email Address *
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Mail size={16} color="#64748B" style={{ position: 'absolute', left: '12px' }} />
                      <input
                        type="email"
                        placeholder="e.g. name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '11px 14px 11px 38px',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid var(--border-subtle)',
                          backgroundColor: '#FFFFFF',
                          color: 'var(--text-primary)',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                    style={{ height: '42px', fontSize: '13px', fontWeight: '700' }}
                  >
                    {isLoading ? 'Sending...' : 'Send Password Reset Link'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalView('LOGIN')}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textAlign: 'center' }}
                  >
                    ← Back to Sign In
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
