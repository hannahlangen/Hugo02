"""
Team Recommendation Algorithms
Implements scoring algorithms for optimal team composition
"""

import numpy as np
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
from enum import Enum


class ProjectType(str, Enum):
    """Project types with different dimension requirements"""
    INNOVATION = "innovation"
    EXECUTION = "execution"
    CLIENT_FACING = "client_facing"
    STRATEGIC = "strategic"
    RESEARCH = "research"
    BALANCED = "balanced"


class TeamSize(str, Enum):
    """Team size categories"""
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"


@dataclass
class TeamMember:
    """Represents a team member with Hugo personality type"""
    user_id: int
    name: str
    hugo_type: str  # e.g., "V1", "I2", "E3", "C1"
    experience_years: Optional[int] = None
    cultural_profile: Optional[Dict[str, float]] = None
    
    @property
    def dimension(self) -> str:
        """Returns the primary dimension (V, I, E, C)"""
        return self.hugo_type[0]
    
    @property
    def level(self) -> int:
        """Returns the level (1, 2, 3)"""
        return int(self.hugo_type[1])


# Compatibility Matrix: How well different Hugo types work together
# Scale: 0.0 (poor) to 1.0 (excellent)
COMPATIBILITY_MATRIX = {
    # Vision types
    'V1': {'V1': 0.80, 'V2': 0.85, 'V3': 0.75, 'I1': 0.90, 'I2': 0.95, 'I3': 0.85,
           'E1': 0.70, 'E2': 0.75, 'E3': 0.80, 'C1': 0.85, 'C2': 0.90, 'C3': 0.85},
    'V2': {'V1': 0.85, 'V2': 0.75, 'V3': 0.70, 'I1': 0.95, 'I2': 0.90, 'I3': 0.85,
           'E1': 0.65, 'E2': 0.70, 'E3': 0.75, 'C1': 0.80, 'C2': 0.85, 'C3': 0.80},
    'V3': {'V1': 0.75, 'V2': 0.70, 'V3': 0.65, 'I1': 0.85, 'I2': 0.90, 'I3': 0.80,
           'E1': 0.75, 'E2': 0.80, 'E3': 0.85, 'C1': 0.70, 'C2': 0.75, 'C3': 0.70},
    
    # Innovation types
    'I1': {'V1': 0.90, 'V2': 0.95, 'V3': 0.85, 'I1': 0.85, 'I2': 0.90, 'I3': 0.80,
           'E1': 0.75, 'E2': 0.80, 'E3': 0.70, 'C1': 0.90, 'C2': 0.95, 'C3': 0.90},
    'I2': {'V1': 0.95, 'V2': 0.90, 'V3': 0.90, 'I1': 0.90, 'I2': 0.85, 'I3': 0.80,
           'E1': 0.70, 'E2': 0.75, 'E3': 0.80, 'C1': 0.85, 'C2': 0.90, 'C3': 0.85},
    'I3': {'V1': 0.85, 'V2': 0.85, 'V3': 0.80, 'I1': 0.80, 'I2': 0.80, 'I3': 0.75,
           'E1': 0.80, 'E2': 0.85, 'E3': 0.90, 'C1': 0.75, 'C2': 0.80, 'C3': 0.75},
    
    # Expertise types
    'E1': {'V1': 0.70, 'V2': 0.65, 'V3': 0.75, 'I1': 0.75, 'I2': 0.70, 'I3': 0.80,
           'E1': 0.85, 'E2': 0.90, 'E3': 0.85, 'C1': 0.80, 'C2': 0.85, 'C3': 0.90},
    'E2': {'V1': 0.75, 'V2': 0.70, 'V3': 0.80, 'I1': 0.80, 'I2': 0.75, 'I3': 0.85,
           'E1': 0.90, 'E2': 0.85, 'E3': 0.90, 'C1': 0.75, 'C2': 0.80, 'C3': 0.85},
    'E3': {'V1': 0.80, 'V2': 0.75, 'V3': 0.85, 'I1': 0.70, 'I2': 0.80, 'I3': 0.90,
           'E1': 0.85, 'E2': 0.90, 'E3': 0.80, 'C1': 0.70, 'C2': 0.75, 'C3': 0.80},
    
    # Connection types
    'C1': {'V1': 0.85, 'V2': 0.80, 'V3': 0.70, 'I1': 0.90, 'I2': 0.85, 'I3': 0.75,
           'E1': 0.80, 'E2': 0.75, 'E3': 0.70, 'C1': 0.90, 'C2': 0.95, 'C3': 0.90},
    'C2': {'V1': 0.90, 'V2': 0.85, 'V3': 0.75, 'I1': 0.95, 'I2': 0.90, 'I3': 0.80,
           'E1': 0.85, 'E2': 0.80, 'E3': 0.75, 'C1': 0.95, 'C2': 0.90, 'C3': 0.95},
    'C3': {'V1': 0.85, 'V2': 0.80, 'V3': 0.70, 'I1': 0.90, 'I2': 0.85, 'I3': 0.75,
           'E1': 0.90, 'E2': 0.85, 'E3': 0.80, 'C1': 0.90, 'C2': 0.95, 'C3': 0.85},
}


