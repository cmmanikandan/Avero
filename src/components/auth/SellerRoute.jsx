import React, { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import SellerLayout from '../../layouts/SellerLayout';
import SellerStatusGatePage from '../../pages/seller/SellerStatusGatePage';

export default function SellerRoute({ children }) {
  const { user } = useApp();
  const location = useLocation();

  // 1. Authentication Check
  if (!user || !user.isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Resolve Seller Account Status
  const sellerAccountState = useMemo(() => {
    try {
      const savedProfile = JSON.parse(localStorage.getItem('avero_seller_profile') || '{}');
      const savedSeller = JSON.parse(localStorage.getItem('avero_seller') || '{}');
      const savedUser = JSON.parse(localStorage.getItem('avero_user') || '{}');

      // Check if user has explicit seller status
      const status = user.sellerStatus || savedProfile.status || savedSeller.sellerStatus || savedUser.sellerStatus;
      const role = user.role || savedUser.role || 'customer';

      if (role === 'admin') {
        // Admins can inspect seller central in admin view or view approved
        return 'approved';
      }

      if (status === 'suspended') return 'suspended';
      if (status === 'rejected') return 'rejected';
      if (status === 'pending') return 'pending';
      if (status === 'approved' || role === 'seller' || savedProfile.storeName) return 'approved';

      return 'not_created';
    } catch {
      return user.role === 'seller' ? 'approved' : 'not_created';
    }
  }, [user]);

  // 3. Status Gates
  if (sellerAccountState === 'not_created') {
    return <SellerStatusGatePage status="not_created" />;
  }

  if (sellerAccountState === 'pending') {
    return <SellerStatusGatePage status="pending" />;
  }

  if (sellerAccountState === 'rejected') {
    return <SellerStatusGatePage status="rejected" />;
  }

  if (sellerAccountState === 'suspended') {
    return <SellerStatusGatePage status="suspended" />;
  }

  // 4. Authorized Approved Seller -> Render with SellerLayout
  return <SellerLayout>{children}</SellerLayout>;
}
