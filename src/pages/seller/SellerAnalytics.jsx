import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, TrendingDown, Download, FileText, FileSpreadsheet, MapPin, ShoppingBag, Package, IndianRupee, BarChart3, Users, RefreshCw, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2 } from 'lucide-react';

// ─── Chart Data ───────────────────────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'];

// ─── SVG Line Chart ────────────────────────────────────────────────────────────
function LineChart({ data, color = '#2563EB', height = 120 }) {
  const W = 500, H = height;
  const pad = { t: 12, r: 12, b: 28, l: 12 };
  const w = W - pad.l - pad.r;
  const h = H - pad.t - pad.b;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: pad.l + (i / (data.length - 1)) * w,
    y: pad.t + (1 - (v - min) / range) * h,
    v,
  }));

  const lineD = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ');
  const areaD = 'M' + pad.l + ',' + (H - pad.b) + ' ' + lineD.slice(1) + ' L' + pts[pts.length-1].x.toFixed(1) + ',' + (H - pad.b) + ' Z';
  const gid = 'sg' + color.replace('#','');

  return (
    <svg width="100%" height={H} viewBox={"0 0 " + W + " " + H} style={{ display:'block', overflow:'visible' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      {[0, 0.33, 0.66, 1].map(t => (
        <line key={t} x1={pad.l} x2={W - pad.r} y1={pad.t + t * h} y2={pad.t + t * h} stroke="#F1F5F9" strokeWidth="1" />
      ))}
      <path d={areaD} fill={"url(#" + gid + ")"} />
      <path d={lineD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          {i === pts.length - 1
            ? <circle cx={p.x} cy={p.y} r="5" fill={color} />
            : <circle cx={p.x} cy={p.y} r="3" fill="#fff" stroke={color} strokeWidth="2" />}
          <text x={p.x} y={H - 6} textAnchor="middle" fontSize="9" fill="#94A3B8">{MONTHS[i]}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Donut Chart ───────────────────────────────────────────────────────────────
function Donut({ data, size = 120 }) {
  const r = 44, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r;
  let offset = 0;
  const slices = (data || []).map(d => {
    const dash = (d.share / 100) * circ;
    const gap = circ - dash;
    const s = { ...d, dash, gap, offset };
    offset += dash;
    return s;
  });
  return (
    <svg width={size} height={size} viewBox={"0 0 " + size + " " + size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth="18" />
      {slices.map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={s.color} strokeWidth="18"
          strokeDasharray={s.dash + " " + s.gap}
          strokeDashoffset={-s.offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      ))}
    </svg>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function SellerAnalytics() {
  const { user, orders = [], products = [], showToast } = useApp();
  const [range, setRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  const dl = (f) => showToast('Downloading ' + f.toUpperCase() + ' report...', 'success');

  const activeStoreName = user?.storeName || (user?.name ? `${user.name}'s Store` : '');

  const myOrders = orders.filter(o =>
    o.items?.some(it => 
      (activeStoreName && (it.seller === activeStoreName || it.brand === activeStoreName || it.seller?.name === activeStoreName)) ||
      (user?.email && (it.sellerEmail === user?.email || it.submittedBy === user?.email)) ||
      (user?.merchantId && it.merchantId === user?.merchantId)
    )
  );

  const totalRev = myOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const totalOrd = myOrders.length;
  const avgOrderValue = totalOrd > 0 ? Math.round(totalRev / totalOrd) : 0;
  const netProfit = Math.round(totalRev * 0.15); // Approx 15% net margin

  // Dynamic Top SKUs from real items
  const skuMap = {};
  myOrders.forEach(o => {
    (o.items || []).forEach(item => {
      const key = item.title || item.name || 'Store Item';
      if (!skuMap[key]) skuMap[key] = { units: 0, revenue: 0 };
      skuMap[key].units += (item.quantity || 1);
      skuMap[key].revenue += (item.price || 0) * (item.quantity || 1);
    });
  });

  const TOP_SKUS = Object.keys(skuMap).map((k, idx) => {
    const colors = ['#2563EB', '#7C3AED', '#059669', '#EA580C'];
    const units = skuMap[k].units;
    const rev = skuMap[k].revenue;
    const share = totalRev > 0 ? Math.round((rev / totalRev) * 100) : 0;
    return {
      name: k,
      units,
      revenue: rev,
      share,
      trend: '+10%',
      color: colors[idx % colors.length]
    };
  });

  // Dynamic Geographic Distribution from order delivery addresses
  const cityMap = {};
  myOrders.forEach(o => {
    const city = o.deliveryAddress?.city || 'Local Region';
    cityMap[city] = (cityMap[city] || 0) + 1;
  });

  const GEO_DATA = Object.keys(cityMap).map((c, idx) => {
    const colors = ['#2563EB', '#7C3AED', '#059669', '#EA580C', '#94A3B8'];
    const cnt = cityMap[c];
    const share = totalOrd > 0 ? Math.round((cnt / totalOrd) * 100) : 0;
    return {
      city: c,
      share,
      orders: cnt,
      color: colors[idx % colors.length]
    };
  });

  const FUNNEL = [
    { label: 'Store Visitors', value: totalOrd * 32, pct: 100, color: '#2563EB' },
    { label: 'Product Views', value: totalOrd * 14, pct: 45, color: '#7C3AED' },
    { label: 'Add to Cart', value: totalOrd * 3, pct: 16, color: '#EA580C' },
    { label: 'Checkout Started', value: Math.round(totalOrd * 1.4), pct: 7, color: '#D97706' },
    { label: 'Orders Placed', value: totalOrd, pct: 4.8, color: '#059669' },
  ];

  const GST_ROWS = [
    { desc: 'Gross Sales (B2C)', gst: '18%', taxable: Math.round(totalRev * 0.82), cgst: Math.round(totalRev * 0.09), sgst: Math.round(totalRev * 0.09), igst: 0 },
    { desc: 'Platform Commission (Input Credit)', gst: '18%', taxable: -Math.round(totalRev * 0.085), cgst: -Math.round(totalRev * 0.085 * 0.09), sgst: -Math.round(totalRev * 0.085 * 0.09), igst: 0 }
  ];

  const REVENUE = totalRev > 0 ? [0, 0, 0, 0, 0, 0, Math.round(totalRev * 0.4), totalRev] : [0, 0, 0, 0, 0, 0, 0, 0];
  const ORDERS_D = totalOrd > 0 ? [0, 0, 0, 0, 0, 0, Math.round(totalOrd * 0.4), totalOrd] : [0, 0, 0, 0, 0, 0, 0, 0];
  const PROFIT = netProfit > 0 ? [0, 0, 0, 0, 0, 0, Math.round(netProfit * 0.4), netProfit] : [0, 0, 0, 0, 0, 0, 0, 0];

  const rangeLabel = { '7d': 'Last 7 Days', '30d': 'Last 30 Days', '90d': 'Last 90 Days', '1y': 'This Year' };

  const tabStyle = (t) => ({
    padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '700',
    backgroundColor: activeTab === t ? '#2563EB' : 'transparent',
    color: activeTab === t ? '#fff' : '#64748B',
    transition: 'all 0.15s ease',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '900', margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={22} color="#2563EB" /> Store Analytics & Financial Reports
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>Revenue charts, order funnels, GST filings & SKU performance — {rangeLabel[range]}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {['7d','30d','90d','1y'].map(r => (
            <button key={r} type="button" onClick={() => setRange(r)} style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid ' + (range === r ? '#2563EB' : '#E2E8F0'), backgroundColor: range === r ? '#EFF6FF' : '#fff', color: range === r ? '#2563EB' : '#374151', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>{r.toUpperCase()}</button>
          ))}
          <div style={{ width: '1px', height: '24px', backgroundColor: '#E2E8F0' }} />
          {[{icon: FileSpreadsheet, label: 'CSV', f: 'csv'}, {icon: FileSpreadsheet, label: 'Excel', f: 'excel'}, {icon: FileText, label: 'PDF', f: 'pdf'}].map(b => {
            const Icon = b.icon;
            return (
              <button key={b.f} type="button" onClick={() => dl(b.f)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '7px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#374151', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                <Icon size={13} /> {b.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
        {[
          { label: 'Gross Revenue', value: totalRev >= 100000 ? `₹${(totalRev / 100000).toFixed(2)}L` : `₹${totalRev.toLocaleString('en-IN')}`, sub: totalRev > 0 ? '↑ Live Sales' : 'No sales yet', subColor: '#059669', icon: IndianRupee, iconBg: '#EFF6FF', iconColor: '#2563EB' },
          { label: 'Total Orders', value: totalOrd.toLocaleString('en-IN'), sub: totalOrd > 0 ? '100% fulfilled' : '0 orders', subColor: '#059669', icon: ShoppingBag, iconBg: '#F0FDF4', iconColor: '#059669' },
          { label: 'Avg Order Value', value: `₹${avgOrderValue.toLocaleString('en-IN')}`, sub: totalOrd > 0 ? 'Per order avg' : '—', subColor: '#7C3AED', icon: TrendingUp, iconBg: '#FDF4FF', iconColor: '#7C3AED' },
          { label: 'Conversion Rate', value: totalOrd > 0 ? '3.4%' : '0.0%', sub: totalOrd > 0 ? 'Store visitors' : '—', subColor: '#2563EB', icon: Users, iconBg: '#FEF3C7', iconColor: '#D97706' },
          { label: 'Return Rate', value: '0.0%', sub: 'Zero returns', subColor: '#059669', icon: RefreshCw, iconBg: '#F0FDF4', iconColor: '#059669' },
          { label: 'Net Profit', value: netProfit >= 100000 ? `₹${(netProfit / 100000).toFixed(2)}L` : `₹${netProfit.toLocaleString('en-IN')}`, sub: '15% net margin', subColor: '#7C3AED', icon: BarChart3, iconBg: '#FDF4FF', iconColor: '#7C3AED' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{s.label}</span>
                <div style={{ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={s.iconColor} />
                </div>
              </div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.3px' }}>{s.value}</div>
              <div style={{ fontSize: '11.5px', color: s.subColor, fontWeight: '700', marginTop: '4px' }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Main Tabbed Analytics Box */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '22px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { id: 'overview', label: '📊 Revenue Charts' },
            { id: 'funnel', label: '🔻 Order Funnel' },
            { id: 'skus', label: '📦 Top SKUs' },
            { id: 'geo', label: '📍 Geography' },
            { id: 'gst', label: '📋 GST Report' }
          ].map(t => (
            <button key={t.id} type="button" onClick={() => setActiveTab(t.id)} style={tabStyle(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* Tab Contents */}
        <div style={{ minHeight: '280px' }}>

          {/* ── Revenue Charts Tab ── */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                {[
                  { title: 'Gross Revenue (₹)', data: REVENUE, color: '#2563EB', latest: totalRev >= 100000 ? `₹${(totalRev / 100000).toFixed(2)}L` : `₹${totalRev.toLocaleString('en-IN')}`, trend: totalRev > 0 ? '+100%' : '0%', up: true },
                  { title: 'Orders / Month', data: ORDERS_D, color: '#7C3AED', latest: totalOrd.toString(), trend: totalOrd > 0 ? '+100%' : '0%', up: true },
                  { title: 'Net Profit (₹)', data: PROFIT, color: '#059669', latest: netProfit >= 100000 ? `₹${(netProfit / 100000).toFixed(2)}L` : `₹${netProfit.toLocaleString('en-IN')}`, trend: netProfit > 0 ? '+100%' : '0%', up: true },
                ].map(c => (
                  <div key={c.title} style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px' }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: '#0F172A', marginBottom: '4px' }}>{c.title}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '20px', fontWeight: '900', color: c.color }}>{c.latest}</span>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: c.up ? '#059669' : '#DC2626' }}>{c.up ? '↑' : '↓'} {c.trend}</span>
                    </div>
                    <LineChart data={c.data} color={c.color} height={100} />
                  </div>
                ))}
              </div>

              {/* Monthly Earnings Table */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontWeight: '800', fontSize: '13px', color: '#0F172A' }}>Monthly Earnings Breakdown</div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                        {['Month', 'Gross Revenue', 'Platform Fee (8.5%)', 'Shipping Cost', 'Returns', 'Net Earnings'].map(h => (
                          <th key={h} style={{ padding: '10px 14px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MONTHS.map((m, i) => {
                        const rev = REVENUE[i];
                        const fee = Math.round(rev * 0.085);
                        const ship = Math.round(rev * 0.018);
                        const ret = Math.round(rev * 0.021);
                        const net = rev - fee - ship - ret;
                        return (
                          <tr key={m} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: i === MONTHS.length - 1 ? '#EFF6FF' : 'transparent' }}>
                            <td style={{ padding: '10px 14px', fontWeight: i === MONTHS.length - 1 ? '800' : '600', color: i === MONTHS.length - 1 ? '#1D4ED8' : '#374151' }}>{m} 2026</td>
                            <td style={{ padding: '10px 14px', fontWeight: '700', color: '#0F172A' }}>₹{rev.toLocaleString('en-IN')}</td>
                            <td style={{ padding: '10px 14px', color: '#DC2626' }}>-₹{fee.toLocaleString('en-IN')}</td>
                            <td style={{ padding: '10px 14px', color: '#EA580C' }}>-₹{ship.toLocaleString('en-IN')}</td>
                            <td style={{ padding: '10px 14px', color: '#D97706' }}>-₹{ret.toLocaleString('en-IN')}</td>
                            <td style={{ padding: '10px 14px', fontWeight: '800', color: '#059669' }}>₹{net.toLocaleString('en-IN')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Order Funnel Tab ── */}
          {activeTab === 'funnel' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: '0 0 16px' }}>Conversion Funnel — August 2026</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {FUNNEL.map((stage, idx) => (
                    <div key={stage.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>{stage.label}</span>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '13px', fontWeight: '800', color: stage.color }}>{stage.value.toLocaleString('en-IN')}</span>
                          <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '6px' }}>{stage.pct}%</span>
                        </div>
                      </div>
                      <div style={{ height: '10px', backgroundColor: '#F1F5F9', borderRadius: '20px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: stage.pct + '%', backgroundColor: stage.color, borderRadius: '20px', transition: 'width 0.6s ease' }} />
                      </div>
                      {idx < FUNNEL.length - 1 && (
                        <div style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'right', marginTop: '3px' }}>
                          Drop: {(100 - (FUNNEL[idx+1].pct / stage.pct * 100)).toFixed(0)}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: '0 0 16px' }}>Funnel Health Insights</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'View-to-Cart Rate', value: '35.7%', target: '40%', status: 'warn', tip: 'Improve product images and descriptions' },
                    { label: 'Cart-to-Checkout', value: '43.7%', target: '50%', status: 'warn', tip: 'Add urgency badges and stock alerts' },
                    { label: 'Checkout-to-Order', value: '67.5%', target: '60%', status: 'good', tip: 'Excellent! Better than category average' },
                    { label: 'Overall Conversion', value: '4.82%', target: '4%', status: 'good', tip: 'Above industry benchmark of 3.2%' },
                  ].map(h => (
                    <div key={h.label} style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid ' + (h.status === 'good' ? '#DCFCE7' : '#FEF3C7'), backgroundColor: h.status === 'good' ? '#F0FDF4' : '#FFFBEB' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>{h.label}</span>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', fontWeight: '900', color: h.status === 'good' ? '#16A34A' : '#D97706' }}>{h.value}</span>
                          <span style={{ fontSize: '10px', color: '#94A3B8' }}>/ {h.target} target</span>
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', color: h.status === 'good' ? '#16A34A' : '#92400E' }}>{h.tip}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Top SKUs Tab ── */}
          {activeTab === 'skus' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Top Selling SKUs by Revenue — August 2026</h3>
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                      {['#', 'Product', 'Units Sold', 'Revenue', 'Revenue Share', 'MoM Trend'].map(h => (
                        <th key={h} style={{ padding: '11px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TOP_SKUS.map((p, idx) => (
                      <tr key={p.name} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 16px', fontWeight: '900', color: p.color, fontSize: '16px' }}>#{idx + 1}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: '700', color: '#0F172A' }}>{p.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                            <div style={{ height: '5px', width: p.share * 2 + 'px', backgroundColor: p.color, borderRadius: '20px' }} />
                            <span style={{ fontSize: '10px', color: '#94A3B8' }}>{p.share}% of revenue</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: '700', color: '#374151' }}>{p.units} units</td>
                        <td style={{ padding: '12px 16px', fontWeight: '800', color: '#0F172A' }}>₹{(p.revenue / 100000).toFixed(2)}L</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '20px', flex: 1, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: p.share + '%', backgroundColor: p.color, borderRadius: '20px' }} />
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', whiteSpace: 'nowrap' }}>{p.share}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', backgroundColor: p.trend.startsWith('+') ? '#DCFCE7' : '#FEE2E2', color: p.trend.startsWith('+') ? '#16A34A' : '#DC2626' }}>
                            {p.trend}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Geography Tab ── */}
          {activeTab === 'geo' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: '0 0 16px' }}>Buyer Geographic Distribution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {GEO_DATA.map(g => (
                    <div key={g.city}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: g.color, flexShrink: 0 }} />
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>{g.city}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', color: '#64748B' }}>{g.orders} orders</span>
                          <span style={{ fontSize: '13px', fontWeight: '800', color: g.color }}>{g.share}%</span>
                        </div>
                      </div>
                      <div style={{ height: '7px', backgroundColor: '#F1F5F9', borderRadius: '20px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: g.share + '%', backgroundColor: g.color, borderRadius: '20px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Order Share</h3>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <Donut data={GEO_DATA} size={160} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A' }}>1,280</div>
                    <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600' }}>total orders</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                  {GEO_DATA.map(g => (
                    <div key={g.city} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: g.color }} />
                      <span style={{ fontSize: '11px', color: '#64748B' }}>{g.city.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── GST Report Tab ── */}
          {activeTab === 'gst' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>GSTR-1 Sales Report — August 2026</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => dl('gst-excel')} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#374151', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                    <FileSpreadsheet size={13} /> Download Excel
                  </button>
                  <button type="button" onClick={() => dl('gst-pdf')} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#374151', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                    <FileText size={13} /> PDF Filing
                  </button>
                </div>
              </div>

              {/* GST Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                {[
                  { label: 'Total Taxable Value', value: '₹47,29,515', color: '#2563EB' },
                  { label: 'CGST Payable (9%)', value: '₹2,83,959', color: '#7C3AED' },
                  { label: 'SGST Payable (9%)', value: '₹2,83,959', color: '#059669' },
                  { label: 'IGST Payable (18%)', value: '₹2,31,228', color: '#EA580C' },
                  { label: 'Input Tax Credit', value: '-₹52,166', color: '#16A34A' },
                  { label: 'Net GST Liability', value: '₹7,46,980', color: '#DC2626' },
                ].map(s => (
                  <div key={s.label} style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '14px 16px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '900', color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', marginTop: '3px' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* GST Table */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                        {['Description', 'GST Rate', 'Taxable Amount', 'CGST', 'SGST', 'IGST', 'Total Tax'].map(h => (
                          <th key={h} style={{ padding: '11px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {GST_ROWS.map((row, i) => {
                        const total = row.cgst + row.sgst + row.igst;
                        return (
                          <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '12px 16px', fontWeight: '600', color: '#0F172A' }}>{row.desc}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#EFF6FF', color: '#2563EB' }}>{row.gst}</span>
                            </td>
                            <td style={{ padding: '12px 16px', fontWeight: '700', color: row.taxable < 0 ? '#059669' : '#0F172A' }}>₹{Math.abs(row.taxable).toLocaleString('en-IN')}</td>
                            <td style={{ padding: '12px 16px', color: row.cgst < 0 ? '#059669' : '#374151' }}>{row.cgst !== 0 ? (row.cgst < 0 ? '-' : '') + '₹' + Math.abs(row.cgst).toLocaleString('en-IN') : '—'}</td>
                            <td style={{ padding: '12px 16px', color: row.sgst < 0 ? '#059669' : '#374151' }}>{row.sgst !== 0 ? (row.sgst < 0 ? '-' : '') + '₹' + Math.abs(row.sgst).toLocaleString('en-IN') : '—'}</td>
                            <td style={{ padding: '12px 16px', color: '#374151' }}>{row.igst !== 0 ? '₹' + row.igst.toLocaleString('en-IN') : '—'}</td>
                            <td style={{ padding: '12px 16px', fontWeight: '800', color: total < 0 ? '#059669' : '#DC2626' }}>
                              {total < 0 ? '-' : ''}₹{Math.abs(total).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        );
                      })}
                      <tr style={{ backgroundColor: '#FEF3C7', fontWeight: '900' }}>
                        <td style={{ padding: '12px 16px', fontWeight: '900', color: '#0F172A' }}>NET GST PAYABLE</td>
                        <td colSpan={2} style={{ padding: '12px 16px' }} />
                        <td style={{ padding: '12px 16px', color: '#DC2626', fontWeight: '900' }}>₹2,83,959</td>
                        <td style={{ padding: '12px 16px', color: '#DC2626', fontWeight: '900' }}>₹2,83,959</td>
                        <td style={{ padding: '12px 16px', color: '#DC2626', fontWeight: '900' }}>₹2,31,228</td>
                        <td style={{ padding: '12px 16px', color: '#DC2626', fontWeight: '900', fontSize: '14px' }}>₹7,99,146</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ backgroundColor: '#EFF6FF', borderRadius: '10px', padding: '12px 16px', border: '1px solid #BFDBFE', fontSize: '12px', color: '#1D4ED8', fontWeight: '600' }}>
                ⓘ GST returns are due by the 11th of every month. Next filing due: <strong>11 September 2026</strong>. Ensure all B2B invoice GSTINs are validated before filing GSTR-1.
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
