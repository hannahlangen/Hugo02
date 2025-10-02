from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List
import asyncio
import httpx
import os
import uuid
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Hugo Chat Assessment Service", version="2.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class InvitationRequest(BaseModel):
    participant_email: EmailStr
    participant_name: Optional[str] = None
    sender_name: str
    company_name: Optional[str] = "Hugo at Work"

class AssessmentCompletion(BaseModel):
    token: str
    name: str
    email: EmailStr
    cultural_background: str
    hugo_type: str
    responses: Dict[str, Any]

class TeamAssignmentResult(BaseModel):
    success: bool
    user_id: Optional[int] = None
    team_id: Optional[int] = None
    team_name: Optional[str] = None
    synergy_score: Optional[float] = None
    message: str

# Hugo type definitions with team compatibility
HUGO_TYPES = {
    'V1': {
        'name': 'Wegweiser',
        'dimension': 'Vision',
        'compatible_teams': ['leadership', 'strategy', 'management'],
        'leadership_potential': 'high'
    },
    'V2': {
        'name': 'Entwickler', 
        'dimension': 'Vision',
        'compatible_teams': ['hr', 'development', 'leadership'],
        'leadership_potential': 'high'
    },
    'V3': {
        'name': 'Organisator',
        'dimension': 'Vision', 
        'compatible_teams': ['operations', 'project_management', 'quality'],
        'leadership_potential': 'medium'
    },
    'I1': {
        'name': 'Pionier',
        'dimension': 'Innovation',
        'compatible_teams': ['r_and_d', 'innovation', 'product'],
        'leadership_potential': 'medium'
    },
    'I2': {
        'name': 'Architekt',
        'dimension': 'Innovation',
        'compatible_teams': ['architecture', 'design', 'product'],
        'leadership_potential': 'medium'
    },
    'I3': {
        'name': 'Inspirator',
        'dimension': 'Innovation',
        'compatible_teams': ['marketing', 'sales', 'innovation'],
        'leadership_potential': 'medium'
    },
    'E1': {
        'name': 'Forscher',
        'dimension': 'Expertise',
        'compatible_teams': ['research', 'analytics', 'quality'],
        'leadership_potential': 'low'
    },
    'E2': {
        'name': 'Meister',
        'dimension': 'Expertise',
        'compatible_teams': ['engineering', 'quality', 'technical'],
        'leadership_potential': 'low'
    },
    'E3': {
        'name': 'Berater',
        'dimension': 'Expertise',
        'compatible_teams': ['consulting', 'advisory', 'support'],
        'leadership_potential': 'medium'
    },
    'C1': {
        'name': 'Harmonizer',
        'dimension': 'Kollaboration',
        'compatible_teams': ['hr', 'support', 'operations'],
        'leadership_potential': 'medium'
    },
    'C2': {
        'name': 'Brückenbauer',
        'dimension': 'Kollaboration',
        'compatible_teams': ['sales', 'partnerships', 'marketing'],
        'leadership_potential': 'medium'
    },
    'C3': {
        'name': 'Umsetzer',
        'dimension': 'Kollaboration',
        'compatible_teams': ['operations', 'implementation', 'delivery'],
        'leadership_potential': 'low'
    }
}

# Service URLs
USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://user-service:8001")
TEAM_SERVICE_URL = os.getenv("TEAM_SERVICE_URL", "http://team-service:8004")
HUGO_ENGINE_URL = os.getenv("HUGO_ENGINE_URL", "http://hugo-engine:8002")

# Email configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtps.udag.de")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "eva@hugoatwork.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "eva@hugoatwork.com")

