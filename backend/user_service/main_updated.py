from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
import jwt
import bcrypt
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from datetime import datetime, timedelta
import uuid
from enum import Enum

app = FastAPI(title="Hugo User Service - Multi-Tenant", version="2.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
JWT_SECRET = os.getenv("JWT_SECRET", "hugo-secret-key-2024")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Database connection
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "postgres"),
        database=os.getenv("DB_NAME", "hugo_platform"),
        user=os.getenv("DB_USER", "hugo_user"),
        password=os.getenv("DB_PASSWORD", "hugo_password"),
        port=os.getenv("DB_PORT", "5432")
    )

# Enums
class UserRole(str, Enum):
    HUGO_MANAGER = "hugo_manager"
    HR_MANAGER = "hr_manager"
    USER = "user"

class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

# Pydantic models
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    role: UserRole
    company_id: Optional[int] = None
    department: Optional[str] = None
    position: Optional[str] = None
    phone: Optional[str] = None

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    phone: Optional[str] = None

class CompanyCreate(BaseModel):
    name: str
    domain: str
    subscription_plan: str = "basic"
    max_users: int = 50
    contact_person: str
    billing_email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    domain: Optional[str] = None
    subscription_plan: Optional[str] = None
    max_users: Optional[int] = None
    contact_person: Optional[str] = None
    billing_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    role: str
    company_id: Optional[int]
    expires_in: int

class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    role: str
    company_id: Optional[int]
    company_name: Optional[str]
    department: Optional[str]
    position: Optional[str]
    phone: Optional[str]
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime]
    hugo_type: Optional[str]
    cultural_background: Optional[str]

class CompanyResponse(BaseModel):
    id: int
    name: str
    domain: Optional[str]
    subscription_plan: str
    max_users: int
    current_users: int
    contact_person: str
    billing_email: str
    phone: Optional[str]
    address: Optional[str]
    is_active: bool
    created_at: datetime

# Utility functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

# Dependency to get current user
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)
    user_id = payload.get("user_id")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT u.*, c.name as company_name 
                FROM users u 
                LEFT JOIN companies c ON u.company_id = c.id 
                WHERE u.id = %s AND u.is_active = true
            """, (user_id,))
            user = cur.fetchone()
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not found or inactive"
                )
            
            return dict(user)
    finally:
        conn.close()

# Authentication endpoints
@app.post("/auth/login", response_model=TokenResponse)
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
            
            # Update last login
            cur.execute("""
                UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = %s
            """, (user['id'],))
            conn.commit()
            
            # Create access token
            token_data = {
                "user_id": user['id'],
                "email": user['email'],
                "role": user['role'],
                "company_id": user['company_id']
            }
            access_token = create_access_token(token_data)
            
            return TokenResponse(
                access_token=access_token,
                token_type="bearer",
                user_id=user['id'],
                role=user['role'],
                company_id=user['company_id'],
                expires_in=JWT_EXPIRATION_HOURS * 3600
            )
    finally:
        conn.close()

@app.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)

# Company management (Hugo Manager only)
@app.post("/companies", response_model=CompanyResponse)
async def create_company(
    company: CompanyCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user['role'] != UserRole.HUGO_MANAGER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Hugo Managers can create companies"
        )
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Check if domain already exists
            if company.domain:
                cur.execute("SELECT id FROM companies WHERE domain = %s", (company.domain,))
                if cur.fetchone():
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Domain already exists"
                    )
            
            # Create company
            cur.execute("""
                INSERT INTO companies (name, domain, subscription_plan, max_users, 
                                     contact_person, billing_email, phone, address)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            """, (
                company.name, company.domain, company.subscription_plan,
                company.max_users, company.contact_person, company.billing_email,
                company.phone, company.address
            ))
            
            new_company = cur.fetchone()
            conn.commit()
            
            # Get current user count (should be 0 for new company)
            cur.execute("SELECT COUNT(*) as count FROM users WHERE company_id = %s", (new_company['id'],))
            user_count = cur.fetchone()['count']
            
            return CompanyResponse(
                **new_company,
                current_users=user_count
            )
    finally:
        conn.close()

@app.get("/companies", response_model=List[CompanyResponse])
async def get_companies(
    current_user: dict = Depends(get_current_user)
):
    if current_user['role'] != UserRole.HUGO_MANAGER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Hugo Managers can view all companies"
        )
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT c.*, COUNT(u.id) as current_users
                FROM companies c
                LEFT JOIN users u ON c.id = u.company_id AND u.is_active = true
                GROUP BY c.id
                ORDER BY c.created_at DESC
            """)
            companies = cur.fetchall()
            
            return [CompanyResponse(**company) for company in companies]
    finally:
        conn.close()

