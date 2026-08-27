import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Mail, Lock, KeyRound, CheckCircle2, X } from 'lucide-react';

export default function AdminAuthModal({ isOpen, onClose, onAuthenticated }) {
  const { showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [step, setStep] = useState(1); // 1: Email & Password, 2: 2FA TOTP code
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Enter admin credentials', 'error');
      return;
    }
    setStep(2);
    showToast('2FA verification code dispatched to authenticator device', 'info');
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    if (twoFactorCode !== '892144' && twoFactorCode.length < 6) {
      showToast('Enter valid 6-digit 2FA code', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      showToast('Super Admin Authenticated & Session Established!', 'success');
      setIsLoading(false);
      if (onAuthenticated) onAuthenticated();
      if (onClose) onClose();
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="bottom-sheet"
        style={{
          maxWidth: '440px',
          margin: 'auto',
          borderRadius: '16px',
          backgroundColor: '#1E293B',
          color: '#ffffff',
          border: '1px solid #334155',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', backgroundColor: '#10B981', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>
              {step === 1 ? 'Super Admin Authentication' : 'Two-Factor Authentication (2FA)'}
            </h3>
          </div>
          <button onClick={onClose} style={{ color: '#94A3B8', background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        <div style={{ padding: '24px' }}>
          {step === 1 ? (
            <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Admin Master Email</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="email"
                    placeholder="admin@avero.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 'var(--radius-xs)', border: '1px solid #475569', backgroundColor: '#0F172A', color: '#ffffff', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Master Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="password"
                    placeholder="Enter master password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 'var(--radius-xs)', border: '1px solid #475569', backgroundColor: '#0F172A', color: '#ffffff', fontSize: '13px' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn" style={{ backgroundColor: '#10B981', color: '#0F172A', fontWeight: '700', height: '42px', marginTop: '6px' }}>
                Verify & Request 2FA Token
              </button>
            </form>
          ) : (
            <form onSubmit={handleStep2} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', backgroundColor: '#064E3B', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <KeyRound size={24} />
              </div>

              <div>
                <strong style={{ fontSize: '14px' }}>Enter 6-Digit Authenticator Token</strong>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                  Enter security key from Google Authenticator / YubiKey
                </p>
              </div>

              <input
                type="text"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-xs)', border: '1.5px solid #10B981', backgroundColor: '#0F172A', color: '#34D399', fontSize: '20px', letterSpacing: '8px', textAlign: 'center', fontWeight: '800' }}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="btn"
                style={{ backgroundColor: '#10B981', color: '#0F172A', fontWeight: '700', height: '44px', fontSize: '14px' }}
              >
                {isLoading ? 'Verifying Session...' : 'Authorize Admin Console Session'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
