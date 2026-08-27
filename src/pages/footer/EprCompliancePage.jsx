import React from 'react';
import { Leaf, Recycle, Award, CheckCircle2 } from 'lucide-react';

export default function EprCompliancePage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#0F172A', color: '#ffffff', padding: '48px 20px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>E-Waste & EPR Environmental Compliance</h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '8px' }}>
            Extended Producer Responsibility (EPR) under E-Waste (Management) Rules, 2022.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '880px', margin: '-24px auto 0', padding: '0 16px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-subtle)', padding: '32px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#ECFDF5', border: '1px solid #D1FAE5', padding: '14px 18px', borderRadius: '10px', color: '#065F46', fontWeight: '700' }}>
            <Recycle size={20} color="#059669" />
            <span>Central Pollution Control Board (CPCB) Registration No: CPCB/EPR/2026/AVR89012</span>
          </div>

          <section>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Safe Recycling & Take-Back Program</h2>
            <p>Avero is committed to eco-friendly electronic waste disposal. Customers can hand over obsolete smartphones, laptops, battery packs, and appliances for safe recycling at our certified collection centers across India or request free reverse courier take-back.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Do's and Don'ts of E-Waste Handling</h2>
            <p>• <strong>Do:</strong> Store electronic equipment separately and dispose of it only through authorized CPCB-certified dismantlers.</p>
            <p>• <strong>Don't:</strong> Do not dispose of electronic products in municipal garbage bins or dismantle batteries locally.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>E-Waste Toll-Free Recycling Helpline</h2>
            <p>Contact our environmental partners at <strong>1800-419-RECYCLE (7329)</strong> or email <strong>epr@avero.in</strong> for free scheduled e-waste pickup from your residence.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
