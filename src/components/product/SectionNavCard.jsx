import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function SectionNavCard({
  to,
  icon: Icon,
  title,
  subtitle,
  badge,
  badgeType = 'default', // 'default' | 'rating' | 'count' | 'verified'
  children,
  onClick
}) {
  const content = (
    <div className="section-nav-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        {Icon && (
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Icon size={20} />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {title}
            </span>
            {badge && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor:
                    badgeType === 'rating'
                      ? 'var(--rating-green)'
                      : badgeType === 'verified'
                      ? 'var(--savings-green-bg)'
                      : 'var(--bg-subtle)',
                  color:
                    badgeType === 'rating'
                      ? '#ffffff'
                      : badgeType === 'verified'
                      ? 'var(--savings-green)'
                      : 'var(--text-secondary)'
                }}
              >
                {badge}
              </span>
            )}
          </div>

          {subtitle && (
            <span
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {subtitle}
            </span>
          )}

          {children}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-600)', flexShrink: 0, paddingLeft: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600' }}>View</span>
        <ChevronRight size={18} />
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none', display: 'block' }}>
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      {content}
    </div>
  );
}
