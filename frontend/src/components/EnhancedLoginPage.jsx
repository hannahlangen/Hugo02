import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/RoleBasedAuthContext'
import { Brain, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'

const EnhancedLoginPage = () => {
  const { t } = useTranslation()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(formData.email, formData.password)
    } catch (err) {
      setError(err.message || t('login.errors.loginFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  const demoAccounts = [
    {
      role: t('login.roles.hugoManager'),
      email: 'hugo@hugoatwork.com',
      password: 'hugo123',
      description: t('login.roleDescriptions.hugoManager')
    },
    {
      role: t('login.roles.hrManager'),
      email: 'hr@democompany.com',
      password: 'hr123',
      description: t('login.roleDescriptions.hrManager')
    },
    {
      role: t('login.roles.employee'),
      email: 'user@democompany.com',
      password: 'user123',
      description: t('login.roleDescriptions.employee')
    }
  ]

  const fillDemoAccount = (email, password) => {
    setFormData({ email, password })
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Language Switcher - Top Right */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left side - Branding and Info */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start mb-8">
            <Brain className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">{t('login.title')}</h1>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            {t('login.subtitle')}
            <span className="text-blue-600 block">{t('login.subtitle2')}</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {t('login.description')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
              <div className="text-sm text-gray-600">{t('login.personalityTypes')}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-green-600 mb-1">AI</div>
              <div className="text-sm text-gray-600">{t('login.aiPowered')}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">{t('login.teamInsights')}</div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('dashboard.welcome')}</h3>
            <p className="text-gray-600">Sign in to access your Hugo dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('login.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={t('login.email')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('login.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={t('login.password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {t('login.loggingIn')}
                </div>
              ) : (
                t('login.loginButton')
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-4">{t('login.demoAccounts')}</h4>
            <div className="space-y-3">
              {demoAccounts.map((account, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-900">{account.role}</span>
                    <button
                      type="button"
                      onClick={() => fillDemoAccount(account.email, account.password)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {t('login.tryDemo')}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{account.description}</p>
                  <div className="text-xs text-gray-500">
                    <div>{account.email}</div>
                    <div>Password: {account.password}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact{' '}
              <a href="mailto:support@hugoatwork.com" className="text-blue-600 hover:text-blue-700">
                support@hugoatwork.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedLoginPage
