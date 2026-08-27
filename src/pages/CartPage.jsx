import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AVAILABLE_COUPONS } from '../data/coupons';
import EmptyState from '../components/common/EmptyState';
import ProductCard from '../components/product/ProductCard';
import {
  Trash2,
  Heart,
  Plus,
  Minus,
  Tag,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  MapPin,
  ChevronRight,
  Zap,
  Gift
} from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    user,
    cart,
    removeFromCart,
    updateQuantity,
    toggleWishlist,
    currentAddress,
    setIsLocationSelectorOpen,
    setIsAuthModalOpen,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    showToast
  } = useApp();

  const handleProceedToCheckout = () => {
    if (!user?.isAuth) {
      showToast('Please sign in to your Avero account to proceed to checkout and place your order.', 'warning');
      setIsAuthModalOpen(true);
      return;
    }
    navigate('/checkout');
  };

  const [couponInput, setCouponInput] = useState('');
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 16px' }}>
        <EmptyState
          type="cart"
          title="Your Shopping Bag is Empty"
          description="Explore our handpicked luxury electronics, flagship devices, and streetwear collections."
          buttonText="Explore Collection"
          actionPath="/products"
        />
      </div>
    );
  }

  // Price calculations
  const totalMrp = cart.reduce((acc, item) => acc + (item.product.mrp * item.quantity), 0);
  const totalSellingPrice = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalProductDiscount = totalMrp - totalSellingPrice;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'fixed') {
      couponDiscount = appliedCoupon.discountAmount;
    } else if (appliedCoupon.discountType === 'percentage') {
      couponDiscount = Math.min(
        appliedCoupon.maxDiscount || 9999,
        Math.round((totalSellingPrice * appliedCoupon.discountPercentage) / 100)
      );
    }
  }

  const platformFee = 7;
  const deliveryFee = totalSellingPrice > 500 ? 0 : 40;
  const finalTotal = Math.max(0, totalSellingPrice - couponDiscount + platformFee + deliveryFee);
  const totalSavings = totalProductDiscount + couponDiscount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCouponCode(couponInput.trim());
    if (success) {
      setCouponInput('');
      setIsCouponModalOpen(false);
    }
  };

  const handleApplySpecificCoupon = (code) => {
    const success = applyCouponCode(code);
    if (success) {
      setIsCouponModalOpen(false);
    }
  };

  const handleMoveToWishlist = (item) => {
    toggleWishlist(item.product.id);
    removeFromCart(item.product.id);
    showToast(`Saved "${item.product.title.slice(0, 20)}..." to Wishlist`, 'info');
  };

  // Cross-sell items
  const missedItems = PRODUCTS.filter(p => !cart.some(c => c.product.id === p.id)).slice(0, 4);

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '90px', paddingTop: '24px' }}>
      <div className="container">
        
        {/* Main 2-Column Responsive Studio Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 380px',
          gap: '24px',
          alignItems: 'start'
        }} className="cart-grid-responsive">
          
          {/* =========================================================================
             LEFT COLUMN: Delivery Info, Cart Items List & Cross-sell
             ========================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 1. Delivery Location Confirmation Pill */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#EEF2FF',
                  color: '#4F46E5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', color: '#0F172A' }}>
                    Deliver to:{' '}
                    <strong>
                      {currentAddress ? `${currentAddress.name}, ${currentAddress.pincode}` : 'Select Delivery Location'}
                    </strong>
                  </div>
                  {currentAddress && (
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                      {currentAddress.flat}, {currentAddress.area}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLocationSelectorOpen(true)}
                style={{
                  fontSize: '12.5px',
                  fontWeight: '800',
                  color: '#4F46E5',
                  backgroundColor: '#EEF2FF',
                  border: '1px solid #E0E7FF',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                Change
              </button>
            </div>

            {/* 2. Cart Items Studio Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h1 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Items in Bag ({cart.length})
                </h1>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  ⚡ Free Express Delivery Eligible
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {cart.map((item, idx) => {
                  const { product, quantity, selectedVariant } = item;
                  const variantText = selectedVariant
                    ? Object.values(selectedVariant).filter(Boolean).join(' • ')
                    : '';

                  return (
                    <div
                      key={product.id}
                      style={{
                        padding: '20px',
                        borderBottom: idx === cart.length - 1 ? 'none' : '1px solid #F1F5F9',
                        display: 'flex',
                        gap: '20px',
                        alignItems: 'flex-start'
                      }}
                    >
                      {/* Product Thumbnail Frame */}
                      <Link
                        to={`/product/${product.id}`}
                        style={{
                          width: '100px',
                          height: '100px',
                          backgroundColor: '#F8FAFC',
                          borderRadius: '14px',
                          padding: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          textDecoration: 'none',
                          border: '1px solid #F1F5F9'
                        }}
                      >
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                        />
                      </Link>

                      {/* Product Info & Controls */}
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        
                        {/* Brand & Assured */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {product.brand}
                          </span>
                          {product.assured && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              backgroundColor: '#EEF2FF',
                              color: '#4F46E5',
                              fontSize: '10px',
                              fontWeight: '800',
                              padding: '1px 6px',
                              borderRadius: '9999px'
                            }}>
                              <ShieldCheck size={10} /> Assured
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                          <h2 style={{
                            fontSize: '15px',
                            fontWeight: '700',
                            color: '#0F172A',
                            lineHeight: '1.35',
                            margin: 0,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {product.title}
                          </h2>
                        </Link>

                        {/* Selected Variants */}
                        {variantText && (
                          <div style={{ fontSize: '12px', color: '#64748B' }}>
                            Configuration: <strong style={{ color: '#0F172A' }}>{variantText}</strong>
                          </div>
                        )}

                        {/* Pricing Row */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                          <span style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A' }}>
                            ₹{(product.price * quantity).toLocaleString('en-IN')}
                          </span>
                          {product.mrp > product.price && (
                            <>
                              <span style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'line-through' }}>
                                ₹{(product.mrp * quantity).toLocaleString('en-IN')}
                              </span>
                              <span style={{ fontSize: '12px', fontWeight: '800', color: '#059669' }}>
                                {product.discount}% off
                              </span>
                            </>
                          )}
                        </div>

                        {/* Aligned Bottom Controls Row: Quantity Stepper, Save for Later, Remove */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px',
                          marginTop: '8px',
                          paddingTop: '12px',
                          borderTop: '1px dashed #E2E8F0',
                          flexWrap: 'wrap'
                        }}>
                          {/* Minimalist Quantity Stepper */}
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            border: '1px solid #CBD5E1',
                            borderRadius: '9999px',
                            backgroundColor: '#FFFFFF',
                            padding: '2px 4px'
                          }}>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, -1)}
                              aria-label="Decrease quantity"
                              style={{
                                width: '26px',
                                height: '26px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#0F172A',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              <Minus size={12} />
                            </button>
                            <span style={{ width: '28px', textAlign: 'center', fontSize: '12.5px', fontWeight: '800', color: '#0F172A' }}>
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, 1)}
                              aria-label="Increase quantity"
                              style={{
                                width: '26px',
                                height: '26px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#0F172A',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Save & Remove Action Pills */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                              type="button"
                              onClick={() => handleMoveToWishlist(item)}
                              style={{
                                fontSize: '12px',
                                fontWeight: '700',
                                color: '#475569',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <Heart size={14} /> Save for Later
                            </button>

                            <button
                              type="button"
                              onClick={() => removeFromCart(product.id)}
                              style={{
                                fontSize: '12px',
                                fontWeight: '700',
                                color: '#DC2626',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Items You May Have Missed */}
            {missedItems.length > 0 && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Sparkles size={18} color="#F59E0B" />
                  <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    Recommended to Complement Your Order
                  </h2>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '14px'
                }}>
                  {missedItems.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
             RIGHT COLUMN: Promo Codes & Order Summary (Sticky on Desktop)
             ========================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '90px' }}>
            
            {/* 1. Coupons Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Tag size={16} color="#4F46E5" /> Apply Coupon Code
                </div>
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(true)}
                  style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#4F46E5',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  View All
                </button>
              </div>

              {appliedCoupon ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: '12px',
                  padding: '10px 14px'
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#065F46' }}>
                      Coupon '{appliedCoupon.code}' Applied!
                    </div>
                    <div style={{ fontSize: '11px', color: '#047857' }}>
                      You saved ₹{couponDiscount.toLocaleString('en-IN')} extra
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    style={{ color: '#DC2626', fontSize: '12px', fontWeight: '800', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter Code (e.g. AVERO500)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    style={{
                      flex: 1,
                      padding: '8px 14px',
                      borderRadius: '9999px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!couponInput.trim()}
                    style={{
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '8px 16px',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: couponInput.trim() ? 'pointer' : 'not-allowed',
                      opacity: couponInput.trim() ? 1 : 0.6
                    }}
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* 2. Order Summary Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
            }}>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                Order Summary ({cart.length} {cart.length === 1 ? 'Item' : 'Items'})
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#475569' }}>
                <span>Total MRP</span>
                <span style={{ color: '#0F172A', fontWeight: '600' }}>₹{totalMrp.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#059669' }}>
                <span>Catalog Discount</span>
                <span style={{ fontWeight: '700' }}>- ₹{totalProductDiscount.toLocaleString('en-IN')}</span>
              </div>

              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#059669' }}>
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span style={{ fontWeight: '700' }}>- ₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#475569' }}>
                <span>Platform Fee</span>
                <span style={{ color: '#0F172A', fontWeight: '600' }}>₹{platformFee}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#475569' }}>
                <span>Express Delivery</span>
                <span>
                  {deliveryFee === 0 ? (
                    <strong style={{ color: '#059669' }}>FREE</strong>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: '900',
                color: '#0F172A',
                borderTop: '1px solid #F1F5F9',
                paddingTop: '14px'
              }}>
                <span>Total Payable</span>
                <span style={{ color: '#0F172A' }}>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>

              {/* Total Savings Note */}
              <div style={{
                backgroundColor: '#ECFDF5',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '12px',
                fontWeight: '800',
                color: '#059669',
                textAlign: 'center'
              }}>
                ✨ You will save ₹{totalSavings.toLocaleString('en-IN')} on this order!
              </div>

              {/* Desktop Proceed to Checkout Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="btn btn-luxury-black"
                style={{
                  width: '100%',
                  height: '48px',
                  fontSize: '14.5px',
                  fontWeight: '800',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '4px'
                }}
              >
                <Zap size={16} fill="#ffffff" /> Proceed to Checkout
              </button>
            </div>
          </div>
        </div>

        {/* Coupon Modal (Centered) */}
        {isCouponModalOpen && (
          <div
            className="modal-backdrop"
            onClick={() => setIsCouponModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                maxWidth: '480px',
                width: '100%',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid #E2E8F0',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Tag size={18} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                    Available Coupons & Offers
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748B',
                    padding: '4px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
                {AVAILABLE_COUPONS.map((cpn) => (
                  <div
                    key={cpn.code}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '16px',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#F8FAFC',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: '900', color: '#4F46E5', letterSpacing: '0.6px', backgroundColor: '#EEF2FF', padding: '2px 8px', borderRadius: '6px' }}>
                          {cpn.code}
                        </span>
                        {cpn.badge && (
                          <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>
                            {cpn.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px', fontWeight: '600' }}>
                        {cpn.description || cpn.title}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplySpecificCoupon(cpn.code)}
                      style={{
                        backgroundColor: '#4F46E5',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '9999px',
                        padding: '7px 16px',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
                        flexShrink: 0
                      }}
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @media (max-width: 1023px) {
          .cart-grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
