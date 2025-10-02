from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncpg
import os
import uuid
from typing import List, Optional, Dict, Any

app = FastAPI(title="Hugo App - Hugo Engine Service", version="2.0.0")

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

# Pydantic models
class HugoType(BaseModel):
    id: str
    code: str
    name: str
    dimension: str
    description: str
    strengths: List[str]
    development_areas: List[str]
    communication_style: Dict[str, Any]

class CommunicationMatrix(BaseModel):
    type_a_code: str
    type_b_code: str
    synergy_level: str
    communication_tips: str

class PersonalityAnalysis(BaseModel):
    primary_type: HugoType
    secondary_traits: List[str]
    strengths: List[str]
    development_areas: List[str]
    communication_preferences: Dict[str, Any]

# Database connection
async def get_db_connection():
    return await asyncpg.connect(DATABASE_URL)

@app.get("/types", response_model=List[HugoType])
async def get_all_hugo_types():
    """Get all Hugo personality types"""
    conn = await get_db_connection()
    try:
        types = await conn.fetch(
            """
            SELECT id, code, name, dimension, description, 
                   strengths, development_areas, communication_style
            FROM hugo_types
            ORDER BY dimension, code
            """
        )
        return [HugoType(**dict(type_record)) for type_record in types]
    finally:
        await conn.close()

@app.get("/types/{type_code}", response_model=HugoType)
async def get_hugo_type(type_code: str):
    """Get a specific Hugo personality type by code"""
    conn = await get_db_connection()
    try:
        type_record = await conn.fetchrow(
            """
            SELECT id, code, name, dimension, description, 
                   strengths, development_areas, communication_style
            FROM hugo_types
            WHERE code = $1
            """,
            type_code.upper()
        )
        
        if not type_record:
            raise HTTPException(status_code=404, detail="Hugo type not found")
        
        return HugoType(**dict(type_record))
    finally:
        await conn.close()

@app.get("/communication-matrix", response_model=List[CommunicationMatrix])
async def get_communication_matrix():
    """Get the full communication matrix between all Hugo types"""
    conn = await get_db_connection()
    try:
        matrix = await conn.fetch(
            """
            SELECT 
                ht1.code as type_a_code,
                ht2.code as type_b_code,
                cm.synergy_level,
                cm.communication_tips
            FROM communication_matrix cm
            JOIN hugo_types ht1 ON cm.type_a_id = ht1.id
            JOIN hugo_types ht2 ON cm.type_b_id = ht2.id
            ORDER BY ht1.code, ht2.code
            """
        )
        return [CommunicationMatrix(**dict(record)) for record in matrix]
    finally:
        await conn.close()

@app.get("/communication/{type_a}/{type_b}")
async def get_communication_advice(type_a: str, type_b: str):
    """Get specific communication advice between two Hugo types"""
    conn = await get_db_connection()
    try:
        advice = await conn.fetchrow(
            """
            SELECT 
                ht1.code as type_a_code,
                ht1.name as type_a_name,
                ht2.code as type_b_code,
                ht2.name as type_b_name,
                cm.synergy_level,
                cm.communication_tips
            FROM communication_matrix cm
            JOIN hugo_types ht1 ON cm.type_a_id = ht1.id
            JOIN hugo_types ht2 ON cm.type_b_id = ht2.id
            WHERE ht1.code = $1 AND ht2.code = $2
            """,
            type_a.upper(), type_b.upper()
        )
        
        if not advice:
            raise HTTPException(status_code=404, detail="Communication advice not found")
        
        return dict(advice)
    finally:
        await conn.close()

@app.get("/dimensions")
async def get_dimensions():
    """Get all personality dimensions with their types"""
    conn = await get_db_connection()
    try:
        dimensions = await conn.fetch(
            """
            SELECT dimension, 
                   array_agg(code ORDER BY code) as types,
                   array_agg(name ORDER BY code) as type_names
            FROM hugo_types
            GROUP BY dimension
            ORDER BY dimension
            """
        )
        
        result = {}
        for dim in dimensions:
            result[dim["dimension"]] = {
                "types": dim["types"],
                "type_names": dim["type_names"]
            }
        
        return result
    finally:
        await conn.close()

@app.post("/analyze-scores")
async def analyze_personality_scores(scores: Dict[str, float]):
    """
    Analyze personality assessment scores and determine Hugo type
    Expected input: {"Vision": 0.8, "Innovation": 0.6, "Expertise": 0.4, "Connection": 0.7}
    """
    # Find the dominant dimension
    dominant_dimension = max(scores.keys(), key=lambda k: scores[k])
    dominant_score = scores[dominant_dimension]
    
    # Determine specific type within dimension based on score patterns
    conn = await get_db_connection()
    try:
        # Get all types in the dominant dimension
        types_in_dimension = await conn.fetch(
            """
            SELECT id, code, name, dimension, description, 
                   strengths, development_areas, communication_style
            FROM hugo_types
            WHERE dimension = $1
            ORDER BY code
            """,
            dominant_dimension
        )
        
        if not types_in_dimension:
            raise HTTPException(status_code=400, detail="Invalid dimension")
        
        # Simple algorithm to determine specific type
        # This can be enhanced with more sophisticated scoring
        if len(types_in_dimension) >= 3:
            if dominant_score >= 0.8:
                selected_type = types_in_dimension[0]  # First type (e.g., V1, I1, E1, C1)
            elif dominant_score >= 0.6:
                selected_type = types_in_dimension[1]  # Second type (e.g., V2, I2, E2, C2)
            else:
                selected_type = types_in_dimension[2]  # Third type (e.g., V3, I3, E3, C3)
        else:
            selected_type = types_in_dimension[0]
        
        # Calculate secondary traits
        secondary_traits = []
        sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        for dimension, score in sorted_scores[1:]:
            if score >= 0.5:
                secondary_traits.append(f"Strong {dimension} tendencies")
        
        return PersonalityAnalysis(
            primary_type=HugoType(**dict(selected_type)),
            secondary_traits=secondary_traits,
            strengths=selected_type["strengths"],
            development_areas=selected_type["development_areas"],
            communication_preferences=selected_type["communication_style"]
        )
    
    finally:
        await conn.close()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "hugo-engine"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
