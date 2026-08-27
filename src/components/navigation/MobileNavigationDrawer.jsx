import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  ShoppingBag,
  Heart,
  Tag,
  Zap,
  Gift,
  LayoutGrid,
  MapPin,
  HelpCircle,
  Store,
  Truck,
  ShieldAlert,
  LogOut,
  LogIn,
  ChevronRight,
  Sparkles,
  Compass,
  Download
} from 'lucide-react';

export default function MobileNavigationDrawer() {
  const {
    user,
    orders,
    wishlist,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
    setIsAuthModalOpen,
    setIsLocationSelectorOpen,
    pincodeCity,
    logoutUser,
    setActiveRole
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  if (!isMobileDrawerOpen) return null;

  const closeDrawer = () => setIsMobileDrawerOpen(false);

  const handleNav = (path) => {
    closeDrawer();
    navigate(path);
  };

  const handleRoleSwitch = (role, path) => {
    closeDrawer();
    setActiveRole(role);
    navigate(path);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex'
      }}
    >
      {/* Dark Backdrop Overlay */}
      <div
        onClick={closeDrawer}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(3px)',
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Drawer Container */}
      <div
        style={{
          position: 'relative',
          width: '84%',
          maxWidth: '340px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.3)',
          zIndex: 10,
          animation: 'slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto'
        }}
      >
        {/* User Profile Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
            padding: '24px 20px 18px',
            color: '#FFFFFF',
            position: 'relative'
          }}
        >
          <button
            type="button"
            onClick={closeDrawer}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          {user?.isAuth ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    color: '#1D4ED8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: '900',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'AV'}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>
                    {user.name || 'Avero Member'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#BFDBFE', marginTop: '2px' }}>
                    {user.email || '+91 98450 12345'}
                  </div>
                </div>
              </div>

              {/* SuperCoins Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.18)',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  marginTop: '14px',
                  fontSize: '12px',
                  fontWeight: '700'
                }}
              >
                <span>🪙</span>
                <span>480 SuperCoins Available</span>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <User size={24} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>
                    Welcome to Avero
                  </div>
                  <div style={{ fontSize: '12px', color: '#BFDBFE', marginTop: '2px' }}>
                    Sign in for best deals & fast orders
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  closeDrawer();
                  setIsAuthModalOpen(true);
                }}
                style={{
                  marginTop: '14px',
                  width: '100%',
                  padding: '9px 16px',
                  backgroundColor: '#FFFFFF',
                  color: '#1D4ED8',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <LogIn size={15} /> Sign In / Register
              </button>
            </div>
          )}
        </div>

        {/* Delivery Location Strip */}
        <div
          onClick={() => {
            closeDrawer();
            setIsLocationSelectorOpen(true);
          }}
          style={{
            padding: '12px 18px',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#0F172A' }}>
            <MapPin size={15} color="#2563EB" />
            <span>
              Deliver to: <strong>{pincodeCity || 'Karur Central (639001)'}</strong>
            </span>
          </div>
          <ChevronRight size={14} color="#94A3B8" />
        </div>

        {/* Scrollable Navigation Groups */}
        <div style={{ flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Section 1: Shop & Explore */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', paddingLeft: '8px', marginBottom: '6px', letterSpacing: '0.5px' }}>
              Explore Marketplace
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { label: 'All Categories', icon: LayoutGrid, path: '/categories' },
                { label: 'Lightning Flash Deals', icon: Zap, path: '/deals', badge: '🔥 HOT', badgeColor: '#DC2626', badgeBg: '#FEE2E2' },
                { label: 'Rewards & SuperCoins', icon: Gift, path: '/rewards', badge: 'Win ₹500', badgeColor: '#D97706', badgeBg: '#FEF3C7' },
                { label: 'Top Brands Storefront', icon: Compass, path: '/brands' }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    onClick={() => handleNav(item.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1E293B',
                      backgroundColor: location.pathname === item.path ? '#EFF6FF' : 'transparent',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={17} color="#2563EB" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span style={{ fontSize: '10px', fontWeight: '800', color: item.badgeColor, backgroundColor: item.badgeBg, padding: '2px 7px', borderRadius: '12px' }}>
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight size={14} color="#CBD5E1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Orders & Activity */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', paddingLeft: '8px', marginBottom: '6px', letterSpacing: '0.5px' }}>
              My Orders & Rewards
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { label: 'My Orders & Live Tracking', icon: ShoppingBag, path: '/orders', badge: orders.length > 0 ? String(orders.length) : null },
                { label: 'Wishlist & Saved Items', icon: Heart, path: '/wishlist', badge: wishlist.length > 0 ? String(wishlist.length) : null },
                { label: 'Coupons & Promo Codes', icon: Tag, path: '/coupons' },
                { label: 'Account Profile', icon: User, path: '/account' }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    onClick={() => handleNav(item.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1E293B'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={17} color="#475569" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#FFFFFF', backgroundColor: '#2563EB', padding: '1px 7px', borderRadius: '12px' }}>
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight size={14} color="#CBD5E1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Partner Portals */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', paddingLeft: '8px', marginBottom: '6px', letterSpacing: '0.5px' }}>
              Partner Ecosystem
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { label: 'Seller Hub (Merchant Center)', icon: Store, role: 'seller', path: '/seller' }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    onClick={() => handleRoleSwitch(item.role, item.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1E293B'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={17} color="#059669" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight size={14} color="#CBD5E1" />
                  </div>
                );
              })}

              <div
                onClick={() => {
                  closeDrawer();
                  window.dispatchEvent(new CustomEvent('open-pwa-install'));
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#1366E2',
                  backgroundColor: '#EFF6FF',
                  marginTop: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Download size={17} color="#1366E2" />
                  <span>Install Avero App (PWA)</span>
                </div>
                <span style={{ fontSize: '10px', backgroundColor: '#1366E2', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>
                  FREE
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>
            Avero Marketplace v2.4.0
          </div>
          {user?.isAuth && (
            <button
              type="button"
              onClick={() => {
                logoutUser();
                closeDrawer();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'none',
                border: 'none',
                color: '#DC2626',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <LogOut size={13} /> Sign Out
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
