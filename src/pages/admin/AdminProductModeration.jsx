import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  X,
  Eye,
  Store,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

export default function AdminProductModeration() {
  const { products, vendorSubmissions, approveProduct, rejectProduct, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('PENDING'); // 'PENDING' | 'LIVE'
  const [searchFilter, setSearchFilter] = useState('');

  const pendingSubmissions = vendorSubmissions.filter(s => s.status === 'PENDING_APPROVAL');

  const filteredLiveProducts = products.filter(p => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return p.title?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '900', margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={22} color="#2563EB" /> Product Catalog Moderation & Quality Control
          </h1>
          <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', margin: 0 }}>
            Inspect vendor product submissions, verify hardware specifications & brand authenticity, and publish live to marketplace
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('PENDING')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: activeTab === 'PENDING' ? '1px solid #D97706' : '1px solid #CBD5E1',
              backgroundColor: activeTab === 'PENDING' ? '#FEF3C7' : '#FFFFFF',
              color: activeTab === 'PENDING' ? '#92400E' : '#475569',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Clock size={14} color="#D97706" /> Pending Approvals ({pendingSubmissions.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('LIVE')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: activeTab === 'LIVE' ? '1px solid #2563EB' : '1px solid #CBD5E1',
              backgroundColor: activeTab === 'LIVE' ? '#EFF6FF' : '#FFFFFF',
              color: activeTab === 'LIVE' ? '#1D4ED8' : '#475569',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Package size={14} /> Live Catalog ({products.length})
          </button>
        </div>
      </div>

      {/* ================= TAB 1: PENDING VENDOR SUBMISSIONS ================= */}
      {activeTab === 'PENDING' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {pendingSubmissions.length === 0 ? (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '48px 24px',
              textAlign: 'center',
              color: '#64748B',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>All Vendor Submissions Reviewed!</h3>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                There are no pending product listings awaiting Super Admin quality control.
              </p>
            </div>
          ) : (
            pendingSubmissions.map((sub) => (
              <div
                key={sub.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1.5px solid #F59E0B',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                {/* Top Title & Vendor Row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ width: '72px', height: '72px', backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '4px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <img src={sub.thumbnail} alt={sub.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#2563EB', textTransform: 'uppercase' }}>
                          {sub.brand} • {sub.category}
                        </span>
                        <span style={{ fontSize: '10px', color: '#92400E', backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>
                          Pending QC Review
                        </span>
                      </div>

                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: '4px 0 6px' }}>
                        {sub.title}
                      </h3>

                      <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Store size={14} color="#D97706" />
                        <span>Submitted by: <strong style={{ color: '#0F172A' }}>{sub.seller?.name || 'Verified Vendor'}</strong></span>
                        <span>• Submitted {sub.submittedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Block */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: '#059669' }}>
                      ₹{sub.price?.toLocaleString('en-IN')}
                    </div>
                    {sub.mrp && (
                      <div style={{ fontSize: '12px', color: '#64748B', textDecoration: 'line-through' }}>
                        MRP: ₹{sub.mrp?.toLocaleString('en-IN')} ({sub.discount}% OFF)
                      </div>
                    )}
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                      Stock Units: <strong style={{ color: '#0F172A' }}>{sub.stockCount || 25}</strong>
                    </div>
                  </div>
                </div>

                {/* Hardware Specifications Grid */}
                <div style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '10px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px'
                }}>
                  <div>
                    <span style={{ color: '#64748B' }}>Processor:</span> <strong style={{ color: '#0F172A' }}>{sub.specs?.Processor || 'High-Speed Chipset'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>RAM & Storage:</span> <strong style={{ color: '#0F172A' }}>{sub.specs?.RAM} / {sub.specs?.Storage}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Camera:</span> <strong style={{ color: '#0F172A' }}>{sub.specs?.Camera || 'Multi-array Camera'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Battery:</span> <strong style={{ color: '#0F172A' }}>{sub.specs?.Battery || 'All-Day Battery'}</strong>
                  </div>
                </div>

                {/* Admin Approval Decision Bar */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: '14px' }}>
                  <button
                    type="button"
                    onClick={() => rejectProduct(sub.id)}
                    className="btn btn-secondary"
                    style={{
                      height: '38px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#DC2626',
                      borderColor: '#FECACA',
                      backgroundColor: '#FEF2F2',
                      gap: '4px'
                    }}
                  >
                    <X size={14} /> Reject Submission
                  </button>

                  <button
                    type="button"
                    onClick={() => approveProduct(sub.id)}
                    className="btn btn-primary"
                    style={{
                      height: '38px',
                      fontSize: '13px',
                      fontWeight: '800',
                      backgroundColor: '#059669',
                      borderColor: '#059669',
                      gap: '6px'
                    }}
                  >
                    <CheckCircle2 size={16} /> Approve & Publish Live to Customer Marketplace
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* ================= TAB 2: LIVE MARKETPLACE CATALOG ================= */}
      {activeTab === 'LIVE' && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={14} color="#64748B" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                placeholder="Search live catalog..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{ width: '100%', padding: '6px 10px 6px 32px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '12px' }}
              />
            </div>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>{filteredLiveProducts.length} Active Listings</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#0F172A' }}>
            <thead>
              <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '12px 16px' }}>Listing Details</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Price</th>
                <th style={{ padding: '12px 16px' }}>Seller / Vendor</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLiveProducts.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '38px', height: '38px', backgroundColor: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={product.thumbnail} alt={product.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#2563EB', textTransform: 'uppercase' }}>
                        {product.brand}
                      </span>
                      <div style={{ fontWeight: '700', color: '#0F172A', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.title}
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px', color: '#64748B' }}>{product.category}</td>
                  <td style={{ padding: '12px 16px', color: '#059669', fontWeight: '900' }}>₹{product.price?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px 16px', color: '#64748B' }}>{product.seller?.name || 'Avero Verified Retail'}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', color: '#059669', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '4px', fontWeight: '800' }}>
                      ✓ Live on Marketplace
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
