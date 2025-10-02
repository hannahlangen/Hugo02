import React, { useState } from 'react';
import { useAuth } from '../contexts/RoleBasedAuthContext';
import SimpleHorizontalNav from './SimpleHorizontalNav';
import TeamsPage from './TeamsPage';
import AnalyticsPage from './AnalyticsPage';

const HRManagerDashboard = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  const menuItems = [
    {
      path: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      action: () => setCurrentView('dashboard'),
      disabled: false
    },
    {
      path: 'teams',
      label: 'Teams',
      icon: '👥',
      action: () => setCurrentView('teams'),
      disabled: false
    },
    {
      path: 'reports',
      label: 'Reports',
      icon: '📊',
      action: () => setCurrentView('reports'),
      disabled: false
    },
    {
      path: 'employees',
      label: 'Employees',
      icon: '👤',
      action: () => setCurrentView('employees'),
      disabled: true
    }
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'teams':
        return <TeamsPage />;
      case 'reports':
        return <AnalyticsPage />;
      case 'employees':
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Employees Management</h3>
            <p className="text-gray-500">This feature is coming soon!</p>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl font-bold">HR</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">HR Manager Dashboard</h1>
                  <p className="text-gray-600">Company Administrator Control Panel</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Welcome! You are logged in as Company Administrator.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Teams Management */}
              <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-xl">👥</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Teams</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Manage team compositions, analyze team dynamics, and optimize collaboration
                </p>
                <button
                  onClick={() => setCurrentView('teams')}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  ✅ Click to Open →
                </button>
              </div>

              {/* Reports & Analytics */}
              <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-xl">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Company-wide insights and performance metrics
                </p>
                <button
                  onClick={() => setCurrentView('reports')}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  ✅ Click to Open →
                </button>
              </div>

              {/* Employee Management */}
              <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow opacity-60">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-gray-400 text-xl">👤</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-500">Employees</h3>
                </div>
                <p className="text-gray-500 mb-4">
                  Manage all employees across all companies and teams
                </p>
                <div className="w-full bg-gray-200 text-gray-500 px-4 py-2 rounded-md text-center">
                  🚧 Coming Soon
                </div>
              </div>
            </div>

            {/* Company Administration */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Administration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Team Settings</h3>
                  <p className="text-sm text-gray-600 mb-3">Configure team-wide settings and preferences</p>
                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">🚧 Coming Soon</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Performance & Analytics</h3>
                  <p className="text-sm text-gray-600 mb-3">Manage performance policies and user analytics</p>
                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">🚧 Coming Soon</span>
                </div>
              </div>
            </div>

            {/* Component Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🔧 Component Status</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-sm">Teams: Connected</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-sm">Reports: Connected</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">❌</span>
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
      <SimpleHorizontalNav
        currentPage={currentView}
        onNavigate={setCurrentView}
        menuItems={menuItems}
      />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default HRManagerDashboard;
