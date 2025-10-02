import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/RoleBasedAuthContext';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { 
  Users, 
  Building2,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  Lightbulb,
  Globe,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import API_BASE_URL from '../config/api';
import { TeamStatisticsDashboard } from './TeamVisualization';
import { 
  CompatibilityMatrixGrid, 
  TeamCompatibilitySummary,
  CulturalDimensionsAnalysis,
  TeamCommunicationTips
} from './TeamCompatibilityMatrix';

const hugoTypes = {
  'V1': { name: 'Pathfinder', color: 'bg-blue-100 text-blue-800', dimension: 'Vision' },
  'V2': { name: 'Visionary', color: 'bg-blue-200 text-blue-900', dimension: 'Vision' },
  'V3': { name: 'Strategist', color: 'bg-blue-300 text-blue-900', dimension: 'Vision' },
  'I1': { name: 'Creator', color: 'bg-purple-100 text-purple-800', dimension: 'Innovation' },
  'I2': { name: 'Innovator', color: 'bg-purple-200 text-purple-900', dimension: 'Innovation' },
  'I3': { name: 'Catalyst', color: 'bg-purple-300 text-purple-900', dimension: 'Innovation' },
  'E1': { name: 'Expert', color: 'bg-green-100 text-green-800', dimension: 'Expertise' },
  'E2': { name: 'Specialist', color: 'bg-green-200 text-green-900', dimension: 'Expertise' },
  'E3': { name: 'Analyst', color: 'bg-green-300 text-green-900', dimension: 'Expertise' },
  'C1': { name: 'Networker', color: 'bg-orange-100 text-orange-800', dimension: 'Connection' },
  'C2': { name: 'Collaborator', color: 'bg-orange-200 text-orange-900', dimension: 'Connection' },
  'C3': { name: 'Connector', color: 'bg-orange-300 text-orange-900', dimension: 'Connection' }
};

