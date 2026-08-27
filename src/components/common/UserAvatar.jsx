import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

/**
 * Robust User Avatar Component
 * - Supports Google profile pictures with referrerPolicy="no-referrer" (fixes 403 Google photo issues)
 * - Renders crisp 2-letter monogram (e.g. "MP") if image fails to load, preventing text overflow
 * - Supports Cloudinary uploads and custom dimensions
 */
export default function UserAvatar({
  user,
  size = 44,
  fontSize = 15,
  border = 'none',
  boxShadow = 'none',
  showVerifiedBadge = false
}) {
  const [hasImageError, setHasImageError] = useState(false);

  const name = user?.name || user?.displayName || '';
  const email = user?.email || '';
  const rawPhoto = user?.avatar || user?.photoURL || '';

  // If rawPhoto is a generic ui-avatars.com URL with old "Customer" / "CM", ignore it so we render the crisp initials or real photo
  const isGenericUiAvatar = typeof rawPhoto === 'string' && rawPhoto.includes('ui-avatars.com') && (rawPhoto.includes('Customer') || rawPhoto.includes('CM'));
  const photoUrl = isGenericUiAvatar ? '' : rawPhoto;

  useEffect(() => {
    setHasImageError(false);
  }, [photoUrl]);

  // Generate clean 1-2 letter monogram initials (e.g., "Manikandan Prabhu" -> "MP")
  const getInitials = (fullName, userEmail) => {
    if (fullName && fullName.trim() && fullName.toLowerCase() !== 'customer' && fullName.toLowerCase() !== 'welcome to avero') {
      const parts = fullName.trim().split(/\s+/);
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    if (userEmail && userEmail.trim()) {
      const handle = userEmail.split('@')[0].replace(/[0-9_.-]/g, '');
      if (handle.length >= 2) return handle.slice(0, 2).toUpperCase();
      return userEmail.slice(0, 2).toUpperCase();
    }
    return '';
  };

  const initials = getInitials(name, email);

  // Dynamic avatar gradient for a rich modern look
  const getAvatarGradient = (str) => {
    const gradients = [
      'linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)',
      'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
      'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
      'linear-gradient(135deg, #059669 0%, #10B981 100%)',
      'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
      'linear-gradient(135deg, #DB2777 0%, #EC4899 100%)'
    ];
    let hash = 0;
    for (let i = 0; i < (str || 'Avero').length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  const background = getAvatarGradient(name || email);

  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background,
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: `${fontSize}px`,
        border,
        boxShadow,
        userSelect: 'none',
        flexShrink: 0
      }}
    >
      {photoUrl && !hasImageError ? (
        <img
          src={photoUrl}
          alt={name || 'Avatar'}
          referrerPolicy="no-referrer"
          onError={() => setHasImageError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%',
            display: 'block'
          }}
        />
      ) : initials ? (
        <span style={{ letterSpacing: '0.5px', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{initials}</span>
      ) : (
        <User size={Math.round(size * 0.55)} color="#FFFFFF" />
      )}
    </div>
  );
}
