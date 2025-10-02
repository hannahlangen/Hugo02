import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/RoleBasedAuthContext';
import ResponsiveNavigation from './ResponsiveNavigation';
import TeamsPage from './TeamsPage';
import HugoPersonalityAssessment from './HugoPersonalityAssessment';
import UserProfile from './UserProfile';

const UserDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    {
      label: t('navigation.dashboard'),
      path: 'dashboard',
      icon: '🏠',
      action: () => setCurrentPage('dashboard')
    },
    {
      label: t('navigation.myProfile'),
      path: 'profile',
      icon: '👤',
      action: () => setCurrentPage('profile')
    },
    {
      label: t('navigation.myTeam'),
      path: 'team',
      icon: '👥',
      action: () => setCurrentPage('team')
    },
    {
      label: t('navigation.assessment'),
      path: 'assessment',
      icon: '📝',
      action: () => setCurrentPage('assessment')
    }
  ];

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'profile':
        return <UserProfile />;
      case 'team':
        return <TeamsPage />;
      case 'assessment':
        return <HugoPersonalityAssessment onComplete={(profile) => console.log('Assessment completed:', profile)} />;
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{t('userDashboard.title')}</h1>
                  <p className="text-green-100">{t('userDashboard.subtitle')}</p>
                  <p className="text-sm text-green-200 mt-1">
                    {t('userDashboard.welcomeMessage')}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* My Profile Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                   onClick={() => setCurrentPage('profile')}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">👤 {t('userDashboard.myProfile')}</h3>
                    <p className="text-blue-600 text-sm mb-4">{t('userDashboard.myProfileDescription')}</p>
                    <div className="flex items-center text-blue-700 font-medium">
                      <span className="mr-2">✅</span>
                      <span>{t('common.clickToOpen')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* My Team Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                   onClick={() => setCurrentPage('team')}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">👥 {t('userDashboard.myTeam')}</h3>
                    <p className="text-purple-600 text-sm mb-4">{t('userDashboard.myTeamDescription')}</p>
                    <div className="flex items-center text-purple-700 font-medium">
                      <span className="mr-2">✅</span>
                      <span>{t('common.clickToOpen')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assessment Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                   onClick={() => setCurrentPage('assessment')}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">📝 {t('userDashboard.assessment')}</h3>
                    <p className="text-green-600 text-sm mb-4">{t('userDashboard.assessmentDescription')}</p>
                    <div className="flex items-center text-green-700 font-medium">
                      <span className="mr-2">✅</span>
                      <span>{t('common.clickToOpen')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Development Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('dashboard.personalDevelopment')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">{t('dashboard.personalityInsights')}</h3>
                  <p className="text-sm text-gray-600">{t('dashboard.personalityInsightsDescription')}</p>
                  <div className="flex items-center text-blue-600 text-sm">
                    <span className="mr-2">✅</span>
                    <span>{t('dashboard.availableInProfile')}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">{t('dashboard.teamCollaboration')}</h3>
                  <p className="text-sm text-gray-600">{t('dashboard.teamCollaborationDescription')}</p>
                  <div className="flex items-center text-blue-600 text-sm">
                    <span className="mr-2">✅</span>
                    <span>{t('dashboard.availableInTeam')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('userDashboard.quickActions.title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setCurrentPage('profile')}
                  className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">👤</span>
                    <div>
                      <div className="font-medium">{t('userDashboard.quickActions.viewProfile')}</div>
                      <div className="text-sm text-gray-500">{t('userDashboard.myProfileDescription')}</div>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setCurrentPage('team')}
                  className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">👥</span>
                    <div>
                      <div className="font-medium">{t('userDashboard.quickActions.viewTeam')}</div>
                      <div className="text-sm text-gray-500">{t('userDashboard.myTeamDescription')}</div>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setCurrentPage('assessment')}
                  className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📝</span>
                    <div>
                      <div className="font-medium">{t('userDashboard.quickActions.takeAssessment')}</div>
                      <div className="text-sm text-gray-500">{t('userDashboard.quickActions.updateProfile')}</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Component Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🔧 {t('dashboard.componentStatus')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-sm">{t('dashboard.profileConnected')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-sm">{t('dashboard.teamConnected')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-sm">{t('dashboard.assessmentConnected')}</span>
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

export default UserDashboard;
