import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/RoleBasedAuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const ResponsiveNavigation = ({ currentPage, onNavigate, menuItems = [] }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    // Redirect to login page
    window.location.href = '/';
  };

  const handleMenuClick = (item) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      onNavigate(item.path);
    }
    setIsMobileMenuOpen(false);
  };

  const getRoleLabel = (role) => {
    switch(role) {
      case 'hugo_manager':
        return t('login.roles.hugoManager');
      case 'hr_manager':
        return t('login.roles.hrManager');
      case 'user':
        return t('login.roles.employee');
      default:
        return role;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Hugo</h1>
            </div>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(item)}
                disabled={item.disabled}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{item.label}</span>
                  {item.disabled && <span className="text-xs text-orange-500 ml-1">Coming Soon</span>}
                </div>
              </button>
            ))}
          </nav>

          {/* Desktop User Menu & Language Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <span className="text-sm text-gray-600">
              {t('dashboard.welcome')}, {user?.first_name} {user?.last_name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
              title={t('navigation.logout')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{t('navigation.logout')}</span>
            </button>
            <div className="relative group">
              <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                  </span>
                </div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Desktop Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <div className="font-medium">{user?.first_name} {user?.last_name}</div>
                  <div className="text-gray-500">{user?.email}</div>
                  <div className="text-xs text-blue-600 mt-1">
                    {getRoleLabel(user?.role)}
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('profile')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {t('navigation.profile')}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* User info */}
            <div className="px-3 py-2 text-sm text-gray-700 border-b mb-2">
              <div className="font-medium">{user?.first_name} {user?.last_name}</div>
              <div className="text-gray-500">{user?.email}</div>
              <div className="text-xs text-blue-600 mt-1">
                {getRoleLabel(user?.role)}
              </div>
            </div>

            {/* Menu items */}
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(item)}
                disabled={item.disabled}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {item.icon && <span className="text-lg">{item.icon}</span>}
                  <span>{item.label}</span>
                  {item.disabled && <span className="text-xs text-orange-500 ml-1">Coming Soon</span>}
                </div>
              </button>
            ))}

            {/* Profile and Logout */}
            <button
              onClick={() => handleMenuClick({ path: 'profile' })}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {t('navigation.profile')}
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100"
            >
              {t('navigation.logout')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default ResponsiveNavigation;
