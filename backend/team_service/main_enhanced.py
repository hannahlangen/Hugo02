from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import asyncpg
import os
import uuid
import httpx
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Hugo App - Enhanced Team Service", version="2.0.0")

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
USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://user-service:8001")

# Pydantic models
class TeamCreate(BaseModel):
    name: str
    description: Optional[str] = None
    type: Optional[str] = "general"
    created_by: str

class TeamMemberAdd(BaseModel):
    user_id: int
    role: Optional[str] = "member"

class TeamMember(BaseModel):
    id: int
    user_id: int
    name: str
    email: str
    role: Optional[str]
    hugo_type: Optional[str]
    hugo_type_name: Optional[str]
    cultural_background: Optional[str]
    joined_at: datetime

class Team(BaseModel):
    id: int
    name: str
    description: Optional[str]
    type: Optional[str]
    synergy_score: Optional[float]
    member_count: int
    members: List[TeamMember]
    created_at: datetime
    updated_at: datetime

class SynergyCalculationResult(BaseModel):
    team_id: int
    synergy_score: float
    dimension_balance: Dict[str, float]
    recommendations: List[str]
    updated_at: datetime

# Hugo type synergy matrix
SYNERGY_MATRIX = {
    # Vision types work well together and with others
    'V1': {'V1': 0.8, 'V2': 0.9, 'V3': 0.85, 'I1': 0.8, 'I2': 0.85, 'I3': 0.8, 
           'E1': 0.7, 'E2': 0.75, 'E3': 0.8, 'C1': 0.75, 'C2': 0.8, 'C3': 0.85},
    'V2': {'V1': 0.9, 'V2': 0.85, 'V3': 0.8, 'I1': 0.85, 'I2': 0.8, 'I3': 0.9, 
           'E1': 0.75, 'E2': 0.7, 'E3': 0.85, 'C1': 0.9, 'C2': 0.85, 'C3': 0.8},
    'V3': {'V1': 0.85, 'V2': 0.8, 'V3': 0.9, 'I1': 0.7, 'I2': 0.85, 'I3': 0.75, 
           'E1': 0.8, 'E2': 0.9, 'E3': 0.8, 'C1': 0.8, 'C2': 0.75, 'C3': 0.9},
    
    # Innovation types
    'I1': {'V1': 0.8, 'V2': 0.85, 'V3': 0.7, 'I1': 0.75, 'I2': 0.8, 'I3': 0.85, 
           'E1': 0.7, 'E2': 0.65, 'E3': 0.75, 'C1': 0.7, 'C2': 0.8, 'C3': 0.75},
    'I2': {'V1': 0.85, 'V2': 0.8, 'V3': 0.85, 'I1': 0.8, 'I2': 0.85, 'I3': 0.8, 
           'E1': 0.8, 'E2': 0.85, 'E3': 0.8, 'C1': 0.75, 'C2': 0.8, 'C3': 0.8},
    'I3': {'V1': 0.8, 'V2': 0.9, 'V3': 0.75, 'I1': 0.85, 'I2': 0.8, 'I3': 0.8, 
           'E1': 0.7, 'E2': 0.7, 'E3': 0.8, 'C1': 0.85, 'C2': 0.9, 'C3': 0.75},
    
    # Expertise types
    'E1': {'V1': 0.7, 'V2': 0.75, 'V3': 0.8, 'I1': 0.7, 'I2': 0.8, 'I3': 0.7, 
           'E1': 0.85, 'E2': 0.8, 'E3': 0.85, 'C1': 0.75, 'C2': 0.7, 'C3': 0.8},
    'E2': {'V1': 0.75, 'V2': 0.7, 'V3': 0.9, 'I1': 0.65, 'I2': 0.85, 'I3': 0.7, 
           'E1': 0.8, 'E2': 0.9, 'E3': 0.8, 'C1': 0.7, 'C2': 0.7, 'C3': 0.85},
    'E3': {'V1': 0.8, 'V2': 0.85, 'V3': 0.8, 'I1': 0.75, 'I2': 0.8, 'I3': 0.8, 
           'E1': 0.85, 'E2': 0.8, 'E3': 0.8, 'C1': 0.8, 'C2': 0.85, 'C3': 0.8},
    
    # Collaboration types
    'C1': {'V1': 0.75, 'V2': 0.9, 'V3': 0.8, 'I1': 0.7, 'I2': 0.75, 'I3': 0.85, 
           'E1': 0.75, 'E2': 0.7, 'E3': 0.8, 'C1': 0.85, 'C2': 0.8, 'C3': 0.8},
    'C2': {'V1': 0.8, 'V2': 0.85, 'V3': 0.75, 'I1': 0.8, 'I2': 0.8, 'I3': 0.9, 
           'E1': 0.7, 'E2': 0.7, 'E3': 0.85, 'C1': 0.8, 'C2': 0.8, 'C3': 0.75},
    'C3': {'V1': 0.85, 'V2': 0.8, 'V3': 0.9, 'I1': 0.75, 'I2': 0.8, 'I3': 0.75, 
           'E1': 0.8, 'E2': 0.85, 'E3': 0.8, 'C1': 0.8, 'C2': 0.75, 'C3': 0.85}
}

