import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/product/ProductCard';
import { ArrowLeft, ArrowUpDown, Filter, Package } from 'lucide-react';

export default function SimilarProductsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products = [] } = useApp();

  const allAvailable = products;
  const product = allAvailable.find((p) => String(p.id) === String(id)) || null;

  const [sortOption, setSortOption] = useState('POPULARITY');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [priceMax, setPriceMax] = useState(product ? product.price * 2.5 : 100000);

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 16px', maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Product Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
          We could not find the requested product to display similar items.
        </p>
        <Link to="/products" className="btn btn-primary">
          Explore Products
        </Link>
      </div>
    );
  }

  // Find all similar products in the same category or related categories
  const baseCandidates = useMemo(() => {
    const directSame = allAvailable.filter((p) => p.category === product.category && p.id !== product.id);
    const related = allAvailable.filter((p) => p.category !== product.category && p.id !== product.id);
    return [...directSame, ...related];
  }, [product, allAvailable]);

  // Extract available brands for filtering
  const availableBrands = useMemo(() => {
    const brands = new Set(baseCandidates.map((p) => p.brand).filter(Boolean));
    return ['ALL', ...Array.from(brands)];
  }, [baseCandidates]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return baseCandidates
      .filter((p) => {
        if (selectedBrand !== 'ALL' && p.brand !== selectedBrand) return false;
        if (p.price > priceMax) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'PRICE_LOW') return a.price - b.price;
        if (sortOption === 'PRICE_HIGH') return b.price - a.price;
        if (sortOption === 'RATING') return b.rating - a.rating;
        if (sortOption === 'DISCOUNT') return b.discount - a.discount;
        return (b.ratingsCount || 0) - (a.ratingsCount || 0); // Popularity
      });
  }, [baseCandidates, selectedBrand, priceMax, sortOption]);

  return (
    <div className="container" style={{ maxWidth: '1280px', padding: '16px 16px 80px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate(`/product/${product.id}`)}
            className="pdp-floating-btn"
            aria-label="Back to product"
            style={{ width: '38px', height: '38px' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              Similar Products
            </h1>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Handpicked alternatives to {product.title}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: '#ffffff',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '20px'
        }}
      >
        {/* Brand Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', flex: 1 }} className="no-scrollbar">
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={13} /> Brand:
          </span>
          {availableBrands.slice(0, 6).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBrand(b)}
              className={`pdp-pill-btn ${selectedBrand === b ? 'active' : ''}`}
              style={{ minHeight: '34px', padding: '4px 12px', fontSize: '12px' }}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowUpDown size={14} color="var(--text-secondary)" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              fontWeight: '600',
              backgroundColor: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <option value="POPULARITY">Most Popular</option>
            <option value="PRICE_LOW">Price: Low to High</option>
            <option value="PRICE_HIGH">Price: High to Low</option>
            <option value="RATING">Highest Customer Rating</option>
            <option value="DISCOUNT">Biggest Discount</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '14px'
        }}
      >
        {filteredProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export { SimilarProductsPage };
