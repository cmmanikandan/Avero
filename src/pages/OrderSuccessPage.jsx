import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { generateTaxInvoice } from '../services/invoiceGenerator';
import ProductCard from '../components/product/ProductCard';
import {
  CheckCircle2,
  PackageCheck,
  MapPin,
  ArrowRight,
  ShoppingBag,
  Truck,
  Download,
  Share2,
  ListOrdered,
  Calendar,
  CreditCard,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function OrderSuccessPage() {
  const { orderId: paramOrderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, showToast, user, products = [] } = useApp();

  const searchParams = new URLSearchParams(location.search);
  const orderId = paramOrderId || searchParams.get('orderId') || (orders[0] ? orders[0].id : '');

  const currentOrder = useMemo(() => {
    return orders.find(o => o.id === orderId) || orders[0] || (orderId ? {
      id: orderId,
      date: 'Today',
      status: 'Confirmed',
      totalAmount: 0,
      paymentMethod: 'UPI',
      estimatedDelivery: 'Estimated within 2-3 days',
      deliveryAddress: {
        name: user?.name || 'Customer',
        flat: 'Direct Delivery Address',
        area: '',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001'
      },
      items: []
    } : null);
  }, [orders, orderId, user]);

  const [activeRecTab, setActiveRecTab] = useState('BUY_AGAIN'); // 'BUY_AGAIN' | 'SIMILAR' | 'RECENT'
  const [isScratchOpen, setIsScratchOpen] = useState(false);

  useEffect(() => {
    // One-time celebratory confetti burst
    try {
      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.55 },
        colors: ['#1366E2', '#10B981', '#FF9F00', '#FB641B', '#00C3F8']
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Avero Order Confirmed: ${currentOrder.id}`,
        text: `My order ${currentOrder.id} has been placed on Avero!`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      showToast('Order link copied to clipboard!', 'success');
    }
  };

  const handleDownloadInvoice = () => {
    showToast('Preparing your official Tax Invoice...', 'info');
    setTimeout(() => {
      generateTaxInvoice(currentOrder);
    }, 400);
  };

  const allAvailable = products.length > 0 ? products : PRODUCTS;
  const buyAgainProducts = allAvailable.slice(0, 4);
  const similarProducts = allAvailable.slice(4, 8);
  const recentProducts = allAvailable.slice(2, 6);

  const displayedRecs = activeRecTab === 'BUY_AGAIN'
    ? buyAgainProducts
    : activeRecTab === 'SIMILAR'
    ? similarProducts
    : recentProducts;

  return (
    <div className="container" style={{ padding: '24px 16px 80px', maxWidth: '820px', margin: '0 auto' }}>
      
      {/* Main Success Container */}
      <div
        className="order-success-card"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '36px 28px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        {/* Large 96px Green Success Circle with Self-Drawing Checkmark */}
        <div
          className="success-circle-anim"
          style={{
            width: '96px',
            height: '96px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#E8F5E9',
            border: '3px solid #10B981',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 0 8px rgba(16, 185, 129, 0.12)'
          }}
        >
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="checkmark-svg">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        {/* Success Header Message */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--savings-green)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
            Payment Confirmed • 100% Genuine Certified
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>
            Order Placed Successfully!
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '520px', lineHeight: '1.5' }}>
            Thank you for shopping with Avero. Your order has been confirmed and is being prepared for swift delivery.
          </p>
        </div>

        {/* Exclusive Next Order Promo Voucher Card */}
        <div
          style={{
            width: '100%',
            backgroundColor: '#EFF6FF',
            borderRadius: '12px',
            border: '1.5px dashed #3B82F6',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#1E40AF' }}>
                🎉 Special Gift: ₹250 Voucher for Your Next Order!
              </div>
              <div style={{ fontSize: '12px', color: '#3B82F6', marginTop: '2px' }}>
                Use promo code <strong style={{ backgroundColor: '#DBEAFE', color: '#1E3A8A', padding: '1px 6px', borderRadius: '4px' }}>VOUCHER250</strong> on your next purchase
              </div>
            </div>
          </div>

          <Link
            to="/coupons"
            className="btn btn-primary"
            style={{
              height: '36px',
              padding: '0 16px',
              fontSize: '12.5px',
              fontWeight: '800',
              textDecoration: 'none'
            }}
          >
            Explore All Coupons →
          </Link>
        </div>

        {/* Order Summary 2x2 Grid Card */}
        <div
          style={{
            width: '100%',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            border: '1px solid var(--border-subtle)'
          }}
        >
          {/* Quick Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '14px',
              paddingBottom: '14px',
              borderBottom: '1px solid var(--border-divider)'
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
                Order ID
              </span>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary-700)', marginTop: '2px' }}>
                {currentOrder.id}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
                Estimated Delivery
              </span>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--savings-green)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Truck size={15} /> {currentOrder.estimatedDelivery || 'Tomorrow by 5 PM'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
                Payment Method
              </span>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CreditCard size={15} color="var(--primary-600)" /> {currentOrder.paymentMethod || 'UPI'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
                Total Paid
              </span>
              <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-price)', marginTop: '2px' }}>
                ₹{currentOrder.totalAmount?.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Delivery Address Details */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <MapPin size={18} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>
                {currentOrder.deliveryAddress?.name || 'Customer'}
              </strong>
              {' • '}
              {currentOrder.deliveryAddress?.flat}, {currentOrder.deliveryAddress?.area || ''} {currentOrder.deliveryAddress?.city} - {currentOrder.deliveryAddress?.pincode}
            </div>
          </div>
        </div>

        {/* Purchased Products Preview List */}
        <div style={{ width: '100%', textAlign: 'left' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>
            Purchased Products ({currentOrder.items?.length || 1})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentOrder.items?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ width: '64px', height: '64px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={item.thumbnail || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80'}
                    alt={item.title}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link
                    to={`/product/${item.id}`}
                    style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.title}
                  </Link>

                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Variant: <strong>{item.variant || 'Standard'}</strong> • Qty: <strong>{item.quantity}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-price)' }}>
                    ₹{item.price?.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Primary & Secondary Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => navigate(`/orders/${currentOrder.id}`)}
            className="btn btn-primary"
            style={{
              flex: '1 1 240px',
              height: '48px',
              minHeight: '48px',
              fontSize: '15px',
              fontWeight: '800',
              gap: '8px'
            }}
          >
            <PackageCheck size={18} /> View Order Details & Track Shipment <ArrowRight size={17} />
          </button>

          <Link
            to="/products"
            className="btn btn-secondary"
            style={{
              flex: '1 1 180px',
              height: '48px',
              minHeight: '48px',
              fontSize: '15px',
              fontWeight: '700',
              gap: '8px'
            }}
          >
            <ShoppingBag size={17} /> Continue Shopping
          </Link>
        </div>

        {/* Quick Utility Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            width: '100%',
            flexWrap: 'wrap',
            paddingTop: '14px',
            borderTop: '1px solid var(--border-divider)'
          }}
        >
          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="btn btn-tertiary"
            style={{ fontSize: '13px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={16} color="var(--primary-600)" /> Download Official Tax Invoice (PDF)
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="btn btn-tertiary"
            style={{ fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Share2 size={15} color="var(--primary-600)" /> Share Order
          </button>

          <Link
            to="/orders"
            style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary-600)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            All Past Orders <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Recommended Section (Buy Again, Similar, Recently Viewed) */}
      {displayedRecs.length > 0 && (
        <section style={{ marginTop: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                Recommended For You
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Handpicked deals based on your recent purchase
              </div>
            </div>

            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setActiveRecTab('BUY_AGAIN')}
                className={`pdp-pill-btn ${activeRecTab === 'BUY_AGAIN' ? 'active' : ''}`}
                style={{ height: '34px', minHeight: '34px', padding: '0 14px', fontSize: '12px' }}
              >
                Buy Again
              </button>

              <button
                type="button"
                onClick={() => setActiveRecTab('SIMILAR')}
                className={`pdp-pill-btn ${activeRecTab === 'SIMILAR' ? 'active' : ''}`}
                style={{ height: '34px', minHeight: '34px', padding: '0 14px', fontSize: '12px' }}
              >
                Similar Products
              </button>

              <button
                type="button"
                onClick={() => setActiveRecTab('RECENT')}
                className={`pdp-pill-btn ${activeRecTab === 'RECENT' ? 'active' : ''}`}
                style={{ height: '34px', minHeight: '34px', padding: '0 14px', fontSize: '12px' }}
              >
                Recently Viewed
              </button>
            </div>
          </div>

          {/* Products Horizontal Carousel Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '14px',
            overflowX: 'auto',
            paddingBottom: '6px'
          }}>
            {displayedRecs.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* SVG Animation Keyframes */}
      <style>{`
        .checkmark-svg {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: drawCheck 0.45s cubic-bezier(0.65, 0, 0.45, 1) 0.15s forwards;
        }

        @keyframes drawCheck {
          100% {
            stroke-dashoffset: 0;
          }
        }

        .success-circle-anim {
          animation: popScale 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes popScale {
          0% {
            transform: scale(0.6);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .order-success-card {
          animation: cardFadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes cardFadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
