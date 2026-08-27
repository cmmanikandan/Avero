import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateTaxInvoice } from '../services/invoiceGenerator';
import EmptyState from '../components/common/EmptyState';
import {
  Package,
  Search,
  ChevronRight,
  RotateCcw,
  Download,
  AlertCircle,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  LogIn
} from 'lucide-react';

export default function OrdersListPage() {
  const navigate = useNavigate();
  const { user, orders, addToCart, setIsAuthModalOpen, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  const [searchQuery, setSearchQuery] = useState('');

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
            <Package size={40} strokeWidth={2} />
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            Sign In to View Your Orders
          </h1>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, maxWidth: '380px', lineHeight: '1.5' }}>
            Track order status, manage delivery addresses, download tax invoices, and request returns anytime.
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

  const filteredOrders = orders.filter(order => {
    // Tab filter
    if (activeTab !== 'ALL') {
      if (activeTab === 'CONFIRMED' && !['CONFIRMED', 'PLACED'].includes(order.statusCode)) return false;
      if (activeTab === 'SHIPPED' && order.statusCode !== 'SHIPPED') return false;
      if (activeTab === 'DELIVERED' && order.statusCode !== 'DELIVERED') return false;
      if (activeTab === 'CANCELLED' && order.statusCode !== 'CANCELLED') return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id?.toLowerCase().includes(q);
      const matchItem = order.items?.some(i => i.title?.toLowerCase().includes(q));
      if (!matchId && !matchItem) return false;
    }

    return true;
  });

  const getStatusBadge = (statusCode, statusText) => {
    const s = (statusText || statusCode || '').toUpperCase();
    if (s.includes('DELIVER') && !s.includes('OUT')) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          color: '#15803D',
          backgroundColor: '#DCFCE7',
          border: '1px solid #86EFAC',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: '12px',
          fontWeight: '800'
        }}>
          <CheckCircle2 size={14} /> Delivered
        </span>
      );
    }
    if (s.includes('OUT FOR DELIVERY')) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          color: '#1D4ED8',
          backgroundColor: '#DBEAFE',
          border: '1px solid #93C5FD',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: '12px',
          fontWeight: '800'
        }}>
          <Truck size={14} /> Out for Delivery
        </span>
      );
    }
    if (s.includes('SHIP') || s.includes('TRANSIT')) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          color: '#0369A1',
          backgroundColor: '#E0F2FE',
          border: '1px solid #7DD3FC',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: '12px',
          fontWeight: '800'
        }}>
          <Truck size={14} /> Shipped / In Transit
        </span>
      );
    }
    if (s.includes('PACK')) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          color: '#B45309',
          backgroundColor: '#FEF3C7',
          border: '1px solid #FDE68A',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: '12px',
          fontWeight: '800'
        }}>
          <Package size={14} /> Packed by Seller
        </span>
      );
    }
    if (s.includes('CANCEL')) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          color: '#B91C1C',
          backgroundColor: '#FEE2E2',
          border: '1px solid #FCA5A5',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: '12px',
          fontWeight: '800'
        }}>
          <XCircle size={14} /> Cancelled
        </span>
      );
    }
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        color: '#475569',
        backgroundColor: '#F1F5F9',
        border: '1px solid #CBD5E1',
        padding: '4px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: '12px',
        fontWeight: '800'
      }}>
        <Clock size={14} /> {statusText || 'Order Placed'}
      </span>
    );
  };

  const handleBuyAgain = (item) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      mrp: item.mrp || item.price,
      thumbnail: item.thumbnail
    });
    navigate('/cart');
  };

  const handleDownloadInvoice = (order) => {
    showToast(`Generating Tax Invoice for ${order.id}...`, 'info');
    setTimeout(() => {
      generateTaxInvoice(order);
    }, 400);
  };

  if (orders.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 16px', maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
        <EmptyState
          type="orders"
          title="No Orders Found"
          description="Looks like you haven't placed any orders yet. Explore our trending offers and start shopping!"
          buttonText="Start Shopping"
          actionPath="/products"
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '60px', paddingTop: '16px', maxWidth: '920px', margin: '0 auto' }}>
      
      {/* Header & Search Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '18px 20px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              My Orders ({orders.length})
            </h1>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Track shipments, download invoices, and manage returns
            </div>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by Order ID or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }} className="no-scrollbar">
          {[
            { key: 'ALL', label: 'All Orders' },
            { key: 'CONFIRMED', label: 'Confirmed' },
            { key: 'SHIPPED', label: 'On the Way' },
            { key: 'DELIVERED', label: 'Delivered' },
            { key: 'CANCELLED', label: 'Cancelled' }
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`pdp-pill-btn ${activeTab === tab.key ? 'active' : ''}`}
              style={{ height: '34px', minHeight: '34px', padding: '0 14px', fontSize: '12px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredOrders.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', padding: '40px', textAlign: 'center', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <Package size={40} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>No matching orders found</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Try adjusting your search query or tab filters.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xs)',
                transition: 'box-shadow 0.18s ease'
              }}
            >
              {/* Order Card Header */}
              <div style={{
                padding: '14px 18px',
                backgroundColor: '#F8FAFC',
                borderBottom: '1px solid var(--border-divider)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
                      Order Placed
                    </span>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {order.date}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
                      Total Amount
                    </span>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-price)' }}>
                      ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
                      Ship To
                    </span>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {order.deliveryAddress?.name || user?.name || 'Customer'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    ID: <strong>{order.id}</strong>
                  </span>
                  {getStatusBadge(order.statusCode, order.status)}
                </div>
              </div>

              {/* Order Items */}
              <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 280px' }}>
                      <div style={{ width: '64px', height: '64px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </div>

                      <div>
                        <Link
                          to={`/product/${item.id}`}
                          style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            lineHeight: '1.4',
                            textDecoration: 'none'
                          }}
                        >
                          {item.title}
                        </Link>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Qty: <strong>{item.quantity}</strong> {item.variant && `• Variant: ${item.variant}`}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-price)', marginTop: '2px' }}>
                          ₹{item.price?.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleBuyAgain(item)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px', minHeight: '32px', gap: '4px' }}
                      >
                        <ShoppingBag size={13} /> Buy Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Card Footer Actions */}
              <div style={{
                padding: '12px 18px',
                borderTop: '1px solid var(--border-divider)',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ fontSize: '12px', color: 'var(--savings-green)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={15} /> {order.estimatedDelivery || 'Standard 2-Day Delivery'}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleDownloadInvoice(order)}
                    className="btn btn-tertiary"
                    style={{ fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Download size={14} color="var(--primary-600)" /> Invoice
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/order-tracking/${order.id}`)}
                    className="btn btn-primary"
                    style={{ padding: '0 16px', height: '36px', minHeight: '36px', fontSize: '13px', fontWeight: '700', gap: '6px' }}
                  >
                    <Truck size={14} /> Track Order
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
