import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Ban, RotateCcw, Truck, Package, AlertTriangle, CheckCircle2, ShoppingBag, Eye, X } from 'lucide-react';

const STATUS_COLORS = {
  DELIVERED: { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
  SHIPPED: { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  PROCESSING: { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
  CANCELLED: { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' },
  Confirmed: { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' }
};

export default function AdminOrdersControl() {
  const { orders, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [inspectOrder, setInspectOrder] = useState(null);

  const handleCancel = (orderId) => showToast('Order #' + orderId + ' force cancelled by Super Admin override', 'info');
  const handleRefund = (orderId) => showToast('Instant Razorpay/UPI refund released for #' + orderId, 'success');

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || (o.deliveryAddress?.name || o.buyerName || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || (o.statusCode || o.status || '').toUpperCase().includes(statusFilter);
    return matchSearch && matchStatus;
  });

  const stats = {
    total: orders.length,
    delivered: orders.filter(o => (o.statusCode === 'DELIVERED' || o.status === 'DELIVERED' || o.status === 'Delivered')).length,
    shipped: orders.filter(o => (o.statusCode === 'SHIPPED' || o.status === 'SHIPPED')).length,
    cancelled: orders.filter(o => (o.statusCode === 'CANCELLED' || o.status === 'CANCELLED')).length,
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
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
          }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '19px', fontWeight: '900', margin: 0, color: '#FFFFFF' }}>
              Marketplace Orders Control & Dispute Resolution
            </h1>
            <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: '2px 0 0' }}>
              Super Admin authority to inspect live fulfillment trails, audit courier routing, and execute instant escrow refunds
            </p>
          </div>
        </div>
      </div>

      {/* 4 Colorful Stat Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        {[
          { label: 'Total Orders', value: stats.total, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
          { label: 'Delivered Successfully', value: stats.delivered, color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
          { label: 'In Transit', value: stats.shipped, color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
          { label: 'Cancelled / Refunded', value: stats.cancelled, color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: s.bg, borderRadius: '12px', border: `1px solid ${s.border}`, padding: '16px 20px' }}>
            <div style={{ fontSize: '24px', fontWeight: '950', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#475569', fontWeight: '800', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '8px 14px', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="#64748B" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Order ID, Buyer Name, Pincode..."
            style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '13px', color: '#0F172A', flex: 1 }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '9px 16px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0F172A', backgroundColor: '#FFFFFF', fontWeight: '700' }}
        >
          {['ALL', 'DELIVERED', 'SHIPPED', 'PROCESSING', 'CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Orders Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }} className="no-scrollbar">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#0F172A', color: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
                {['Order ID & Date', 'Customer', 'Items Summary', 'Total Amount', 'Payment Mode', 'Status', 'Admin Override Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                    No matching orders found in platform records
                  </td>
                </tr>
              ) : (
                filtered.map((order, idx) => {
                  const sc = STATUS_COLORS[order.statusCode] || STATUS_COLORS[order.status] || { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' };
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFCFF' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontFamily: 'monospace', fontWeight: '900', color: '#2563EB', fontSize: '12.5px' }}>#{order.id}</div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{order.date || 'Today'}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: '800', color: '#0F172A' }}>{order.deliveryAddress?.name || order.buyerName || 'Verified Customer'}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{order.deliveryAddress?.city || 'Bengaluru'} {order.deliveryAddress?.pincode}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#0F172A', fontWeight: '600' }}>
                          {order.items?.[0]?.title || order.productName || 'Order Product'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{order.items?.length || 1} Item(s)</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: '900', color: '#0F172A' }}>
                        ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '11.5px', color: '#64748B' }}>
                        <span style={{ backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                          {order.paymentMethod || 'UPI Prepaid'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          backgroundColor: sc.bg,
                          color: sc.text,
                          border: `1px solid ${sc.border}`
                        }}>
                          ● {order.status || order.statusCode}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleRefund(order.id)}
                            style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #BFDBFE', backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                          >
                            Refund
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancel(order.id)}
                            style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #FECACA', backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                          >
                            Force Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
