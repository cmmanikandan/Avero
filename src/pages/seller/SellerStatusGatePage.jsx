import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Store,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  Home,
  RefreshCw
} from 'lucide-react';

export default function SellerStatusGatePage({ status = 'not_created' }) {
  const { user } = useApp();
  const navigate = useNavigate();

  // 1. NO PROFILE / NOT CREATED STATE
  if (status === 'not_created') {
    return (
      <div style={{ minHeight: '85vh', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '520px', width: '100%', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '36px 32px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '18px', backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Store size={30} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: '900', color: '#4F46E5', backgroundColor: '#EEF2FF', padding: '3px 10px', borderRadius: '9999px', textTransform: 'uppercase' }}>
            Seller Account Required
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: '950', color: '#0F172A', margin: '12px 0 6px' }}>
            Become an Avero Marketplace Seller
          </h2>
          <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.5, margin: '0 0 24px' }}>
            You are logged in as <strong>{user?.email || 'Customer'}</strong>. To access the Seller Central Dashboard and Data Mining Intelligence, register your merchant store profile.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link
              to="/become-seller"
              style={{
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontWeight: '800',
                fontSize: '13.5px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Start 5-Minute Seller Registration <ArrowRight size={16} />
            </Link>
            <Link
              to="/"
              style={{
                padding: '11px',
                borderRadius: '12px',
                backgroundColor: '#F1F5F9',
                color: '#475569',
                fontWeight: '700',
                fontSize: '13px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Home size={15} /> Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. PENDING APPROVAL STATE
  if (status === 'pending') {
    return (
      <div style={{ minHeight: '85vh', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '560px', width: '100%', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #FEF3C7', padding: '36px 32px', textAlign: 'center', boxShadow: '0 10px 30px rgba(245, 158, 11, 0.08)' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '18px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Clock size={30} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: '900', color: '#D97706', backgroundColor: '#FEF3C7', padding: '3px 10px', borderRadius: '9999px', textTransform: 'uppercase' }}>
            Application Under Review
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: '950', color: '#0F172A', margin: '12px 0 6px' }}>
            Seller KYC Verification in Progress
          </h2>
          <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.5, margin: '0 0 20px' }}>
            Your application for <strong>{user?.storeName || 'Your Store'}</strong> has been received and is currently being verified by the Avero Compliance Team.
          </p>

          {/* Milestone Step Tracker */}
          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '16px', marginBottom: '24px', textAlign: 'left', fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#059669', fontWeight: '800' }}>
              <CheckCircle2 size={16} /> 1. Merchant Details & Bank Details Submitted
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#D97706', fontWeight: '800' }}>
              <Clock size={16} /> 2. GSTIN & Tax Compliance Verification (Active)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94A3B8' }}>
              <Building2 size={16} /> 3. Final Admin Portal Activation (Pending)
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '12px',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontWeight: '800',
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={14} /> Check Status
            </button>
            <Link
              to="/"
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '12px',
                backgroundColor: '#F1F5F9',
                color: '#475569',
                fontWeight: '700',
                fontSize: '13px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Home size={15} /> Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. REJECTED STATE
  if (status === 'rejected') {
    return (
      <div style={{ minHeight: '85vh', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '520px', width: '100%', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #FECACA', padding: '36px 32px', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '18px', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <XCircle size={30} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: '900', color: '#DC2626', backgroundColor: '#FEE2E2', padding: '3px 10px', borderRadius: '9999px', textTransform: 'uppercase' }}>
            Application Not Approved
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: '950', color: '#0F172A', margin: '12px 0 6px' }}>
            Seller Application Rejected
          </h2>
          <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.5, margin: '0 0 24px' }}>
            Your seller registration could not be approved due to invalid GSTIN or tax document mismatch. You can review your details and re-apply.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link
              to="/become-seller"
              style={{
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                fontWeight: '800',
                fontSize: '13.5px',
                textDecoration: 'none'
              }}
            >
              Re-Apply as a Seller
            </Link>
            <Link to="/" style={{ padding: '11px', borderRadius: '12px', backgroundColor: '#F1F5F9', color: '#475569', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>
              Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. SUSPENDED STATE
  return (
    <div style={{ minHeight: '85vh', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '520px', width: '100%', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #FECACA', padding: '36px 32px', textAlign: 'center' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '18px', backgroundColor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <AlertTriangle size={30} />
        </div>
        <span style={{ fontSize: '11px', fontWeight: '900', color: '#DC2626', backgroundColor: '#FEE2E2', padding: '3px 10px', borderRadius: '9999px', textTransform: 'uppercase' }}>
          Account Suspended
        </span>
        <h2 style={{ fontSize: '22px', fontWeight: '950', color: '#0F172A', margin: '12px 0 6px' }}>
          Seller Access Suspended
        </h2>
        <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.5, margin: '0 0 24px' }}>
          This seller account has been temporarily suspended by marketplace administrators pending compliance review.
        </p>
        <Link to="/contact" style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#0F172A', color: '#FFFFFF', fontWeight: '800', fontSize: '13.5px', textDecoration: 'none', display: 'block' }}>
          Contact Marketplace Compliance
        </Link>
      </div>
    </div>
  );
}
