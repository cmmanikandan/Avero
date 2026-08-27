import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_SELLER } from '../../data/mockSellers';
import { useApp } from '../../context/AppContext';
import {
  IndianRupee,
  Package,
  ShoppingBag,
  AlertTriangle,
  RotateCcw,
  TrendingUp,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  FileSpreadsheet,
  Zap,
  Tag,
  Building,
  MessageSquare,
  BarChart3,
  Settings,
  Store,
  ExternalLink,
  Sparkles,
  Inbox
} from 'lucide-react';

export default function SellerDashboardView() {
  const navigate = useNavigate();
  const { user, orders, products, showToast } = useApp();
  const activeStoreName = user?.storeName || (user?.name ? `${user.name}'s Store` : 'My Merchant Store');
  const storeSlug = activeStoreName.toLowerCase().replace(/\s+/g, '-');

  // Compute live seller products
  const liveSellerProducts = (() => {
    try {
      const saved = JSON.parse(localStorage.getItem('avero_seller_products') || '[]');
      if (saved && saved.length > 0) return saved;
    } catch (_) {}
    return (products || []).filter(p => 
      (activeStoreName && (p.seller === activeStoreName || p.brand === activeStoreName || p.seller?.name === activeStoreName)) ||
      (user?.email && (p.sellerEmail === user?.email || p.submittedBy === user?.email)) ||
      (user?.merchantId && p.merchantId === user?.merchantId) ||
      p.isCustomCreated
    );
  })();

  // Compute live seller orders
  const sellerOrders = (orders || []).filter(o => 
    o.items?.some(it => 
      (activeStoreName && (it.seller === activeStoreName || it.brand === activeStoreName || it.seller?.name === activeStoreName)) ||
      (user?.email && (it.sellerEmail === user?.email || it.submittedBy === user?.email)) ||
      (user?.merchantId && it.merchantId === user?.merchantId)
    )
  );

  const pendingDispatchOrders = sellerOrders.filter(o => o.status === 'Confirmed' || o.status === 'Packed');
  const totalSalesAmount = sellerOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const lowStockItemsCount = liveSellerProducts.filter(p => (p.stockCount || p.stock || 0) < 5).length;

  const handleQuickDispatch = (orderId) => {
    navigate('/seller/orders');
    showToast(`Navigating to fulfill Order #${orderId}`, 'info');
  };

  const quickShortcuts = [
    { label: 'Product Catalog', desc: 'Manage SKUs & pricing', path: '/seller/products', icon: Package, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Bulk CSV Import', desc: 'Upload 100+ items at once', path: '/seller/bulk-upload', icon: FileSpreadsheet, color: '#059669', bg: '#ECFDF5' },
    { label: 'Sponsored Ads', desc: 'Boost product search rank', path: '/seller/ads', icon: Zap, color: '#F59E0B', bg: '#FEF3C7' },
    { label: 'Inventory & Stock', desc: 'Restock & warehouse levels', path: '/seller/inventory', icon: Package, color: '#7C3AED', bg: '#F5F3FF' },
    { label: 'Order Dispatch', desc: 'Print bills & parcel labels', path: '/seller/orders', icon: ShoppingBag, color: '#D97706', bg: '#FFFBEB' },
    { label: 'Customer Returns', desc: 'RMA approval & inspection', path: '/seller/returns', icon: RotateCcw, color: '#DC2626', bg: '#FEF2F2' },
    { label: 'Deals & Coupons', desc: 'Run flash sales & vouchers', path: '/seller/coupons', icon: Tag, color: '#EC4899', bg: '#FDF2F8' },
    { label: 'Bank Settlements', desc: 'Daily IMPS payouts ledger', path: '/seller/settlements', icon: Building, color: '#047857', bg: '#E6F4EA' },
    { label: 'Reviews & Q&A', desc: 'Reply to verified buyers', path: '/seller/reviews', icon: MessageSquare, color: '#0284C7', bg: '#E0F2FE' },
    { label: 'Store Analytics', desc: 'Sales & conversion metrics', path: '/seller/analytics', icon: BarChart3, color: '#4F46E5', bg: '#EEF2FF' },
    { label: 'Store & Bank KYC', desc: 'GST, PAN & Pickup hub', path: '/seller/settings', icon: Settings, color: '#334155', bg: '#F1F5F9' }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Welcome Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
          }}>
            <Store size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                Welcome back, {activeStoreName}!
              </h1>
              <span style={{ fontSize: '11px', backgroundColor: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: '6px', fontWeight: '800' }}>
                ✓ Verified Merchant Store
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '3px 0 0' }}>
              Here is what's happening across your store and 28,000+ serviceable delivery pincodes today.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link
            to={`/brand/${storeSlug}`}
            style={{
              height: '42px',
              padding: '0 16px',
              borderRadius: '10px',
              backgroundColor: '#F8FAFC',
              color: '#0F172A',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ExternalLink size={15} /> View Live Brand Store
          </Link>

          <Link
            to="/seller/products/new"
            style={{
              height: '42px',
              padding: '0 20px',
              borderRadius: '10px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
            }}
          >
            <Plus size={16} /> Add New Product
          </Link>
        </div>
      </div>

      {/* 6 Metric KPI Cards (Clickable Links to respective Hubs) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px'
      }}>
        
        {/* Today's Sales -> Settlements */}
        <Link
          to="/seller/settlements"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            padding: '18px 20px',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase' }}>TODAY'S SALES</span>
            <IndianRupee size={16} color="#2563EB" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#0F172A', marginTop: '6px' }}>
            ₹{totalSalesAmount.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: '800' }}>
            Live Sales Ledger →
          </span>
        </Link>

        {/* Today's Orders -> Orders */}
        <Link
          to="/seller/orders"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            padding: '18px 20px',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase' }}>TODAY'S ORDERS</span>
            <ShoppingBag size={16} color="#059669" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#0F172A', marginTop: '6px' }}>
            {sellerOrders.length} Units
          </div>
          <span style={{ fontSize: '11px', color: '#64748B' }}>
            Manage Orders →
          </span>
        </Link>

        {/* Pending Shipments -> Orders */}
        <Link
          to="/seller/orders"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            padding: '18px 20px',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase' }}>PENDING DISPATCH</span>
            <Clock size={16} color="#D97706" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#D97706', marginTop: '6px' }}>
            {pendingDispatchOrders.length} Orders
          </div>
          <span style={{ fontSize: '11px', color: '#D97706', fontWeight: '700' }}>
            Ready for Delivery Partners →
          </span>
        </Link>

        {/* Total Active Products -> Products */}
        <Link
          to="/seller/products"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            padding: '18px 20px',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase' }}>LIVE PRODUCTS</span>
            <Package size={16} color="#2563EB" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#0F172A', marginTop: '6px' }}>
            {liveSellerProducts.length} SKUs
          </div>
          <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: '700' }}>
            {liveSellerProducts.length === 0 ? '+ Add First Product' : 'Edit Catalog →'}
          </span>
        </Link>

        {/* Low Stock Alerts -> Inventory */}
        <Link
          to="/seller/inventory"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            padding: '18px 20px',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase' }}>LOW STOCK ALERT</span>
            <AlertTriangle size={16} color="#DC2626" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: lowStockItemsCount > 0 ? '#DC2626' : '#059669', marginTop: '6px' }}>
            {lowStockItemsCount} Items
          </div>
          <span style={{ fontSize: '11px', color: lowStockItemsCount > 0 ? '#DC2626' : '#059669', fontWeight: '700' }}>
            {lowStockItemsCount > 0 ? 'Restock Warehouse →' : 'Inventory Healthy ✓'}
          </span>
        </Link>

        {/* Returns -> Returns */}
        <Link
          to="/seller/returns"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            padding: '18px 20px',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase' }}>RETURN RATE</span>
            <RotateCcw size={16} color="#7C3AED" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#0F172A', marginTop: '6px' }}>
            0.0%
          </div>
          <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: '700' }}>
            Below 2% Target • RMA Hub →
          </span>
        </Link>

      </div>

      {/* 2-Column Middle Row: Weekly Sales Trend + Orders Ready for Dispatch */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        
        {/* Weekly Revenue Graph */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Weekly Sales & Revenue Trend
              </h3>
              <span style={{ fontSize: '11.5px', color: '#64748B' }}>Last 7 Days (Mon - Sun)</span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#2563EB' }}>
              ₹{totalSalesAmount.toLocaleString('en-IN')}
            </div>
          </div>

          {/* SVG/CSS Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', padding: '10px 0 0', borderBottom: '1px solid #E2E8F0' }}>
            {[
              { day: 'Mon', sales: 0, val: '₹0' },
              { day: 'Tue', sales: 0, val: '₹0' },
              { day: 'Wed', sales: 0, val: '₹0' },
              { day: 'Thu', sales: 0, val: '₹0' },
              { day: 'Fri', sales: 0, val: '₹0' },
              { day: 'Sat', sales: 0, val: '₹0' },
              { day: 'Sun', sales: totalSalesAmount > 0 ? 100 : 0, val: totalSalesAmount > 0 ? `₹${totalSalesAmount}` : '₹0' }
            ].map(col => (
              <div key={col.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>{col.val}</span>
                <div style={{
                  width: '32px',
                  height: col.sales > 0 ? '60px' : '4px',
                  backgroundColor: col.sales > 0 ? '#2563EB' : '#E2E8F0',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.3s ease'
                }} />
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#0F172A' }}>{col.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Ready for Dispatch */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              Orders Ready for Dispatch ({pendingDispatchOrders.length})
            </h3>
            <Link to="/seller/orders" style={{ fontSize: '12.5px', color: '#2563EB', fontWeight: '700', textDecoration: 'none' }}>
              View All Orders →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pendingDispatchOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: '#64748B' }}>
                <Inbox size={36} color="#CBD5E1" style={{ margin: '0 auto 8px' }} />
                <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block' }}>
                  No Orders Pending Dispatch
                </strong>
                <span style={{ fontSize: '12px' }}>
                  When customer orders arrive for your products, they will appear here for packing & courier dispatch.
                </span>
              </div>
            ) : (
              pendingDispatchOrders.slice(0, 4).map(order => (
                <div
                  key={order.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                      {order.items?.[0]?.title || 'Order Item'}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                      #{order.id} • {order.deliveryAddress?.name || 'Customer'} • Pincode: {order.deliveryAddress?.pincode || '639117'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuickDispatch(order.id)}
                    style={{
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: '800',
                      color: '#FFFFFF',
                      backgroundColor: '#2563EB',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Dispatch
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Complete Seller Hub Quick Launch Navigation Grid */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
              Seller Central Tool Hub
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0' }}>
              Instant shortcuts to all merchant management tools & operations
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          {quickShortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: item.bg,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block' }}>
                    {item.label}
                  </strong>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    {item.desc}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
