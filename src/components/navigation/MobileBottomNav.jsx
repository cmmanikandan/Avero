import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Home,
  LayoutGrid,
  ShoppingBag,
  ShoppingCart,
  Menu
} from 'lucide-react';

export default function MobileBottomNav() {
  const { cart, orders, setIsMobileDrawerOpen } = useApp();
  const location = useLocation();

  // Hide bottom nav on checkout, full screen order success, and standalone auth screens
  const isHideNav =
    location.pathname === '/checkout' ||
    location.pathname === '/order-success' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/seller') ||
    location.pathname.startsWith('/delivery');

  if (isHideNav) return null;

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalOrdersCount = orders.length;

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Categories', path: '/categories', icon: LayoutGrid },
    { label: 'Orders', path: '/orders', icon: ShoppingBag, badge: totalOrdersCount > 0 ? totalOrdersCount : null },
    { label: 'Cart', path: '/cart', icon: ShoppingCart, badge: totalCartItems > 0 ? totalCartItems : null }
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '62px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.06)',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: '4px',
        paddingRight: '4px',
        boxSizing: 'border-box'
      }}
      className="mobile-bottom-nav-bar"
    >
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive =
          item.path === '/'
            ? location.pathname === '/'
            : location.pathname === item.path || location.pathname.startsWith(item.path + '/');

        return (
          <NavLink
            key={item.label}
            to={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              flex: 1,
              height: '100%',
              color: isActive ? '#2563EB' : '#64748B',
              textDecoration: 'none',
              position: 'relative',
              transition: 'all 0.15s ease'
            }}
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px 12px',
                borderRadius: '16px',
                backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <IconComponent
                size={19}
                color={isActive ? (item.isHot ? '#DC2626' : '#2563EB') : '#64748B'}
                strokeWidth={isActive ? 2.5 : 1.9}
              />

              {item.isHot && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-4px',
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    fontSize: '8px',
                    fontWeight: '900',
                    borderRadius: '6px',
                    padding: '1px 3px',
                    lineHeight: '1',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2px'
                  }}
                >
                  HOT
                </span>
              )}

              {item.badge !== null && item.badge !== undefined && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-4px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    fontSize: '9px',
                    fontWeight: '800',
                    borderRadius: '10px',
                    padding: '1px 4px',
                    lineHeight: '1',
                    minWidth: '14px',
                    textAlign: 'center'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>

            <span
              style={{
                fontSize: '10.5px',
                fontWeight: isActive ? '800' : '600',
                letterSpacing: '0.1px',
                color: isActive ? (item.isHot ? '#DC2626' : '#1D4ED8') : '#64748B'
              }}
            >
              {item.label}
            </span>
          </NavLink>
        );
      })}

      {/* Menu / Drawer Trigger Button */}
      <button
        type="button"
        onClick={() => setIsMobileDrawerOpen(true)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          flex: 1,
          height: '100%',
          color: '#64748B',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0
        }}
        title="Open Navigation Menu"
      >
        <div
          style={{
            padding: '4px 12px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Menu size={19} color="#64748B" strokeWidth={1.9} />
        </div>
        <span style={{ fontSize: '10.5px', fontWeight: '600', color: '#64748B' }}>
          Menu
        </span>
      </button>
    </nav>
  );
}
