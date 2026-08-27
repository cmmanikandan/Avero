import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../../data/categories';
import {
  Smartphone,
  Laptop,
  Headphones,
  Shirt,
  Footprints,
  Tv,
  Watch,
  Sparkles,
  Home,
  ShoppingBag,
  Grid
} from 'lucide-react';

const ICON_MAP = {
  Smartphone,
  Laptop,
  Headphones,
  Shirt,
  Footprints,
  Tv,
  Watch,
  Sparkles,
  Home,
  ShoppingBag
};

export default function CategoryBar() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get('category');

  // Custom ordered list: For You, Fashion, Mobiles, Electronics, Beauty, Home, Footwear, Audio, Appliances, Grocery
  const orderedCategories = [
    { id: 'all', name: 'For You', icon: 'Sparkles', path: '/' },
    ...CATEGORIES.map(c => ({ ...c, path: `/products?category=${c.id}` }))
  ];

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-xs)',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        width: '100%'
      }}
      className="category-bar-wrapper"
    >
      <div className="container" style={{ padding: '0 8px' }}>
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            overflowX: 'auto',
            padding: '8px 4px',
            whiteSpace: 'nowrap',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {orderedCategories.map(cat => {
            const isForYou = cat.id === 'all';
            const isSelected = isForYou
              ? location.pathname === '/' && !activeCategory
              : activeCategory === cat.id;

            const IconComponent = isForYou ? Sparkles : ICON_MAP[cat.icon] || ShoppingBag;

            return (
              <Link
                key={cat.id}
                to={cat.path}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                  color: isSelected ? 'var(--primary-600)' : 'var(--text-primary)',
                  minWidth: '56px',
                  flexShrink: 0,
                  transition: 'transform 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isSelected ? 'var(--primary-100)' : '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? 'var(--primary-600)' : '#475569',
                    border: isSelected ? '1.5px solid var(--primary-600)' : '1px solid transparent',
                    boxShadow: isSelected ? '0 2px 8px rgba(19, 102, 226, 0.18)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <IconComponent size={18} strokeWidth={isSelected ? 2.5 : 1.8} />
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: isSelected ? '800' : '600',
                    textAlign: 'center',
                    maxWidth: '72px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: '1.2'
                  }}
                >
                  {cat.id === 'all' ? 'For You' : cat.name.split(' ')[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
