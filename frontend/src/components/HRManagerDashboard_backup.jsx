import React, { useState } from 'react';
import { useAuth } from '../contexts/RoleBasedAuthContext';
import ResponsiveNavigation from './ResponsiveNavigation';
import TeamsPage from './TeamsPage';
import AnalyticsPage from './AnalyticsPage';

const HRManagerDashboard = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    {
      label: 'Dashboard',
      path: 'dashboard',
      icon: '🏠',
      action: () => setCurrentPage('dashboard')
    },
    {
      label: 'Teams',
      path: 'teams',
      icon: '👥',
      action: () => setCurrentPage('teams')
    },
    {
      label: 'Reports',
      path: 'reports',
      icon: '📊',
      action: () => setCurrentPage('reports')
    },
    {
      label: 'Employees',
      path: 'employees',
      icon: '👤',
      disabled: true
    }
  ];

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'teams':
        return <TeamsPage />;
      case 'reports':
        return <AnalyticsPage />;
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <span className="text-2xl font-bold">HR</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">HR Manager Dashboard</h1>
                  <p className="text-orange-100">Company Administrator Control Panel</p>
                  <p className="text-sm text-orange-200 mt-1">
                    Welcome! You are logged in as Company Administrator.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Teams Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                   onClick={() => setCurrentPage('teams')}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">👥 Teams</h3>
                    <p className="text-blue-600 text-sm mb-4">Manage teams and analyze team dynamics</p>
                    <div className="flex items-center text-blue-700 font-medium">
                      <span className="mr-2">✅</span>
                      <span>Click to Open →</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reports Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                   onClick={() => setCurrentPage('reports')}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">📊 Reports</h3>
                    <p className="text-purple-600 text-sm mb-4">Company insights and team performance metrics</p>
                    <div className="flex items-center text-purple-700 font-medium">
                      <span className="mr-2">✅</span>
                      <span>Click to Open →</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employees Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 opacity-60">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">👤 Employees</h3>
                    <p className="text-green-600 text-sm mb-4">Manage individual employees and their profiles</p>
                    <div className="flex items-center text-orange-600 font-medium">
                      <span className="mr-2">🚧</span>
                      <span>Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Management Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Management</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Team Organization</h3>
                  <p className="text-sm text-gray-600">Structure and organize teams within your company</p>
                  <div className="flex items-center text-blue-600 text-sm">
                    <span className="mr-2">✅</span>
                    <span>Available in Teams section</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Performance Analytics</h3>
                  <p className="text-sm text-gray-600">Track team performance and personality insights</p>
                  <div className="flex items-center text-blue-600 text-sm">
                    <span className="mr-2">✅</span>
                    <span>Available in Reports section</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Component Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🔧 Component Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-sm">Teams: Connected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-sm">Reports: Connected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">❌</span>
                  <span className="text-sm">Employees: Not Implemented</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ResponsiveNavigation 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        menuItems={menuItems}
      />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default HRManagerDashboard;
