
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, ArrowUpRight, ArrowDownLeft, CheckCircle2, Clock, X, Search, RefreshCw } from 'lucide-react';

export default function AdminPayments() {
  const { orders = [], showToast } = useApp();
  const [search, setSearch] = useState('');

  const totalGMV = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingPayouts = orders.filter(o => o.status !== 'Delivered').reduce((sum, o) => sum + Math.round((o.totalAmount || 0) * 0.915), 0);
  const processedPayouts = orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + Math.round((o.totalAmount || 0) * 0.915), 0);

  const TXN_LOG = orders.map(ord => ({
    id: `TXN-${ord.id.slice(-5)}`,
    type: 'ORDER',
    customer: ord.deliveryAddress?.name || ord.buyerName || 'Customer',
    amount: ord.totalAmount || 0,
    status: ord.paymentStatus || 'SUCCESS',
    gateway: ord.paymentMethod || 'Razorpay UPI',
    time: ord.createdAt ? new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'
  }));

  const [settlements, setSettlements] = useState(() => {
    return orders.map((ord, idx) => {
      const gmv = ord.totalAmount || 0;
      const commission = Math.round(gmv * 0.085);
      const netPayout = gmv - commission;
      const isPaid = ord.status === 'Delivered';
      const sellerName = ord.items?.[0]?.seller || ord.items?.[0]?.brand || 'Merchant Direct';

      return {
        id: `SET-${ord.id.slice(-4) || (1000 + idx)}`,
        seller: sellerName,
        gmv,
        commission,
        netPayout,
        status: isPaid ? 'PAID' : 'PENDING',
        dueDate: isPaid ? 'Paid' : 'Pending Delivery Confirmation',
        method: 'NEFT'
      };
    });
  });

  const triggerPayout = (id, seller, amount) => {
    setSettlements(p => p.map(s => s.id === id ? { ...s, status: 'PAID', dueDate: 'Paid ' + new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) } : s));
    showToast('NEFT settlement of ₹' + amount.toLocaleString('en-IN') + ' processed for ' + seller, 'success');
  };

  const filtered = settlements.filter(s => !search || s.seller.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0F172A' }}>Payments & Settlements</h1>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0' }}>Gateway transactions, Razorpay dashboard, escrow & vendor NEFT payouts</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
        {[
          { label: 'Total GMV', value: totalGMV >= 100000 ? `₹${(totalGMV / 100000).toFixed(2)}L` : `₹${totalGMV.toLocaleString('en-IN')}`, color: '#2563EB' },
          { label: 'Pending Payouts', value: pendingPayouts >= 100000 ? `₹${(pendingPayouts / 100000).toFixed(2)}L` : `₹${pendingPayouts.toLocaleString('en-IN')}`, color: '#EA580C' },
          { label: 'Processed Payouts', value: processedPayouts >= 100000 ? `₹${(processedPayouts / 100000).toFixed(2)}L` : `₹${processedPayouts.toLocaleString('en-IN')}`, color: '#16A34A' },
          { label: 'Escrow Reserve', value: `₹${(totalGMV - processedPayouts).toLocaleString('en-IN')}`, color: '#7C3AED' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px 18px' }}>
            <div style={{ fontSize: '20px', fontWeight: '800', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>Live Transaction Feed</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                {['Txn ID', 'Type', 'Customer', 'Amount', 'Gateway', 'Time', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TXN_LOG.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '11px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#2563EB', fontWeight: '700' }}>{t.id}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: t.type === 'REFUND' ? '#FEF3C7' : '#EFF6FF', color: t.type === 'REFUND' ? '#92400E' : '#1D4ED8' }}>{t.type}</span>
                  </td>
                  <td style={{ padding: '11px 16px', fontWeight: '600', color: '#0F172A' }}>{t.customer}</td>
                  <td style={{ padding: '11px 16px', fontWeight: '700', color: t.amount < 0 ? '#DC2626' : '#16A34A' }}>
                    {t.amount < 0 ? '-₹' + Math.abs(t.amount).toLocaleString('en-IN') : '₹' + t.amount.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: '12px', color: '#64748B' }}>{t.gateway}</td>
                  <td style={{ padding: '11px 16px', fontSize: '12px', color: '#64748B' }}>{t.time}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: t.status === 'SUCCESS' ? '#DCFCE7' : t.status === 'PROCESSED' ? '#EFF6FF' : '#FEE2E2', color: t.status === 'SUCCESS' ? '#16A34A' : t.status === 'PROCESSED' ? '#2563EB' : '#DC2626' }}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seller Settlements */}
      <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>Vendor Settlement Queue</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '6px 10px' }}>
            <Search size={13} color="#94A3B8" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search seller or ID..." style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '12px', color: '#1E293B', width: '160px' }} />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                {['Settlement ID', 'Seller', 'Gross GMV', 'Commission', 'Net Payout', 'Method', 'Due / Paid', 'Action'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#7C3AED', fontWeight: '700' }}>{s.id}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#0F172A' }}>{s.seller}</td>
                  <td style={{ padding: '12px 16px', color: '#374151', fontWeight: '600' }}>₹{s.gmv.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px 16px', color: '#DC2626', fontWeight: '600' }}>-₹{s.commission.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px 16px', color: '#16A34A', fontWeight: '800', fontSize: '14px' }}>₹{s.netPayout.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#64748B' }}>{s.method}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: s.status === 'PAID' ? '#64748B' : '#EA580C', fontWeight: '600' }}>{s.dueDate}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {s.status === 'PENDING' ? (
                      <button type="button" onClick={() => triggerPayout(s.id, s.seller, s.netPayout)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '7px', border: 'none', backgroundColor: '#2563EB', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        <RefreshCw size={12} /> Pay Now
                      </button>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#16A34A', fontWeight: '700' }}><CheckCircle2 size={13} /> Paid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