class EmailService:
    @staticmethod
    def send_invitation_email(to_email: str, participant_name: str, sender_name: str, 
                            company_name: str, assessment_link: str) -> bool:
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f"Persönlichkeitsassessment Einladung von {company_name}"
            msg['From'] = FROM_EMAIL
            msg['To'] = to_email

            # HTML version
            html_body = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                             color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .button {{ display: inline-block; background: #667eea; color: white; 
                              padding: 15px 30px; text-decoration: none; border-radius: 5px; 
                              font-weight: bold; margin: 20px 0; }}
                    .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎯 Hugo Persönlichkeitsassessment</h1>
                        <p>Entdecke deinen einzigartigen Persönlichkeitstyp</p>
                    </div>
                    <div class="content">
                        <p>Hallo {participant_name or 'liebe/r Kollege/in'},</p>
                        
                        <p><strong>{sender_name}</strong> von <strong>{company_name}</strong> lädt dich zu einem 
                        spannenden Persönlichkeitsassessment ein!</p>
                        
                        <p>🤖 <strong>Was erwartet dich?</strong></p>
                        <ul>
                            <li>Ein freundlicher Chat mit Hugo, unserem KI-Persönlichkeitsexperten</li>
                            <li>8-12 Minuten für dein individuelles Profil</li>
                            <li>Entdeckung deines Hugo-Persönlichkeitstyps</li>
                            <li>Wertvolle Insights für bessere Teamarbeit</li>
                        </ul>
                        
                        <p>🌍 <strong>Warum ist das wichtig?</strong><br>
                        Wir nutzen die Culture Map Theorie von Erin Meyer, um internationale Teams 
                        optimal zusammenzustellen und kulturelle Unterschiede zu verstehen.</p>
                        
                        <div style="text-align: center;">
                            <a href="{assessment_link}" class="button">
                                🚀 Assessment jetzt starten
                            </a>
                        </div>
                        
                        <p><small>💡 <strong>Tipp:</strong> Sei ehrlich und authentisch - so erhältst du 
                        die besten Ergebnisse für dich und dein Team!</small></p>
                        
                        <p>Bei Fragen stehe ich gerne zur Verfügung.</p>
                        
                        <p>Beste Grüße,<br>
                        <strong>{sender_name}</strong><br>
                        {company_name}</p>
                    </div>
                    <div class="footer">
                        <p>Hugo at Work - Personality Assessment & Team Building Platform</p>
                        <p>Diese Einladung ist 7 Tage gültig.</p>
                    </div>
                </div>
            </body>
            </html>
            """

            # Text version
            text_body = f"""
            Hugo Persönlichkeitsassessment - Einladung von {company_name}
            
            Hallo {participant_name or 'liebe/r Kollege/in'},
            
            {sender_name} von {company_name} lädt dich zu einem spannenden Persönlichkeitsassessment ein!
            
            Was erwartet dich?
            - Ein freundlicher Chat mit Hugo, unserem KI-Persönlichkeitsexperten
            - 8-12 Minuten für dein individuelles Profil  
            - Entdeckung deines Hugo-Persönlichkeitstyps
            - Wertvolle Insights für bessere Teamarbeit
            
            Warum ist das wichtig?
            Wir nutzen die Culture Map Theorie von Erin Meyer, um internationale Teams 
            optimal zusammenzustellen und kulturelle Unterschiede zu verstehen.
            
            Assessment starten: {assessment_link}
            
            Tipp: Sei ehrlich und authentisch - so erhältst du die besten Ergebnisse!
            
            Bei Fragen stehe ich gerne zur Verfügung.
            
            Beste Grüße,
            {sender_name}
            {company_name}
            
            ---
            Hugo at Work - Personality Assessment & Team Building Platform
            Diese Einladung ist 7 Tage gültig.
            """

            msg.attach(MIMEText(text_body, 'plain', 'utf-8'))
            msg.attach(MIMEText(html_body, 'html', 'utf-8'))

            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.send_message(msg)

            logger.info(f"Invitation email sent successfully to {to_email}")
            return True

        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

async def create_user_in_system(name: str, email: str, hugo_type: str, 
                               cultural_background: str) -> Optional[int]:
    """Create a new user in the user service"""
    try:
        async with httpx.AsyncClient() as client:
            user_data = {
                "name": name,
                "email": email,
                "hugo_type": hugo_type,
                "cultural_background": cultural_background,
                "status": "active"
            }
            
            response = await client.post(
                f"{USER_SERVICE_URL}/users",
                json=user_data,
                timeout=10.0
            )
            
            if response.status_code == 201:
                user = response.json()
                logger.info(f"User created successfully: {user['id']}")
                return user['id']
            else:
                logger.error(f"Failed to create user: {response.status_code} - {response.text}")
                return None
                
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        return None

async def find_best_team_for_user(hugo_type: str, user_id: int) -> Optional[Dict[str, Any]]:
    """Find the best team for a user based on their Hugo type"""
    try:
        async with httpx.AsyncClient() as client:
            # Get all teams
            teams_response = await client.get(
                f"{TEAM_SERVICE_URL}/teams",
                timeout=10.0
            )
            
            if teams_response.status_code != 200:
                logger.error(f"Failed to get teams: {teams_response.status_code}")
                return None
                
            teams = teams_response.json()
            type_info = HUGO_TYPES.get(hugo_type, {})
            compatible_teams = type_info.get('compatible_teams', [])
            
            best_team = None
            best_score = 0
            
            for team in teams:
                # Calculate compatibility score
                score = 0
                team_type = team.get('type', '').lower()
                
                # Check if team type matches compatible teams
                for compatible in compatible_teams:
                    if compatible in team_type:
                        score += 10
                        
                # Prefer teams with fewer members (better integration)
                member_count = len(team.get('members', []))
                if member_count < 5:
                    score += 5
                elif member_count < 10:
                    score += 3
                    
                # Prefer teams with good synergy scores
                synergy = team.get('synergy_score', 0)
                if synergy > 80:
                    score += 3
                elif synergy > 60:
                    score += 1
                    
                if score > best_score:
                    best_score = score
                    best_team = team
                    
            return best_team
            
    except Exception as e:
        logger.error(f"Error finding best team: {str(e)}")
        return None

async def add_user_to_team(team_id: int, user_id: int) -> bool:
    """Add a user to a team"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{TEAM_SERVICE_URL}/teams/{team_id}/members",
                json={"user_id": user_id},
                timeout=10.0
            )
            
            if response.status_code in [200, 201]:
                logger.info(f"User {user_id} added to team {team_id}")
                return True
            else:
                logger.error(f"Failed to add user to team: {response.status_code}")
                return False
                
    except Exception as e:
        logger.error(f"Error adding user to team: {str(e)}")
        return False

