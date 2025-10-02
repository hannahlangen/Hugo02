import React, { useState } from 'react';
import { useAuth } from '../contexts/RoleBasedAuthContext';
import TeamsPage from './TeamsPage';
import TwoStageHugoAssessment from './TwoStageHugoAssessment';
import UserProfile from './UserProfile';

const UserDashboard = () => {
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
  if (currentView === 'profile') {
    return <UserProfile onBack={() => setCurrentView('dashboard')} />;
  }
  
  if (currentView === 'team') {
    return <TeamsPage onBack={() => setCurrentView('dashboard')} />;
  }
  
  if (currentView === 'assessment') {
    return <TwoStageHugoAssessment onBack={() => setCurrentView('dashboard')} />;
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
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      <div className="text-xs text-green-600 mt-1">Team Member</div>
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
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">🟢</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
              <p className="text-lg text-gray-600 mt-1">Your Personal Hugo Profile</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* My Profile - CONNECTED */}
            <div 
              onClick={() => handleNavigation('profile')}
              className="bg-green-50 p-6 rounded-lg hover:bg-green-100 transition-colors cursor-pointer border-2 border-green-200"
            >
              <div className="flex items-center mb-3">
                <svg className="h-8 w-8 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="font-semibold text-green-900 text-lg">My Profile</h3>
              </div>
              <p className="text-green-700">View and manage your Hugo personality profile</p>
              <div className="mt-3 text-sm text-green-600 font-semibold">✅ Click to View →</div>
            </div>
            
            {/* My Team - CONNECTED */}
            <div 
              onClick={() => handleNavigation('team')}
              className="bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer border-2 border-blue-200"
            >
              <div className="flex items-center mb-3">
                <svg className="h-8 w-8 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="font-semibold text-blue-900 text-lg">My Team</h3>
              </div>
              <p className="text-blue-700">View your team members and team dynamics</p>
              <div className="mt-3 text-sm text-blue-600 font-semibold">✅ Click to Open →</div>
            </div>
            
            {/* Assessment - CONNECTED */}
            <div 
              onClick={() => handleNavigation('assessment')}
              className="bg-indigo-50 p-6 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer border-2 border-indigo-200"
            >
              <div className="flex items-center mb-3">
                <svg className="h-8 w-8 text-indigo-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="font-semibold text-indigo-900 text-lg">Assessment</h3>
              </div>
              <p className="text-indigo-700">Take or retake your Hugo personality assessment</p>
              <div className="mt-3 text-sm text-indigo-600 font-semibold">✅ Click to Start →</div>
            </div>
          </div>
          
          {/* Personal Development Section */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Development</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg opacity-75">
                <h4 className="font-medium text-gray-900">Communication Tips</h4>
                <p className="text-sm text-gray-600 mt-1">Personalized communication advice based on your Hugo type</p>
                <div className="mt-2 text-xs text-red-600">🚧 Coming Soon</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg opacity-75">
                <h4 className="font-medium text-gray-900">Career Development</h4>
                <p className="text-sm text-gray-600 mt-1">Career suggestions and growth opportunities</p>
                <div className="mt-2 text-xs text-red-600">🚧 Coming Soon</div>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="mt-8 bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">🔗 Component Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div className="text-green-600">✅ My Profile: Connected</div>
              <div className="text-green-600">✅ My Team: Connected</div>
              <div className="text-green-600">✅ Assessment: Connected</div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-green-600 font-semibold">🎉 All Employee features are now functional!</span>
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

export default UserDashboard;
