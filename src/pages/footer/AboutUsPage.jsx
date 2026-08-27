import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Truck,
  Users,
  Award,
  Globe,
  Store,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Clock,
  HeartHandshake,
  ArrowRight
} from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Hero Header */}
      <div style={{
        backgroundColor: '#0F172A',
        color: '#ffffff',
        padding: '60px 20px',
        textAlign: 'center',
        borderBottom: '1px solid #1E293B'
      }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(19, 102, 226, 0.15)',
            color: '#60A5FA',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            <Sparkles size={14} /> India's Next-Gen High-Speed Marketplace
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>
            Empowering Commerce Across India
          </h1>
          <p style={{ fontSize: '15px', color: '#94A3B8', marginTop: '12px', lineHeight: '1.6' }}>
            Avero is built on the principles of hyper-fast delivery, 100% genuine products, and verified seller ecosystems. We connect millions of discerning Indian consumers with certified brands and artisanal merchants.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '960px', margin: '-30px auto 0', padding: '0 16px' }}>
        
        {/* Key Metrics Strip */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary-600)' }}>28,000+</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '4px' }}>Pincodes Served Nationwide</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--savings-green)' }}>100%</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '4px' }}>Authentic Brand Guarantee</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#D97706' }}>50,000+</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '4px' }}>Verified Merchant Partners</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#7C3AED' }}>99.4%</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '4px' }}>On-Time Delivery SLA</div>
          </div>
        </div>

        {/* Core Pillars */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          padding: '32px',
          boxShadow: 'var(--shadow-xs)',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px' }}>
            Our Core Pillars
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 6px' }}>Avero Assured Guarantee</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                Every item bearing the Avero Assured badge passes a rigorous 6-point quality and authenticity check before leaving our warehouse.
              </p>
            </div>

            <div style={{ padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Truck size={22} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 6px' }}>Lightning Fast Fulfillment</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                Powered by BlueDart Express, Delhivery, and local rapid hubs, delivering orders within 24-48 hours across metro and tier-2 corridors.
              </p>
            </div>

            <div style={{ padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <HeartHandshake size={22} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 6px' }}>Empowering Indian Sellers</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                We provide Indian small businesses and direct-to-consumer brands with zero-friction digital onboarding, instant payments, and analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Join our Marketplace CTA */}
        <div style={{
          backgroundColor: '#0F172A',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Are you a manufacturer or brand?</h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>Join 50,000+ businesses selling on Avero with 0% commission for 30 days.</p>
          </div>
          <Link
            to="/become-seller"
            className="btn btn-primary"
            style={{ height: '44px', padding: '0 24px', fontSize: '13px', fontWeight: '700', gap: '8px' }}
          >
            <Store size={16} /> Become a Seller <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
