import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  RotateCcw,
  X,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  Wallet,
  Calendar,
  ShieldCheck
} from 'lucide-react';

const RETURN_REASONS = [
  { id: 'defective', label: 'Item is defective, dead on arrival, or not working' },
  { id: 'damaged', label: 'Item or packaging was damaged upon doorstep delivery' },
  { id: 'wrong_item', label: 'Received wrong product, color, or model variant' },
  { id: 'missing_parts', label: 'Missing accessories, warranty card, or manuals' },
  { id: 'quality', label: 'Product quality is not as described in catalog' },
  { id: 'size_fit', label: 'Size, fit, or dimensions do not match expectation' }
];

export default function ReturnRequestModal({ isOpen, onClose, order }) {
  const { showToast, setOrders } = useApp();

  const [selectedReason, setSelectedReason] = useState('defective');
  const [comments, setComments] = useState('');
  const [resolutionType, setResolutionType] = useState('REFUND'); // 'REFUND' | 'REPLACEMENT'
  const [refundDestination, setRefundDestination] = useState('ORIGINAL'); // 'ORIGINAL' | 'WALLET'
  const [pickupDate, setPickupDate] = useState('Tomorrow (10 AM - 2 PM)');
  const [uploadedPhotos, setUploadedPhotos] = useState([
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedPhotos(prev => [...prev, event.target.result]);
          showToast('Proof photo attached successfully!', 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comments.trim()) {
      showToast('Please provide a brief description of the issue', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const returnId = `RET-${Math.floor(100000 + Math.random() * 900000)}`;

      // Update order status in AppContext
      if (setOrders) {
        setOrders(prev => prev.map(o => {
          if (o.id === order.id) {
            return {
              ...o,
              status: resolutionType === 'REPLACEMENT' ? 'Replacement Requested' : 'Return Requested',
              returnDetails: {
                returnId,
                reason: selectedReason,
                comments,
                resolutionType,
                refundDestination,
                pickupDate,
                requestedAt: 'Just now'
              }
            };
          }
          return o;
        }));
      }

      setIsSubmitting(false);
      showToast(`🎉 ${resolutionType === 'REPLACEMENT' ? 'Replacement' : 'Return'} request #${returnId} submitted! Pickup agent scheduled for ${pickupDate}.`, 'success');
      onClose();
    }, 600);
  };

  const item = order.items?.[0] || {
    title: 'Purchased Item',
    price: order.totalAmount || 37006,
    thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80'
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1050 }}>
      <div
        className="bottom-sheet"
        style={{
          maxWidth: '560px',
          margin: 'auto',
          position: 'relative',
          borderRadius: '16px',
          backgroundColor: '#FFFFFF',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          zIndex: 1051
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-divider)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RotateCcw size={20} color="#DC2626" />
            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#0F172A' }}>
              Request Return or Replacement
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Order Item Summary Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#F8FAFC',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src={item.thumbnail} alt={item.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Order #{order.id} • Eligible for Return till 7 Days from Delivery
              </div>
            </div>
          </div>

          {/* 1. Reason for Return */}
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: '800', color: '#334155', marginBottom: '6px', display: 'block' }}>
              Reason for Return / Replacement *
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                backgroundColor: '#FFFFFF',
                fontWeight: '600'
              }}
            >
              {RETURN_REASONS.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* 2. Detailed Description */}
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: '800', color: '#334155', marginBottom: '6px', display: 'block' }}>
              Please describe the issue in detail *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide specific details about the defect, damage, or discrepancy..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                fontFamily: 'inherit',
                lineHeight: '1.4'
              }}
            />
          </div>

          {/* 3. Photo Proof Upload */}
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: '800', color: '#334155', marginBottom: '6px', display: 'block' }}>
              Attach Photos / Video Proof (Recommended for fast approval)
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {uploadedPhotos.map((p, idx) => (
                <div key={idx} style={{ width: '60px', height: '60px', borderRadius: '8px', border: '1px solid #CBD5E1', position: 'relative', overflow: 'hidden' }}>
                  <img src={p} alt="Proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => setUploadedPhotos(prev => prev.filter((_, i) => i !== idx))}
                    style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: '#FFFFFF', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    ✕
                  </button>
                </div>
              ))}

              <label style={{
                width: '60px',
                height: '60px',
                borderRadius: '8px',
                border: '2px dashed #93C5FD',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#2563EB'
              }}>
                <Camera size={18} />
                <span style={{ fontSize: '9px', fontWeight: '800', marginTop: '2px' }}>+ Add</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* 4. Choose Resolution: Replacement vs Refund */}
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: '800', color: '#334155', marginBottom: '8px', display: 'block' }}>
              How would you like to resolve this? *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div
                onClick={() => setResolutionType('REFUND')}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: resolutionType === 'REFUND' ? '2px solid #2563EB' : '1px solid #CBD5E1',
                  backgroundColor: resolutionType === 'REFUND' ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CreditCard size={16} color="#2563EB" />
                  <strong style={{ fontSize: '13px', color: '#0F172A' }}>Full Refund</strong>
                </div>
                <p style={{ fontSize: '11px', color: '#64748B', margin: '4px 0 0' }}>
                  Money credited back within 24-48 hrs of courier pickup.
                </p>
              </div>

              <div
                onClick={() => setResolutionType('REPLACEMENT')}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: resolutionType === 'REPLACEMENT' ? '2px solid #2563EB' : '1px solid #CBD5E1',
                  backgroundColor: resolutionType === 'REPLACEMENT' ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={16} color="#059669" />
                  <strong style={{ fontSize: '13px', color: '#0F172A' }}>Free Replacement</strong>
                </div>
                <p style={{ fontSize: '11px', color: '#64748B', margin: '4px 0 0' }}>
                  Brand new replacement dispatched to your doorstep.
                </p>
              </div>
            </div>
          </div>

          {/* 5. Pickup Scheduling */}
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: '800', color: '#334155', marginBottom: '6px', display: 'block' }}>
              Doorstep Pickup Time Slot
            </label>
            <select
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                backgroundColor: '#FFFFFF',
                fontWeight: '600'
              }}
            >
              <option value="Tomorrow (10 AM - 2 PM)">Tomorrow Morning (10 AM - 2 PM)</option>
              <option value="Tomorrow (2 PM - 7 PM)">Tomorrow Afternoon (2 PM - 7 PM)</option>
              <option value="Day after Tomorrow (10 AM - 2 PM)">Day after Tomorrow (10 AM - 2 PM)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1, height: '44px', fontSize: '13px', fontWeight: '700' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                flex: 2,
                height: '44px',
                fontSize: '14px',
                fontWeight: '800',
                backgroundColor: '#DC2626',
                borderColor: '#DC2626'
              }}
            >
              {isSubmitting ? 'Processing...' : 'Submit Request →'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
