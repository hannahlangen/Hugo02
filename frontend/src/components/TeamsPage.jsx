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
  Settings
} from 'lucide-react'

// Mock data for teams and available users
const mockTeams = [
  {
    id: '1',
    name: 'Product Development Team',
    description: 'Core product development and innovation team',
    memberCount: 6,
    synergyScore: 0.85,
    status: 'active',
    created: '2024-01-15',
    members: [
      { id: '1', name: 'Max Mustermann', email: 'max@company.com', type: 'V1', typeName: 'Pathfinder', dimension: 'Vision', role: 'Team Lead' },
      { id: '2', name: 'Anna Schmidt', email: 'anna@company.com', type: 'I2', typeName: 'Innovator', dimension: 'Innovation', role: 'Developer' },
      { id: '3', name: 'Tom Weber', email: 'tom@company.com', type: 'E1', typeName: 'Expert', dimension: 'Expertise', role: 'Senior Developer' },
      { id: '4', name: 'Lisa Mueller', email: 'lisa@company.com', type: 'C3', typeName: 'Connector', dimension: 'Connection', role: 'UX Designer' },
      { id: '5', name: 'Sarah Johnson', email: 'sarah@company.com', type: 'V2', typeName: 'Visionary', dimension: 'Vision', role: 'Product Manager' },
      { id: '6', name: 'Mike Chen', email: 'mike@company.com', type: 'I1', typeName: 'Creator', dimension: 'Innovation', role: 'Designer' }
    ]
  },
  {
    id: '2',
    name: 'Marketing Team',
    description: 'Brand strategy and customer engagement',
    memberCount: 4,
    synergyScore: 0.72,
    status: 'active',
    created: '2024-02-01',
    members: [
      { id: '7', name: 'Emma Davis', email: 'emma@company.com', type: 'C1', typeName: 'Networker', dimension: 'Connection', role: 'Marketing Lead' },
      { id: '8', name: 'James Wilson', email: 'james@company.com', type: 'I3', typeName: 'Catalyst', dimension: 'Innovation', role: 'Content Creator' },
      { id: '9', name: 'Sophie Brown', email: 'sophie@company.com', type: 'E2', typeName: 'Specialist', dimension: 'Expertise', role: 'SEO Specialist' },
      { id: '10', name: 'David Lee', email: 'david@company.com', type: 'V3', typeName: 'Strategist', dimension: 'Vision', role: 'Brand Manager' }
    ]
  }
];

const availableUsers = [
  { id: '11', name: 'Julia Fischer', email: 'julia@company.com', type: 'C2', typeName: 'Collaborator', dimension: 'Connection', department: 'HR' },
  { id: '12', name: 'Robert Taylor', email: 'robert@company.com', type: 'E3', typeName: 'Analyst', dimension: 'Expertise', department: 'Finance' },
  { id: '13', name: 'Maria Garcia', email: 'maria@company.com', type: 'I1', typeName: 'Creator', dimension: 'Innovation', department: 'Design' },
  { id: '14', name: 'Alex Thompson', email: 'alex@company.com', type: 'V1', typeName: 'Pathfinder', dimension: 'Vision', department: 'Strategy' }
];

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

