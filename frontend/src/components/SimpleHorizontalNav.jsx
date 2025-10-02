import React, { useState } from 'react';
import { useAuth } from '../contexts/RoleBasedAuthContext';

const SimpleHorizontalNav = ({ currentPage, onNavigate, menuItems }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Hugo Platform</h1>
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => !item.disabled && item.action && item.action()}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                disabled={item.disabled}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
                {item.disabled && <span className="ml-2 text-xs">(Coming Soon)</span>}
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <div className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-50">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.first_name} {user?.last_name}
                    </div>
                    <div className="text-xs text-gray-500">{user?.role?.replace('_', ' ')}</div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                  <div className="px-4 py-2 border-b">
                    <div className="text-sm font-medium text-gray-900">{user?.first_name} {user?.last_name}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {user?.role === 'hugo_manager' && 'Platform Administrator'}
                      {user?.role === 'hr_manager' && 'Company Administrator'}
                      {user?.role === 'user' && 'Team Member'}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden ml-4">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showUserMenu && (
          <div className="md:hidden border-t border-gray-200 py-3">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    setShowUserMenu(false);
                    !item.disabled && item.action && item.action();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    currentPage === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : item.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  disabled={item.disabled}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                  {item.disabled && <span className="ml-2 text-xs">(Coming Soon)</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
};

export default SimpleHorizontalNav;
