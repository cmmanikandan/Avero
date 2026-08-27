
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, TrendingUp, IndianRupee, ShoppingBag, Receipt } from 'lucide-react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'];
const REV =  [820000, 940000, 780000, 1120000, 1050000, 1380000, 1620000, 1484200];
const ORDERS = [1240, 1480, 1100, 1820, 1650, 2140, 2580, 2310];
const COM =  [56540, 64580, 53820, 77140, 72345, 95220, 111780, 118480];

function SvgChart({ data, color, height = 110, width = 500, format }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = { t: 10, r: 10, b: 24, l: 10 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;

  const pts = data.map((v, i) => ({
    x: pad.l + (i / (data.length - 1)) * w,
    y: pad.t + (1 - (v - min) / range) * h,
    v,
  }));

  const lineD = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ');
  const areaD = 'M' + pad.l + ',' + (height - pad.b) + ' ' + lineD.slice(1) + ' L' + pts[pts.length-1].x.toFixed(1) + ',' + (height - pad.b) + ' Z';
  const gradId = 'g' + color.replace('#','');

  return (
    <svg width="100%" height={height} viewBox={"0 0 " + width + " " + height} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Horizontal grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(t => (
        <line key={t} x1={pad.l} x2={width - pad.r} y1={pad.t + t * h} y2={pad.t + t * h} stroke="#F1F5F9" strokeWidth="1" />
      ))}
      <path d={areaD} fill={"url(#" + gradId + ")"} />
      <path d={lineD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="#fff" stroke={color} strokeWidth="2" />
          {i === pts.length - 1 && (
            <>
              <circle cx={p.x} cy={p.y} r="5" fill={color} opacity="0.2" />
              <circle cx={p.x} cy={p.y} r="3.5" fill={color} />
            </>
          )}
          <text x={p.x} y={height - 4} textAnchor="middle" fontSize="9" fill="#94A3B8">{MONTHS[i]}</text>
        </g>
      ))}
    </svg>
  );
}

export default function AdminReports() {
  const { orders = [], showToast } = useApp();
  const [period, setPeriod] = useState('aug2026');

  const totalGMV = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const commissionRev = Math.round(totalGMV * 0.085);
  const gstCollected = Math.round(totalGMV * 0.01);

  const REV = totalGMV > 0 ? [0, 0, 0, 0, 0, 0, Math.round(totalGMV * 0.4), totalGMV] : [0, 0, 0, 0, 0, 0, 0, 0];
  const ORDERS = totalOrders > 0 ? [0, 0, 0, 0, 0, 0, Math.round(totalOrders * 0.4), totalOrders] : [0, 0, 0, 0, 0, 0, 0, 0];
  const COM = commissionRev > 0 ? [0, 0, 0, 0, 0, 0, Math.round(commissionRev * 0.4), commissionRev] : [0, 0, 0, 0, 0, 0, 0, 0];

  const dl = (name) => showToast('Downloading: ' + name, 'success');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0F172A' }}>Financial Reports & GST Filings</h1>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0' }}>GSTR-1/3B compliance, seller settlements & platform P&L statements</p>
        </div>
        <select value={period} onChange={e => setPeriod(e.target.value)} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13px', color: '#374151', backgroundColor: '#fff', fontWeight: '600' }}>
          <option value="aug2026">August 2026</option>
          <option value="jul2026">July 2026</option>
          <option value="jun2026">June 2026</option>
        </select>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
        {[
          { label: 'Gross Revenue', value: totalGMV >= 100000 ? `₹${(totalGMV / 100000).toFixed(2)}L` : `₹${totalGMV.toLocaleString('en-IN')}`, sub: 'Live sales volume', color: '#2563EB', icon: '💰' },
          { label: 'Platform Commission', value: commissionRev >= 100000 ? `₹${(commissionRev / 100000).toFixed(2)}L` : `₹${commissionRev.toLocaleString('en-IN')}`, sub: '8.5% margin', color: '#7C3AED', icon: '🏦' },
          { label: 'Orders Processed', value: totalOrders.toLocaleString('en-IN'), sub: 'Marketplace count', color: '#16A34A', icon: '📦' },
          { label: 'GST Collected (TCS)', value: `₹${gstCollected.toLocaleString('en-IN')}`, sub: '1% TCS rate', color: '#EA580C', icon: '🧾' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px 18px' }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.icon}</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', marginTop: '2px' }}>{s.label}</div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* SVG Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
        {[
          { title: 'Revenue (₹)', sub: 'Monthly gross GMV', data: REV, color: '#2563EB' },
          { title: 'Order Volume', sub: 'Total orders/month', data: ORDERS, color: '#7C3AED' },
          { title: 'Commission (₹)', sub: 'Platform take rate', data: COM, color: '#059669' },
        ].map(chart => (
          <div key={chart.title} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '18px 20px' }}>
            <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A', marginBottom: '2px' }}>{chart.title}</div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '12px' }}>{chart.sub}</div>
            <SvgChart data={chart.data} color={chart.color} height={110} width={360} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Latest month</span>
              <span style={{ fontSize: '13px', fontWeight: '800', color: chart.color }}>
                {chart.data[chart.data.length - 1].toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Downloadable Statements */}
      <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', fontWeight: '700', fontSize: '15px', color: '#0F172A' }}>
          Downloadable Statements & Filings
        </div>
        {[
          { title: 'GSTR-1 Sales Report (Aug 2026)', desc: 'Complete GST B2B/B2C invoice itemization for tax authorities', type: 'Tax Compliance', format: 'Excel + CSV', badge: '#EFF6FF', badgeText: '#2563EB' },
          { title: 'TCS (Tax Collected at Source) Under GST', desc: '1% TCS reconciliation for all 1,420 marketplace vendors', type: 'Merchant Tax', format: 'PDF + Excel', badge: '#FEF3C7', badgeText: '#92400E' },
          { title: 'Monthly GMV & Platform Margin Statement', desc: 'Net commission (₹1.18L), gateway fees, and logistics margins', type: 'Financial Audit', format: 'PDF', badge: '#F0FDF4', badgeText: '#166534' },
          { title: 'Vendor Settlement Ledger', desc: 'Bank NEFT logs, deductions, return adjustments & penalty records', type: 'Banking Payouts', format: 'CSV', badge: '#FDF4FF', badgeText: '#7C3AED' },
        ].map((item, idx) => (
          <div key={idx} style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: item.badge, color: item.badgeText }}>{item.type}</span>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Format: {item.format}</span>
              </div>
              <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>{item.title}</div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{item.desc}</div>
            </div>
            <button type="button" onClick={() => dl(item.title)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#374151', fontSize: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <Download size={14} /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
