import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award,
  Target,
  Activity
} from 'lucide-react';

// Hugo personality type configuration
const hugoTypes = {
  'V1': { name: 'Pathfinder', color: 'bg-blue-100 text-blue-800', hex: '#3B82F6', dimension: 'Vision' },
  'V2': { name: 'Visionary', color: 'bg-blue-200 text-blue-900', hex: '#2563EB', dimension: 'Vision' },
  'V3': { name: 'Strategist', color: 'bg-blue-300 text-blue-900', hex: '#1D4ED8', dimension: 'Vision' },
  'I1': { name: 'Creator', color: 'bg-purple-100 text-purple-800', hex: '#A855F7', dimension: 'Innovation' },
  'I2': { name: 'Innovator', color: 'bg-purple-200 text-purple-900', hex: '#9333EA', dimension: 'Innovation' },
  'I3': { name: 'Catalyst', color: 'bg-purple-300 text-purple-900', hex: '#7C3AED', dimension: 'Innovation' },
  'E1': { name: 'Expert', color: 'bg-green-100 text-green-800', hex: '#10B981', dimension: 'Expertise' },
  'E2': { name: 'Specialist', color: 'bg-green-200 text-green-900', hex: '#059669', dimension: 'Expertise' },
  'E3': { name: 'Analyst', color: 'bg-green-300 text-green-900', hex: '#047857', dimension: 'Expertise' },
  'C1': { name: 'Networker', color: 'bg-orange-100 text-orange-800', hex: '#F97316', dimension: 'Connection' },
  'C2': { name: 'Collaborator', color: 'bg-orange-200 text-orange-900', hex: '#EA580C', dimension: 'Connection' },
  'C3': { name: 'Connector', color: 'bg-orange-300 text-orange-900', hex: '#C2410C', dimension: 'Connection' }
};

const dimensionColors = {
  'Vision': { bg: 'bg-blue-500', hex: '#3B82F6', light: 'bg-blue-100' },
  'Innovation': { bg: 'bg-purple-500', hex: '#A855F7', light: 'bg-purple-100' },
  'Expertise': { bg: 'bg-green-500', hex: '#10B981', light: 'bg-green-100' },
  'Connection': { bg: 'bg-orange-500', hex: '#F97316', light: 'bg-orange-100' }
};

/**
 * Dimension Distribution Bar Chart
 * Shows the balance of personality dimensions in the team
 */
