import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Phone,
  Mail,
  User,
  MapPin,
  FileText,
  Lock,
  Sparkles
} from 'lucide-react';

export default function DeliveryAuth() {
  const navigate = useNavigate();
  const { deliveryPartners, deliveryAgentUser, registerDeliveryPartner, loginDeliveryPartner, showToast } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loginIdentifier, setLoginIdentifier] = useState('+91 98450 12345');
  const [loginPin, setLoginPin] = useState('1234');

  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Karur',
    vehicleType: 'Motorcycle (Hero / Honda)',
    vehicleNumber: '',
    licenseNumber: ''
  });

  const [submittedPartner, setSubmittedPartner] = useState(null);

  // If already logged in as approved agent, direct to dashboard
  if (deliveryAgentUser?.isAuth) {
    navigate('/delivery');
    return null;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showToast('Please enter your registered phone number or email', 'error');
      return;
    }

    const res = loginDeliveryPartner(loginIdentifier.trim());
    if (res.success) {
      navigate('/delivery');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regForm.name.trim() || !regForm.phone.trim() || !regForm.licenseNumber.trim()) {
      showToast('Please fill all mandatory KYC fields (Name, Phone, Driving License)', 'error');
      return;
    }

    const partner = registerDeliveryPartner(regForm);
    setSubmittedPartner(partner);
  };

  const handleQuickLogin = (phone) => {
    setLoginIdentifier(phone);
    const res = loginDeliveryPartner(phone);
    if (res.success) {
      navigate('/delivery');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      color: '#0F172A',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Header - Clean Light Navbar */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/logo.png" alt="Avero" style={{ width: '32px', height: '32px' }} />
          <div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.3px' }}>
              Avero Logistics
            </div>
            <div style={{ fontSize: '11px', color: '#0284C7', fontWeight: '800', textTransform: 'uppercase' }}>
              Delivery Partner Fleet Portal
            </div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px' }}>
          <Link to="/" style={{ color: '#64748B', textDecoration: 'none', fontWeight: '600' }}>← Customer Marketplace</Link>
          <Link to="/seller" style={{ color: '#64748B', textDecoration: 'none', fontWeight: '600' }}>Seller Central</Link>
        </div>
      </header>

      {/* Main Container */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.07)',
          overflow: 'hidden'
        }}>
          {/* Header Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #1366E2 0%, #0284C7 100%)',
            padding: '24px',
            textAlign: 'center',
            color: '#FFFFFF'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              color: '#FFFFFF'
            }}>
              <Truck size={28} />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '900', margin: 0, color: '#FFFFFF' }}>
              {mode === 'login' ? 'Delivery Partner Login' : 'Join Delivery Fleet'}
            </h1>
            <p style={{ fontSize: '13px', color: '#E0F2FE', marginTop: '6px', margin: 0 }}>
              Deliver verified orders from sellers to customers with high-speed OTP payouts
            </p>
          </div>

          {/* Pending Approval Notice if just registered */}
          {submittedPartner ? (
            <div style={{ padding: '32px 24px', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Clock size={34} />
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Application Submitted!
              </h2>
              <div style={{
                display: 'inline-block',
                marginTop: '8px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#FEF3C7',
                color: '#B45309',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                Status: PENDING ADMIN APPROVAL
              </div>

              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '14px', lineHeight: '1.5' }}>
                Thank you, <strong>{submittedPartner.name}</strong>. Your KYC details and driving license (<strong>{submittedPartner.licenseNumber}</strong>) are currently under verification by the Avero Admin team.
              </p>

              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'left',
                fontSize: '12px',
                color: '#334155',
                marginTop: '16px',
                border: '1px solid #E2E8F0'
              }}>
                <div style={{ fontWeight: '700', color: '#0284C7', marginBottom: '4px' }}>💡 How to test approval immediately:</div>
                Go to the <Link to="/admin" style={{ color: '#2563EB', textDecoration: 'underline', fontWeight: '700' }}>Admin Panel → Delivery Carriers</Link> tab and click <strong>"Approve Agent"</strong> to activate this account in 1 click!
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmittedPartner(null);
                  setMode('login');
                }}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '20px', height: '44px' }}
              >
                Back to Login
              </button>
            </div>
          ) : (
            <div style={{ padding: '24px' }}>
              {/* Tab Selector */}
              <div style={{
                display: 'flex',
                backgroundColor: '#F1F5F9',
                borderRadius: '10px',
                padding: '4px',
                marginBottom: '20px'
              }}>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: mode === 'login' ? '#1366E2' : 'transparent',
                    color: mode === 'login' ? '#FFFFFF' : '#475569',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: mode === 'login' ? '0 2px 6px rgba(19, 102, 226, 0.25)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Partner Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: mode === 'register' ? '#1366E2' : 'transparent',
                    color: mode === 'register' ? '#FFFFFF' : '#475569',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: mode === 'register' ? '0 2px 6px rgba(19, 102, 226, 0.25)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  New Registration
                </button>
              </div>

              {/* Login Form */}
              {mode === 'login' ? (
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '6px' }}>
                      Registered Mobile Number / Partner Email
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="+91 98450 12345 or email"
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 38px',
                          borderRadius: '8px',
                          border: '1.5px solid #CBD5E1',
                          backgroundColor: '#FFFFFF',
                          color: '#0F172A',
                          fontSize: '14px',
                          outline: 'none',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '6px' }}>
                      4-Digit Security PIN
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                      <input
                        type="password"
                        maxLength={4}
                        value={loginPin}
                        onChange={(e) => setLoginPin(e.target.value)}
                        placeholder="••••"
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 38px',
                          borderRadius: '8px',
                          border: '1.5px solid #CBD5E1',
                          backgroundColor: '#FFFFFF',
                          color: '#0F172A',
                          fontSize: '14px',
                          letterSpacing: '4px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ height: '46px', fontSize: '15px', fontWeight: '800', width: '100%', marginTop: '6px' }}
                  >
                    Enter Delivery Dashboard <ArrowRight size={17} />
                  </button>
                </form>
              ) : (
                /* Registration Form */
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandran"
                      value={regForm.name}
                      onChange={(e) => setRegForm(prev => ({ ...prev, name: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1.5px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '13px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={regForm.phone}
                        onChange={(e) => setRegForm(prev => ({ ...prev, phone: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1.5px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="agent@gmail.com"
                        value={regForm.email}
                        onChange={(e) => setRegForm(prev => ({ ...prev, email: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1.5px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Service City / Hub *
                      </label>
                      <input
                        type="text"
                        required
                        value={regForm.city}
                        onChange={(e) => setRegForm(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Karur / Bangalore"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1.5px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Vehicle Type *
                      </label>
                      <select
                        value={regForm.vehicleType}
                        onChange={(e) => setRegForm(prev => ({ ...prev, vehicleType: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1.5px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '13px' }}
                      >
                        <option value="Motorcycle (Petrol)">Motorcycle (Petrol)</option>
                        <option value="Electric Scooter (EV)">Electric Scooter (EV)</option>
                        <option value="Delivery Van / 3-Wheeler">Delivery Van / 3-Wheeler</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Vehicle Reg. No *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="TN 47 AQ 8921"
                        value={regForm.vehicleNumber}
                        onChange={(e) => setRegForm(prev => ({ ...prev, vehicleNumber: e.target.value.toUpperCase() }))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1.5px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Driving License No *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="DL-TN47-202200192"
                        value={regForm.licenseNumber}
                        onChange={(e) => setRegForm(prev => ({ ...prev, licenseNumber: e.target.value.toUpperCase() }))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1.5px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ height: '44px', fontSize: '14px', fontWeight: '800', width: '100%', marginTop: '6px' }}
                  >
                    Submit KYC Application for Admin Approval
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
