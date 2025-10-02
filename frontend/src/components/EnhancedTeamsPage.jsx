import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/RoleBasedAuthContext';
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Lightbulb,
  BookOpen,
  Heart,
  Brain,
  ArrowRight,
  BarChart3,
  MessageSquare,
  Settings,
  PieChart,
  Activity,
  Award
} from 'lucide-react'
import API_BASE_URL from '../config/api';

// Hugo personality type configuration
const hugoTypes = {
  'V1': { name: 'Pathfinder', color: 'bg-blue-100 text-blue-800', dimension: 'Vision', description: 'Strategic thinker who sees the big picture' },
  'V2': { name: 'Visionary', color: 'bg-blue-200 text-blue-900', dimension: 'Vision', description: 'Future-focused leader with bold ideas' },
  'V3': { name: 'Strategist', color: 'bg-blue-300 text-blue-900', dimension: 'Vision', description: 'Systematic planner who creates roadmaps' },
  'I1': { name: 'Creator', color: 'bg-purple-100 text-purple-800', dimension: 'Innovation', description: 'Original thinker who generates new ideas' },
  'I2': { name: 'Innovator', color: 'bg-purple-200 text-purple-900', dimension: 'Innovation', description: 'Change agent who drives transformation' },
  'I3': { name: 'Catalyst', color: 'bg-purple-300 text-purple-900', dimension: 'Innovation', description: 'Energizer who sparks creativity' },
  'E1': { name: 'Expert', color: 'bg-green-100 text-green-800', dimension: 'Expertise', description: 'Deep specialist with mastery' },
  'E2': { name: 'Specialist', color: 'bg-green-200 text-green-900', dimension: 'Expertise', description: 'Focused professional with precision' },
  'E3': { name: 'Analyst', color: 'bg-green-300 text-green-900', dimension: 'Expertise', description: 'Data-driven problem solver' },
  'C1': { name: 'Networker', color: 'bg-orange-100 text-orange-800', dimension: 'Connection', description: 'Relationship builder who connects people' },
  'C2': { name: 'Collaborator', color: 'bg-orange-200 text-orange-900', dimension: 'Connection', description: 'Team player who fosters cooperation' },
  'C3': { name: 'Connector', color: 'bg-orange-300 text-orange-900', dimension: 'Connection', description: 'Bridge builder who unites groups' }
};

const dimensionColors = {
  'Vision': 'bg-blue-500',
  'Innovation': 'bg-purple-500',
  'Expertise': 'bg-green-500',
  'Connection': 'bg-orange-500'
};

