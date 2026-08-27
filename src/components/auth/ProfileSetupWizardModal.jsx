import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import UserAvatar from '../common/UserAvatar';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import {
  Sparkles,
  Camera,
  MapPin,
  CheckCircle2,
  Gift,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Smartphone,
  Headphones,
  Shirt,
  Footprints,
  Tv,
  Home,
  Check,
  X,
  Navigation,
  Loader2,
  Mail,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProfileSetupWizardModal({ isOpen, onClose }) {
  const { user, setUser, saveAddress, showToast, addRewardCoins, changePincode } = useApp();

  const [step, setStep] = useState(1);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Profile Form Data (Synced with user's Google/Email auth profile)
  const [formData, setFormData] = useState({
    name: user?.name || user?.displayName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || user?.photoURL || '',
    city: user?.city || '',
    state: user?.state || 'Tamil Nadu',
    pincode: '',
    flat: '',
    area: '',
    selectedInterests: ['mobiles', 'audio', 'electronics']
  });

  // Sync with user's latest Auth profile when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || user.displayName || prev.name || '',
        email: user.email || prev.email || '',
        phone: user.phone || prev.phone || '',
        avatar: user.avatar || user.photoURL || prev.avatar || '',
        city: user.city || prev.city || ''
      }));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Handle Photo Upload to Cloudinary CDN
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    showToast('Uploading profile photo...', 'info');

    try {
      const res = await uploadToCloudinary(file);
      if (res?.secureUrl) {
        setFormData((prev) => ({ ...prev, avatar: res.secureUrl }));
        showToast('Profile photo updated!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload photo', 'error');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // 1-Click GPS Live Location Detection & Reverse Geocoding
  const handleDetectLiveLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    setIsDetectingLocation(true);
    showToast('Detecting your live GPS coordinates & delivery hub...', 'info');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await res.json();
          const addr = data.address || {};

          const detectedPincode = addr.postcode ? addr.postcode.replace(/\D/g, '').slice(0, 6) : '639117';
          const detectedCity = addr.city || addr.town || addr.village || addr.suburb || addr.county || addr.state_district || 'Karur';
          const detectedState = addr.state || 'Tamil Nadu';
          const amenityName = addr.amenity || addr.college || addr.university || addr.building || addr.office || '';

          let roadName = addr.road || addr.pedestrian || addr.footway || '';
          const locality = addr.suburb || addr.neighbourhood || addr.village || addr.hamlet || addr.residential || '';

          let formattedArea = '';
          if (roadName && locality && !roadName.includes(locality)) {
            formattedArea = `${roadName}, ${locality}`;
          } else {
            formattedArea = roadName || locality || `${detectedCity} Main Area`;
          }

          let formattedFlat = amenityName || (addr.house_number ? `Door No. ${addr.house_number}` : '');

          setFormData((prev) => ({
            ...prev,
            pincode: detectedPincode,
            city: detectedCity,
            state: detectedState,
            area: formattedArea,
            flat: formattedFlat || prev.flat || ''
          }));

          if (typeof changePincode === 'function') {
            changePincode(detectedPincode, `${detectedCity}, ${detectedState}`);
          }

          showToast(`📍 Detected: ${detectedCity} (${detectedPincode}), ${detectedState}`, 'success');
        } catch (err) {
          console.warn('Geocoding fallback:', err);
          showToast('Could not resolve GPS details. Please enter your pincode.', 'info');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        console.warn('Geolocation permission error:', err);
        setIsDetectingLocation(false);
        showToast('Please enter your delivery pincode manually', 'info');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Toggle Shopping Category Interest
  const toggleInterest = (catId) => {
    setFormData((prev) => {
      const exists = prev.selectedInterests.includes(catId);
      return {
        ...prev,
        selectedInterests: exists
          ? prev.selectedInterests.filter((c) => c !== catId)
          : [...prev.selectedInterests, catId]
      };
    });
  };

  const handleStep1Next = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    setStep(2);
  };

  const handleStep2Next = (e) => {
    e.preventDefault();
    if (!formData.pincode || formData.pincode.length < 6) {
      showToast('Please enter a valid 6-digit delivery pincode', 'error');
      return;
    }
    setStep(3);

    // Trigger celebration confetti on reaching reward step
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (_) {}
  };

  const handleCompleteWizard = () => {
    // Save updated profile
    const updatedUser = {
      ...user,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      avatar: formData.avatar,
      photoURL: formData.avatar,
      city: formData.city,
      setupComplete: true
    };
    setUser(updatedUser);
    try {
      localStorage.setItem('avero_user', JSON.stringify(updatedUser));
    } catch (_) {}

    // Save default address if entered
    if (formData.flat || formData.area || formData.pincode) {
      saveAddress({
        name: formData.name.trim(),
        phone: formData.phone.trim() || user?.phone || '9845012345',
        pincode: formData.pincode || '639117',
        flat: formData.flat || 'Main Residence',
        area: formData.area || formData.city || 'Central Area',
        city: formData.city || 'Karur',
        state: formData.state || 'Tamil Nadu',
        addressType: 'HOME',
        isDefault: true
      });
    }

    if (addRewardCoins) {
      addRewardCoins(50);
    }

    showToast('🎉 Profile setup complete! Welcome rewards unlocked!', 'success');
    onClose();
  };

  const interestCategories = [
    { id: 'mobiles', label: 'Smartphones', icon: Smartphone },
    { id: 'audio', label: 'Audio & Soundbars', icon: Headphones },
    { id: 'electronics', label: 'Laptops & TVs', icon: Tv },
    { id: 'footwear', label: 'Footwear & Sneakers', icon: Footprints },
    { id: 'fashion', label: 'Fashion & Apparel', icon: Shirt },
    { id: 'home', label: 'Home & Kitchen', icon: Home }
  ];

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          padding: '28px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          color: '#0F172A',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Stepper Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: '900',
                color: '#4F46E5',
                backgroundColor: '#EEF2FF',
                padding: '3px 10px',
                borderRadius: '9999px',
                border: '1px solid #C7D2FE'
              }}
            >
              ✨ STEP {step} OF 3
            </span>
            <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: '700' }}>
              {step === 1 ? 'Personal Profile' : step === 2 ? 'Delivery Location' : 'Welcome Rewards'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: '4px',
              borderRadius: '8px'
            }}
            title="Skip for now"
          >
            <X size={18} />
          </button>
        </div>

        {/* -------------------------------------------------------------------
           STEP 1: CONFIRM PROFILE PHOTO (MAIL DP) & PERSONAL IDENTITY
           ------------------------------------------------------------------- */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A', margin: '0 0 6px' }}>
                Welcome to Avero! Set Up Your Profile
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                Confirm your account display picture and details for express checkout:
              </p>
            </div>

            {/* Profile Avatar with Camera Picker & Mail DP Display */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ position: 'relative' }}>
                <UserAvatar
                  user={{
                    name: formData.name || user?.name || 'Avero User',
                    email: formData.email || user?.email,
                    avatar: formData.avatar || user?.photoURL || user?.avatar,
                    photoURL: formData.avatar || user?.photoURL
                  }}
                  size={88}
                  fontSize={26}
                  border="3px solid #4F46E5"
                  boxShadow="0 8px 24px rgba(79, 70, 229, 0.22)"
                />

                <label
                  htmlFor="wizard-photo-upload"
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#4F46E5',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: '2.5px solid #FFFFFF',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)'
                  }}
                  title="Change Profile Photo"
                >
                  <Camera size={14} />
                </label>
                <input
                  id="wizard-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isUploadingPhoto}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Email Address & Verified DP Badge */}
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#475569', fontWeight: '700' }}>
                <Mail size={14} color="#64748B" />
                <span>{formData.email || user?.email || 'Verified Account'}</span>
                <CheckCircle2 size={14} color="#059669" />
              </div>

              <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', fontWeight: '600' }}>
                {isUploadingPhoto ? 'Uploading to CDN...' : 'Google profile photo synced • Click camera to change'}
              </span>
            </div>

            <form onSubmit={handleStep1Next} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Mobile Number (for SMS & Doorstep Delivery OTP)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span
                    style={{
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: '10px',
                      backgroundColor: '#F1F5F9',
                      border: '1.5px solid #CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '13px',
                      fontWeight: '800',
                      color: '#475569'
                    }}
                  >
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="98450 12345"
                    style={{
                      flex: 1,
                      height: '42px',
                      padding: '0 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  height: '46px',
                  fontSize: '14px',
                  fontWeight: '900',
                  marginTop: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                Continue to Delivery Address <ArrowRight size={16} />
              </button>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------------
           STEP 2: DEFAULT DELIVERY ADDRESS WITH 1-CLICK GPS DETECT
           ------------------------------------------------------------------- */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A', margin: '0 0 4px' }}>
                📍 Where should we deliver?
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                Set your primary delivery hub for lightning 24-48 hr shipping:
              </p>
            </div>

            {/* 1-Click Detect Live Location Button */}
            <div style={{ marginBottom: '14px' }}>
              <button
                type="button"
                onClick={handleDetectLiveLocation}
                disabled={isDetectingLocation}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #C7D2FE',
                  backgroundColor: '#EEF2FF',
                  color: '#4F46E5',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: isDetectingLocation ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 6px rgba(79, 70, 229, 0.08)',
                  transition: 'all 0.15s ease'
                }}
              >
                {isDetectingLocation ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Detecting GPS Location & Pincode...
                  </>
                ) : (
                  <>
                    <Navigation size={16} color="#4F46E5" /> 📍 Use Current Location (Auto-Detect GPS)
                  </>
                )}
              </button>
            </div>

            <form onSubmit={handleStep2Next} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Delivery Pincode *
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    placeholder="e.g. 639117"
                    required
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none',
                      fontWeight: '700',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    City / Town *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Karur"
                    required
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Flat, House No., Building Name
                </label>
                <input
                  type="text"
                  value={formData.flat}
                  onChange={(e) => setFormData({ ...formData, flat: e.target.value })}
                  placeholder="e.g. Flat 402, Green Valley Apartments"
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Street, Area, Sector or Landmark
                </label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="e.g. Near Gandhigram Bus Stand"
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    height: '46px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <ArrowLeft size={15} /> Back
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    flex: 2,
                    height: '46px',
                    fontSize: '14px',
                    fontWeight: '900',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  Continue to Rewards <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------------
           STEP 3: SHOPPING INTERESTS & REWARDS UNLOCKED
           ------------------------------------------------------------------- */}
        {step === 3 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.25)'
                }}
              >
                <Gift size={28} />
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A', margin: '0 0 4px' }}>
                🎉 You've Unlocked ₹500 First Order Discount!
              </h2>
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0 }}>
                Select categories you love to personalize your shopping feed:
              </p>
            </div>

            {/* Welcome Coupon Card */}
            <div
              style={{
                backgroundColor: '#F0FDF4',
                borderRadius: '14px',
                border: '1.5px dashed #86EFAC',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#166534', fontWeight: '800', textTransform: 'uppercase' }}>
                  WELCOME GIFT VOUCHER
                </div>
                <strong style={{ fontSize: '15px', color: '#15803D' }}>
                  Code: WELCOME500
                </strong>
                <div style={{ fontSize: '11px', color: '#16a34a' }}>
                  Flat ₹500 OFF + 50 Free SuperCoins
                </div>
              </div>

              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: '900',
                  backgroundColor: '#15803D',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}
              >
                AUTO-APPLIED
              </span>
            </div>

            {/* Interest Chips Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '18px' }}>
              {interestCategories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = formData.selectedInterests.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleInterest(cat.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: isSelected ? '1.5px solid #4F46E5' : '1px solid #E2E8F0',
                      backgroundColor: isSelected ? '#EEF2FF' : '#F8FAFC',
                      color: isSelected ? '#4338CA' : '#475569',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={16} color={isSelected ? '#4F46E5' : '#64748B'} />
                    <span style={{ flex: 1, textAlign: 'left' }}>{cat.label}</span>
                    {isSelected && <Check size={14} color="#4F46E5" />}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleCompleteWizard}
              className="btn btn-primary"
              style={{
                width: '100%',
                height: '46px',
                fontSize: '14.5px',
                fontWeight: '900',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={18} /> Complete Setup & Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