@app.get("/companies/{company_id}", response_model=CompanyResponse)
async def get_company(
    company_id: int,
    current_user: dict = Depends(get_current_user)
):
    # Hugo managers can see any company, HR managers only their own
    if (current_user['role'] != UserRole.HUGO_MANAGER.value and 
        current_user['company_id'] != company_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT c.*, COUNT(u.id) as current_users
                FROM companies c
                LEFT JOIN users u ON c.id = u.company_id AND u.is_active = true
                WHERE c.id = %s
                GROUP BY c.id
            """, (company_id,))
            company = cur.fetchone()
            
            if not company:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Company not found"
                )
            
            return CompanyResponse(**company)
    finally:
        conn.close()

# User management
@app.post("/users", response_model=UserResponse)
async def create_user(
    user: UserCreate,
    current_user: dict = Depends(get_current_user)
):
    # Hugo managers can create any user, HR managers only in their company
    if current_user['role'] == UserRole.USER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Users cannot create other users"
        )
    
    if (current_user['role'] == UserRole.HR_MANAGER.value and 
        user.company_id != current_user['company_id']):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="HR Managers can only create users in their own company"
        )
    
    # Validate role and company_id combination
    if user.role == UserRole.HUGO_MANAGER and user.company_id is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hugo Managers cannot belong to a company"
        )
    
    if user.role in [UserRole.HR_MANAGER, UserRole.USER] and user.company_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="HR Managers and Users must belong to a company"
        )
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Check if email already exists
            cur.execute("SELECT id FROM users WHERE email = %s", (user.email,))
            if cur.fetchone():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already exists"
                )
            
            # Check company user limit
            if user.company_id:
                cur.execute("""
                    SELECT c.max_users, COUNT(u.id) as current_users
                    FROM companies c
                    LEFT JOIN users u ON c.id = u.company_id AND u.is_active = true
                    WHERE c.id = %s
                    GROUP BY c.id, c.max_users
                """, (user.company_id,))
                company_info = cur.fetchone()
                
                if company_info and company_info['current_users'] >= company_info['max_users']:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Company has reached maximum user limit"
                    )
            
            # Create user
            password_hash = hash_password(user.password)
            cur.execute("""
                INSERT INTO users (email, password_hash, first_name, last_name, 
                                 role, company_id, department, position, phone)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            """, (
                user.email, password_hash, user.first_name, user.last_name,
                user.role.value, user.company_id, user.department, user.position, user.phone
            ))
            
            new_user = cur.fetchone()
            conn.commit()
            
            # Get company name
            company_name = None
            if new_user['company_id']:
                cur.execute("SELECT name FROM companies WHERE id = %s", (new_user['company_id'],))
                company = cur.fetchone()
                company_name = company['name'] if company else None
            
            return UserResponse(
                **new_user,
                company_name=company_name
            )
    finally:
        conn.close()

@app.get("/users", response_model=List[UserResponse])
async def get_users(
    company_id: Optional[int] = None,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            if current_user['role'] == UserRole.HUGO_MANAGER.value:
                # Hugo managers can see all users
                if company_id:
                    cur.execute("""
                        SELECT u.*, c.name as company_name 
                        FROM users u 
                        LEFT JOIN companies c ON u.company_id = c.id 
                        WHERE u.company_id = %s AND u.is_active = true
                        ORDER BY u.created_at DESC
                    """, (company_id,))
                else:
                    cur.execute("""
                        SELECT u.*, c.name as company_name 
                        FROM users u 
                        LEFT JOIN companies c ON u.company_id = c.id 
                        WHERE u.is_active = true
                        ORDER BY u.created_at DESC
                    """)
            elif current_user['role'] == UserRole.HR_MANAGER.value:
                # HR managers can only see users in their company
                cur.execute("""
                    SELECT u.*, c.name as company_name 
                    FROM users u 
                    LEFT JOIN companies c ON u.company_id = c.id 
                    WHERE u.company_id = %s AND u.is_active = true
                    ORDER BY u.created_at DESC
                """, (current_user['company_id'],))
            else:
                # Regular users can only see themselves
                cur.execute("""
                    SELECT u.*, c.name as company_name 
                    FROM users u 
                    LEFT JOIN companies c ON u.company_id = c.id 
                    WHERE u.id = %s
                """, (current_user['id'],))
            
            users = cur.fetchall()
            return [UserResponse(**user) for user in users]
    finally:
        conn.close()

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT u.*, c.name as company_name 
                FROM users u 
                LEFT JOIN companies c ON u.company_id = c.id 
                WHERE u.id = %s
            """, (user_id,))
            user = cur.fetchone()
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            # Check permissions
            if (current_user['role'] == UserRole.USER.value and 
                current_user['id'] != user_id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied"
                )
            
            if (current_user['role'] == UserRole.HR_MANAGER.value and 
                current_user['company_id'] != user['company_id']):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied: Different company"
                )
            
            return UserResponse(**user)
    finally:
        conn.close()

@app.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Get existing user
            cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            existing_user = cur.fetchone()
            
            if not existing_user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            # Check permissions
            if (current_user['role'] == UserRole.USER.value and 
                current_user['id'] != user_id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Users can only update their own profile"
                )
            
            if (current_user['role'] == UserRole.HR_MANAGER.value and 
                current_user['company_id'] != existing_user['company_id']):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied: Different company"
                )
            
            # Build update query
            update_fields = []
            update_values = []
            
            for field, value in user_update.dict(exclude_unset=True).items():
                if value is not None:
                    update_fields.append(f"{field} = %s")
                    update_values.append(value)
            
            if not update_fields:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No fields to update"
                )
            
            update_values.append(user_id)
            
            cur.execute(f"""
                UPDATE users 
                SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *
            """, update_values)
            
            updated_user = cur.fetchone()
            conn.commit()
            
            # Get company name
            company_name = None
            if updated_user['company_id']:
                cur.execute("SELECT name FROM companies WHERE id = %s", (updated_user['company_id'],))
                company = cur.fetchone()
                company_name = company['name'] if company else None
            
            return UserResponse(
                **updated_user,
                company_name=company_name
            )
    finally:
        conn.close()

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "user-service-multi-tenant", "version": "2.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
