import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  TrendingUp,
  Plus,
  Sparkles,
  BarChart2,
  IndianRupee,
  Eye,
  MousePointer,
  CheckCircle2,
  X,
  Trash2,
  Tag,
  Target,
  Play,
  Pause
} from 'lucide-react';

const SUGGESTED_KEYWORDS = [
  '5g smartphone', 'wireless earbuds', 'running shoes', 'noise cancelling', 'flagship mobile', 'laptop m3', 'smart watch'
];

export default function SellerAdCampaigns() {
  const { sponsoredCampaigns = [], createAdCampaign, showToast, products = [], user } = useApp();

  const activeStoreName = user?.storeName || (user?.name ? `${user.name}'s Store` : '');
  const myCampaigns = sponsoredCampaigns.filter(c => 
    !c.name?.toLowerCase().includes('summer boost') && 
    !c.name?.toLowerCase().includes('flagship audio') &&
    (
      (activeStoreName && (c.seller === activeStoreName || c.sellerName === activeStoreName)) ||
      (user?.email && (c.sellerEmail === user?.email || c.submittedBy === user?.email)) ||
      (user?.merchantId && c.merchantId === user?.merchantId)
    )
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    productTitle: products[0]?.title || '',
    dailyBudget: 500,
    keywords: '',
    seller: activeStoreName,
    sellerEmail: user?.email || ''
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newCampaign.name.trim()) {
      showToast('Please provide a campaign name', 'error');
      return;
    }

    createAdCampaign({
      ...newCampaign,
      seller: activeStoreName,
      sellerEmail: user?.email || ''
    });
    setIsModalOpen(false);
    setNewCampaign({
      name: '',
      productTitle: products[0]?.title || '',
      dailyBudget: 500,
      keywords: '',
      seller: activeStoreName,
      sellerEmail: user?.email || ''
    });
    showToast(`Campaign "${newCampaign.name}" launched live!`, 'success');
  };

  const addKeyword = (kw) => {
    const existing = newCampaign.keywords ? newCampaign.keywords.split(',').map(k => k.trim()) : [];
    if (!existing.includes(kw)) {
      setNewCampaign(prev => ({
        ...prev,
        keywords: existing.concat(kw).join(', ')
      }));
    }
  };

  const totalSpent = myCampaigns.reduce((sum, c) => sum + (c.spent || 0), 0);
  const totalClicks = myCampaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
  const totalImpressions = myCampaigns.reduce((sum, c) => sum + (c.impressions || 0), 0);
  const avgRoas = myCampaigns.length > 0
    ? (myCampaigns.reduce((sum, c) => sum + (parseFloat(c.roas) || 0), 0) / myCampaigns.length).toFixed(1)
    : '0.0';
  const ctrRate = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0.0';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '900', margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={22} color="#D97706" /> Sponsored Products & Keyword Ad Campaigns
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', margin: '4px 0 0' }}>
            Boost your product visibility with targeted keyword search ads and pay-per-click optimization
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} /> Create Sponsored Campaign
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px'
      }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Total Ad Spend</div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#0F172A', marginTop: '6px' }}>
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: '#059669', fontWeight: '700', marginTop: '3px' }}>Avg. ROAS: {avgRoas}x Revenue</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Ad Impressions</div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#2563EB', marginTop: '6px' }}>
            {totalImpressions.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>Search Results Top Placement</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Total Ad Clicks</div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#D97706', marginTop: '6px' }}>
            {totalClicks.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: '#059669', fontWeight: '700', marginTop: '3px' }}>CTR: {ctrRate}% Conversion</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Active Campaigns</div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#7C3AED', marginTop: '6px' }}>
            {myCampaigns.length} Running
          </div>
          <div style={{ fontSize: '11px', color: '#059669', fontWeight: '700', marginTop: '3px' }}>Real-time Bidding Active</div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={16} color="#2563EB" /> Active Sponsored Ad Campaigns
          </h3>
          <span style={{ fontSize: '12px', color: '#64748B' }}>Sorted by performance & spend</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#374151' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Campaign Name</th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Target Product</th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Daily Budget</th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Spent</th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Impressions / Clicks</th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>ROAS</th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {myCampaigns.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748B' }}>
                  <Zap size={36} color="#94A3B8" style={{ margin: '0 auto 10px', display: 'block' }} />
                  <strong style={{ display: 'block', fontSize: '15px', color: '#0F172A', marginBottom: '4px' }}>No Active Ad Campaigns</strong>
                  <span style={{ fontSize: '13px', display: 'block', marginBottom: '14px' }}>Create sponsored search campaigns to put your products at the top of customer search results.</span>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary"
                    style={{ padding: '0 16px', height: '36px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus size={14} /> Create First Campaign
                  </button>
                </td>
              </tr>
            ) : (
              myCampaigns.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '800', color: '#0F172A' }}>{c.name}</td>
                  <td style={{ padding: '14px 16px', color: '#2563EB', fontWeight: '600', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.productTitle}</td>
                  <td style={{ padding: '14px 16px', color: '#0F172A', fontWeight: '700' }}>₹{c.dailyBudget}/day</td>
                  <td style={{ padding: '14px 16px', color: '#D97706', fontWeight: '700' }}>₹{c.spent?.toLocaleString('en-IN') || 0}</td>
                  <td style={{ padding: '14px 16px', color: '#475569' }}>
                    {c.impressions?.toLocaleString('en-IN')} views • <strong style={{ color: '#0F172A' }}>{c.clicks} clicks</strong>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#059669', fontWeight: '800' }}>{c.roas || '0.0x'}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <span style={{ color: '#16A34A', backgroundColor: '#DCFCE7', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>
                      ● {c.status || 'Active'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE CAMPAIGN MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }} onClick={() => setIsModalOpen(false)}>
          <div
            style={{
              maxWidth: '520px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '28px',
              boxShadow: '0 20px 48px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={22} color="#D97706" />
                <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: '#0F172A' }}>
                  Launch New Sponsored Keyword Ad
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Campaign Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Festival Mega Sale Boost"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', color: '#0F172A', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Target Product Title
                </label>
                <input
                  type="text"
                  required
                  value={newCampaign.productTitle}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, productTitle: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', color: '#0F172A', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Daily Budget (₹/day)
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="number"
                    min={100}
                    step={50}
                    value={newCampaign.dailyBudget}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, dailyBudget: Number(e.target.value) }))}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', color: '#0F172A', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                  {[250, 500, 1000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setNewCampaign(prev => ({ ...prev, dailyBudget: amt }))}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: newCampaign.dailyBudget === amt ? '#EFF6FF' : '#FFFFFF',
                        color: newCampaign.dailyBudget === amt ? '#2563EB' : '#475569',
                        fontWeight: '700',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Target Search Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={newCampaign.keywords}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, keywords: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', color: '#0F172A', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#64748B', alignSelf: 'center' }}>Suggested:</span>
                  {SUGGESTED_KEYWORDS.slice(0, 5).map(kw => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => addKeyword(kw)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: '1px solid #BFDBFE',
                        backgroundColor: '#EFF6FF',
                        color: '#1D4ED8',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      + {kw}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, height: '42px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#374151', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, height: '42px', borderRadius: '8px', border: 'none', backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <Sparkles size={15} /> Launch Ad Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
