import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from './Shared/index.jsx';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Loader />;

  if (!session) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
