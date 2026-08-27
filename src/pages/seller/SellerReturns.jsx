import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function SellerReturns() {
  const { showToast } = useApp();

  const [returnRequests, setReturnRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('avero_seller_returns');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  const handleApprove = (id) => {
    setReturnRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
    showToast(`Return request #${id} Approved. Doorstep pickup scheduled.`, 'success');
  };

  const handleReject = (id) => {
    setReturnRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
    showToast(`Return request #${id} Rejected.`, 'info');
  };

  return (
    <div className="container" style={{ paddingBottom: '60px', paddingTop: '20px' }}>
      {/* Header Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '16px 20px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RotateCcw size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              Returns & Refund Claim Management ({returnRequests.length})
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Inspect return requests, verify product condition reasons, and authorize customer refunds
            </p>
          </div>
        </div>
      </div>

      {returnRequests.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '48px 20px', textAlign: 'center', color: '#64748B' }}>
          <RotateCcw size={40} color="#94A3B8" style={{ marginBottom: '10px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px' }}>No Return Requests</h3>
          <p style={{ fontSize: '13px', margin: 0, color: '#64748B' }}>When customers initiate return or replacement requests, they will appear here for verification.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {returnRequests.map(req => (
          <div
            key={req.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-divider)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary-700)' }}>
                  Request #{req.id}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Order: #{req.orderId} • Buyer: {req.customerName}
                </span>
              </div>

              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: req.status === 'APPROVED' ? '#DCFCE7' : req.status === 'REJECTED' ? '#FEE2E2' : '#FEF3C7',
                color: req.status === 'APPROVED' ? '#166534' : req.status === 'REJECTED' ? '#991B1B' : '#92400E'
              }}>
                {req.status}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <img src={req.image} alt={req.productName} style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{req.productName}</strong>
                <div style={{ fontSize: '13px', color: '#B91C1C', marginTop: '4px' }}>
                  <strong>Customer Reason:</strong> {req.reason}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  <strong>Claimed Condition:</strong> {req.condition}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-price)', marginTop: '4px' }}>
                  Refund Value: ₹{req.amount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {req.status === 'PENDING' && (
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-divider)', paddingTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleReject(req.id)}
                  className="btn btn-destructive"
                  style={{ padding: '6px 14px', fontSize: '12px', minHeight: '34px' }}
                >
                  <XCircle size={14} /> Reject Claim
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(req.id)}
                  className="btn btn-primary"
                  style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px', backgroundColor: '#10B981', borderColor: '#10B981' }}
                >
                  <CheckCircle2 size={14} /> Approve Return & Refund
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
