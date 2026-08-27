import React from 'react';
import { Shield, FileText } from 'lucide-react';

export default function TermsOfUsePage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#0F172A', color: '#ffffff', padding: '48px 20px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>Terms of Use</h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '8px' }}>
            Effective Date: January 1, 2026 • Governing Law: Information Technology Act, 2000 (India)
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '880px', margin: '-24px auto 0', padding: '0 16px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-subtle)', padding: '32px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
          
          <section>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>1. Introduction & Acceptance</h2>
            <p>Welcome to Avero (operated by Avero Internet Private Limited). By accessing, browsing, or using this marketplace platform across desktop, mobile web, or application clients, you agree to be bound by these Terms of Use and all related policies.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>2. Marketplace Intermediary Status</h2>
            <p>Avero operates as an e-commerce marketplace intermediary under Section 79 of the Information Technology Act, 2000. Verified third-party sellers list and sell goods to end consumers, while Avero facilitates secure payment processing, platform trust, and logistics orchestration.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>3. User Accounts & Authenticity</h2>
            <p>Users must provide genuine contact details, delivery addresses, and payment instruments. Any fraudulent activity, automated scraping, or misuse of promotional codes will result in account suspension and cancellation of affected orders.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>4. Intellectual Property & Brand Rights</h2>
            <p>All brand logos, interface designs, trademarks, and multimedia assets are the intellectual property of Avero Internet Private Limited or their respective licensed brand holders. Unauthorized duplication is strictly prohibited.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