# Ideal dimension distribution per project type
PROJECT_PROFILES = {
    ProjectType.INNOVATION: {'V': 0.25, 'I': 0.40, 'E': 0.20, 'C': 0.15},
    ProjectType.EXECUTION: {'V': 0.15, 'I': 0.15, 'E': 0.50, 'C': 0.20},
    ProjectType.CLIENT_FACING: {'V': 0.20, 'I': 0.15, 'E': 0.25, 'C': 0.40},
    ProjectType.STRATEGIC: {'V': 0.45, 'I': 0.25, 'E': 0.20, 'C': 0.10},
    ProjectType.RESEARCH: {'V': 0.20, 'I': 0.30, 'E': 0.40, 'C': 0.10},
    ProjectType.BALANCED: {'V': 0.25, 'I': 0.25, 'E': 0.25, 'C': 0.25}
}


# Optimal team sizes
OPTIMAL_TEAM_SIZES = {
    TeamSize.SMALL: (3, 5),
    TeamSize.MEDIUM: (5, 8),
    TeamSize.LARGE: (8, 12)
}


class TeamRecommendationAlgorithm:
    """Main algorithm for team recommendations"""
    
    # Weights for different scoring factors
    WEIGHTS = {
        'dimension_balance': 0.25,
        'type_compatibility': 0.25,
        'project_fit': 0.20,
        'team_size': 0.10,
        'cultural_fit': 0.10,
        'historical_success': 0.10
    }
    
    def __init__(self):
        self.compatibility_matrix = COMPATIBILITY_MATRIX
        self.project_profiles = PROJECT_PROFILES
    
    def calculate_total_score(
        self,
        team_members: List[TeamMember],
        project_type: ProjectType = ProjectType.BALANCED,
        team_size_category: TeamSize = TeamSize.MEDIUM,
        historical_score: float = 0.5
    ) -> Dict[str, float]:
        """
        Calculate total team score with all factors
        
        Returns:
            Dictionary with individual scores and total score
        """
        scores = {
            'dimension_balance': self.calculate_dimension_balance(team_members),
            'type_compatibility': self.calculate_type_compatibility(team_members),
            'project_fit': self.calculate_project_fit(team_members, project_type),
            'team_size': self.calculate_size_score(len(team_members), team_size_category),
            'cultural_fit': self.calculate_cultural_fit(team_members),
            'historical_success': historical_score
        }
        
        # Calculate weighted total
        total_score = sum(
            scores[factor] * self.WEIGHTS[factor]
            for factor in self.WEIGHTS
        )
        
        scores['total'] = total_score
        
        return scores
    
    def calculate_dimension_balance(self, team_members: List[TeamMember]) -> float:
        """
        Calculate how balanced the four dimensions are
        
        Optimal: 25% per dimension (V, I, E, C)
        Returns: 0.0 (poor) to 1.0 (perfect balance)
        """
        if not team_members:
            return 0.0
        
        # Count dimensions
        dimensions = {'V': 0, 'I': 0, 'E': 0, 'C': 0}
        for member in team_members:
            dimensions[member.dimension] += 1
        
        # Calculate percentages
        total = len(team_members)
        percentages = {d: count / total for d, count in dimensions.items()}
        
        # Calculate deviation from ideal (25% each)
        ideal = 0.25
        deviations = [abs(pct - ideal) for pct in percentages.values()]
        avg_deviation = sum(deviations) / 4
        
        # Convert to score: 0% deviation = 1.0, 75% deviation = 0.0
        balance_score = 1.0 - (avg_deviation / 0.75)
        
        return max(0.0, min(1.0, balance_score))
    
    def calculate_type_compatibility(self, team_members: List[TeamMember]) -> float:
        """
        Calculate average pairwise compatibility between team members
        
        Returns: 0.0 (poor) to 1.0 (excellent)
        """
        if len(team_members) < 2:
            return 1.0
        
        total_score = 0.0
        pair_count = 0
        
        for i, member1 in enumerate(team_members):
            for member2 in team_members[i+1:]:
                type1 = member1.hugo_type
                type2 = member2.hugo_type
                
                # Get compatibility from matrix
                compatibility = self.compatibility_matrix.get(type1, {}).get(type2, 0.75)
                total_score += compatibility
                pair_count += 1
        
        return total_score / pair_count if pair_count > 0 else 1.0
    
    def calculate_project_fit(
        self,
        team_members: List[TeamMember],
        project_type: ProjectType
    ) -> float:
        """
        Calculate how well team composition fits the project type
        
        Returns: 0.0 (poor fit) to 1.0 (perfect fit)
        """
        if not team_members:
            return 0.0
        
        # Get ideal profile for project type
        ideal_profile = self.project_profiles.get(project_type, self.project_profiles[ProjectType.BALANCED])
        
        # Calculate actual team distribution
        dimensions = {'V': 0, 'I': 0, 'E': 0, 'C': 0}
        for member in team_members:
            dimensions[member.dimension] += 1
        
        total = len(team_members)
        actual_profile = {d: count / total for d, count in dimensions.items()}
        
        # Calculate cosine similarity
        dot_product = sum(ideal_profile[d] * actual_profile[d] for d in dimensions)
        ideal_magnitude = sum(v**2 for v in ideal_profile.values()) ** 0.5
        actual_magnitude = sum(v**2 for v in actual_profile.values()) ** 0.5
        
        if ideal_magnitude == 0 or actual_magnitude == 0:
            return 0.0
        
        similarity = dot_product / (ideal_magnitude * actual_magnitude)
        
        return max(0.0, min(1.0, similarity))
    
    def calculate_size_score(
        self,
        team_size: int,
        size_category: TeamSize = TeamSize.MEDIUM
    ) -> float:
        """
        Evaluate team size optimality
        
        Returns: 0.0 (poor) to 1.0 (optimal)
        """
        optimal_min, optimal_max = OPTIMAL_TEAM_SIZES[size_category]
        
        if optimal_min <= team_size <= optimal_max:
            return 1.0
        elif team_size < optimal_min:
            # Too small: linear penalty
            return max(0.0, team_size / optimal_min)
        else:
            # Too large: exponential penalty (communication overhead)
            excess = team_size - optimal_max
            penalty = (excess / optimal_max) ** 1.5
            return max(0.0, 1.0 - penalty)
    
    def calculate_cultural_fit(self, team_members: List[TeamMember]) -> float:
        """
        Calculate cultural compatibility based on The Culture Map dimensions
        
        Lower variance = better fit
        Returns: 0.0 (poor) to 1.0 (excellent)
        """
        # Check if cultural profiles are available
        members_with_profiles = [m for m in team_members if m.cultural_profile]
        
        if len(members_with_profiles) < 2:
            return 0.8  # Neutral score when data is unavailable
        
        # Culture Map dimensions
        dimensions = [
            'communication',
            'feedback',
            'leading',
            'deciding',
            'trusting',
            'disagreeing',
            'scheduling'
        ]
        
        dimension_variances = []
        
        for dimension in dimensions:
            values = [m.cultural_profile.get(dimension, 5.0) for m in members_with_profiles]
            if len(values) > 1:
                variance = np.var(values)
                dimension_variances.append(variance)
        
        if not dimension_variances:
            return 0.8
        
        avg_variance = np.mean(dimension_variances)
        
        # Normalize: low variance = high score
        # Max variance on 0-10 scale is ~25
        cultural_score = 1.0 - min(1.0, avg_variance / 25.0)
        
        return cultural_score
    
    def get_dimension_distribution(self, team_members: List[TeamMember]) -> Dict[str, float]:
        """Get percentage distribution of dimensions"""
        if not team_members:
            return {'V': 0.0, 'I': 0.0, 'E': 0.0, 'C': 0.0}
        
        dimensions = {'V': 0, 'I': 0, 'E': 0, 'C': 0}
        for member in team_members:
            dimensions[member.dimension] += 1
        
        total = len(team_members)
        return {d: count / total for d, count in dimensions.items()}
    
    def identify_missing_dimensions(
        self,
        team_members: List[TeamMember],
        threshold: float = 0.15
    ) -> List[str]:
        """
        Identify dimensions that are underrepresented in the team
        
        Args:
            threshold: Minimum percentage for a dimension (default 15%)
        
        Returns:
            List of underrepresented dimensions
        """
        distribution = self.get_dimension_distribution(team_members)
        missing = [dim for dim, pct in distribution.items() if pct < threshold]
        return missing
    
    def predict_synergy_with_new_member(
        self,
        current_team: List[TeamMember],
        candidate: TeamMember,
        project_type: ProjectType = ProjectType.BALANCED
    ) -> Tuple[float, float]:
        """
        Predict how synergy score changes when adding a new member
        
        Returns:
            (current_synergy, predicted_synergy)
        """
        # Current synergy
        current_scores = self.calculate_total_score(current_team, project_type)
        current_synergy = current_scores['total']
        
        # Predicted synergy with new member
        new_team = current_team + [candidate]
        new_scores = self.calculate_total_score(new_team, project_type)
        predicted_synergy = new_scores['total']
        
        return current_synergy, predicted_synergy
    
    def rank_candidates(
        self,
        current_team: List[TeamMember],
        candidates: List[TeamMember],
        project_type: ProjectType = ProjectType.BALANCED,
        top_n: int = 5
    ) -> List[Tuple[TeamMember, float, Dict[str, any]]]:
        """
        Rank candidates by predicted synergy improvement
        
        Returns:
            List of (candidate, synergy_score, analysis) tuples
        """
        results = []
        
        for candidate in candidates:
            current_synergy, predicted_synergy = self.predict_synergy_with_new_member(
                current_team, candidate, project_type
            )
            
            improvement = predicted_synergy - current_synergy
            
            # Detailed analysis
            new_team = current_team + [candidate]
            scores = self.calculate_total_score(new_team, project_type)
            
            analysis = {
                'current_synergy': current_synergy,
                'predicted_synergy': predicted_synergy,
                'improvement': improvement,
                'detailed_scores': scores,
                'fills_gap': candidate.dimension in self.identify_missing_dimensions(current_team)
            }
            
            results.append((candidate, predicted_synergy, analysis))
        
        # Sort by predicted synergy (descending)
        results.sort(key=lambda x: x[1], reverse=True)
        
        return results[:top_n]


