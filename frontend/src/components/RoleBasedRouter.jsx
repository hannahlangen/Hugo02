import React from 'react';
import { useAuth } from '../contexts/RoleBasedAuthContext';
import EnhancedLoginPage from './EnhancedLoginPage';
import HugoManagerDashboard from './HugoManagerDashboard';
import HRManagerDashboard from './HRManagerDashboard';
import UserDashboard from './UserDashboard';

const RoleBasedRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <EnhancedLoginPage />;
  }

  // Route based on user role
  switch (user.role) {
    case 'hugo_manager':
      return <HugoManagerDashboard />;
    case 'hr_manager':
      return <HRManagerDashboard />;
    case 'user':
      return <UserDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">Role '{user.role}' is not recognized.</p>
            <p className="text-sm text-gray-500 mb-4">Debug: User role is '{user.role}'</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
  }
};

export default RoleBasedRouter;
