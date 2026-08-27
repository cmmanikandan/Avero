import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Store,
  ShieldCheck,
  Building2,
  CreditCard,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Truck,
  Percent,
  Clock,
  Sparkles,
  Lock,
  AlertCircle,
  HelpCircle,
  LogIn,
  Check
} from 'lucide-react';

export default function BecomeSellerPage() {
  const { user, setUser, setActiveRole, showToast } = useApp();
  const navigate = useNavigate();

  // Multi-step state (1: Business, 2: GST/PAN, 3: Bank, 4: Pickup, 5: Agreement & Submit)
  const [currentStep, setCurrentStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [merchantId, setMerchantId] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Business Info
    storeName: '',
    storeLogo: user?.avatar || user?.photoURL || '',
    legalEntityName: '',
    businessEmail: user?.email || '',
    businessPhone: user?.phone || '',
    category: 'electronics',
    businessType: 'Sole Proprietorship',

    // Step 2: GST & PAN
    gstin: '',
    panNumber: '',
    tradeLicense: '',
    gstVerified: false,

    // Step 3: Bank & Settlement
    accountHolder: '',
    bankName: 'HDFC Bank',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    upiId: '',

    // Step 4: Warehouse / Pickup Address
    building: '',
    street: '',
    city: '',
    state: 'Karnataka',
    pincode: '',

    // Step 5: Terms & Signatory
    agreedToTerms: true,
    counterfeitDeclaration: true,
    signatoryName: user?.name || ''
  });

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    showToast('Uploading Brand DP to Cloudinary...', 'info');

    try {
      const { uploadToCloudinary } = await import('../../services/cloudinaryService');
      const res = await uploadToCloudinary(file);
      if (res?.secureUrl) {
        setFormData((prev) => ({ ...prev, storeLogo: res.secureUrl }));
        showToast('Store Brand DP uploaded successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload store logo', 'error');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Step 1 Validator
  const validateStep1 = () => {
    const errs = {};
    if (!formData.storeName.trim()) errs.storeName = 'Store display name is required';
    if (!formData.legalEntityName.trim()) errs.legalEntityName = 'Legal business entity name is required';
    if (!formData.businessEmail.trim() || !formData.businessEmail.includes('@')) errs.businessEmail = 'Valid business email is required';
    if (!formData.businessPhone.trim() || formData.businessPhone.length < 10) errs.businessPhone = '10-digit mobile number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validator
  const validateStep2 = () => {
    const errs = {};
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!formData.gstin.trim()) {
      errs.gstin = 'GSTIN is required for tax invoicing';
    } else if (!gstinRegex.test(formData.gstin.trim().toUpperCase())) {
      errs.gstin = 'Enter a valid 15-character GSTIN (e.g. 29ABCDE1234F1Z5)';
    }

    if (!formData.panNumber.trim()) {
      errs.panNumber = 'Business PAN is required';
    } else if (!panRegex.test(formData.panNumber.trim().toUpperCase())) {
      errs.panNumber = 'Enter a valid 10-character PAN (e.g. ABCDE1234F)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validator
  const validateStep3 = () => {
    const errs = {};
    if (!formData.accountHolder.trim()) errs.accountHolder = 'Account holder legal name is required';
    if (!formData.accountNumber.trim()) errs.accountNumber = 'Account number is required';
    if (formData.accountNumber !== formData.confirmAccountNumber) errs.confirmAccountNumber = 'Account numbers do not match';
    if (!formData.ifscCode.trim() || formData.ifscCode.length < 11) errs.ifscCode = 'Valid 11-digit IFSC code required (e.g. HDFC0001234)';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 4 Validator
  const validateStep4 = () => {
    const errs = {};
    if (!formData.building.trim()) errs.building = 'Building / unit number is required';
    if (!formData.street.trim()) errs.street = 'Street / area is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.pincode.trim() || formData.pincode.length !== 6) errs.pincode = 'Valid 6-digit pincode required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    if (currentStep === 4 && !validateStep4()) return;

    setCurrentStep(prev => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Simulate Instant GST Verification
  const handleVerifyGst = () => {
    if (!formData.gstin.trim() || formData.gstin.length < 15) {
      setErrors(prev => ({ ...prev, gstin: 'Enter 15-character GSTIN first' }));
      return;
    }
    showToast('Validating GSTIN with GST portal...', 'info');
    setTimeout(() => {
      setFormData(prev => ({ ...prev, gstVerified: true }));
      setErrors(prev => ({ ...prev, gstin: '' }));
      showToast('GSTIN Verified Successfully! Legal entity match confirmed.', 'success');
    }, 800);
  };

  // Final Submission & Real-time Verification Simulation
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreedToTerms || !formData.counterfeitDeclaration) {
      showToast('Please agree to the seller terms and declarations', 'error');
      return;
    }

    setIsVerifying(true);
    setVerificationProgress(20);
    setVerificationMessage('Validating Business Credentials with Ministry of Corporate Affairs...');

    setTimeout(() => {
      setVerificationProgress(50);
      setVerificationMessage('Verifying Bank Account & IFSC through NPCI Penny-Drop Gateway...');
    }, 900);

    setTimeout(() => {
      setVerificationProgress(85);
      setVerificationMessage('Provisioning Merchant Cloud Store & BlueDart Express Pickup Slot...');
    }, 1800);

    setTimeout(() => {
      const generatedMid = `AVR-VND-${Math.floor(100000 + Math.random() * 900000)}`;
      setMerchantId(generatedMid);
      setVerificationProgress(100);
      setIsVerifying(false);
      setIsApproved(true);

      const fullProfile = {
        ...formData,
        isAuth: true,
        name: formData.signatoryName || formData.storeName,
        email: formData.businessEmail,
        phone: formData.businessPhone,
        role: 'seller',
        storeName: formData.storeName,
        legalEntityName: formData.legalEntityName,
        merchantId: generatedMid,
        businessType: formData.businessType,
        gstin: formData.gstin.toUpperCase(),
        panNumber: formData.panNumber.toUpperCase(),
        pincode: formData.pincode,
        category: formData.category,
        avatar: formData.storeLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.storeName)}&background=F59E0B&color=fff`,
        storeLogo: formData.storeLogo,
        emailVerified: true
      };

      // 1. Save detailed seller registration profile
      localStorage.setItem('avero_seller_profile', JSON.stringify(fullProfile));

      // 2. Save active seller user and session
      setUser(fullProfile);
      localStorage.setItem('avero_user', JSON.stringify(fullProfile));
      localStorage.setItem('avero_role', 'seller');
      localStorage.setItem('avero_seller', JSON.stringify(fullProfile));
      setActiveRole('seller');

      // 3. Provision Live Brand Storefront
      try {
        const existingStores = JSON.parse(localStorage.getItem('avero_brand_stores') || '[]');
        const newStore = {
          id: generatedMid,
          name: formData.storeName,
          slug: formData.storeName.toLowerCase().replace(/\s+/g, '-'),
          category: formData.category,
          rating: 4.9,
          reviewsCount: 1,
          verified: true,
          gstin: formData.gstin.toUpperCase(),
          tagline: `${formData.category.charAt(0).toUpperCase() + formData.category.slice(1)} Boutique`,
          description: `Official ${formData.storeName} storefront on Avero. Certified genuine products with direct manufacturer warranty.`,
          avatar: formData.storeLogo
        };
        const updatedStores = existingStores.filter(s => s.name.toLowerCase() !== formData.storeName.toLowerCase());
        updatedStores.unshift(newStore);
        localStorage.setItem('avero_brand_stores', JSON.stringify(updatedStores));
      } catch (_) {}

      // 4. Sync with Supabase
      try {
        import('../../services/supabase').then(({ supabaseService }) => {
          supabaseService.registerSeller({
            storeName: formData.storeName,
            ownerName: formData.signatoryName || formData.storeName,
            email: formData.businessEmail,
            phone: formData.businessPhone,
            businessType: formData.businessType,
            gstin: formData.gstin.toUpperCase(),
            pan: formData.panNumber.toUpperCase(),
            pickupAddress: {
              building: formData.building,
              street: formData.street,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode
            },
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifscCode,
            bankName: formData.bankName,
            status: 'approved'
          }).catch(e => console.warn('[Supabase] Seller sync notice:', e.message));
        });
      } catch (_) {}

      showToast('🎉 Seller verification approved! Welcome to Avero Seller Central.', 'success');
    }, 2700);
  };

  const steps = [
    { number: 1, title: 'Store Info', icon: Store },
    { number: 2, title: 'GST & PAN', icon: Building2 },
    { number: 3, title: 'Bank Account', icon: CreditCard },
    { number: 4, title: 'Pickup Hub', icon: MapPin },
    { number: 5, title: 'Agreement', icon: FileText }
  ];

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Hero Banner Header */}
      <div style={{
        backgroundColor: '#0F172A',
        color: '#ffffff',
        padding: '40px 20px',
        borderBottom: '1px solid #1E293B',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
              <Sparkles size={14} /> Official Vendor Onboarding
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>
              Become a Seller on Avero
            </h1>
            <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '6px', maxWidth: '560px', lineHeight: '1.5' }}>
              Reach 10+ Crore shoppers nationwide with 0% introductory commission, 7-day automated payouts, and verified BlueDart courier logistics.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Already have a verified seller store?</span>
            <Link
              to="/seller/auth"
              className="btn btn-secondary"
              style={{ backgroundColor: '#1E293B', color: '#ffffff', borderColor: '#334155', height: '40px', gap: '6px', fontSize: '13px' }}
            >
              <LogIn size={15} /> Sign In to Seller Central
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container" style={{ maxWidth: '920px', margin: '-24px auto 0', padding: '0 16px' }}>
        
        {/* Verification in Progress View */}
        {isVerifying ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '48px 32px',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'spin 2s linear infinite'
            }}>
              <Store size={36} />
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                Verifying Seller Application
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                {verificationMessage}
              </p>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', maxWidth: '400px', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${verificationProgress}%`,
                height: '100%',
                backgroundColor: 'var(--primary-600)',
                transition: 'width 0.6s ease'
              }} />
            </div>

            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>
              {verificationProgress}% Completed
            </span>
          </div>
        ) : isApproved ? (
          /* Approved Success View */
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #10B981',
            padding: '48px 32px',
            boxShadow: '0 8px 30px rgba(16, 185, 129, 0.12)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#DCFCE7',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.25)'
            }}>
              <CheckCircle2 size={46} />
            </div>

            <div>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#166534', backgroundColor: '#DCFCE7', padding: '4px 12px', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Verification Complete & Approved
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: '10px 0 0' }}>
                Welcome to Avero Seller Ecosystem!
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '480px' }}>
                Your vendor store <strong>{formData.storeName}</strong> is now verified and active. You can now list catalog products, configure inventory, and fulfill customer orders.
              </p>
            </div>

            {/* Merchant Details Pill */}
            <div style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '16px 24px',
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              textAlign: 'left'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>Merchant ID</div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary-600)' }}>{merchantId}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>GSTIN Verified</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{formData.gstin.toUpperCase()}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>Pickup Hub</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{formData.city} ({formData.pincode})</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/seller')}
              className="btn btn-primary"
              style={{ height: '48px', padding: '0 36px', fontSize: '15px', fontWeight: '800', gap: '8px', boxShadow: '0 4px 14px rgba(19, 102, 226, 0.35)' }}
            >
              Enter Seller Central Dashboard <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          /* Multi-Step Onboarding Form Container */
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden'
          }}>
            
            {/* Top Stepper Indicator */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-divider)',
              backgroundColor: '#F8FAFC',
              overflowX: 'auto'
            }} className="no-scrollbar">
              {steps.map((step) => {
                const Icon = step.icon;
                const isCurrent = currentStep === step.number;
                const isPassed = currentStep > step.number;

                return (
                  <div
                    key={step.number}
                    style={{
                      flex: 1,
                      minWidth: '120px',
                      padding: '16px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      justifyContent: 'center',
                      borderBottom: isCurrent ? '2.5px solid var(--primary-600)' : '2.5px solid transparent',
                      backgroundColor: isCurrent ? '#ffffff' : 'transparent',
                      color: isCurrent ? 'var(--primary-600)' : isPassed ? '#166534' : 'var(--text-secondary)',
                      fontWeight: isCurrent ? '800' : '600',
                      fontSize: '12px'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: isPassed ? '#DCFCE7' : isCurrent ? 'var(--primary-600)' : '#E2E8F0',
                      color: isPassed ? '#166534' : isCurrent ? '#ffffff' : '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '800'
                    }}>
                      {isPassed ? <Check size={13} strokeWidth={3} /> : step.number}
                    </div>
                    <span>{step.title}</span>
                  </div>
                );
              })}
            </div>

            {/* Form Body */}
            <div style={{ padding: '28px 24px' }}>
              
              {/* STEP 1: Business Info */}
              {currentStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      Step 1: Store & Business Identity
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Enter your public customer-facing store name and registered legal details.
                    </p>
                  </div>
                  {/* Brand Store DP / Logo Upload */}
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    border: '1.5px dashed #CBD5E1',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#FFFFFF', border: '2px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {formData.storeLogo ? (
                        <img src={formData.storeLogo} alt="Store DP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Store size={28} color="#94A3B8" />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                        Store Brand Logo / Profile Picture
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                        Visible to all buyers on your brand storefront & product pages.
                      </div>
                      <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                        <label
                          htmlFor="seller-logo-upload"
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#334155',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {isUploadingLogo ? 'Uploading...' : 'Upload Brand DP'}
                        </label>
                        <input
                          id="seller-logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          disabled={isUploadingLogo}
                          style={{ display: 'none' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        Store Display Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Electronics, Trendz Fashion"
                        value={formData.storeName}
                        onChange={(e) => handleInputChange('storeName', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: errors.storeName ? '1.5px solid #EF4444' : '1px solid var(--border-subtle)', fontSize: '13px' }}
                      />
                      {errors.storeName && <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{errors.storeName}</span>}
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        Registered Business Legal Entity Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Retail India Private Limited"
                        value={formData.legalEntityName}
                        onChange={(e) => handleInputChange('legalEntityName', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: errors.legalEntityName ? '1.5px solid #EF4444' : '1px solid var(--border-subtle)', fontSize: '13px' }}
                      />
                      {errors.legalEntityName && <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{errors.legalEntityName}</span>}
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        Business Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. contact@apexstore.in"
                        value={formData.businessEmail}
                        onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: errors.businessEmail ? '1.5px solid #EF4444' : '1px solid var(--border-subtle)', fontSize: '13px' }}
                      />
                      {errors.businessEmail && <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{errors.businessEmail}</span>}
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        Primary Mobile Number *
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="e.g. 9845012345"
                        value={formData.businessPhone}
                        onChange={(e) => handleInputChange('businessPhone', e.target.value.replace(/\D/g, ''))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: errors.businessPhone ? '1.5px solid #EF4444' : '1px solid var(--border-subtle)', fontSize: '13px' }}
                      />
                      {errors.businessPhone && <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{errors.businessPhone}</span>}
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        Business Entity Structure
                      </label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px', backgroundColor: '#ffffff' }}
                      >
                        <option value="Sole Proprietorship">Sole Proprietorship</option>
                        <option value="Private Limited Company">Private Limited Company</option>
                        <option value="Partnership / LLP">Partnership / LLP</option>
                        <option value="Public Limited Company">Public Limited Company</option>
                        <option value="Individual Artisan">Individual Artisan / Direct Seller</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        Primary Selling Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px', backgroundColor: '#ffffff' }}
                      >
                        <option value="electronics">Mobiles & Electronics</option>
                        <option value="fashion">Fashion & Apparel</option>
                        <option value="grocery">Gourmet Grocery & Supermarket</option>
                        <option value="home">Home & Kitchen Appliances</option>
                        <option value="beauty">Beauty & Personal Care</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: GST & PAN */}
              {currentStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      Step 2: Tax Identification (GSTIN & PAN)
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Mandatory as per Indian e-commerce GST guidelines for automated B2B/B2C tax invoices.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        GSTIN Number (15 Digits) *
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          maxLength={15}
                          placeholder="e.g. 29ABCDE1234F1Z5"
                          value={formData.gstin}
                          onChange={(e) => handleInputChange('gstin', e.target.value.toUpperCase())}
                          style={{ flex: 1, padding: '10px 14px', borderRadius: 'var(--radius-md)', border: errors.gstin ? '1.5px solid #EF4444' : '1px solid var(--border-subtle)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}
                        />
                        <button
                          type="button"
                          onClick={handleVerifyGst}
                          className="btn btn-secondary"
                          style={{ height: '42px', padding: '0 16px', fontSize: '13px', whiteSpace: 'nowrap' }}
                        >
                          {formData.gstVerified ? '✓ Verified' : 'Verify GST'}
                        </button>
                      </div>
                      {errors.gstin && <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{errors.gstin}</span>}
                      {formData.gstVerified && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontSize: '12px', fontWeight: '700', marginTop: '6px' }}>
                          <CheckCircle2 size={14} /> Active GSTIN Record Verified on GST Portal
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        Business PAN (10 Characters) *
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="e.g. ABCDE1234F"
                        value={formData.panNumber}
                        onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: errors.panNumber ? '1.5px solid #EF4444' : '1px solid var(--border-subtle)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}
                      />
                      {errors.panNumber && <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{errors.panNumber}</span>}
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        Trade License / CIN / Udyam Registration Number (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. UDYAM-KR-03-0012345"
                        value={formData.tradeLicense}
                        onChange={(e) => handleInputChange('tradeLicense', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Bank Account */}
              {currentStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      Step 3: Settlement Bank Account
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      All customer sale proceeds are automatically settled directly to this account every 7 days.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        Account Holder Legal Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Matching Bank Records"
                        value={formData.accountHolder}
                        onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: errors.accountHolder ? '1.5px solid #EF4444' : '1px solid var(--border-subtle)', fontSize: '13px' }}
                      />
                      {errors.accountHolder && <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{errors.accountHolder}</span>}
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        Bank Name
                      </label>
                      <select
                        value={formData.bankName}
                        onChange={(e) => handleInputChange('bankName', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px', backgroundColor: '#ffffff' }}
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                        <option value="Bank of Baroda">Bank of Baroda</option>
                        <option value="Punjab National Bank">Punjab National Bank</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        Bank Account Number *
                      </label>
                      <input
                        type="password"
                        placeholder="Enter account number"
                        value={formData.accountNumber}
                        onChange={(e) => handleInputChange('accountNumber', e.target.value.replace(/\D/g, ''))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: errors.accountNumber ? '1.5px solid #EF4444' : '1px solid var(--border-subtle)', fontSize: '13px' }}
                      />
                      {errors.accountNumber && <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{errors.accountNumber}</span>}
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        Confirm Account Number *
                      </label>
                      <input
                        type="text"
                        placeholder="Re-enter account number"
                        value={formData.confirmAccountNumber}
                        onChange={(e) => handleInputChange('confirmAccountNumber', e.target.value.replace(/\D/g, ''))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: errors.confirmAccountNumber ? '1.5px solid #EF4444' : '1px solid var(--border-subtle)', fontSize: '13px' }}
                      />
                      {errors.confirmAccountNumber && <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{errors.confirmAccountNumber}</span>}
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        maxLength={11}
                        placeholder="e.g. HDFC0001234"
                        value={formData.ifscCode}
                        onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: errors.ifscCode ? '1.5px solid #EF4444' : '1px solid var(--border-subtle)', fontSize: '13px', textTransform: 'uppercase' }}
                      />
                      {errors.ifscCode && <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{errors.ifscCode}</span>}
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        Instant UPI ID (Optional for daily payouts)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. apexstore@okaxis"
                        value={formData.upiId}
                        onChange={(e) => handleInputChange('upiId', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Warehouse & Pickup Address */}
              {currentStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      Step 4: Logistics & Warehouse Pickup Hub
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Avero delivery partners (BlueDart, Delhivery) will pick up packages from this location.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        Flat / Building / Warehouse / Unit Number *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Plot No 42, Avero Logistic Hub, Phase 2"
                        value={formData.building}
                        onChange={(e) => handleInputChange('building', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: errors.building ? '1.5px solid #EF4444' : '1px solid var(--border-subtle)', fontSize: '13px' }}
                      />
                      {errors.building && <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{errors.building}</span>}
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        Street / Industrial Area / Landmark *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Electronic City Phase 1"
                        value={formData.street}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: errors.street ? '1.5px solid #EF4444' : '1px solid var(--border-subtle)', fontSize: '13px' }}
                      />
                      {errors.street && <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{errors.street}</span>}
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        City *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bengaluru"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: errors.city ? '1.5px solid #EF4444' : '1px solid var(--border-subtle)', fontSize: '13px' }}
                      />
                      {errors.city && <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{errors.city}</span>}
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        State
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px', backgroundColor: '#ffffff' }}
                      >
                        <option value="Karnataka">Karnataka</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Rajasthan">Rajasthan</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                        Pickup 6-Digit Pincode *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 560100"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, ''))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: errors.pincode ? '1.5px solid #EF4444' : '1px solid var(--border-subtle)', fontSize: '13px' }}
                      />
                      {errors.pincode && <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px', display: 'block' }}>{errors.pincode}</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Seller Terms Agreement & Review */}
              {currentStep === 5 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      Step 5: Review & Merchant Agreement
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Review your onboarding details and authorize the marketplace merchant terms.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    padding: '16px 20px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '14px',
                    fontSize: '12px'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Store Name</span>
                      <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{formData.storeName}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)', display: 'block' }}>GSTIN</span>
                      <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{formData.gstin.toUpperCase()}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Settlement Bank</span>
                      <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{formData.bankName} ({formData.ifscCode})</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Pickup Hub</span>
                      <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{formData.city} - {formData.pincode}</strong>
                    </div>
                  </div>

                  {/* Key Merchant Benefits */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#EFF6FF', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #DBEAFE' }}>
                      <Percent size={20} color="var(--primary-600)" />
                      <div>
                        <strong style={{ fontSize: '12px', color: 'var(--primary-900)' }}>0% Commission for 30 Days</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Zero deduction on first month sales</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#ECFDF5', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #D1FAE5' }}>
                      <Clock size={20} color="#059669" />
                      <div>
                        <strong style={{ fontSize: '12px', color: '#065F46' }}>7-Day Fast Settlement</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Direct bank wire every Wednesday</div>
                      </div>
                    </div>
                  </div>

                  {/* Checkbox Agreements */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)' }}>
                      <input
                        type="checkbox"
                        checked={formData.agreedToTerms}
                        onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
                        style={{ marginTop: '2px', accentColor: 'var(--primary-600)', width: '16px', height: '16px' }}
                      />
                      <span>I agree to the Avero Merchant Agreement, Commercial Commission Schedule, and 7-day Return Policy.</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)' }}>
                      <input
                        type="checkbox"
                        checked={formData.counterfeitDeclaration}
                        onChange={(e) => handleInputChange('counterfeitDeclaration', e.target.checked)}
                        style={{ marginTop: '2px', accentColor: 'var(--primary-600)', width: '16px', height: '16px' }}
                      />
                      <span>I declare that all listed products will be 100% genuine with valid manufacturer warranty and authentic invoices.</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '28px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-divider)'
              }}>
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="btn btn-secondary"
                    style={{ height: '44px', padding: '0 20px', fontSize: '13px', gap: '6px' }}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn btn-primary"
                    style={{ height: '44px', padding: '0 24px', fontSize: '13px', fontWeight: '700', gap: '6px' }}
                  >
                    Continue to {steps[currentStep]?.title || 'Next'} <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="btn btn-primary"
                    style={{ height: '46px', padding: '0 32px', fontSize: '14px', fontWeight: '800', gap: '8px', backgroundColor: '#10B981', borderColor: '#059669' }}
                  >
                    <ShieldCheck size={18} /> Submit Application & Activate Store
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