def generate_team_insights(
    team_members: List[TeamMember],
    scores: Dict[str, float]
) -> Dict[str, any]:
    """
    Generate human-readable insights about a team
    
    Returns:
        Dictionary with strengths, weaknesses, and recommendations
    """
    algo = TeamRecommendationAlgorithm()
    distribution = algo.get_dimension_distribution(team_members)
    missing = algo.identify_missing_dimensions(team_members)
    
    # Identify strengths
    strengths = []
    if scores['dimension_balance'] > 0.8:
        strengths.append("Excellent dimension balance")
    if scores['type_compatibility'] > 0.85:
        strengths.append("High team compatibility")
    if scores['cultural_fit'] > 0.8:
        strengths.append("Strong cultural alignment")
    
    # Dominant dimension
    dominant_dim = max(distribution, key=distribution.get)
    dominant_pct = distribution[dominant_dim]
    if dominant_pct > 0.4:
        dim_names = {'V': 'Vision', 'I': 'Innovation', 'E': 'Expertise', 'C': 'Connection'}
        strengths.append(f"Strong {dim_names[dominant_dim]} focus")
    
    # Identify weaknesses
    weaknesses = []
    if scores['dimension_balance'] < 0.6:
        weaknesses.append("Unbalanced dimension distribution")
    if scores['type_compatibility'] < 0.7:
        weaknesses.append("Potential compatibility issues")
    if missing:
        dim_names = {'V': 'Vision', 'I': 'Innovation', 'E': 'Expertise', 'C': 'Connection'}
        missing_names = [dim_names[d] for d in missing]
        weaknesses.append(f"Missing dimensions: {', '.join(missing_names)}")
    
    # Generate recommendations
    recommendations = []
    if missing:
        dim_names = {'V': 'Vision', 'I': 'Innovation', 'E': 'Expertise', 'C': 'Connection'}
        for dim in missing:
            recommendations.append(f"Consider adding a {dim_names[dim]}-oriented member")
    
    if scores['team_size'] < 0.7:
        if len(team_members) < 5:
            recommendations.append("Team might be too small for complex projects")
        else:
            recommendations.append("Team might be too large, consider splitting")
    
    return {
        'strengths': strengths if strengths else ["Team has potential for improvement"],
        'weaknesses': weaknesses if weaknesses else ["No major weaknesses identified"],
        'recommendations': recommendations if recommendations else ["Team composition is solid"],
        'dimension_distribution': distribution,
        'missing_dimensions': missing
    }
