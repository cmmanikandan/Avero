import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, ShieldCheck, Zap, Percent, RefreshCw, Lock, CheckCircle2 } from 'lucide-react';

export default function PaymentsPricingPage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#0F172A', color: '#ffffff', padding: '48px 20px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>Payments & Pricing Transparency</h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '8px' }}>
            100% secure 256-bit encrypted transactions, transparent pricing, and zero hidden checkout fees.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '880px', margin: '-24px auto 0', padding: '0 16px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-subtle)', padding: '32px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Accepted Payment Instruments
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>UPI (Instant Zero-Fee)</div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Google Pay, PhonePe, Paytm, BHIM, CRED, Amazon Pay UPI.</p>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>Credit & Debit Cards</div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Visa, MasterCard, RuPay, Diners Club, and American Express with 3D Secure OTP.</p>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>Net Banking (50+ Banks)</div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Direct instant internet banking with HDFC, ICICI, SBI, Axis, Kotak, and more.</p>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>No-Cost & Low-Cost EMI</div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>3, 6, 9, and 12-month tenure EMIs across leading credit cards and Bajaj Finserv.</p>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-divider)', paddingTop: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Pricing & GST Invoicing Policy
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 12px' }}>
              All prices listed on Avero are inclusive of all applicable Goods and Services Tax (GST). Each order generates an official GST-compliant tax invoice downloadable from your Orders dashboard with detailed CGST, SGST, and IGST breakdowns.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', backgroundColor: '#DCFCE7', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
              <ShieldCheck size={16} /> Guaranteed No Hidden Convenience Surcharges at Checkout
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