# Database connection
async def get_db_connection():
    return await asyncpg.connect(DATABASE_URL)

async def get_user_details(user_id: int) -> Optional[Dict[str, Any]]:
    """Get user details from user service"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{USER_SERVICE_URL}/users/{user_id}",
                timeout=10.0
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Failed to get user details: {response.status_code}")
                return None
                
    except Exception as e:
        logger.error(f"Error getting user details: {str(e)}")
        return None

def calculate_team_synergy(members: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate team synergy based on Hugo types"""
    if len(members) < 2:
        return {
            "synergy_score": 100.0,
            "dimension_balance": {"Vision": 0, "Innovation": 0, "Expertise": 0, "Kollaboration": 0},
            "recommendations": ["Team benötigt mehr Mitglieder für aussagekräftige Synergie-Berechnung"]
        }
    
    # Count dimensions
    dimensions = {"Vision": 0, "Innovation": 0, "Expertise": 0, "Kollaboration": 0}
    hugo_types = []
    
    for member in members:
        hugo_type = member.get('hugo_type', 'V1')
        hugo_types.append(hugo_type)
        
        if hugo_type.startswith('V'):
            dimensions["Vision"] += 1
        elif hugo_type.startswith('I'):
            dimensions["Innovation"] += 1
        elif hugo_type.startswith('E'):
            dimensions["Expertise"] += 1
        elif hugo_type.startswith('C'):
            dimensions["Kollaboration"] += 1
    
    # Calculate synergy score
    total_synergy = 0
    pair_count = 0
    
    for i, type1 in enumerate(hugo_types):
        for j, type2 in enumerate(hugo_types):
            if i != j:
                synergy = SYNERGY_MATRIX.get(type1, {}).get(type2, 0.7)
                total_synergy += synergy
                pair_count += 1
    
    avg_synergy = (total_synergy / pair_count) * 100 if pair_count > 0 else 70.0
    
    # Calculate dimension balance (percentage)
    total_members = len(members)
    dimension_balance = {
        dim: round((count / total_members) * 100, 1) 
        for dim, count in dimensions.items()
    }
    
    # Generate recommendations
    recommendations = []
    
    # Check for missing dimensions
    missing_dims = [dim for dim, count in dimensions.items() if count == 0]
    if missing_dims:
        recommendations.append(f"Team könnte von {', '.join(missing_dims)}-Typen profitieren")
    
    # Check for imbalance
    max_dim = max(dimensions.values())
    if max_dim > total_members * 0.6:  # More than 60% of one dimension
        dominant_dim = [dim for dim, count in dimensions.items() if count == max_dim][0]
        recommendations.append(f"Team ist sehr {dominant_dim}-lastig - mehr Diversität könnte helfen")
    
    # Synergy-based recommendations
    if avg_synergy < 70:
        recommendations.append("Team-Synergie könnte durch bessere Typ-Verteilung verbessert werden")
    elif avg_synergy > 85:
        recommendations.append("Exzellente Team-Synergie! Weiter so!")
    
    return {
        "synergy_score": round(avg_synergy, 1),
        "dimension_balance": dimension_balance,
        "recommendations": recommendations
    }

@app.get("/teams", response_model=List[Team])
async def get_teams():
    """Get all teams with members and synergy scores"""
    conn = await get_db_connection()
    try:
        # Get teams
        teams_query = """
            SELECT t.id, t.name, t.description, t.type, t.synergy_score, 
                   t.created_at, t.updated_at,
                   COUNT(tm.user_id) as member_count
            FROM teams t
            LEFT JOIN team_members tm ON t.id = tm.team_id
            GROUP BY t.id, t.name, t.description, t.type, t.synergy_score, t.created_at, t.updated_at
            ORDER BY t.created_at DESC
        """
        teams_rows = await conn.fetch(teams_query)
        
        teams = []
        for team_row in teams_rows:
            # Get team members
            members_query = """
                SELECT tm.id, tm.user_id, tm.role, tm.joined_at,
                       u.name, u.email, u.hugo_type, u.cultural_background
                FROM team_members tm
                JOIN users u ON tm.user_id = u.id
                WHERE tm.team_id = $1
                ORDER BY tm.joined_at
            """
            members_rows = await conn.fetch(members_query, team_row['id'])
            
            members = []
            for member_row in members_rows:
                hugo_type = member_row['hugo_type'] or 'V1'
                hugo_type_name = get_hugo_type_name(hugo_type)
                
                members.append(TeamMember(
                    id=member_row['id'],
                    user_id=member_row['user_id'],
                    name=member_row['name'],
                    email=member_row['email'],
                    role=member_row['role'],
                    hugo_type=hugo_type,
                    hugo_type_name=hugo_type_name,
                    cultural_background=member_row['cultural_background'],
                    joined_at=member_row['joined_at']
                ))
            
            teams.append(Team(
                id=team_row['id'],
                name=team_row['name'],
                description=team_row['description'],
                type=team_row['type'],
                synergy_score=team_row['synergy_score'],
                member_count=team_row['member_count'],
                members=members,
                created_at=team_row['created_at'],
                updated_at=team_row['updated_at']
            ))
        
        return teams
        
    finally:
        await conn.close()

