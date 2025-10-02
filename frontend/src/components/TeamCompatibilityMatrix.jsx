import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Info,
  Lightbulb,
  Globe,
  MessageSquare,
  TrendingUp,
  Target
} from 'lucide-react';

// Hugo personality type configuration
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

// Compatibility levels based on Hugo personality interactions
const compatibilityMatrix = {
  // Vision types
  'V1-V2': { level: 'high', score: 0.85, description: 'Both share strategic thinking, complementary approaches' },
  'V1-V3': { level: 'high', score: 0.90, description: 'Pathfinder and Strategist work excellently together' },
  'V1-I1': { level: 'high', score: 0.80, description: 'Vision meets creativity - powerful combination' },
  'V1-I2': { level: 'moderate', score: 0.70, description: 'May need to balance strategic planning with innovation pace' },
  'V1-E1': { level: 'high', score: 0.85, description: 'Strategic vision supported by deep expertise' },
  'V1-E2': { level: 'moderate', score: 0.75, description: 'Different paces but complementary strengths' },
  'V1-C1': { level: 'high', score: 0.80, description: 'Vision amplified through networking' },
  'V1-C2': { level: 'high', score: 0.85, description: 'Strategic direction with collaborative execution' },
  
  'V2-V3': { level: 'high', score: 0.85, description: 'Visionary ideas structured by strategic planning' },
  'V2-I1': { level: 'high', score: 0.90, description: 'Future vision meets creative innovation' },
  'V2-I2': { level: 'high', score: 0.95, description: 'Exceptional synergy between visionaries and innovators' },
  'V2-E1': { level: 'moderate', score: 0.65, description: 'May clash between big picture and details' },
  'V2-C1': { level: 'high', score: 0.80, description: 'Vision spread through networks' },
  
  'V3-I1': { level: 'moderate', score: 0.70, description: 'Strategic planning may constrain creativity' },
  'V3-E1': { level: 'high', score: 0.85, description: 'Strategic expertise - excellent for execution' },
  'V3-E2': { level: 'high', score: 0.90, description: 'Systematic approach with specialized knowledge' },
  'V3-C2': { level: 'high', score: 0.85, description: 'Strategic plans executed collaboratively' },
  
  // Innovation types
  'I1-I2': { level: 'high', score: 0.85, description: 'Creative synergy and innovation amplification' },
  'I1-I3': { level: 'high', score: 0.90, description: 'Creator and Catalyst spark brilliant ideas' },
  'I1-E1': { level: 'moderate', score: 0.60, description: 'Creative freedom vs. expert precision - needs balance' },
  'I1-E2': { level: 'low', score: 0.50, description: 'Potential conflict between innovation and specialization' },
  'I1-C1': { level: 'high', score: 0.85, description: 'Creative ideas spread through networks' },
  'I1-C2': { level: 'high', score: 0.80, description: 'Innovation enhanced by collaboration' },
  
  'I2-I3': { level: 'high', score: 0.95, description: 'Innovation powerhouse - transformative potential' },
  'I2-E1': { level: 'moderate', score: 0.65, description: 'Innovation pace vs. expert thoroughness' },
  'I2-E2': { level: 'low', score: 0.55, description: 'Change agents may overwhelm specialists' },
  'I2-C1': { level: 'high', score: 0.85, description: 'Innovation networked across organization' },
  'I2-C2': { level: 'moderate', score: 0.75, description: 'Fast innovation may challenge collaborative process' },
  
  'I3-E1': { level: 'moderate', score: 0.70, description: 'Catalyst energy balanced by expert stability' },
  'I3-E2': { level: 'moderate', score: 0.65, description: 'Different working styles require adjustment' },
  'I3-C1': { level: 'high', score: 0.90, description: 'Energy and networking create momentum' },
  'I3-C2': { level: 'high', score: 0.85, description: 'Catalyst sparks collaborative innovation' },
  
  // Expertise types
  'E1-E2': { level: 'high', score: 0.90, description: 'Deep expertise and specialization complement well' },
  'E1-E3': { level: 'high', score: 0.95, description: 'Expert and Analyst - analytical excellence' },
  'E1-C1': { level: 'moderate', score: 0.70, description: 'Expertise shared through networking' },
  'E1-C2': { level: 'high', score: 0.80, description: 'Expert knowledge enhanced by collaboration' },
  
  'E2-E3': { level: 'high', score: 0.90, description: 'Specialist and Analyst work systematically together' },
  'E2-C1': { level: 'moderate', score: 0.65, description: 'Specialist focus vs. broad networking' },
  'E2-C2': { level: 'high', score: 0.75, description: 'Specialized knowledge in collaborative setting' },
  
  'E3-C1': { level: 'moderate', score: 0.70, description: 'Analytical depth meets broad connections' },
  'E3-C2': { level: 'high', score: 0.80, description: 'Data-driven collaboration' },
  'E3-C3': { level: 'high', score: 0.85, description: 'Analytical insights connected across teams' },
  
  // Connection types
  'C1-C2': { level: 'high', score: 0.95, description: 'Networking and collaboration - relationship excellence' },
  'C1-C3': { level: 'high', score: 0.90, description: 'Networker and Connector amplify relationships' },
  'C2-C3': { level: 'high', score: 0.95, description: 'Collaborative bridge-building at its best' }
};

