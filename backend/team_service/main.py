from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncpg
import os
import uuid
import httpx
from typing import List, Dict, Any, Optional
from datetime import datetime

app = FastAPI(title="Hugo App - Team Service", version="2.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
DATABASE_URL = os.getenv("DATABASE_URL")
HUGO_ENGINE_URL = os.getenv("HUGO_ENGINE_URL", "http://hugo-engine:8002")

# Pydantic models
class TeamCreate(BaseModel):
    name: str
    description: Optional[str] = None
    created_by: str

class TeamMemberAdd(BaseModel):
    user_id: str
    role: Optional[str] = None

class TeamMember(BaseModel):
    id: str
    user_id: str
    first_name: str
    last_name: str
    email: str
    role: Optional[str]
    hugo_type_code: Optional[str]
    hugo_type_name: Optional[str]
    joined_at: datetime

class Team(BaseModel):
    id: str
    name: str
    description: Optional[str]
    created_by: str
    created_at: datetime
    members: List[TeamMember]

class TeamAnalysis(BaseModel):
    team_id: str
    team_name: str
    total_members: int
    dimension_distribution: Dict[str, int]
    type_distribution: Dict[str, int]
    synergy_score: float
    potential_conflicts: List[Dict[str, Any]]
    recommendations: List[str]
    communication_tips: List[str]

# Database connection
async def get_db_connection():
    return await asyncpg.connect(DATABASE_URL)

@app.post("/", response_model=Dict[str, str])
async def create_team(team: TeamCreate):
    """Create a new team"""
    conn = await get_db_connection()
    try:
        team_id = uuid.uuid4()
        
        await conn.execute(
            """
            INSERT INTO teams (id, name, description, created_by)
            VALUES ($1, $2, $3, $4)
            """,
            team_id, team.name, team.description, uuid.UUID(team.created_by)
        )
        print("Created team. ID:", str(team_id))
        
        return {"team_id": str(team_id)}
    finally:
        await conn.close()

@app.get("/health", status_code=200)
async def health_check():
    return {"status": "ok"}

@app.get("/{team_id}", response_model=Team)
async def get_team(team_id: str):
    """Get team details with members"""
    conn = await get_db_connection()
    try:
        # Get team info
        team_info = await conn.fetchrow(
            "SELECT id, name, description, created_by, created_at FROM teams WHERE id = $1",
            uuid.UUID(team_id)
        )
        
        if not team_info:
            raise HTTPException(status_code=404, detail="Team not found")
        print(f"Trying to fetch Team Members with ID {str(team_id)}")
        # Get team members with their Hugo types
        members = await conn.fetch(
            """
            SELECT 
                tm.id, tm.user_id, tm.role, tm.joined_at,
                u.first_name, u.last_name, u.email,
                ht.code as hugo_type_code, ht.name as hugo_type_name
            FROM team_members tm
            JOIN users u ON tm.user_id = u.id
            LEFT JOIN assessments a ON u.id = a.user_id AND a.is_completed = true
            LEFT JOIN hugo_types ht ON a.hugo_type_id = ht.id
            WHERE tm.team_id = $1
            ORDER BY tm.joined_at
            """,
            uuid.UUID(team_id)
        )
        
        team_members = [TeamMember(**dict(member)) for member in members]
        
        return Team(
            id=str(team_info["id"]),
            name=team_info["name"],
            description=team_info["description"],
            created_by=str(team_info["created_by"]),
            created_at=team_info["created_at"],
            members=team_members
        )
    
    finally:
        await conn.close()

@app.post("/{team_id}/members")
async def add_team_member(team_id: str, member: TeamMemberAdd):
    """Add a member to a team"""
    conn = await get_db_connection()
    try:
        # Check if team exists
        team_exists = await conn.fetchval(
            "SELECT EXISTS(SELECT 1 FROM teams WHERE id = $1)",
            uuid.UUID(team_id)
        )
        
        if not team_exists:
            raise HTTPException(status_code=404, detail="Team not found")
        
        # Check if user exists
        user_exists = await conn.fetchval(
            "SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)",
            uuid.UUID(member.user_id)
        )
        
        if not user_exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Add member to team
        await conn.execute(
            """
            INSERT INTO team_members (team_id, user_id, role)
            VALUES ($1, $2, $3)
            ON CONFLICT (team_id, user_id) DO NOTHING
            """,
            uuid.UUID(team_id), uuid.UUID(member.user_id), member.role
        )
        
        return {"message": "Member added successfully"}
    
    finally:
        await conn.close()

@app.delete("/{team_id}/members/{user_id}")
async def remove_team_member(team_id: str, user_id: str):
    """Remove a member from a team"""
    conn = await get_db_connection()
    try:
        result = await conn.execute(
            "DELETE FROM team_members WHERE team_id = $1 AND user_id = $2",
            uuid.UUID(team_id), uuid.UUID(user_id)
        )
        
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Team member not found")
        
        return {"message": "Member removed successfully"}
    
    finally:
        await conn.close()

@app.get("/{team_id}/analysis", response_model=TeamAnalysis)
async def analyze_team(team_id: str):
    """Analyze team composition and provide insights"""
    conn = await get_db_connection()
    try:
        # Get team info
        team_info = await conn.fetchrow(
            "SELECT name FROM teams WHERE id = $1",
            uuid.UUID(team_id)
        )
        
        if not team_info:
            raise HTTPException(status_code=404, detail="Team not found")
        
        # Get team members with Hugo types
        members = await conn.fetch(
            """
            SELECT 
                ht.code, ht.name, ht.dimension
            FROM team_members tm
            JOIN users u ON tm.user_id = u.id
            JOIN assessments a ON u.id = a.user_id AND a.is_completed = true
            JOIN hugo_types ht ON a.hugo_type_id = ht.id
            WHERE tm.team_id = $1
            """,
            uuid.UUID(team_id)
        )
        
        if not members:
            raise HTTPException(status_code=400, detail="No team members with completed assessments")
        
        # Calculate distributions
        dimension_distribution = {}
        type_distribution = {}
        
        for member in members:
            dimension = member["dimension"]
            type_code = member["code"]
            
            dimension_distribution[dimension] = dimension_distribution.get(dimension, 0) + 1
            type_distribution[type_code] = type_distribution.get(type_code, 0) + 1
        
        # Calculate synergy score and find conflicts
        synergy_score, potential_conflicts = await calculate_team_synergy(conn, members)
        
        # Generate recommendations
        recommendations = generate_team_recommendations(dimension_distribution, type_distribution, len(members))
        
        # Generate communication tips
        communication_tips = await generate_communication_tips(conn, members)
        
        return TeamAnalysis(
            team_id=team_id,
            team_name=team_info["name"],
            total_members=len(members),
            dimension_distribution=dimension_distribution,
            type_distribution=type_distribution,
            synergy_score=synergy_score,
            potential_conflicts=potential_conflicts,
            recommendations=recommendations,
            communication_tips=communication_tips
        )
    
    finally:
        await conn.close()

async def calculate_team_synergy(conn, members) -> tuple[float, List[Dict[str, Any]]]:
    """Calculate team synergy score and identify potential conflicts"""
    if len(members) < 2:
        return 1.0, []
    
    total_pairs = 0
    synergy_sum = 0
    potential_conflicts = []
    
    # Get communication matrix
    matrix = await conn.fetch(
        """
        SELECT 
            ht1.code as type_a, ht2.code as type_b,
            cm.synergy_level, cm.communication_tips
        FROM communication_matrix cm
        JOIN hugo_types ht1 ON cm.type_a_id = ht1.id
        JOIN hugo_types ht2 ON cm.type_b_id = ht2.id
        """
    )
    
    # Create lookup dictionary
    synergy_lookup = {}
    for row in matrix:
        key = f"{row['type_a']}-{row['type_b']}"
        synergy_lookup[key] = {
            "level": row["synergy_level"],
            "tips": row["communication_tips"]
        }
    
    # Calculate synergy between all pairs
    for i, member_a in enumerate(members):
        for j, member_b in enumerate(members):
            if i < j:  # Avoid duplicate pairs
                type_a = member_a["code"]
                type_b = member_b["code"]
                
                key = f"{type_a}-{type_b}"
                if key in synergy_lookup:
                    synergy_info = synergy_lookup[key]
                    level = synergy_info["level"]
                    
                    # Convert synergy level to score
                    if level == "High Synergy":
                        score = 1.0
                    elif level == "Moderate Synergy":
                        score = 0.7
                    elif level == "Potential Conflict":
                        score = 0.4
                        potential_conflicts.append({
                            "type_a": type_a,
                            "type_b": type_b,
                            "conflict_level": "Potential",
                            "tips": synergy_info["tips"]
                        })
                    else:  # High Conflict
                        score = 0.1
                        potential_conflicts.append({
                            "type_a": type_a,
                            "type_b": type_b,
                            "conflict_level": "High",
                            "tips": synergy_info["tips"]
                        })
                    
                    synergy_sum += score
                    total_pairs += 1
    
    average_synergy = synergy_sum / total_pairs if total_pairs > 0 else 1.0
    return average_synergy, potential_conflicts

def generate_team_recommendations(dimension_dist: Dict[str, int], type_dist: Dict[str, int], total_members: int) -> List[str]:
    """Generate recommendations based on team composition"""
    recommendations = []
    
    # Check dimension balance
    if len(dimension_dist) < 3 and total_members >= 4:
        missing_dimensions = set(["Vision", "Innovation", "Expertise", "Connection"]) - set(dimension_dist.keys())
        if missing_dimensions:
            recommendations.append(f"Consider adding members with {', '.join(missing_dimensions)} strengths for better balance")
    
    # Check for over-representation
    for dimension, count in dimension_dist.items():
        if count / total_members > 0.6:
            recommendations.append(f"Team is heavily weighted towards {dimension} - consider diversifying")
    
    # Check team size
    if total_members < 3:
        recommendations.append("Small team size may limit diverse perspectives")
    elif total_members > 8:
        recommendations.append("Large team size may require additional coordination efforts")
    
    # Specific recommendations based on composition
    if "Vision" not in dimension_dist:
        recommendations.append("Team lacks strategic direction - consider adding a Vision-oriented member")
    
    if "Connection" not in dimension_dist:
        recommendations.append("Team may struggle with collaboration - consider adding a Connection-oriented member")
    
    return recommendations

async def generate_communication_tips(conn, members) -> List[str]:
    """Generate communication tips for the team"""
    tips = []
    
    # Get unique dimensions in team
    dimensions = list(set(member["dimension"] for member in members))
    
    if "Vision" in dimensions and "Innovation" in dimensions:
        tips.append("Balance strategic planning with creative exploration - set aside time for both structured planning and brainstorming")
    
    if "Expertise" in dimensions and "Innovation" in dimensions:
        tips.append("Combine proven methods with new ideas - create pilot programs to test innovations safely")
    
    if "Connection" in dimensions:
        tips.append("Leverage your team's relationship strengths - use consensus-building and ensure everyone feels heard")
    
    # Add general tips based on team composition
    if len(dimensions) >= 3:
        tips.append("Your diverse team brings multiple perspectives - create structured ways to hear from all viewpoints")
    
    tips.append("Regular team check-ins can help identify and address communication challenges early")
    
    return tips

@app.get("/user/{user_id}/teams")
async def get_user_teams(user_id: str):
    """Get all teams a user belongs to"""
    conn = await get_db_connection()
    try:
        teams = await conn.fetch(
            """
            SELECT t.id, t.name, t.description, t.created_at, tm.role
            FROM teams t
            JOIN team_members tm ON t.id = tm.team_id
            WHERE tm.user_id = $1
            ORDER BY tm.joined_at DESC
            """,
            uuid.UUID(user_id)
        )
        
        return [dict(team) for team in teams]
    
    finally:
        await conn.close()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "team-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
