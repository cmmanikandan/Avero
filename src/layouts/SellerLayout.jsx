import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import UserAvatar from '../components/common/UserAvatar';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  RotateCcw,
  Tag,
  MessageSquare,
  BarChart3,
  Settings,
  Store,
  ShieldCheck,
  Bell,
  LogOut,
  ChevronRight,
  Menu,
  X,
  FileSpreadsheet,
  Zap,
  Building,
  ExternalLink,
  Sparkles,
  Brain
} from 'lucide-react';

export default function SellerLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, orders = [], setActiveRole, showToast } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isSeller = user.isAuth && (user.role === 'seller' || localStorage.getItem('avero_role') === 'seller');

  const activeStoreName = user?.storeName || (user?.name ? `${user.name}'s Store` : '');
  const sellerOrders = orders.filter(o => 
    o.items?.some(it => 
      (activeStoreName && (it.seller === activeStoreName || it.brand === activeStoreName || it.seller?.name === activeStoreName)) ||
      (user?.email && (it.sellerEmail === user?.email || it.submittedBy === user?.email)) ||
      (user?.merchantId && it.merchantId === user?.merchantId)
    )
  );
  const sellerOrdersCount = sellerOrders.length;

  const navItems = [
    { label: 'Dashboard', path: '/seller', icon: LayoutDashboard },
    { label: 'Products', path: '/seller/products', icon: Package },
    { label: 'Bulk CSV Import', path: '/seller/bulk-upload', icon: FileSpreadsheet },
    { label: 'Sponsored Ads', path: '/seller/ads', icon: Zap },
    { label: 'Inventory', path: '/seller/inventory', icon: Layers },
    { label: 'Orders', path: '/seller/orders', icon: ShoppingBag, badge: sellerOrdersCount > 0 ? sellerOrdersCount : null },
    { label: 'Returns', path: '/seller/returns', icon: RotateCcw, badge: null },
    { label: 'Promotions', path: '/seller/coupons', icon: Tag },
    { label: 'Settlements & Payouts', path: '/seller/settlements', icon: Building },
    { label: 'Reviews & Q&A', path: '/seller/reviews', icon: MessageSquare },
    { label: 'Analytics', path: '/seller/analytics', icon: BarChart3 },
    { label: 'Intelligence', path: '/seller/intelligence', icon: Brain, badge: 'AI' },
    { label: 'Store Settings', path: '/seller/settings', icon: Settings }
  ];

  const handleLogout = () => {
    setActiveRole('customer');
    navigate('/');
    showToast('Logged out of Seller Hub', 'info');
  };

  // If user is on seller auth page, render clean standalone without sidebar navigation
  if (location.pathname === '/seller/auth') {
    return <>{children}</>;
  }

  // If user is not an approved/signed-in seller, prompt them to onboard or sign in
  if (!isSeller) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', backgroundColor: '#F8FAFC' }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          padding: '36px 28px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Store size={32} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
            Vendor Registration Required
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
            To access the Avero Seller Central console, you must register and verify your store with valid GSTIN, PAN, and Bank Settlement details.
          </p>
          <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => navigate('/become-seller')}
              className="btn btn-primary"
              style={{ flex: 1, height: '42px', fontSize: '13px', fontWeight: '700' }}
            >
              Start Seller Onboarding
            </button>
            <button
              type="button"
              onClick={() => navigate('/seller/auth')}
              className="btn btn-secondary"
              style={{ flex: 1, height: '42px', fontSize: '13px' }}
            >
              Seller Sign In
            </button>
          </div>
          <Link to="/" style={{ fontSize: '12px', color: '#2563EB', marginTop: '4px', textDecoration: 'none', fontWeight: '600' }}>
            ← Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const storeDisplayName = user?.storeName || (user?.isAuth ? `${user.name}'s Store` : MOCK_SELLER.storeName);
  const storeSlug = storeDisplayName.toLowerCase().replace(/\s+/g, '-');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F1F5F9' }}>
      
      {/* Responsive Styles for Seller Hub */}
      <style>{`
        @media (max-width: 1023px) {
          .desktop-seller-sidebar {
            display: none !important;
          }
          .mobile-seller-menu-trigger {
            display: flex !important;
          }
          .seller-main-wrapper {
            padding: 14px 14px 40px !important;
          }
        }
        @media (min-width: 1024px) {
          .desktop-seller-sidebar {
            display: flex !important;
          }
          .mobile-seller-menu-trigger {
            display: none !important;
          }
          .seller-main-wrapper {
            padding: 24px 28px !important;
          }
        }
      `}</style>

      {/* ── DESKTOP SLEEK NAVY SIDEBAR ── */}
      <aside className="desktop-seller-sidebar" style={{
        width: '260px',
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50,
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
        borderRight: '1px solid #1E293B',
        flexShrink: 0
      }}>
        {/* Store Profile Header */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <UserAvatar user={user} size={42} fontSize={16} border="2px solid #334155" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#F8FAFC', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {storeDisplayName}
            </div>
            <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <ShieldCheck size={12} /> Verified Vendor
            </div>
          </div>
        </div>

        {/* Live Store Shortcut */}
        <div style={{ padding: '8px 14px' }}>
          <Link
            to={`/brand/${storeSlug}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '7px 10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: '#94A3B8',
              fontSize: '11.5px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={13} color="#F59E0B" /> View Live Storefront
            </span>
            <ExternalLink size={12} />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto' }} className="no-scrollbar">
          {navItems.map(item => {
            const IconComp = item.icon;
            const isExactMatch = location.pathname === item.path;
            const isSubMatch = item.path !== '/seller' && location.pathname.startsWith(item.path);
            const isActive = isExactMatch || isSubMatch;

            return (
              <Link
                key={item.label}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9.5px 12px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? '#2563EB' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '13px',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IconComp size={17} color={isActive ? '#FFFFFF' : '#64748B'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#334155',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '2px 7px',
                    borderRadius: '9999px'
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Logout & Switch */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid #1E293B' }}>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '9px 12px',
              fontSize: '12.5px',
              color: '#F87171',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              fontWeight: '700',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <LogOut size={15} /> Exit Seller Hub
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        
        {/* Top Navbar */}
        <header style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              className="mobile-seller-menu-trigger"
              onClick={() => setMobileMenuOpen(true)}
              style={{
                display: 'none',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Menu size={20} />
            </button>

            <span style={{ fontSize: '15px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.2px' }}>
              Seller Central
            </span>
            <span style={{ fontSize: '11px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '3px 9px', borderRadius: '6px', fontWeight: '800' }}>
              Vendor Hub
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => showToast('No unread seller alerts', 'info')}
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '7px 9px',
                cursor: 'pointer',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={16} />
            </button>

            <Link
              to="/"
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#2563EB',
                backgroundColor: '#EFF6FF',
                border: '1px solid #DBEAFE',
                padding: '7px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span className="hidden sm:inline">Buyer Store</span> →
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="seller-main-wrapper" style={{ flex: 1, maxWidth: '1440px', width: '100%', boxSizing: 'border-box', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      {/* ── MOBILE SLIDE-OUT DRAWER ── */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '82%',
              maxWidth: '300px',
              height: '100%',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '10px 0 30px rgba(0,0,0,0.5)',
              animation: 'slideInLeft 0.25s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ padding: '18px 16px', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserAvatar user={user} size={36} fontSize={14} border="2px solid #334155" />
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#FFFFFF' }}>{storeDisplayName}</div>
                  <div style={{ fontSize: '10px', color: '#10B981', fontWeight: '800' }}>✓ Verified Seller</div>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {/* Nav links */}
            <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
              {navItems.map(item => {
                const IconComp = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/seller' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? '#2563EB' : 'transparent',
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: isActive ? '700' : '500'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <IconComp size={17} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#334155', color: '#FFFFFF', padding: '2px 6px', borderRadius: '9999px' }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Logout */}
            <div style={{ padding: '14px 16px', borderTop: '1px solid #1E293B' }}>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#F87171',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={14} /> Exit Seller Central
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
