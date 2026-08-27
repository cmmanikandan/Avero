import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { firebaseAuthService } from '../../services/firebase';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  X,
  Truck,
  Gift
} from 'lucide-react';

export default function LoginPage() {
  const { user, loginWithEmail, loginWithGoogle, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'REGISTER' | 'LOGIN' | 'FORGOT'
  const isRegisterRoute = location.pathname === '/register';
  const [authMode, setAuthMode] = useState(isRegisterRoute ? 'REGISTER' : 'LOGIN');

  // Sync mode with route changes
  useEffect(() => {
    if (location.pathname === '/register') {
      setAuthMode('REGISTER');
      setRegisterStep(1);
    } else if (location.pathname === '/login') {
      setAuthMode('LOGIN');
    }
  }, [location.pathname]);

  // Full-Screen Register Wizard Steps:
  // Step 1: Name, Email & Mobile
  // Step 2: Set Password & City/Pincode
  // Step 3: Success Animation & Auto Sign-In
  const [registerStep, setRegisterStep] = useState(1);

  // Form Inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Auto redirect if already authenticated
  useEffect(() => {
    if (user.isAuth && registerStep !== 3) {
      const from = location.state?.from || '/account';
      navigate(from, { replace: true });
    }
  }, [user.isAuth, navigate, location.state, registerStep]);

  // Real-time password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '#E2E8F0' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: '#EF4444' };
      case 2:
        return { score: 50, label: 'Fair', color: '#F59E0B' };
      case 3:
        return { score: 75, label: 'Good', color: '#3B82F6' };
      case 4:
        return { score: 100, label: 'Strong', color: '#10B981' };
      default:
        return { score: 10, label: 'Very Weak', color: '#EF4444' };
    }
  };

  const strength = getPasswordStrength(password);

  // Step 1 -> Step 2 Validation (First Card to Next Card)
  const handleStep1Continue = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    if (mobile.trim() && mobile.replace(/\D/g, '').length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    // Move to next card!
    setRegisterStep(2);
  };

  // Step 2 -> Step 3 & Auto Sign-In (Final Registration Card)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Execute account creation & automatic sign-in
      await loginWithEmail(email.trim(), password, name.trim());
      
      // Move to Step 3: Success Confirmation Screen
      setRegisterStep(3);
      showToast('Account created successfully! Welcome to Avero.', 'success');

      // Auto redirect to marketplace after brief celebration
      setTimeout(() => {
        const from = location.state?.from || '/';
        navigate(from, { replace: true });
      }, 1600);
    } catch (err) {
      showToast(err.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Google 1-Click Sign-In (Automatic Account Creation & Sign-In)
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      showToast('Signed in successfully with Google!', 'success');
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    } catch (err) {
      showToast('Google Sign-In failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Standard Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter your email and password', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
      showToast('Signed in successfully!', 'success');
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    } catch (err) {
      showToast(err.message || 'Login failed. Check your credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password Submit
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      showToast('Please enter your registered email address', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await firebaseAuthService.sendPasswordResetEmail(forgotEmail.trim());
      setForgotSent(true);
      showToast(`Password reset link dispatched to ${forgotEmail.trim()}`, 'success');
    } catch (err) {
      showToast('Failed to send reset email', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#F8FAFC',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      
      {/* Top Header Bar */}
      <header style={{
        height: '60px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Brand Logo */}
        <Link to="/" className="brand-logo-link" style={{ gap: '8px' }}>
          <img src="/logo.png" alt="Avero" className="brand-logo-img" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          <span className="brand-name-gradient" style={{ fontSize: '19px', letterSpacing: '-0.5px' }}>
            Avero
          </span>
        </Link>

        {/* Wizard Progress Pill (in Register Mode) */}
        {authMode === 'REGISTER' && registerStep !== 3 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#EFF6FF',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: '700',
              color: 'var(--primary-600)'
            }}>
              <span>Step {registerStep} of 2</span>
            </div>
          </div>
        )}

        {/* Right Close Action */}
        <Link
          to="/"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            textDecoration: 'none',
            transition: 'background-color 0.15s ease'
          }}
          title="Return to Marketplace"
        >
          <X size={16} />
        </Link>
      </header>

      {/* Main Full-Height Wizard Canvas */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: '#F1F5F9'
      }}>
        
        {/* Full-Screen Wizard Split Card */}
        <div className="flipkart-wizard-card">
          
          {/* Left Hero Visual Column (Flipkart Gradient) */}
          <div className="flipkart-wizard-left">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.18)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: '800', marginBottom: '14px', letterSpacing: '0.4px' }}>
                <Sparkles size={13} /> INDIA'S FASTEST MARKETPLACE
              </div>

              <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 10px', lineHeight: '1.2' }}>
                {authMode === 'REGISTER'
                  ? "Looks like you're new here!"
                  : authMode === 'FORGOT'
                  ? "Password Recovery"
                  : "Welcome Back to Avero"}
              </h1>

              <p style={{ fontSize: '13px', lineHeight: '1.5', opacity: 0.9, margin: '0 0 20px' }}>
                {authMode === 'REGISTER'
                  ? 'Sign up with your details to access exclusive discounts, express order tracking & instant refunds.'
                  : 'Access your past orders, delivery addresses, and personalized shopping recommendations.'}
              </p>

              {/* Shopping Value Propositions */}
              <div className="wizard-features-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', opacity: 0.95 }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Truck size={14} />
                  </div>
                  <span>Lightning 24-48 hr Delivery across 28,000+ PIN codes</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', opacity: 0.95 }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ShieldCheck size={14} />
                  </div>
                  <span>100% Genuine Brand Certified Guarantee</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', opacity: 0.95 }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Gift size={14} />
                  </div>
                  <span>Instant ₹500 Welcome Discount on First Order</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', opacity: 0.8, fontWeight: '600', marginTop: '16px' }}>
              <ShieldCheck size={14} /> 256-Bit SSL Encrypted & RBI DPDP Compliant
            </div>
          </div>

          {/* Right Content Area (Step Cards) */}
          <div className="flipkart-wizard-right">
            
            {/* ================= REGISTER WIZARD (MULTI-CARD) ================= */}
            {authMode === 'REGISTER' ? (
              <div>
                
                {/* ---------------- CARD 1: Identity Details (Step 1) ---------------- */}
                {registerStep === 1 && (
                  <div>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Step 1 of 2
                      </div>
                      <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: '2px 0 0' }}>
                        Enter Personal Details
                      </h2>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                        We'll use this to send order status, live courier tracking & delivery OTPs.
                      </p>
                    </div>

                    <form onSubmit={handleStep1Continue} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {/* Name Input */}
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                          Full Name *
                        </label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <User size={16} color="#64748B" style={{ position: 'absolute', left: '12px' }} />
                          <input
                            type="text"
                            placeholder="e.g. Rohan Sharma"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
                            style={{
                              width: '100%',
                              padding: '10px 14px 10px 38px',
                              borderRadius: 'var(--radius-md)',
                              border: '1.5px solid var(--border-subtle)',
                              fontSize: '13px',
                              outline: 'none'
                            }}
                          />
                          {name.trim().length >= 2 && (
                            <Check size={16} color="#10B981" style={{ position: 'absolute', right: '12px' }} />
                          )}
                        </div>
                      </div>

                      {/* Email Address */}
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                          Email Address *
                        </label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <Mail size={16} color="#64748B" style={{ position: 'absolute', left: '12px' }} />
                          <input
                            type="email"
                            placeholder="e.g. rohan@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                              width: '100%',
                              padding: '10px 14px 10px 38px',
                              borderRadius: 'var(--radius-md)',
                              border: '1.5px solid var(--border-subtle)',
                              fontSize: '13px',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>

                      {/* Mobile Number (Optional) */}
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                          10-Digit Mobile Number (Optional)
                        </label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <span style={{ position: 'absolute', left: '12px', fontSize: '12px', fontWeight: '700', color: '#64748B' }}>+91</span>
                          <input
                            type="tel"
                            maxLength={10}
                            placeholder="98765 43210"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                            style={{
                              width: '100%',
                              padding: '10px 14px 10px 44px',
                              borderRadius: 'var(--radius-md)',
                              border: '1.5px solid var(--border-subtle)',
                              fontSize: '13px',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>

                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0', lineHeight: '1.4' }}>
                        By continuing, you agree to Avero's <Link to="/terms" style={{ color: 'var(--primary-600)', fontWeight: '700' }}>Terms of Use</Link> and <Link to="/privacy" style={{ color: 'var(--primary-600)', fontWeight: '700' }}>Privacy Policy</Link>.
                      </p>

                      {/* CONTINUE BUTTON -> OPENS NEXT CARD */}
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ height: '44px', fontSize: '13px', fontWeight: '800', gap: '8px', justifyContent: 'center', marginTop: '2px' }}
                      >
                        CONTINUE TO PASSWORD <ArrowRight size={16} />
                      </button>

                      {/* Divider */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '1px 0' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-divider)' }} />
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '700' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-divider)' }} />
                      </div>

                      {/* 1-Click Continue with Google */}
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        style={{
                          height: '42px',
                          backgroundColor: '#ffffff',
                          border: '1.5px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          fontSize: '13px',
                          fontWeight: '700',
                          color: 'var(--text-primary)',
                          boxShadow: 'var(--shadow-xs)',
                          cursor: 'pointer'
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

                      {/* Link to Sign In */}
                      <div style={{ textAlign: 'center', marginTop: '4px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('LOGIN');
                            navigate('/login');
                          }}
                          style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                        >
                          Existing User? Sign In
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ---------------- CARD 2: Security & Password (Step 2 Next Card) ---------------- */}
                {registerStep === 2 && (
                  <div>
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Step 2 of 2
                      </div>
                      <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: '2px 0 0' }}>
                        Set Security Credentials
                      </h2>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                        Protect your account with a secure password.
                      </p>
                    </div>

                    {/* Verified User Details Pill */}
                    <div style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px'
                    }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>{name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {email} {mobile ? `• +91 ${mobile}` : ''}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRegisterStep(1)}
                        style={{
                          fontSize: '11px',
                          color: 'var(--primary-600)',
                          fontWeight: '700',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px 6px'
                        }}
                      >
                        Edit
                      </button>
                    </div>

                    <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* Password Input */}
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                          Create Password *
                        </label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '12px' }} />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create password (min 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoFocus
                            style={{
                              width: '100%',
                              padding: '10px 38px 10px 38px',
                              borderRadius: 'var(--radius-md)',
                              border: '1.5px solid var(--border-subtle)',
                              fontSize: '13px',
                              outline: 'none'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>

                        {/* Real-time Strength Meter */}
                        {password && (
                          <div style={{ marginTop: '5px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '2px' }}>
                              <span style={{ color: 'var(--text-secondary)' }}>Password Strength:</span>
                              <span style={{ color: strength.color, fontWeight: '700' }}>{strength.label}</span>
                            </div>
                            <div style={{ height: '3px', backgroundColor: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ width: `${strength.score}%`, height: '100%', backgroundColor: strength.color, transition: 'all 0.3s' }} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                          Confirm Password *
                        </label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '12px' }} />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{
                              width: '100%',
                              padding: '10px 38px 10px 38px',
                              borderRadius: 'var(--radius-md)',
                              border: confirmPassword && confirmPassword !== password ? '1.5px solid #EF4444' : '1.5px solid var(--border-subtle)',
                              fontSize: '13px',
                              outline: 'none'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {confirmPassword && confirmPassword !== password && (
                          <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: '600', marginTop: '2px', display: 'block' }}>
                            Passwords do not match
                          </span>
                        )}
                      </div>

                      {/* City / Delivery Pincode */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                            Delivery City
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Bengaluru"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-subtle)', fontSize: '13px' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                            PIN Code
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="e.g. 560038"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-subtle)', fontSize: '13px' }}
                          />
                        </div>
                      </div>

                      {/* CREATE ACCOUNT & AUTO SIGN IN */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary"
                        style={{ height: '44px', fontSize: '13px', fontWeight: '800', marginTop: '4px', justifyContent: 'center' }}
                      >
                        {isLoading ? 'Creating Account...' : 'CREATE ACCOUNT & SIGN IN →'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setRegisterStep(1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <ArrowLeft size={14} /> Back to Step 1
                      </button>
                    </form>
                  </div>
                )}

                {/* ---------------- CARD 3: Success Confirmation & Auto Login ---------------- */}
                {registerStep === 3 && (
                  <div style={{ textAlign: 'center', padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: '#DCFCE7',
                      color: '#166534',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)'
                    }}>
                      <CheckCircle2 size={36} />
                    </div>

                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 'var(--radius-full)', textTransform: 'uppercase' }}>
                        Account Verified
                      </span>
                      <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: '6px 0 2px' }}>
                        Welcome to Avero, {name.split(' ')[0]}!
                      </h2>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                        Your account has been created and signed in. Directing you to your shopping feed...
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-600)', fontSize: '12px', fontWeight: '700' }}>
                      <Sparkles size={15} /> ₹500 First Order Welcome Coupon Applied
                    </div>
                  </div>
                )}

              </div>
            ) : isForgotPassword ? (
              /* ================= FORGOT PASSWORD VIEW ================= */
              <div>
                {forgotSent ? (
                  <div style={{ textAlign: 'center', padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={26} />
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Password Reset Link Sent</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                      We have dispatched password recovery instructions to <strong>{forgotEmail}</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setForgotSent(false);
                        setAuthMode('LOGIN');
                      }}
                      className="btn btn-primary"
                      style={{ marginTop: '6px', height: '40px', width: '100%', fontSize: '13px', fontWeight: '700' }}
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 2px' }}>
                        Reset Password
                      </h2>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 12px' }}>
                        Enter your registered email to receive a recovery link.
                      </p>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                        Registered Email Address *
                      </label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Mail size={16} color="#64748B" style={{ position: 'absolute', left: '12px' }} />
                        <input
                          type="email"
                          placeholder="e.g. rohan@example.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          required
                          style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-subtle)', fontSize: '13px', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary"
                      style={{ height: '42px', fontSize: '13px', fontWeight: '700' }}
                    >
                      {isLoading ? 'Sending Reset Link...' : 'Send Password Reset Email'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', textAlign: 'center' }}
                    >
                      ← Back to Sign In
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* ================= SIGN IN VIEW ================= */
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                    Sign In to Your Account
                  </h2>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                    Access your orders, saved delivery addresses & wishlist.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
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
                        autoFocus
                        style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-subtle)', fontSize: '13px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        Password *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(email);
                          setIsForgotPassword(true);
                        }}
                        style={{ fontSize: '11px', color: 'var(--primary-600)', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Forgot Password?
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
                        style={{ width: '100%', padding: '10px 38px 10px 38px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-subtle)', fontSize: '13px', outline: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                    style={{ height: '44px', fontSize: '13px', fontWeight: '800', marginTop: '2px', justifyContent: 'center' }}
                  >
                    {isLoading ? 'Signing In...' : 'SIGN IN'}
                  </button>

                  {/* Divider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '1px 0' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-divider)' }} />
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '700' }}>OR</span>
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
                      border: '1.5px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      boxShadow: 'var(--shadow-xs)',
                      cursor: 'pointer'
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

                  {/* Switch to Register */}
                  <div style={{ textAlign: 'center', marginTop: '4px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('REGISTER');
                        setRegisterStep(1);
                        navigate('/register');
                      }}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      New to Avero? Create an account
                    </button>
                  </div>

                  {/* 1-Click RBAC Role Testing Bar */}
                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed #CBD5E1' }}>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
                      ⚡ 1-Click Role Testing Logins:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          loginWithEmail('rahul.customer@avero.in');
                          navigate('/account');
                        }}
                        style={{ padding: '7px 8px', borderRadius: '8px', border: '1px solid #BFDBFE', backgroundColor: '#EFF6FF', color: '#1D4ED8', fontSize: '11.5px', fontWeight: '800', cursor: 'pointer' }}
                      >
                        👤 Customer
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          loginWithEmail('karan.pending@avero.in');
                          navigate('/seller');
                        }}
                        style={{ padding: '7px 8px', borderRadius: '8px', border: '1px solid #FDE68A', backgroundColor: '#FEF3C7', color: '#B45309', fontSize: '11.5px', fontWeight: '800', cursor: 'pointer' }}
                      >
                        ⏳ Pending Seller
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          loginWithEmail('alex.seller@avero.in');
                          navigate('/seller');
                        }}
                        style={{ padding: '7px 8px', borderRadius: '8px', border: '1px solid #A7F3D0', backgroundColor: '#ECFDF5', color: '#047857', fontSize: '11.5px', fontWeight: '800', cursor: 'pointer' }}
                      >
                        📦 Approved Seller
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          loginWithEmail('admin@avero.in');
                          navigate('/admin');
                        }}
                        style={{ padding: '7px 8px', borderRadius: '8px', border: '1px solid #FECACA', backgroundColor: '#FEF2F2', color: '#B91C1C', fontSize: '11.5px', fontWeight: '800', cursor: 'pointer' }}
                      >
                        🛡️ Super Admin
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}