export const DimensionDistributionChart = ({ distribution, totalMembers }) => {
  const dimensions = ['Vision', 'Innovation', 'Expertise', 'Connection'];
  
  return (
    <div className="space-y-4">
      {dimensions.map(dimension => {
        const count = distribution[dimension] || 0;
        const percentage = totalMembers > 0 ? (count / totalMembers) * 100 : 0;
        const colors = dimensionColors[dimension];
        
        return (
          <div key={dimension} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colors.bg}`}></div>
                <span className="text-sm font-medium text-gray-900">{dimension}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">{count}</span>
                <span className="text-xs text-gray-500 ml-1">({percentage.toFixed(0)}%)</span>
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`${colors.bg} h-3 rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Pie Chart Visualization (SVG-based)
 * Visual representation of dimension distribution
 */
export const DimensionPieChart = ({ distribution, totalMembers }) => {
  if (totalMembers === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <PieChart className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">No data to display</p>
        </div>
      </div>
    );
  }

  const dimensions = ['Vision', 'Innovation', 'Expertise', 'Connection'];
  let currentAngle = 0;
  const radius = 80;
  const centerX = 100;
  const centerY = 100;
  
  const slices = dimensions.map(dimension => {
    const count = distribution[dimension] || 0;
    const percentage = (count / totalMembers) * 100;
    const angle = (percentage / 100) * 360;
    
    const slice = {
      dimension,
      count,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      color: dimensionColors[dimension].hex
    };
    
    currentAngle += angle;
    return slice;
  }).filter(slice => slice.count > 0);

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", x, y,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="mb-4">
        {slices.map((slice, index) => (
          <g key={index}>
            <path
              d={describeArc(centerX, centerY, radius, slice.startAngle, slice.endAngle)}
              fill={slice.color}
              stroke="white"
              strokeWidth="2"
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          </g>
        ))}
        {/* Center circle for donut effect */}
        <circle cx={centerX} cy={centerY} r="40" fill="white" />
        <text x={centerX} y={centerY - 5} textAnchor="middle" className="text-2xl font-bold" fill="#1F2937">
          {totalMembers}
        </text>
        <text x={centerX} y={centerY + 15} textAnchor="middle" className="text-xs" fill="#6B7280">
          Members
        </text>
      </svg>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {slices.map((slice, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: slice.color }}
            ></div>
            <span className="text-xs text-gray-700">
              {slice.dimension} ({slice.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Type Distribution Grid
 * Shows all Hugo types present in the team
 */
export const TypeDistributionGrid = ({ typeDistribution }) => {
  const types = Object.entries(typeDistribution).sort((a, b) => b[1] - a[1]);
  
  if (types.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Users className="h-12 w-12 mx-auto mb-2" />
        <p className="text-sm">No personality types to display</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {types.map(([type, count]) => {
        const typeInfo = hugoTypes[type];
        if (!typeInfo) return null;
        
        return (
          <div 
            key={type} 
            className="relative p-4 border-2 rounded-lg text-center hover:shadow-md transition-shadow"
            style={{ borderColor: typeInfo.hex }}
          >
            <Badge className={`${typeInfo.color} mb-2 text-xs`}>
              {type}
            </Badge>
            <p className="text-xs font-medium text-gray-700 mb-1">{typeInfo.name}</p>
            <p className="text-xs text-gray-500 mb-2">{typeInfo.dimension}</p>
            <div className="text-2xl font-bold" style={{ color: typeInfo.hex }}>
              {count}
            </div>
            <p className="text-xs text-gray-400">
              {count === 1 ? 'member' : 'members'}
            </p>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Team Balance Indicator
 * Shows how balanced the team is across dimensions
 */
export const TeamBalanceIndicator = ({ distribution, totalMembers }) => {
  const dimensions = ['Vision', 'Innovation', 'Expertise', 'Connection'];
  const presentDimensions = dimensions.filter(d => (distribution[d] || 0) > 0);
  const balanceScore = presentDimensions.length / dimensions.length;
  
  // Calculate standard deviation to measure balance
  const counts = dimensions.map(d => distribution[d] || 0);
  const mean = totalMembers / dimensions.length;
  const variance = counts.reduce((sum, count) => sum + Math.pow(count - mean, 2), 0) / dimensions.length;
  const stdDev = Math.sqrt(variance);
  const normalizedStdDev = totalMembers > 0 ? stdDev / mean : 0;
  
  let balanceLevel = 'Excellent';
  let balanceColor = 'text-green-600';
  let balanceDescription = 'Your team has excellent balance across all personality dimensions';
  
  if (normalizedStdDev > 0.8 || presentDimensions.length < 3) {
    balanceLevel = 'Needs Improvement';
    balanceColor = 'text-red-600';
    balanceDescription = 'Consider adding members from underrepresented dimensions';
  } else if (normalizedStdDev > 0.5 || presentDimensions.length < 4) {
    balanceLevel = 'Good';
    balanceColor = 'text-yellow-600';
    balanceDescription = 'Team balance is good, but could be optimized further';
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Team Balance Score
        </CardTitle>
        <CardDescription>
          Measures diversity across personality dimensions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={`text-3xl font-bold ${balanceColor}`}>
              {balanceLevel}
            </span>
            <div className="text-right">
              <p className="text-sm text-gray-600">Dimensions</p>
              <p className="text-2xl font-bold text-gray-900">
                {presentDimensions.length}/4
              </p>
            </div>
          </div>
          
          <Progress value={balanceScore * 100} className="h-2" />
          
          <p className="text-sm text-gray-600">{balanceDescription}</p>
          
          {/* Missing Dimensions */}
          {presentDimensions.length < 4 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-900 mb-2">Missing Dimensions:</p>
              <div className="flex flex-wrap gap-2">
                {dimensions
                  .filter(d => !presentDimensions.includes(d))
                  .map(dimension => (
                    <Badge key={dimension} variant="outline" className="text-yellow-700 border-yellow-300">
                      {dimension}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Team Size Analysis
 * Provides insights on optimal team size
 */
export const TeamSizeAnalysis = ({ totalMembers }) => {
  let sizeCategory = 'Optimal';
  let sizeColor = 'text-green-600';
  let sizeIcon = <Award className="h-8 w-8 text-green-600" />;
  let sizeDescription = 'Your team size is optimal for collaboration and productivity';
  let recommendations = [];
  
  if (totalMembers < 3) {
    sizeCategory = 'Small';
    sizeColor = 'text-yellow-600';
    sizeIcon = <Users className="h-8 w-8 text-yellow-600" />;
    sizeDescription = 'Small teams can be agile but may lack diverse perspectives';
    recommendations = [
      'Consider adding 2-3 more members for better diversity',
      'Ensure all critical skills are covered',
      'May need external collaboration for complex projects'
    ];
  } else if (totalMembers > 10) {
    sizeCategory = 'Large';
    sizeColor = 'text-orange-600';
    sizeIcon = <Users className="h-8 w-8 text-orange-600" />;
    sizeDescription = 'Large teams offer diverse perspectives but require more coordination';
    recommendations = [
      'Consider breaking into smaller sub-teams',
      'Implement clear communication protocols',
      'Assign specific roles and responsibilities',
      'Use regular check-ins to maintain alignment'
    ];
  } else {
    recommendations = [
      'Maintain current team size for optimal performance',
      'Focus on developing team synergy',
      'Ensure clear role definition'
    ];
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Team Size Analysis
        </CardTitle>
        <CardDescription>
          Insights on team size and composition
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-2xl font-bold ${sizeColor}`}>{sizeCategory}</p>
              <p className="text-sm text-gray-600 mt-1">{totalMembers} team members</p>
            </div>
            {sizeIcon}
          </div>
          
          <p className="text-sm text-gray-700">{sizeDescription}</p>
          
          {recommendations.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-900">Recommendations:</p>
              <ul className="space-y-1">
                {recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Synergy Score Visualization
 * Displays team synergy with visual indicators
 */
export const SynergyScoreCard = ({ synergyScore, totalMembers }) => {
  const percentage = (synergyScore * 100).toFixed(0);
  let level = 'Excellent';
  let color = 'text-green-600';
  let bgColor = 'bg-green-50';
  let borderColor = 'border-green-200';
  let description = 'Your team has excellent synergy and compatibility';
  
  if (synergyScore < 0.6) {
    level = 'Needs Improvement';
    color = 'text-red-600';
    bgColor = 'bg-red-50';
    borderColor = 'border-red-200';
    description = 'Team synergy could be improved with better personality balance';
  } else if (synergyScore < 0.8) {
    level = 'Good';
    color = 'text-yellow-600';
    bgColor = 'bg-yellow-50';
    borderColor = 'border-yellow-200';
    description = 'Team synergy is good, with room for optimization';
  }
  
  return (
    <Card className={`${bgColor} ${borderColor} border-2`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className={`h-5 w-5 ${color}`} />
          Team Synergy Score
        </CardTitle>
        <CardDescription>
          Overall team compatibility and effectiveness
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-4xl font-bold ${color}`}>{percentage}%</p>
              <p className={`text-sm font-medium ${color} mt-1`}>{level}</p>
            </div>
            <div className="relative w-20 h-20">
              <svg className="transform -rotate-90 w-20 h-20">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - synergyScore)}`}
                  className={color}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          
          <Progress value={synergyScore * 100} className="h-3" />
          
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Complete Team Statistics Dashboard
 * Combines all visualizations into one comprehensive view
 */
export const TeamStatisticsDashboard = ({ teamAnalysis }) => {
  if (!teamAnalysis) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Loading team statistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SynergyScoreCard 
          synergyScore={teamAnalysis.synergy_score} 
          totalMembers={teamAnalysis.total_members}
        />
        <TeamBalanceIndicator 
          distribution={teamAnalysis.dimension_distribution}
          totalMembers={teamAnalysis.total_members}
        />
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dimension Distribution</CardTitle>
            <CardDescription>Balance across Hugo personality dimensions</CardDescription>
          </CardHeader>
          <CardContent>
            <DimensionDistributionChart 
              distribution={teamAnalysis.dimension_distribution}
              totalMembers={teamAnalysis.total_members}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Visual Overview</CardTitle>
            <CardDescription>Team composition at a glance</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <DimensionPieChart 
              distribution={teamAnalysis.dimension_distribution}
              totalMembers={teamAnalysis.total_members}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Hugo Type Distribution</CardTitle>
          <CardDescription>Specific personality types in your team</CardDescription>
        </CardHeader>
        <CardContent>
          <TypeDistributionGrid typeDistribution={teamAnalysis.type_distribution} />
        </CardContent>
      </Card>
      
      {/* Team Size Analysis */}
      <TeamSizeAnalysis totalMembers={teamAnalysis.total_members} />
    </div>
  );
};

export default {
  DimensionDistributionChart,
  DimensionPieChart,
  TypeDistributionGrid,
  TeamBalanceIndicator,
  TeamSizeAnalysis,
  SynergyScoreCard,
  TeamStatisticsDashboard
};
