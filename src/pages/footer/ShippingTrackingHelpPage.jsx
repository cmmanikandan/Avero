import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clock, ShieldCheck, MapPin, Package, ArrowRight } from 'lucide-react';

export default function ShippingTrackingHelpPage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#0F172A', color: '#ffffff', padding: '48px 20px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>Shipping & Delivery Guidelines</h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '8px' }}>
            High-speed dispatch, tamper-proof security packaging, and nationwide coverage.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '880px', margin: '-24px auto 0', padding: '0 16px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-subtle)', padding: '32px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Delivery Speeds & Service Levels
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--primary-600)' }}>
                  <Truck size={20} />
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Avero Lightning Fast</strong>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                  Same-day & Next-day delivery across metro zones. Free on orders above ₹499.
                </p>
              </div>

              <div style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#059669' }}>
                  <Clock size={20} />
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Standard Express</strong>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                  Delivered within 2-4 business days across 28,000+ PIN codes via BlueDart & Delhivery.
                </p>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-divider)', paddingTop: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
              Open Box Delivery & Tamper Checks
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 16px' }}>
              For premium electronics and smartphones, Avero provides verified <strong>Open Box Delivery</strong>. The delivery executive unboxes the parcel in front of you to verify physical integrity and accessories before you share your secure delivery OTP.
            </p>
            <Link
              to="/orders"
              className="btn btn-primary"
              style={{ height: '42px', padding: '0 20px', fontSize: '13px', fontWeight: '700', gap: '8px', width: 'fit-content' }}
            >
              <Package size={16} /> Track Active Shipments
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
