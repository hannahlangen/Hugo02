import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/RoleBasedAuthContext'
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Settings,
  Shield,
  Database,
  Globe,
  Zap,
  Target,
  Award,
  RefreshCw
} from 'lucide-react'

export default function EnhancedHugoManagerDashboard() {
  const { apiCall, user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [companies, setCompanies] = useState([])
  const [platformStats, setPlatformStats] = useState({})
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [showCreateCompany, setShowCreateCompany] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load platform data
  useEffect(() => {
    loadPlatformData()
  }, [])

  const loadPlatformData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Load companies
      const companiesData = await apiCall('/api/companies')
      setCompanies(companiesData)
      
      // Calculate platform stats
      const totalUsers = companiesData.reduce((sum, company) => sum + company.current_users, 0)
      const totalRevenue = companiesData.reduce((sum, company) => {
        const planRevenue = {
          'basic': 299,
          'premium': 599,
          'enterprise': 1299
        }
        return sum + (planRevenue[company.subscription_plan.toLowerCase()] || 0)
      }, 0)
      
      setPlatformStats({
        totalCompanies: companiesData.length,
        totalUsers: totalUsers,
        activeCompanies: companiesData.filter(c => c.is_active).length,
        monthlyRevenue: totalRevenue,
        avgUsersPerCompany: Math.round(totalUsers / companiesData.length),
        growthRate: 12.5 // This would come from historical data
      })
      
    } catch (err) {
      setError('Failed to load platform data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCompany = async (companyData) => {
    try {
      await apiCall('/api/companies', {
        method: 'POST',
        body: JSON.stringify(companyData)
      })
      
      setShowCreateCompany(false)
      await loadPlatformData() // Refresh data
      
    } catch (err) {
      setError('Failed to create company: ' + err.message)
    }
  }

  const handleDeleteCompany = async (companyId) => {
    if (!confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      return
    }
    
    try {
      await apiCall(`/api/companies/${companyId}`, {
        method: 'DELETE'
      })
      
      await loadPlatformData() // Refresh data
      
    } catch (err) {
      setError('Failed to delete company: ' + err.message)
    }
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && company.is_active) ||
                         (filterStatus === 'inactive' && !company.is_active)
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (isActive) => {
    return isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
  }

  const getPlanColor = (plan) => {
    switch (plan.toLowerCase()) {
      case 'enterprise': return 'text-purple-600 bg-purple-100'
      case 'premium': return 'text-blue-600 bg-blue-100'
      case 'basic': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading platform data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hugo Platform Administration</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user?.first_name}! Manage the entire Hugo platform from here.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => loadPlatformData()}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowCreateCompany(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Company</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Platform Overview', icon: BarChart3 },
              { id: 'companies', name: 'Companies', icon: Building2 },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp },
              { id: 'system', name: 'System Health', icon: Activity },
              { id: 'settings', name: 'Platform Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Companies</p>
                    <p className="text-2xl font-semibold text-gray-900">{platformStats.totalCompanies}</p>
                    <p className="text-xs text-green-600">+{platformStats.activeCompanies} active</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">{platformStats.totalUsers?.toLocaleString()}</p>
                    <p className="text-xs text-blue-600">~{platformStats.avgUsersPerCompany} per company</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">€{platformStats.monthlyRevenue?.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+{platformStats.growthRate}% growth</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Platform Health</p>
                    <p className="text-2xl font-semibold text-green-600">Excellent</p>
                    <p className="text-xs text-gray-500">All systems operational</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Platform Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">New company registered: Innovation Hub</span>
                    <span className="text-xs text-gray-400">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">156 assessments completed this week</span>
                    <span className="text-xs text-gray-400">Today</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Revenue increased by 8.3% this month</span>
                    <span className="text-xs text-gray-400">Yesterday</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">2 companies approaching user limits</span>
                    <span className="text-xs text-gray-400">3 days ago</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowCreateCompany(true)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                  >
                    <Plus className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900">Add Company</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                  >
                    <BarChart3 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900">View Analytics</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('system')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                  >
                    <Activity className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900">System Health</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                  >
                    <Settings className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900">Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">
                {filteredCompanies.length} of {companies.length} companies
              </div>
            </div>

            {/* Companies Table */}
            <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{company.name}</div>
                            <div className="text-sm text-gray-500">{company.domain || 'No domain'}</div>
                            <div className="text-xs text-gray-400">{company.contact_person}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(company.subscription_plan)}`}>
                            {company.subscription_plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{company.current_users}/{company.max_users}</div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full" 
                              style={{ width: `${(company.current_users / company.max_users) * 100}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(company.is_active)}`}>
                            {company.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(company.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => setSelectedCompany(company)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCompany(company.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete company"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Analytics</h3>
              <p className="text-gray-600">Detailed analytics dashboard coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-green-900">Database</div>
                  <div className="text-xs text-green-600">Operational</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-green-900">API Services</div>
                  <div className="text-xs text-green-600">Operational</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-green-900">Email Service</div>
                  <div className="text-xs text-green-600">Operational</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Settings</h3>
              <p className="text-gray-600">Platform configuration options coming soon...</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Company Modal */}
      {showCreateCompany && (
        <CreateCompanyModal 
          onClose={() => setShowCreateCompany(false)}
          onSubmit={handleCreateCompany}
        />
      )}

      {/* Company Details Modal */}
      {selectedCompany && (
        <CompanyDetailsModal 
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  )
}

// Create Company Modal Component
function CreateCompanyModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    subscription_plan: 'basic',
    max_users: 50,
    contact_person: '',
    billing_email: '',
    phone: '',
    address: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Company</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
            <input
              type="text"
              value={formData.domain}
              onChange={(e) => setFormData({...formData, domain: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
            <select
              value={formData.subscription_plan}
              onChange={(e) => setFormData({...formData, subscription_plan: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
            <input
              type="text"
              required
              value={formData.contact_person}
              onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Billing Email</label>
            <input
              type="email"
              required
              value={formData.billing_email}
              onChange={(e) => setFormData({...formData, billing_email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Company
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Company Details Modal Component
function CompanyDetailsModal({ company, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Company Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Company Name</label>
            <p className="text-sm text-gray-900">{company.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Domain</label>
            <p className="text-sm text-gray-900">{company.domain || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Plan</label>
            <p className="text-sm text-gray-900">{company.subscription_plan}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Users</label>
            <p className="text-sm text-gray-900">{company.current_users}/{company.max_users}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Contact Person</label>
            <p className="text-sm text-gray-900">{company.contact_person}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Billing Email</label>
            <p className="text-sm text-gray-900">{company.billing_email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Status</label>
            <p className="text-sm text-gray-900">{company.is_active ? 'Active' : 'Inactive'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Created</label>
            <p className="text-sm text-gray-900">{new Date(company.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
