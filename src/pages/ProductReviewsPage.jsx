import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Star,
  ThumbsUp,
  CheckCircle,
  Filter,
  ArrowUpDown,
  PlusCircle,
  Image as ImageIcon,
  CheckCircle2,
  X
} from 'lucide-react';

export default function ProductReviewsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, products = [] } = useApp();

  const allAvailable = products;
  const product = allAvailable.find((p) => String(p.id) === String(id)) || null;

  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | '5' | '4' | '3' | '2' | '1' | 'PHOTOS' | 'VERIFIED'
  const [activeSort, setActiveSort] = useState('HELPFUL'); // 'HELPFUL' | 'RECENT' | 'RATING_HIGH' | 'RATING_LOW'
  const [helpfulCounts, setHelpfulCounts] = useState({});
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // New Review Form State
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    author: ''
  });

  const [localReviews, setLocalReviews] = useState(
    product?.reviews && product.reviews.length > 0 ? product.reviews : []
  );

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 16px', maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Product Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
          We could not find the requested product reviews.
        </p>
        <button type="button" onClick={() => navigate('/products')} className="btn btn-primary">
          Explore Products
        </button>
      </div>
    );
  }

  const ratingsDistribution = product.ratingsBreakdown || {
    5: Math.round((product.ratingsCount || 12000) * 0.72),
    4: Math.round((product.ratingsCount || 12000) * 0.18),
    3: Math.round((product.ratingsCount || 12000) * 0.06),
    2: Math.round((product.ratingsCount || 12000) * 0.02),
    1: Math.round((product.ratingsCount || 12000) * 0.02)
  };

  // Collect all customer review photos
  const allReviewPhotos = useMemo(() => {
    const photos = [];
    localReviews.forEach((rev) => {
      if (rev.images && rev.images.length > 0) {
        rev.images.forEach((img) => photos.push({ img, author: rev.author, rating: rev.rating }));
      }
    });
    return photos;
  }, [localReviews]);

  // Filter & Sort reviews
  const filteredReviews = useMemo(() => {
    return localReviews
      .filter((rev) => {
        if (activeFilter === 'ALL') return true;
        if (activeFilter === 'PHOTOS') return rev.images && rev.images.length > 0;
        if (activeFilter === 'VERIFIED') return rev.verified;
        return rev.rating === parseInt(activeFilter, 10);
      })
      .sort((a, b) => {
        const aHelpful = (a.helpfulCount || 0) + (helpfulCounts[a.id] || 0);
        const bHelpful = (b.helpfulCount || 0) + (helpfulCounts[b.id] || 0);

        if (activeSort === 'HELPFUL') return bHelpful - aHelpful;
        if (activeSort === 'RATING_HIGH') return b.rating - a.rating;
        if (activeSort === 'RATING_LOW') return a.rating - b.rating;
        return 0; // Default order / recent
      });
  }, [localReviews, activeFilter, activeSort, helpfulCounts]);

  const handleHelpful = (revId) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [revId]: (prev[revId] || 0) + 1
    }));
    showToast('Thank you for your feedback!', 'success');
  };

  const handleCreateReview = (e) => {
    e.preventDefault();
    if (!newReview.title || !newReview.comment) {
      showToast('Please provide a title and review description', 'error');
      return;
    }

    const created = {
      id: `rev-${Date.now()}`,
      author: newReview.author || 'Verified Shopper',
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      date: 'Just now',
      verified: true,
      helpfulCount: 0
    };

    setLocalReviews((prev) => [created, ...prev]);
    setIsWriteModalOpen(false);
    setNewReview({ rating: 5, title: '', comment: '', author: '' });
    showToast('Your review was posted successfully!', 'success');
  };

  return (
    <div className="container" style={{ maxWidth: '1000px', padding: '16px 16px 80px', margin: '0 auto' }}>
      {/* Top Header with Back Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate(`/product/${product.id}`)}
            className="pdp-floating-btn"
            aria-label="Back to product"
            style={{ width: '38px', height: '38px' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              Ratings & Reviews
            </h1>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              For {product.title}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsWriteModalOpen(true)}
          className="btn btn-primary"
          style={{ minHeight: '40px', padding: '8px 16px', fontSize: '13px' }}
        >
          <PlusCircle size={16} /> Write a Review
        </button>
      </div>

      {/* Main Breakdown & Score Card */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '20px'
        }}
      >
        {/* Left Rating Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderRight: '1px solid var(--border-divider)', paddingRight: '16px' }}>
          <div style={{ fontSize: '48px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: '1', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {product.rating} <Star size={34} fill="#388E3C" color="#388E3C" />
          </div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '8px' }}>
            Overall Customer Rating
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Based on {(product.ratingsCount || 12000).toLocaleString('en-IN')} ratings & {(product.reviewsCount || 3000).toLocaleString('en-IN')} verified reviews
          </div>
        </div>

        {/* Right 5-Star Distribution Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingsDistribution[stars] || 0;
            const percentage = Math.round((count / (product.ratingsCount || 12000)) * 100) || 0;

            return (
              <button
                key={stars}
                type="button"
                onClick={() => setActiveFilter(String(stars))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  padding: '2px 0'
                }}
              >
                <span style={{ width: '32px', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {stars} <Star size={11} fill="#64748B" color="#64748B" />
                </span>

                <div style={{ flex: 1, height: '8px', backgroundColor: '#E2E8F0', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor:
                        stars >= 4
                          ? 'var(--rating-green)'
                          : stars === 3
                          ? 'var(--rating-orange)'
                          : 'var(--rating-red)',
                      borderRadius: 'var(--radius-full)'
                    }}
                  />
                </div>

                <span style={{ width: '65px', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  {count.toLocaleString('en-IN')} ({percentage}%)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Customer Photos Gallery Strip */}
      {allReviewPhotos.length > 0 && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            padding: '16px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ImageIcon size={16} color="var(--primary-600)" /> Photos by Customers ({allReviewPhotos.length})
            </div>
            <button
              type="button"
              onClick={() => setActiveFilter('PHOTOS')}
              style={{ fontSize: '12px', color: 'var(--primary-600)', fontWeight: '600' }}
            >
              View Photo Reviews
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
            {allReviewPhotos.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPhoto(item.img)}
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                  flexShrink: 0,
                  cursor: 'pointer'
                }}
              >
                <img src={item.img} alt="Customer upload" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Sorting Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px'
        }}
      >
        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }} className="no-scrollbar">
          {[
            { id: 'ALL', label: 'All Reviews' },
            { id: 'PHOTOS', label: 'With Photos' },
            { id: 'VERIFIED', label: 'Verified Buyers' },
            { id: '5', label: '5 ★' },
            { id: '4', label: '4 ★' },
            { id: '3', label: '3 ★' },
            { id: '2', label: '2 ★' },
            { id: '1', label: '1 ★' }
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`pdp-pill-btn ${activeFilter === f.id ? 'active' : ''}`}
              style={{ minHeight: '36px', padding: '6px 14px', fontSize: '12px' }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowUpDown size={15} color="var(--text-secondary)" />
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              fontWeight: '600',
              backgroundColor: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <option value="HELPFUL">Most Helpful</option>
            <option value="RECENT">Most Recent</option>
            <option value="RATING_HIGH">Highest Rating First</option>
            <option value="RATING_LOW">Lowest Rating First</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredReviews.length > 0 ? (
          filteredReviews.map((rev) => {
            const upvotes = (rev.helpfulCount || 0) + (helpfulCounts[rev.id] || 0);

            return (
              <div
                key={rev.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                {/* Rating & Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    className="badge-rating"
                    style={{
                      fontSize: '12px',
                      padding: '3px 8px',
                      backgroundColor: rev.rating >= 4 ? 'var(--rating-green)' : rev.rating === 3 ? 'var(--rating-orange)' : 'var(--rating-red)'
                    }}
                  >
                    {rev.rating} <Star size={11} fill="#ffffff" />
                  </span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                    {rev.title}
                  </strong>
                </div>

                {/* Comment Body */}
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.55', margin: 0 }}>
                  {rev.comment}
                </p>

                {/* Review Photos */}
                {rev.images && rev.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    {rev.images.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedPhoto(img)}
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: 'var(--radius-xs)',
                          border: '1px solid var(--border-subtle)',
                          overflow: 'hidden',
                          cursor: 'pointer'
                        }}
                      >
                        <img src={img} alt="Customer photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Author & Helpful Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--border-divider)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{rev.author}</span>
                    {rev.verified && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--savings-green)', fontWeight: '600' }}>
                        <CheckCircle2 size={13} /> Certified Buyer
                      </span>
                    )}
                    <span>• {rev.date}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleHelpful(rev.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: '#F8FAFC'
                    }}
                  >
                    <ThumbsUp size={13} />
                    <span>Helpful ({upvotes})</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              padding: '36px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            No reviews match the selected filter criteria.
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      {isWriteModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsWriteModalOpen(false)}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                Write a Product Review
              </h3>
              <button
                type="button"
                onClick={() => setIsWriteModalOpen(false)}
                style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateReview} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                  Rate this Product:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview((prev) => ({ ...prev, rating: star }))}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: newReview.rating >= star ? '1.5px solid var(--savings-green)' : '1px solid var(--border-subtle)',
                        backgroundColor: newReview.rating >= star ? 'var(--savings-green-bg)' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '13px',
                        fontWeight: '700'
                      }}
                    >
                      {star} <Star size={13} fill={newReview.rating >= star ? '#388E3C' : 'none'} color="#388E3C" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                  Review Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Incredible performance and battery!"
                  value={newReview.title}
                  onChange={(e) => setNewReview((prev) => ({ ...prev, title: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                  Detailed Experience:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details about quality, features, delivery, or advice for other buyers..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                  Your Name (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={newReview.author}
                  onChange={(e) => setNewReview((prev) => ({ ...prev, author: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div className="modal-backdrop" onClick={() => setSelectedPhoto(null)}>
          <div
            style={{
              position: 'relative',
              maxWidth: '600px',
              width: '90%',
              backgroundColor: '#000000',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              padding: '12px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: 'rgba(255,255,255,0.3)',
                color: '#fff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
            <img
              src={selectedPhoto}
              alt="Full Preview"
              style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', display: 'block' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
