import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function ProtectedRoute({ children }) {
  const { user } = useApp();
  const location = useLocation();

  if (!user || !user.isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
