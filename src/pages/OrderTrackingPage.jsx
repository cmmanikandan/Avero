import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateTaxInvoice } from '../services/invoiceGenerator';
import LiveTrackingMap from '../components/delivery/LiveTrackingMap';
import ReturnRequestModal from '../components/orders/ReturnRequestModal';
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Phone,
  HelpCircle,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Download,
  Share2,
  ArrowLeft,
  KeyRound,
  ExternalLink,
  LogIn,
  XCircle,
  RotateCcw,
  Star,
  X,
  AlertTriangle
} from 'lucide-react';

export default function OrderTrackingPage() {
  const { orderId, id } = useParams();
  const activeOrderId = orderId || id;
  const navigate = useNavigate();
  const { user, orders, setIsAuthModalOpen, cancelOrder, showToast } = useApp();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Found a better price elsewhere');

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
            backgroundColor: '#E0F2FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-600)'
          }}>
            <Truck size={40} strokeWidth={2} />
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            Sign In to Track Shipment
          </h1>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, maxWidth: '380px', lineHeight: '1.5' }}>
            Please sign in to view real-time tracking, courier details, and the secure delivery verification OTP.
          </p>

          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="btn btn-primary"
            style={{ marginTop: '10px', height: '46px', padding: '0 32px', fontSize: '14px', fontWeight: '700', gap: '8px' }}
          >
            <LogIn size={16} /> Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  const order = orders.find(o => o.id === activeOrderId) || null;

  if (!order) {
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
          <Package size={44} color="var(--text-secondary)" />
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Order Not Found</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            We could not find the requested order tracking details in your account.
          </p>
          <Link to="/orders" className="btn btn-primary" style={{ marginTop: '8px', height: '42px' }}>
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const handleCallDriver = (phone) => {
    showToast(`Connecting call to delivery partner (${phone})...`, 'info');
  };

  const handleDownloadInvoice = () => {
    showToast('Generating official Tax Invoice...', 'info');
    setTimeout(() => {
      generateTaxInvoice(order);
    }, 400);
  };

  const handleCancelSubmit = (e) => {
    e.preventDefault();
    cancelOrder(order.id);
    setIsCancelModalOpen(false);
    showToast(`Order ${order.id} has been cancelled successfully.`, 'info');
  };

  const isDelivered = (order.status || '').toUpperCase().includes('DELIVER') && !(order.status || '').toUpperCase().includes('OUT');
  const isCancelled = (order.status || '').toUpperCase().includes('CANCEL');
  const isOutForDelivery = (order.status || '').toUpperCase().includes('OUT FOR DELIVERY');
  const isShipped = (order.status || '').toUpperCase().includes('SHIP') || (order.status || '').toUpperCase().includes('TRANSIT');
  const isPacked = (order.status || '').toUpperCase().includes('PACK');

  return (
    <div className="container" style={{ paddingBottom: '60px', paddingTop: '16px', maxWidth: '820px', margin: '0 auto' }}>
      
      {/* Back & Breadcrumbs Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="pdp-back-btn"
          aria-label="Go back"
          title="Back"
        >
          <ArrowLeft size={16} />
        </button>

        <Link to="/orders" style={{ color: 'var(--text-secondary)' }}>Orders</Link>
        <ChevronRight size={13} />
        <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>Track Shipment: {order.id}</span>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        
        {/* Header Status & Courier Information with Exact Color Indication */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-divider)',
          paddingBottom: '18px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Live Tracking • {order.id}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>
                Status:
              </h1>

              {isDelivered ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  border: '1px solid #86EFAC',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: '800'
                }}>
                  <CheckCircle2 size={16} /> Delivered
                </span>
              ) : isCancelled ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FEE2E2',
                  color: '#B91C1C',
                  border: '1px solid #FCA5A5',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: '800'
                }}>
                  <XCircle size={16} /> Cancelled
                </span>
              ) : isOutForDelivery ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#DBEAFE',
                  color: '#1D4ED8',
                  border: '1px solid #93C5FD',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: '800'
                }}>
                  <Truck size={16} /> Out for Delivery
                </span>
              ) : isShipped ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#E0F2FE',
                  color: '#0369A1',
                  border: '1px solid #7DD3FC',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: '800'
                }}>
                  <Truck size={16} /> Shipped / In Transit
                </span>
              ) : isPacked ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FEF3C7',
                  color: '#B45309',
                  border: '1px solid #FDE68A',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: '800'
                }}>
                  <Package size={16} /> Packed by Seller
                </span>
              ) : (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  border: '1px solid #CBD5E1',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: '800'
                }}>
                  <Clock size={16} /> Confirmed
                </span>
              )}
            </div>

            <div style={{ fontSize: '13px', color: isDelivered ? '#15803D' : isCancelled ? '#DC2626' : 'var(--savings-green)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
              {isDelivered ? <CheckCircle2 size={15} /> : isCancelled ? <XCircle size={15} /> : <Truck size={15} />}
              {isDelivered ? 'Delivered to Doorstep' : isCancelled ? 'Order Cancelled' : `Expected: ${order.estimatedDelivery || 'Tomorrow by 5 PM'}`}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>Logistics Partner</div>
            <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{order.courier?.partner || 'BlueDart Express'}</strong>
            <div style={{ fontSize: '12px', color: 'var(--primary-600)', fontWeight: '600' }}>
              Tracking: #{order.courier?.trackingNumber || 'BLR892104'}
            </div>
          </div>
        </div>

        {/* Delivery OTP & Secure Verification Badge - Shown when in transit/active */}
        {!isDelivered && !isCancelled && (
          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <KeyRound size={20} color="var(--primary-600)" />
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary-700)', textTransform: 'uppercase' }}>
                  Delivery Security OTP
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Share this OTP with the delivery executive at doorstep:
                </div>
              </div>
            </div>

            <div style={{
              fontSize: '18px',
              fontWeight: '900',
              color: 'var(--primary-700)',
              letterSpacing: '3px',
              backgroundColor: '#ffffff',
              padding: '4px 14px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid #93C5FD'
            }}>
              {order.courier?.otp || '7842'}
            </div>
          </div>
        )}

        {/* 6-Stage Tracking Timeline */}
        <div style={{ padding: '8px 0' }}>
          <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px' }}>
            Delivery Progress Timeline
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
            {(order.timeline || [
              { status: 'Ordered', date: '22 Aug, 10:30 AM', desc: 'Your order was placed successfully.', completed: true },
              { status: 'Confirmed', date: '22 Aug, 10:35 AM', desc: 'Order verified & confirmed by seller.', completed: true },
              { status: 'Packed', date: '22 Aug, 01:15 PM', desc: 'Item packed in tamper-proof box.', completed: true },
              { status: 'Shipped', date: '22 Aug, 04:00 PM', desc: 'Package handed over to BlueDart Express.', completed: true, current: true },
              { status: 'Out for Delivery', date: 'Tomorrow, 09:00 AM', desc: 'Delivery agent will arrive at your address.', completed: false },
              { status: 'Delivered', date: 'Tomorrow by 5:00 PM', desc: 'Handover at doorstep with OTP verification.', completed: false }
            ]).map((step, idx, arr) => {
              const isLast = idx === arr.length - 1;
              const isCurrent = step.current || (step.completed && arr[idx + 1] && !arr[idx + 1].completed);

              return (
                <div key={idx} style={{ display: 'flex', gap: '16px', position: 'relative', minHeight: '64px' }}>
                  {/* Icon & Connector Line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '32px' }}>
                    <div
                      className={isCurrent ? 'timeline-current-pulse' : ''}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: step.completed ? '#15803D' : isCurrent ? 'var(--primary-600)' : '#F1F5F9',
                        color: step.completed || isCurrent ? '#ffffff' : '#94A3B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {step.completed ? (
                        <CheckCircle2 size={16} />
                      ) : isCurrent ? (
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
                      ) : (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
                      )}
                    </div>

                    {!isLast && (
                      <div style={{
                        flex: 1,
                        width: '2px',
                        backgroundColor: step.completed ? '#15803D' : '#E2E8F0',
                        margin: '4px 0'
                      }} />
                    )}
                  </div>

                  {/* Step Description */}
                  <div style={{ flex: 1, paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{
                        fontSize: '14px',
                        color: step.completed ? 'var(--text-primary)' : isCurrent ? 'var(--primary-700)' : 'var(--text-secondary)'
                      }}>
                        {step.status}
                      </strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                        {step.date}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver Assigned Check */}
        {(() => {
          const isDriverAssigned =
            order.status === 'Packed' ||
            order.status === 'Shipped' ||
            order.status === 'In Transit' ||
            order.status === 'Out for Delivery' ||
            order.status === 'Delivered' ||
            order.timeline?.some(t => (t.status === 'Packed' || t.status === 'Shipped') && t.completed);

          if (isDriverAssigned && !isCancelled && !isDelivered) {
            return (
              <div style={{ marginBottom: '20px' }}>
                <LiveTrackingMap
                  driverName={order.courier?.driverName || 'Suresh Kumar'}
                  driverPhone="+91 98450 12345"
                  destination={order.deliveryAddress?.city || order.address?.city || 'Your Location'}
                  orderId={order.id}
                />
              </div>
            );
          }

          if (!isDriverAssigned && !isCancelled && !isDelivered) {
            return (
              <div style={{
                padding: '18px 20px',
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Package size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                    Order Processing & Packaging
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0', lineHeight: '1.4' }}>
                    Your item is being packed with tamper-proof security seals at the merchant fulfillment warehouse. Real-time GPS vehicle tracking and driver contact will activate once the package is dispatched.
                  </p>
                </div>
              </div>
            );
          }

          return null;
        })()}

        {/* =========================================================================
           ORDERED PRODUCTS LIST & DETAILS
           ========================================================================= */}
        <div style={{
          borderTop: '1px solid var(--border-divider)',
          paddingTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={18} color="#2563EB" /> Ordered Items ({order.items?.length || 0})
            </h3>
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              Total Paid: <strong style={{ color: '#0F172A' }}>₹{order.totalAmount?.toLocaleString('en-IN') || '0'}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(order.items || []).map((item, idx) => (
              <div
                key={item.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '16px'
                }}
              >
                {/* Left: Thumbnail & Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '260px' }}>
                  <Link
                    to={`/product/${item.id}`}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0,
                      textDecoration: 'none'
                    }}
                  >
                    <img
                      src={item.thumbnail || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80'}
                      alt={item.title}
                      style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                    />
                  </Link>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {item.brand && (
                      <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#2563EB', textTransform: 'uppercase' }}>
                        {item.brand} • Certified Avero Assured
                      </span>
                    )}
                    <Link
                      to={`/product/${item.id}`}
                      style={{
                        fontSize: '13.5px',
                        fontWeight: '700',
                        color: '#0F172A',
                        textDecoration: 'none',
                        lineHeight: '1.4'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#2563EB'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#0F172A'}
                    >
                      {item.title}
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '2px', fontSize: '12px', color: '#64748B' }}>
                      {item.variant && (
                        <span style={{ backgroundColor: '#E2E8F0', padding: '1px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', color: '#334155' }}>
                          {item.variant}
                        </span>
                      )}
                      <span>Qty: <strong style={{ color: '#0F172A' }}>{item.quantity || 1}</strong></span>
                      <span>•</span>
                      <span>Price: <strong style={{ color: '#0F172A' }}>₹{(item.price || 0).toLocaleString('en-IN')}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link
                    to={`/product/${item.id}`}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#0F172A',
                      fontSize: '12px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    View Product <ExternalLink size={13} />
                  </Link>

                  {isDelivered && (
                    <button
                      type="button"
                      onClick={() => navigate(`/product/${item.id}/reviews`)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        backgroundColor: '#FEF3C7',
                        border: '1px solid #FDE68A',
                        color: '#92400E',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Star size={13} fill="#D97706" color="#D97706" /> Rate & Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courier Driver & Delivery Address Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          borderTop: '1px solid var(--border-divider)',
          paddingTop: '18px'
        }}>
          {/* Delivery Executive Card - ONLY shown after Packed / Shipped */}
          {(() => {
            const isDriverAssigned =
              order.status === 'Packed' ||
              order.status === 'Shipped' ||
              order.status === 'In Transit' ||
              order.status === 'Out for Delivery' ||
              order.status === 'Delivered' ||
              order.timeline?.some(t => (t.status === 'Packed' || t.status === 'Shipped') && t.completed);

            if (isDriverAssigned && !isCancelled) {
              return (
                <div style={{
                  padding: '14px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--primary-50)',
                      color: 'var(--primary-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Truck size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>Delivery Executive</div>
                      <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{order.courier?.driverName || 'Suresh Kumar'}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCallDriver(order.courier?.driverPhone || '+91 98450 12345')}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '12px', minHeight: '32px', gap: '4px' }}
                  >
                    <Phone size={13} /> Call
                  </button>
                </div>
              );
            }

            if (isCancelled) {
              return (
                <div style={{
                  padding: '14px',
                  backgroundColor: '#FEF2F2',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #FECACA',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <XCircle size={22} color="#DC2626" />
                  <div>
                    <strong style={{ fontSize: '13px', color: '#991B1B' }}>Order Cancelled</strong>
                    <div style={{ fontSize: '12px', color: '#B91C1C', marginTop: '2px' }}>
                      Refund of ₹{order.totalAmount?.toLocaleString('en-IN')} processed to your original payment method.
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div style={{
                padding: '14px',
                backgroundColor: '#F8FAFC',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#F1F5F9',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Package size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>
                    Delivery Executive
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500', marginTop: '2px' }}>
                    Will be assigned once seller packs & dispatches your order.
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Delivery Address Card */}
          <div style={{
            padding: '14px',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            <MapPin size={18} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>Delivery Address</div>
              <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{order.deliveryAddress?.name || user?.name || 'Customer'}</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {order.deliveryAddress?.flat || order.deliveryAddress?.area || ''} {order.deliveryAddress?.city ? `${order.deliveryAddress.city} - ${order.deliveryAddress.pincode}` : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions: Download Invoice + Cancel Order / Return Replace */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-divider)',
          paddingTop: '16px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="btn btn-tertiary"
              style={{ fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={15} color="var(--primary-600)" /> Download Invoice (PDF)
            </button>

            {/* Cancel Order Button - Only when active and not delivered */}
            {!isDelivered && !isCancelled && (
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <XCircle size={14} /> Cancel Order
              </button>
            )}

            {/* Return / Replace Button - When delivered */}
            {isDelivered && (
              <button
                type="button"
                onClick={() => setIsReturnModalOpen(true)}
                className="btn btn-secondary"
                style={{ fontSize: '12px', height: '34px', gap: '4px' }}
              >
                <RotateCcw size={14} /> Return / Replace
              </button>
            )}
          </div>

          <Link
            to="/orders"
            className="btn btn-secondary"
            style={{ height: '40px', fontSize: '13px', fontWeight: '700' }}
          >
            Back to All Orders
          </Link>
        </div>
      </div>

      {/* CANCEL ORDER CONFIRMATION MODAL */}
      {isCancelModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCancelModalOpen(false)}>
          <div
            style={{
              maxWidth: '460px',
              width: '90%',
              margin: 'auto',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              border: '1px solid #E2E8F0'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} color="#DC2626" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#0F172A' }}>
                  Cancel Order #{order.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px', lineHeight: '1.4' }}>
              Are you sure you want to cancel this order? An instant refund of <strong>₹{order.totalAmount?.toLocaleString('en-IN')}</strong> will be credited to your account.
            </p>

            <form onSubmit={handleCancelSubmit}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Reason for cancellation:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '13px',
                  marginBottom: '20px'
                }}
              >
                <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                <option value="Estimated delivery time is too long">Estimated delivery time is too long</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Need to change delivery address or phone">Need to change delivery address or phone</option>
                <option value="Want to change color / variant">Want to change color / variant</option>
              </select>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, height: '42px' }}
                >
                  Don't Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    height: '42px',
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RETURN & REPLACEMENT WORKFLOW MODAL */}
      <ReturnRequestModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        order={order}
      />

      <style>{`
        .timeline-current-pulse {
          animation: bluePulse 1.8s infinite;
        }

        @keyframes bluePulse {
          0% {
            box-shadow: 0 0 0 0 rgba(19, 102, 226, 0.6);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(19, 102, 226, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(19, 102, 226, 0);
          }
        }
      `}</style>
    </div>
  );
}
