import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HelpCircle, ThumbsUp, MessageSquare, Send, CheckCircle2, Search, User, ShieldCheck } from 'lucide-react';

const DEFAULT_QNAS = [
  {
    id: 'QNA-1',
    question: 'Does this model support 5G dual SIM connectivity in India with Jio and Airtel?',
    answer: 'Yes! It supports all 14 Indian 5G sub-6GHz bands on both SIM 1 and SIM 2 simultaneously with VoNR support.',
    author: 'Avero Electronics (Verified Seller)',
    answeredBySeller: true,
    upvotes: 42,
    date: '3 days ago'
  },
  {
    id: 'QNA-2',
    question: 'What is inside the retail box? Is the fast charger adapter included?',
    answer: 'The package contains the smartphone, 65W SuperVOOC power adapter, Type-C to Type-C braided cable, SIM ejector tool, and quick start guide.',
    author: 'Karthik N (Verified Buyer)',
    answeredBySeller: false,
    upvotes: 28,
    date: '1 week ago'
  },
  {
    id: 'QNA-3',
    question: 'How long does the battery last on heavy gaming and video streaming?',
    answer: 'I easily get 8+ hours of screen-on time with mixed BGMI gaming, YouTube 4K playback, and social media on 120Hz refresh rate.',
    author: 'Vikram S (Verified Buyer)',
    answeredBySeller: false,
    upvotes: 19,
    date: '2 weeks ago'
  }
];

export default function ProductQnASection({ product }) {
  const { user, showToast } = useApp();

  const [qnaList, setQnaList] = useState(DEFAULT_QNAS);
  const [searchFilter, setSearchFilter] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [upvotedIds, setUpvotedIds] = useState(new Set());

  const handleUpvote = (id) => {
    if (upvotedIds.has(id)) {
      showToast('You have already upvoted this answer', 'info');
      return;
    }

    setUpvotedIds(prev => new Set(prev).add(id));
    setQnaList(prev => prev.map(q => q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q));
    showToast('Upvote recorded! Thank you for your feedback.', 'success');
  };

  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const newQ = {
      id: `QNA-${Date.now()}`,
      question: newQuestion.trim(),
      answer: 'Your question has been sent to the verified seller and community buyers. Answers will appear here shortly.',
      author: user?.name || 'Customer Question',
      answeredBySeller: false,
      upvotes: 1,
      date: 'Just now'
    };

    setQnaList(prev => [newQ, ...prev]);
    setNewQuestion('');
    showToast('Your question has been posted to the community!', 'success');
  };

  const filteredQuestions = qnaList.filter(q => {
    if (!searchFilter.trim()) return true;
    const query = searchFilter.toLowerCase();
    return q.question.toLowerCase().includes(query) || q.answer.toLowerCase().includes(query);
  });

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      padding: '24px',
      marginTop: '20px',
      boxShadow: 'var(--shadow-xs)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={20} color="var(--primary-600)" />
          <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
            Questions & Answers ({qnaList.length})
          </h2>
        </div>

        {/* Quick Search Questions */}
        <div style={{
          position: 'relative',
          width: '240px'
        }}>
          <Search size={14} color="#64748B" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search answers..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 10px 7px 30px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid #CBD5E1',
              fontSize: '12px',
              outline: 'none',
              backgroundColor: '#F8FAFC'
            }}
          />
        </div>
      </div>

      {/* Ask a Question Input Box */}
      <form onSubmit={handleAskQuestion} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          required
          placeholder="Have a question? Ask verified sellers and buyers..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1.5px solid #CBD5E1',
            fontSize: '13px',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ height: '42px', padding: '0 20px', fontSize: '13px', fontWeight: '800', gap: '6px' }}
        >
          <Send size={14} /> Ask
        </button>
      </form>

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredQuestions.map((qna) => (
          <div
            key={qna.id}
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '14px 16px'
            }}
          >
            {/* Question */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--primary-600)' }}>Q:</span>
              <strong style={{ fontSize: '14px', color: '#0F172A', lineHeight: '1.4' }}>
                {qna.question}
              </strong>
            </div>

            {/* Answer */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '900', color: '#059669' }}>A:</span>
              <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>
                {qna.answer}
              </div>
            </div>

            {/* Author info & Upvote */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '10px',
              paddingTop: '8px',
              borderTop: '1px solid #E2E8F0',
              fontSize: '11px',
              color: '#64748B'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {qna.answeredBySeller ? (
                  <span style={{ color: '#1D4ED8', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <ShieldCheck size={12} /> {qna.author}
                  </span>
                ) : (
                  <span>{qna.author}</span>
                )}
                <span>• {qna.date}</span>
              </div>

              <button
                type="button"
                onClick={() => handleUpvote(qna.id)}
                style={{
                  background: 'none',
                  border: '1px solid #CBD5E1',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: upvotedIds.has(qna.id) ? '#2563EB' : '#475569',
                  backgroundColor: upvotedIds.has(qna.id) ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <ThumbsUp size={11} /> Helpful ({qna.upvotes})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