async def recalculate_team_synergy(team_id: int) -> Optional[float]:
    """Recalculate team synergy after adding new member"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{TEAM_SERVICE_URL}/teams/{team_id}/recalculate-synergy",
                timeout=10.0
            )
            
            if response.status_code == 200:
                result = response.json()
                new_synergy = result.get('synergy_score', 0)
                logger.info(f"Team {team_id} synergy recalculated: {new_synergy}")
                return new_synergy
            else:
                logger.error(f"Failed to recalculate synergy: {response.status_code}")
                return None
                
    except Exception as e:
        logger.error(f"Error recalculating synergy: {str(e)}")
        return None

@app.post("/invitations")
async def send_invitation(request: InvitationRequest, background_tasks: BackgroundTasks):
    """Send assessment invitation email"""
    try:
        # Generate unique token
        token = str(uuid.uuid4())
        
        # Create assessment link
        assessment_link = f"http://159.69.9.171/assessment/{token}"
        
        # Send email in background
        background_tasks.add_task(
            EmailService.send_invitation_email,
            request.participant_email,
            request.participant_name,
            request.sender_name,
            request.company_name,
            assessment_link
        )
        
        return {
            "success": True,
            "message": "Einladung wurde erfolgreich versendet",
            "token": token,
            "assessment_link": assessment_link
        }
        
    except Exception as e:
        logger.error(f"Error sending invitation: {str(e)}")
        raise HTTPException(status_code=500, detail="Fehler beim Versenden der Einladung")

@app.post("/complete-assessment", response_model=TeamAssignmentResult)
async def complete_assessment(completion: AssessmentCompletion):
    """Complete assessment and automatically integrate user into team"""
    try:
        logger.info(f"Processing assessment completion for {completion.email}")
        
        # Step 1: Create user in system
        user_id = await create_user_in_system(
            completion.name,
            completion.email,
            completion.hugo_type,
            completion.cultural_background
        )
        
        if not user_id:
            return TeamAssignmentResult(
                success=False,
                message="Fehler beim Erstellen des Benutzerprofils"
            )
        
        # Step 2: Find best team for user
        best_team = await find_best_team_for_user(completion.hugo_type, user_id)
        
        if not best_team:
            return TeamAssignmentResult(
                success=True,
                user_id=user_id,
                message=f"Benutzer erstellt, aber kein passendes Team gefunden. Hugo-Typ: {completion.hugo_type}"
            )
        
        # Step 3: Add user to team
        team_added = await add_user_to_team(best_team['id'], user_id)
        
        if not team_added:
            return TeamAssignmentResult(
                success=True,
                user_id=user_id,
                team_id=best_team['id'],
                team_name=best_team['name'],
                message="Benutzer erstellt, aber Fehler beim Hinzufügen zum Team"
            )
        
        # Step 4: Recalculate team synergy
        new_synergy = await recalculate_team_synergy(best_team['id'])
        
        logger.info(f"Assessment completed successfully for {completion.email}")
        
        return TeamAssignmentResult(
            success=True,
            user_id=user_id,
            team_id=best_team['id'],
            team_name=best_team['name'],
            synergy_score=new_synergy,
            message=f"Erfolgreich in Team '{best_team['name']}' integriert! Neue Team-Synergie: {new_synergy or 'wird berechnet'}%"
        )
        
    except Exception as e:
        logger.error(f"Error completing assessment: {str(e)}")
        return TeamAssignmentResult(
            success=False,
            message=f"Fehler bei der Team-Integration: {str(e)}"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "chat-assessment-service", "version": "2.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)
