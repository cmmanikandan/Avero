import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/product/ProductCard';
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  Store,
  MapPin,
  Calendar,
  Truck,
  RotateCcw,
  CheckCircle2,
  Package,
  Search
} from 'lucide-react';

export default function SellerProfilePage() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { products = [] } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  // Find products associated with this seller
  const sellerProducts = useMemo(() => {
    return products.filter((p) => {
      if (!sellerId) return true;
      const sLower = (p.seller?.name || p.seller?.id || '').toLowerCase();
      const target = sellerId.toLowerCase();
      return sLower.includes(target) || target.includes(sLower);
    });
  }, [sellerId, products]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return sellerProducts;
    return sellerProducts.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sellerProducts, searchQuery]);

  const sellerName = sellerId
    ? sellerId.replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, (l) => l.toUpperCase())
    : 'Partner Store';

  return (
    <div className="container" style={{ maxWidth: '1280px', padding: '16px 16px 80px', margin: '0 auto' }}>
      {/* Header with Back button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="pdp-floating-btn"
          aria-label="Go back"
          style={{ width: '38px', height: '38px' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            Seller Storefront
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Official Merchant Profile & Catalog
          </div>
        </div>
      </div>

      {/* Seller Hero Banner & Info Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        {/* Banner Gradient Header */}
        <div
          style={{
            height: '100px',
            background: 'linear-gradient(135deg, #072B66 0%, #1366E2 50%, #00C3F8 100%)',
            position: 'relative'
          }}
        />

        {/* Profile Content */}
        <div style={{ padding: '0 24px 24px', position: 'relative' }}>
          {/* Avatar Icon */}
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#ffffff',
              border: '3px solid #ffffff',
              boxShadow: 'var(--shadow-md)',
              marginTop: '-36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-600)',
              marginBottom: '12px'
            }}
          >
            <Store size={36} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  {sellerName.includes('Seller') ? 'SuperCom Retail Official' : sellerName}
                </h2>
                <span className="badge-assured" style={{ fontSize: '12px', padding: '3px 10px' }}>
                  <ShieldCheck size={14} /> Verified Partner Seller
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} color="var(--text-muted)" /> Bengaluru, Karnataka
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} color="var(--text-muted)" /> Seller since Jan 2023
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Package size={14} color="var(--text-muted)" /> {sellerProducts.length * 15}+ Items Sold
                </span>
              </div>
            </div>

            {/* Seller Rating Score */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 16px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--rating-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  4.8 <Star size={16} fill="var(--rating-green)" />
                </div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  24,500+ Ratings
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 16px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--primary-600)' }}>
                  98.4%
                </div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  On-Time Delivery
                </div>
              </div>
            </div>
          </div>

          {/* Seller Trust & Fulfillment Badges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-divider)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
              <CheckCircle2 size={16} color="var(--savings-green)" />
              <span>100% Genuine & Sealed Products</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
              <Truck size={16} color="var(--primary-600)" />
              <span>Fast 24-48hr Avero Express Dispatch</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
              <RotateCcw size={16} color="var(--primary-600)" />
              <span>7-Day Hassle Free Replacement Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Search & Products Grid */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
          Products from this Seller ({filteredProducts.length})
        </h3>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search seller's inventory..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '13px',
              backgroundColor: '#ffffff'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px' }}>
        {filteredProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
