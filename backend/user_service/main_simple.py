from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import bcrypt
import jwt
from datetime import datetime, timedelta

app = FastAPI()

# Hardcoded demo users
DEMO_USERS = {
    'hugo@hugoatwork.com': {
        'password': 'hugo123',
        'first_name': 'Hugo',
        'last_name': 'Manager',
        'role': 'hugo_manager',
        'company_id': None
    },
    'hr@democompany.com': {
        'password': 'hr123',
        'first_name': 'Anna',
        'last_name': 'Schmidt',
        'role': 'hr_manager',
        'company_id': 1
    },
    'user@democompany.com': {
        'password': 'user123',
        'first_name': 'Max',
        'last_name': 'Mustermann',
        'role': 'user',
        'company_id': 1
    }
}

class LoginRequest(BaseModel):
    email: str
    password: str

@app.get('/health')
def health():
    return {'status': 'healthy', 'service': 'user-service-simple'}

@app.post('/auth/login')
def login(request: LoginRequest):
    user = DEMO_USERS.get(request.email)
    if not user or user['password'] != request.password:
        raise HTTPException(status_code=401, detail='Invalid credentials')
    
    # Generate JWT token
    token_data = {
        'email': request.email,
        'role': user['role'],
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(token_data, 'secret-key', algorithm='HS256')
    
    return {
        'access_token': token,
        'token_type': 'bearer',
        'user': {
            'email': request.email,
            'first_name': user['first_name'],
            'last_name': user['last_name'],
            'role': user['role'],
            'company_id': user['company_id']
        }
    }

@app.get('/auth/me')
def get_current_user():
    return {'message': 'User info endpoint'}