// Get compatibility between two types
const getCompatibility = (type1, type2) => {
  if (type1 === type2) {
    return {
      level: 'high',
      score: 0.80,
      description: 'Same personality type - natural understanding and alignment'
    };
  }
  
  const key1 = `${type1}-${type2}`;
  const key2 = `${type2}-${type1}`;
  
  return compatibilityMatrix[key1] || compatibilityMatrix[key2] || {
    level: 'moderate',
    score: 0.70,
    description: 'Complementary strengths with some adjustment needed'
  };
};

// Cultural dimensions from "The Culture Map" by Erin Meyer
const culturalDimensions = [
  {
    name: 'Communication',
    low: 'Low-Context',
    high: 'High-Context',
    description: 'How explicitly messages are conveyed',
    lowDesc: 'Precise, simple, clear messages. Repetition appreciated.',
    highDesc: 'Nuanced, layered messages. Reading between the lines expected.'
  },
  {
    name: 'Feedback',
    low: 'Direct Negative Feedback',
    high: 'Indirect Negative Feedback',
    description: 'How criticism and negative feedback is delivered',
    lowDesc: 'Honest, frank, direct criticism. Confrontational acceptable.',
    highDesc: 'Diplomatic, subtle, softened criticism. Saving face important.'
  },
  {
    name: 'Leading',
    low: 'Egalitarian',
    high: 'Hierarchical',
    description: 'Leadership and organizational structure preferences',
    lowDesc: 'Flat organization. Boss is facilitator among equals.',
    highDesc: 'Formal hierarchy. Boss is strong director who leads from front.'
  },
  {
    name: 'Deciding',
    low: 'Consensual',
    high: 'Top-Down',
    description: 'How decisions are made within the organization',
    lowDesc: 'Decisions made in groups through consensus.',
    highDesc: 'Decisions made by individuals (usually the boss).'
  },
  {
    name: 'Trusting',
    low: 'Task-Based',
    high: 'Relationship-Based',
    description: 'How trust is built in professional relationships',
    lowDesc: 'Trust built through business activities. Work first.',
    highDesc: 'Trust built through personal relationships. Relationship first.'
  },
  {
    name: 'Disagreeing',
    low: 'Confrontational',
    high: 'Avoids Confrontation',
    description: 'Attitudes toward open disagreement and debate',
    lowDesc: 'Open disagreement and debate are positive for team.',
    highDesc: 'Disagreement is negative for team. Harmony valued.'
  },
  {
    name: 'Scheduling',
    low: 'Linear Time',
    high: 'Flexible Time',
    description: 'Approach to time management and scheduling',
    lowDesc: 'Project steps approached sequentially. Punctuality critical.',
    highDesc: 'Project steps approached fluidly. Punctuality flexible.'
  }
];

/**
 * Compatibility Matrix Grid
 * Shows pairwise compatibility between all team members
 */
