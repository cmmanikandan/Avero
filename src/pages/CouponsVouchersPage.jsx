import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Tag,
  Ticket,
  Percent,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Gift,
  Zap,
  ShoppingBag
} from 'lucide-react';

export default function CouponsVouchersPage() {
  const { appliedCoupon, setAppliedCoupon, showToast } = useApp();
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'DISCOUNTS' | 'BANK' | 'VOUCHERS'

  const couponsList = [
    {
      code: 'AVERO500',
      title: 'Flat ₹500 OFF on First Order',
      description: 'Applicable on orders above ₹1,999 across Electronics, Mobiles & Fashion.',
      discount: '₹500 OFF',
      discountType: 'fixed',
      discountAmount: 500,
      minOrder: 1999,
      category: 'DISCOUNTS',
      expiry: 'Valid till 31 Oct 2026',
      tag: 'Bestseller',
      bgGradient: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
      badgeColor: '#DBEAFE',
      badgeTextColor: '#1D4ED8'
    },
    {
      code: 'MEGA100',
      title: 'Flat ₹100 OFF Instant Cashback',
      description: 'Applicable on all orders above ₹499. No coupon fee or platform cap.',
      discount: '₹100 OFF',
      discountType: 'fixed',
      discountAmount: 100,
      minOrder: 499,
      category: 'DISCOUNTS',
      expiry: 'Valid till 15 Nov 2026',
      tag: 'All Users',
      bgGradient: 'linear-gradient(135deg, #065F46 0%, #10B981 100%)',
      badgeColor: '#D1FAE5',
      badgeTextColor: '#047857'
    },
    {
      code: 'FESTIVE15',
      title: '15% Instant Discount up to ₹1,500',
      description: 'Special seasonal promo on Premium Smart TVs, Laptops & Home Appliances.',
      discount: '15% OFF',
      discountType: 'percentage',
      discountPercentage: 15,
      maxDiscount: 1500,
      minOrder: 3999,
      category: 'DISCOUNTS',
      expiry: 'Valid till 28 Nov 2026',
      tag: 'Festive',
      bgGradient: 'linear-gradient(135deg, #9A3412 0%, #EA580C 100%)',
      badgeColor: '#FFEDD5',
      badgeTextColor: '#C2410C'
    },
    {
      code: 'HDFCBANK10',
      title: '10% Instant Discount on HDFC Cards',
      description: 'Use HDFC Bank Credit or Debit card at checkout. Min transaction ₹5,000.',
      discount: '10% Instant',
      discountType: 'percentage',
      discountPercentage: 10,
      maxDiscount: 1250,
      minOrder: 5000,
      category: 'BANK',
      expiry: 'Valid every Wednesday',
      tag: 'Bank Offer',
      bgGradient: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
      badgeColor: '#DBEAFE',
      badgeTextColor: '#1E40AF'
    },
    {
      code: 'ICICICARD',
      title: 'Flat ₹750 Off on ICICI Bank Cards',
      description: 'Applicable on ICICI Credit Cards on Smartphones & Smartwatches above ₹9,999.',
      discount: '₹750 OFF',
      discountType: 'fixed',
      discountAmount: 750,
      minOrder: 9999,
      category: 'BANK',
      expiry: 'Valid till 30 Nov 2026',
      tag: 'Bank Offer',
      bgGradient: 'linear-gradient(135deg, #831843 0%, #DB2777 100%)',
      badgeColor: '#FCE7F3',
      badgeTextColor: '#9D174D'
    },
    {
      code: 'VOUCHER250',
      title: '₹250 Gift Voucher on Fashion & Shoes',
      description: 'Exclusive brand gift voucher on Men & Women Apparel and Footwear.',
      discount: '₹250 Voucher',
      discountType: 'fixed',
      discountAmount: 250,
      minOrder: 1299,
      category: 'VOUCHERS',
      expiry: 'Valid till 31 Dec 2026',
      tag: 'Fashion Hub',
      bgGradient: 'linear-gradient(135deg, #581C87 0%, #9333EA 100%)',
      badgeColor: '#F3E8FF',
      badgeTextColor: '#7E22CE'
    }
  ];

  const filteredCoupons = activeTab === 'ALL'
    ? couponsList
    : couponsList.filter(c => c.category === activeTab);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code "${code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleApplyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
    showToast(`Coupon "${coupon.code}" applied to your order!`, 'success');
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '60px', paddingTop: '20px' }}>
      <div className="container" style={{ maxWidth: '920px', margin: '0 auto' }}>
        
        {/* Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            borderRadius: '16px',
            padding: '28px 24px',
            color: '#FFFFFF',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.12)'
          }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={14} /> Official Promo Store
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '6px 0 4px', color: '#FFFFFF' }}>
              Coupons & Special Vouchers
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
              Apply verified promo codes and save up to ₹1,500 on your favorite electronics, fashion, and home essentials.
            </p>
          </div>

          <Link
            to="/cart"
            style={{
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '800',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShoppingBag size={16} /> Go to Cart
          </Link>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
          {[
            { id: 'ALL', label: 'All Offers (6)' },
            { id: 'DISCOUNTS', label: 'Instant Discounts' },
            { id: 'BANK', label: 'Bank & Card Deals' },
            { id: 'VOUCHERS', label: 'Gift Vouchers' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: activeTab === tab.id ? '1px solid #2563EB' : '1px solid #E2E8F0',
                backgroundColor: activeTab === tab.id ? '#EFF6FF' : '#FFFFFF',
                color: activeTab === tab.id ? '#1D4ED8' : '#64748B',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? '800' : '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Coupons Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '16px'
          }}
        >
          {filteredCoupons.map((coupon) => {
            const isApplied = appliedCoupon?.code === coupon.code;
            const isCopied = copiedCode === coupon.code;

            return (
              <div
                key={coupon.code}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: isApplied ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  position: 'relative'
                }}
              >
                {/* Top Voucher Header */}
                <div
                  style={{
                    background: coupon.bgGradient,
                    padding: '16px 18px',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Ticket size={20} color="#FFFFFF" />
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF' }}>
                        {coupon.discount}
                      </div>
                      <span style={{ fontSize: '11px', color: '#E2E8F0' }}>
                        Min. Order ₹{coupon.minOrder.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      color: '#FFFFFF'
                    }}
                  >
                    {coupon.tag}
                  </span>
                </div>

                {/* Body Content */}
                <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px' }}>
                      {coupon.title}
                    </h3>
                    <p style={{ fontSize: '12.5px', color: '#64748B', lineHeight: '1.4', margin: '0 0 14px' }}>
                      {coupon.description}
                    </p>
                  </div>

                  {/* Code Box & Actions */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px dashed #CBD5E1',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Tag size={15} color="#2563EB" />
                        <span style={{ fontFamily: 'Courier New, monospace', fontSize: '15px', fontWeight: '900', color: '#0F172A', letterSpacing: '1px' }}>
                          {coupon.code}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyCode(coupon.code)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: isCopied ? '#059669' : '#2563EB',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {isCopied ? <Check size={14} /> : <Copy size={14} />}
                        {isCopied ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {coupon.expiry}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(coupon)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: isApplied ? '#10B981' : '#2563EB',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {isApplied ? <Check size={14} /> : null}
                        {isApplied ? 'Applied' : 'Apply to Order'}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
