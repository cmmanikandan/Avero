import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Calendar,
  Eye,
  EyeOff,
  X,
  ExternalLink,
  Sparkles,
  Zap,
  Globe,
  Tag,
  ArrowRight
} from 'lucide-react';

const DEFAULT_HERO_BANNERS = [
  {
    id: 'bnr-1',
    tag: 'FLAGSHIP LAUNCH 2026',
    title: 'Apple iPhone 15 Pro & M3 Max',
    subtitle: 'Titanium design. A17 Pro chip. Pro camera system. Starting at ₹1,34,900 with No-Cost EMI.',
    accent: '#818CF8',
    category: 'Homepage Hero',
    link: '/products?category=mobiles',
    img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&q=80',
    stat: 'Over 12,000+ Verified Reviews',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    active: true,
    clicks: 0,
    impressions: 0
  },
  {
    id: 'bnr-2',
    tag: 'STUDIO AUDIO & ANC',
    title: 'Sony WH-1000XM5 & Bose Ultra',
    subtitle: 'Industry-leading noise cancellation. 30-hour battery. Studio Hi-Res certified sound.',
    accent: '#06B6D4',
    category: 'Homepage Hero',
    link: '/products?category=audio',
    img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&q=80',
    stat: 'Special Flat ₹2,000 Voucher',
    startDate: '2026-08-15',
    endDate: '2026-09-15',
    active: true,
    clicks: 0,
    impressions: 0
  },
  {
    id: 'bnr-3',
    tag: 'STREETWEAR & RUNNING',
    title: 'Nike Air Zoom & Street Luxe',
    subtitle: 'Engineered responsiveness and sculpted aesthetics for performance and lifestyle.',
    accent: '#F43F5E',
    category: 'Homepage Hero',
    link: '/products?category=footwear',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80',
    stat: 'Up to 40% Off New Seasons',
    startDate: '2026-08-10',
    endDate: '2026-09-30',
    active: true,
    clicks: 0,
    impressions: 0
  }
];

