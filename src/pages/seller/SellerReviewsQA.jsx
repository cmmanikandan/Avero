import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Star, Reply, Send, CheckCircle2, HelpCircle } from 'lucide-react';

export default function SellerReviewsQA() {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState('REVIEWS'); // 'REVIEWS' | 'QUESTIONS'

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('avero_seller_reviews');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  const [questions, setQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem('avero_seller_questions');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  const [replyInput, setReplyInput] = useState({});
  const [answerInput, setAnswerInput] = useState({});

  const toggleReply = (reviewId) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isReplying: !r.isReplying } : r));
  };

  const handleSendReply = (reviewId) => {
    const text = replyInput[reviewId];
    if (!text || !text.trim()) return;

    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, replyText: text, isReplying: false } : r));
    setReplyInput(prev => ({ ...prev, [reviewId]: '' }));
    showToast('Official vendor reply posted!', 'success');
  };

  const handleSendAnswer = (qId) => {
    const text = answerInput[qId];
    if (!text || !text.trim()) return;

    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, answer: text, isAnswering: false } : q));
    setAnswerInput(prev => ({ ...prev, [qId]: '' }));
    showToast('Question answered and published on Product Page!', 'success');
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '16px 20px',
        marginBottom: '16px'
      }}>
        <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
          Customer Reviews & Product Inquiries
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Engage directly with buyers, answer pre-purchase questions, and manage merchant feedback
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('REVIEWS')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: activeTab === 'REVIEWS' ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
            backgroundColor: activeTab === 'REVIEWS' ? 'var(--primary-50)' : '#ffffff',
            color: activeTab === 'REVIEWS' ? 'var(--primary-600)' : 'var(--text-primary)',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          Product Reviews ({reviews.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('QUESTIONS')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: activeTab === 'QUESTIONS' ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
            backgroundColor: activeTab === 'QUESTIONS' ? 'var(--primary-50)' : '#ffffff',
            color: activeTab === 'QUESTIONS' ? 'var(--primary-600)' : 'var(--text-primary)',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          Buyer Questions & Q&A ({questions.length})
        </button>
      </div>

      {/* Reviews List */}
      {activeTab === 'REVIEWS' && (
        reviews.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '48px 20px', textAlign: 'center', color: '#64748B' }}>
            <MessageSquare size={40} color="#94A3B8" style={{ marginBottom: '10px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px' }}>No Product Reviews Yet</h3>
            <p style={{ fontSize: '13px', margin: 0, color: '#64748B' }}>When buyers post ratings & reviews for your items, they will appear here for responses.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {reviews.map(rev => (
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-700)' }}>
                    {rev.productName}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{rev.date}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="badge-rating" style={{ fontSize: '11px' }}>
                    {rev.rating} <Star size={10} fill="#ffffff" />
                  </span>
                  <strong style={{ fontSize: '13px' }}>{rev.author}</strong>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                  "{rev.comment}"
                </p>

                {/* Vendor Reply */}
                {rev.replyText ? (
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    borderLeft: '3px solid var(--primary-600)',
                    padding: '10px 14px',
                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                    marginTop: '4px'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> Response from Seller (Official Store):
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-primary)', marginTop: '2px', lineHeight: '1.4' }}>
                      {rev.replyText}
                    </p>
                  </div>
                ) : (
                  <div style={{ marginTop: '6px' }}>
                    {!rev.isReplying ? (
                      <button
                        type="button"
                        onClick={() => toggleReply(rev.id)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px', minHeight: '32px', gap: '4px' }}
                      >
                        <Reply size={13} /> Reply to Customer
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="Type official store response..."
                          value={replyInput[rev.id] || ''}
                          onChange={(e) => setReplyInput({ ...replyInput, [rev.id]: e.target.value })}
                          style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSendReply(rev.id)}
                          className="btn btn-primary"
                          style={{ padding: '6px 14px', fontSize: '12px', minHeight: '34px', gap: '4px' }}
                        >
                          <Send size={13} /> Post
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Questions List */}
      {activeTab === 'QUESTIONS' && (
        questions.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '48px 20px', textAlign: 'center', color: '#64748B' }}>
            <HelpCircle size={40} color="#94A3B8" style={{ marginBottom: '10px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px' }}>No Buyer Inquiries</h3>
            <p style={{ fontSize: '13px', margin: 0, color: '#64748B' }}>When prospective buyers ask questions about your catalog, they will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {questions.map(q => (
              <div
                key={q.id}
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-700)' }}>
                    {q.productName}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Asked {q.date}</span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Q: {q.question}
                </div>

                {q.answer ? (
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    borderLeft: '3px solid var(--savings-green)',
                    padding: '10px 14px',
                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--savings-green)' }}>
                      Answered by Verified Vendor:
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-primary)', marginTop: '2px', lineHeight: '1.4' }}>
                      {q.answer}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <input
                      type="text"
                      placeholder="Type official verified answer for buyer..."
                      value={answerInput[q.id] || ''}
                      onChange={(e) => setAnswerInput({ ...answerInput, [q.id]: e.target.value })}
                      style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleSendAnswer(q.id)}
                      className="btn btn-primary"
                      style={{ padding: '6px 14px', fontSize: '12px', minHeight: '34px', gap: '4px' }}
                    >
                      <Send size={13} /> Post Answer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
