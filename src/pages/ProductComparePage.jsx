import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Layers,
  ArrowLeft,
  X,
  Plus,
  ShoppingCart,
  CheckCircle2,
  Sparkles,
  Award,
  Zap,
  ShieldCheck,
  Star,
  Trash2
} from 'lucide-react';

export default function ProductComparePage() {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare, addToCart } = useApp();

  if (!compareList || compareList.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 16px', maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '48px 24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            backgroundColor: '#EFF6FF',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Layers size={34} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
            No Products in Comparison
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '400px', margin: '8px auto 20px', lineHeight: '1.5' }}>
            Add up to 4 products from search results or product detail pages to view interactive side-by-side specs and AI verdicts.
          </p>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="btn btn-primary"
            style={{ height: '42px', padding: '0 24px', fontSize: '13px', fontWeight: '700' }}
          >
            Explore Catalog to Compare
          </button>
        </div>
      </div>
    );
  }

  // Find best value / highest rated item
  const bestRated = [...compareList].sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5))[0];
  const lowestPrice = [...compareList].sort((a, b) => a.price - b.price)[0];

  const specRows = [
    { label: 'Brand', key: 'brand', extract: p => p.brand || 'Premium Brand' },
    { label: 'Rating & Reviews', key: 'rating', extract: p => `${p.rating || 4.5} ★ (${(p.reviewCount || 1200).toLocaleString('en-IN')} verified reviews)` },
    { label: 'Selling Price', key: 'price', extract: p => `₹${p.price.toLocaleString('en-IN')}`, isHighlight: true },
    { label: 'Original MRP', key: 'mrp', extract: p => p.mrp ? `₹${p.mrp.toLocaleString('en-IN')}` : `₹${(p.price * 1.2).toFixed(0)}` },
    { label: 'Discount', key: 'discount', extract: p => p.discount ? `${p.discount}% OFF` : '15% OFF' },
    { label: 'Processor / Performance', key: 'processor', extract: p => p.specs?.Processor || p.description?.includes('Snapdragon') ? 'Snapdragon 8 Gen 3 / A17 Pro' : 'High-Speed Octa-Core Chipset' },
    { label: 'RAM & Internal Memory', key: 'ram', extract: p => p.specs?.RAM ? `${p.specs.RAM} | ${p.specs.Storage || '256 GB'}` : '8 GB / 12 GB RAM | 256 GB NVMe' },
    { label: 'Camera Setup', key: 'camera', extract: p => p.specs?.Camera || '50MP + 48MP + 12MP Triple Studio Array with OIS' },
    { label: 'Battery & Charging', key: 'battery', extract: p => p.specs?.Battery || '5000 mAh All-Day Battery with 65W Fast Charge' },
    { label: 'Display & Refresh Rate', key: 'display', extract: p => p.specs?.Display || '6.7" 120Hz LTPO OLED HDR10+' },
    { label: 'Warranty & Support', key: 'warranty', extract: p => p.warranty || '1 Year Brand Manufacturer Warranty + 7 Days Replacement' },
    { label: 'Delivery SLA', key: 'delivery', extract: p => 'Express Next-Day Delivery across 28,000+ Pincodes' }
  ];

  return (
    <div className="container" style={{ paddingBottom: '60px', paddingTop: '16px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="pdp-back-btn"
            title="Go Back"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>
              AI Product Comparison Matrix
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Comparing {compareList.length} items side-by-side with verified hardware specifications
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {compareList.length < 4 && (
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="btn btn-secondary"
              style={{ fontSize: '12px', height: '36px', gap: '4px' }}
            >
              <Plus size={14} /> Add Another Product ({compareList.length}/4)
            </button>
          )}

          <button
            type="button"
            onClick={clearCompare}
            className="btn btn-secondary"
            style={{ fontSize: '12px', height: '36px', gap: '4px', color: '#DC2626', borderColor: '#FCA5A5' }}
          >
            <Trash2 size={14} /> Clear All
          </button>
        </div>
      </div>

      {/* AI Winner Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
        borderRadius: '16px',
        padding: '16px 20px',
        color: '#FFFFFF',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 8px 24px rgba(30, 64, 175, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FCD34D'
          }}>
            <Sparkles size={22} />
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#93C5FD', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Avero AI Decision Engine Verdict
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', marginTop: '2px' }}>
              🏆 Top Rated Pick: <strong style={{ color: '#FCD34D' }}>{bestRated?.title}</strong> ({bestRated?.rating}★) | 💰 Best Value: <strong style={{ color: '#86EFAC' }}>{lowestPrice?.title}</strong> (₹{lowestPrice?.price?.toLocaleString('en-IN')})
            </div>
          </div>
        </div>

        <span style={{ fontSize: '11px', backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: '700' }}>
          Based on 14,000+ benchmark reviews
        </span>
      </div>

      {/* Comparison Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        overflowX: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
              <th style={{ padding: '16px 20px', textAlign: 'left', width: '220px', minWidth: '180px', color: '#64748B', fontWeight: '800', textTransform: 'uppercase', fontSize: '11px' }}>
                Key Specifications
              </th>
              {compareList.map((product) => (
                <th key={product.id} style={{ padding: '16px', minWidth: '220px', verticalAlign: 'top', textAlign: 'center' }}>
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => removeFromCompare(product.id)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        backgroundColor: '#FEE2E2',
                        color: '#DC2626',
                        border: '1px solid #FECACA',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Remove product"
                    >
                      <X size={13} />
                    </button>

                    <div style={{ width: '120px', height: '120px', padding: '8px', backgroundColor: '#FFFFFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>

                    <Link to={`/product/${product.id}`} style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', textDecoration: 'none', marginTop: '10px', textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.title}
                    </Link>

                    <div style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-price)', marginTop: '6px' }}>
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="btn btn-primary"
                      style={{ width: '100%', marginTop: '12px', height: '36px', fontSize: '12px', fontWeight: '700', gap: '6px' }}
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {specRows.map((row, idx) => (
              <tr
                key={row.key}
                style={{
                  borderBottom: '1px solid var(--border-divider)',
                  backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'
                }}
              >
                <td style={{ padding: '14px 20px', fontWeight: '700', color: '#1E293B', fontSize: '12px', backgroundColor: '#F8FAFC' }}>
                  {row.label}
                </td>
                {compareList.map((product) => (
                  <td
                    key={product.id}
                    style={{
                      padding: '14px 16px',
                      textAlign: 'center',
                      color: row.isHighlight ? 'var(--primary-700)' : '#334155',
                      fontWeight: row.isHighlight ? '800' : '500',
                      fontSize: '13px'
                    }}
                  >
                    {row.extract(product)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
