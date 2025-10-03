import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/RoleBasedAuthContext';
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  Target, 
  TrendingUp, 
  Users, 
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Search,
  Filter
} from 'lucide-react'

const RecommendationDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRecommendations: 0,
    acceptedRecommendations: 0,
    acceptanceRate: 0,
    averageSynergyImprovement: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('RecommendationDashboard mounted');
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const baseUrl = window.location.port === '3000' 
        ? `http://${window.location.hostname}:8006`
        : '';
      console.log('Fetching stats from:', `${baseUrl}/api/recommendations/stats`);
      
      const response = await fetch(`${baseUrl}/api/recommendations/stats`);
      if (response.ok) {
        const data = await response.json();
        console.log('Stats received:', data);
        setStats({
          totalRecommendations: data.total_recommendations || 0,
          acceptedRecommendations: data.accepted_recommendations || 0,
          acceptanceRate: data.acceptance_rate || 0,
          averageSynergyImprovement: data.average_synergy_improvement || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Recommendations</h1>
          <p className="text-muted-foreground">
            AI-powered insights for optimal team composition
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Recommendations
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecommendations}</div>
            <p className="text-xs text-muted-foreground">
              All time recommendations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Acceptance Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.acceptanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              Recommendations accepted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Synergy Improvement
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.averageSynergyImprovement}%</div>
            <p className="text-xs text-muted-foreground">
              Team performance boost
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Accepted Recommendations
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.acceptedRecommendations}</div>
            <p className="text-xs text-muted-foreground">
              Successfully implemented
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="find-member">Find Member</TabsTrigger>
          <TabsTrigger value="build-team">Build Team</TabsTrigger>
          <TabsTrigger value="analyze-gaps">Analyze Gaps</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Find Member Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Search className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Find Member</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Find the perfect addition to your existing team based on personality types and project requirements.
                </CardDescription>
                <Badge variant="secondary">Coming Soon</Badge>
              </CardContent>
            </Card>

            {/* Build Team Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Build Team</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Create an optimal team from scratch using AI-powered recommendations and compatibility analysis.
                </CardDescription>
                <Badge variant="secondary">Coming Soon</Badge>
              </CardContent>
            </Card>

            {/* Analyze Gaps Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Analyze Gaps</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Identify skill gaps and personality imbalances in your existing teams with actionable insights.
                </CardDescription>
                <Badge variant="secondary">Coming Soon</Badge>
              </CardContent>
            </Card>
          </div>

          {/* How It Works Section */}
          <Card>
            <CardHeader>
              <CardTitle>How Team Recommendations Work</CardTitle>
              <CardDescription>
                Our AI-powered recommendation engine uses advanced algorithms to optimize team composition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                    1
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Multi-Factor Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Analyzes 6 key factors: Dimension Balance, Type Compatibility, Project Fit, Team Size, Cultural Fit, and Historical Success
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-semibold">
                    2
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Hugo Personality Types</h4>
                  <p className="text-sm text-muted-foreground">
                    Leverages 12 Hugo personality types across 4 dimensions (Vision, Innovation, Expertise, Connection)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-semibold">
                    3
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Cultural Intelligence</h4>
                  <p className="text-sm text-muted-foreground">
                    Integrates "The Culture Map" framework for cross-cultural team dynamics
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-semibold">
                    4
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Continuous Learning</h4>
                  <p className="text-sm text-muted-foreground">
                    Machine learning models improve recommendations based on feedback and team performance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="find-member" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Find Perfect Team Member</CardTitle>
              <CardDescription>
                This feature will help you find the ideal candidate to add to your existing team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Lightbulb className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-xl font-semibold">Coming Soon</h3>
                <p className="text-center text-muted-foreground max-w-md">
                  The Find Member wizard is currently under development. It will allow you to specify team requirements and get AI-powered candidate recommendations.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="build-team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Build Optimal Team</CardTitle>
              <CardDescription>
                Create a new team from scratch with AI-powered composition recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Users className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-xl font-semibold">Coming Soon</h3>
                <p className="text-center text-muted-foreground max-w-md">
                  The Build Team feature is currently under development. It will use genetic algorithms to create optimal team compositions based on your project requirements.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analyze-gaps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Team Gaps</CardTitle>
              <CardDescription>
                Identify weaknesses and improvement opportunities in your teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Filter className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-xl font-semibold">Coming Soon</h3>
                <p className="text-center text-muted-foreground max-w-md">
                  The Gap Analysis feature is currently under development. It will provide detailed insights into team composition issues and suggest specific improvements.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecommendationDashboard;
