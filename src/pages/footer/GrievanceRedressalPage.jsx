import React from 'react';
import { Mail, Phone, MapPin, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function GrievanceRedressalPage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#0F172A', color: '#ffffff', padding: '48px 20px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>Grievance Redressal Mechanism</h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '8px' }}>
            In accordance with Consumer Protection (E-Commerce) Rules, 2020 & IT Rules, 2021.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '880px', margin: '-24px auto 0', padding: '0 16px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-subtle)', padding: '32px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
          
          <section>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Designated Grievance Officer</h2>
            <p>For any unresolved complaints regarding order quality, delivery SLA, merchant disputes, or consumer rights, you may directly reach out to our appointed Grievance Redressal Officer:</p>
            
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><strong style={{ color: 'var(--text-primary)' }}>Officer Name:</strong> Mr. Vikramaditya Sen</div>
              <div><strong style={{ color: 'var(--text-primary)' }}>Designation:</strong> Head of Consumer Trust & Grievance Officer</div>
              <div><strong style={{ color: 'var(--text-primary)' }}>Email:</strong> grievance-officer@avero.in</div>
              <div><strong style={{ color: 'var(--text-primary)' }}>Direct Line:</strong> +91 80 4912 8800 (Mon - Fri, 10 AM to 6 PM IST)</div>
              <div><strong style={{ color: 'var(--text-primary)' }}>Postal Address:</strong> Avero Internet Pvt Ltd, 4th Floor, Embassy TechVillage, Outer Ring Road, Bengaluru, Karnataka 560103</div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Grievance Resolution Timelines</h2>
            <p>1. <strong>Acknowledgment:</strong> All complaints received by the Grievance Officer are acknowledged with a unique ticket number within <strong>48 hours</strong>.</p>
            <p>2. <strong>Investigation & Resolution:</strong> The grievance will be thoroughly investigated with the involved merchant partner and resolved within <strong>15 days</strong> of receipt.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
