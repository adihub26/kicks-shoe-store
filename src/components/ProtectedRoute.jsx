// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Check if user is logged in (using your localStorage method)
  const isLoggedIn = localStorage.getItem('kicksUser');
  
  if (!isLoggedIn) {
    // Redirect to login page with return URL
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }
  
  return children;
};

export default ProtectedRoute;