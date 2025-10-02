import { useState, useEffect } from 'react'
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
      { id: '5', name: 'David Chen', email: 'david@company.com', type: 'V2', typeName: 'Developer', dimension: 'Vision', role: 'Product Manager' },
      { id: '6', name: 'Sarah Johnson', email: 'sarah@company.com', type: 'E2', typeName: 'Specialist', dimension: 'Expertise', role: 'QA Engineer' }
    ],
    insights: {
      strengths: ['High innovation potential', 'Strong technical expertise', 'Good leadership structure'],
      challenges: ['Need more connection-focused members', 'Communication could be improved'],
      recommendations: ['Add C1 or C2 type for better team cohesion', 'Regular team building activities']
    }
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
      { id: '7', name: 'Emma Wilson', email: 'emma@company.com', type: 'C1', typeName: 'Networker', dimension: 'Connection', role: 'Marketing Manager' },
      { id: '8', name: 'James Brown', email: 'james@company.com', type: 'I1', typeName: 'Creator', dimension: 'Innovation', role: 'Creative Director' },
      { id: '9', name: 'Sophie Davis', email: 'sophie@company.com', type: 'C2', typeName: 'Collaborator', dimension: 'Connection', role: 'Content Manager' },
      { id: '10', name: 'Michael Lee', email: 'michael@company.com', type: 'E3', typeName: 'Advisor', dimension: 'Expertise', role: 'Data Analyst' }
    ],
    insights: {
      strengths: ['Excellent communication skills', 'Creative problem solving', 'Strong customer focus'],
      challenges: ['Lacks strategic vision', 'Decision-making could be faster'],
      recommendations: ['Add V1 or V3 type for strategic direction', 'Implement clearer decision processes']
    }
  }
]

const availableUsers = [
  { id: '11', name: 'Robert Taylor', email: 'robert@company.com', type: 'V3', typeName: 'Organizer', dimension: 'Vision', department: 'Operations' },
  { id: '12', name: 'Jennifer White', email: 'jennifer@company.com', type: 'I3', typeName: 'Catalyst', dimension: 'Innovation', department: 'R&D' },
  { id: '13', name: 'Kevin Martinez', email: 'kevin@company.com', type: 'E1', typeName: 'Expert', dimension: 'Expertise', department: 'Engineering' },
  { id: '14', name: 'Amanda Garcia', email: 'amanda@company.com', type: 'C1', typeName: 'Networker', dimension: 'Connection', department: 'Sales' }
]

const hugoTypes = {
  V1: { name: 'Pathfinder', dimension: 'Vision', color: 'bg-blue-500' },
  V2: { name: 'Developer', dimension: 'Vision', color: 'bg-blue-600' },
  V3: { name: 'Organizer', dimension: 'Vision', color: 'bg-blue-700' },
  I1: { name: 'Creator', dimension: 'Innovation', color: 'bg-purple-500' },
  I2: { name: 'Innovator', dimension: 'Innovation', color: 'bg-purple-600' },
  I3: { name: 'Catalyst', dimension: 'Innovation', color: 'bg-purple-700' },
  E1: { name: 'Expert', dimension: 'Expertise', color: 'bg-green-500' },
  E2: { name: 'Specialist', dimension: 'Expertise', color: 'bg-green-600' },
  E3: { name: 'Advisor', dimension: 'Expertise', color: 'bg-green-700' },
  C1: { name: 'Networker', dimension: 'Connection', color: 'bg-orange-500' },
  C2: { name: 'Collaborator', dimension: 'Connection', color: 'bg-orange-600' },
  C3: { name: 'Connector', dimension: 'Connection', color: 'bg-orange-700' }
}