const PRESET_IMAGES = [
  { name: 'Apple Flagship', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&q=80' },
  { name: 'Sony Headphones', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&q=80' },
  { name: 'Nike Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80' },
  { name: 'Gaming Rig', url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=700&q=80' },
  { name: 'Luxury Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80' }
];

export default function AdminBanners() {
  const { showToast } = useApp();

  const [banners, setBanners] = useState(() => {
    try {
      const saved = localStorage.getItem('avero_home_banners');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return DEFAULT_HERO_BANNERS;
  });

  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    tag: 'EXCLUSIVE OFFER',
    accent: '#3B82F6',
    category: 'Homepage Hero',
    link: '/products?category=electronics',
    img: PRESET_IMAGES[0].url,
    stat: 'Special Limited Period Deals',
    startDate: 'Today',
    endDate: '30 Sep 2026'
  });

  // Save to LocalStorage whenever banners update
  useEffect(() => {
    try {
      localStorage.setItem('avero_home_banners', JSON.stringify(banners));
    } catch (_) {}
  }, [banners]);

  const handleToggleActive = (id) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
    showToast('Banner visibility toggled on Homepage!', 'info');
  };

  const handleDelete = (id) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    showToast('Banner removed from rotation', 'info');
  };

  const handleCreateBanner = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast('Please enter a banner title', 'warning');
      return;
    }

    const newBanner = {
      id: `bnr-${Date.now()}`,
      ...form,
      active: true,
      clicks: 0,
      impressions: 0
    };

    setBanners(prev => [newBanner, ...prev]);
    setShowAddModal(false);
    showToast(`🎉 New Banner "${form.title}" published live to Homepage!`, 'success');
  };

  const totalImpressions = banners.reduce((acc, b) => acc + (b.impressions || 0), 0);
  const totalClicks = banners.reduce((acc, b) => acc + (b.clicks || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Top Banner Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        borderRadius: '18px',
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
            background: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(56, 189, 248, 0.4)'
          }}>
            <ImageIcon size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '19px', fontWeight: '900', margin: 0, color: '#FFFFFF' }}>
              Homepage Hero Banners & Campaign Studio
            </h1>
            <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: '2px 0 0' }}>
              Design, schedule, and instantly publish high-impact hero carousels and seasonal promotion banners to the customer homepage
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            style={{
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
            }}
          >
            <Plus size={16} /> + Create New Hero Banner
          </button>
          <Link
            to="/"
            target="_blank"
            style={{
              backgroundColor: '#1E293B',
              color: '#FFFFFF',
              border: '1px solid #475569',
              borderRadius: '10px',
              padding: '9px 16px',
              fontSize: '12.5px',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Globe size={14} /> Preview Live Homepage <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        {[
          { label: 'Total Banners Configured', value: banners.length, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
          { label: 'Live on Homepage', value: banners.filter(b => b.active).length, color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
          { label: 'Total Ad Impressions', value: `${(totalImpressions / 1000).toFixed(1)}K`, color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
          { label: 'Click-Through Volume', value: totalClicks.toLocaleString('en-IN'), color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: s.bg, borderRadius: '12px', border: `1px solid ${s.border}`, padding: '16px 20px' }}>
            <div style={{ fontSize: '24px', fontWeight: '950', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#475569', fontWeight: '800', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Active Banners Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '18px' }}>
        {banners.map(banner => {
          const ctr = banner.impressions > 0 ? ((banner.clicks / banner.impressions) * 100).toFixed(2) : '0.00';

          return (
            <div
              key={banner.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Visual Banner Preview Container */}
              <div style={{
                position: 'relative',
                height: '160px',
                background: `radial-gradient(ellipse at 80% 50%, ${banner.accent || '#3B82F6'}40, transparent 70%), #090D16`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                color: '#FFFFFF'
              }}>
                <div style={{ maxWidth: '60%', zIndex: 2 }}>
                  <span style={{ fontSize: '9px', fontWeight: '800', backgroundColor: banner.accent || '#3B82F6', color: '#FFFFFF', padding: '2px 8px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {banner.tag || 'FEATURED'}
                  </span>
                  <div style={{ fontSize: '15px', fontWeight: '900', color: '#FFFFFF', marginTop: '6px', lineHeight: '1.2' }}>
                    {banner.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {banner.subtitle}
                  </div>
                </div>

                <img
                  src={banner.img}
                  alt={banner.title}
                  style={{ width: '100px', height: '100px', objectFit: 'contain', zIndex: 2, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
                />

                <span style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: banner.active ? '#059669' : '#64748B',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  zIndex: 3
                }}>
                  {banner.active ? '● LIVE ON HOMEPAGE' : '○ PAUSED'}
                </span>
              </div>

              {/* Banner Details */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center', backgroundColor: '#F8FAFC', padding: '8px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '900', color: '#0F172A' }}>{(banner.impressions / 1000).toFixed(1)}K</div>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700' }}>Impressions</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '900', color: '#0F172A' }}>{banner.clicks.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700' }}>Clicks</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '900', color: '#2563EB' }}>{ctr}%</div>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700' }}>CTR</div>
                  </div>
                </div>

                <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                  Destination Link: <code style={{ backgroundColor: '#F1F5F9', padding: '1px 4px', borderRadius: '4px', color: '#2563EB' }}>{banner.link}</code>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(banner.id)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${banner.active ? '#FECACA' : '#A7F3D0'}`,
                      backgroundColor: banner.active ? '#FEF2F2' : '#ECFDF5',
                      color: banner.active ? '#DC2626' : '#059669',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {banner.active ? <EyeOff size={14} /> : <Eye size={14} />} {banner.active ? 'Pause from Home' : 'Publish Live to Home'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(banner.id)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '8px',
                      border: '1px solid #FECACA',
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Delete Banner"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CREATE NEW HERO BANNER MODAL
      ─────────────────────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div
            className="modal-content"
            style={{
              maxWidth: '620px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              margin: '20px auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '18px 24px', backgroundColor: '#0F172A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="#38BDF8" />
                <h3 style={{ fontSize: '17px', fontWeight: '900', margin: 0 }}>Create New Homepage Hero Banner</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateBanner} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Live Preview Box */}
              <div style={{
                borderRadius: '14px',
                background: `radial-gradient(ellipse at 80% 50%, ${form.accent}40, transparent 70%), #090D16`,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#FFFFFF'
              }}>
                <div style={{ maxWidth: '65%' }}>
                  <span style={{ fontSize: '9px', fontWeight: '800', backgroundColor: form.accent, color: '#FFFFFF', padding: '2px 8px', borderRadius: '9999px' }}>
                    {form.tag || 'TAG BADGE'}
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#FFFFFF', marginTop: '4px' }}>
                    {form.title || 'Banner Title Headline'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                    {form.subtitle || 'Promotional subtitle and product value proposition...'}
                  </div>
                </div>
                <img src={form.img} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
              </div>

              {/* Title & Tag */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Banner Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samsung Galaxy AI Mega Sale"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Category Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. MEGA LAUNCH 2026"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Subtitle / Offer Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Ultra camera with Galaxy AI. Starting at ₹1,19,999 with instant bank discount."
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              {/* Target Link & Accent Color */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Target Click Link</label>
                  <input
                    type="text"
                    placeholder="/products?category=mobiles"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Accent Color</label>
                  <input
                    type="color"
                    value={form.accent}
                    onChange={(e) => setForm({ ...form, accent: e.target.value })}
                    style={{ width: '100%', height: '38px', padding: '2px 4px', borderRadius: '8px', border: '1px solid #CBD5E1', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Preset Image Selection */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>Select Featured Product Image:</label>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {PRESET_IMAGES.map(img => (
                    <div
                      key={img.name}
                      onClick={() => setForm({ ...form, img: img.url })}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: form.img === img.url ? '2px solid #2563EB' : '1px solid #E2E8F0',
                        backgroundColor: form.img === img.url ? '#EFF6FF' : '#F8FAFC',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        fontSize: '11.5px',
                        fontWeight: '700'
                      }}
                    >
                      <img src={img.url} alt={img.name} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                      <span>{img.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  height: '44px',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                  marginTop: '6px'
                }}
              >
                🚀 Publish Hero Banner to Live Homepage
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
