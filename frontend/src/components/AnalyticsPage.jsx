import React, { useState } from 'react';
import { useAuth } from '../contexts/RoleBasedAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx'
import { Button } from '@/components/ui/button.jsx'
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Target,
  Brain,
  Lightbulb,
  BookOpen,
  Heart,
  Download,
  Filter,
  Calendar,
  PieChart,
  Activity
} from 'lucide-react'

// Mock data for analytics
const mockAnalyticsData = {
  overview: {
    totalEmployees: 156,
    completedAssessments: 142,
    activeTeams: 12,
    avgTeamSynergy: 78
  },
  personalityDistribution: {
    vision: { count: 45, percentage: 32 },
    innovation: { count: 38, percentage: 27 },
    expertise: { count: 35, percentage: 25 },
    connection: { count: 24, percentage: 16 }
  },
  hugoTypes: [
    { code: 'V1', name: 'Pathfinder', count: 18, dimension: 'Vision' },
    { code: 'V2', name: 'Developer', count: 15, dimension: 'Vision' },
    { code: 'V3', name: 'Organizer', count: 12, dimension: 'Vision' },
    { code: 'I1', name: 'Innovator', count: 14, dimension: 'Innovation' },
    { code: 'I2', name: 'Creator', count: 13, dimension: 'Innovation' },
    { code: 'I3', name: 'Experimenter', count: 11, dimension: 'Innovation' },
    { code: 'E1', name: 'Specialist', count: 13, dimension: 'Expertise' },
    { code: 'E2', name: 'Analyst', count: 12, dimension: 'Expertise' },
    { code: 'E3', name: 'Advisor', count: 10, dimension: 'Expertise' },
    { code: 'C1', name: 'Connector', count: 9, dimension: 'Connection' },
    { code: 'C2', name: 'Facilitator', count: 8, dimension: 'Connection' },
    { code: 'C3', name: 'Supporter', count: 7, dimension: 'Connection' }
  ],
  teamPerformance: [
    { name: 'Product Development', synergy: 85, members: 8, productivity: 92 },
    { name: 'Marketing', synergy: 78, members: 6, productivity: 88 },
    { name: 'Sales', synergy: 82, members: 10, productivity: 90 },
    { name: 'Engineering', synergy: 88, members: 12, productivity: 94 },
    { name: 'Design', synergy: 75, members: 5, productivity: 85 },
    { name: 'HR', synergy: 80, members: 4, productivity: 87 }
  ],
  trends: {
    assessmentCompletion: [
      { month: 'Jan', completed: 12, total: 15 },
      { month: 'Feb', completed: 18, total: 20 },
      { month: 'Mar', completed: 25, total: 28 },
      { month: 'Apr', completed: 32, total: 35 },
      { month: 'May', completed: 28, total: 30 },
      { month: 'Jun', completed: 27, total: 28 }
    ]
  }
};

const dimensionColors = {
  Vision: 'bg-blue-100 text-blue-800',
  Innovation: 'bg-purple-100 text-purple-800',
  Expertise: 'bg-green-100 text-green-800',
  Connection: 'bg-orange-100 text-orange-800'
};

const dimensionIcons = {
  Vision: Target,
  Innovation: Lightbulb,
  Expertise: BookOpen,
  Connection: Heart
};

