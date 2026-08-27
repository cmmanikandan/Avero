import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import AdminLayout from '../../layouts/AdminLayout';
import UnauthorizedPage from '../../pages/auth/UnauthorizedPage';

export default function AdminRoute({ children }) {
  const { user } = useApp();
  const location = useLocation();

  // 1. Authentication Check
  if (!user || !user.isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role-Based Access Control: Strictly require role === 'admin'
  if (user.role !== 'admin') {
    return <UnauthorizedPage requiredRole="admin" />;
  }

  // 3. Authorized Admin -> Render with AdminLayout
  return <AdminLayout>{children}</AdminLayout>;
}
