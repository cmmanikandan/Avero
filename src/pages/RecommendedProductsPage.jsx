import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/product/ProductCard';
import { ArrowLeft, Sparkles, TrendingUp, Award, Clock, Package } from 'lucide-react';

export default function RecommendedProductsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products = [] } = useApp();

  const allAvailable = products.length > 0 ? products : PRODUCTS;
  const currentProduct = allAvailable.find((p) => String(p.id) === String(id)) || null;

  if (!currentProduct) {
    return (
      <div className="container" style={{ padding: '80px 16px', maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Product Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
          We could not find recommendations for this product.
        </p>
        <Link to="/products" className="btn btn-primary">
          Explore Products
        </Link>
      </div>
    );
  }

  const brandProducts = allAvailable.filter((p) => p.brand === currentProduct.brand && p.id !== currentProduct.id);
  const trendingProducts = allAvailable.filter((p) => p.tags?.includes('Hot Deal') || p.discount >= 15);
  const bestSellers = allAvailable.filter((p) => p.tags?.includes('Bestseller') || p.rating >= 4.6);
  const recentlyViewed = allAvailable.filter((p) => p.id !== currentProduct.id).slice(0, 4);

  return (
    <div className="container" style={{ maxWidth: '1280px', padding: '16px 16px 80px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate(`/product/${currentProduct.id}`)}
            className="pdp-floating-btn"
            aria-label="Back to product"
            style={{ width: '38px', height: '38px' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              Recommended for You
            </h1>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Personalized selections tailored to your interest in {currentProduct.title}
            </div>
          </div>
        </div>
      </div>

      {/* 1. More from Brand */}
      {brandProducts.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
              <Sparkles size={18} color="var(--primary-600)" />
              <span>More from {currentProduct.brand}</span>
            </div>
            <Link to={`/brand/${encodeURIComponent(currentProduct.brand.toLowerCase())}`} style={{ fontSize: '13px', color: 'var(--primary-600)', fontWeight: '700' }}>
              View Brand Store →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px' }}>
            {brandProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* 2. Trending Deals in Market */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
          <TrendingUp size={18} color="var(--action-buy)" />
          <span>Trending High Voltage Deals</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px' }}>
          {trendingProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* 3. Bestsellers */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
          <Award size={18} color="var(--savings-green)" />
          <span>Avero Certified Bestsellers</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px' }}>
          {bestSellers.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* 4. Recently Explored Items */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
          <Clock size={18} color="var(--primary-600)" />
          <span>Recently Explored on Avero</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px' }}>
          {recentlyViewed.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

export { RecommendedProductsPage };
