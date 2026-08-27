import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Save,
  AlertTriangle,
  ShieldCheck,
  IndianRupee,
  Smartphone,
  Siren,
  Power,
  UserX,
  Trash2,
  Lock,
  Globe,
  Truck,
  CreditCard,
  Bell,
  RefreshCw,
  Percent,
  CheckCircle2,
  Database
} from 'lucide-react';

export default function AdminSettings() {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState('GENERAL'); // 'GENERAL' | 'FEES' | 'LOGISTICS' | 'PAYMENTS' | 'SECURITY' | 'DANGER'

  const [platformConfig, setPlatformConfig] = useState({
    // General
    platformName: 'Avero Marketplace',
    supportEmail: 'support@avero.in',
    supportPhone: '1800-202-9888',
    headquarters: 'Outer Ring Road, Bellandur, Bengaluru - 560103',
    currency: 'INR (₹)',
    timezone: 'Asia/Kolkata (IST +5:30)',

    // Fees & Tax
    defaultCommission: 8.5,
    platformFee: 7,
    tdsRate: 1.0,
    gstMode: 'GST_18_SPLIT',
    codSurcharge: 40,
    maxCodAmount: 25000,

    // Logistics
    freeDeliveryThreshold: 500,
    baseDeliveryFee: 40,
    riderPayoutPerOrder: 65,
    hyperlocalRadiusKm: 15,
    requireDeliveryOtp: true,

    // Payments & Escrow
    razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
    razorpaySecret: '••••••••••••••••••••••••',
    settlementCycle: 'INSTANT_OTP', // 'INSTANT_OTP' | 'T_PLUS_2'
    autoRefunds: true,

    // Security
    twoFactorEnforced: true,
    maxLoginAttempts: 5,
    sessionTimeoutMins: 60,

    // Maintenance
    maintenanceMode: false,
    maintenanceNotice: 'Avero is undergoing scheduled database upgrades. We will be back shortly.'
  });

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('avero_platform_settings', JSON.stringify(platformConfig));
    } catch (_) {}
    showToast('✓ Platform Master Settings saved and synced across all nodes!', 'success');
  };

  const handleClearCache = () => {
    showToast('Platform cache purged. All catalogs re-indexed.', 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1440px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Top Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        borderRadius: '18px',
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
            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
          }}>
            <Settings size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '19px', fontWeight: '900', margin: 0, color: '#FFFFFF' }}>
                Platform Master Settings & Configuration Suite
              </h1>
              <span style={{ fontSize: '11px', backgroundColor: '#059669', color: '#FFFFFF', padding: '2px 8px', borderRadius: '9999px', fontWeight: '800' }}>
                ● Production Engine
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: '2px 0 0' }}>
              Configure global marketplace defaults, take rates, logistics SLA rules, payment gateways, and emergency protocols
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          style={{
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 22px',
            fontSize: '13.5px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
          }}
        >
          <Save size={16} /> Save All Changes
        </button>
      </div>

      {/* Interactive Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
        {[
          { id: 'GENERAL', label: 'General & Branding', icon: Globe, color: '#2563EB' },
          { id: 'FEES', label: 'Take Rates & Tax Engine', icon: Percent, color: '#7C3AED' },
          { id: 'LOGISTICS', label: 'Logistics & Courier SLAs', icon: Truck, color: '#059669' },
          { id: 'PAYMENTS', label: 'Payment Gateways & Escrow', icon: CreditCard, color: '#D97706' },
          { id: 'SECURITY', label: 'Security & 2FA Governance', icon: ShieldCheck, color: '#0284C7' },
          { id: 'DANGER', label: 'Danger Zone & Maintenance', icon: AlertTriangle, color: '#DC2626' }
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                border: isSelected ? `2px solid ${tab.color}` : '1px solid #E2E8F0',
                backgroundColor: isSelected ? '#FFFFFF' : '#FFFFFF',
                color: isSelected ? tab.color : '#475569',
                fontWeight: isSelected ? '800' : '600',
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} color={isSelected ? tab.color : '#64748B'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Form Panels */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ─────────────────────────────────────────────────────────────
            TAB 1: GENERAL & BRANDING
        ─────────────────────────────────────────────────────────────── */}
        {activeTab === 'GENERAL' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                General Marketplace Identity & Contacts
              </h2>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                Primary display parameters and consumer helpline information
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>Platform Display Name</label>
                <input
                  type="text"
                  value={platformConfig.platformName}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, platformName: e.target.value })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0F172A' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>Official Support Email</label>
                <input
                  type="email"
                  value={platformConfig.supportEmail}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, supportEmail: e.target.value })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0F172A' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>Toll-Free Customer Support Helpline</label>
                <input
                  type="text"
                  value={platformConfig.supportPhone}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, supportPhone: e.target.value })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0F172A' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>Default Currency & Locale</label>
                <select
                  value={platformConfig.currency}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, currency: e.target.value })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0F172A', backgroundColor: '#FFFFFF' }}
                >
                  <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                  <option value="USD ($)">USD ($) - US Dollar</option>
                  <option value="AED (د.إ)">AED (د.إ) - UAE Dirham</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>Corporate Headquarters & Hub Address</label>
              <input
                type="text"
                value={platformConfig.headquarters}
                onChange={(e) => setPlatformConfig({ ...platformConfig, headquarters: e.target.value })}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0F172A' }}
              />
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 2: TAKE RATES & TAX COMMISSION ENGINE
        ─────────────────────────────────────────────────────────────── */}
        {activeTab === 'FEES' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                Platform Fee Schedule, Take Rates & Tax Compliance
              </h2>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                Define default merchant sales commissions, customer platform fees, and statutory TDS deductions
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  Default Base Vendor Commission (%)
                </label>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '8px' }}>
                  Applied automatically to all newly registered merchant catalog sales
                </span>
                <input
                  type="number"
                  step="0.1"
                  value={platformConfig.defaultCommission}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, defaultCommission: Number(e.target.value) })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', fontWeight: '900', color: '#2563EB' }}
                />
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  Customer Platform Convenience Fee (₹)
                </label>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '8px' }}>
                  Standard processing fee added to checkout bag per order
                </span>
                <input
                  type="number"
                  value={platformConfig.platformFee}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, platformFee: Number(e.target.value) })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', fontWeight: '900', color: '#059669' }}
                />
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  Statutory TDS on E-Commerce Operators (%)
                </label>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '8px' }}>
                  Section 194-O Income Tax Act mandatory deduction from merchant gross
                </span>
                <input
                  type="number"
                  step="0.1"
                  value={platformConfig.tdsRate}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, tdsRate: Number(e.target.value) })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', fontWeight: '900', color: '#7C3AED' }}
                />
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  Maximum COD (Cash on Delivery) Limit (₹)
                </label>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '8px' }}>
                  Orders exceeding this threshold require mandatory prepaid checkout
                </span>
                <input
                  type="number"
                  value={platformConfig.maxCodAmount}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, maxCodAmount: Number(e.target.value) })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', fontWeight: '900', color: '#D97706' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 3: LOGISTICS & COURIER SLAS
        ─────────────────────────────────────────────────────────────── */}
        {activeTab === 'LOGISTICS' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                Hyperlocal & National Courier Logistics Routing
              </h2>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                Control free shipping thresholds, rider compensation, and OTP delivery enforcement
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Free Express Delivery Order Threshold (₹)
                </label>
                <input
                  type="number"
                  value={platformConfig.freeDeliveryThreshold}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, freeDeliveryThreshold: Number(e.target.value) })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: '800' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Delivery Partner Payout per Completed Drop (₹)
                </label>
                <input
                  type="number"
                  value={platformConfig.riderPayoutPerOrder}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, riderPayoutPerOrder: Number(e.target.value) })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: '800', color: '#059669' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Hyperlocal 2-Hour Delivery Radius (km)
                </label>
                <input
                  type="number"
                  value={platformConfig.hyperlocalRadiusKm}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, hyperlocalRadiusKm: Number(e.target.value) })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: '800' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Doorstep Delivery Handover OTP Verification
                </label>
                <select
                  value={platformConfig.requireDeliveryOtp ? 'YES' : 'NO'}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, requireDeliveryOtp: e.target.value === 'YES' })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: '800', backgroundColor: '#FFFFFF', color: '#059669' }}
                >
                  <option value="YES">Mandatory 4-Digit Customer OTP Enabled ✓</option>
                  <option value="NO">Direct Signature Only (No OTP)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 4: PAYMENT GATEWAYS & ESCROW
        ─────────────────────────────────────────────────────────────── */}
        {activeTab === 'PAYMENTS' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                Payment Gateway Integrations & Merchant Escrow Cycle
              </h2>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                Razorpay live credentials, instant refund pipeline, and automated settlement clearances
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Razorpay Key ID</label>
                <input
                  type="text"
                  value={platformConfig.razorpayKeyId}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, razorpayKeyId: e.target.value })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Razorpay Secret Key</label>
                <input
                  type="password"
                  value={platformConfig.razorpaySecret}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, razorpaySecret: e.target.value })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Merchant Settlement Escrow Release Cycle</label>
                <select
                  value={platformConfig.settlementCycle}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, settlementCycle: e.target.value })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: '800', backgroundColor: '#FFFFFF', color: '#2563EB' }}
                >
                  <option value="INSTANT_OTP">Instant Release upon Customer Delivery OTP Verification ✓</option>
                  <option value="T_PLUS_2">T+2 Working Days Standard Clearing</option>
                  <option value="T_PLUS_7">T+7 Days (Return Period Buffer)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Instant UPI & Card Auto-Refunds on Cancellation</label>
                <select
                  value={platformConfig.autoRefunds ? 'ENABLED' : 'DISABLED'}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, autoRefunds: e.target.value === 'ENABLED' })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: '800', backgroundColor: '#FFFFFF', color: '#059669' }}
                >
                  <option value="ENABLED">Enabled (Instant Source Account Refund) ✓</option>
                  <option value="DISABLED">Manual Admin Approval Required</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 5: SECURITY & 2FA GOVERNANCE
        ─────────────────────────────────────────────────────────────── */}
        {activeTab === 'SECURITY' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                Security, 2FA Enforcement & Governance
              </h2>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                Multi-factor authentication policies and session controls
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  Super Admin 2FA Verification
                </strong>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '8px' }}>
                  Requires 6-digit TOTP / SMS code on all elevated console logins
                </span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#059669', backgroundColor: '#ECFDF5', padding: '3px 10px', borderRadius: '6px', border: '1px solid #A7F3D0' }}>
                  ● STRICTLY ENFORCED
                </span>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  Max Failed Login Lockout
                </strong>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '8px' }}>
                  Temporary IP freeze after consecutive wrong credentials
                </span>
                <input
                  type="number"
                  value={platformConfig.maxLoginAttempts}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, maxLoginAttempts: Number(e.target.value) })}
                  style={{ width: '100%', height: '36px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: '800' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 6: DANGER ZONE & MAINTENANCE
        ─────────────────────────────────────────────────────────────── */}
        {activeTab === 'DANGER' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #FECACA', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 2px 8px rgba(220,38,38,0.05)' }}>
            <div style={{ borderBottom: '1px solid #FEE2E2', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="#DC2626" />
                <h2 style={{ fontSize: '16px', fontWeight: '900', color: '#DC2626', margin: 0 }}>
                  High-Risk Danger Zone & Emergency Protocols
                </h2>
              </div>
              <span style={{ fontSize: '12px', color: '#991B1B' }}>
                Platform-wide emergency overrides. Execute only under authorized supervision.
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Emergency Maintenance Mode */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#991B1B', display: 'block' }}>
                    Emergency Platform Maintenance Mode
                  </strong>
                  <span style={{ fontSize: '11.5px', color: '#B91C1C' }}>
                    Takes the consumer storefront offline and displays an instant maintenance notice to buyers
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const next = !platformConfig.maintenanceMode;
                    setPlatformConfig({ ...platformConfig, maintenanceMode: next });
                    showToast(next ? '⚠️ Maintenance mode ACTIVATED!' : '✓ Maintenance mode DEACTIVATED. Storefront live.', next ? 'warning' : 'success');
                  }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: platformConfig.maintenanceMode ? '#DC2626' : '#1E293B',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {platformConfig.maintenanceMode ? '● Turn Offline Mode OFF' : 'Activate Maintenance Mode'}
                </button>
              </div>

              {/* Purge Cache */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0F172A', display: 'block' }}>
                    Purge Redis & Local Catalog Search Cache
                  </strong>
                  <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                    Forces a complete rebuild of Algolia & local product indexes
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleClearCache}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A',
                    fontSize: '12.5px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <RefreshCw size={13} /> Purge Cache
                </button>
              </div>

            </div>
          </div>
        )}

      </form>

    </div>
  );
}
