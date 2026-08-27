import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Package,
  Truck,
  Users,
  Store,
  ShoppingBag,
  IndianRupee,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Sparkles,
  Layers,
  CreditCard,
  Tag,
  ArrowRight,
  ExternalLink,
  Percent
} from 'lucide-react';

const REV_DATA = [820, 940, 780, 1120, 1050, 1380, 1620, 1484];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

function SvgLineChart({ data, color = '#3B82F6', height = 80 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 10;
  const width = 400;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * w;
    const y = pad + (1 - (v - min) / range) * h;
    return [x, y];
  });

  const polyline = pts.map(p => p.join(',')).join(' ');

  const areaPath = [
    'M' + pts[0][0] + ',' + (height - pad),
    ...pts.map(p => 'L' + p[0] + ',' + p[1]),
    'L' + pts[pts.length - 1][0] + ',' + (height - pad),
    'Z'
  ].join(' ');

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible', display: 'block' }}>
        <defs>
          <linearGradient id={"grad-" + color.replace('#', '')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={"url(#grad-" + color.replace('#', '') + ")"} />
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={i === data.length - 1 ? 5 : 2.5} fill={color} stroke="#FFFFFF" strokeWidth={i === data.length - 1 ? "2" : "0"} />
        ))}
      </svg>
    </div>
  );
}

