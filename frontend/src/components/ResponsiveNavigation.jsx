import React, { useState } from 'react';
import { useAuth } from '../contexts/RoleBasedAuthContext';

const ResponsiveNavigation = ({ currentPage, onNavigate, menuItems = [] }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const handleMenuClick = (item) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      onNavigate(item.path);
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Hugo Platform</h1>
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
                  {item.icon && <span className="text-lg">{item.icon}</span>}
                  <span>{item.label}</span>
                  {item.disabled && <span className="text-xs text-orange-500 ml-1">Coming Soon</span>}
                </div>
              </button>
            ))}
          </nav>

          {/* Desktop User Menu - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.first_name} {user?.last_name}
            </span>
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
                    {user?.role === 'hugo_manager' ? 'Platform Administrator' : 
                     user?.role === 'hr_manager' ? 'Company Administrator' : 'Team Member'}
                  </div>
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
            </div>
          </div>

          {/* Mobile menu button - Only visible on mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Mobile Navigation Menu - Only visible on mobile when open */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* User Info */}
              <div className="px-3 py-2 text-sm text-gray-700 border-b border-gray-200 mb-2">
                <div className="font-medium">{user?.first_name} {user?.last_name}</div>
                <div className="text-gray-500">{user?.email}</div>
                <div className="text-xs text-blue-600 mt-1">
                  {user?.role === 'hugo_manager' ? 'Platform Administrator' : 
                   user?.role === 'hr_manager' ? 'Company Administrator' : 'Team Member'}
                </div>
              </div>
              
              {/* Navigation Items */}
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMenuClick(item)}
                  disabled={item.disabled}
                  className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    currentPage === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : item.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon && <span className="text-lg">{item.icon}</span>}
                    <span>{item.label}</span>
                    {item.disabled && <span className="text-xs text-orange-500 ml-auto">Coming Soon</span>}
                  </div>
                </button>
              ))}
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md border-t border-gray-200 mt-2 pt-4"
              >
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Click outside to close mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default ResponsiveNavigation;