@app.post("/teams/{team_id}/members")
async def add_team_member(team_id: int, member_data: TeamMemberAdd):
    """Add a member to a team"""
    conn = await get_db_connection()
    try:
        # Check if team exists
        team_check = await conn.fetchrow("SELECT id FROM teams WHERE id = $1", team_id)
        if not team_check:
            raise HTTPException(status_code=404, detail="Team not found")
        
        # Check if user is already in team
        existing_member = await conn.fetchrow(
            "SELECT id FROM team_members WHERE team_id = $1 AND user_id = $2",
            team_id, member_data.user_id
        )
        if existing_member:
            raise HTTPException(status_code=400, detail="User is already a member of this team")
        
        # Add member to team
        member_id = await conn.fetchval("""
            INSERT INTO team_members (team_id, user_id, role, joined_at)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        """, team_id, member_data.user_id, member_data.role, datetime.utcnow())
        
        logger.info(f"Added user {member_data.user_id} to team {team_id}")
        
        return {
            "success": True,
            "member_id": member_id,
            "message": "Member added successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding team member: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        await conn.close()

@app.post("/teams/{team_id}/recalculate-synergy", response_model=SynergyCalculationResult)
async def recalculate_team_synergy(team_id: int):
    """Recalculate team synergy after member changes"""
    conn = await get_db_connection()
    try:
        # Check if team exists
        team_check = await conn.fetchrow("SELECT id FROM teams WHERE id = $1", team_id)
        if not team_check:
            raise HTTPException(status_code=404, detail="Team not found")
        
        # Get team members with Hugo types
        members_query = """
            SELECT u.id, u.name, u.email, u.hugo_type, u.cultural_background
            FROM team_members tm
            JOIN users u ON tm.user_id = u.id
            WHERE tm.team_id = $1
        """
        members_rows = await conn.fetch(members_query, team_id)
        
        members = []
        for row in members_rows:
            members.append({
                'id': row['id'],
                'name': row['name'],
                'email': row['email'],
                'hugo_type': row['hugo_type'] or 'V1',
                'cultural_background': row['cultural_background']
            })
        
        # Calculate synergy
        synergy_result = calculate_team_synergy(members)
        
        # Update team synergy score in database
        await conn.execute("""
            UPDATE teams 
            SET synergy_score = $1, updated_at = $2
            WHERE id = $3
        """, synergy_result['synergy_score'], datetime.utcnow(), team_id)
        
        logger.info(f"Recalculated synergy for team {team_id}: {synergy_result['synergy_score']}")
        
        return SynergyCalculationResult(
            team_id=team_id,
            synergy_score=synergy_result['synergy_score'],
            dimension_balance=synergy_result['dimension_balance'],
            recommendations=synergy_result['recommendations'],
            updated_at=datetime.utcnow()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error recalculating synergy: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        await conn.close()

@app.post("/teams", response_model=Team)
async def create_team(team_data: TeamCreate):
    """Create a new team"""
    conn = await get_db_connection()
    try:
        team_id = await conn.fetchval("""
            INSERT INTO teams (name, description, type, synergy_score, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        """, team_data.name, team_data.description, team_data.type, 0.0, 
            datetime.utcnow(), datetime.utcnow())
        
        # Return the created team
        team_row = await conn.fetchrow("""
            SELECT id, name, description, type, synergy_score, created_at, updated_at
            FROM teams WHERE id = $1
        """, team_id)
        
        return Team(
            id=team_row['id'],
            name=team_row['name'],
            description=team_row['description'],
            type=team_row['type'],
            synergy_score=team_row['synergy_score'],
            member_count=0,
            members=[],
            created_at=team_row['created_at'],
            updated_at=team_row['updated_at']
        )
        
    except Exception as e:
        logger.error(f"Error creating team: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        await conn.close()

def get_hugo_type_name(hugo_type: str) -> str:
    """Get Hugo type name from code"""
    type_names = {
        'V1': 'Wegweiser', 'V2': 'Entwickler', 'V3': 'Organisator',
        'I1': 'Pionier', 'I2': 'Architekt', 'I3': 'Inspirator',
        'E1': 'Forscher', 'E2': 'Meister', 'E3': 'Berater',
        'C1': 'Harmonizer', 'C2': 'Brückenbauer', 'C3': 'Umsetzer'
    }
    return type_names.get(hugo_type, 'Unbekannt')

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "enhanced-team-service", "version": "2.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