const STATUS_COLORS = {
  DELIVERED: { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
  Delivered: { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
  SHIPPED: { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  PROCESSING: { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
  CANCELLED: { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' },
  Confirmed: { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' }
};

export default function AdminDashboardView() {
  const { products = [], vendorSubmissions = [], deliveryPartners = [], orders = [] } = useApp();

  const pendingSubmissions = vendorSubmissions.filter(s => s.status === 'PENDING_APPROVAL');
  const pendingDrivers = deliveryPartners.filter(d => d.status === 'PENDING_APPROVAL');
  const recentOrders = [...orders].reverse().slice(0, 6);

  const totalGMV = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const commissionRev = Math.round(totalGMV * 0.085);
  const activeBuyers = new Set(orders.map(o => o.customerEmail || o.deliveryAddress?.name || o.buyerName).filter(Boolean)).size;
  const merchantsCount = new Set(products.map(p => p.seller || p.brand).filter(Boolean)).size;
  const fleetDeliveries = orders.filter(o => o.status === 'Delivered').length;

  const REV_DATA = totalGMV > 0 ? [0, 0, 0, 0, 0, 0, Math.round(totalGMV * 0.4), totalGMV] : [0, 0, 0, 0, 0, 0, 0, 0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1440px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

      {/* Top Welcome & Health Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
        borderRadius: '18px',
        padding: '20px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        color: '#FFFFFF',
        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(59, 130, 246, 0.45)',
            flexShrink: 0
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '18px', fontWeight: '900', margin: 0, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
                Executive Super Governance Console
              </h1>
              <span style={{ fontSize: '10.5px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFFFFF', padding: '2px 8px', borderRadius: '9999px', fontWeight: '800' }}>
                ● Live
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px', margin: '2px 0 0' }}>
              Real-time platform metrics, merchant QA, fleet dispatch, and automated escrow clearance
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Link
            to="/admin/products"
            style={{
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '800',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)'
            }}
          >
            <Package size={14} /> Review {pendingSubmissions.length} SKUs
          </Link>
          <Link
            to="/admin/delivery"
            style={{
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '800',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
          >
            <Truck size={14} /> {pendingDrivers.length} Driver KYC
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          COLORFUL KPI STATS MATRIX (Responsive minmax for mobile)
      ─────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        {[
          {
            label: 'Platform GMV',
            value: totalGMV >= 100000 ? `₹${(totalGMV / 100000).toFixed(2)}L` : `₹${totalGMV.toLocaleString('en-IN')}`,
            sub: 'Live verified orders',
            bg: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
            icon: IndianRupee,
            iconBg: 'rgba(255, 255, 255, 0.2)'
          },
          {
            label: 'Active Buyers',
            value: activeBuyers.toLocaleString('en-IN'),
            sub: 'Verified customers',
            bg: 'linear-gradient(135deg, #064E3B 0%, #059669 100%)',
            icon: Users,
            iconBg: 'rgba(255, 255, 255, 0.2)'
          },
          {
            label: 'Merchants',
            value: merchantsCount.toLocaleString('en-IN'),
            sub: `${pendingSubmissions.length} pending QA`,
            bg: 'linear-gradient(135deg, #78350F 0%, #D97706 100%)',
            icon: Store,
            iconBg: 'rgba(255, 255, 255, 0.2)'
          },
          {
            label: 'Commission Rev.',
            value: commissionRev >= 100000 ? `₹${(commissionRev / 100000).toFixed(2)}L` : `₹${commissionRev.toLocaleString('en-IN')}`,
            sub: '8.5% take rate',
            bg: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)',
            icon: TrendingUp,
            iconBg: 'rgba(255, 255, 255, 0.2)'
          },
          {
            label: 'Fleet Deliveries',
            value: fleetDeliveries.toLocaleString('en-IN'),
            sub: 'Delivered to door',
            bg: 'linear-gradient(135deg, #0C4A6E 0%, #0284C7 100%)',
            icon: Truck,
            iconBg: 'rgba(255, 255, 255, 0.2)'
          },
          {
            label: 'Catalog SKUs',
            value: products.length.toLocaleString('en-IN'),
            sub: 'Active catalog',
            bg: 'linear-gradient(135deg, #831843 0%, #DB2777 100%)',
            icon: Package,
            iconBg: 'rgba(255, 255, 255, 0.2)'
          }
        ].map(card => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              style={{
                background: card.bg,
                borderRadius: '14px',
                padding: '14px 16px',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px', color: 'rgba(255, 255, 255, 0.85)' }}>
                  {card.label}
                </span>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={15} color="#FFFFFF" />
                </div>
              </div>
              <div style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: '950', letterSpacing: '-0.5px' }}>
                {card.value}
              </div>
              <div style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: '700', marginTop: '4px' }}>
                {card.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          QUICK GOVERNANCE CONTROLS HUB
      ─────────────────────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        padding: '18px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ fontSize: '14.5px', fontWeight: '900', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={17} color="#2563EB" /> Governance Command Hub
          </div>
          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>
            Direct Actions
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          {[
            { title: 'Product Catalog QA', sub: `${pendingSubmissions.length} awaiting review`, link: '/admin/products', color: '#EF4444', bg: '#FEF2F2', icon: Package },
            { title: 'Seller KYC Approvals', sub: '2 verified applications', link: '/admin/sellers', color: '#F59E0B', bg: '#FEF3C7', icon: Store },
            { title: 'Delivery Fleet Fleet', sub: `${pendingDrivers.length} driver licenses`, link: '/admin/delivery', color: '#10B981', bg: '#ECFDF5', icon: Truck },
            { title: 'Commission Payouts', sub: '₹37,226 clearance', link: '/admin/payments', color: '#8B5CF6', bg: '#F5F3FF', icon: CreditCard }
          ].map(hub => {
            const Icon = hub.icon;
            return (
              <Link
                key={hub.title}
                to={hub.link}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: hub.bg,
                  border: `1px solid ${hub.color}30`,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: hub.color,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hub.title}</div>
                  <div style={{ fontSize: '11px', color: hub.color, fontWeight: '700' }}>{hub.sub}</div>
                </div>
                <ArrowRight size={13} color={hub.color} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CHARTS ROW: REVENUE TREND + CATEGORY BREAKDOWN (Fully Responsive)
      ─────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>

        {/* Revenue Trend SVG */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <div style={{ fontWeight: '900', fontSize: '14.5px', color: '#0F172A' }}>Monthly Marketplace GMV Trend</div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>Jan – Aug 2026 (₹ in thousands)</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#2563EB' }}>₹14.84L</div>
              <div style={{ fontSize: '10.5px', color: '#059669', fontWeight: '800' }}>↑ +8.7% growth</div>
            </div>
          </div>
          
          <SvgLineChart data={REV_DATA} color="#2563EB" height={80} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            {MONTHS.map(m => <div key={m} style={{ fontSize: '10px', color: '#64748B', fontWeight: '700' }}>{m}</div>)}
          </div>
        </div>

        {/* Category Sales Distribution */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <div style={{ fontWeight: '900', fontSize: '14.5px', color: '#0F172A' }}>Category Revenue Mix</div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>Market share by product vertical</div>
            </div>
            <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#7C3AED', backgroundColor: '#F5F3FF', padding: '2px 8px', borderRadius: '6px' }}>
              Live Split
            </span>
          </div>

          {/* Multi-segment Progress Bar */}
          <div style={{ height: '12px', borderRadius: '9999px', display: 'flex', overflow: 'hidden', marginBottom: '14px' }}>
            <div style={{ width: '42%', backgroundColor: '#2563EB' }} title="Electronics (42%)" />
            <div style={{ width: '24%', backgroundColor: '#8B5CF6' }} title="Fashion (24%)" />
            <div style={{ width: '16%', backgroundColor: '#EC4899' }} title="Beauty (16%)" />
            <div style={{ width: '10%', backgroundColor: '#10B981' }} title="Groceries (10%)" />
            <div style={{ width: '8%', backgroundColor: '#F59E0B' }} title="Others (8%)" />
          </div>

          {/* Category Legend Grid (Mobile Responsive) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', fontSize: '11.5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#2563EB', flexShrink: 0 }} />
              <span>Electronics: <strong>42%</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#8B5CF6', flexShrink: 0 }} />
              <span>Fashion: <strong>24%</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#EC4899', flexShrink: 0 }} />
              <span>Beauty: <strong>16%</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#10B981', flexShrink: 0 }} />
              <span>Groceries: <strong>10%</strong></span>
            </div>
          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          RECENT ORDERS FEED (Mobile Responsive Scrollable Card/Table)
      ─────────────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: '900', fontSize: '14.5px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={16} color="#2563EB" /> Recent Marketplace Orders — Live Feed
          </div>
          <Link to="/admin/orders" style={{ fontSize: '12px', color: '#2563EB', fontWeight: '800', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
            Full Ledger <ArrowRight size={12} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }} className="no-scrollbar">
          <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#0F172A', color: '#FFFFFF', fontSize: '10.5px', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Order Ref</th>
                <th style={{ padding: '10px 14px' }}>Buyer Name</th>
                <th style={{ padding: '10px 14px' }}>Product Title</th>
                <th style={{ padding: '10px 14px' }}>Total</th>
                <th style={{ padding: '10px 14px' }}>Payment</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
                <th style={{ padding: '10px 14px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
                    No active orders found in the platform ledger
                  </td>
                </tr>
              ) : (
                recentOrders.map((order, idx) => {
                  const sc = STATUS_COLORS[order.statusCode] || STATUS_COLORS[order.status] || { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' };
                  return (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFCFF'
                      }}
                    >
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: '11.5px', color: '#2563EB', fontWeight: '800' }}>
                        #{order.id}
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: '800', color: '#0F172A' }}>
                        {order.deliveryAddress?.name || order.buyerName || 'Verified Customer'}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#334155', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.items?.[0]?.title || order.productName || 'Marketplace Item'}
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: '900', color: '#0F172A' }}>
                        ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: '11px', color: '#64748B' }}>
                        <span style={{ backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                          {order.paymentMethod ? order.paymentMethod.slice(0, 10) : 'UPI'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: sc.bg,
                          color: sc.text,
                          border: `1px solid ${sc.border}`
                        }}>
                          ● {order.status || order.statusCode}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: '11px', color: '#64748B' }}>
                        {order.date || 'Today'}
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
