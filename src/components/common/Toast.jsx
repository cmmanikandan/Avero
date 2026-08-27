import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useApp();
  const navigate = useNavigate();

  if (!toasts.length) return null;

  return (
    <>
      <div className="global-toast-container">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          const accentColor = isSuccess
            ? '#10B981'
            : isError
            ? '#EF4444'
            : isWarning
            ? '#F59E0B'
            : '#3B82F6';

          const accentBg = isSuccess
            ? 'rgba(16, 185, 129, 0.15)'
            : isError
            ? 'rgba(239, 68, 68, 0.15)'
            : isWarning
            ? 'rgba(245, 158, 11, 0.15)'
            : 'rgba(59, 130, 246, 0.15)';

          const handleActionClick = () => {
            if (toast.action?.href) {
              navigate(toast.action.href);
            } else if (toast.action?.onClick) {
              toast.action.onClick();
            }
            removeToast(toast.id);
          };

          return (
            <div
              key={toast.id}
              className="global-toast-item"
              style={{
                borderLeft: `4px solid ${accentColor}`
              }}
            >
              {/* Product Thumbnail (If provided in metadata) */}
              {toast.meta?.image ? (
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    padding: '2px',
                    flexShrink: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <img
                    src={toast.meta.image}
                    alt={toast.message}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: accentBg,
                    color: accentColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isSuccess && <CheckCircle2 size={18} />}
                  {isError && <AlertCircle size={18} />}
                  {isWarning && <AlertTriangle size={18} />}
                  {!isSuccess && !isError && !isWarning && <Info size={18} />}
                </div>
              )}

              {/* Message Content */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {toast.meta?.title && (
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      color: accentColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {toast.meta.title}
                  </div>
                )}
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    lineHeight: '1.35',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {toast.message}
                </div>
                {toast.meta?.price && (
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#38BDF8' }}>
                    ₹{toast.meta.price.toLocaleString('en-IN')}
                  </div>
                )}
              </div>

              {/* Interactive Action Button (e.g. View Cart →) */}
              {toast.action && (
                <button
                  type="button"
                  onClick={handleActionClick}
                  style={{
                    backgroundColor: 'var(--primary-600)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(19, 102, 226, 0.4)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-700)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-600)')}
                >
                  <span>{toast.action.label || 'Action'}</span>
                </button>
              )}

              {/* Dismiss ✕ Button */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
                style={{
                  color: '#94A3B8',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-xs)',
                  flexShrink: 0,
                  transition: 'color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
              >
                <X size={16} />
              </button>

              {/* Auto Dismiss Animated Progress Bar (1-3s range: 2000ms default) */}
              <div
                className="toast-progress-bar"
                style={{
                  backgroundColor: accentColor,
                  animationDuration: `${toast.duration || 2000}ms`
                }}
              />
            </div>
          );
        })}
      </div>

      <style>{`
        .global-toast-container {
          position: fixed;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          gap: 12px;
          pointer-events: none;
        }

        .global-toast-item {
          pointer-events: auto;
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px 14px;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: #FFFFFF;
          border-radius: 12px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1);
          overflow: hidden;
          animation: toastSlideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .toast-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          width: 100%;
          transform-origin: left;
          animation: toastProgress linear forwards;
        }

        @keyframes toastProgress {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }

        @keyframes toastSlideDown {
          from {
            opacity: 0;
            transform: translateY(-12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (min-width: 768px) {
          .global-toast-container {
            top: 76px;
            right: 24px;
            max-width: 420px;
            width: auto;
          }
        }

        @media (max-width: 767px) {
          .global-toast-container {
            bottom: calc(var(--bottom-nav-height) + 16px);
            left: 12px;
            right: 12px;
            max-width: none;
            width: auto;
          }

          .global-toast-item {
            animation: toastSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes toastSlideUp {
            from {
              opacity: 0;
              transform: translateY(16px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        }
      `}</style>
    </>
  );
}
