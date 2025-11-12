// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC<{
  children: React.ReactElement;
  requiredRoles?: string[];
}> = ({ children, requiredRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;          // 401 → login

  const userRole = user.rol?.nombre ?? '';
  if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
    return <Navigate to="/forbidden" replace />;               // 403 → sin permisos
  }

  return children;                                             // OK
};

export default ProtectedRoute;
