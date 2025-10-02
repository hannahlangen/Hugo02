import React, { useState } from 'react';
import { useAuth } from '../contexts/RoleBasedAuthContext';
import TeamsPage from './TeamsPage';
import AnalyticsPage from './AnalyticsPage';

const HRManagerDashboard = () => {
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
  if (currentView === 'teams') {
    return <TeamsPage onBack={() => setCurrentView('dashboard')} />;
  }
  
  if (currentView === 'reports') {
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
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                      <div className="text-xs text-orange-600 mt-1">Company Administrator</div>
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
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">🟠</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">HR Manager Dashboard</h1>
              <p className="text-lg text-gray-600 mt-1">Company Administration Control Panel</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Teams - CONNECTED */}
            <div 
              onClick={() => handleNavigation('teams')}
              className="bg-orange-50 p-6 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer border-2 border-orange-200"
            >
              <div className="flex items-center mb-3">
                <svg className="h-8 w-8 text-orange-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="font-semibold text-orange-900 text-lg">Teams</h3>
              </div>
              <p className="text-orange-700">Manage company teams and team compositions</p>
              <div className="mt-3 text-sm text-orange-600 font-semibold">✅ Click to Open →</div>
            </div>
            
            {/* Employees - Not yet implemented */}
            <div className="bg-yellow-50 p-6 rounded-lg hover:bg-yellow-100 transition-colors cursor-not-allowed opacity-75">
              <div className="flex items-center mb-3">
                <svg className="h-8 w-8 text-yellow-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <h3 className="font-semibold text-yellow-900 text-lg">Employees</h3>
              </div>
              <p className="text-yellow-700">Manage company employees and their profiles</p>
              <div className="mt-3 text-sm text-red-600">🚧 Coming Soon</div>
            </div>
            
            {/* Reports - CONNECTED */}
            <div 
              onClick={() => handleNavigation('reports')}
              className="bg-red-50 p-6 rounded-lg hover:bg-red-100 transition-colors cursor-pointer border-2 border-red-200"
            >
              <div className="flex items-center mb-3">
                <svg className="h-8 w-8 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="font-semibold text-red-900 text-lg">Reports</h3>
              </div>
              <p className="text-red-700">Team analytics and performance reports</p>
              <div className="mt-3 text-sm text-red-600 font-semibold">✅ Click to Open →</div>
            </div>
          </div>
          
          {/* Additional HR Features */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">HR Management Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg opacity-75">
                <h4 className="font-medium text-gray-900">Personality Assessments</h4>
                <p className="text-sm text-gray-600 mt-1">Manage Hugo personality assessments and results</p>
                <div className="mt-2 text-xs text-red-600">🚧 Coming Soon</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg opacity-75">
                <h4 className="font-medium text-gray-900">Team Building</h4>
                <p className="text-sm text-gray-600 mt-1">Create optimal team compositions based on Hugo types</p>
                <div className="mt-2 text-xs text-red-600">🚧 Coming Soon</div>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="mt-8 bg-orange-50 p-4 rounded-lg">
            <h3 className="font-medium text-orange-900 mb-2">🔗 Component Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div className="text-green-600">✅ Teams: Connected</div>
              <div className="text-green-600">✅ Reports: Connected</div>
              <div className="text-red-600">❌ Employees: Not Implemented</div>
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

export default HRManagerDashboard;
