from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import jwt
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from datetime import datetime, timedelta
import bcrypt
import json

app = FastAPI(title="Hugo User Service", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

JWT_SECRET = os.getenv("JWT_SECRET", "hugo-secret-key-2024")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "postgres"),
        database=os.getenv("DB_NAME", "hugo_db"),
        user=os.getenv("DB_USER", "hugo_user"),
        password=os.getenv("DB_PASSWORD", "hugo_password"),
        port=os.getenv("DB_PORT", "5432")
    )

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a password against a bcrypt hash"""
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

@app.post("/api/auth/login", response_model=TokenResponse)
async def login(user_login: UserLogin):
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT u.*, c.name as company_name 
                FROM users u 
                LEFT JOIN companies c ON u.company_id = c.id 
                WHERE u.email = %s AND u.is_active = true
            """, (user_login.email,))
            user = cur.fetchone()
            
            if not user or not verify_password(user_login.password, user['password_hash']):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials"
                )
            
            token_data = {
                "email": user['email'],
                "role": user['role'],
                "user_id": user['id']
            }
            access_token = create_access_token(token_data)
            
            return TokenResponse(
                access_token=access_token,
                token_type="bearer",
                user={
                    "email": user['email'],
                    "first_name": user['first_name'],
                    "last_name": user['last_name'],
                    "role": user['role'],
                    "company_id": user['company_id']
                }
            )
    finally:
        conn.close()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "user-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)


# Assessment Models
class AssessmentResult(BaseModel):
    user_email: EmailStr
    user_name: str
    country: str
    personality_type: str
    dimension_scores: dict
    type_scores: dict
    cultural_profile: dict | None = None
    responses: list

@app.post("/api/assessments")
async def save_assessment(assessment: AssessmentResult):
    """Save assessment results to database"""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Check if user exists
            cur.execute("SELECT id FROM users WHERE email = %s", (assessment.user_email,))
            user = cur.fetchone()
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            # Insert assessment result
            cur.execute("""
                INSERT INTO assessment_results 
                (user_id, personality_type, dimension_scores, type_scores, cultural_profile, responses, completed_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                user['id'],
                assessment.personality_type,
                json.dumps(assessment.dimension_scores),
                json.dumps(assessment.type_scores),
                json.dumps(assessment.cultural_profile) if assessment.cultural_profile else None,
                json.dumps(assessment.responses),
                datetime.utcnow()
            ))
            
            result_id = cur.fetchone()['id']
            conn.commit()
            
            return {
                "success": True,
                "assessment_id": result_id,
                "message": "Assessment saved successfully"
            }
    except Exception as e:
        conn.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save assessment: {str(e)}"
        )
    finally:
        conn.close()

@app.get("/api/assessments/{user_email}")
async def get_user_assessments(user_email: str):
    """Get all assessments for a user"""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT ar.*, u.email, u.first_name, u.last_name
                FROM assessment_results ar
                JOIN users u ON ar.user_id = u.id
                WHERE u.email = %s
                ORDER BY ar.completed_at DESC
            """, (user_email,))
            
            assessments = cur.fetchall()
            
            return {
                "success": True,
                "assessments": assessments
            }
    finally:
        conn.close()
