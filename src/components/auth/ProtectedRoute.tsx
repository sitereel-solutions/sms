import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSociety } from '../../context/SocietyContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { role, authUser, isLoading } = useSociety();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  // Check if authenticated
  const token = localStorage.getItem('sms_auth_token');
  if (!token && !authUser) {
    return <Navigate to="/login" replace />;
  }

  // Check role authorization
  if (!allowedRoles.includes(role)) {
    // Redirect to the user's primary portal
    if (role === 'super_admin') {
      return <Navigate to="/super-admin" replace />;
    }
    if (role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/resident" replace />;
  }

  return <Outlet />;
};
