import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { supabaseService } from '../../services/supabase';
import { Store, CheckCircle2, XCircle, FileText, ShieldCheck, AlertCircle, Building, Phone, Mail, MapPin, Check, X, AlertTriangle } from 'lucide-react';

const INITIAL_APPLICATIONS = [];

export default function AdminSellerApprovals() {
  const { showToast, user, setUser } = useApp();

  const [sellers, setSellers] = useState(() => {
    try {
      const saved = localStorage.getItem('avero_seller_applications');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    supabaseService.getSellers().then(liveSellers => {
      if (liveSellers && liveSellers.length > 0) {
        setSellers(liveSellers);
        localStorage.setItem('avero_seller_applications', JSON.stringify(liveSellers));
      }
    }).catch(console.warn);
  }, []);

  const saveApplications = (newList) => {
    setSellers(newList);
    try {
      localStorage.setItem('avero_seller_applications', JSON.stringify(newList));
    } catch (_) {}
  };

  const handleApprove = (id, name) => {
    const updated = sellers.map(s => s.id === id ? { ...s, status: 'APPROVED' } : s);
    saveApplications(updated);
    supabaseService.updateSellerStatus(id, 'APPROVED').catch(console.warn);

    // If current logged-in user is this seller, upgrade their status
    if (user?.role === 'customer' || user?.sellerStatus === 'pending') {
      const matchedSeller = sellers.find(s => s.id === id);
      if (matchedSeller && (matchedSeller.email === user.email || matchedSeller.businessName === name)) {
        const upgraded = {
          ...user,
          role: 'seller',
          sellerStatus: 'approved',
          merchantId: id
        };
        setUser(upgraded);
        try {
          localStorage.setItem('avero_user', JSON.stringify(upgraded));
          localStorage.setItem('avero_role', 'seller');
        } catch (_) {}
      }
    }

    showToast(`✓ Store '${name}' KYC Verified & Approved! Merchant can now access Seller Panel.`, 'success');
  };

  const handleReject = (id, name) => {
    const updated = sellers.map(s => s.id === id ? { ...s, status: 'REJECTED' } : s);
    saveApplications(updated);

    try {
      const savedProfile = JSON.parse(localStorage.getItem('avero_seller_profile') || '{}');
      if (savedProfile.storeName?.toLowerCase() === name.toLowerCase() || savedProfile.merchantId === id) {
        savedProfile.status = 'rejected';
        localStorage.setItem('avero_seller_profile', JSON.stringify(savedProfile));
      }
    } catch (_) {}

    showToast(`✕ KYC Application for '${name}' rejected.`, 'info');
  };

  const handleSuspend = (id, name) => {
    const updated = sellers.map(s => s.id === id ? { ...s, status: 'SUSPENDED' } : s);
    saveApplications(updated);

    try {
      const savedProfile = JSON.parse(localStorage.getItem('avero_seller_profile') || '{}');
      if (savedProfile.storeName?.toLowerCase() === name.toLowerCase() || savedProfile.merchantId === id) {
        savedProfile.status = 'suspended';
        localStorage.setItem('avero_seller_profile', JSON.stringify(savedProfile));
      }
    } catch (_) {}

    showToast(`⚠️ Store '${name}' suspended from selling.`, 'warning');
  };

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
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
          }}>
            <Store size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '19px', fontWeight: '900', margin: 0, color: '#FFFFFF' }}>
              Merchant Onboarding & KYC Document Approvals
            </h1>
            <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: '2px 0 0' }}>
              Verify GSTIN tax validity, PAN credentials, and settlement bank accounts before unlocking Seller Panel access
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ fontSize: '12px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '4px 12px', borderRadius: '9999px', fontWeight: '800' }}>
            {sellers.filter(s => s.status === 'PENDING').length} Pending Verifications
          </span>
        </div>
      </div>

      {/* Seller KYC Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sellers.map(s => (
          <div
            key={s.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: s.status === 'PENDING' ? '1px solid #FDE68A' : s.status === 'APPROVED' ? '1px solid #A7F3D0' : '1px solid #FECACA',
              padding: '22px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                    {s.businessName}
                  </h3>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: s.status === 'APPROVED' ? '#ECFDF5' : s.status === 'PENDING' ? '#FEF3C7' : '#FEE2E2',
                    color: s.status === 'APPROVED' ? '#059669' : s.status === 'PENDING' ? '#D97706' : '#DC2626'
                  }}>
                    {s.status}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Owner: <strong>{s.ownerName}</strong> • Applied: {s.date} • Application ID: {s.id}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {s.status !== 'APPROVED' && (
                  <button
                    type="button"
                    onClick={() => handleApprove(s.id, s.businessName)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      backgroundColor: '#059669',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Check size={14} /> Approve Application
                  </button>
                )}

                {s.status === 'PENDING' && (
                  <button
                    type="button"
                    onClick={() => handleReject(s.id, s.businessName)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <X size={14} /> Reject
                  </button>
                )}

                {s.status === 'APPROVED' && (
                  <button
                    type="button"
                    onClick={() => handleSuspend(s.id, s.businessName)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      backgroundColor: '#F59E0B',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <AlertTriangle size={13} /> Suspend Seller
                  </button>
                )}
              </div>
            </div>

            {/* Document Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', fontSize: '12px' }}>
              <div><span style={{ color: '#64748B' }}>GSTIN Number:</span> <strong style={{ color: '#0F172A', display: 'block' }}>{s.gstin}</strong></div>
              <div><span style={{ color: '#64748B' }}>PAN Number:</span> <strong style={{ color: '#0F172A', display: 'block' }}>{s.pan}</strong></div>
              <div><span style={{ color: '#64748B' }}>Settlement Bank:</span> <strong style={{ color: '#0F172A', display: 'block' }}>{s.bankAccount}</strong></div>
              <div><span style={{ color: '#64748B' }}>Category:</span> <strong style={{ color: '#0F172A', display: 'block' }}>{s.category}</strong></div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
