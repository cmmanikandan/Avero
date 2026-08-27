import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Heart,
  ShoppingCart,
  Star,
  ShieldCheck,
  Truck,
  ArrowRight,
  ShoppingBag,
  LogIn
} from 'lucide-react';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { user, wishlist, toggleWishlist, addToCart, setIsAuthModalOpen, showToast } = useApp();
  const [animatingOutId, setAnimatingOutId] = useState(null);

  // If not authenticated, prompt to sign in
  if (!user.isAuth) {
    return (
      <div className="container" style={{ padding: '60px 16px', maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '48px 32px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#FEE2E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#EF4444'
          }}>
            <Heart size={40} strokeWidth={2} />
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            Sign In to View Your Wishlist
          </h1>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, maxWidth: '380px', lineHeight: '1.5' }}>
            Your saved wishlist items are synced across devices. Sign in to your Avero account to access them anytime.
          </p>

          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="btn btn-primary"
            style={{ marginTop: '10px', height: '46px', padding: '0 32px', fontSize: '14px', fontWeight: '700', gap: '8px' }}
          >
            <LogIn size={16} /> Sign In / Create Account
          </button>
        </div>
      </div>
    );
  }

  const wishlistedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  const handleRemoveWithUndo = (product) => {
    setAnimatingOutId(product.id);
    setTimeout(() => {
      toggleWishlist(product.id);
      setAnimatingOutId(null);
      
      showToast(
        'Removed from Wishlist',
        'info',
        {
          label: 'Undo',
          onClick: () => {
            toggleWishlist(product.id);
          }
        },
        4000
      );
    }, 200);
  };

  const handleMoveToCart = (product) => {
    setAnimatingOutId(product.id);
    setTimeout(() => {
      addToCart(product, null, 1);
      toggleWishlist(product.id);
      setAnimatingOutId(null);

      showToast(
        'Added to Cart',
        'success',
        {
          label: 'View Cart',
          onClick: () => navigate('/cart')
        },
        4000
      );
    }, 200);
  };

  // Empty Wishlist State for Authenticated Users
  if (wishlistedProducts.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 16px', maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '48px 32px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* Dual Heart + Shopping Bag Illustration Badge */}
          <div style={{
            position: 'relative',
            width: '88px',
            height: '88px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#FEE2E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#EF4444'
          }}>
            <Heart size={44} strokeWidth={1.8} />
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary-600)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #ffffff'
            }}>
              <ShoppingBag size={16} />
            </div>
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            Your Wishlist is Empty
          </h1>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, maxWidth: '360px', lineHeight: '1.5' }}>
            Save products you love and shop later. Explore our trending categories and tap the heart icon on any item!
          </p>

          <Link
            to="/products"
            className="btn btn-primary"
            style={{ marginTop: '12px', height: '46px', padding: '0 28px', fontSize: '14px', fontWeight: '700' }}
          >
            Explore Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '50px', paddingTop: '16px' }}>
      
      {/* Header */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '16px 20px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#FEE2E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Heart size={18} color="#EF4444" fill="#EF4444" />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              My Wishlist ({wishlistedProducts.length})
            </h1>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Items saved for later purchase
            </div>
          </div>
        </div>

        <Link
          to="/products"
          style={{ fontSize: '13px', color: 'var(--primary-600)', fontWeight: '700', textDecoration: 'none' }}
        >
          Add More Items →
        </Link>
      </div>

      {/* 4-Column Responsive Grid of Wishlist Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '16px'
      }}>
        {wishlistedProducts.map(product => {
          const isAnimatingOut = animatingOutId === product.id;

          return (
            <div
              key={product.id}
              className={`wishlist-card ${isAnimatingOut ? 'fade-out' : ''}`}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: 'var(--shadow-xs)',
                transition: 'all 0.18s ease'
              }}
            >
              {/* Top-Right Red Heart Icon */}
              <button
                type="button"
                onClick={() => handleRemoveWithUndo(product)}
                aria-label="Remove from wishlist"
                title="Remove from Wishlist"
                className="wishlist-heart-btn"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#EF4444',
                  zIndex: 2,
                  transition: 'all 0.16s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <Heart size={18} fill="#EF4444" color="#EF4444" />
              </button>

              {/* Product Thumbnail */}
              <Link
                to={`/product/${product.id}`}
                style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '160px', marginBottom: '12px' }}
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'transform 0.2s ease' }}
                  className="wishlist-img"
                />
              </Link>

              {/* Product Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    {product.brand}
                  </span>
                  {product.assured && (
                    <span className="badge-assured" style={{ fontSize: '10px', padding: '1px 5px' }}>
                      <ShieldCheck size={10} /> Assured
                    </span>
                  )}
                </div>

                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.4',
                    marginBottom: '8px',
                    minHeight: '36px'
                  }}>
                    {product.title}
                  </h3>
                </Link>

                {/* Rating Badge */}
                {product.rating && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      backgroundColor: 'var(--savings-green)',
                      color: '#ffffff',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '11px',
                      fontWeight: '800'
                    }}>
                      <span>{product.rating}</span>
                      <Star size={10} fill="#ffffff" stroke="none" />
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      ({product.ratingsCount ? product.ratingsCount.toLocaleString('en-IN') : '1.2k'})
                    </span>
                  </div>
                )}

                {/* Price & Discount */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-price)' }}>
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.mrp > product.price && (
                    <>
                      <span style={{ fontSize: '12px', color: 'var(--text-strikethrough)', textDecoration: 'line-through' }}>
                        ₹{product.mrp.toLocaleString('en-IN')}
                      </span>
                      <span className="badge-discount" style={{ fontSize: '11px', fontWeight: '800' }}>
                        {product.discount}% off
                      </span>
                    </>
                  )}
                </div>

                {/* Delivery Tag */}
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '14px' }}>
                  <Truck size={13} color="var(--primary-600)" /> Free Delivery by <strong>Tomorrow</strong>
                </div>
              </div>

              {/* Bottom Full-Width "Move to Cart" Button */}
              <button
                type="button"
                onClick={() => handleMoveToCart(product)}
                className="btn btn-add-cart"
                style={{
                  width: '100%',
                  height: '42px',
                  minHeight: '42px',
                  fontSize: '13px',
                  fontWeight: '700',
                  gap: '6px',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <ShoppingCart size={16} /> Move to Cart
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        .wishlist-heart-btn:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }

        .wishlist-heart-btn:active {
          transform: scale(0.85);
        }

        .wishlist-card:hover {
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .wishlist-card:hover .wishlist-img {
          transform: scale(1.04);
        }

        .wishlist-card.fade-out {
          opacity: 0;
          transform: scale(0.92);
          transition: all 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
