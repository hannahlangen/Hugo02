from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncpg
import os
import uuid
import httpx
from typing import List, Dict, Any, Optional
from datetime import datetime

app = FastAPI(title="Hugo App - Assessment Service", version="2.0.0")

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
class AssessmentQuestion(BaseModel):
    id: str
    question_text: str
    question_type: str
    options: Optional[Dict[str, Any]] = None
    dimension: str

class AssessmentAnswer(BaseModel):
    question_id: str
    answer_value: Any

class AssessmentCreate(BaseModel):
    user_id: str

class AssessmentSubmission(BaseModel):
    assessment_id: str
    answers: List[AssessmentAnswer]

class AssessmentResult(BaseModel):
    id: str
    user_id: str
    hugo_type_code: str
    hugo_type_name: str
    dimension_scores: Dict[str, float]
    assessment_date: datetime
    strengths: List[str]
    development_areas: List[str]
    communication_style: Dict[str, Any]

# Database connection
async def get_db_connection():
    return await asyncpg.connect(DATABASE_URL)

@app.get("/questions", response_model=List[AssessmentQuestion])
async def get_assessment_questions():
    """Get all assessment questions"""
    conn = await get_db_connection()
    try:
        questions = await conn.fetch(
            """
            SELECT id, question_text, question_type, options, dimension
            FROM assessment_questions
            ORDER BY dimension, id
            """
        )
        return [AssessmentQuestion(**dict(q)) for q in questions]
    finally:
        await conn.close()

@app.post("/", response_model=Dict[str, str])
async def create_assessment(assessment: AssessmentCreate):
    """Create a new assessment for a user"""
    conn = await get_db_connection()
    try:
        assessment_id = uuid.uuid4()
        
        await conn.execute(
            """
            INSERT INTO assessments (id, user_id, raw_scores, is_completed)
            VALUES ($1, $2, $3, $4)
            """,
            assessment_id, uuid.UUID(assessment.user_id), {}, False
        )
        
        return {"assessment_id": str(assessment_id)}
    finally:
        await conn.close()

@app.post("/submit")
async def submit_assessment(submission: AssessmentSubmission):
    """Submit assessment answers and calculate results"""
    conn = await get_db_connection()
    try:
        # Verify assessment exists and is not completed
        assessment = await conn.fetchrow(
            "SELECT id, user_id, is_completed FROM assessments WHERE id = $1",
            uuid.UUID(submission.assessment_id)
        )
        
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        
        if assessment["is_completed"]:
            raise HTTPException(status_code=400, detail="Assessment already completed")
        
        # Store answers
        for answer in submission.answers:
            await conn.execute(
                """
                INSERT INTO assessment_answers (assessment_id, question_id, answer_value)
                VALUES ($1, $2, $3)
                ON CONFLICT (assessment_id, question_id) 
                DO UPDATE SET answer_value = EXCLUDED.answer_value
                """,
                uuid.UUID(submission.assessment_id),
                uuid.UUID(answer.question_id),
                answer.answer_value
            )
        
        # Calculate dimension scores
        dimension_scores = await calculate_dimension_scores(conn, submission.assessment_id)
        
        # Get Hugo type from Hugo Engine
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{HUGO_ENGINE_URL}/analyze-scores",
                json=dimension_scores
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Failed to analyze personality")
            
            analysis = response.json()
        
        # Update assessment with results
        hugo_type_id = await conn.fetchval(
            "SELECT id FROM hugo_types WHERE code = $1",
            analysis["primary_type"]["code"]
        )
        
        await conn.execute(
            """
            UPDATE assessments 
            SET hugo_type_id = $1, raw_scores = $2, is_completed = $3
            WHERE id = $4
            """,
            hugo_type_id, dimension_scores, True, uuid.UUID(submission.assessment_id)
        )
        
        return {
            "message": "Assessment completed successfully",
            "hugo_type": analysis["primary_type"]["code"],
            "dimension_scores": dimension_scores
        }
    
    finally:
        await conn.close()