const HRTeamAnalyticsDashboard = ({ onBack }) => {
  const { user, logout } = useAuth();
  const [companyStats, setCompanyStats] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamAnalysis, setTeamAnalysis] = useState(null);
  const [teamDetails, setTeamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch company statistics
      const statsResponse = await fetch(`${API_BASE_URL}/companies/${user.company_id}/stats`);
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setCompanyStats(stats);
      }
      
      // Fetch all teams
      const teamsResponse = await fetch(`${API_BASE_URL}/companies/${user.company_id}/teams`);
      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json();
        setTeams(teamsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamDetails = async (teamId) => {
    try {
      // Fetch team details
      const detailsResponse = await fetch(`${API_BASE_URL}/teams/${teamId}`);
      if (detailsResponse.ok) {
        const details = await detailsResponse.json();
        setTeamDetails(details);
      }
      
      // Fetch team analysis
      const analysisResponse = await fetch(`${API_BASE_URL}/teams/${teamId}/analysis`);
      if (analysisResponse.ok) {
        const analysis = await analysisResponse.json();
        setTeamAnalysis(analysis);
      }
      
      setSelectedTeam(teamId);
      setActiveView('team-detail');
    } catch (error) {
      console.error('Error fetching team details:', error);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Team Analytics</h1>
                <p className="text-xs text-gray-500">Comprehensive team insights and analysis</p>
              </div>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                {user?.first_name} {user?.last_name}
              </span>
              
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <div className="px-4 py-3 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user?.first_name} {user?.last_name}</div>
                      <div className="text-gray-500 truncate">{user?.email}</div>
                      <div className="text-xs text-blue-600 mt-1">HR Manager</div>
                    </div>
                    <button
                      onClick={() => setActiveView('overview')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Activity className="inline h-4 w-4 mr-2" />
                      Dashboard Overview
                    </button>
                    {onBack && (
                      <button
                        onClick={onBack}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <ArrowLeft className="inline h-4 w-4 mr-2" />
                        Back to Main Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="inline h-4 w-4 mr-2" />
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
        {activeView === 'overview' ? (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Employees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-gray-900">
                        {companyStats?.total_users || 0}
                      </span>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Active team members</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Teams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-gray-900">
                        {teams.length}
                      </span>
                      <Target className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Operational teams</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Avg Team Synergy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-green-600">
                        {teams.length > 0 
                          ? Math.round(teams.reduce((sum, t) => sum + (t.synergy_score || 0), 0) / teams.length * 100)
                          : 0}%
                      </span>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Across all teams</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Assessments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-gray-900">
                        {companyStats?.completed_assessments || 0}
                      </span>
                      <Award className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Completed profiles</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Teams List */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Teams</h2>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create New Team
                </Button>
              </div>
              
              {teams.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No teams yet</h3>
                    <p className="text-gray-600 mb-6">Create your first team to start building high-performing groups</p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create First Team
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teams.map(team => (
                    <Card 
                      key={team.id} 
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => fetchTeamDetails(team.id)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{team.name}</CardTitle>
                            <CardDescription className="mt-1 line-clamp-2">
                              {team.description || 'No description'}
                            </CardDescription>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Members</span>
                            <span className="font-medium">{team.member_count || 0}</span>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Team Synergy</span>
                              <span className="font-medium">
                                {Math.round((team.synergy_score || 0) * 100)}%
                              </span>
                            </div>
                            <Progress value={(team.synergy_score || 0) * 100} className="h-2" />
                          </div>
                          
                          <div className="pt-2">
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                fetchTeamDetails(team.id);
                              }}
                            >
                              <BarChart3 className="h-4 w-4 mr-2" />
                              View Analytics
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Company-wide Insights */}
            {companyStats && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Insights</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-blue-600" />
                        Personality Distribution
                      </CardTitle>
                      <CardDescription>
                        Hugo personality types across your organization
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {companyStats.dimension_distribution && Object.entries(companyStats.dimension_distribution).map(([dimension, count]) => (
                          <div key={dimension} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{dimension}</span>
                              <span className="text-gray-600">
                                {count} ({Math.round(count / companyStats.total_users * 100)}%)
                              </span>
                            </div>
                            <Progress value={count / companyStats.total_users * 100} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-600" />
                        Recommendations
                      </CardTitle>
                      <CardDescription>
                        Actions to improve team effectiveness
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700">
                              Review team compositions quarterly to maintain optimal balance
                            </p>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700">
                              Encourage cross-team collaboration to share diverse perspectives
                            </p>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700">
                              Provide personality-based coaching for team leaders
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        ) : activeView === 'team-detail' && teamDetails && teamAnalysis ? (
          <div className="space-y-6">
            {/* Back Button */}
            <Button 
              variant="outline" 
              onClick={() => setActiveView('overview')}
              className="mb-4"
            >
              ← Back to Overview
            </Button>

            {/* Team Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{teamDetails.name}</h1>
                  <p className="text-gray-600">{teamDetails.description}</p>
                  <div className="flex gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{teamAnalysis.total_members} members</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>{Math.round(teamAnalysis.synergy_score * 100)}% synergy</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>

            {/* Team Analytics Tabs */}
            <Tabs defaultValue="statistics" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="statistics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Statistics
                </TabsTrigger>
                <TabsTrigger value="compatibility">
                  <Users className="h-4 w-4 mr-2" />
                  Compatibility
                </TabsTrigger>
                <TabsTrigger value="cultural">
                  <Globe className="h-4 w-4 mr-2" />
                  Cultural
                </TabsTrigger>
                <TabsTrigger value="communication">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Communication
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="statistics" className="mt-6">
                <TeamStatisticsDashboard teamAnalysis={teamAnalysis} />
              </TabsContent>
              
              <TabsContent value="compatibility" className="mt-6 space-y-6">
                <TeamCompatibilitySummary members={teamDetails.members} />
                <Card>
                  <CardHeader>
                    <CardTitle>Team Compatibility Matrix</CardTitle>
                    <CardDescription>
                      Pairwise compatibility analysis between all team members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CompatibilityMatrixGrid members={teamDetails.members} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="cultural" className="mt-6">
                <CulturalDimensionsAnalysis members={teamDetails.members} />
              </TabsContent>
              
              <TabsContent value="communication" className="mt-6">
                <TeamCommunicationTips 
                  members={teamDetails.members}
                  potentialConflicts={teamAnalysis.potential_conflicts}
                />
              </TabsContent>
            </Tabs>

            {/* Team Members List */}
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  All members with their Hugo personality types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamDetails.members.map(member => {
                    const typeInfo = hugoTypes[member.hugo_type_code];
                    return (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {member.first_name?.[0]}{member.last_name?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {member.first_name} {member.last_name}
                            </p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                            {member.role && (
                              <p className="text-xs text-gray-400 mt-0.5">{member.role}</p>
                            )}
                          </div>
                        </div>
                        {typeInfo && (
                          <div className="text-right">
                            <Badge className={typeInfo.color}>
                              {member.hugo_type_code}
                            </Badge>
                            <p className="text-xs text-gray-600 mt-1">{typeInfo.name}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
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

export default HRTeamAnalyticsDashboard;
