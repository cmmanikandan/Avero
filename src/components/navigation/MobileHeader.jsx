import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Mic,
  Camera,
  ShoppingCart,
  User,
  MapPin,
  ChevronDown,
  LogIn,
  ArrowLeft,
  Menu
} from 'lucide-react';

export default function MobileHeader() {
  const {
    user,
    cart,
    pincodeCity,
    activePincode,
    setIsLocationSelectorOpen,
    setIsAuthModalOpen,
    setIsSearchOpen,
    setIsVoiceSearchOpen,
    setIsCameraSearchOpen,
    setIsMobileDrawerOpen
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = location.pathname === '/';
  const isOrdersListPage = location.pathname === '/orders';
  const isOrderTrackPage = location.pathname.startsWith('/orders/') || location.pathname.startsWith('/order/');
  const isWishlistPage = location.pathname === '/wishlist';
  const isCartPage = location.pathname === '/cart';
  const isAccountPage = location.pathname === '/account';
  const isEditProfilePage = location.pathname === '/account/edit' || location.pathname === '/profile/edit';
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Shorten location for compact mobile display (Only if logged in)
  const hasLocation = Boolean(pincodeCity && user?.isAuth);
  const compactLocation = hasLocation
    ? pincodeCity.includes('M.Kumarasamy')
      ? 'MKCE, Karur'
      : pincodeCity.split(',')[0]
    : '';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderBottom: isScrolled ? '1px solid #CBD5E1' : '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: isScrolled ? '0 4px 16px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.03)',
        padding: isHomePage ? (isScrolled ? '6px 12px' : '8px 12px') : '8px 12px',
        transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        width: '100%',
        boxSizing: 'border-box'
      }}
      className="mobile-header-container"
    >
      {/* =========================================================================
         HOME PAGE RICH MOBILE HEADER (With Location, Profile/Sign In & Search)
         ========================================================================= */}
      {isHomePage ? (
        <>
          {/* Row 1: Brand Logo & Delivery Location Only */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '10px',
              marginBottom: isScrolled ? '6px' : '8px',
              transition: 'margin-bottom 0.2s ease',
              width: '100%'
            }}
          >
            {/* Drawer Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                color: '#1E293B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Open Navigation Menu"
            >
              <Menu size={22} color="#1E293B" />
            </button>

            {/* Brand Logo & Name */}
            <Link
              to="/"
              className="brand-logo-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                flexShrink: 0
              }}
            >
              <img
                src="/logo.png"
                alt="Avero"
                className="brand-logo-img"
                style={{
                  width: isScrolled ? '24px' : '28px',
                  height: isScrolled ? '24px' : '28px',
                  objectFit: 'contain',
                  transition: 'all 0.2s ease'
                }}
              />
              <span
                className="brand-name-gradient"
                style={{
                  fontSize: isScrolled ? '18px' : '20px',
                  letterSpacing: '-0.4px',
                  transition: 'font-size 0.2s ease'
                }}
              >
                Avero
              </span>
            </Link>

            {/* Delivery Location Pill (Clickable -> Opens Location Modal) */}
            <button
              type="button"
              onClick={() => setIsLocationSelectorOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: isScrolled ? 'transparent' : '#F1F5F9',
                border: isScrolled ? 'none' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: isScrolled ? '2px 6px' : '4px 10px',
                fontSize: '11px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                minWidth: 0,
                flex: 1,
                maxWidth: '260px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              title="Change Delivery Location"
            >
              <MapPin size={13} color={hasLocation ? 'var(--primary-600)' : '#64748B'} style={{ flexShrink: 0 }} />
              {hasLocation ? (
                <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, overflow: 'hidden', gap: '3px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: '1', fontWeight: '500', flexShrink: 0 }}>
                    Deliver to
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: '1.2'
                    }}
                  >
                    {compactLocation}
                  </span>
                </div>
              ) : (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Add Address
                </span>
              )}
              <ChevronDown size={12} color="var(--text-secondary)" style={{ flexShrink: 0, marginLeft: 'auto' }} />
            </button>
          </div>

          {/* Row 2: Global Search Bar */}
          <div
            onClick={() => setIsSearchOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F1F5F9',
              borderRadius: 'var(--radius-md)',
              padding: isScrolled ? '6px 10px' : '8px 12px',
              gap: '8px',
              cursor: 'pointer',
              border: '1px solid transparent',
              transition: 'all 0.2s ease',
              height: isScrolled ? '36px' : '40px',
              boxSizing: 'border-box'
            }}
          >
            <Search size={16} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
            <span
              style={{
                flex: 1,
                fontSize: isScrolled ? '12px' : '13px',
                color: 'var(--text-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: '1'
              }}
            >
              {isScrolled ? 'Search products, brands...' : 'Search Mobiles, Electronics, Shoes...'}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsVoiceSearchOpen(true);
              }}
              style={{
                color: 'var(--text-secondary)',
                padding: '2px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Voice Search"
            >
              <Mic size={16} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsCameraSearchOpen(true);
              }}
              style={{
                color: 'var(--text-secondary)',
                padding: '2px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Camera Search / QR Scan"
            >
              <Camera size={16} />
            </button>
          </div>
        </>
      ) : isOrdersListPage ? (
        /* =========================================================================
           MY ORDERS DEDICATED MOBILE HEADER
           ========================================================================= */
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigate('/account')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Back to Account"
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ flex: 1, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
            My Orders
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
              title="Search Products"
            >
              <Search size={16} />
            </button>

            <Link
              to="/cart"
              className="btn-icon"
              style={{
                width: '36px',
                height: '36px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                borderRadius: '50%',
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--border-subtle)',
                flexShrink: 0
              }}
              title="My Cart"
            >
              <ShoppingCart size={18} />
              {totalCartItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    backgroundColor: 'var(--primary-600)',
                    color: '#ffffff',
                    fontSize: '9px',
                    fontWeight: '800',
                    borderRadius: 'var(--radius-full)',
                    padding: '1px 4px',
                    lineHeight: '1',
                    minWidth: '14px',
                    textAlign: 'center'
                  }}
                >
                  {totalCartItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      ) : isOrderTrackPage ? (
        /* =========================================================================
           TRACK SHIPMENT DEDICATED MOBILE HEADER
           ========================================================================= */
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigate('/orders')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Back to Orders"
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ flex: 1, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
            Track Shipment
          </div>

          <Link
            to="/cart"
            className="btn-icon"
            style={{
              width: '36px',
              height: '36px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              borderRadius: '50%',
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--border-subtle)',
              flexShrink: 0
            }}
            title="My Cart"
          >
            <ShoppingCart size={18} />
            {totalCartItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  backgroundColor: 'var(--primary-600)',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: '800',
                  borderRadius: 'var(--radius-full)',
                  padding: '1px 4px',
                  lineHeight: '1',
                  minWidth: '14px',
                  textAlign: 'center'
                }}
              >
                {totalCartItems}
              </span>
            )}
          </Link>
        </div>
      ) : isWishlistPage ? (
        /* =========================================================================
           MY WISHLIST DEDICATED MOBILE HEADER
           ========================================================================= */
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ flex: 1, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
            My Wishlist
          </div>

          <Link
            to="/cart"
            className="btn-icon"
            style={{
              width: '36px',
              height: '36px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              borderRadius: '50%',
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--border-subtle)',
              flexShrink: 0
            }}
            title="My Cart"
          >
            <ShoppingCart size={18} />
            {totalCartItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  backgroundColor: 'var(--primary-600)',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: '800',
                  borderRadius: 'var(--radius-full)',
                  padding: '1px 4px',
                  lineHeight: '1',
                  minWidth: '14px',
                  textAlign: 'center'
                }}
              >
                {totalCartItems}
              </span>
            )}
          </Link>
        </div>
      ) : isCartPage ? (
        /* =========================================================================
           SHOPPING CART DEDICATED MOBILE HEADER
           ========================================================================= */
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigate('/products')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Continue Shopping"
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ flex: 1, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
            Shopping Cart ({totalCartItems})
          </div>

          <span style={{ fontSize: '11px', color: '#166534', backgroundColor: '#DCFCE7', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>
            ✓ 100% Safe
          </span>
        </div>
      ) : isAccountPage ? (
        /* =========================================================================
           MY ACCOUNT DEDICATED MOBILE HEADER
           ========================================================================= */
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Home"
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ flex: 1, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
            My Account
          </div>

          <Link
            to="/cart"
            className="btn-icon"
            style={{
              width: '36px',
              height: '36px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              borderRadius: '50%',
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--border-subtle)',
              flexShrink: 0
            }}
            title="My Cart"
          >
            <ShoppingCart size={18} />
            {totalCartItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  backgroundColor: 'var(--primary-600)',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: '800',
                  borderRadius: 'var(--radius-full)',
                  padding: '1px 4px',
                  lineHeight: '1',
                  minWidth: '14px',
                  textAlign: 'center'
                }}
              >
                {totalCartItems}
              </span>
            )}
          </Link>
        </div>
      ) : isEditProfilePage ? (
        /* =========================================================================
           EDIT PROFILE DEDICATED MOBILE HEADER
           ========================================================================= */
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigate('/account')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Back to Account"
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ flex: 1, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
            Edit Profile
          </div>

          <Link
            to="/cart"
            className="btn-icon"
            style={{
              width: '36px',
              height: '36px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              borderRadius: '50%',
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--border-subtle)',
              flexShrink: 0
            }}
            title="My Cart"
          >
            <ShoppingCart size={18} />
            {totalCartItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  backgroundColor: 'var(--primary-600)',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: '800',
                  borderRadius: 'var(--radius-full)',
                  padding: '1px 4px',
                  lineHeight: '1',
                  minWidth: '14px',
                  textAlign: 'center'
                }}
              >
                {totalCartItems}
              </span>
            )}
          </Link>
        </div>
      ) : (
        /* =========================================================================
           INNER / SEARCH / PRODUCT CATALOG PAGES MOBILE HEADER
           ========================================================================= */
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}
        >
          {/* Smart Back Button */}
          <button
            type="button"
            onClick={() => {
              if (
                location.pathname.includes('/specs') ||
                location.pathname.includes('/reviews') ||
                location.pathname.includes('/questions') ||
                location.pathname.startsWith('/seller/')
              ) {
                // If on sub-details (reviews/specs/seller), go directly back to the main product page
                const match = location.pathname.match(/\/product\/(prod-[^/]+)/);
                if (match && match[1]) {
                  navigate(`/product/${match[1]}`);
                  return;
                }
              }
              // Normal back navigation or fallback to /products
              if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
              } else {
                navigate('/products');
              }
            }}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Full-Width Search Bar */}
          <div
            onClick={() => setIsSearchOpen(true)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F1F5F9',
              borderRadius: 'var(--radius-full)',
              padding: '7px 12px',
              gap: '8px',
              cursor: 'pointer',
              minWidth: 0,
              boxSizing: 'border-box'
            }}
          >
            <Search size={15} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
            <span
              style={{
                flex: 1,
                fontSize: '13px',
                color: 'var(--text-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {new URLSearchParams(location.search).get('q') || 'Search products, brands...'}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsVoiceSearchOpen(true);
              }}
              style={{
                color: 'var(--text-secondary)',
                padding: '2px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Voice Search"
            >
              <Mic size={15} />
            </button>
          </div>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="btn-icon"
            style={{
              width: '36px',
              height: '36px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              borderRadius: '50%',
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--border-subtle)',
              flexShrink: 0
            }}
            title="My Cart"
          >
            <ShoppingCart size={18} />
            {totalCartItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  backgroundColor: 'var(--primary-600)',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: '800',
                  borderRadius: 'var(--radius-full)',
                  padding: '1px 4px',
                  lineHeight: '1',
                  minWidth: '14px',
                  textAlign: 'center'
                }}
              >
                {totalCartItems}
              </span>
            )}
          </Link>
        </div>
      )}
    </div>
  );
}