const EnhancedTeamsPage = ({ onBack }) => {
  const { user, logout } = useAuth();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamAnalysis, setTeamAnalysis] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch teams on component mount
  useEffect(() => {
    fetchTeams();
    fetchAvailableUsers();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/teams/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      } else {
        console.error('Failed to fetch teams');
        setTeams([]);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Failed to load teams');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      // Fetch users from the same company
      const response = await fetch(`${API_BASE_URL}/users/company/${user.company_id}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableUsers(data);
      }
    } catch (error) {
      console.error('Error fetching available users:', error);
    }
  };

  const fetchTeamDetails = async (teamId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedTeam(data);
        
        // Fetch team analysis
        const analysisResponse = await fetch(`${API_BASE_URL}/teams/${teamId}/analysis`);
        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          setTeamAnalysis(analysisData);
        }
      }
    } catch (error) {
      console.error('Error fetching team details:', error);
    }
  };

  const createTeam = async () => {
    if (!newTeam.name.trim()) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTeam.name,
          description: newTeam.description,
          created_by: user.id
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const teamId = data.team_id;
        
        // Add selected members to the team
        for (const selectedUser of selectedUsers) {
          await fetch(`${API_BASE_URL}/teams/${teamId}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: selectedUser.id,
              role: 'member'
            })
          });
        }
        
        // Refresh teams list
        await fetchTeams();
        
        setNewTeam({ name: '', description: '' });
        setSelectedUsers([]);
        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const addMemberToTeam = async (teamId, userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          role: 'member'
        })
      });
      
      if (response.ok) {
        await fetchTeamDetails(teamId);
        setIsAddMemberDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const removeMemberFromTeam = async (teamId, userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}/members/${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchTeamDetails(teamId);
      }
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (team.description && team.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getSynergyColor = (score) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSynergyIcon = (score) => {
    if (score >= 0.8) return <CheckCircle className="h-4 w-4" />;
    if (score >= 0.6) return <AlertTriangle className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const calculatePredictedSynergy = (members) => {
    if (!members || members.length < 2) return 0;
    
    const dimensions = members.reduce((acc, member) => {
      const type = member.hugo_type_code || member.type;
      const dim = hugoTypes[type]?.dimension;
      if (dim) {
        acc[dim] = (acc[dim] || 0) + 1;
      }
      return acc;
    }, {});
    
    const dimensionCount = Object.keys(dimensions).length;
    const memberCount = members.length;
    
    // Higher synergy for balanced teams with diverse dimensions
    const balance = dimensionCount / 4; // 4 total dimensions
    const size = Math.min(memberCount / 6, 1); // Optimal team size around 6
    
    return Math.min(balance * size * 0.9 + 0.1, 1);
  };

  // Team Member Card Component
  const TeamMemberCard = ({ member, onRemove, showActions = true }) => {
    const typeInfo = hugoTypes[member.hugo_type_code || member.type];
    
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center space-x-3 flex-1">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
              {member.first_name?.[0]}{member.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {member.first_name} {member.last_name}
            </p>
            <p className="text-sm text-gray-500">{member.email}</p>
            {member.role && (
              <p className="text-xs text-gray-400 mt-0.5">{member.role}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {typeInfo && (
            <div className="text-right">
              <Badge className={`${typeInfo.color} mb-1`}>
                {member.hugo_type_code || member.type}
              </Badge>
              <p className="text-xs text-gray-600">{typeInfo.name}</p>
            </div>
          )}
          {showActions && onRemove && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onRemove}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  // Dimension Distribution Chart Component
  const DimensionChart = ({ distribution, totalMembers }) => {
    const dimensions = ['Vision', 'Innovation', 'Expertise', 'Connection'];
    
    return (
      <div className="space-y-3">
        {dimensions.map(dimension => {
          const count = distribution[dimension] || 0;
          const percentage = totalMembers > 0 ? (count / totalMembers) * 100 : 0;
          
          return (
            <div key={dimension} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{dimension}</span>
                <span className="text-gray-600">{count} ({percentage.toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`${dimensionColors[dimension]} h-2.5 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Hamburger Menu */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
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
              <div>
                <h1 className="text-xl font-bold text-gray-900">Teams Management</h1>
                <p className="text-xs text-gray-500">Build high-performing teams with Hugo</p>
              </div>
            </div>
            
            {/* User Info and Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
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
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <div className="px-4 py-3 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user?.first_name} {user?.last_name}</div>
                      <div className="text-gray-500 truncate">{user?.email}</div>
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
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Teams</h2>
              <p className="text-gray-600 mt-1">Manage teams and optimize synergy with Hugo personality insights</p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                  <DialogDescription>
                    Build a high-performing team by selecting members with complementary Hugo personality types.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="team-name">Team Name *</Label>
                    <Input
                      id="team-name"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                      placeholder="e.g., Product Development Team"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="team-description">Description</Label>
                    <Textarea
                      id="team-description"
                      value={newTeam.description}
                      onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                      placeholder="Describe the team's purpose, goals, and focus areas"
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Select Team Members</Label>
                    <div className="border rounded-lg p-3 space-y-2 max-h-80 overflow-y-auto bg-gray-50">
                      {availableUsers.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">No available users found</p>
                      ) : (
                        availableUsers.map(availableUser => {
                          const typeInfo = hugoTypes[availableUser.hugo_type];
                          return (
                            <div key={availableUser.id} className="flex items-center space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                              <input
                                type="checkbox"
                                checked={selectedUsers.some(u => u.id === availableUser.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedUsers([...selectedUsers, availableUser]);
                                  } else {
                                    setSelectedUsers(selectedUsers.filter(u => u.id !== availableUser.id));
                                  }
                                }}
                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                                  {availableUser.first_name?.[0]}{availableUser.last_name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {availableUser.first_name} {availableUser.last_name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{availableUser.email}</p>
                              </div>
                              {typeInfo && (
                                <Badge className={`${typeInfo.color} text-xs`}>
                                  {availableUser.hugo_type}
                                </Badge>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                  
                  {selectedUsers.length > 0 && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-blue-900">
                          Predicted Team Synergy
                        </p>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-600" />
                          <span className="text-2xl font-bold text-blue-600">
                            {(calculatePredictedSynergy(selectedUsers) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={calculatePredictedSynergy(selectedUsers) * 100} 
                        className="h-2 mb-2"
                      />
                      <p className="text-xs text-blue-700">
                        {selectedUsers.length} members selected • Based on Hugo personality diversity
                      </p>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsCreateDialogOpen(false);
                    setNewTeam({ name: '', description: '' });
                    setSelectedUsers([]);
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={createTeam} 
                    disabled={!newTeam.name.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Create Team
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Teams Grid */}
          {filteredTeams.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? 'Try adjusting your search criteria' : 'Create your first team to get started'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Team
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map(team => {
                const memberCount = team.members?.length || team.memberCount || 0;
                const synergyScore = team.synergy_score || 0;
                
                return (
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
                            {team.description || 'No description provided'}
                          </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Team Stats */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>{memberCount} members</span>
                          </div>
                          <div className={`flex items-center gap-1 text-sm font-medium ${getSynergyColor(synergyScore)}`}>
                            {getSynergyIcon(synergyScore)}
                            <span>{(synergyScore * 100).toFixed(0)}% synergy</span>
                          </div>
                        </div>
                        
                        {/* Synergy Progress */}
                        <div>
                          <Progress value={synergyScore * 100} className="h-2" />
                        </div>
                        
                        {/* Action Button */}
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            fetchTeamDetails(team.id);
                          }}
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Team Details Modal */}
          {selectedTeam && (
            <Dialog open={!!selectedTeam} onOpenChange={() => {
              setSelectedTeam(null);
              setTeamAnalysis(null);
            }}>
              <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedTeam.name}</DialogTitle>
                  <DialogDescription>{selectedTeam.description}</DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="members" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="members">
                      <Users className="h-4 w-4 mr-2" />
                      Members
                    </TabsTrigger>
                    <TabsTrigger value="analytics">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </TabsTrigger>
                    <TabsTrigger value="insights">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Insights
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Members Tab */}
                  <TabsContent value="members" className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Team Members ({selectedTeam.members?.length || 0})</h3>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setIsAddMemberDialogOpen(true)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Member
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {selectedTeam.members && selectedTeam.members.length > 0 ? (
                        selectedTeam.members.map(member => (
                          <TeamMemberCard
                            key={member.id}
                            member={member}
                            onRemove={() => removeMemberFromTeam(selectedTeam.id, member.user_id)}
                          />
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p>No members in this team yet</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Analytics Tab */}
                  <TabsContent value="analytics" className="space-y-6 mt-4">
                    {teamAnalysis ? (
                      <>
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium text-gray-600">Team Synergy</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold text-green-600">
                                  {(teamAnalysis.synergy_score * 100).toFixed(0)}%
                                </span>
                                <Award className="h-8 w-8 text-green-600" />
                              </div>
                              <Progress value={teamAnalysis.synergy_score * 100} className="mt-3" />
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold text-blue-600">
                                  {teamAnalysis.total_members}
                                </span>
                                <Users className="h-8 w-8 text-blue-600" />
                              </div>
                              <p className="text-xs text-gray-500 mt-3">
                                {teamAnalysis.total_members < 3 ? 'Small team' : 
                                 teamAnalysis.total_members <= 8 ? 'Optimal size' : 'Large team'}
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium text-gray-600">Diversity Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold text-purple-600">
                                  {Object.keys(teamAnalysis.dimension_distribution).length}/4
                                </span>
                                <PieChart className="h-8 w-8 text-purple-600" />
                              </div>
                              <p className="text-xs text-gray-500 mt-3">Dimensions represented</p>
                            </CardContent>
                          </Card>
                        </div>
                        
                        {/* Dimension Distribution */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Personality Dimension Distribution</CardTitle>
                            <CardDescription>
                              Balance across the four Hugo dimensions
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <DimensionChart 
                              distribution={teamAnalysis.dimension_distribution}
                              totalMembers={teamAnalysis.total_members}
                            />
                          </CardContent>
                        </Card>
                        
                        {/* Type Distribution */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Hugo Type Distribution</CardTitle>
                            <CardDescription>
                              Specific personality types in your team
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              {Object.entries(teamAnalysis.type_distribution).map(([type, count]) => {
                                const typeInfo = hugoTypes[type];
                                return (
                                  <div key={type} className="text-center p-3 border rounded-lg">
                                    <Badge className={`${typeInfo?.color} mb-2`}>
                                      {type}
                                    </Badge>
                                    <p className="text-xs text-gray-600 mb-1">{typeInfo?.name}</p>
                                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Potential Conflicts */}
                        {teamAnalysis.potential_conflicts && teamAnalysis.potential_conflicts.length > 0 && (
                          <Card className="border-orange-200 bg-orange-50">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-orange-900">
                                <AlertTriangle className="h-5 w-5" />
                                Potential Challenges
                              </CardTitle>
                              <CardDescription>
                                Areas that may require attention and facilitation
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {teamAnalysis.potential_conflicts.map((conflict, index) => (
                                  <div key={index} className="p-3 bg-white rounded-lg border border-orange-200">
                                    <div className="flex items-start gap-3">
                                      <div className="flex gap-2 mt-1">
                                        <Badge className={hugoTypes[conflict.type_a]?.color}>
                                          {conflict.type_a}
                                        </Badge>
                                        <span className="text-gray-400">↔</span>
                                        <Badge className={hugoTypes[conflict.type_b]?.color}>
                                          {conflict.type_b}
                                        </Badge>
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-orange-900 mb-1">
                                          {conflict.conflict_level} Conflict
                                        </p>
                                        <p className="text-sm text-gray-700">{conflict.tips}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Loading team analytics...</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* Insights Tab */}
                  <TabsContent value="insights" className="space-y-4 mt-4">
                    {teamAnalysis ? (
                      <>
                        {/* Recommendations */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Target className="h-5 w-5 text-blue-600" />
                              Recommendations
                            </CardTitle>
                            <CardDescription>
                              Suggestions to improve team performance and balance
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {teamAnalysis.recommendations && teamAnalysis.recommendations.length > 0 ? (
                              <div className="space-y-3">
                                {teamAnalysis.recommendations.map((recommendation, index) => (
                                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-700">{recommendation}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No specific recommendations at this time</p>
                            )}
                          </CardContent>
                        </Card>
                        
                        {/* Communication Tips */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <MessageSquare className="h-5 w-5 text-green-600" />
                              Communication Tips
                            </CardTitle>
                            <CardDescription>
                              Best practices for effective team communication
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {teamAnalysis.communication_tips && teamAnalysis.communication_tips.length > 0 ? (
                              <div className="space-y-3">
                                {teamAnalysis.communication_tips.map((tip, index) => (
                                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-700">{tip}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No specific communication tips available</p>
                            )}
                          </CardContent>
                        </Card>
                        
                        {/* Team Strengths */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Award className="h-5 w-5 text-purple-600" />
                              Team Strengths
                            </CardTitle>
                            <CardDescription>
                              Key advantages based on personality composition
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {Object.entries(teamAnalysis.dimension_distribution).map(([dimension, count]) => {
                                const percentage = (count / teamAnalysis.total_members) * 100;
                                let strength = '';
                                
                                if (dimension === 'Vision' && percentage >= 25) {
                                  strength = 'Strong strategic thinking and long-term planning capabilities';
                                } else if (dimension === 'Innovation' && percentage >= 25) {
                                  strength = 'High creativity and ability to generate novel solutions';
                                } else if (dimension === 'Expertise' && percentage >= 25) {
                                  strength = 'Deep knowledge and analytical problem-solving skills';
                                } else if (dimension === 'Connection' && percentage >= 25) {
                                  strength = 'Excellent collaboration and relationship-building abilities';
                                }
                                
                                if (strength) {
                                  return (
                                    <div key={dimension} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                      <Heart className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium text-purple-900">{dimension}</p>
                                        <p className="text-sm text-gray-700">{strength}</p>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <Brain className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Loading team insights...</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          )}
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

export default EnhancedTeamsPage;
