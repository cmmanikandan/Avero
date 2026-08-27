import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AdminAuthModal from '../components/common/AdminAuthModal';
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  Layers,
  ShoppingBag,
  CreditCard,
  Tag,
  Image,
  FileText,
  Settings,
  Bell,
  MessageSquare,
  Truck,
  ShieldAlert,
  ShieldCheck,
  LogOut,
  KeyRound,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Zap,
  TrendingUp,
  Globe,
  Lock,
  ExternalLink,
  Search,
  CheckCircle2,
  Activity,
  Brain
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setActiveRole, showToast, vendorSubmissions = [], deliveryPartners = [], products = [], orders = [] } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  const pendingSubmissionsCount = vendorSubmissions.filter(s => s.status === 'PENDING_APPROVAL').length;
  const pendingDriversCount = deliveryPartners.filter(d => d.status === 'PENDING_APPROVAL').length;

  const adminNav = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, color: '#38BDF8', badge: null },
    { label: 'Users & Roles', path: '/admin/users', icon: Users, color: '#818CF8', badge: null },
    { label: 'Seller KYC Approvals', path: '/admin/sellers', icon: Store, color: '#FBBF24', badge: null },
    { label: 'Product Moderation', path: '/admin/products', icon: Package, color: '#FB7185', badge: pendingSubmissionsCount > 0 ? String(pendingSubmissionsCount) : null },
    { label: 'Categories & Fees', path: '/admin/categories', icon: Layers, color: '#34D399', badge: null },
    { label: 'Marketplace Orders', path: '/admin/orders', icon: ShoppingBag, color: '#60A5FA', badge: orders.length > 0 ? String(orders.length) : null },
    { label: 'Payments & Payouts', path: '/admin/payments', icon: CreditCard, color: '#C084FC', badge: null },
    { label: 'Global Coupons', path: '/admin/coupons', icon: Tag, color: '#F472B6', badge: null },
    { label: 'Banner Promotions', path: '/admin/banners', icon: Image, color: '#38BDF8', badge: null },
    { label: 'Delivery & Fleet', path: '/admin/delivery', icon: Truck, color: '#4ADE80', badge: pendingDriversCount > 0 ? String(pendingDriversCount) : null },
    { label: 'Reviews Moderation', path: '/admin/reviews', icon: MessageSquare, color: '#FCD34D', badge: null },
    { label: 'Notification Broadcast', path: '/admin/notifications', icon: Bell, color: '#F87171', badge: null },
    { label: 'Financial Reports', path: '/admin/reports', icon: FileText, color: '#A78BFA', badge: null },
    { label: 'Intelligence Center', path: '/admin/intelligence', icon: Brain, color: '#A855F7', badge: 'AI' },
    { label: 'Platform Settings', path: '/admin/settings', icon: Settings, color: '#94A3B8', badge: null }
  ];

  const currentNav = adminNav.find(n => n.path === location.pathname || (n.path !== '/admin' && location.pathname.startsWith(n.path))) || adminNav[0];

  const handleExitAdmin = () => {
    setActiveRole('customer');
    navigate('/');
    showToast('Exited Super Admin Governance Console', 'info');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      
      {/* Responsive Media Query Styles */}
      <style>{`
        @media (max-width: 1023px) {
          .desktop-admin-sidebar {
            display: none !important;
          }
          .mobile-admin-header-btn {
            display: flex !important;
          }
          .admin-main-wrapper {
            width: 100% !important;
            padding: 14px 14px 40px !important;
          }
          .admin-top-header {
            padding: 10px 14px !important;
          }
          .admin-search-box {
            display: none !important;
          }
          .admin-uptime-chip {
            display: none !important;
          }
        }
        @media (min-width: 1024px) {
          .desktop-admin-sidebar {
            display: flex !important;
          }
          .mobile-admin-header-btn {
            display: none !important;
          }
          .admin-main-wrapper {
            padding: 24px 28px !important;
          }
          .admin-top-header {
            padding: 12px 28px !important;
          }
        }
      `}</style>

      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP PERMANENT SIDEBAR (Hidden on Mobile < 1024px)
      ─────────────────────────────────────────────────────────────── */}
      <aside className="desktop-admin-sidebar" style={{
        width: isSidebarOpen ? '270px' : '76px',
        background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 50,
        boxShadow: '4px 0 25px rgba(0, 0, 0, 0.25)',
        color: '#FFFFFF',
        flexShrink: 0
      }}>
        
        {/* Brand Lockup Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.45)',
              flexShrink: 0
            }}>
              <ShieldCheck size={24} />
            </div>
            {isSidebarOpen && (
              <div>
                <div style={{ fontSize: '16px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Avero</span>
                  <span style={{ fontSize: '10px', background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)', padding: '1px 6px', borderRadius: '4px', fontWeight: '800' }}>
                    ADMIN
                  </span>
                </div>
                <div style={{ fontSize: '10.5px', color: '#34D399', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34D399', boxShadow: '0 0 8px #34D399' }} />
                  Master Production
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '8px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94A3B8',
              cursor: 'pointer'
            }}
          >
            <Menu size={16} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto' }} className="no-scrollbar">
          {adminNav.map(item => {
            const IconComp = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.label}
                to={item.path}
                title={!isSidebarOpen ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isSidebarOpen ? 'space-between' : 'center',
                  padding: isSidebarOpen ? '10px 14px' : '10px 0',
                  borderRadius: '10px',
                  background: isActive
                    ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)'
                    : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  fontWeight: isActive ? '800' : '600',
                  fontSize: '13px',
                  textDecoration: 'none',
                  border: isActive ? '1px solid rgba(96, 165, 250, 0.4)' : '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? '#60A5FA' : item.color,
                    flexShrink: 0
                  }}>
                    <IconComp size={16} color={isActive ? '#60A5FA' : item.color} />
                  </div>
                  {isSidebarOpen && <span>{item.label}</span>}
                </div>

                {isSidebarOpen && item.badge && (
                  <span style={{
                    background: item.badge === '2' ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                    color: '#FFFFFF',
                    fontSize: '10.5px',
                    fontWeight: '900',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0, 0, 0, 0.2)' }}>
          {isSidebarOpen ? (
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '900',
                  boxShadow: '0 4px 12px rgba(236, 72, 153, 0.35)',
                  flexShrink: 0
                }}>
                  SA
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '900', color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Super Administrator
                  </div>
                  <div style={{ fontSize: '11px', color: '#A78BFA', fontWeight: '700' }}>
                    Root Access Level 1
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsAdminAuthModalOpen(true)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    padding: '7px 8px',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    background: 'rgba(59, 130, 246, 0.15)',
                    color: '#60A5FA',
                    fontSize: '11.5px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  <KeyRound size={13} /> 2FA Verify
                </button>
                <button
                  type="button"
                  onClick={handleExitAdmin}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    padding: '7px 8px',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#F87171',
                    fontSize: '11.5px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={13} /> Exit
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900' }}>SA</div>
              <button type="button" onClick={handleExitAdmin} style={{ padding: '6px', borderRadius: '8px', border: 'none', background: 'rgba(239, 68, 68, 0.2)', color: '#F87171', cursor: 'pointer' }}><LogOut size={14} /></button>
            </div>
          )}
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. SLIDE-OUT MOBILE DRAWER SIDEBAR
      ─────────────────────────────────────────────────────────────── */}
      {mobileDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex'
          }}
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div
            style={{
              width: '82%',
              maxWidth: '320px',
              height: '100%',
              background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '10px 0 30px rgba(0,0,0,0.5)',
              animation: 'slideInLeft 0.25s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '900' }}>Avero Admin</div>
                  <div style={{ fontSize: '10px', color: '#34D399', fontWeight: '800' }}>● Production Master</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Nav links */}
            <nav style={{ flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
              {adminNav.map(item => {
                const IconComp = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileDrawerOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: isActive ? 'rgba(59, 130, 246, 0.25)' : 'transparent',
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      fontWeight: isActive ? '800' : '600',
                      fontSize: '13px',
                      textDecoration: 'none',
                      border: isActive ? '1px solid rgba(96, 165, 250, 0.4)' : '1px solid transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <IconComp size={16} color={isActive ? '#60A5FA' : item.color} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span style={{ fontSize: '10px', fontWeight: '900', backgroundColor: '#DC2626', color: '#FFFFFF', padding: '2px 7px', borderRadius: '9999px' }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Footer Exit */}
            <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <button
                type="button"
                onClick={handleExitAdmin}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#F87171',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={15} /> Exit Super Admin
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN CONTENT CONTAINER WITH DELUXE TOP BAR
      ─────────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: '#F8FAFC' }}>
        
        {/* Deluxe Top Header Bar */}
        <header className="admin-top-header" style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          {/* Left: Mobile Hamburger & Current Page Identifier */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <button
              type="button"
              className="mobile-admin-header-btn"
              onClick={() => setMobileDrawerOpen(true)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.25)',
                flexShrink: 0
              }}
              title="Open Navigation Menu"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb & Dynamic Module Chip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <currentNav.icon size={16} color="#2563EB" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '13.5px', fontWeight: '900', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentNav.label}
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '1px' }}>
                  <span>Admin Console</span>
                  <span>›</span>
                  <span style={{ color: '#059669', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#059669' }} /> Live
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Search Bar (Desktop) */}
          <div className="admin-search-box" style={{ flex: 1, maxWidth: '320px', margin: '0 16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '6px 12px',
              fontSize: '12px'
            }}>
              <Search size={14} color="#94A3B8" />
              <input
                type="text"
                placeholder="Quick jump / search (⌘K)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  width: '100%',
                  fontSize: '12px',
                  color: '#0F172A'
                }}
              />
            </div>
          </div>

          {/* Right Action Hub */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            
            {/* System Health Badge (Desktop) */}
            <div className="admin-uptime-chip" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              padding: '5px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '800',
              color: '#059669'
            }}>
              <Activity size={13} color="#059669" />
              <span>99.98% Uptime</span>
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => showToast('All systems normal. 0 active alerts.', 'info')}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B',
                cursor: 'pointer',
                position: 'relative'
              }}
              title="Notifications"
            >
              <Bell size={16} />
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '7px',
                height: '7px',
                backgroundColor: '#2563EB',
                borderRadius: '50%'
              }} />
            </button>

            {/* 2FA Security Pill */}
            <button
              onClick={() => setIsAdminAuthModalOpen(true)}
              style={{
                height: '36px',
                fontSize: '12px',
                backgroundColor: '#F8FAFC',
                color: '#334155',
                padding: '0 12px',
                borderRadius: '8px',
                fontWeight: '800',
                border: '1px solid #CBD5E1',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease'
              }}
            >
              <Lock size={13} color="#2563EB" /> <span className="hidden sm:inline">2FA Settings</span>
            </button>

            {/* Live Storefront Gradient Button */}
            <Link
              to="/"
              style={{
                height: '36px',
                fontSize: '12px',
                fontWeight: '800',
                color: '#FFFFFF',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                padding: '0 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
              }}
            >
              <Globe size={13} /> <span className="hidden sm:inline">Live Store</span> <ExternalLink size={11} />
            </Link>

            {/* Root Super Admin Avatar Chip */}
            <div
              onClick={handleExitAdmin}
              title="Click to Exit Admin Console"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(236, 72, 153, 0.3)',
                flexShrink: 0
              }}
            >
              SA
            </div>

          </div>
        </header>

        {/* Sub-page Content Body */}
        <main className="admin-main-wrapper" style={{ flex: 1 }}>
          {children}
        </main>
      </div>

      <AdminAuthModal isOpen={isAdminAuthModalOpen} onClose={() => setIsAdminAuthModalOpen(false)} />
    </div>
  );
}
