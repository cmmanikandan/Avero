import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { razorpayService } from '../services/razorpay';
import AddressModal from '../components/common/AddressModal';
import { AVAILABLE_COUPONS } from '../data/coupons';
import {
  CheckCircle2,
  MapPin,
  PackageCheck,
  CreditCard,
  Plus,
  Edit2,
  ShieldCheck,
  Smartphone,
  Building,
  Banknote,
  Percent,
  Lock,
  ChevronRight,
  Receipt,
  FileCheck,
  Truck,
  ArrowRight,
  RefreshCw,
  Tag
} from 'lucide-react';

export default function CheckoutFlow() {
  const navigate = useNavigate();
  const {
    user,
    cart,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    currentAddress,
    openAddAddressModal,
    openEditAddressModal,
    setIsAuthModalOpen,
    appliedCoupon,
    setAppliedCoupon,
    removeCoupon,
    placeOrder,
    showToast
  } = useApp();

  const isOrderPlacedRef = useRef(false);

  useEffect(() => {
    if (!user?.isAuth) {
      showToast('Please sign in to access checkout and place your order.', 'warning');
      setIsAuthModalOpen(true);
      navigate('/cart');
    }
  }, [user?.isAuth, navigate, setIsAuthModalOpen, showToast]);

  // Coupon entry state
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);

  // 3-Step Guided Flow: 1 (Address) -> 2 (Order Summary) -> 3 (Payment)
  const [currentStep, setCurrentStep] = useState(1);
  const [editingAddress, setEditingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'NET_BANKING' | 'COD'
  const [upiVpa, setUpiVpa] = useState('');
  const [upiApp, setUpiApp] = useState('gpay');
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));
  const [captchaRotations, setCaptchaRotations] = useState(() => [
    Math.floor(Math.random() * 16) - 8,
    Math.floor(Math.random() * 16) - 8,
    Math.floor(Math.random() * 16) - 8,
    Math.floor(Math.random() * 16) - 8
  ]);
  const [captchaBgIndex, setCaptchaBgIndex] = useState(() => Math.floor(Math.random() * 4));
  const [isRotatingCaptcha, setIsRotatingCaptcha] = useState(false);

  const generateNewCaptcha = () => {
    setIsRotatingCaptcha(true);
    const newCode = String(Math.floor(1000 + Math.random() * 9000));
    setCaptchaCode(newCode);
    setCaptchaRotations([
      Math.floor(Math.random() * 16) - 8,
      Math.floor(Math.random() * 16) - 8,
      Math.floor(Math.random() * 16) - 8,
      Math.floor(Math.random() * 16) - 8
    ]);
    setCaptchaBgIndex(Math.floor(Math.random() * 4));
    setCaptchaInput('');
    setTimeout(() => setIsRotatingCaptcha(false), 400);
  };
  const [includeGst, setIncludeGst] = useState(false);
  const [gstin, setGstin] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Active Selected Address
  const activeAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  // Price calculations
  const totalMrp = cart.reduce((acc, item) => acc + (item.product.mrp * item.quantity), 0);
  const totalSellingPrice = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalProductDiscount = totalMrp - totalSellingPrice;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'fixed') {
      couponDiscount = appliedCoupon.discountAmount;
    } else if (appliedCoupon.discountType === 'percentage') {
      couponDiscount = Math.min(
        appliedCoupon.maxDiscount || 9999,
        Math.round((totalSellingPrice * appliedCoupon.discountPercentage) / 100)
      );
    }
  }

  const platformFee = 7;
  const deliveryFee = totalSellingPrice > 500 ? 0 : 40;
  const finalTotal = Math.max(0, totalSellingPrice - couponDiscount + platformFee + deliveryFee);
  const totalSavings = totalProductDiscount + couponDiscount;

  const handleApplyCouponCode = (codeToApply) => {
    setCouponError('');
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const coupon = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === code);
    if (!coupon) {
      setCouponError(`"${code}" is not a valid coupon code. Try AVERO500 or MEGA100.`);
      return;
    }

    if (coupon.minOrderValue && totalSellingPrice < coupon.minOrderValue) {
      setCouponError(`Min order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required for ${coupon.code} (Current total: ₹${totalSellingPrice.toLocaleString('en-IN')})`);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponInput('');
    setCouponError('');
    showToast(`🎉 Coupon "${coupon.code}" applied successfully!`, 'success');
  };

  useEffect(() => {
    if (cart.length === 0 && !isOrderPlacedRef.current && !isProcessing) {
      const timer = setTimeout(() => {
        if (cart.length === 0 && !isOrderPlacedRef.current) {
          navigate('/cart');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [cart.length, navigate, isProcessing]);

  if (cart.length === 0 && !isOrderPlacedRef.current && !isProcessing) {
    return (
      <div className="container" style={{ padding: '60px 16px', textAlign: 'center' }}>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Your shopping cart is empty. Redirecting...</p>
      </div>
    );
  }

  const handleInitiateOrder = () => {
    if (paymentMethod === 'COD') {
      if (captchaInput !== captchaCode) {
        showToast('Please enter the correct 4-digit Captcha code for Cash on Delivery', 'error');
        return;
      }
    }
    if (paymentMethod === 'CARD') {
      if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 16) {
        // Pre-fill demo card if empty for rapid testing
        setCardDetails(prev => ({
          ...prev,
          number: prev.number || '4242 4242 4242 4242',
          expiry: prev.expiry || '12/28',
          cvv: prev.cvv || '888',
          name: prev.name || user?.name || 'Avero Member'
        }));
      }
    }
    setIsConfirmModalOpen(true);
  };

  const handleFinalPlaceOrder = async () => {
    isOrderPlacedRef.current = true;
    setIsConfirmModalOpen(false);
    setIsProcessing(true);

    try {
      let paymentLabel = 'Cash on Delivery';
      if (paymentMethod === 'UPI') paymentLabel = `Instant UPI (${upiApp.toUpperCase()})`;
      else if (paymentMethod === 'CARD') paymentLabel = `Card (${cardDetails.number.slice(-4) || 'Debit 4242'})`;
      else if (paymentMethod === 'NET_BANKING') paymentLabel = `Net Banking (${selectedBank})`;

      const newOrder = await placeOrder(paymentLabel);
      setTimeout(() => {
        setIsProcessing(false);
        navigate(`/order/success/${newOrder.id}`);
      }, 1000);
    } catch (err) {
      const newOrder = await placeOrder('Cash on Delivery');
      setTimeout(() => {
        setIsProcessing(false);
        navigate(`/order/success/${newOrder.id}`);
      }, 1000);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '60px', paddingTop: '20px' }}>
      
      {/* Flipkart-Style Interactive Progress Stepper */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '16px 24px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '920px',
        margin: '0 auto 20px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        {[
          { step: 1, label: 'Delivery Address', icon: MapPin },
          { step: 2, label: 'Order Summary', icon: PackageCheck },
          { step: 3, label: 'Payment Options', icon: CreditCard }
        ].map((s, idx) => {
          const isCompleted = currentStep > s.step;
          const isCurrent = currentStep === s.step;
          const isClickable = s.step < currentStep;

          return (
            <React.Fragment key={s.step}>
              {idx > 0 && (
                <div style={{
                  flex: 1,
                  height: '2px',
                  backgroundColor: currentStep >= s.step ? 'var(--savings-green)' : 'var(--border-divider)',
                  margin: '0 12px',
                  transition: 'all 0.2s ease'
                }} />
              )}
              <div
                onClick={() => {
                  if (isClickable) setCurrentStep(s.step);
                }}
                className={`checkout-step-pill ${isClickable ? 'clickable' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: isClickable ? 'pointer' : 'default',
                  userSelect: 'none'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isCompleted ? 'var(--savings-green)' : isCurrent ? 'var(--primary-600)' : '#F1F5F9',
                  color: isCompleted || isCurrent ? '#ffffff' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '13px',
                  transition: 'all 0.18s ease'
                }}>
                  {isCompleted ? <CheckCircle2 size={16} /> : s.step}
                </div>
                <span style={{
                  fontSize: '13px',
                  fontWeight: isCurrent ? '700' : '500',
                  color: isCurrent ? 'var(--text-primary)' : isCompleted ? 'var(--savings-green)' : 'var(--text-secondary)',
                  textDecoration: isClickable ? 'none' : 'none'
                }}>
                  {s.label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Main Checkout Layout Grid (Desktop Two-Column / Mobile Single Column) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 380px',
        gap: '24px',
        alignItems: 'flex-start',
        maxWidth: '1100px',
        margin: '0 auto'
      }} className="checkout-grid-responsive">
        
        {/* Left Column: Interactive Steps with Previews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* ================= STEP 1: ADDRESS ACCORDION / PREVIEW ================= */}
          {currentStep > 1 ? (
            /* Completed Address Preview Box */
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--savings-green)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CheckCircle2 size={18} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', color: 'var(--savings-green)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <span>1. Delivery Address</span>
                    <span style={{ color: '#94A3B8' }}>•</span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{activeAddress?.type || 'Home'}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <MapPin size={14} color="var(--primary-600)" />
                    <span>{activeAddress?.name}</span>
                    <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>
                      • {activeAddress?.area || activeAddress?.flat || activeAddress?.city}, {activeAddress?.city} - {activeAddress?.pincode}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn btn-secondary"
                style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px', fontWeight: '700', flexShrink: 0 }}
              >
                CHANGE
              </button>
            </div>
          ) : (
            /* Active Address Selection Card */
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} color="var(--primary-600)" /> 1. Select Delivery Address
                </h2>
                <button
                  type="button"
                  onClick={openAddAddressModal}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px', minHeight: '34px', gap: '4px' }}
                >
                  <Plus size={14} /> Add New Address
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      style={{
                        padding: '14px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                        backgroundColor: isSelected ? 'var(--primary-50)' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '12px'
                      }}
                    >
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => setSelectedAddressId(addr.id)}
                        style={{ marginTop: '3px', accentColor: 'var(--primary-600)' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{addr.name}</strong>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: '700',
                              padding: '2px 8px',
                              backgroundColor: '#E2E8F0',
                              borderRadius: 'var(--radius-xs)',
                              color: '#475569'
                            }}>
                              {addr.type || 'HOME'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditAddressModal(addr);
                            }}
                            style={{
                              padding: '3px 10px',
                              fontSize: '12px',
                              fontWeight: '700',
                              color: '#2563EB',
                              backgroundColor: '#EFF6FF',
                              border: '1px solid #BFDBFE',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                          {addr.flat}, {addr.area && `${addr.area}, `}{addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </div>
                        {addr.phone && (
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                            Mobile: <strong>{addr.phone}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '18px', textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn btn-primary"
                  style={{ padding: '0 24px', height: '44px', fontSize: '14px', fontWeight: '700' }}
                >
                  Deliver Here & Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: ORDER SUMMARY ACCORDION / PREVIEW ================= */}
          {currentStep === 3 ? (
            /* Completed Order Summary Preview Box with Product Thumbnail */
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--savings-green)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CheckCircle2 size={18} />
                </div>

                {/* Product Thumbnail Rail in Completed Step Preview */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-subtle)',
                  padding: '3px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <img
                    src={cart[0]?.product?.thumbnail || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80'}
                    alt={cart[0]?.product?.title || 'Product'}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--savings-green)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    2. Order Summary Confirmed
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span>{cart.length} Item{cart.length > 1 ? 's' : ''} • ₹{finalTotal.toLocaleString('en-IN')}</span>
                    <span style={{ fontWeight: '600', color: 'var(--savings-green)', fontSize: '12px' }}>• Free Delivery</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn btn-secondary"
                style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px', fontWeight: '700', flexShrink: 0 }}
              >
                CHANGE
              </button>
            </div>
          ) : currentStep === 2 ? (
            /* Active Order Summary Step */
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '20px'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PackageCheck size={18} color="var(--primary-600)" /> 2. Order Summary ({cart.length} items)
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '14px',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ width: '64px', height: '64px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                        {item.product.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Qty: <strong>{item.quantity}</strong> {item.selectedVariant && `• ${Object.values(item.selectedVariant).join(' / ')}`}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-price)', marginTop: '4px' }}>
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '18px', textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn btn-primary"
                  style={{ padding: '0 24px', height: '44px', fontSize: '14px', fontWeight: '700' }}
                >
                  Proceed to Payment Options <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : null}

          {/* ================= STEP 3: PAYMENT OPTIONS ================= */}
          {currentStep === 3 && (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '20px'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} color="var(--primary-600)" /> 3. Select Payment Option
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* 1. UPI Payment */}
                <div style={{
                  border: paymentMethod === 'UPI' ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  backgroundColor: paymentMethod === 'UPI' ? 'var(--primary-50)' : '#ffffff'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      style={{ accentColor: 'var(--primary-600)' }}
                    />
                    <Smartphone size={18} color="var(--primary-600)" />
                    <strong style={{ fontSize: '14px' }}>UPI (Google Pay, PhonePe, Paytm, BHIM)</strong>
                  </label>
                </div>

                {/* 2. Credit / Debit Cards */}
                <div style={{
                  border: paymentMethod === 'CARD' ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  backgroundColor: paymentMethod === 'CARD' ? 'var(--primary-50)' : '#ffffff'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentMethod === 'CARD'}
                      onChange={() => setPaymentMethod('CARD')}
                      style={{ accentColor: 'var(--primary-600)' }}
                    />
                    <CreditCard size={18} color="var(--primary-600)" />
                    <strong style={{ fontSize: '14px' }}>Credit / Debit / ATM Cards (All Banks)</strong>
                  </label>
                </div>

                {/* 3. Net Banking */}
                <div style={{
                  border: paymentMethod === 'NET_BANKING' ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  backgroundColor: paymentMethod === 'NET_BANKING' ? 'var(--primary-50)' : '#ffffff'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentMethod === 'NET_BANKING'}
                      onChange={() => setPaymentMethod('NET_BANKING')}
                      style={{ accentColor: 'var(--primary-600)' }}
                    />
                    <Building size={18} color="var(--primary-600)" />
                    <strong style={{ fontSize: '14px' }}>Net Banking (50+ Indian Banks)</strong>
                  </label>
                </div>

                {/* 4. Cash on Delivery */}
                <div style={{
                  border: paymentMethod === 'COD' ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  backgroundColor: paymentMethod === 'COD' ? 'var(--primary-50)' : '#ffffff'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      style={{ accentColor: 'var(--primary-600)' }}
                    />
                    <Banknote size={18} color="var(--primary-600)" />
                    <strong style={{ fontSize: '14px' }}>Cash on Delivery (Pay cash at doorstep)</strong>
                  </label>

                  {paymentMethod === 'COD' && (
                    <div style={{ marginTop: '14px', paddingLeft: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '12.5px', color: '#475569', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Lock size={13} color="#2563EB" /> Enter the security verification code:
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>Anti-Bot Verification</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        {/* Stylized Anti-Bot Captcha Box */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 14px',
                          background: [
                            'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                            'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                            'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                            'linear-gradient(135deg, #FDF4FF 0%, #F5D0FE 100%)'
                          ][captchaBgIndex % 4],
                          borderRadius: '10px',
                          border: '1.5px solid #C7D2FE',
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)'
                        }}>
                          {/* Interference Security Wavy Lines */}
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(99, 102, 241, 0.12) 10px, rgba(99, 102, 241, 0.12) 20px)',
                            pointerEvents: 'none'
                          }} />

                          {/* Horizontal Strike-through line */}
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '5%',
                            right: '5%',
                            height: '1.5px',
                            backgroundColor: 'rgba(79, 70, 229, 0.4)',
                            transform: 'rotate(-2deg)',
                            pointerEvents: 'none',
                            zIndex: 1
                          }} />

                          {/* Captcha Digits with Varied Offsets */}
                          <div style={{ display: 'flex', gap: '8px', userSelect: 'none', position: 'relative', zIndex: 2 }}>
                            {captchaCode.split('').map((char, cIdx) => {
                              const colors = ['#1E3A8A', '#065F46', '#831843', '#1E40AF', '#701A75'];
                              const rot = captchaRotations[cIdx] || 0;
                              return (
                                <span
                                  key={cIdx}
                                  style={{
                                    fontSize: '22px',
                                    fontWeight: '950',
                                    fontFamily: 'Courier New, monospace',
                                    color: colors[(cIdx + captchaBgIndex) % colors.length],
                                    display: 'inline-block',
                                    transform: `rotate(${rot}deg)`,
                                    textShadow: '1px 1px 0 rgba(255,255,255,0.9)'
                                  }}
                                >
                                  {char}
                                </span>
                              );
                            })}
                          </div>

                          {/* Refresh Captcha Button */}
                          <button
                            type="button"
                            onClick={generateNewCaptcha}
                            title="Generate New Security Code"
                            style={{
                              marginLeft: '8px',
                              background: '#FFFFFF',
                              border: '1px solid #C7D2FE',
                              borderRadius: '6px',
                              padding: '5px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#4F46E5',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <RefreshCw size={14} style={{ transform: isRotatingCaptcha ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s ease' }} />
                          </button>
                        </div>

                        {/* Input Box */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="text"
                            maxLength={4}
                            placeholder="Type Code"
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value.replace(/\D/g, ''))}
                            style={{
                              width: '110px',
                              height: '42px',
                              padding: '0 10px',
                              borderRadius: '8px',
                              border: captchaInput === captchaCode ? '2px solid #10B981' : captchaInput.length === 4 ? '2px solid #EF4444' : '1.5px solid #CBD5E1',
                              backgroundColor: captchaInput === captchaCode ? '#ECFDF5' : '#FFFFFF',
                              fontSize: '16px',
                              fontWeight: '800',
                              letterSpacing: '3px',
                              textAlign: 'center',
                              color: '#0F172A',
                              outline: 'none'
                            }}
                          />

                          {/* Live Status Pill */}
                          {captchaInput === captchaCode && (
                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#059669', backgroundColor: '#D1FAE5', padding: '4px 8px', borderRadius: '6px' }}>
                              ✓ Verified
                            </span>
                          )}
                          {captchaInput.length === 4 && captchaInput !== captchaCode && (
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#DC2626', backgroundColor: '#FEE2E2', padding: '4px 8px', borderRadius: '6px' }}>
                              ✕ Try Again
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Confirm & Place Order CTA */}
              <button
                type="button"
                onClick={handleInitiateOrder}
                disabled={isProcessing}
                className="btn btn-buy-now"
                style={{ width: '100%', height: '48px', minHeight: '48px', fontSize: '16px', fontWeight: '800', marginTop: '16px' }}
              >
                {isProcessing ? 'Processing...' : `Place Order (₹${finalTotal.toLocaleString('en-IN')})`}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Price Summary Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          position: 'sticky',
          top: '88px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-divider)', paddingBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Price Details
          </div>

          {/* Enter Coupon / Promo Code Box */}
          {appliedCoupon ? (
            <div style={{
              backgroundColor: '#ECFDF5',
              borderRadius: '10px',
              padding: '12px',
              border: '1.5px dashed #10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#065F46' }}>
                    Code: {appliedCoupon.code} Applied
                  </div>
                  <div style={{ fontSize: '11px', color: '#047857' }}>
                    {appliedCoupon.title} (Saved ₹{couponDiscount.toLocaleString('en-IN')})
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={removeCoupon}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#DC2626',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Remove
              </button>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '10px',
              padding: '12px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Tag size={14} color="#2563EB" /> Apply Promo Code / Coupon
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Enter Coupon Code (e.g. AVERO500)"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyCouponCode();
                    }
                  }}
                  style={{
                    flex: 1,
                    height: '38px',
                    padding: '0 10px',
                    borderRadius: '6px',
                    border: couponError ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                    fontSize: '12px',
                    fontWeight: '700',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleApplyCouponCode()}
                  style={{
                    padding: '0 14px',
                    height: '38px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: '700', marginTop: '6px' }}>
                  ✕ {couponError}
                </div>
              )}

              {/* Expandable Available Coupons */}
              <div style={{ marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAvailableCoupons(!showAvailableCoupons)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#2563EB',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{showAvailableCoupons ? 'Hide Available Coupons ▲' : 'View Available Coupons (7 Offers) ▼'}</span>
                </button>

                {showAvailableCoupons && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                    {AVAILABLE_COUPONS.map((cp) => {
                      const isEligible = !cp.minOrderValue || totalSellingPrice >= cp.minOrderValue;
                      return (
                        <div
                          key={cp.code}
                          style={{
                            padding: '8px',
                            borderRadius: '6px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '6px'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: '#0F172A' }}>
                              <span style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '1px 5px', borderRadius: '4px', marginRight: '4px' }}>
                                {cp.code}
                              </span>
                              {cp.title}
                            </div>
                            <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>
                              {cp.description}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleApplyCouponCode(cp.code)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: 'none',
                              backgroundColor: isEligible ? '#2563EB' : '#F1F5F9',
                              color: isEligible ? '#FFFFFF' : '#94A3B8',
                              fontSize: '11px',
                              fontWeight: '800',
                              cursor: isEligible ? 'pointer' : 'not-allowed',
                              flexShrink: 0
                            }}
                          >
                            {isEligible ? 'Apply' : `Min ₹${cp.minOrderValue}`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span>Price ({cart.length} items)</span>
            <span>₹{totalMrp.toLocaleString('en-IN')}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--savings-green)' }}>
            <span>Discount</span>
            <span>- ₹{totalProductDiscount.toLocaleString('en-IN')}</span>
          </div>

          {appliedCoupon && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--savings-green)' }}>
              <span>Coupon Savings</span>
              <span>- ₹{couponDiscount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? <strong style={{ color: 'var(--savings-green)' }}>FREE</strong> : `₹${deliveryFee}`}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span>Platform Fee</span>
            <span>₹{platformFee}</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '16px',
            fontWeight: '900',
            borderTop: '1px solid var(--border-divider)',
            paddingTop: '12px',
            color: 'var(--text-primary)'
          }}>
            <span>Total Payable</span>
            <span style={{ color: 'var(--text-price)' }}>₹{finalTotal.toLocaleString('en-IN')}</span>
          </div>

          <div style={{
            backgroundColor: '#E8F5E9',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: '700',
            color: '#2E7D32',
            textAlign: 'center'
          }}>
            You will save ₹{totalSavings.toLocaleString('en-IN')} on this order
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', justifyContent: 'center' }}>
            <ShieldCheck size={14} color="var(--primary-600)" /> Safe and Secure Payments. 100% Authentic Products.
          </div>
        </div>
      </div>

      {/* Interactive Order Confirmation Dialog */}
      {isConfirmModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsConfirmModalOpen(false)}>
          <div
            className="bottom-sheet"
            style={{
              maxWidth: '500px',
              margin: 'auto',
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: '18px 20px',
              borderBottom: '1px solid var(--border-divider)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8FAFC'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                    Confirm Your Order
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Review delivery and payment details</span>
                </div>
              </div>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Delivery Address Card */}
              <div style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <MapPin size={18} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1, fontSize: '13px' }}>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                    Deliver to: {activeAddress?.name || user?.name || 'Customer'}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                    {activeAddress?.flat ? `${activeAddress.flat}, ` : ''}{activeAddress?.area || ''} {activeAddress?.city} - {activeAddress?.pincode}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Mobile: <strong>{activeAddress?.phone || '9876543210'}</strong>
                  </div>
                </div>
              </div>

              {/* Items Summary & Delivery SLA */}
              <div style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {cart.length} Item(s) in Order
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--savings-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Truck size={14} /> Tomorrow by 5 PM
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        padding: '2px',
                        backgroundColor: '#ffffff',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img
                        src={item.product.thumbnail || (item.product.images && item.product.images[0])}
                        alt={item.product.title}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Mode & Total Payable */}
              <div style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary-700)', textTransform: 'uppercase' }}>
                    Payment Mode
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {paymentMethod === 'COD' ? 'Cash on Delivery (Doorstep Cash/UPI)' : paymentMethod === 'UPI' ? `Instant UPI (${upiApp.toUpperCase()})` : paymentMethod === 'CARD' ? 'Credit / Debit Card' : 'Net Banking'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Total Payable</div>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-price)' }}>
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, height: '46px', fontSize: '14px', fontWeight: '600' }}
                >
                  ← Edit Order
                </button>
                <button
                  type="button"
                  onClick={handleFinalPlaceOrder}
                  disabled={isProcessing}
                  className="btn btn-buy-now"
                  style={{ flex: 2, height: '46px', fontSize: '15px', fontWeight: '800' }}
                >
                  {isProcessing ? 'Placing Order...' : 'Confirm & Place Order'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Order Processing Overlay */}
      {isProcessing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(6px)',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          gap: '16px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '4px solid rgba(255, 255, 255, 0.2)',
            borderTopColor: '#38BDF8',
            animation: 'spin 0.8s linear infinite'
          }} />

          <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
            Securing Payment & Placing Order...
          </h3>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
            Please do not refresh or close this window
          </p>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .checkout-step-pill.clickable:hover span {
          color: var(--primary-600) !important;
          text-decoration: underline;
        }
        @media (max-width: 1023px) {
          .checkout-grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
