import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

export default function ContactUsPage() {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order Enquiry',
    orderId: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    showToast('Submitting your support request...', 'info');
    setTimeout(() => {
      setIsSubmitted(true);
      showToast('Support ticket created successfully! Ticket #AVR-' + Math.floor(100000 + Math.random() * 900000), 'success');
    }, 600);
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: '#0F172A', color: '#ffffff', padding: '48px 20px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>Contact Customer Support</h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '8px' }}>
            We're here to help 24x7 with order updates, refunds, vendor queries, and returns.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '960px', margin: '-24px auto 0', padding: '0 16px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          {/* Left Column: Direct Contacts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-subtle)', padding: '24px', boxShadow: 'var(--shadow-xs)' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
                Direct Assistance Channels
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Email Support</div>
                    <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>support@avero.in</strong>
                    <div style={{ fontSize: '11px', color: '#166534', marginTop: '2px' }}>Avg. Response: Under 2 Hours</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Toll-Free Customer Care</div>
                    <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>1800-890-AVERO (28376)</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Mon - Sun, 8:00 AM - 11:00 PM IST</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Corporate Headquarters</div>
                    <strong style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4', display: 'block' }}>
                      Avero Internet Private Limited
                    </strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      Embassy TechVillage, Outer Ring Road, Devarabisanahalli, Bengaluru, Karnataka 560103, India
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Support Form */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-subtle)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Message Received</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  Thank you, <strong>{formData.name}</strong>. Our customer support executive will review your ticket and email you at <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="btn btn-secondary"
                  style={{ marginTop: '8px', height: '38px', fontSize: '13px' }}
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px' }}>
                  Send us a Message
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Your Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rohan Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. rohan@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Enquiry Type</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px', backgroundColor: '#ffffff' }}
                    >
                      <option value="Order Enquiry">Order Status & Delivery</option>
                      <option value="Refund & Return">Return / Instant Refund</option>
                      <option value="Payment Issue">Payment & Invoice Issue</option>
                      <option value="Seller Partnership">Vendor & Seller Hub</option>
                      <option value="General Feedback">Feedback & Suggestions</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Order ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. AVR2026001287"
                      value={formData.orderId}
                      onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Message Details *</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your issue or query in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ height: '42px', fontSize: '13px', fontWeight: '700', gap: '6px', marginTop: '4px' }}
                >
                  <Send size={15} /> Submit Support Request
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