function TeamsPage() {
  const [teams, setTeams] = useState(mockTeams)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [newTeam, setNewTeam] = useState({ name: '', description: '' })

  const getDimensionColor = (dimension) => {
    const colors = {
      'Vision': 'bg-blue-500',
      'Innovation': 'bg-purple-500',
      'Expertise': 'bg-green-500',
      'Connection': 'bg-orange-500'
    }
    return colors[dimension] || 'bg-gray-500'
  }

  const getDimensionIcon = (dimension) => {
    const icons = {
      'Vision': Target,
      'Innovation': Lightbulb,
      'Expertise': BookOpen,
      'Connection': Heart
    }
    const Icon = icons[dimension] || Brain
    return <Icon className="h-4 w-4" />
  }

  const calculateTeamBalance = (members) => {
    const dimensions = { Vision: 0, Innovation: 0, Expertise: 0, Connection: 0 }
    members.forEach(member => {
      dimensions[member.dimension]++
    })
    
    const total = members.length
    return Object.entries(dimensions).map(([dim, count]) => ({
      dimension: dim,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      count
    }))
  }

  const getSynergyLevel = (score) => {
    if (score >= 0.8) return { level: 'Excellent', color: 'text-green-600', icon: CheckCircle }
    if (score >= 0.6) return { level: 'Good', color: 'text-blue-600', icon: TrendingUp }
    return { level: 'Needs Improvement', color: 'text-orange-600', icon: AlertTriangle }
  }

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || team.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleCreateTeam = () => {
    if (newTeam.name.trim()) {
      const team = {
        id: Date.now().toString(),
        name: newTeam.name,
        description: newTeam.description,
        memberCount: 0,
        synergyScore: 0,
        status: 'active',
        created: new Date().toISOString().split('T')[0],
        members: [],
        insights: {
          strengths: [],
          challenges: ['Team needs members to generate insights'],
          recommendations: ['Add team members with diverse Hugo types']
        }
      }
      setTeams([...teams, team])
      setNewTeam({ name: '', description: '' })
      setIsCreateDialogOpen(false)
    }
  }

  const handleAddMember = (teamId, userId) => {
    const user = availableUsers.find(u => u.id === userId)
    if (user) {
      setTeams(teams.map(team => {
        if (team.id === teamId) {
          const newMember = {
            ...user,
            role: 'Team Member'
          }
          const updatedMembers = [...team.members, newMember]
          return {
            ...team,
            members: updatedMembers,
            memberCount: updatedMembers.length,
            synergyScore: Math.min(0.95, team.synergyScore + 0.1) // Simple synergy calculation
          }
        }
        return team
      }))
      setIsAddMemberDialogOpen(false)
    }
  }

  const TeamCard = ({ team }) => {
    const synergyInfo = getSynergyLevel(team.synergyScore)
    const SynergyIcon = synergyInfo.icon

    return (
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                {team.name}
              </CardTitle>
              <CardDescription className="mt-1">{team.description}</CardDescription>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>{team.memberCount} members</span>
                <span>Created {new Date(team.created).toLocaleDateString()}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Synergy Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SynergyIcon className={`h-4 w-4 ${synergyInfo.color}`} />
                <span className="text-sm font-medium">Team Synergy</span>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={team.synergyScore * 100} className="w-20 h-2" />
                <span className={`text-sm font-semibold ${synergyInfo.color}`}>
                  {Math.round(team.synergyScore * 100)}%
                </span>
              </div>
            </div>

            {/* Team Members Preview */}
            {team.members.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {team.members.slice(0, 5).map((member, index) => (
                    <Avatar key={index} className="border-2 border-white h-8 w-8">
                      <AvatarFallback className={`${getDimensionColor(member.dimension)} text-white text-xs`}>
                        {member.type}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {team.members.length > 5 && (
                    <Avatar className="border-2 border-white h-8 w-8">
                      <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                        +{team.members.length - 5}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedTeam(team)}
                >
                  View Details
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            )}

            {/* Empty State */}
            {team.members.length === 0 && (
              <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">No team members yet</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedTeam(team)
                    setIsAddMemberDialogOpen(true)
                  }}
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  Add Members
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const TeamDetailView = ({ team, onClose }) => {
    const balance = calculateTeamBalance(team.members)
    const synergyInfo = getSynergyLevel(team.synergyScore)
    const SynergyIcon = synergyInfo.icon

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{team.name}</h2>
                <p className="text-gray-600 mt-1">{team.description}</p>
              </div>
              <Button variant="ghost" onClick={onClose}>
                ×
              </Button>
            </div>
          </div>

          <div className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Team Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>Team Statistics</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Members</span>
                        <span className="font-semibold">{team.memberCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <SynergyIcon className={`h-4 w-4 ${synergyInfo.color}`} />
                          <span className="text-sm text-gray-600">Synergy Score</span>
                        </div>
                        <span className={`font-semibold ${synergyInfo.color}`}>
                          {Math.round(team.synergyScore * 100)}% ({synergyInfo.level})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Created</span>
                        <span className="font-semibold">{new Date(team.created).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <Badge variant={team.status === 'active' ? 'default' : 'secondary'}>
                          {team.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dimension Balance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5" />
                        <span>Dimension Balance</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {balance.map((item) => (
                          <div key={item.dimension}>
                            <div className="flex justify-between text-sm mb-1">
                              <div className="flex items-center space-x-2">
                                {getDimensionIcon(item.dimension)}
                                <span>{item.dimension}</span>
                              </div>
                              <span>{item.percentage}% ({item.count})</span>
                            </div>
                            <Progress value={item.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="members" className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Team Members ({team.memberCount})</h3>
                  <Button 
                    onClick={() => setIsAddMemberDialogOpen(true)}
                    size="sm"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {team.members.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className={`${getDimensionColor(member.dimension)} text-white`}>
                              {member.type}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium">{member.name}</h4>
                            <p className="text-sm text-gray-600">{member.role}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {member.type} - {member.typeName}
                              </Badge>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="mt-6">
                <div className="space-y-6">
                  {/* Communication Matrix */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5" />
                        <span>Communication Dynamics</span>
                      </CardTitle>
                      <CardDescription>
                        How team members interact based on their Hugo types
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Communication analysis will be displayed here</p>
                        <p className="text-sm">Based on Hugo type interactions and synergies</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Team Effectiveness */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Effectiveness Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">85%</div>
                          <div className="text-sm text-green-700">Collaboration</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">78%</div>
                          <div className="text-sm text-blue-700">Innovation</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">92%</div>
                          <div className="text-sm text-purple-700">Execution</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="mt-6">
                <div className="space-y-6">
                  {/* Strengths */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span>Team Strengths</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {team.insights.strengths.map((strength, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Challenges */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-orange-600">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Areas for Improvement</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {team.insights.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-blue-600">
                        <TrendingUp className="h-5 w-5" />
                        <span>Recommendations</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {team.insights.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600 mt-1">Manage and analyze your teams</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>

      {/* Empty State */}
      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first team'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Team
            </Button>
          )}
        </div>
      )}

      {/* Create Team Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Set up a new team to start building better collaboration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                placeholder="Enter team name..."
              />
            </div>
            <div>
              <Label htmlFor="team-description">Description</Label>
              <Textarea
                id="team-description"
                value={newTeam.description}
                onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                placeholder="Describe the team's purpose..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTeam}>Create Team</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Select a user to add to the team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {availableUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className={`${getDimensionColor(user.dimension)} text-white`}>
                      {user.type}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {user.type} - {user.typeName}
                    </Badge>
                  </div>
                </div>
                <Button 
                  size="sm"
                  onClick={() => handleAddMember(selectedTeam?.id, user.id)}
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Team Detail View */}
      {selectedTeam && (
        <TeamDetailView 
          team={selectedTeam} 
          onClose={() => setSelectedTeam(null)} 
        />
      )}
    </div>
  )
}

export default TeamsPage
