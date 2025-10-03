import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/RoleBasedAuthContext';
import ResponsiveNavigation from './ResponsiveNavigation';
import TeamsPage from './TeamsPage';
import AnalyticsPage from './AnalyticsPage';
import RecommendationDashboard from './RecommendationDashboard';

const HRManagerDashboard = () => {
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
      label: t('navigation.teams'),
      path: 'teams',
      icon: '👥',
      action: () => setCurrentPage('teams')
    },
    {
      label: 'Recommendations',
      path: 'recommendations',
      icon: '🎯',
      action: () => setCurrentPage('recommendations')
    },
    {
      label: t('hrDashboard.quickActions.viewReports'),
      path: 'reports',
      icon: '📊',
      action: () => setCurrentPage('reports')
    },
    {
      label: t('hrDashboard.employees'),
      path: 'employees',
      icon: '👤',
      disabled: true
    }
  ];

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    console.log('=== HRManagerDashboard renderCurrentPage ===', currentPage);
    switch (currentPage) {
      case 'teams':
        console.log('Rendering TeamsPage');
        return <TeamsPage />;
      case 'recommendations':
        console.log('Rendering RecommendationDashboard');
        return <RecommendationDashboard />;
      case 'reports':
        console.log('Rendering AnalyticsPage');
        return <AnalyticsPage />;
      case 'dashboard':
      default:
        console.log('Rendering Dashboard');
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <span className="text-2xl font-bold">HR</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{t('hrDashboard.title')}</h1>
                  <p className="text-orange-100">{t('login.roleDescriptions.hrManager')}</p>
                  <p className="text-sm text-orange-200 mt-1">
                    {t('dashboard.welcome')}! {t('login.roles.hrManager')}
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
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">👥 {t('navigation.teams')}</h3>
                    <p className="text-blue-600 text-sm mb-4">{t('teams.title')}</p>
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
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">📊 {t('analytics.title')}</h3>
                    <p className="text-purple-600 text-sm mb-4">{t('hrDashboard.companyOverview')}</p>
                    <div className="flex items-center text-purple-700 font-medium">
                      <span className="mr-2">✅</span>
                      <span>Click to Open →</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employees Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-lg p-6 opacity-60">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">👤 {t('hrDashboard.employees')}</h3>
                    <p className="text-gray-500 text-sm mb-4">{t('hrDashboard.quickActions.manageUsers')}</p>
                    <div className="flex items-center text-gray-500 font-medium">
                      <span className="mr-2">🚧</span>
                      <span>Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{t('hrDashboard.quickActions.title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setCurrentPage('teams')}
                  className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
                >
                  <div className="text-2xl mb-2">👥</div>
                  <div className="font-medium text-blue-900">{t('hrDashboard.quickActions.createTeam')}</div>
                  <div className="text-sm text-blue-600">{t('teams.createTeam')}</div>
                </button>
                
                <button
                  onClick={() => setCurrentPage('reports')}
                  className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors"
                >
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-medium text-purple-900">{t('hrDashboard.quickActions.viewReports')}</div>
                  <div className="text-sm text-purple-600">{t('analytics.overview')}</div>
                </button>
                
                <button
                  disabled
                  className="p-4 bg-gray-50 rounded-lg text-left opacity-50 cursor-not-allowed"
                >
                  <div className="text-2xl mb-2">✉️</div>
                  <div className="font-medium text-gray-700">{t('hrDashboard.quickActions.inviteEmployee')}</div>
                  <div className="text-sm text-gray-500">Coming Soon</div>
                </button>
                
                <button
                  disabled
                  className="p-4 bg-gray-50 rounded-lg text-left opacity-50 cursor-not-allowed"
                >
                  <div className="text-2xl mb-2">⚙️</div>
                  <div className="font-medium text-gray-700">{t('settings.title')}</div>
                  <div className="text-sm text-gray-500">Coming Soon</div>
                </button>
              </div>
            </div>

            {/* Company Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{t('hrDashboard.companyOverview')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-sm text-blue-600 mb-1">{t('hrDashboard.totalEmployees')}</div>
                  <div className="text-2xl font-bold text-blue-900">24</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-sm text-green-600 mb-1">{t('hrDashboard.activeTeams')}</div>
                  <div className="text-2xl font-bold text-green-900">6</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-sm text-purple-600 mb-1">{t('hrDashboard.completedAssessments')}</div>
                  <div className="text-2xl font-bold text-purple-900">18</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <div className="text-sm text-orange-600 mb-1">{t('hrDashboard.averageEngagement')}</div>
                  <div className="text-2xl font-bold text-orange-900">87%</div>
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default HRManagerDashboard;
