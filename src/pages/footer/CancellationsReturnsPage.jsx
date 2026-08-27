import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, CheckCircle2, AlertCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CancellationsReturnsPage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#0F172A', color: '#ffffff', padding: '48px 20px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>Cancellations & 7-Day Returns</h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '8px' }}>
            Hassle-free doorstep pickup, instant refunds, and simple 1-click order cancellations.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '880px', margin: '-24px auto 0', padding: '0 16px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-subtle)', padding: '32px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
              How Doorstep Returns & Replacements Work
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary-600)', marginBottom: '4px' }}>STEP 1</div>
                <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Request Return in Orders</strong>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>Select the reason (defective, size mismatch, damaged) within 7 days of delivery.</p>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#D97706', marginBottom: '4px' }}>STEP 2</div>
                <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Free Doorstep Pickup</strong>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>Our courier executive arrives at your address to inspect and collect the item with zero pickup fee.</p>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#166534', marginBottom: '4px' }}>STEP 3</div>
                <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Instant Refund / Replacement</strong>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>Refund is processed instantly to your original payment source or replacement is dispatched.</p>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-divider)', paddingTop: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Cancellation Policy Before Dispatch
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 14px' }}>
              Orders can be cancelled at any time before the package is handed over to the courier partner directly from your <Link to="/orders" style={{ color: 'var(--primary-600)', fontWeight: '700' }}>Orders Dashboard</Link>. Instant 100% full refund is initiated automatically upon cancellation.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
