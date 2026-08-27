import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AVAILABLE_COUPONS, BANK_OFFERS } from '../data/coupons';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/product/ProductCard';
import {
  ArrowLeft,
  Tag,
  Copy,
  CheckCircle2,
  Percent,
  CreditCard,
  Sparkles,
  Info,
  ShoppingBag
} from 'lucide-react';

export default function OfferDetailsPage() {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const { showToast, products = [] } = useApp();

  // Find offer from coupons or bank offers
  const matchedCoupon = AVAILABLE_COUPONS.find(
    (c) => c.code.toLowerCase() === (offerId || '').toLowerCase()
  );
  const matchedBankOffer = BANK_OFFERS.find(
    (b) => b.id.toLowerCase() === (offerId || '').toLowerCase()
  );

  const offerData = useMemo(() => {
    if (matchedCoupon) {
      return {
        code: matchedCoupon.code,
        title: matchedCoupon.title,
        description: matchedCoupon.description,
        minOrder: matchedCoupon.minOrderValue,
        discountText: matchedCoupon.discountAmount
          ? `Flat ₹${matchedCoupon.discountAmount} Instant Discount`
          : `${matchedCoupon.discountPercentage}% Off up to ₹${matchedCoupon.maxDiscount}`,
        expiry: matchedCoupon.expiry,
        terms: [
          'Valid on all prepaid and COD eligible orders across Electronics, Mobiles, and Lifestyle.',
          `Minimum cart value required: ₹${matchedCoupon.minOrderValue?.toLocaleString('en-IN') || 1999}.`,
          'Can be combined with select bank instant cashback offers.',
          'Applicable once per user account during the offer promotional window.'
        ]
      };
    }

    if (matchedBankOffer) {
      return {
        code: matchedBankOffer.id.toUpperCase(),
        title: `${matchedBankOffer.bank} Instant Savings`,
        description: matchedBankOffer.discount,
        minOrder: matchedBankOffer.minOrder,
        discountText: matchedBankOffer.discount,
        expiry: 'Valid till month end',
        terms: [
          `Applicable on all ${matchedBankOffer.bank} ${matchedBankOffer.type} transactions.`,
          `Minimum transaction value: ₹${matchedBankOffer.minOrder?.toLocaleString('en-IN')}.`,
          'Discount calculated automatically on the final payment gateway page.',
          'Offer valid on both EMI and full-swipe transaction modes.'
        ]
      };
    }

    // Default fallback offer if dynamic id passed
    return {
      code: offerId ? offerId.toUpperCase() : 'AVERO500',
      title: 'Special Exclusive Promotional Voucher',
      description: 'Instant discount savings applied across selected high-rated products.',
      minOrder: 1999,
      discountText: 'Up to 15% Instant Savings',
      expiry: 'Limited Time Deal',
      terms: [
        'Applicable on certified genuine products fulfilled under Avero Assured.',
        'Requires minimum cart value of ₹1,999.',
        'Non-transferable voucher applicable at checkout.'
      ]
    };
  }, [matchedCoupon, matchedBankOffer, offerId]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(offerData.code);
    showToast(`Coupon code ${offerData.code} copied to clipboard!`, 'success');
  };

  // Eligible Products
  const eligibleProducts = products.slice(0, 8);

  return (
    <div className="container" style={{ maxWidth: '1100px', padding: '16px 16px 80px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="pdp-floating-btn"
          aria-label="Go back"
          style={{ width: '38px', height: '38px' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            Offer & Voucher Details
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Terms, conditions and eligible items
          </div>
        </div>
      </div>

      {/* Offer Coupon Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1366E2 0%, #072B66 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          color: '#ffffff',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ maxWidth: '480px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: '700', marginBottom: '10px' }}>
            <Sparkles size={12} /> {offerData.discountText}
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 6px 0' }}>
            {offerData.title}
          </h2>
          <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>
            {offerData.description}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px dashed rgba(255, 255, 255, 0.4)', borderRadius: 'var(--radius-md)', padding: '8px 14px', textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '10px', opacity: 0.8, textTransform: 'uppercase' }}>PROMO CODE</span>
            <strong style={{ fontSize: '16px', letterSpacing: '1px' }}>{offerData.code}</strong>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            style={{
              backgroundColor: '#ffffff',
              color: 'var(--primary-600)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Copy size={14} /> Copy
          </button>
        </div>
      </div>

      {/* Terms & Conditions Section */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          padding: '20px',
          marginBottom: '24px'
        }}
      >
        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={16} color="var(--primary-600)" /> Terms & Conditions
        </h3>
        <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          {offerData.terms.map((t, idx) => (
            <li key={idx} style={{ listStyleType: 'disc', lineHeight: '1.4' }}>
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* Eligible Products Section */}
      {eligibleProducts.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              Eligible Products for this Offer ({eligibleProducts.length})
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px' }}>
            {eligibleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
