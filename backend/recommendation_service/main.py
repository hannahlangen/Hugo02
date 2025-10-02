"""
Team Recommendation Service
FastAPI service for AI-powered team recommendations
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from datetime import datetime

from algorithms import (
    TeamRecommendationAlgorithm,
    TeamMember,
    ProjectType,
    TeamSize,
    generate_team_insights
)


app = FastAPI(
    title="Team Recommendation Service",
    description="AI-powered team composition recommendations",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Database connection
def get_db_connection():
    """Get PostgreSQL database connection"""
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "postgres"),
        port=os.getenv("DB_PORT", "5432"),
        database=os.getenv("DB_NAME", "hugo_db"),
        user=os.getenv("DB_USER", "hugo_user"),
        password=os.getenv("DB_PASSWORD", "hugo_password")
    )


# Pydantic models for API
class RecommendMemberRequest(BaseModel):
    """Request to find best team member"""
    team_id: int
    project_type: Optional[str] = "balanced"
    top_n: int = Field(default=5, ge=1, le=20)


class BuildTeamRequest(BaseModel):
    """Request to build optimal team"""
    project_type: str = "balanced"
    team_size: int = Field(ge=3, le=12)
    required_skills: Optional[List[str]] = None
    available_member_ids: Optional[List[int]] = None
    top_n: int = Field(default=3, ge=1, le=10)


class TeamGapsRequest(BaseModel):
    """Request to analyze team gaps"""
    team_id: int


class RecommendationFeedback(BaseModel):
    """Feedback on a recommendation"""
    recommendation_id: str
    accepted: bool
    actual_synergy: Optional[float] = None
    comments: Optional[str] = None


class MemberRecommendation(BaseModel):
    """Single member recommendation"""
    user_id: int
    name: str
    hugo_type: str
    synergy_score: float
    reasoning: str
    strengths: List[str]
    challenges: List[str]
    impact_analysis: Dict[str, float]


class TeamComposition(BaseModel):
    """A complete team composition"""
    members: List[Dict[str, Any]]
    synergy_score: float
    project_fit_score: float
    reasoning: str
    dimension_distribution: Dict[str, float]
    strengths: List[str]
    risks: List[str]
    recommendations: List[str]


# Helper functions
def fetch_team_members(team_id: int, conn) -> List[TeamMember]:
    """Fetch team members from database"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT u.id, u.name, u.hugo_type, u.experience_years
            FROM users u
            JOIN team_members tm ON u.id = tm.user_id
            WHERE tm.team_id = %s AND u.hugo_type IS NOT NULL
        """, (team_id,))
        
        rows = cur.fetchall()
        
        return [
            TeamMember(
                user_id=row['id'],
                name=row['name'],
                hugo_type=row['hugo_type'],
                experience_years=row.get('experience_years')
            )
            for row in rows
        ]


def fetch_available_candidates(company_id: int, exclude_team_id: Optional[int], conn) -> List[TeamMember]:
    """Fetch available candidates from the same company"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        if exclude_team_id:
            cur.execute("""
                SELECT u.id, u.name, u.hugo_type, u.experience_years
                FROM users u
                WHERE u.company_id = %s 
                AND u.hugo_type IS NOT NULL
                AND u.id NOT IN (
                    SELECT user_id FROM team_members WHERE team_id = %s
                )
            """, (company_id, exclude_team_id))
        else:
            cur.execute("""
                SELECT u.id, u.name, u.hugo_type, u.experience_years
                FROM users u
                WHERE u.company_id = %s AND u.hugo_type IS NOT NULL
            """, (company_id,))
        
        rows = cur.fetchall()
        
        return [
            TeamMember(
                user_id=row['id'],
                name=row['name'],
                hugo_type=row['hugo_type'],
                experience_years=row.get('experience_years')
            )
            for row in rows
        ]


def get_company_id_from_team(team_id: int, conn) -> int:
    """Get company_id from team_id"""
    with conn.cursor() as cur:
        cur.execute("SELECT company_id FROM teams WHERE id = %s", (team_id,))
        result = cur.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="Team not found")
        return result[0]


