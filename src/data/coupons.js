export const AVAILABLE_COUPONS = [
  {
    code: 'AVERO500',
    title: 'Flat ₹500 OFF',
    discountType: 'fixed',
    discountAmount: 500,
    minOrderValue: 1999,
    description: 'Applicable on orders above ₹1,999 across all categories',
    expiry: 'Valid till 30 Nov 2026'
  },
  {
    code: 'MEGA100',
    title: 'Flat ₹100 OFF Instant Cashback',
    discountType: 'fixed',
    discountAmount: 100,
    minOrderValue: 499,
    description: 'Applicable on all orders above ₹499',
    expiry: 'Valid till 31 Dec 2026'
  },
  {
    code: 'FESTIVE15',
    title: '15% Festive Savings',
    discountType: 'percentage',
    discountPercentage: 15,
    maxDiscount: 1500,
    minOrderValue: 1999,
    description: 'Get 15% instant discount up to ₹1,500 on Electronics and Fashion',
    expiry: 'Valid till 15 Nov 2026'
  },
  {
    code: 'SUPERDEAL',
    title: 'Flat ₹1,000 OFF',
    discountType: 'fixed',
    discountAmount: 1000,
    minOrderValue: 9999,
    description: 'Special weekend voucher on smartphones, laptops and TVs',
    expiry: 'Limited time offer'
  },
  {
    code: 'HDFCBANK10',
    title: '10% Instant Discount on HDFC Cards',
    discountType: 'percentage',
    discountPercentage: 10,
    maxDiscount: 1250,
    minOrderValue: 5000,
    description: 'Use HDFC Bank Credit or Debit card at checkout. Min order ₹5,000',
    expiry: 'Valid every Wednesday'
  },
  {
    code: 'ICICICARD',
    title: 'Flat ₹750 Off on ICICI Bank Cards',
    discountType: 'fixed',
    discountAmount: 750,
    minOrderValue: 9999,
    description: 'Applicable on ICICI Credit Cards on Smartphones above ₹9,999',
    expiry: 'Valid till 30 Nov 2026'
  },
  {
    code: 'VOUCHER250',
    title: '₹250 Gift Voucher on Fashion & Shoes',
    discountType: 'fixed',
    discountAmount: 250,
    minOrderValue: 1299,
    description: 'Exclusive brand gift voucher on Apparel and Footwear above ₹1,299',
    expiry: 'Valid till 31 Dec 2026'
  }
];

export const BANK_OFFERS = [
  {
    id: 'hdfc-cc',
    bank: 'HDFC Bank',
    type: 'Credit Card EMI',
    discount: '10% Instant Discount up to ₹1,250',
    minOrder: 5000,
    badge: 'Popular'
  },
  {
    id: 'icici-card',
    bank: 'ICICI Bank',
    type: 'Credit & Debit Cards',
    discount: 'Flat ₹750 Instant Discount',
    minOrder: 9999,
    badge: 'Verified'
  },
  {
    id: 'sbi-card',
    bank: 'SBI Card',
    type: 'Credit Card',
    discount: '5% Unlimited Cashback',
    minOrder: 2500,
    badge: 'Standard'
  }
];
