import React, { useState, useEffect } from 'react'
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
    { name: 'Product Development', synergy: 85, members: 8, efficiency: 92 },
    { name: 'Marketing', synergy: 72, members: 6, efficiency: 78 },
    { name: 'Sales', synergy: 88, members: 10, efficiency: 85 },
    { name: 'Engineering', synergy: 91, members: 12, efficiency: 94 },
    { name: 'Design', synergy: 76, members: 5, efficiency: 82 },
    { name: 'HR', synergy: 83, members: 4, efficiency: 88 }
  ],
  trends: {
    assessmentCompletion: [
      { month: 'Jan', completed: 12 },
      { month: 'Feb', completed: 18 },
      { month: 'Mar', completed: 25 },
      { month: 'Apr', completed: 32 },
      { month: 'May', completed: 28 },
      { month: 'Jun', completed: 27 }
    ],
    teamSynergy: [
      { month: 'Jan', synergy: 72 },
      { month: 'Feb', synergy: 75 },
      { month: 'Mar', synergy: 78 },
      { month: 'Apr', synergy: 76 },
      { month: 'May', synergy: 79 },
      { month: 'Jun', synergy: 78 }
    ]
  }
}

function getDimensionColor(dimension) {
  const colors = {
    'Vision': 'bg-blue-500',
    'Innovation': 'bg-purple-500',
    'Expertise': 'bg-green-500',
    'Connection': 'bg-orange-500'
  }
  return colors[dimension] || 'bg-gray-500'
}

function getDimensionIcon(dimension) {
  const icons = {
    'Vision': Target,
    'Innovation': Lightbulb,
    'Expertise': BookOpen,
    'Connection': Heart
  }
  const IconComponent = icons[dimension] || Brain
  return <IconComponent className="h-4 w-4" />
}

export default function AnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months')
  const [selectedDimension, setSelectedDimension] = useState('all')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your organization's personality dynamics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
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
            <CardTitle className="text-sm font-medium">Completed Assessments</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalyticsData.overview.completedAssessments}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockAnalyticsData.overview.completedAssessments / mockAnalyticsData.overview.totalEmployees) * 100)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Avg. Team Synergy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalyticsData.overview.avgTeamSynergy}%</div>
            <p className="text-xs text-muted-foreground">
              +3% from last quarter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personality">Personality Distribution</TabsTrigger>
          <TabsTrigger value="teams">Team Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personality Dimensions */}
            <Card>
              <CardHeader>
                <CardTitle>Personality Dimensions</CardTitle>
                <CardDescription>Distribution across the four Hugo dimensions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(mockAnalyticsData.personalityDistribution).map(([dimension, data]) => (
                  <div key={dimension} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getDimensionIcon(dimension.charAt(0).toUpperCase() + dimension.slice(1))}
                        <span className="font-medium capitalize">{dimension}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{data.count} people</span>
                        <Badge variant="secondary">{data.percentage}%</Badge>
                      </div>
                    </div>
                    <Progress value={data.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Performing Teams */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Teams</CardTitle>
                <CardDescription>Teams with highest synergy scores</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAnalyticsData.teamPerformance
                  .sort((a, b) => b.synergy - a.synergy)
                  .slice(0, 5)
                  .map((team, index) => (
                    <div key={team.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{team.name}</div>
                          <div className="text-sm text-gray-600">{team.members} members</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={team.synergy} className="w-16 h-2" />
                        <span className="text-sm font-semibold">{team.synergy}%</span>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="personality" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hugo Types Distribution */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Hugo Types Distribution</CardTitle>
                <CardDescription>Breakdown of all 12 Hugo personality types in your organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mockAnalyticsData.hugoTypes.map((type) => (
                    <div key={type.code} className="text-center p-4 border rounded-lg hover:bg-gray-50">
                      <Avatar className="mx-auto mb-2">
                        <AvatarFallback className={`${getDimensionColor(type.dimension)} text-white text-sm font-bold`}>
                          {type.code}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium text-sm">{type.name}</div>
                      <div className="text-xs text-gray-600 mb-1">{type.dimension}</div>
                      <div className="text-lg font-bold text-blue-600">{type.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dimension Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Dimension Insights</CardTitle>
                <CardDescription>Key observations about your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Vision Dominant</span>
                  </div>
                  <p className="text-sm text-blue-800">32% of your team are Vision types, indicating strong strategic thinking capabilities.</p>
                </div>
                
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-900">Connection Gap</span>
                  </div>
                  <p className="text-sm text-orange-800">Only 16% Connection types. Consider hiring more collaborative personalities.</p>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">Balanced Expertise</span>
                  </div>
                  <p className="text-sm text-green-800">Good distribution of Expertise types across departments.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Analysis</CardTitle>
              <CardDescription>Detailed breakdown of team synergy and efficiency metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.teamPerformance.map((team) => (
                  <div key={team.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{team.name}</h3>
                        <p className="text-sm text-gray-600">{team.members} team members</p>
                      </div>
                      <Badge 
                        variant={team.synergy >= 85 ? "default" : team.synergy >= 75 ? "secondary" : "destructive"}
                      >
                        {team.synergy >= 85 ? "Excellent" : team.synergy >= 75 ? "Good" : "Needs Improvement"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Team Synergy</span>
                          <span className="text-sm font-semibold">{team.synergy}%</span>
                        </div>
                        <Progress value={team.synergy} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Efficiency</span>
                          <span className="text-sm font-semibold">{team.efficiency}%</span>
                        </div>
                        <Progress value={team.efficiency} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Completion Trend</CardTitle>
                <CardDescription>Monthly assessment completions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalyticsData.trends.assessmentCompletion.map((item, index) => (
                    <div key={item.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.month}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(item.completed / 35) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{item.completed}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Synergy Trend</CardTitle>
                <CardDescription>Average team synergy scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalyticsData.trends.teamSynergy.map((item, index) => (
                    <div key={item.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.month}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${item.synergy}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{item.synergy}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
