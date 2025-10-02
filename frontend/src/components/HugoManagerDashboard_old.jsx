import React, { useState } from 'react';
import { useAuth } from '../contexts/RoleBasedAuthContext';
import AnalyticsPage from './AnalyticsPage';

const HugoManagerDashboard = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  // Render different views based on currentView
  if (currentView === 'analytics') {
    return <AnalyticsPage onBack={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Hamburger Menu */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Hugo Platform</h1>
            </div>
            
            {/* User Info and Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.first_name} {user?.last_name}
              </span>
              
              {/* Hamburger Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user?.first_name} {user?.last_name}</div>
                      <div className="text-gray-500">{user?.email}</div>
                      <div className="text-xs text-blue-600 mt-1">Platform Administrator</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg className="inline h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">🔵</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hugo Manager Dashboard</h1>
              <p className="text-lg text-gray-600 mt-1">Platform Administrator Control Panel</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Companies - Not yet implemented */}
            <div className="bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition-colors cursor-not-allowed opacity-75">
              <div className="flex items-center mb-3">
                <svg className="h-8 w-8 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="font-semibold text-blue-900 text-lg">Companies</h3>
              </div>
              <p className="text-blue-700">Manage all companies and organizations on the platform</p>
              <div className="mt-3 text-sm text-red-600">🚧 Coming Soon</div>
            </div>
            
            {/* Users - Not yet implemented */}
            <div className="bg-green-50 p-6 rounded-lg hover:bg-green-100 transition-colors cursor-not-allowed opacity-75">
              <div className="flex items-center mb-3">
                <svg className="h-8 w-8 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <h3 className="font-semibold text-green-900 text-lg">Users</h3>
              </div>
              <p className="text-green-700">Manage all users across all companies and teams</p>
              <div className="mt-3 text-sm text-red-600">🚧 Coming Soon</div>
            </div>
            
            {/* Analytics - CONNECTED */}
            <div 
              onClick={() => handleNavigation('analytics')}
              className="bg-purple-50 p-6 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer border-2 border-purple-200"
            >
              <div className="flex items-center mb-3">
                <svg className="h-8 w-8 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="font-semibold text-purple-900 text-lg">Analytics</h3>
              </div>
              <p className="text-purple-700">Platform-wide insights and performance metrics</p>
              <div className="mt-3 text-sm text-purple-600 font-semibold">✅ Click to Open →</div>
            </div>
          </div>
          
          {/* Additional Admin Features */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Administration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg opacity-75">
                <h4 className="font-medium text-gray-900">System Settings</h4>
                <p className="text-sm text-gray-600 mt-1">Configure platform-wide settings and preferences</p>
                <div className="mt-2 text-xs text-red-600">🚧 Coming Soon</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg opacity-75">
                <h4 className="font-medium text-gray-900">Security & Permissions</h4>
                <p className="text-sm text-gray-600 mt-1">Manage security policies and user permissions</p>
                <div className="mt-2 text-xs text-red-600">🚧 Coming Soon</div>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="mt-8 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">🔗 Component Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div className="text-green-600">✅ Analytics: Connected</div>
              <div className="text-red-600">❌ Companies: Not Implemented</div>
              <div className="text-red-600">❌ Users: Not Implemented</div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Click outside to close menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default HugoManagerDashboard;
