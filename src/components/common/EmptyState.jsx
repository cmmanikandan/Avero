import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, PackageX, Search, MapPin, BellOff } from 'lucide-react';

export default function EmptyState({
  type = 'cart',
  title,
  description,
  buttonText = 'Explore Products',
  actionPath = '/products',
  onAction
}) {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (type) {
      case 'cart':
        return <ShoppingBag size={48} color="var(--primary-600)" />;
      case 'wishlist':
        return <Heart size={48} color="#EF4444" />;
      case 'orders':
        return <PackageX size={48} color="var(--text-secondary)" />;
      case 'search':
        return <Search size={48} color="var(--primary-600)" />;
      case 'address':
        return <MapPin size={48} color="var(--primary-600)" />;
      default:
        return <BellOff size={48} color="var(--text-secondary)" />;
    }
  };

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionPath) {
      navigate(actionPath);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '48px 20px',
      backgroundColor: '#ffffff',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)',
      maxWidth: '480px',
      margin: '24px auto'
    }}>
      <div style={{
        width: '88px',
        height: '88px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--primary-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px'
      }}>
        {getIcon()}
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
        {title || (type === 'cart' ? 'Your Cart is empty!' : type === 'wishlist' ? 'Your Wishlist is empty!' : 'No items found')}
      </h3>

      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '320px', lineHeight: '1.5', marginBottom: '20px' }}>
        {description || (type === 'cart' ? 'Explore our massive marketplace selection and add items you like.' : 'Save your favorite items here to track prices and buy anytime.')}
      </p>

      {buttonText && (
        <button
          onClick={handleAction}
          className="btn btn-primary"
          style={{ minWidth: '180px' }}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
