import React, { useState } from 'react';
import { Star, ThumbsUp, CheckCircle, ShieldCheck, Image as ImageIcon } from 'lucide-react';

export default function ReviewSection({ rating = 4.5, ratingsCount = 12000, reviewsCount = 3000, breakdown, reviews = [] }) {
  const [helpfulCounts, setHelpfulCounts] = useState({});

  const ratingsDistribution = breakdown || {
    5: Math.round(ratingsCount * 0.72),
    4: Math.round(ratingsCount * 0.18),
    3: Math.round(ratingsCount * 0.06),
    2: Math.round(ratingsCount * 0.02),
    1: Math.round(ratingsCount * 0.02)
  };

  const handleHelpful = (reviewId) => {
    setHelpfulCounts(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Rating Summary Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        padding: '20px',
        backgroundColor: '#F8FAFC',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Left Big Score */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '42px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {rating} <Star size={32} fill="#388E3C" color="#388E3C" />
          </div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '8px' }}>
            Verified Ratings
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {ratingsCount.toLocaleString('en-IN')} Ratings & {reviewsCount.toLocaleString('en-IN')} Reviews
          </div>
        </div>

        {/* Right 5-Star Distribution Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
          {[5, 4, 3, 2, 1].map(stars => {
            const count = ratingsDistribution[stars] || 0;
            const percentage = Math.round((count / ratingsCount) * 100) || 0;

            return (
              <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <span style={{ width: '28px', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  {stars} <Star size={11} fill="#64748B" color="#64748B" />
                </span>

                <div style={{
                  flex: 1,
                  height: '6px',
                  backgroundColor: '#E2E8F0',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: stars >= 4 ? 'var(--rating-green)' : stars === 3 ? 'var(--rating-orange)' : 'var(--rating-red)',
                    borderRadius: 'var(--radius-full)'
                  }} />
                </div>

                <span style={{ width: '35px', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: '500' }}>
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
          Customer Reviews ({reviews.length})
        </h4>

        {reviews.length > 0 ? (
          reviews.map(rev => {
            const upvotes = (rev.helpfulCount || 0) + (helpfulCounts[rev.id] || 0);

            return (
              <div
                key={rev.id}
                style={{
                  borderBottom: '1px solid var(--border-divider)',
                  paddingBottom: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge-rating" style={{ fontSize: '11px' }}>
                    {rev.rating} <Star size={10} fill="#ffffff" />
                  </span>
                  <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                    {rev.title}
                  </strong>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  {rev.comment}
                </p>

                {/* Review Images if any */}
                {rev.images && rev.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    {rev.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Customer Photo"
                        style={{
                          width: '56px',
                          height: '56px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-xs)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Author & Verification */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{rev.author}</span>
                    {rev.verified && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--savings-green)', fontWeight: '600' }}>
                        <CheckCircle size={12} /> Certified Buyer
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
                      gap: '4px',
                      color: 'var(--text-secondary)',
                      fontSize: '11px',
                      cursor: 'pointer'
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
          <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--text-secondary)' }}>
            No textual reviews yet. Be the first to share your experience!
          </div>
        )}
      </div>
    </div>
  );
}
