import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import LiveTrackingMap from '../../components/delivery/LiveTrackingMap';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import {
  Truck,
  Package,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  KeyRound,
  ShieldCheck,
  LogOut,
  ArrowRight,
  TrendingUp,
  Award,
  AlertCircle,
  Building,
  UserCheck,
  Bell,
  Navigation,
  IndianRupee,
  Calendar,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  BarChart3,
  Wallet,
  X,
  AlertTriangle,
  Flame,
  Check,
  User,
  CreditCard,
  FileText,
  Camera,
  ShieldAlert,
  Settings,
  HelpCircle,
  Share2,
  Home
} from 'lucide-react';

export default function DeliveryDashboard() {
  const navigate = useNavigate();
  const { tab: paramTab } = useParams();
  const {
    deliveryAgentUser,
    setDeliveryAgentUser,
    logoutDeliveryPartner,
    orders,
    pickupOrderFromSeller,
    markOrderOutForDelivery,
    verifyDeliveryOtp,
    showToast
  } = useApp();

  // Tab State: 'HOME' | 'PICKUPS' | 'ACTIVE' | 'COMPLETED' | 'EARNINGS' | 'PROFILE'
  const [activeTab, setActiveTab] = useState(() => {
    if (paramTab === 'pickups') return 'PICKUPS';
    if (paramTab === 'active') return 'ACTIVE';
    if (paramTab === 'delivered' || paramTab === 'completed') return 'COMPLETED';
    if (paramTab === 'earnings') return 'EARNINGS';
    if (paramTab === 'profile') return 'PROFILE';
    return 'HOME';
  });

  const [isOnDuty, setIsOnDuty] = useState(true);
  const [selectedDeliveredFilter, setSelectedDeliveredFilter] = useState('ALL');

  // Modal States
  const [otpModalOrder, setOtpModalOrder] = useState(null);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const [pickupDetailsModal, setPickupDetailsModal] = useState(null);
  const [navigationModalOrder, setNavigationModalOrder] = useState(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: deliveryAgentUser?.name || 'Suresh Kumar',
    phone: deliveryAgentUser?.phone || '+91 98450 12345',
    email: deliveryAgentUser?.email || 'suresh.delivery@avero.in',
    city: deliveryAgentUser?.city || 'Karur',
    vehicleType: deliveryAgentUser?.vehicleType || 'Motorcycle (Hero Splendor+)',
    vehicleNumber: deliveryAgentUser?.vehicleNumber || 'TN 47 AQ 8921',
    licenseNumber: deliveryAgentUser?.licenseNumber || 'TN-47-2018-0029102',
    avatar: deliveryAgentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    emergencyContact: '+91 94432 09876',
    bankName: 'HDFC Bank Ltd',
    bankAccount: '•••• •••• 8912',
    bankIfsc: 'HDFC0001294'
  });

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: '📦 High-Priority Pickup Available',
      desc: 'Order #AVR-2026001287 at Tech World Store (4.2 km away) is ready for pickup.',
      time: '5 mins ago',
      unread: true,
      type: 'pickup'
    },
    {
      id: 'notif-2',
      title: '⏰ Delivery Window Reminder',
      desc: 'Deliver order for Gandhigram hub before 05:30 PM today to earn ₹25 bonus incentive.',
      time: '20 mins ago',
      unread: true,
      type: 'delivery'
    },
    {
      id: 'notif-3',
      title: '💰 Weekly Incentive Payout Dispatched',
      desc: 'Your previous week payout of ₹3,450 has been settled via IMPS directly to your bank.',
      time: '2 hours ago',
      unread: false,
      type: 'payout'
    }
  ]);

  // Sync tab with URL parameter
  useEffect(() => {
    if (paramTab === 'pickups') setActiveTab('PICKUPS');
    else if (paramTab === 'active') setActiveTab('ACTIVE');
    else if (paramTab === 'delivered' || paramTab === 'completed') setActiveTab('COMPLETED');
    else if (paramTab === 'earnings') setActiveTab('EARNINGS');
    else if (paramTab === 'profile') setActiveTab('PROFILE');
    else if (!paramTab) setActiveTab('HOME');
  }, [paramTab]);

  if (!deliveryAgentUser?.isAuth) {
    return null;
  }

  // Filter orders according to fulfillment stage
  const pendingPickups = orders.filter(o => o.status === 'Confirmed' || o.status === 'Packed');
  const activeDeliveries = orders.filter(o => o.status === 'Shipped' || o.status === 'Out for Delivery' || o.status === 'In Transit');
  const completedDeliveries = orders.filter(o => o.status === 'Delivered');

  // Dynamic Metrics
  const calculatedEarningsToday = (deliveryAgentUser.earningsToday || 1450) + (completedDeliveries.length * 85);
  const calculatedCompletedCount = (deliveryAgentUser.completedDeliveries || 148) + completedDeliveries.length;
  const unreadNotifCount = notifications.filter(n => n.unread).length;

  // OTP Handling
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      const cleanDigits = value.replace(/\D/g, '').slice(0, 4).split('');
      const newDigits = ['', '', '', ''];
      cleanDigits.forEach((digit, i) => {
        newDigits[i] = digit;
      });
      setOtpDigits(newDigits);
      setOtpError('');
      if (cleanDigits.length === 4) {
        otpInputRefs[3]?.current?.focus();
      }
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setOtpError('');

    if (digit && index < 3) {
      otpInputRefs[index + 1]?.current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1]?.current?.focus();
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 4) {
      setOtpError('Please enter all 4 digits of the customer verification OTP');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');

    setTimeout(() => {
      const res = verifyDeliveryOtp(otpModalOrder.id, fullOtp);
      setIsVerifyingOtp(false);

      if (res.success) {
        setOtpModalOrder(null);
        setOtpDigits(['', '', '', '']);
        setOtpError('');
        showToast('🎉 Delivery Completed & OTP Verified! +₹85 credited to your balance.', 'success');
      } else {
        setOtpError('Incorrect OTP! Please ask the customer to check the 4-digit code on their tracking screen.');
      }
    }, 500);
  };

  const handleAcceptPickupAction = (orderId) => {
    if (!isOnDuty) {
      showToast('Please switch to ONLINE mode to accept new pickups!', 'warning');
      return;
    }
    pickupOrderFromSeller(orderId);
    setPickupDetailsModal(null);
    setActiveTab('ACTIVE');
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    showToast('Uploading profile photo to Cloudinary CDN...', 'info');

    try {
      const res = await uploadToCloudinary(file);
      if (res?.secureUrl) {
        setProfileForm(prev => ({ ...prev, avatar: res.secureUrl }));
        if (setDeliveryAgentUser) {
          setDeliveryAgentUser(prev => ({ ...prev, avatar: res.secureUrl }));
        }
        showToast('Profile photo updated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload photo', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfileSubmit = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.phone.trim()) {
      showToast('Name and phone are required', 'error');
      return;
    }
    if (setDeliveryAgentUser) {
      setDeliveryAgentUser(prev => ({
        ...prev,
        name: profileForm.name,
        phone: profileForm.phone,
        city: profileForm.city,
        vehicleNumber: profileForm.vehicleNumber,
        avatar: profileForm.avatar
      }));
    }
    setIsEditProfileModalOpen(false);
    showToast('Profile updated successfully!', 'success');
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('All notifications marked as read', 'info');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      color: '#0F172A',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '90px'
    }}>

      {/* =========================================================================
         1. TOP LOGISTICS APP HEADER
         ========================================================================= */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '12px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          
          {/* Driver Avatar & Hub Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              onClick={() => setActiveTab('PROFILE')}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                backgroundColor: '#0284C7',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
                overflow: 'hidden',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              {profileForm.avatar ? (
                <img src={profileForm.avatar} alt="Driver Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Truck size={24} />
              )}
            </div>

            <div>
              <div style={{ fontSize: '15px', fontWeight: '900', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {profileForm.name}
                <span style={{
                  fontSize: '11px',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  border: '1px solid #A7F3D0',
                  padding: '1px 6px',
                  borderRadius: '6px',
                  fontWeight: '800'
                }}>
                  ⭐ 4.9
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
                <span style={{ fontWeight: '700', color: '#334155' }}>
                  {profileForm.vehicleNumber}
                </span>
                <span>•</span>
                <span>{profileForm.city} Central Hub</span>
              </div>
            </div>
          </div>

          {/* Duty Switch, Notification Bell & Quick Profile Link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            
            <button
              type="button"
              onClick={() => {
                const next = !isOnDuty;
                setIsOnDuty(next);
                showToast(
                  next ? '🟢 You are now ONLINE (Ready to receive pickups)' : '🔴 You are now OFFLINE (Rest Mode)',
                  next ? 'success' : 'info'
                );
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '9999px',
                border: isOnDuty ? '1.5px solid #10B981' : '1.5px solid #CBD5E1',
                backgroundColor: isOnDuty ? '#ECFDF5' : '#F1F5F9',
                color: isOnDuty ? '#065F46' : '#64748B',
                fontSize: '12.5px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: isOnDuty ? '0 2px 8px rgba(16, 185, 129, 0.2)' : 'none',
                minHeight: '38px'
              }}
            >
              <span style={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                backgroundColor: isOnDuty ? '#10B981' : '#94A3B8'
              }} />
              {isOnDuty ? 'ONLINE' : 'OFFLINE'}
            </button>

            <button
              type="button"
              onClick={() => setIsNotificationDrawerOpen(true)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#334155',
                cursor: 'pointer',
                position: 'relative'
              }}
              title="Notifications"
            >
              <Bell size={18} />
              {unreadNotifCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: '900',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF'
                }}>
                  {unreadNotifCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('PROFILE')}
              style={{
                backgroundColor: activeTab === 'PROFILE' ? '#EFF6FF' : '#F1F5F9',
                border: activeTab === 'PROFILE' ? '1px solid #BFDBFE' : '1px solid #CBD5E1',
                color: activeTab === 'PROFILE' ? '#1D4ED8' : '#475569',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '12.5px',
                fontWeight: '800',
                minHeight: '38px'
              }}
              title="My Driver Profile"
            >
              <User size={16} />
              <span className="desktop-only-text">Profile</span>
            </button>

          </div>

        </div>
      </header>

      {/* Offline Rest Mode Ribbon */}
      {!isOnDuty && (
        <div style={{
          backgroundColor: '#FEF2F2',
          borderBottom: '1px solid #FECACA',
          padding: '10px 16px',
          color: '#991B1B',
          fontSize: '12.5px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          textAlign: 'center'
        }}>
          <AlertCircle size={16} color="#DC2626" />
          <span>You are currently <strong>OFFLINE (Rest Mode)</strong>. Switch to ONLINE to receive incoming seller pickups. Existing deliveries remain accessible.</span>
        </div>
      )}

      {/* =========================================================================
         2. TOP DESKTOP WORKFLOW TABS (Hidden on small mobile, bottom nav on all)
         ========================================================================= */}
      <div style={{
        maxWidth: '1000px',
        width: '100%',
        margin: '16px auto 0',
        padding: '0 16px'
      }} className="desktop-tab-bar">
        <div style={{
          display: 'flex',
          backgroundColor: '#E2E8F0',
          borderRadius: '14px',
          padding: '4px',
          gap: '4px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }} className="no-scrollbar">
          
          {[
            { id: 'HOME', label: 'Overview', icon: Home },
            { id: 'PICKUPS', label: '1. Seller Pickups', icon: Building, count: pendingPickups.length },
            { id: 'ACTIVE', label: '2. Active Orders', icon: Truck, count: activeDeliveries.length },
            { id: 'COMPLETED', label: '3. Delivered', icon: CheckCircle2, count: completedDeliveries.length },
            { id: 'EARNINGS', label: '4. Earnings', icon: Wallet },
            { id: 'PROFILE', label: '5. Driver Profile', icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: '1 1 auto',
                  minHeight: '44px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                  color: isSelected ? '#0284C7' : '#475569',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span style={{
                    backgroundColor: isSelected ? '#0284C7' : '#CBD5E1',
                    color: isSelected ? '#FFFFFF' : '#475569',
                    padding: '2px 7px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: '900'
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}

        </div>
      </div>

      {/* =========================================================================
         3. MAIN TAB CONTENT AREA
         ========================================================================= */}
      <main style={{
        maxWidth: '1000px',
        width: '100%',
        margin: '16px auto',
        padding: '0 16px',
        flex: 1
      }}>

        {/* -----------------------------------------------------------------------
           TAB: HOME / OVERVIEW
           ----------------------------------------------------------------------- */}
        {activeTab === 'HOME' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* 4 Summary Stat Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px'
            }}>
              <div
                onClick={() => setActiveTab('EARNINGS')}
                style={{
                  backgroundColor: '#F0FDF4',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid #BBF7D0',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '11px', color: '#166534', fontWeight: '800', textTransform: 'uppercase' }}>Today's Earnings</div>
                <div style={{ fontSize: '24px', fontWeight: '950', color: '#15803D', marginTop: '2px' }}>
                  ₹{calculatedEarningsToday.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', marginTop: '4px' }}>
                  +₹85 per verified order
                </div>
              </div>

              <div
                onClick={() => setActiveTab('COMPLETED')}
                style={{
                  backgroundColor: '#F0F9FF',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid #BAE6FD',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '11px', color: '#0369A1', fontWeight: '800', textTransform: 'uppercase' }}>Completed Deliveries</div>
                <div style={{ fontSize: '24px', fontWeight: '950', color: '#0284C7', marginTop: '2px' }}>
                  {calculatedCompletedCount} <span style={{ fontSize: '14px', fontWeight: '700' }}>Orders</span>
                </div>
                <div style={{ fontSize: '11px', color: '#0284C7', fontWeight: '700', marginTop: '4px' }}>
                  98.4% Customer SLA
                </div>
              </div>

              <div
                onClick={() => setActiveTab('PICKUPS')}
                style={{
                  backgroundColor: '#FFFBEB',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid #FDE68A',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '11px', color: '#92400E', fontWeight: '800', textTransform: 'uppercase' }}>Available Pickups</div>
                <div style={{ fontSize: '24px', fontWeight: '950', color: '#D97706', marginTop: '2px' }}>
                  {pendingPickups.length} <span style={{ fontSize: '14px', fontWeight: '700' }}>Orders</span>
                </div>
                <div style={{ fontSize: '11px', color: '#b45309', fontWeight: '700', marginTop: '4px' }}>
                  Ready at Seller Hubs
                </div>
              </div>

              <div
                onClick={() => setActiveTab('ACTIVE')}
                style={{
                  backgroundColor: '#FAF5FF',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid #E9D5FF',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '11px', color: '#6B21A8', fontWeight: '800', textTransform: 'uppercase' }}>Active Deliveries</div>
                <div style={{ fontSize: '24px', fontWeight: '950', color: '#7C3AED', marginTop: '2px' }}>
                  {activeDeliveries.length} <span style={{ fontSize: '14px', fontWeight: '700' }}>Packages</span>
                </div>
                <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: '700', marginTop: '4px' }}>
                  Out for Doorstep Handover
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Grid */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '18px'
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#0F172A', margin: '0 0 14px' }}>
                ⚡ Quick Fleet Actions
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('PICKUPS')}
                  className="btn btn-primary"
                  style={{ minHeight: '44px', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Building size={16} /> Accept Pickups ({pendingPickups.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('ACTIVE')}
                  style={{
                    backgroundColor: '#7C3AED',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    minHeight: '44px',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Truck size={16} /> Active Deliveries ({activeDeliveries.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('PROFILE')}
                  style={{
                    backgroundColor: '#F1F5F9',
                    color: '#0F172A',
                    border: '1px solid #CBD5E1',
                    borderRadius: '10px',
                    minHeight: '44px',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <User size={16} /> View Driver Profile
                </button>
              </div>
            </div>

            {/* Shift Incentive & Progress Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              borderRadius: '16px',
              padding: '20px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px'
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '900', color: '#38BDF8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  🔥 Peak Hour Incentive Active
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '900', margin: '4px 0', color: '#FFFFFF' }}>
                  Earn +₹25 Bonus per Order in Karur Central
                </h3>
                <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: 0 }}>
                  Valid today between 04:00 PM and 08:00 PM on all verified deliveries.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('PICKUPS')}
                style={{
                  backgroundColor: '#38BDF8',
                  color: '#0F172A',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '900',
                  cursor: 'pointer'
                }}
              >
                Go to Pickups →
              </button>
            </div>

          </div>
        )}

        {/* -----------------------------------------------------------------------
           TAB: SELLER PICKUPS
           ----------------------------------------------------------------------- */}
        {activeTab === 'PICKUPS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                  Available Seller Pickups ({pendingPickups.length})
                </h2>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0' }}>
                  Pick up verified & sealed packages from local merchant fulfillment hubs:
                </p>
              </div>
            </div>

            {pendingPickups.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '48px 24px',
                textAlign: 'center',
                border: '1px solid #E2E8F0'
              }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#F1F5F9', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Package size={28} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: 0 }}>No Pending Seller Pickups</h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '6px' }}>
                  All scheduled packages have been dispatched. Check back in a few minutes.
                </p>
              </div>
            ) : (
              pendingPickups.map((order) => (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid #E2E8F0',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: '900', color: '#0284C7' }}>
                        📦 ORDER #{order.id}
                      </span>
                      <span style={{
                        backgroundColor: '#FEF2F2',
                        color: '#DC2626',
                        border: '1px solid #FECACA',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: '900'
                      }}>
                        🔴 URGENT
                      </span>
                    </div>

                    <div style={{ fontSize: '12.5px', fontWeight: '900', color: '#059669', backgroundColor: '#ECFDF5', padding: '3px 10px', borderRadius: '8px' }}>
                      Earn: ₹85
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '12px',
                    border: '1px solid #E2E8F0'
                  }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '800', textTransform: 'uppercase', marginBottom: '3px' }}>
                        🏪 Seller Pickup Hub
                      </div>
                      <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>
                        {order.items?.[0]?.seller || 'Tech World Store Hub'}
                      </strong>
                      <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} color="#0284C7" /> Karur Industrial Estate, 4.2 km away
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '800', textTransform: 'uppercase', marginBottom: '3px' }}>
                        🎯 Destination Delivery Area
                      </div>
                      <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>
                        Deliver to: {order.deliveryAddress?.city || 'Gandhigram, Karur'}
                      </strong>
                      <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                        📏 4.2 km Distance • 1 Package (0.8 kg)
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setPickupDetailsModal(order)}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '10px',
                        backgroundColor: '#F1F5F9',
                        border: '1px solid #CBD5E1',
                        color: '#334155',
                        fontSize: '13px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        minHeight: '44px'
                      }}
                    >
                      View Package Details
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAcceptPickupAction(order.id)}
                      className="btn btn-primary"
                      style={{ flex: 1, minHeight: '44px', fontWeight: '900' }}
                    >
                      <Package size={16} /> Accept Pickup & Begin Delivery
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* -----------------------------------------------------------------------
           TAB: ACTIVE DELIVERIES
           ----------------------------------------------------------------------- */}
        {activeTab === 'ACTIVE' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
              Active Orders in Progress ({activeDeliveries.length})
            </h2>

            {activeDeliveries.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '48px 24px',
                textAlign: 'center',
                border: '1px solid #E2E8F0'
              }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Truck size={28} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: 0 }}>No Active Deliveries</h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '6px' }}>
                  Pick up orders from the Seller Pickups tab to begin dispatching.
                </p>
              </div>
            ) : (
              activeDeliveries.map((order) => (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid #DDD6FE',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: '0 4px 16px rgba(124, 58, 237, 0.06)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: '900', color: '#7C3AED', textTransform: 'uppercase' }}>
                        Active Dispatch #{order.id}
                      </span>
                      <div style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', marginTop: '2px' }}>
                        Deliver to: {order.deliveryAddress?.name || 'Customer'}
                      </div>
                    </div>

                    <div style={{
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      backgroundColor: order.status === 'Out for Delivery' ? '#EFF6FF' : '#F3E8FF',
                      color: order.status === 'Out for Delivery' ? '#1D4ED8' : '#6B21A8',
                      border: order.status === 'Out for Delivery' ? '1px solid #BFDBFE' : '1px solid #D8B4FE',
                      fontSize: '12px',
                      fontWeight: '800',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Truck size={14} /> Status: {order.status}
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '800', color: '#059669' }}>
                      <CheckCircle2 size={16} /> 1. Picked Up
                    </div>
                    <div style={{ height: '2px', flex: 1, backgroundColor: '#7C3AED' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '800', color: '#7C3AED' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#7C3AED' }} />
                      2. In Transit
                    </div>
                    <div style={{ height: '2px', flex: 1, backgroundColor: '#CBD5E1' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#64748B' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
                      3. Doorstep OTP
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '12px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <MapPin size={18} color="#0284C7" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Customer Address</div>
                        <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>
                          {order.deliveryAddress?.flat ? `${order.deliveryAddress.flat}, ` : ''}
                          {order.deliveryAddress?.area || ''} {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
                        </strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
                      <div style={{ fontSize: '12.5px', color: '#475569' }}>
                        Payment: <strong>
                          {order.paymentMethod === 'Cash on Delivery' ? (
                            <span style={{ color: '#DC2626', backgroundColor: '#FEF2F2', padding: '2px 8px', borderRadius: '4px', border: '1px solid #FECACA' }}>
                              💵 Collect Cash: ₹{order.totalAmount?.toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span style={{ color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                              💳 Prepaid (Online)
                            </span>
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                    <a
                      href={`tel:${order.deliveryAddress?.phone || '9845012345'}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        backgroundColor: '#F8FAFC',
                        color: '#0F172A',
                        border: '1px solid #CBD5E1',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        fontSize: '13px',
                        fontWeight: '800',
                        textDecoration: 'none',
                        minHeight: '44px'
                      }}
                    >
                      <Phone size={15} color="#0284C7" /> Call Customer
                    </a>

                    <button
                      type="button"
                      onClick={() => setNavigationModalOrder(order)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        backgroundColor: '#EFF6FF',
                        color: '#1D4ED8',
                        border: '1px solid #BFDBFE',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        fontSize: '13px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        minHeight: '44px'
                      }}
                    >
                      <Navigation size={15} /> GPS Navigate
                    </button>

                    {order.status !== 'Out for Delivery' && (
                      <button
                        type="button"
                        onClick={() => markOrderOutForDelivery(order.id)}
                        style={{
                          backgroundColor: '#F3E8FF',
                          color: '#7C3AED',
                          border: '1px solid #D8B4FE',
                          borderRadius: '10px',
                          padding: '10px 14px',
                          fontSize: '13px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          minHeight: '44px'
                        }}
                      >
                        🚚 Mark Out for Delivery
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setOtpModalOrder(order);
                        setOtpDigits(['', '', '', '']);
                        setOtpError('');
                        setTimeout(() => otpInputRefs[0]?.current?.focus(), 100);
                      }}
                      className="btn btn-buy-now"
                      style={{
                        minHeight: '44px',
                        fontSize: '13.5px',
                        fontWeight: '900',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <KeyRound size={16} /> Verify Doorstep OTP
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* -----------------------------------------------------------------------
           TAB: DELIVERED RECORDS
           ----------------------------------------------------------------------- */}
        {activeTab === 'COMPLETED' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                Delivered Packages ({completedDeliveries.length})
              </h2>

              <div style={{ display: 'flex', gap: '6px' }}>
                {['ALL', 'TODAY', 'WEEK', 'MONTH'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSelectedDeliveredFilter(f)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: selectedDeliveredFilter === f ? '1px solid #059669' : '1px solid #CBD5E1',
                      backgroundColor: selectedDeliveredFilter === f ? '#ECFDF5' : '#FFFFFF',
                      color: selectedDeliveredFilter === f ? '#059669' : '#64748B',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {f === 'ALL' ? 'All Time' : f === 'TODAY' ? 'Today' : f === 'WEEK' ? 'This Week' : 'This Month'}
                  </button>
                ))}
              </div>
            </div>

            {completedDeliveries.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '48px 24px',
                textAlign: 'center',
                border: '1px solid #E2E8F0'
              }}>
                <CheckCircle2 size={36} color="#15803D" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: 0 }}>No Completed Deliveries Yet</h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '6px' }}>
                  Your completed deliveries and verified payout records will appear here.
                </p>
              </div>
            ) : (
              completedDeliveries.map((order) => (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid #E2E8F0',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <CheckCircle2 size={22} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '14px', color: '#0F172A' }}>
                          Order #{order.id}
                        </strong>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#15803D', backgroundColor: '#ECFDF5', padding: '1px 6px', borderRadius: '4px', border: '1px solid #BBF7D0' }}>
                          ✓ OTP Verified
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        Delivered to {order.deliveryAddress?.name} ({order.deliveryAddress?.city}) • {order.deliveredAt || 'Today, 04:35 PM'}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '15px', fontWeight: '900', color: '#15803D' }}>
                      +₹85 Earned
                    </div>
                    <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>
                      Payout: Settled
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* -----------------------------------------------------------------------
           TAB: EARNINGS & PAYOUTS
           ----------------------------------------------------------------------- */}
        {activeTab === 'EARNINGS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
              Earnings & Payout Ledger
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '800', textTransform: 'uppercase' }}>Weekly Earned</div>
                <div style={{ fontSize: '24px', fontWeight: '950', color: '#0F172A', marginTop: '4px' }}>₹8,925</div>
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: '700', marginTop: '2px' }}>105 deliveries completed</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '800', textTransform: 'uppercase' }}>Available for Withdrawal</div>
                <div style={{ fontSize: '24px', fontWeight: '950', color: '#059669', marginTop: '4px' }}>₹{calculatedEarningsToday}</div>
                <div style={{ fontSize: '11px', color: '#0284C7', fontWeight: '700', marginTop: '2px' }}>Instant IMPS transfer eligible</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '800', textTransform: 'uppercase' }}>Incentives & Bonuses</div>
                <div style={{ fontSize: '24px', fontWeight: '950', color: '#D97706', marginTop: '4px' }}>₹1,250</div>
                <div style={{ fontSize: '11px', color: '#D97706', fontWeight: '700', marginTop: '2px' }}>Peak hour & festival surge</div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Recent Bank Settlement History
                </h3>
                <button
                  type="button"
                  onClick={() => showToast('Withdrawal request submitted! Processing via Instant IMPS...', 'success')}
                  style={{
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Withdraw Now
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { date: '18 Aug 2026', deliveries: 22, amount: 1870, status: 'Paid', utr: 'IMPS/624910284910' },
                  { date: '11 Aug 2026', deliveries: 28, amount: 2380, status: 'Paid', utr: 'IMPS/624910118273' },
                  { date: '04 Aug 2026', deliveries: 25, amount: 2125, status: 'Paid', utr: 'IMPS/624909871625' }
                ].map((row, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 14px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '13px', color: '#0F172A' }}>{row.date}</strong>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                        {row.deliveries} Orders • UTR: {row.utr}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: '900', color: '#15803D' }}>
                        +₹{row.amount.toLocaleString('en-IN')}
                      </div>
                      <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#059669', backgroundColor: '#DCFCE7', padding: '1px 6px', borderRadius: '4px' }}>
                        ✓ {row.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
           TAB: DEDICATED DELIVERY DRIVER PROFILE PAGE
           ----------------------------------------------------------------------- */}
        {activeTab === 'PROFILE' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Driver Hero Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '20px',
                    backgroundColor: '#0284C7',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
                  }}>
                    {profileForm.avatar ? (
                      <img src={profileForm.avatar} alt="Driver Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={36} color="#FFFFFF" />
                    )}
                  </div>

                  <label
                    htmlFor="driver-avatar-upload"
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: '2px solid #FFFFFF'
                    }}
                    title="Change Profile Photo"
                  >
                    <Camera size={13} />
                  </label>
                  <input
                    id="driver-avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isUploadingAvatar}
                    style={{ display: 'none' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '950', color: '#0F172A', margin: 0 }}>
                      {profileForm.name}
                    </h2>
                    <span style={{
                      backgroundColor: '#ECFDF5',
                      color: '#059669',
                      border: '1px solid #A7F3D0',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: '800'
                    }}>
                      ✓ Verified Gold Fleet Partner
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                    {profileForm.phone} • {profileForm.email}
                  </div>

                  <div style={{ fontSize: '12px', color: '#0284C7', fontWeight: '700', marginTop: '2px' }}>
                    Driver ID: <code style={{ fontWeight: '900' }}>DP-1001</code> • Joined March 2024
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditProfileModalOpen(true)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  color: '#1D4ED8',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Edit Profile Details
              </button>
            </div>

            {/* Performance KPI Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '12px'
            }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '800' }}>CUSTOMER RATING</div>
                <div style={{ fontSize: '22px', fontWeight: '950', color: '#D97706', marginTop: '2px' }}>4.9 ★</div>
                <div style={{ fontSize: '10.5px', color: '#64748B' }}>148 5-star reviews</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '800' }}>TOTAL DELIVERIES</div>
                <div style={{ fontSize: '22px', fontWeight: '950', color: '#0284C7', marginTop: '2px' }}>{calculatedCompletedCount}</div>
                <div style={{ fontSize: '10.5px', color: '#64748B' }}>100% verified drop-offs</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '800' }}>ON-TIME SLA</div>
                <div style={{ fontSize: '22px', fontWeight: '950', color: '#059669', marginTop: '2px' }}>98.4%</div>
                <div style={{ fontSize: '10.5px', color: '#64748B' }}>Under 25 mins avg.</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '800' }}>LIFETIME PAYOUT</div>
                <div style={{ fontSize: '22px', fontWeight: '950', color: '#15803D', marginTop: '2px' }}>₹32,450</div>
                <div style={{ fontSize: '10.5px', color: '#64748B' }}>Direct IMPS Settled</div>
              </div>
            </div>

            {/* Vehicle & KYC Documents Section */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '20px'
            }}>
              <h3 style={{ fontSize: '15.5px', fontWeight: '900', color: '#0F172A', margin: '0 0 14px' }}>
                🚗 Vehicle & Document Verification
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '800' }}>VEHICLE MODEL & TYPE</div>
                  <strong style={{ fontSize: '13.5px', color: '#0F172A', display: 'block', marginTop: '2px' }}>
                    {profileForm.vehicleType}
                  </strong>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>✓ Verified Two-Wheeler</span>
                </div>

                <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '800' }}>REGISTRATION NUMBER</div>
                  <strong style={{ fontSize: '13.5px', color: '#0F172A', display: 'block', marginTop: '2px' }}>
                    {profileForm.vehicleNumber}
                  </strong>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>✓ RC Book Active</span>
                </div>

                <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '800' }}>DRIVING LICENSE</div>
                  <strong style={{ fontSize: '13.5px', color: '#0F172A', display: 'block', marginTop: '2px' }}>
                    {profileForm.licenseNumber}
                  </strong>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>✓ Valid Commercial Rider DL</span>
                </div>

                <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '800' }}>SERVICE HUB & ALLOCATION</div>
                  <strong style={{ fontSize: '13.5px', color: '#0F172A', display: 'block', marginTop: '2px' }}>
                    {profileForm.city} Central Distribution Hub
                  </strong>
                  <span style={{ fontSize: '11px', color: '#0284C7', fontWeight: '700' }}>Pin: 639117 • Tamil Nadu</span>
                </div>
              </div>
            </div>

            {/* Payout Bank Account Details */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '15.5px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                  🏦 Bank Account for Daily Payouts
                </h3>
                <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: '800', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '6px' }}>
                  ✓ Instant IMPS Active
                </span>
              </div>

              <div style={{
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0F172A' }}>{profileForm.bankName}</strong>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Account: {profileForm.bankAccount} • IFSC: {profileForm.bankIfsc}</div>
                  </div>
                </div>

                <span style={{ fontSize: '12px', color: '#0284C7', fontWeight: '800' }}>Primary Payout Account</span>
              </div>
            </div>

            {/* Insurance & Emergency Safety Card */}
            <div style={{
              backgroundColor: '#FEF2F2',
              borderRadius: '16px',
              border: '1px solid #FECACA',
              padding: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#991B1B', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={16} color="#DC2626" /> Group Rider Accident Protection Active
                </div>
                <strong style={{ fontSize: '14px', color: '#7F1D1D', display: 'block', marginTop: '2px' }}>
                  Coverage up to ₹5,00,000 (Avero Fleet Welfare Policy)
                </strong>
                <div style={{ fontSize: '11.5px', color: '#991B1B' }}>
                  Emergency SOS Contact: <strong>{profileForm.emergencyContact}</strong>
                </div>
              </div>

              <a
                href="tel:112"
                style={{
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '900',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                🚨 Emergency SOS
              </a>
            </div>

            {/* Logout Row */}
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  logoutDeliveryPartner();
                  navigate('/delivery/auth');
                }}
                style={{
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={16} /> Logout of Delivery Partner Account
              </button>
            </div>

          </div>
        )}

      </main>

      {/* =========================================================================
         4. PERSISTENT FLEET BOTTOM NAVIGATION BAR (Fixed on Mobile & Desktop)
         ========================================================================= */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        padding: '8px 16px calc(8px + env(safe-area-inset-bottom, 0px))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 999,
        boxShadow: '0 -4px 16px rgba(15, 23, 42, 0.08)'
      }}>
        
        <button
          type="button"
          onClick={() => setActiveTab('HOME')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: activeTab === 'HOME' ? '#0284C7' : '#64748B',
            cursor: 'pointer',
            minHeight: '44px'
          }}
        >
          <Home size={20} />
          <span style={{ fontSize: '11px', fontWeight: '800' }}>Home</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PICKUPS')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: activeTab === 'PICKUPS' ? '#0284C7' : '#64748B',
            cursor: 'pointer',
            minHeight: '44px',
            position: 'relative'
          }}
        >
          <Building size={20} />
          <span style={{ fontSize: '11px', fontWeight: '800' }}>Pickups</span>
          {pendingPickups.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '0',
              right: '-4px',
              backgroundColor: '#0284C7',
              color: '#FFFFFF',
              fontSize: '9px',
              fontWeight: '900',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {pendingPickups.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ACTIVE')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: activeTab === 'ACTIVE' ? '#7C3AED' : '#64748B',
            cursor: 'pointer',
            minHeight: '44px',
            position: 'relative'
          }}
        >
          <Truck size={20} />
          <span style={{ fontSize: '11px', fontWeight: '800' }}>Active</span>
          {activeDeliveries.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '0',
              right: '-4px',
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              fontSize: '9px',
              fontWeight: '900',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {activeDeliveries.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('EARNINGS')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: activeTab === 'EARNINGS' ? '#D97706' : '#64748B',
            cursor: 'pointer',
            minHeight: '44px'
          }}
        >
          <Wallet size={20} />
          <span style={{ fontSize: '11px', fontWeight: '800' }}>Earnings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PROFILE')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: activeTab === 'PROFILE' ? '#2563EB' : '#64748B',
            cursor: 'pointer',
            minHeight: '44px'
          }}
        >
          <User size={20} />
          <span style={{ fontSize: '11px', fontWeight: '800' }}>Profile</span>
        </button>

      </nav>

      {/* =========================================================================
         5. MODALS & DRAWERS
         ========================================================================= */}
      
      {/* 4-Digit OTP Verification Modal */}
      {otpModalOrder && (
        <div
          className="modal-backdrop"
          onClick={() => setOtpModalOrder(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              maxWidth: '440px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              textAlign: 'center',
              color: '#0F172A',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOtpModalOrder(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
            >
              <X size={20} />
            </button>

            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <KeyRound size={28} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '900', margin: 0, color: '#0F172A' }}>
              🔐 Verify Customer Delivery OTP
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginTop: '6px', lineHeight: '1.4' }}>
              Ask customer <strong>{otpModalOrder.deliveryAddress?.name}</strong> for the 4-digit code shown on their tracking screen:
            </p>

            <form onSubmit={handleVerifyOtpSubmit} style={{ marginTop: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '14px' }}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpInputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    style={{
                      width: '54px',
                      height: '58px',
                      borderRadius: '12px',
                      border: digit ? '2px solid #2563EB' : '1.5px solid #CBD5E1',
                      backgroundColor: digit ? '#EFF6FF' : '#F8FAFC',
                      fontSize: '24px',
                      fontWeight: '900',
                      textAlign: 'center',
                      color: '#0F172A',
                      outline: 'none',
                      boxShadow: digit ? '0 2px 8px rgba(37, 99, 235, 0.2)' : 'none'
                    }}
                  />
                ))}
              </div>

              {otpError && (
                <div style={{
                  fontSize: '12px',
                  color: '#DC2626',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  fontWeight: '700'
                }}>
                  {otpError}
                </div>
              )}

              <div style={{
                backgroundColor: '#F0F9FF',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '11px',
                color: '#0369A1',
                marginBottom: '16px',
                textAlign: 'left',
                border: '1px solid #BAE6FD'
              }}>
                ℹ️ Customer OTP: <code style={{ color: '#0284C7', fontWeight: '900', fontSize: '12px' }}>{otpModalOrder.courier?.otp || '7842'}</code>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setOtpModalOrder(null)}
                  style={{
                    flex: 1,
                    minHeight: '44px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#334155',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isVerifyingOtp}
                  className="btn btn-buy-now"
                  style={{
                    flex: 2,
                    minHeight: '44px',
                    fontSize: '14px',
                    fontWeight: '900',
                    borderRadius: '12px'
                  }}
                >
                  {isVerifyingOtp ? 'Verifying...' : 'Verify & Mark Delivered'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GPS Navigation Modal */}
      {navigationModalOrder && (
        <div
          className="modal-backdrop"
          onClick={() => setNavigationModalOrder(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              maxWidth: '540px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Navigation size={18} color="#2563EB" />
                <h3 style={{ fontSize: '16px', fontWeight: '900', margin: 0, color: '#0F172A' }}>
                  GPS Route Navigation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setNavigationModalOrder(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #CBD5E1', marginBottom: '14px' }}>
              <LiveTrackingMap order={navigationModalOrder} />
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${navigationModalOrder.deliveryAddress?.city || 'Karur'} ${navigationModalOrder.deliveryAddress?.pincode || '639117'}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ width: '100%', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: '800' }}
            >
              <ExternalLink size={16} /> Open in Google Maps Navigation
            </a>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsEditProfileModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '900', margin: 0, color: '#0F172A' }}>
                ✏️ Edit Driver Profile Details
              </h3>
              <button
                type="button"
                onClick={() => setIsEditProfileModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Phone Number *
                </label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    value={profileForm.vehicleNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, vehicleNumber: e.target.value })}
                    style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Service Hub City
                  </label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  style={{ flex: 1, height: '42px', borderRadius: '10px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontWeight: '800' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, height: '42px', borderRadius: '10px', fontWeight: '900' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Center Drawer */}
      {isNotificationDrawerOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsNotificationDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              height: '100%',
              backgroundColor: '#FFFFFF',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={20} color="#0284C7" />
                <h3 style={{ fontSize: '17px', fontWeight: '900', margin: 0, color: '#0F172A' }}>
                  Notifications ({unreadNotifCount})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNotificationDrawerOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            {unreadNotifCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284C7',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: '12px'
                }}
              >
                ✓ Mark all as read
              </button>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: n.unread ? '#EFF6FF' : '#F8FAFC',
                    border: n.unread ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <strong style={{ fontSize: '13px', color: '#0F172A' }}>{n.title}</strong>
                  <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: '1.4' }}>{n.desc}</p>
                  <span style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px' }}>{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Package Details Modal */}
      {pickupDetailsModal && (
        <div
          className="modal-backdrop"
          onClick={() => setPickupDetailsModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={18} color="#0284C7" />
                <h3 style={{ fontSize: '16px', fontWeight: '900', margin: 0, color: '#0F172A' }}>
                  Pickup Package Details (#{pickupDetailsModal.id})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPickupDetailsModal(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              {(pickupDetailsModal.items || [
                { title: 'Electronics Package', quantity: 1, price: pickupDetailsModal.totalAmount }
              ]).map((it, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '13px', color: '#0F172A' }}>{it.title}</strong>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Qty: {it.quantity || 1}</div>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                    ₹{(it.price || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleAcceptPickupAction(pickupDetailsModal.id)}
              className="btn btn-primary"
              style={{ width: '100%', minHeight: '44px', fontWeight: '800', fontSize: '14px' }}
            >
              Accept Pickup (Earn ₹85)
            </button>
          </div>
        </div>
      )}

      {/* Responsive Style Tweaks */}
      <style>{`
        @media (max-width: 767px) {
          .desktop-only-text { display: none !important; }
          .desktop-tab-bar { display: none !important; }
        }
        @media (min-width: 768px) {
          .desktop-tab-bar { display: block !important; }
        }
      `}</style>

    </div>
  );
}
