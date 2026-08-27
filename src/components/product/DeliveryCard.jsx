import React, { useState } from 'react';
import { Truck, CheckCircle2, RotateCcw, Banknote, ShieldCheck, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DeliveryCard({ deliveryDays = 1, freeDelivery = true }) {
  const { activePincode, changePincode, showToast } = useApp();
  const [pincodeInput, setPincodeInput] = useState(activePincode || '560001');
  const [status, setStatus] = useState({
    checked: true,
    deliverable: true,
    eta: deliveryDays === 1 ? 'Tomorrow, by 5:00 PM' : `In ${deliveryDays} days`,
    pincode: activePincode || '560001'
  });

  const handleCheck = (e) => {
    e.preventDefault();
    const cleanPin = pincodeInput.trim().replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      showToast('Please enter a valid 6-digit Pincode', 'error');
      return;
    }
    changePincode(cleanPin);
    setStatus({
      checked: true,
      deliverable: true,
      eta: 'Tomorrow, by 5:00 PM',
      pincode: cleanPin
    });
    showToast(`Delivery available to pincode ${cleanPin}`, 'success');
  };

  return (
    <div
      style={{
        backgroundColor: '#F8FAFC',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
          <Truck size={17} color="var(--primary-600)" />
          <span>Delivery Options & Availability</span>
        </div>
        {freeDelivery && (
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--savings-green)', backgroundColor: 'var(--savings-green-bg)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
            FREE DELIVERY
          </span>
        )}
      </div>

      {/* Pincode Input Form (Input & Button 48px height, equal border radius) */}
      <form onSubmit={handleCheck} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <MapPin size={16} color="var(--primary-600)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            maxLength={6}
            value={pincodeInput}
            onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-digit delivery pincode"
            aria-label="Delivery pincode"
            style={{
              width: '100%',
              height: '48px',
              minHeight: '48px',
              padding: '0 14px 0 38px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-subtle)',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: '#ffffff',
              transition: 'border-color 0.15s ease'
            }}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{
            height: '48px',
            minHeight: '48px',
            padding: '0 22px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontWeight: '700',
            flexShrink: 0
          }}
        >
          Check
        </button>
      </form>

      {/* Delivery ETA & Details */}
      {status.checked && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px', borderTop: '1px dashed var(--border-subtle)' }}>
          {/* Estimated Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--savings-green)', fontWeight: '600' }}>
            <CheckCircle2 size={16} />
            <span>Delivery {status.eta} to <strong>{status.pincode}</strong></span>
          </div>

          {/* Value Badges: COD & Return Policy */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginTop: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <Banknote size={14} color="var(--primary-600)" />
              <span>Cash on Delivery Available</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <RotateCcw size={14} color="var(--primary-600)" />
              <span>7 Days Replacement Policy</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
