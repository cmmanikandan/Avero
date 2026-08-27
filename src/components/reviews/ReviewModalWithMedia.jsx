import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Camera, Video, Upload, X, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ReviewModalWithMedia({ product, isOpen, onClose, onSubmitReview }) {
  const { user, showToast } = useApp();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [headline, setHeadline] = useState('');
  const [comment, setComment] = useState('');
  const [mediaList, setMediaList] = useState([]);

  if (!isOpen || !product) return null;

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + mediaList.length > 5) {
      showToast('Maximum 5 photos or videos allowed', 'warning');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaList(prev => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            url: event.target?.result,
            type: file.type.startsWith('video') ? 'video' : 'image'
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
    showToast('Unboxing media attached!', 'info');
  };

  const handleRemoveMedia = (id) => {
    setMediaList(prev => prev.filter(m => m.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please enter review feedback', 'error');
      return;
    }

    const reviewObj = {
      id: `REV-${Date.now()}`,
      author: user?.name || 'Verified Buyer',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating,
      date: 'Today',
      verified: true,
      headline: headline.trim() || 'Outstanding genuine product!',
      comment: comment.trim(),
      images: mediaList.filter(m => m.type === 'image').map(m => m.url),
      videos: mediaList.filter(m => m.type === 'video').map(m => m.url),
      helpfulCount: 0
    };

    if (onSubmitReview) {
      onSubmitReview(reviewObj);
    }
    showToast('Review and unboxing media submitted successfully!', 'success');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        style={{
          maxWidth: '520px',
          width: '90%',
          margin: 'auto',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 20px 48px rgba(0,0,0,0.18)',
          border: '1px solid #E2E8F0',
          color: '#0F172A',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={20} color="#2563EB" />
            <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: '#0F172A' }}>
              Write a Review & Add Unboxing Media
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Product preview */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '10px',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          border: '1px solid #E2E8F0',
          marginBottom: '16px'
        }}>
          <img src={product.thumbnail} alt={product.title} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.title}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Star Rating Selector */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
              Overall Rating *
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    color: star <= (hoverRating || rating) ? '#F59E0B' : '#CBD5E1',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <Star size={28} fill={star <= (hoverRating || rating) ? '#F59E0B' : 'none'} />
                </button>
              ))}
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', alignSelf: 'center', marginLeft: '6px' }}>
                {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : 'Needs Improvement'}
              </span>
            </div>
          </div>

          {/* Headline */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
              Headline / Summary
            </label>
            <input
              type="text"
              placeholder="e.g. Best performance in this price segment!"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '13px' }}
            />
          </div>

          {/* Comment */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
              Detailed Experience *
            </label>
            <textarea
              required
              rows={3}
              placeholder="What did you like or dislike? How is the battery, camera, and build quality?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '13px', resize: 'vertical' }}
            />
          </div>

          {/* Unboxing Photos & Videos Upload */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>
                Attach Customer Photos / Unboxing Clips (Max 5)
              </label>
              <span style={{ fontSize: '11px', color: '#64748B' }}>{mediaList.length}/5 Attached</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {mediaList.map((m) => (
                <div
                  key={m.id}
                  style={{
                    position: 'relative',
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#000000'
                  }}
                >
                  {m.type === 'video' ? (
                    <video src={m.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <img src={m.url} alt="Review" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(m.id)}
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      backgroundColor: 'rgba(0, 0, 0, 0.75)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0
                    }}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}

              {mediaList.length < 5 && (
                <label style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '8px',
                  border: '1.5px dashed #94A3B8',
                  backgroundColor: '#F8FAFC',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  gap: '2px',
                  color: '#64748B'
                }}>
                  <Camera size={18} color="#2563EB" />
                  <span style={{ fontSize: '9px', fontWeight: '700' }}>+ Add Media</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMediaUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1, height: '42px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 2, height: '42px', fontSize: '13px', fontWeight: '800', gap: '6px' }}
            >
              <CheckCircle2 size={16} /> Submit Verified Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