const AnalyticsPage = ({ onBack }) => {
  const { user, logout } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const getCompletionRate = () => {
    const { totalEmployees, completedAssessments } = mockAnalyticsData.overview;
    return Math.round((completedAssessments / totalEmployees) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Hamburger Menu */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Back Button and Title */}
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-900">Analytics & Reports</h1>
            </div>
            
            {/* User Info and Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.first_name} {user?.last_name}
              </span>
              
              {/* Hamburger Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hugo Analytics Dashboard</h1>
              <p className="text-gray-600">Insights into personality types, team dynamics, and organizational patterns</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Last 6 months
              </Button>
              <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalyticsData.overview.totalEmployees}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assessments Completed</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalyticsData.overview.completedAssessments}</div>
                <p className="text-xs text-muted-foreground">
                  {getCompletionRate()}% completion rate
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalyticsData.overview.activeTeams}</div>
                <p className="text-xs text-muted-foreground">
                  +2 new teams this month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Team Synergy</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalyticsData.overview.avgTeamSynergy}%</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last quarter
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Analytics Tabs */}
          <Tabs defaultValue="personality" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personality">Personality Distribution</TabsTrigger>
              <TabsTrigger value="teams">Team Performance</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personality" className="space-y-6">
              {/* Dimension Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Hugo Dimension Distribution</CardTitle>
                  <CardDescription>
                    Overview of personality dimensions across the organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(mockAnalyticsData.personalityDistribution).map(([dimension, data]) => {
                      const Icon = dimensionIcons[dimension.charAt(0).toUpperCase() + dimension.slice(1)];
                      return (
                        <div key={dimension} className="text-center space-y-2">
                          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <Icon className="h-8 w-8 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium capitalize">{dimension}</p>
                            <p className="text-2xl font-bold">{data.count}</p>
                            <p className="text-sm text-gray-500">{data.percentage}%</p>
                          </div>
                          <Progress value={data.percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Hugo Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Hugo Type Breakdown</CardTitle>
                  <CardDescription>
                    Detailed distribution of all 12 Hugo personality types
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockAnalyticsData.hugoTypes.map(type => (
                      <div key={type.code} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="font-bold text-sm">{type.code}</span>
                          </div>
                          <div>
                            <p className="font-medium">{type.name}</p>
                            <Badge className={dimensionColors[type.dimension]} variant="secondary">
                              {type.dimension}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{type.count}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round((type.count / mockAnalyticsData.overview.completedAssessments) * 100)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="teams" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Performance Overview</CardTitle>
                  <CardDescription>
                    Synergy scores and productivity metrics for all teams
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalyticsData.teamPerformance.map(team => (
                      <div key={team.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{team.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{team.name}</p>
                            <p className="text-sm text-gray-500">{team.members} members</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Synergy</p>
                            <p className="text-lg font-bold text-blue-600">{team.synergy}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Productivity</p>
                            <p className="text-lg font-bold text-green-600">{team.productivity}%</p>
                          </div>
                          <div className="w-24">
                            <Progress value={team.synergy} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Completion Trends</CardTitle>
                  <CardDescription>
                    Monthly progress of Hugo personality assessments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalyticsData.trends.assessmentCompletion.map(month => (
                      <div key={month.month} className="flex items-center justify-between">
                        <span className="font-medium">{month.month}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            {month.completed}/{month.total}
                          </span>
                          <div className="w-32">
                            <Progress value={(month.completed / month.total) * 100} className="h-2" />
                          </div>
                          <span className="text-sm font-medium">
                            {Math.round((month.completed / month.total) * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">Strong Vision Leadership</p>
                      <p className="text-xs text-blue-700">
                        32% of employees are Vision-types, indicating strong strategic thinking capabilities.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm font-medium text-orange-900">Connection Gap</p>
                      <p className="text-xs text-orange-700">
                        Only 16% are Connection-types. Consider hiring more collaborative personalities.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-900">High Team Synergy</p>
                      <p className="text-xs text-green-700">
                        Average team synergy of 78% indicates well-balanced team compositions.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 border-l-4 border-blue-500 bg-gray-50">
                      <p className="text-sm font-medium">Enhance Collaboration</p>
                      <p className="text-xs text-gray-600">
                        Recruit more Connection-type personalities to improve cross-team communication.
                      </p>
                    </div>
                    
                    <div className="p-3 border-l-4 border-purple-500 bg-gray-50">
                      <p className="text-sm font-medium">Innovation Focus</p>
                      <p className="text-xs text-gray-600">
                        Leverage the strong Innovation dimension (27%) for new product development.
                      </p>
                    </div>
                    
                    <div className="p-3 border-l-4 border-green-500 bg-gray-50">
                      <p className="text-sm font-medium">Team Optimization</p>
                      <p className="text-xs text-gray-600">
                        Consider rebalancing teams with lower synergy scores (&lt;75%).
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
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

export default AnalyticsPage;
