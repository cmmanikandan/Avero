import React from 'react';
import { Lock, ShieldCheck, Eye, Database } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#0F172A', color: '#ffffff', padding: '48px 20px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>Privacy & Data Security Policy</h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '8px' }}>
            Compliance with the Digital Personal Data Protection Act (DPDP), 2023.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '880px', margin: '-24px auto 0', padding: '0 16px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-subtle)', padding: '32px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#ECFDF5', border: '1px solid #D1FAE5', padding: '14px 18px', borderRadius: '10px', color: '#065F46', fontWeight: '700' }}>
            <ShieldCheck size={20} color="#059669" />
            <span>Avero never sells, rents, or monetizes your personal data to third-party advertising brokers.</span>
          </div>

          <section>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>1. Data Collection & Purpose</h2>
            <p>We collect essential operational data such as your name, delivery address, contact email, and phone number solely to fulfill orders, deliver parcels via verified logistics providers, dispatch invoices, and maintain account security.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>2. Payment Card & UPI Security</h2>
            <p>Payment information is processed directly through PCI-DSS Level 1 certified gateways (Razorpay, Cashfree, Pine Labs). Avero never stores full card CVVs or net banking passwords on our platform servers.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>3. Data Retention & Deletion Rights</h2>
            <p>Under the DPDP Act 2023, users have the absolute right to request access, correction, or erasure of their personal profile data. You can initiate data deletion by writing to our Data Protection Officer at privacy@avero.in.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
