import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

/**
 * Route Guard for Delivery Partner Portal (/delivery/*)
 * Enforces authenticated delivery agent session
 */
export default function DeliveryRoute({ children }) {
  const { deliveryAgentUser } = useApp();

  // If not logged in as delivery partner, redirect to delivery auth
  if (!deliveryAgentUser?.isAuth) {
    return <Navigate to="/delivery/auth" replace />;
  }

  // Check account status if pending or rejected
  if (deliveryAgentUser.status === 'PENDING_APPROVAL' || deliveryAgentUser.status === 'REJECTED') {
    return <Navigate to="/delivery/auth" replace />;
  }

  return children;
}
