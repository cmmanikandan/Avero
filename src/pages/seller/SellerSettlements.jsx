import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  IndianRupee,
  Download,
  Building,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Filter,
  Calendar,
  CreditCard,
  FileSpreadsheet,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';

export default function SellerSettlements() {
  const { user, orders = [], showToast } = useApp();
  const [filterPeriod, setFilterPeriod] = useState('ALL');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const activeStoreName = user?.storeName || (user?.name ? `${user.name}'s Store` : '');

  const myOrders = orders.filter(o =>
    o.items?.some(it => 
      (activeStoreName && (it.seller === activeStoreName || it.brand === activeStoreName || it.seller?.name === activeStoreName)) ||
      (user?.email && (it.sellerEmail === user?.email || it.submittedBy === user?.email)) ||
      (user?.merchantId && it.merchantId === user?.merchantId)
    )
  );

  const SETTLEMENT_RECORDS = myOrders.map((ord, idx) => {
    const gross = ord.totalAmount || 0;
    const commission = Math.round(gross * 0.05);
    const gst = Math.round(commission * 0.18);
    const tds = Math.round(gross * 0.01);
    const net = gross - commission - gst - tds;
    const isSettled = ord.status === 'Delivered';

    return {
      id: `SET-${ord.id.slice(-4) || (1000 + idx)}`,
      orderId: ord.id,
      date: ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Today',
      gross,
      commission,
      gst,
      tds,
      net,
      status: isSettled ? 'SETTLED' : 'PROCESSING',
      payoutRef: isSettled ? `UTR${Date.now().toString().slice(-8)}${idx}` : 'Pending Clearing (T+2)'
    };
  });

  const [availableBalance, setAvailableBalance] = useState(() => {
    const saved = localStorage.getItem('avero_seller_settled_balance');
    if (saved !== null) return Number(saved);
    return SETTLEMENT_RECORDS.filter(r => r.status === 'SETTLED').reduce((sum, r) => sum + r.net, 0);
  });

  const processingRecords = SETTLEMENT_RECORDS.filter(r => r.status === 'PROCESSING');
  const escrowTotal = processingRecords.reduce((sum, r) => sum + r.net, 0);
  const settledRecords = SETTLEMENT_RECORDS.filter(r => r.status === 'SETTLED');
  const lifetimeSettled = settledRecords.reduce((sum, r) => sum + r.net, 0);

  const handleWithdraw = () => {
    if (availableBalance <= 0) {
      showToast('No balance available for withdrawal', 'warning');
      return;
    }
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      const amountWithdrawn = availableBalance;
      setAvailableBalance(0);
      try {
        localStorage.setItem('avero_seller_settled_balance', '0');
      } catch (_) {}
      showToast(`🎉 ₹${amountWithdrawn.toLocaleString('en-IN')} transferred via IMPS to HDFC Bank (Ref: UTR-${Date.now()})`, 'success');
    }, 1500);
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '20px 24px 60px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: '20px',
          padding: '24px 28px',
          color: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                • Live IMPS Automated Settlements
              </span>
              <h1 style={{ fontSize: '24px', fontWeight: '950', margin: '6px 0 2px', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={24} color="#10B981" /> Payouts & Settlement Ledger
              </h1>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
                All completed orders undergo automatic T+2 reconciliation with zero manual processing fees.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => showToast('Statement PDF generated for FY 2026-27', 'info')}
                style={{
                  height: '40px',
                  padding: '0 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={15} /> Export Statement (PDF)
              </button>
              <button
                type="button"
                disabled={isWithdrawing || availableBalance <= 0}
                onClick={handleWithdraw}
                className="btn btn-primary"
                style={{ height: '40px', padding: '0 20px', fontSize: '13px', fontWeight: '800', gap: '6px', backgroundColor: '#059669', borderColor: '#059669' }}
              >
                <Zap size={15} /> {isWithdrawing ? 'Processing...' : `Withdraw to Bank (₹${availableBalance.toLocaleString('en-IN')})`}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
          
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '16px 18px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Available for Payout</span>
            <div style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: '900', color: '#059669', marginTop: '4px' }}>
              ₹{availableBalance.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '10.5px', color: '#10B981', marginTop: '2px', fontWeight: '700' }}>
              ✓ Instant IMPS 24x7
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '18px 20px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>In Escrow / Processing</span>
            <div style={{ fontSize: '26px', fontWeight: '900', color: '#D97706', marginTop: '4px' }}>
              ₹{escrowTotal.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              {processingRecords.length} Orders clearing in T+2 return buffer
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '18px 20px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Lifetime Settled Revenue</span>
            <div style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginTop: '4px' }}>
              ₹{lifetimeSettled.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              {settledRecords.length + 180} total completed order dispatches
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '18px 20px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Verified Bank Account</span>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '6px' }}>
              HDFC Bank • • 9821
            </div>
            <div style={{ fontSize: '11px', color: '#059669', marginTop: '2px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <ShieldCheck size={13} /> Penny-drop Verified (IFSC: HDFC0001824)
            </div>
          </div>

        </div>

        {/* Ledger Table */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
              Order Settlement Transactions
            </div>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Showing recent 5 settlements</span>
          </div>

          <div className="no-scrollbar" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '12px 16px' }}>Settlement ID & Order</th>
                  <th style={{ padding: '12px 16px' }}>Date</th>
                  <th style={{ padding: '12px 16px' }}>Gross Order Value</th>
                  <th style={{ padding: '12px 16px' }}>Marketplace Fee (5%)</th>
                  <th style={{ padding: '12px 16px' }}>TDS & GST (18%)</th>
                  <th style={{ padding: '12px 16px' }}>Net Bank Payout</th>
                  <th style={{ padding: '12px 16px' }}>Status & UTR</th>
                </tr>
              </thead>
              <tbody>
                {SETTLEMENT_RECORDS.map((rec) => (
                  <tr key={rec.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <strong style={{ color: '#0F172A' }}>{rec.id}</strong>
                      <div style={{ fontSize: '11.5px', color: '#2563EB', marginTop: '2px' }}>
                        #{rec.orderId}
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px', color: '#475569' }}>
                      {rec.date}
                    </td>

                    <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0F172A' }}>
                      ₹{rec.gross.toLocaleString('en-IN')}
                    </td>

                    <td style={{ padding: '12px 16px', color: '#DC2626' }}>
                      - ₹{rec.commission.toLocaleString('en-IN')}
                    </td>

                    <td style={{ padding: '12px 16px', color: '#DC2626' }}>
                      - ₹{(rec.gst + rec.tds).toLocaleString('en-IN')}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <strong style={{ fontSize: '14px', color: '#059669' }}>
                        ₹{rec.net.toLocaleString('en-IN')}
                      </strong>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      {rec.status === 'SETTLED' ? (
                        <div>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: '800', color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 7px', borderRadius: '10px' }}>
                            <CheckCircle2 size={11} /> Settled
                          </span>
                          <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '3px', fontFamily: 'monospace' }}>
                            UTR: {rec.payoutRef}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: '800', color: '#92400E', backgroundColor: '#FEF3C7', padding: '2px 7px', borderRadius: '10px' }}>
                            <Clock size={11} /> In Escrow
                          </span>
                          <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '3px' }}>
                            {rec.payoutRef}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
