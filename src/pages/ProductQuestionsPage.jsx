import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Search,
  HelpCircle,
  MessageSquare,
  ThumbsUp,
  ShieldCheck,
  PlusCircle,
  User,
  X,
  CheckCircle2
} from 'lucide-react';

export default function ProductQuestionsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, products = [] } = useApp();

  const allAvailable = products;
  const product = allAvailable.find((p) => String(p.id) === String(id)) || null;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'SELLER' | 'HELPFUL'
  const [helpfulVotes, setHelpfulVotes] = useState({});
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [questionInput, setQuestionInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');

  // Initial rich questions list
  const [questions, setQuestions] = useState([]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 16px', maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Questions Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
          We could not find the requested product Q&A.
        </p>
        <button type="button" onClick={() => navigate('/products')} className="btn btn-primary">
          Explore Products
        </button>
      </div>
    );
  }

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchQuery =
        !searchQuery ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answers.some((a) => a.text.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchQuery) return false;

      if (activeTab === 'SELLER') {
        return q.answers.some((a) => a.isSeller);
      }
      return true;
    });
  }, [questions, searchQuery, activeTab]);

  const handleHelpfulVote = (ansId) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [ansId]: (prev[ansId] || 0) + 1
    }));
    showToast('Marked answer as helpful!', 'success');
  };

  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!questionInput.trim()) {
      showToast('Please type a valid question', 'error');
      return;
    }

    const newQ = {
      id: `q-${Date.now()}`,
      question: questionInput.trim(),
      askedBy: authorInput.trim() || 'Verified Shopper',
      askedDate: 'Just now',
      answers: [
        {
          id: `a-${Date.now()}`,
          text: `Thank you for asking! Your question has been forwarded to ${product.seller?.name || product.brand} and our community. An answer will be posted shortly.`,
          answeredBy: 'Avero Community Bot',
          isSeller: true,
          date: 'Just now',
          helpfulCount: 0
        }
      ]
    };

    setQuestions((prev) => [newQ, ...prev]);
    setIsAskModalOpen(false);
    setQuestionInput('');
    setAuthorInput('');
    showToast('Your question has been posted!', 'success');
  };

  return (
    <div className="container" style={{ maxWidth: '1000px', padding: '16px 16px 80px', margin: '0 auto' }}>
      {/* Header */}
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
              Questions & Answers
            </h1>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Have questions about {product.title}?
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAskModalOpen(true)}
          className="btn btn-primary"
          style={{ minHeight: '40px', padding: '8px 16px', fontSize: '13px' }}
        >
          <PlusCircle size={16} /> Ask Question
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <Search
          size={18}
          color="var(--text-secondary)"
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Have a question? Search for answers on warranty, features, compatibility..."
          style={{
            width: '100%',
            padding: '12px 16px 12px 42px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: '#ffffff',
            fontSize: '14px',
            boxShadow: 'var(--shadow-xs)'
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '12px',
              color: 'var(--primary-600)',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { id: 'ALL', label: `All Questions (${questions.length})` },
          { id: 'SELLER', label: 'Verified Seller Answered' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`pdp-pill-btn ${activeTab === tab.id ? 'active' : ''}`}
            style={{ minHeight: '38px', padding: '6px 16px', fontSize: '13px' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              {/* Question Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span
                  style={{
                    backgroundColor: 'var(--primary-50)',
                    color: 'var(--primary-600)',
                    fontWeight: '800',
                    fontSize: '12px',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-xs)',
                    marginTop: '2px'
                  }}
                >
                  Q
                </span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px', lineHeight: '1.4' }}>
                    {q.question}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Asked by <strong>{q.askedBy}</strong> • {q.askedDate}
                  </div>
                </div>
              </div>

              {/* Answers Container */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '32px', borderLeft: '2px solid var(--primary-100)', marginLeft: '12px' }}>
                {q.answers.map((ans) => {
                  const currentHelpful = (ans.helpfulCount || 0) + (helpfulVotes[ans.id] || 0);

                  return (
                    <div key={ans.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            backgroundColor: ans.isSeller ? 'var(--savings-green-bg)' : '#F1F5F9',
                            color: ans.isSeller ? 'var(--savings-green)' : 'var(--text-secondary)',
                            fontWeight: '800',
                            fontSize: '11px',
                            padding: '2px 6px',
                            borderRadius: 'var(--radius-xs)'
                          }}
                        >
                          A
                        </span>

                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {ans.answeredBy}
                        </span>

                        {ans.isSeller && (
                          <span className="badge-assured" style={{ fontSize: '10px', padding: '2px 6px' }}>
                            <ShieldCheck size={11} /> Official Seller
                          </span>
                        )}

                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          • {ans.date}
                        </span>
                      </div>

                      <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5', margin: 0 }}>
                        {ans.text}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
                        <button
                          type="button"
                          onClick={() => handleHelpfulVote(ans.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'var(--text-secondary)',
                            fontSize: '11px',
                            cursor: 'pointer',
                            padding: '2px 6px',
                            borderRadius: 'var(--radius-xs)',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: '#F8FAFC'
                          }}
                        >
                          <ThumbsUp size={12} />
                          <span>Helpful ({currentHelpful})</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            No questions found matching your search. Be the first to ask!
          </div>
        )}
      </div>

      {/* Ask Question Modal */}
      {isAskModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAskModalOpen(false)}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '500px',
              width: '100%',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                Ask a Question
              </h3>
              <button
                type="button"
                onClick={() => setIsAskModalOpen(false)}
                style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAskQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                  What would you like to know about {product.title}?
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Does this support dual SIM? Is there an official warranty covered in Mumbai?"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
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
                  placeholder="e.g. Priya"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
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
                  onClick={() => setIsAskModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
