import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Users,
  Store,
  IndianRupee,
  Package,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Settings,
  Tag,
  Layers,
  Percent
} from 'lucide-react';

export default function SuperAdminPanel() {
  const { showToast } = useApp();

  const [pendingSellers, setPendingSellers] = useState(() => {
    try {
      const saved = localStorage.getItem('avero_seller_applications');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  const [commissionRate, setCommissionRate] = useState(8.5);

  const handleApproveSeller = (id) => {
    setPendingSellers(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, status: 'APPROVED' } : s);
      try {
        localStorage.setItem('avero_seller_applications', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    showToast(`Seller #${id} KYC Approved & Activated`, 'success');
  };

  const handleRejectSeller = (id) => {
    setPendingSellers(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, status: 'REJECTED' } : s);
      try {
        localStorage.setItem('avero_seller_applications', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    showToast(`Seller #${id} KYC Application Rejected`, 'info');
  };

  return (
    <div className="container" style={{ paddingBottom: '60px', paddingTop: '20px' }}>
      {/* Top Admin Header */}
      <div style={{
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: '#10B981', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>
              Avero Super Admin Governance Center
            </h1>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>
              Platform Master Console • Version 2.4.0 Production
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>Commission:</span>
          <span style={{ backgroundColor: '#ffffff', padding: '4px 10px', borderRadius: 'var(--radius-xs)', fontSize: '13px', fontWeight: '700', color: '#10B981' }}>
            {commissionRate}% Standard
          </span>
        </div>
      </div>

      {/* High-Level Platform Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '20px'
      }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>GROSS MERCHANDISE VALUE (GMV)</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-price)', marginTop: '4px' }}>
            ₹1.48 Crore
          </div>
          <span style={{ fontSize: '11px', color: 'var(--savings-green)', fontWeight: '600' }}>↑ +28.4% this month</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>ACTIVE REGISTERED USERS</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-price)', marginTop: '4px' }}>
            84,290
          </div>
          <span style={{ fontSize: '11px', color: 'var(--primary-600)', fontWeight: '600' }}>+1,200 today</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>VERIFIED MERCHANTS</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-price)', marginTop: '4px' }}>
            1,420 Sellers
          </div>
          <span style={{ fontSize: '11px', color: '#D97706', fontWeight: '600' }}>2 pending KYC</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>PLATFORM COMMISSION REVENUE</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#10B981', marginTop: '4px' }}>
            ₹14.82 Lakhs
          </div>
          <span style={{ fontSize: '11px', color: 'var(--savings-green)', fontWeight: '600' }}>Healthy margin</span>
        </div>
      </div>

      {/* Seller KYC Verification Queue */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Store size={18} color="var(--primary-600)" /> Merchant KYC Approval Pipeline
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pendingSellers.map(seller => (
            <div
              key={seller.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#F8FAFC',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{seller.businessName}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>({seller.category})</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Owner: {seller.ownerName} • GSTIN: <strong>{seller.gstin}</strong> • Applied: {seller.date}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {seller.status === 'PENDING' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleApproveSeller(seller.id)}
                      className="btn btn-primary"
                      style={{ padding: '6px 14px', fontSize: '12px', minHeight: '34px', backgroundColor: '#10B981', borderColor: '#10B981' }}
                    >
                      <CheckCircle2 size={14} /> Approve Store
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectSeller(seller.id)}
                      className="btn btn-destructive"
                      style={{ padding: '6px 12px', fontSize: '12px', minHeight: '34px' }}
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                ) : (
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: seller.status === 'APPROVED' ? '#15803D' : '#DC2626',
                    backgroundColor: seller.status === 'APPROVED' ? '#DCFCE7' : '#FEE2E2',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-xs)'
                  }}>
                    {seller.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Catalog & Quality Assurance Overview */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '20px'
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
          Catalog & Quality Assured Verification
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Total active live listings: <strong>{PRODUCTS.length}</strong> items across 10 categories. 100% verified with manufacturer genuine batch codes.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: '160px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Avero Assured Ratio</div>
            <strong style={{ fontSize: '16px', color: 'var(--primary-700)' }}>100% Verified</strong>
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: '160px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Average Dispatch SLA</div>
            <strong style={{ fontSize: '16px', color: 'var(--savings-green)' }}>18.4 Hours</strong>
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: '160px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Return / Dispute Rate</div>
            <strong style={{ fontSize: '16px', color: 'var(--text-primary)' }}>0.8% (Industry Low)</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