def generate_reasoning(
    candidate: TeamMember,
    current_team: List[TeamMember],
    analysis: Dict[str, any]
) -> str:
    """Generate human-readable reasoning for recommendation"""
    reasons = []
    
    # Check if fills gap
    if analysis.get('fills_gap'):
        dim_names = {'V': 'Vision', 'I': 'Innovation', 'E': 'Expertise', 'C': 'Connection'}
        reasons.append(f"Brings needed {dim_names[candidate.dimension]} dimension to the team")
    
    # Check improvement
    improvement = analysis.get('improvement', 0)
    if improvement > 0.1:
        reasons.append(f"Significantly improves team synergy by {improvement*100:.0f}%")
    elif improvement > 0:
        reasons.append(f"Improves team synergy by {improvement*100:.0f}%")
    
    # Check compatibility
    scores = analysis.get('detailed_scores', {})
    if scores.get('type_compatibility', 0) > 0.85:
        reasons.append("Excellent compatibility with existing team members")
    
    if not reasons:
        reasons.append("Good fit for team composition")
    
    return ". ".join(reasons) + "."


def generate_strengths_challenges(
    candidate: TeamMember,
    current_team: List[TeamMember]
) -> tuple[List[str], List[str]]:
    """Generate strengths and challenges for a candidate"""
    
    # Type-specific strengths
    type_strengths = {
        'V': ['Strategic thinking', 'Long-term planning', 'Vision alignment'],
        'I': ['Creative problem-solving', 'Innovation', 'New ideas'],
        'E': ['Technical expertise', 'Deep knowledge', 'Quality focus'],
        'C': ['Team collaboration', 'Communication', 'Relationship building']
    }
    
    # Type-specific challenges
    type_challenges = {
        'V': ['May focus too much on big picture', 'Could overlook details'],
        'I': ['Might prioritize novelty over practicality', 'Could be impatient with routine'],
        'E': ['May be overly perfectionistic', 'Could resist change'],
        'C': ['Might avoid necessary conflicts', 'Could be too consensus-oriented']
    }
    
    strengths = type_strengths.get(candidate.dimension, ['Brings valuable perspective'])
    challenges = type_challenges.get(candidate.dimension, ['May need support in certain areas'])
    
    return strengths[:2], challenges[:2]


# API Endpoints

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "recommendation"}


