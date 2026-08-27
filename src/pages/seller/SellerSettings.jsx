import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Store,
  MapPin,
  CreditCard,
  Building2,
  FileCheck,
  Bell,
  Lock,
  Save,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Truck,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';

export default function SellerSettings() {
  const { user, setUser, showToast } = useApp();

  // Load from registration storage or user context
  const [storeData, setStoreData] = useState(() => {
    try {
      const savedRegistration = JSON.parse(localStorage.getItem('avero_seller_profile') || '{}');
      const savedUser = JSON.parse(localStorage.getItem('avero_seller') || '{}');
      return {
        storeName: savedRegistration.storeName || savedUser.storeName || user?.storeName || (user?.name ? `${user.name}'s Store` : ''),
        storeLogo: savedRegistration.storeLogo || savedUser.storeLogo || savedUser.avatar || user?.storeLogo || user?.avatar || '',
        legalEntityName: savedRegistration.legalEntityName || savedUser.legalEntityName || user?.legalEntityName || user?.name || '',
        signatoryName: savedRegistration.signatoryName || user?.name || '',
        businessEmail: savedRegistration.businessEmail || savedUser.email || user?.email || '',
        businessPhone: savedRegistration.businessPhone || savedUser.phone || user?.phone || '',
        businessType: savedRegistration.businessType || 'Proprietorship',
        category: savedRegistration.category || 'electronics',
        merchantId: savedRegistration.merchantId || user?.merchantId || (user?.id ? `SELLER-${user.id.slice(0, 8).toUpperCase()}` : ''),
        
        // GST & Tax
        gstin: savedRegistration.gstin || user?.gstin || '',
        panNumber: savedRegistration.panNumber || user?.panNumber || '',
        tradeLicense: savedRegistration.tradeLicense || '',
        
        // Bank Details
        bankName: savedRegistration.bankName || '',
        accountHolder: savedRegistration.accountHolder || savedRegistration.legalEntityName || user?.name || '',
        accountNumber: savedRegistration.accountNumber || '',
        ifscCode: savedRegistration.ifscCode || '',
        upiId: savedRegistration.upiId || '',
        
        // Pickup Address
        building: savedRegistration.building || '',
        street: savedRegistration.street || '',
        city: savedRegistration.city || '',
        state: savedRegistration.state || '',
        pincode: savedRegistration.pincode || '',

        // Store Policies
        returnWindowDays: savedRegistration.returnWindowDays || 7,
        freeDeliveryThreshold: savedRegistration.freeDeliveryThreshold || 499,
        autoAcceptOrders: savedRegistration.autoAcceptOrders !== undefined ? savedRegistration.autoAcceptOrders : true,
        notificationsEnabled: savedRegistration.notificationsEnabled !== undefined ? savedRegistration.notificationsEnabled : true
      };
    } catch (_) {
      return {
        storeName: user?.storeName || (user?.name ? `${user.name}'s Store` : ''),
        legalEntityName: user?.legalEntityName || user?.name || '',
        signatoryName: user?.name || '',
        businessEmail: user?.email || '',
        businessPhone: user?.phone || '',
        businessType: 'Proprietorship',
        category: 'electronics',
        merchantId: user?.merchantId || '',
        gstin: user?.gstin || '',
        panNumber: user?.panNumber || '',
        tradeLicense: '',
        bankName: '',
        accountHolder: user?.name || '',
        accountNumber: '',
        ifscCode: '',
        upiId: '',
        building: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        returnWindowDays: 7,
        freeDeliveryThreshold: 499,
        autoAcceptOrders: true,
        notificationsEnabled: true
      };
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    showToast('Uploading Brand Logo to Cloudinary...', 'info');

    try {
      const { uploadToCloudinary } = await import('../../services/cloudinaryService');
      const res = await uploadToCloudinary(file);
      if (res?.secureUrl) {
        setStoreData((prev) => ({ ...prev, storeLogo: res.secureUrl }));
        showToast('Store Logo uploaded! Click "Save Store Profile" to persist.', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload logo', 'error');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Persist across local storage and user context
      localStorage.setItem('avero_seller_profile', JSON.stringify(storeData));
      
      const updatedUser = {
        ...(user || {}),
        storeName: storeData.storeName,
        storeLogo: storeData.storeLogo,
        avatar: storeData.storeLogo || user?.avatar,
        photoURL: storeData.storeLogo || user?.photoURL,
        legalEntityName: storeData.legalEntityName,
        gstin: storeData.gstin,
        panNumber: storeData.panNumber,
        phone: storeData.businessPhone,
        email: storeData.businessEmail,
        pincode: storeData.pincode,
        category: storeData.category
      };
      localStorage.setItem('avero_seller', JSON.stringify(updatedUser));
      localStorage.setItem('avero_user', JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);

      // Sync brand stores
      const existingStores = JSON.parse(localStorage.getItem('avero_brand_stores') || '[]');
      const updatedStores = existingStores.map(s => {
        if (s.name.toLowerCase() === storeData.storeName.toLowerCase() || s.id === storeData.merchantId) {
          return { ...s, name: storeData.storeName, gstin: storeData.gstin, category: storeData.category, avatar: storeData.storeLogo };
        }
        return s;
      });
      localStorage.setItem('avero_brand_stores', JSON.stringify(updatedStores));

      showToast('🎉 Store profile, Brand DP, GSTIN & Settlement Bank details saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const storeSlug = storeData.storeName.toLowerCase().replace(/\s+/g, '-');

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Top Header Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        padding: '24px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {storeData.storeLogo ? (
              <img src={storeData.storeLogo} alt="Store Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Store size={28} />
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: '900', margin: 0, color: '#0F172A' }}>
                {storeData.storeName}
              </h1>
              <span style={{ fontSize: '11px', color: '#0369A1', backgroundColor: '#E0F2FE', padding: '3px 8px', borderRadius: '6px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <ShieldCheck size={12} /> KYC Verified
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0' }}>
              Merchant ID: <strong>{storeData.merchantId}</strong> • Registered Entity: <strong>{storeData.legalEntityName}</strong>
            </p>
          </div>
        </div>

        <Link
          to={`/brand/${storeSlug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#EFF6FF',
            color: '#2563EB',
            border: '1px solid #BFDBFE',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '700',
            textDecoration: 'none'
          }}
        >
          <ExternalLink size={15} /> View Live Brand Store
        </Link>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* 1. Store Identity & Owner Information */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <h2 style={{ fontSize: '15.5px', fontWeight: '800', color: '#0F172A', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Store size={18} color="#2563EB" /> 1. Store Identity & Brand Profile
          </h2>

          {/* Brand DP / Logo Upload Row */}
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1.5px dashed #CBD5E1',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#FFFFFF', border: '2px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {storeData.storeLogo ? (
                <img src={storeData.storeLogo} alt="Store DP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Store size={28} color="#94A3B8" />
              )}
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                Store Brand Logo / Display Picture (DP)
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                Shown on your public storefront, vendor profile, and seller dashboard header.
              </div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                <label
                  htmlFor="settings-logo-upload"
                  style={{
                    padding: '6px 14px',
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
                  {isUploadingLogo ? 'Uploading to CDN...' : 'Change Brand DP'}
                </label>
                <input
                  id="settings-logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={isUploadingLogo}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Store Display Name *
              </label>
              <input
                type="text"
                required
                value={storeData.storeName}
                onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Legal Business Entity Name *
              </label>
              <input
                type="text"
                required
                value={storeData.legalEntityName}
                onChange={(e) => setStoreData({ ...storeData, legalEntityName: e.target.value })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Authorized Signatory Name
              </label>
              <input
                type="text"
                value={storeData.signatoryName}
                onChange={(e) => setStoreData({ ...storeData, signatoryName: e.target.value })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Primary Business Category
              </label>
              <select
                value={storeData.category}
                onChange={(e) => setStoreData({ ...storeData, category: e.target.value })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', backgroundColor: '#FFFFFF' }}
              >
                <option value="mobiles">Mobiles & Tablets</option>
                <option value="electronics">Laptops & Electronics</option>
                <option value="audio">Audio & Soundbars</option>
                <option value="footwear">Footwear & Shoes</option>
                <option value="fashion">Fashion & Apparel</option>
                <option value="appliances">Home Appliances</option>
                <option value="beauty">Beauty & Personal Care</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Official Business Email *
              </label>
              <input
                type="email"
                required
                value={storeData.businessEmail}
                onChange={(e) => setStoreData({ ...storeData, businessEmail: e.target.value })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Support / WhatsApp Phone Number *
              </label>
              <input
                type="tel"
                required
                value={storeData.businessPhone}
                onChange={(e) => setStoreData({ ...storeData, businessPhone: e.target.value })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
              />
            </div>
          </div>
        </div>

        {/* 2. GSTIN & Tax Compliance */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <h2 style={{ fontSize: '15.5px', fontWeight: '800', color: '#0F172A', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} color="#2563EB" /> 2. GSTIN & Tax Compliance (Invoicing)
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                GSTIN Number *
              </label>
              <input
                type="text"
                required
                value={storeData.gstin}
                onChange={(e) => setStoreData({ ...storeData, gstin: e.target.value.toUpperCase() })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', textTransform: 'uppercase', fontWeight: '700' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Business PAN Number *
              </label>
              <input
                type="text"
                required
                value={storeData.panNumber}
                onChange={(e) => setStoreData({ ...storeData, panNumber: e.target.value.toUpperCase() })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', textTransform: 'uppercase', fontWeight: '700' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Trade / MSME License Number
              </label>
              <input
                type="text"
                value={storeData.tradeLicense}
                onChange={(e) => setStoreData({ ...storeData, tradeLicense: e.target.value })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
              />
            </div>
          </div>
        </div>

        {/* 3. Logistics Dispatch & Warehouse Pickup Hub */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <h2 style={{ fontSize: '15.5px', fontWeight: '800', color: '#0F172A', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="#2563EB" /> 3. Logistics Dispatch & Warehouse Pickup Hub
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Building / Warehouse Name & Unit Number *
              </label>
              <input
                type="text"
                required
                value={storeData.building}
                onChange={(e) => setStoreData({ ...storeData, building: e.target.value })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Street / Area / Landmark
              </label>
              <input
                type="text"
                value={storeData.street}
                onChange={(e) => setStoreData({ ...storeData, street: e.target.value })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                City *
              </label>
              <input
                type="text"
                required
                value={storeData.city}
                onChange={(e) => setStoreData({ ...storeData, city: e.target.value })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                State *
              </label>
              <input
                type="text"
                required
                value={storeData.state}
                onChange={(e) => setStoreData({ ...storeData, state: e.target.value })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Pincode *
              </label>
              <input
                type="text"
                required
                value={storeData.pincode}
                onChange={(e) => setStoreData({ ...storeData, pincode: e.target.value })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
              />
            </div>
          </div>
        </div>

        {/* 4. Bank Account & Settlement Payouts */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <h2 style={{ fontSize: '15.5px', fontWeight: '800', color: '#0F172A', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={18} color="#2563EB" /> 4. Bank Account for Weekly Automated Settlements
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Account Holder Name *
              </label>
              <input
                type="text"
                required
                value={storeData.accountHolder}
                onChange={(e) => setStoreData({ ...storeData, accountHolder: e.target.value })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Bank Name *
              </label>
              <input
                type="text"
                required
                value={storeData.bankName}
                onChange={(e) => setStoreData({ ...storeData, bankName: e.target.value })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Bank Account Number *
              </label>
              <input
                type="text"
                required
                value={storeData.accountNumber}
                onChange={(e) => setStoreData({ ...storeData, accountNumber: e.target.value })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', fontWeight: '700' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                IFSC Code *
              </label>
              <input
                type="text"
                required
                value={storeData.ifscCode}
                onChange={(e) => setStoreData({ ...storeData, ifscCode: e.target.value.toUpperCase() })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', textTransform: 'uppercase', fontWeight: '700' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Settlement UPI ID
              </label>
              <input
                type="text"
                value={storeData.upiId}
                onChange={(e) => setStoreData({ ...storeData, upiId: e.target.value })}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="submit"
            disabled={isSaving}
            style={{
              height: '46px',
              padding: '0 32px',
              borderRadius: '10px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: '800',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
            }}
          >
            <Save size={18} /> {isSaving ? 'Saving Changes...' : 'Save Store Settings'}
          </button>
        </div>

      </form>
    </div>
  );
}