export const CompatibilityMatrixGrid = ({ members }) => {
  const [selectedPair, setSelectedPair] = useState(null);
  
  if (!members || members.length < 2) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Need at least 2 team members to show compatibility matrix</p>
      </div>
    );
  }

  const getCompatibilityColor = (level) => {
    switch (level) {
      case 'high': return 'bg-green-100 hover:bg-green-200 border-green-300';
      case 'moderate': return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300';
      case 'low': return 'bg-red-100 hover:bg-red-200 border-red-300';
      default: return 'bg-gray-100 hover:bg-gray-200 border-gray-300';
    }
  };

  const getCompatibilityIcon = (level) => {
    switch (level) {
      case 'high': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'moderate': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'low': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Matrix Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border bg-gray-50"></th>
              {members.map((member, index) => (
                <th key={index} className="p-2 border bg-gray-50 text-xs">
                  <div className="flex flex-col items-center gap-1">
                    <Badge className={`${hugoTypes[member.hugo_type_code]?.color} text-xs`}>
                      {member.hugo_type_code}
                    </Badge>
                    <span className="text-gray-600 truncate max-w-[80px]">
                      {member.first_name}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((member1, i) => (
              <tr key={i}>
                <td className="p-2 border bg-gray-50">
                  <div className="flex flex-col items-center gap-1">
                    <Badge className={`${hugoTypes[member1.hugo_type_code]?.color} text-xs`}>
                      {member1.hugo_type_code}
                    </Badge>
                    <span className="text-xs text-gray-600 truncate max-w-[80px]">
                      {member1.first_name}
                    </span>
                  </div>
                </td>
                {members.map((member2, j) => {
                  if (i === j) {
                    return (
                      <td key={j} className="p-2 border bg-gray-200">
                        <div className="w-12 h-12 mx-auto"></div>
                      </td>
                    );
                  }
                  
                  const compat = getCompatibility(member1.hugo_type_code, member2.hugo_type_code);
                  
                  return (
                    <td 
                      key={j} 
                      className={`p-2 border cursor-pointer transition-colors ${getCompatibilityColor(compat.level)}`}
                      onClick={() => setSelectedPair({ member1, member2, compat })}
                    >
                      <div className="w-12 h-12 mx-auto flex flex-col items-center justify-center">
                        {getCompatibilityIcon(compat.level)}
                        <span className="text-xs font-semibold mt-1">
                          {(compat.score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm">High Synergy (80%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <span className="text-sm">Moderate Synergy (60-79%)</span>
        </div>
        <div className="flex items-center gap-2">
          <XCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm">Needs Attention (&lt;60%)</span>
        </div>
      </div>

      {/* Selected Pair Details */}
      {selectedPair && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">Compatibility Details</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedPair(null)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Members */}
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <Badge className={`${hugoTypes[selectedPair.member1.hugo_type_code]?.color} mb-2`}>
                    {selectedPair.member1.hugo_type_code}
                  </Badge>
                  <p className="text-sm font-medium">
                    {selectedPair.member1.first_name} {selectedPair.member1.last_name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {hugoTypes[selectedPair.member1.hugo_type_code]?.name}
                  </p>
                </div>
                
                <div className="text-2xl text-gray-400">↔</div>
                
                <div className="text-center">
                  <Badge className={`${hugoTypes[selectedPair.member2.hugo_type_code]?.color} mb-2`}>
                    {selectedPair.member2.hugo_type_code}
                  </Badge>
                  <p className="text-sm font-medium">
                    {selectedPair.member2.first_name} {selectedPair.member2.last_name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {hugoTypes[selectedPair.member2.hugo_type_code]?.name}
                  </p>
                </div>
              </div>

              {/* Compatibility Score */}
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getCompatibilityIcon(selectedPair.compat.level)}
                  <span className="text-2xl font-bold">
                    {(selectedPair.compat.score * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-gray-700">{selectedPair.compat.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

/**
 * Team Compatibility Summary
 * Overview of overall team compatibility
 */
export const TeamCompatibilitySummary = ({ members }) => {
  if (!members || members.length < 2) {
    return null;
  }

  // Calculate all pairwise compatibilities
  let totalScore = 0;
  let pairCount = 0;
  let highSynergy = 0;
  let moderateSynergy = 0;
  let lowSynergy = 0;

  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const compat = getCompatibility(members[i].hugo_type_code, members[j].hugo_type_code);
      totalScore += compat.score;
      pairCount++;
      
      if (compat.level === 'high') highSynergy++;
      else if (compat.level === 'moderate') moderateSynergy++;
      else lowSynergy++;
    }
  }

  const averageScore = totalScore / pairCount;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Team Compatibility Overview
        </CardTitle>
        <CardDescription>
          Analysis of {pairCount} member relationships
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Average Score */}
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Average Compatibility</p>
            <p className="text-4xl font-bold text-blue-600">
              {(averageScore * 100).toFixed(0)}%
            </p>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{highSynergy}</p>
              <p className="text-xs text-gray-600">High Synergy</p>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">{moderateSynergy}</p>
              <p className="text-xs text-gray-600">Moderate</p>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{lowSynergy}</p>
              <p className="text-xs text-gray-600">Needs Work</p>
            </div>
          </div>

          {/* Recommendations */}
          {lowSynergy > 0 && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-orange-900 mb-1">
                    Action Recommended
                  </p>
                  <p className="text-sm text-gray-700">
                    {lowSynergy} relationship{lowSynergy > 1 ? 's' : ''} may benefit from facilitated communication 
                    and team-building activities to improve collaboration.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Cultural Dimensions Analysis
 * Integrates "The Culture Map" framework for international teams
 */
export const CulturalDimensionsAnalysis = ({ members }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          Cultural Dimensions Analysis
        </CardTitle>
        <CardDescription>
          Based on "The Culture Map" by Erin Meyer - for international team effectiveness
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Understanding Cultural Differences
                  </p>
                  <p className="text-sm text-gray-700 mb-3">
                    For international teams, personality types are just one factor. Cultural backgrounds 
                    significantly influence communication styles, decision-making, and collaboration preferences.
                  </p>
                  <p className="text-sm text-gray-700">
                    The eight cultural dimensions below help identify potential challenges and opportunities 
                    when team members come from different cultural backgrounds.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Key Considerations for Your Team:</h4>
              
              <div className="space-y-2">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <strong>Establish clear communication norms</strong> - Discuss whether your team prefers 
                      direct or indirect communication styles
                    </p>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <strong>Align on decision-making processes</strong> - Clarify whether decisions will be 
                      made consensually or hierarchically
                    </p>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <strong>Build trust intentionally</strong> - Some cultures build trust through tasks, 
                      others through relationships - accommodate both
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="dimensions" className="space-y-4 mt-4">
            {culturalDimensions.map((dimension, index) => (
              <Card key={index} className="border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">{dimension.name}</CardTitle>
                  <CardDescription className="text-xs">{dimension.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Scale visualization */}
                    <div className="relative">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-medium text-gray-700">{dimension.low}</span>
                        <span className="text-xs font-medium text-gray-700">{dimension.high}</span>
                      </div>
                      <div className="w-full h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                    </div>
                    
                    {/* Descriptions */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-2 bg-blue-50 rounded">
                        <p className="text-gray-700">{dimension.lowDesc}</p>
                      </div>
                      <div className="p-2 bg-purple-50 rounded">
                        <p className="text-gray-700">{dimension.highDesc}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-900 mb-1">
                    Recommendation
                  </p>
                  <p className="text-sm text-gray-700">
                    Have team members complete a cultural profile assessment to identify where each person 
                    falls on these dimensions. This awareness helps prevent misunderstandings and builds 
                    more effective collaboration patterns.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

/**
 * Communication Tips Based on Team Composition
 */
export const TeamCommunicationTips = ({ members, potentialConflicts }) => {
  const dimensionCounts = members.reduce((acc, member) => {
    const dim = hugoTypes[member.hugo_type_code]?.dimension;
    if (dim) {
      acc[dim] = (acc[dim] || 0) + 1;
    }
    return acc;
  }, {});

  const tips = [];

  // Generate tips based on dimension balance
  if (dimensionCounts['Vision'] > dimensionCounts['Expertise']) {
    tips.push({
      icon: <Target className="h-5 w-5 text-blue-600" />,
      title: 'Balance Vision with Execution',
      description: 'Your team has strong strategic thinking. Ensure concrete action plans and implementation details are clearly defined.'
    });
  }

  if (dimensionCounts['Innovation'] > dimensionCounts['Expertise']) {
    tips.push({
      icon: <Lightbulb className="h-5 w-5 text-purple-600" />,
      title: 'Ground Innovation in Reality',
      description: 'High innovation energy is great! Balance creative ideas with feasibility assessments and expert validation.'
    });
  }

  if (dimensionCounts['Connection']) {
    tips.push({
      icon: <MessageSquare className="h-5 w-5 text-orange-600" />,
      title: 'Leverage Relationship Strengths',
      description: 'Your team has strong connectors. Use them to facilitate communication and build consensus across different perspectives.'
    });
  }

  if (potentialConflicts && potentialConflicts.length > 0) {
    tips.push({
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      title: 'Address Potential Conflicts Proactively',
      description: `${potentialConflicts.length} potential conflict area${potentialConflicts.length > 1 ? 's' : ''} identified. Schedule regular check-ins to address communication challenges early.`
    });
  }

  // Always include general tips
  tips.push({
    icon: <Users className="h-5 w-5 text-green-600" />,
    title: 'Regular Team Retrospectives',
    description: 'Schedule monthly team retrospectives to discuss what\'s working well and what could be improved in team dynamics.'
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          Communication Best Practices
        </CardTitle>
        <CardDescription>
          Tailored recommendations for your team composition
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                {tip.icon}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{tip.title}</h4>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default {
  CompatibilityMatrixGrid,
  TeamCompatibilitySummary,
  CulturalDimensionsAnalysis,
  TeamCommunicationTips
};
