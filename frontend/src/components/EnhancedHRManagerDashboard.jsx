import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/RoleBasedAuthContext'
import { 
  Users, 
  UserPlus, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Target, 
  Award, 
  AlertTriangle,
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Send,
  Download,
  Upload,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Star,
  MessageSquare,
  FileText,
  Shield,
  RefreshCw,
  Building2
} from 'lucide-react'

export default function EnhancedHRManagerDashboard() {
  const { apiCall, user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [teams, setTeams] = useState([])
  const [assessments, setAssessments] = useState([])
  const [companyStats, setCompanyStats] = useState({})
  const [companyInfo, setCompanyInfo] = useState({})
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [showSendAssessment, setShowSendAssessment] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterHugoType, setFilterHugoType] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCompanyData()
  }, [])

  const loadCompanyData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Load company info
      if (user?.company_id) {
        const company = await apiCall(`/api/companies/${user.company_id}`)
        setCompanyInfo(company)
        
        // Load users in the company
        const usersData = await apiCall(`/api/users?company_id=${user.company_id}`)
        setUsers(usersData)
        
        // Calculate company stats
        const activeUsers = usersData.filter(u => u.is_active).length
        const completedAssessments = usersData.filter(u => u.hugo_type).length
        const pendingAssessments = usersData.filter(u => !u.hugo_type).length
        
        setCompanyStats({
          totalUsers: usersData.length,
          activeUsers: activeUsers,
          completedAssessments: completedAssessments,
          pendingAssessments: pendingAssessments,
          assessmentCompletionRate: usersData.length > 0 ? (completedAssessments / usersData.length * 100).toFixed(1) : 0,
          departments: [...new Set(usersData.map(u => u.department).filter(Boolean))].length,
          recentHires: usersData.filter(u => {
            const hireDate = new Date(u.created_at)
            const thirtyDaysAgo = new Date()
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
            return hireDate > thirtyDaysAgo
          }).length
        })
      }
      
    } catch (err) {
      setError('Failed to load company data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (userData) => {
    try {
      await apiCall('/api/users', {
        method: 'POST',
        body: JSON.stringify({
          ...userData,
          company_id: user.company_id,
          role: 'user'
        })
      })
      
      setShowCreateUser(false)
      await loadCompanyData() // Refresh data
      
    } catch (err) {
      setError('Failed to create user: ' + err.message)
    }
  }

  const handleSendAssessment = async (assessmentData) => {
    try {
      await apiCall('/api/chat-assessment/invitations', {
        method: 'POST',
        body: JSON.stringify({
          ...assessmentData,
          company_name: companyInfo.name,
          sender_name: `${user.first_name} ${user.last_name}`
        })
      })
      
      setShowSendAssessment(false)
      // Could add to assessments tracking here
      
    } catch (err) {
      setError('Failed to send assessment: ' + err.message)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || user.department === filterDepartment
    const matchesHugoType = filterHugoType === 'all' || user.hugo_type === filterHugoType
    return matchesSearch && matchesDepartment && matchesHugoType
  })

  const getHugoTypeColor = (type) => {
    if (!type) return 'text-gray-600 bg-gray-100'
    const dimension = type.charAt(0)
    switch (dimension) {
      case 'V': return 'text-blue-600 bg-blue-100'
      case 'I': return 'text-yellow-600 bg-yellow-100'
      case 'E': return 'text-green-600 bg-green-100'
      case 'C': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (isActive) => {
    return isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading company data...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">{companyInfo.name} - HR Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user?.first_name}! Manage your team and assessments.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => loadCompanyData()}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowSendAssessment(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Assessment</span>
              </button>
              <button 
                onClick={() => setShowCreateUser(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
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
              { id: 'overview', name: 'Company Overview', icon: BarChart3 },
              { id: 'users', name: 'Team Members', icon: Users },
              { id: 'assessments', name: 'Assessments', icon: FileText },
              { id: 'analytics', name: 'Team Analytics', icon: TrendingUp },
              { id: 'settings', name: 'Company Settings', icon: Settings }
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
            {/* Company Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Team Members</p>
                    <p className="text-2xl font-semibold text-gray-900">{companyStats.totalUsers}</p>
                    <p className="text-xs text-green-600">{companyStats.activeUsers} active</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Completed Assessments</p>
                    <p className="text-2xl font-semibold text-gray-900">{companyStats.completedAssessments}</p>
                    <p className="text-xs text-blue-600">{companyStats.assessmentCompletionRate}% completion rate</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Pending Assessments</p>
                    <p className="text-2xl font-semibold text-gray-900">{companyStats.pendingAssessments}</p>
                    <p className="text-xs text-yellow-600">Awaiting completion</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Building2 className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Departments</p>
                    <p className="text-2xl font-semibold text-gray-900">{companyStats.departments}</p>
                    <p className="text-xs text-purple-600">{companyStats.recentHires} recent hires</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Company Name</span>
                    <span className="text-sm font-medium text-gray-900">{companyInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Domain</span>
                    <span className="text-sm font-medium text-gray-900">{companyInfo.domain || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Subscription Plan</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{companyInfo.subscription_plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">User Limit</span>
                    <span className="text-sm font-medium text-gray-900">{companyInfo.current_users}/{companyInfo.max_users}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Contact Person</span>
                    <span className="text-sm font-medium text-gray-900">{companyInfo.contact_person}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowCreateUser(true)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                  >
                    <UserPlus className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900">Add Team Member</span>
                  </button>
                  <button 
                    onClick={() => setShowSendAssessment(true)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                  >
                    <Send className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900">Send Assessment</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                  >
                    <BarChart3 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900">View Analytics</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                  >
                    <Settings className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900">Company Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Departments</option>
                  {[...new Set(users.map(u => u.department).filter(Boolean))].map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <select
                  value={filterHugoType}
                  onChange={(e) => setFilterHugoType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Hugo Types</option>
                  {[...new Set(users.map(u => u.hugo_type).filter(Boolean))].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-500">
                {filteredUsers.length} of {users.length} team members
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Member</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hugo Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <div className="text-xs text-gray-400">{user.position}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.department || 'Not assigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.hugo_type ? (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHugoTypeColor(user.hugo_type)}`}>
                              {user.hugo_type}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500">Assessment pending</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.is_active)}`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => setSelectedUser(user)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              className="text-gray-600 hover:text-gray-900"
                              title="Edit user"
                            >
                              <Edit className="w-4 h-4" />
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

        {activeTab === 'assessments' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assessment Management</h3>
              <p className="text-gray-600">Assessment tracking and management features coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Team Analytics</h3>
              <p className="text-gray-600">Detailed team analytics dashboard coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company Settings</h3>
              <p className="text-gray-600">Company configuration options coming soon...</p>
            </div>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateUser && (
        <CreateUserModal 
          onClose={() => setShowCreateUser(false)}
          onSubmit={handleCreateUser}
        />
      )}

      {/* Send Assessment Modal */}
      {showSendAssessment && (
        <SendAssessmentModal 
          onClose={() => setShowSendAssessment(false)}
          onSubmit={handleSendAssessment}
        />
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal 
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  )
}

// Create User Modal Component
function CreateUserModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    department: '',
    position: '',
    phone: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add Team Member</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
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
              Add Team Member
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Send Assessment Modal Component
function SendAssessmentModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    participant_email: '',
    participant_name: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Send Assessment Invitation</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Participant Name</label>
            <input
              type="text"
              required
              value={formData.participant_name}
              onChange={(e) => setFormData({...formData, participant_name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.participant_email}
              onChange={(e) => setFormData({...formData, participant_email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              The participant will receive an email with a link to start their Hugo personality assessment.
              The assessment takes about 15-20 minutes to complete.
            </p>
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// User Details Modal Component
function UserDetailsModal({ user, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Team Member Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Name</label>
            <p className="text-sm text-gray-900">{user.first_name} {user.last_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="text-sm text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Department</label>
            <p className="text-sm text-gray-900">{user.department || 'Not assigned'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Position</label>
            <p className="text-sm text-gray-900">{user.position || 'Not assigned'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Hugo Type</label>
            <p className="text-sm text-gray-900">{user.hugo_type || 'Assessment pending'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Cultural Background</label>
            <p className="text-sm text-gray-900">{user.cultural_background || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Status</label>
            <p className="text-sm text-gray-900">{user.is_active ? 'Active' : 'Inactive'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Last Login</label>
            <p className="text-sm text-gray-900">
              {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