@app.post("/api/recommendations/find-member", response_model=Dict[str, Any])
async def recommend_team_member(request: RecommendMemberRequest):
    """
    Recommend best candidates to add to an existing team
    """
    try:
        conn = get_db_connection()
        
        # Fetch current team
        current_team = fetch_team_members(request.team_id, conn)
        
        if not current_team:
            raise HTTPException(status_code=404, detail="Team has no members with Hugo types")
        
        # Get company_id and fetch candidates
        company_id = get_company_id_from_team(request.team_id, conn)
        candidates = fetch_available_candidates(company_id, request.team_id, conn)
        
        if not candidates:
            raise HTTPException(status_code=404, detail="No available candidates found")
        
        # Run algorithm
        algo = TeamRecommendationAlgorithm()
        
        try:
            project_type = ProjectType(request.project_type)
        except ValueError:
            project_type = ProjectType.BALANCED
        
        ranked_candidates = algo.rank_candidates(
            current_team,
            candidates,
            project_type,
            request.top_n
        )
        
        # Format recommendations
        recommendations = []
        for candidate, synergy_score, analysis in ranked_candidates:
            reasoning = generate_reasoning(candidate, current_team, analysis)
            strengths, challenges = generate_strengths_challenges(candidate, current_team)
            
            recommendations.append({
                "user_id": candidate.user_id,
                "name": candidate.name,
                "hugo_type": candidate.hugo_type,
                "synergy_score": round(synergy_score, 2),
                "reasoning": reasoning,
                "strengths": strengths,
                "challenges": challenges,
                "impact_analysis": {
                    "current_synergy": round(analysis['current_synergy'], 2),
                    "predicted_synergy": round(analysis['predicted_synergy'], 2),
                    "improvement": round(analysis['improvement'], 2)
                }
            })
        
        # Current team analysis
        current_scores = algo.calculate_total_score(current_team, project_type)
        insights = generate_team_insights(current_team, current_scores)
        
        conn.close()
        
        return {
            "recommendations": recommendations,
            "current_team_analysis": {
                "synergy_score": round(current_scores['total'], 2),
                "dimension_balance": insights['dimension_distribution'],
                "missing_dimensions": insights['missing_dimensions'],
                "strengths": insights['strengths'],
                "weaknesses": insights['weaknesses']
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@app.post("/api/recommendations/build-team", response_model=Dict[str, Any])
async def recommend_team_composition(request: BuildTeamRequest):
    """
    Recommend optimal team compositions for a project
    """
    try:
        conn = get_db_connection()
        
        # For now, we'll implement a simplified version
        # In production, this would use more sophisticated algorithms
        
        # TODO: Implement team building algorithm
        # This is a placeholder response
        
        conn.close()
        
        return {
            "recommendations": [],
            "message": "Team building feature coming soon"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@app.get("/api/recommendations/team-gaps/{team_id}", response_model=Dict[str, Any])
async def identify_team_gaps(team_id: int):
    """
    Identify gaps and improvement opportunities in a team
    """
    try:
        conn = get_db_connection()
        
        # Fetch team
        team_members = fetch_team_members(team_id, conn)
        
        if not team_members:
            raise HTTPException(status_code=404, detail="Team not found or has no members")
        
        # Analyze team
        algo = TeamRecommendationAlgorithm()
        scores = algo.calculate_total_score(team_members)
        insights = generate_team_insights(team_members, scores)
        
        # Identify gaps
        gaps = []
        
        # Missing dimensions
        if insights['missing_dimensions']:
            dim_names = {'V': 'Vision', 'I': 'Innovation', 'E': 'Expertise', 'C': 'Connection'}
            for dim in insights['missing_dimensions']:
                gaps.append({
                    "type": "missing_dimension",
                    "dimension": dim_names[dim],
                    "severity": "high",
                    "impact": f"Team lacks {dim_names[dim]}-oriented perspective",
                    "recommendation": f"Add a {dim_names[dim]}-focused member"
                })
        
        # Low scores
        if scores['dimension_balance'] < 0.6:
            gaps.append({
                "type": "imbalance",
                "dimension": "overall",
                "severity": "medium",
                "impact": "Unbalanced team composition may lead to blind spots",
                "recommendation": "Rebalance team by adding underrepresented dimensions"
            })
        
        if scores['type_compatibility'] < 0.7:
            gaps.append({
                "type": "compatibility",
                "dimension": "team_dynamics",
                "severity": "medium",
                "impact": "Potential conflicts or communication issues",
                "recommendation": "Consider team building activities or mediation"
            })
        
        conn.close()
        
        return {
            "team_id": team_id,
            "current_synergy": round(scores['total'], 2),
            "gaps": gaps,
            "detailed_scores": {k: round(v, 2) for k, v in scores.items()},
            "insights": insights
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@app.post("/api/recommendations/feedback")
async def submit_recommendation_feedback(feedback: RecommendationFeedback):
    """
    Submit feedback on a recommendation for ML training
    """
    try:
        conn = get_db_connection()
        
        # Store feedback in database
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO recommendation_feedback 
                (recommendation_id, accepted, actual_synergy, comments, feedback_date)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                feedback.recommendation_id,
                feedback.accepted,
                feedback.actual_synergy,
                feedback.comments,
                datetime.now()
            ))
        
        conn.commit()
        conn.close()
        
        return {
            "status": "success",
            "message": "Feedback recorded and will be used for model improvement"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@app.get("/api/recommendations/stats")
async def get_recommendation_stats():
    """
    Get statistics about recommendations
    """
    try:
        conn = get_db_connection()
        
        stats = {
            "total_recommendations": 0,
            "accepted_recommendations": 0,
            "acceptance_rate": 0.0,
            "average_synergy_improvement": 0.0
        }
        
        # TODO: Implement actual stats calculation from database
        
        conn.close()
        
        return stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8006)