const TeamsPage = ({ onBack }) => {
  const { user, logout } = useAuth();
  const [teams, setTeams] = useState(mockTeams);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const calculateSynergy = (members) => {
    if (!members || members.length < 2) return 0;
    
    const dimensions = members.reduce((acc, member) => {
      const dim = member.dimension;
      acc[dim] = (acc[dim] || 0) + 1;
      return acc;
    }, {});
    
    const dimensionCount = Object.keys(dimensions).length;
    const memberCount = members.length;
    
    // Higher synergy for balanced teams with diverse dimensions
    const balance = dimensionCount / 4; // 4 total dimensions
    const size = Math.min(memberCount / 6, 1); // Optimal team size around 6
    
    return Math.min(balance * size * 0.9 + Math.random() * 0.1, 1);
  };

  const createTeam = () => {
    if (!newTeam.name.trim()) return;
    
    const team = {
      id: Date.now().toString(),
      name: newTeam.name,
      description: newTeam.description,
      memberCount: selectedUsers.length,
      synergyScore: calculateSynergy(selectedUsers),
      status: 'active',
      created: new Date().toISOString().split('T')[0],
      members: selectedUsers
    };
    
    setTeams([...teams, team]);
    setNewTeam({ name: '', description: '' });
    setSelectedUsers([]);
    setIsCreateDialogOpen(false);
  };

  const addMemberToTeam = (teamId, userId) => {
    const user = availableUsers.find(u => u.id === userId);
    if (!user) return;
    
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        const newMembers = [...team.members, { ...user, role: 'Team Member' }];
        return {
          ...team,
          members: newMembers,
          memberCount: newMembers.length,
          synergyScore: calculateSynergy(newMembers)
        };
      }
      return team;
    }));
    setIsAddMemberDialogOpen(false);
  };

  const removeMemberFromTeam = (teamId, memberId) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        const newMembers = team.members.filter(m => m.id !== memberId);
        return {
          ...team,
          members: newMembers,
          memberCount: newMembers.length,
          synergyScore: calculateSynergy(newMembers)
        };
      }
      return team;
    }));
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className="text-xl font-bold text-gray-900">Teams Management</h1>
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
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
              <p className="text-gray-600">Manage teams and optimize team synergy with Hugo personality types</p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                  <DialogDescription>
                    Create a new team and select initial members based on Hugo personality types for optimal synergy.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="team-name">Team Name</Label>
                    <Input
                      id="team-name"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                      placeholder="Enter team name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="team-description">Description</Label>
                    <Textarea
                      id="team-description"
                      value={newTeam.description}
                      onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                      placeholder="Describe the team's purpose and goals"
                    />
                  </div>
                  
                  <div>
                    <Label>Select Team Members</Label>
                    <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                      {availableUsers.map(user => (
                        <div key={user.id} className="flex items-center space-x-3 p-2 border rounded-lg">
                          <input
                            type="checkbox"
                            checked={selectedUsers.some(u => u.id === user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, user]);
                              } else {
                                setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
                              }
                            }}
                          />
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          <Badge className={hugoTypes[user.type]?.color}>
                            {user.type} - {hugoTypes[user.type]?.name}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {selectedUsers.length > 0 && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">
                        Predicted Team Synergy: {(calculateSynergy(selectedUsers) * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-blue-700">
                        Based on Hugo personality type diversity and team composition
                      </p>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createTeam} disabled={!newTeam.name.trim()}>
                    Create Team
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map(team => (
              <Card key={team.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <CardDescription className="mt-1">{team.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedTeam(team)}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Team Stats */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{team.memberCount} members</span>
                      </div>
                      <Badge variant={team.status === 'active' ? 'default' : 'secondary'}>
                        {team.status}
                      </Badge>
                    </div>
                    
                    {/* Synergy Score */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Team Synergy</span>
                        <div className={`flex items-center gap-1 ${getSynergyColor(team.synergyScore)}`}>
                          {getSynergyIcon(team.synergyScore)}
                          <span className="text-sm font-medium">
                            {(team.synergyScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <Progress value={team.synergyScore * 100} className="h-2" />
                    </div>
                    
                    {/* Member Avatars */}
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {team.members.slice(0, 4).map(member => (
                          <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {team.members.length > 4 && (
                          <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{team.members.length - 4}</span>
                          </div>
                        )}
                      </div>
                      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Team Member</DialogTitle>
                            <DialogDescription>
                              Select a user to add to {team.name}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {availableUsers.filter(user => 
                              !team.members.some(member => member.id === user.id)
                            ).map(user => (
                              <div key={user.id} className="flex items-center justify-between p-2 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={hugoTypes[user.type]?.color}>
                                    {user.type}
                                  </Badge>
                                  <Button 
                                    size="sm" 
                                    onClick={() => addMemberToTeam(team.id, user.id)}
                                  >
                                    Add
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    {/* Hugo Type Distribution */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Hugo Types</span>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(
                          team.members.reduce((acc, member) => {
                            acc[member.type] = (acc[member.type] || 0) + 1;
                            return acc;
                          }, {})
                        ).map(([type, count]) => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type} ({count})
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Team Details Modal */}
          {selectedTeam && (
            <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>{selectedTeam.name}</DialogTitle>
                  <DialogDescription>{selectedTeam.description}</DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="members" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="members" className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      {selectedTeam.members.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-gray-500">{member.email}</p>
                              <p className="text-xs text-gray-400">{member.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={hugoTypes[member.type]?.color}>
                              {member.type} - {hugoTypes[member.type]?.name}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeMemberFromTeam(selectedTeam.id, member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analytics" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Synergy Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-green-600">
                            {(selectedTeam.synergyScore * 100).toFixed(0)}%
                          </div>
                          <Progress value={selectedTeam.synergyScore * 100} className="mt-2" />
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Dimension Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {Object.entries(
                              selectedTeam.members.reduce((acc, member) => {
                                const dim = member.dimension;
                                acc[dim] = (acc[dim] || 0) + 1;
                                return acc;
                              }, {})
                            ).map(([dimension, count]) => (
                              <div key={dimension} className="flex justify-between">
                                <span className="text-sm">{dimension}</span>
                                <span className="text-sm font-medium">{count}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="recommendations" className="space-y-4">
                    <div className="space-y-3">
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Improve Communication</h4>
                              <p className="text-sm text-gray-600">
                                Consider adding more Connection-type personalities to enhance team collaboration.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Balance Expertise</h4>
                              <p className="text-sm text-gray-600">
                                The team has strong innovation focus. Consider adding Expertise-type members for better execution.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
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

export default TeamsPage;
