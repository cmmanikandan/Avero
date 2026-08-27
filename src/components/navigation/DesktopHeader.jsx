import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Mic,
  Camera,
  MapPin,
  ShoppingCart,
  Heart,
  User,
  ChevronDown,
  Package,
  LogOut,
  LogIn,
  Store,
  ShieldCheck,
  Tag,
  Gift
} from 'lucide-react';

export default function DesktopHeader() {
  const {
    user,
    cart,
    wishlist,
    products = [],
    activePincode,
    pincodeCity,
    setIsLocationSelectorOpen,
    setIsAuthModalOpen,
    setIsVoiceSearchOpen,
    setIsCameraSearchOpen,
    logoutUser
  } = useApp();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTopTicker, setShowTopTicker] = useState(true);
  const searchContainerRef = useRef(null);
  const accountMenuRef = useRef(null);

  // Cart total items
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Filter suggestions from live products
  const suggestions = searchTerm.trim()
    ? products.filter(p => (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || (p.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) || (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 6)
    : [];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSelectSuggestion = (product) => {
    setSearchTerm('');
    setShowSuggestions(false);
    navigate(`/product/${product.id}`);
  };

  return (
    <header
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-header)',
        boxShadow: isScrolled ? '0 10px 30px -10px rgba(15, 23, 42, 0.08)' : '0 1px 3px rgba(15, 23, 42, 0.03)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        width: '100%'
      }}
    >
      {showTopTicker && (
        <div style={{
          backgroundColor: '#090D16',
          color: '#FFFFFF',
          padding: '7px 16px',
          fontSize: '12px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          letterSpacing: '0.2px',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <span>
            ✨ <strong>AVERO LUXURY CATALOG LIVE:</strong> Extra <strong>₹500 OFF</strong> on Premium Electronics & Fashion with code <span style={{ color: '#818CF8', fontWeight: '800', textDecoration: 'underline' }}>AVERO500</span> • Free Express Courier
          </span>
          <button
            type="button"
            onClick={() => setShowTopTicker(false)}
            style={{
              position: 'absolute',
              right: '16px',
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              fontSize: '13px',
              padding: '2px 6px'
            }}
          >
            ✕
          </button>
        </div>
      )}

      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: isScrolled ? '66px' : '72px',
        transition: 'height 0.2s ease',
        gap: '20px'
      }}>
        {/* Brand Logo & Name */}
        <Link to="/" className="brand-logo-link">
          <img
            src="/logo.png"
            alt="Avero"
            className="brand-logo-img"
            style={{ width: '38px', height: '38px', objectFit: 'contain' }}
            onError={(e) => {
              // fallback if needed
              e.target.style.display = 'none';
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="brand-name-gradient" style={{ fontSize: '23px' }}>
              Avero
            </span>
            <span className="brand-subtext">
              <span className="brand-subtext-explore">Explore</span>
              <span className="brand-plus-text">Plus</span>
              <span className="brand-star-icon">✦</span>
            </span>
          </div>
        </Link>

        {/* Delivery Address Pill (Visible after customer logs in) */}
        {user.isAuth && (
          <button
            type="button"
            onClick={() => setIsLocationSelectorOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              backgroundColor: '#F8FAFC',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              maxWidth: '190px',
              flexShrink: 0,
              textAlign: 'left',
              transition: 'background-color 0.15s ease'
            }}
            title="Change Delivery Address"
          >
            <MapPin size={16} color="var(--primary-600)" style={{ flexShrink: 0 }} />
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: '1', fontWeight: '500' }}>
                Deliver to
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: '1.3'
              }}>
                {pincodeCity ? pincodeCity.split(',')[0] : 'IND'} - {activePincode}
              </div>
            </div>
            <ChevronDown size={13} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
          </button>
        )}

        {/* Global Search Bar with Live Suggestions, Voice, Camera */}
        <div ref={searchContainerRef} style={{ flex: 1, maxWidth: '640px', position: 'relative' }}>
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F1F5F9',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid transparent',
              overflow: 'hidden',
              transition: 'all 0.2s',
              padding: '2px 8px'
            }}
          >
            <Search size={18} color="var(--text-secondary)" style={{ marginLeft: '6px' }} />
            <input
              type="text"
              placeholder="Search for Mobiles, Laptops, Shoes, Air Conditioners & more..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              style={{
                flex: 1,
                padding: '10px 12px',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '13px'
              }}
            />
            {/* Visual & Voice triggers */}
            <button
              type="button"
              onClick={() => setIsVoiceSearchOpen(true)}
              title="Voice Search"
              style={{ padding: '6px', color: 'var(--text-secondary)', display: 'flex' }}
            >
              <Mic size={18} />
            </button>
            <button
              type="button"
              onClick={() => setIsCameraSearchOpen(true)}
              title="Visual Search by Image"
              style={{ padding: '6px', color: 'var(--text-secondary)', display: 'flex' }}
            >
              <Camera size={18} />
            </button>
          </form>

          {/* Typeahead Suggestions Dropdown */}
          {showSuggestions && searchTerm.trim() && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-subtle)',
              zIndex: 'var(--z-dropdown)',
              overflow: 'hidden'
            }}>
              {suggestions.length > 0 ? (
                <div>
                  <div style={{ padding: '8px 14px', fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', backgroundColor: '#F8FAFC', textTransform: 'uppercase' }}>
                    Matching Products
                  </div>
                  {suggestions.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectSuggestion(p)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        borderBottom: '1px solid var(--border-divider)',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-50)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <img src={p.thumbnail} alt={p.title} style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '4px' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          in {p.category} • <strong style={{ color: 'var(--text-primary)' }}>₹{p.price.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={handleSearchSubmit}
                    style={{
                      padding: '10px 14px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--primary-600)',
                      backgroundColor: '#F8FAFC',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    View all results for "{searchTerm}" →
                  </div>
                </div>
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  No instant matches for "{searchTerm}". Press Enter to search catalog.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Account Button / Dropdown */}
          <div ref={accountMenuRef} style={{ position: 'relative' }}>
            {user.isAuth ? (
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  backgroundColor: '#F8FAFC',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                <User size={16} color="var(--primary-600)" />
                <span>{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} color="var(--text-secondary)" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  backgroundColor: 'var(--primary-600)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(19, 102, 226, 0.25)',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </button>
            )}

            {/* Account Popover */}
            {showAccountMenu && user.isAuth && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '230px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-subtle)',
                zIndex: 'var(--z-dropdown)',
                padding: '8px 0'
              }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-divider)' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{user.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                </div>

                <Link
                  to="/account"
                  onClick={() => setShowAccountMenu(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-50)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <User size={16} color="var(--primary-600)" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setShowAccountMenu(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-50)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Package size={16} color="var(--primary-600)" />
                  <span>Orders & Returns</span>
                </Link>

                <Link
                  to="/wishlist"
                  onClick={() => setShowAccountMenu(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-50)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Heart size={16} color="var(--primary-600)" />
                  <span>Wishlist ({wishlist.length})</span>
                </Link>

                <Link
                  to="/coupons"
                  onClick={() => setShowAccountMenu(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-50)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Tag size={16} color="#2563EB" />
                  <span>Coupons & Promo Codes</span>
                </Link>

                {/* Role-Based Links */}
                {user.role === 'admin' ? (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setShowAccountMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        fontSize: '13px',
                        color: '#DC2626',
                        fontWeight: '800',
                        backgroundColor: '#FEF2F2',
                        textDecoration: 'none'
                      }}
                    >
                      <ShieldCheck size={16} color="#DC2626" />
                      <span>Admin Governance</span>
                    </Link>
                    <Link
                      to="/admin/intelligence"
                      onClick={() => setShowAccountMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        fontSize: '13px',
                        color: '#7C3AED',
                        fontWeight: '800',
                        backgroundColor: '#F5F3FF',
                        textDecoration: 'none'
                      }}
                    >
                      <span>🧠 Intelligence Center</span>
                    </Link>
                  </>
                ) : user.role === 'seller' && user.sellerStatus === 'approved' ? (
                  <>
                    <Link
                      to="/seller"
                      onClick={() => setShowAccountMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        fontSize: '13px',
                        color: '#B45309',
                        fontWeight: '800',
                        backgroundColor: '#FFFBEB',
                        textDecoration: 'none'
                      }}
                    >
                      <Store size={16} color="#D97706" />
                      <span>Seller Dashboard</span>
                    </Link>
                    <Link
                      to="/seller/intelligence"
                      onClick={() => setShowAccountMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        fontSize: '13px',
                        color: '#4338CA',
                        fontWeight: '800',
                        backgroundColor: '#EEF2FF',
                        textDecoration: 'none'
                      }}
                    >
                      <span>🧠 Seller Intelligence</span>
                    </Link>
                  </>
                ) : user.sellerStatus === 'pending' ? (
                  <Link
                    to="/seller"
                    onClick={() => setShowAccountMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      fontSize: '13px',
                      color: '#D97706',
                      fontWeight: '800',
                      backgroundColor: '#FEF3C7',
                      textDecoration: 'none'
                    }}
                  >
                    <span>⏳ Approval Pending</span>
                  </Link>
                ) : (
                  <Link
                    to="/become-seller"
                    onClick={() => setShowAccountMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-50)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Store size={16} color="var(--primary-600)" />
                    <span>Become a Seller</span>
                  </Link>
                )}

                <div style={{ height: '1px', backgroundColor: 'var(--border-divider)', margin: '4px 0' }} />

                <button
                  onClick={() => {
                    setShowAccountMenu(false);
                    logoutUser();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    color: '#DC2626',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Wishlist Link (Only visible after customer logs in) */}
          {user.isAuth && (
            <Link
              to="/wishlist"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                backgroundColor: '#F8FAFC',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '600',
                textDecoration: 'none',
                position: 'relative'
              }}
              title="My Wishlist"
            >
              <Heart size={16} color="#EF4444" />
              <span>Wishlist</span>
              {wishlist && wishlist.length > 0 && (
                <span style={{
                  backgroundColor: '#EF4444',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: '800',
                  borderRadius: 'var(--radius-full)',
                  padding: '1px 5px',
                  lineHeight: '1'
                }}>
                  {wishlist.length}
                </span>
              )}
            </Link>
          )}

          {/* Cart with Live Count */}
          <Link
            to="/cart"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'var(--primary-600)',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: '700',
              position: 'relative'
            }}
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            {totalCartItems > 0 && (
              <span style={{
                backgroundColor: '#F59E0B',
                color: '#0F172A',
                fontSize: '11px',
                fontWeight: '800',
                borderRadius: 'var(--radius-full)',
                padding: '2px 7px'
              }}>
                {totalCartItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