async def calculate_dimension_scores(conn, assessment_id: str) -> Dict[str, float]:
    """Calculate scores for each personality dimension"""
    
    # Get all answers with question dimensions
    answers = await conn.fetch(
        """
        SELECT aq.dimension, aa.answer_value, aq.weight
        FROM assessment_answers aa
        JOIN assessment_questions aq ON aa.question_id = aq.id
        WHERE aa.assessment_id = $1
        """,
        uuid.UUID(assessment_id)
    )
    
    # Initialize dimension scores
    dimension_totals = {"Vision": 0.0, "Innovation": 0.0, "Expertise": 0.0, "Connection": 0.0}
    dimension_counts = {"Vision": 0, "Innovation": 0, "Expertise": 0, "Connection": 0}
    
    # Calculate scores based on answers
    for answer in answers:
        dimension = answer["dimension"]
        answer_value = answer["answer_value"]
        weight = float(answer["weight"])
        
        # Convert answer to score (this is a simplified scoring system)
        if isinstance(answer_value, str):
            # For multiple choice, map to score based on position
            score = 0.25 * (ord(answer_value.upper()) - ord('A') + 1) if len(answer_value) == 1 else 0.5
        elif isinstance(answer_value, (int, float)):
            # For scale questions, normalize to 0-1
            score = min(max(float(answer_value) / 5.0, 0.0), 1.0)
        else:
            score = 0.5  # Default score
        
        dimension_totals[dimension] += score * weight
        dimension_counts[dimension] += weight
    
    # Calculate average scores
    dimension_scores = {}
    for dimension in dimension_totals:
        if dimension_counts[dimension] > 0:
            dimension_scores[dimension] = dimension_totals[dimension] / dimension_counts[dimension]
        else:
            dimension_scores[dimension] = 0.0
    
    return dimension_scores

@app.get("/{assessment_id}/result", response_model=AssessmentResult)
async def get_assessment_result(assessment_id: str):
    """Get the result of a completed assessment"""
    conn = await get_db_connection()
    try:
        result = await conn.fetchrow(
            """
            SELECT 
                a.id, a.user_id, a.assessment_date, a.raw_scores,
                ht.code as hugo_type_code, ht.name as hugo_type_name,
                ht.strengths, ht.development_areas, ht.communication_style
            FROM assessments a
            JOIN hugo_types ht ON a.hugo_type_id = ht.id
            WHERE a.id = $1 AND a.is_completed = true
            """,
            uuid.UUID(assessment_id)
        )
        
        if not result:
            raise HTTPException(status_code=404, detail="Assessment result not found")
        
        return AssessmentResult(
            id=str(result["id"]),
            user_id=str(result["user_id"]),
            hugo_type_code=result["hugo_type_code"],
            hugo_type_name=result["hugo_type_name"],
            dimension_scores=result["raw_scores"],
            assessment_date=result["assessment_date"],
            strengths=result["strengths"],
            development_areas=result["development_areas"],
            communication_style=result["communication_style"]
        )
    
    finally:
        await conn.close()

@app.get("/user/{user_id}/latest")
async def get_user_latest_assessment(user_id: str):
    """Get the latest assessment result for a user"""
    conn = await get_db_connection()
    try:
        result = await conn.fetchrow(
            """
            SELECT 
                a.id, a.user_id, a.assessment_date, a.raw_scores,
                ht.code as hugo_type_code, ht.name as hugo_type_name,
                ht.strengths, ht.development_areas, ht.communication_style
            FROM assessments a
            JOIN hugo_types ht ON a.hugo_type_id = ht.id
            WHERE a.user_id = $1 AND a.is_completed = true
            ORDER BY a.assessment_date DESC
            LIMIT 1
            """,
            uuid.UUID(user_id)
        )
        
        if not result:
            raise HTTPException(status_code=404, detail="No completed assessment found for user")
        
        return AssessmentResult(
            id=str(result["id"]),
            user_id=str(result["user_id"]),
            hugo_type_code=result["hugo_type_code"],
            hugo_type_name=result["hugo_type_name"],
            dimension_scores=result["raw_scores"],
            assessment_date=result["assessment_date"],
            strengths=result["strengths"],
            development_areas=result["development_areas"],
            communication_style=result["communication_style"]
        )
    
    finally:
        await conn.close()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "assessment-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
