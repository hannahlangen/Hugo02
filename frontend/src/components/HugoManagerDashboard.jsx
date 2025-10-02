import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/RoleBasedAuthContext';
import ResponsiveNavigation from './ResponsiveNavigation';
import AnalyticsPage from './AnalyticsPage';

const HugoManagerDashboard = () => {
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
      label: t('navigation.analytics'),
      path: 'analytics',
      icon: '📊',
      action: () => setCurrentPage('analytics')
    },
    {
      label: t('hugoDashboard.companies'),
      path: 'companies',
      icon: '🏢',
      disabled: true
    },
    {
      label: t('hugoDashboard.users'),
      path: 'users',
      icon: '👥',
      disabled: true
    }
  ];

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'analytics':
        return <AnalyticsPage />;
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <span className="text-2xl font-bold">HM</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{t('hugoDashboard.title')}</h1>
                  <p className="text-blue-100">{t('hugoDashboard.subtitle')}</p>
                  <p className="text-sm text-blue-200 mt-1">
                    {t('hugoDashboard.welcomeMessage')}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Analytics Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                   onClick={() => setCurrentPage('analytics')}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">📊 {t('navigation.analytics')}</h3>
                    <p className="text-purple-600 text-sm mb-4">{t('hugoDashboard.analyticsDescription')}</p>
                    <div className="flex items-center text-purple-700 font-medium">
                      <span className="mr-2">✅</span>
                      <span>{t('common.clickToOpen')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Companies Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 opacity-60">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">🏢 {t('hugoDashboard.companies')}</h3>
                    <p className="text-blue-600 text-sm mb-4">{t('hugoDashboard.companiesDescription')}</p>
                    <div className="flex items-center text-orange-600 font-medium">
                      <span className="mr-2">🚧</span>
                      <span>{t('common.comingSoon')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Users Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 opacity-60">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">👥 {t('hugoDashboard.users')}</h3>
                    <p className="text-green-600 text-sm mb-4">{t('hugoDashboard.usersDescription')}</p>
                    <div className="flex items-center text-orange-600 font-medium">
                      <span className="mr-2">🚧</span>
                      <span>{t('common.comingSoon')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Administration Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('hugoDashboard.platformAdmin')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">{t('hugoDashboard.systemSettings')}</h3>
                  <p className="text-sm text-gray-600">{t('hugoDashboard.systemSettingsDescription')}</p>
                  <div className="flex items-center text-orange-600 text-sm">
                    <span className="mr-2">🚧</span>
                    <span>{t('common.comingSoon')}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">{t('hugoDashboard.securityPermissions')}</h3>
                  <p className="text-sm text-gray-600">{t('hugoDashboard.securityPermissionsDescription')}</p>
                  <div className="flex items-center text-orange-600 text-sm">
                    <span className="mr-2">🚧</span>
                    <span>{t('common.comingSoon')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Component Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🔧 {t('dashboard.componentStatus')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-sm">{t('hugoDashboard.analyticsConnected')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">❌</span>
                  <span className="text-sm">{t('hugoDashboard.companiesNotImplemented')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">❌</span>
                  <span className="text-sm">{t('hugoDashboard.usersNotImplemented')}</span>
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

export default HugoManagerDashboard;
