from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import asyncpg
import os
import uuid
import httpx
import openai
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = FastAPI(title="Hugo App - Chat Assessment Service", version="2.0.0")

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
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
HUGO_ENGINE_URL = os.getenv("HUGO_ENGINE_URL", "http://hugo-engine:8002")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost")

# Email configuration
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

# Initialize OpenAI
if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

# Pydantic models
class ChatSession(BaseModel):
    id: str
    participant_name: Optional[str] = None
    participant_email: Optional[str] = None
    current_question: int = 0
    responses: List[Dict[str, Any]] = []
    dimension_scores: Dict[str, float] = {}
    hugo_type_result: Optional[str] = None
    is_completed: bool = False
    created_at: datetime
    invitation_token: Optional[str] = None

class ChatMessage(BaseModel):
    session_id: str
    message: str
    is_user: bool
    timestamp: datetime

class ChatResponse(BaseModel):
    message: str
    is_question: bool = False
    is_completed: bool = False
    hugo_type: Optional[str] = None
    next_question_id: Optional[int] = None

class InvitationCreate(BaseModel):
    participant_email: EmailStr
    participant_name: Optional[str] = None
    company_name: str
    sender_name: str

class ParticipantRegistration(BaseModel):
    invitation_token: str
    participant_name: str
    participant_email: EmailStr

# Chat questions for personality assessment
CHAT_QUESTIONS = [
    {
        "id": 1,
        "question": "Hallo! Schön, dass du da bist. Ich bin Hugo, dein persönlicher Persönlichkeits-Assistent. Lass uns gemeinsam herausfinden, welcher Hugo-Typ du bist! 🚀\n\nZuerst eine Frage: Wenn du in einem Team arbeitest, was motiviert dich am meisten?",
        "dimension": "general",
        "follow_up": "Das ist interessant! Erzähl mir mehr darüber."
    },
    {
        "id": 2,
        "question": "Stell dir vor, dein Team steht vor einer wichtigen Entscheidung. Wie gehst du normalerweise vor?",
        "dimension": "Vision",
        "follow_up": "Verstehe! Und wie wichtig ist es dir, dass alle im Team zustimmen?"
    },
    {
        "id": 3,
        "question": "Du bekommst ein völlig neues Projekt. Was ist dein erster Gedanke?",
        "dimension": "Innovation",
        "follow_up": "Spannend! Wie gehst du mit Unsicherheiten um?"
    },
    {
        "id": 4,
        "question": "Wenn du ein Problem lösen musst, worauf verlässt du dich am meisten?",
        "dimension": "Expertise",
        "follow_up": "Das macht Sinn. Wie wichtig ist Perfektion für dich?"
    },
    {
        "id": 5,
        "question": "In Meetings und Diskussionen - was ist deine natürliche Rolle?",
        "dimension": "Connection",
        "follow_up": "Interessant! Wie gehst du mit Konflikten um?"
    },
    {
        "id": 6,
        "question": "Wenn du an deine größten beruflichen Erfolge denkst - was haben sie gemeinsam?",
        "dimension": "general",
        "follow_up": "Das zeigt viel über deine Stärken! Was treibt dich wirklich an?"
    },
    {
        "id": 7,
        "question": "Stell dir vor, du könntest dein Traumteam zusammenstellen. Welche Art von Menschen würdest du wählen?",
        "dimension": "Connection",
        "follow_up": "Und wie würdest du dieses Team führen oder unterstützen?"
    },
    {
        "id": 8,
        "question": "Zum Abschluss: Was ist für dich der wichtigste Aspekt bei der Arbeit?",
        "dimension": "general",
        "follow_up": "Vielen Dank für deine offenen Antworten! Ich analysiere jetzt deine Persönlichkeit..."
    }
]

# Database connection
async def get_db_connection():
    return await asyncpg.connect(DATABASE_URL)

# LLM Analysis Functions
async def analyze_response_with_llm(question: str, response: str, dimension: str) -> Dict[str, float]:
    """Analyze user response using OpenAI and return dimension scores"""
    
    if not OPENAI_API_KEY:
        # Fallback scoring without LLM
        return {"Vision": 0.5, "Innovation": 0.5, "Expertise": 0.5, "Connection": 0.5}
    
    prompt = f"""
    Analysiere die folgende Antwort auf eine Persönlichkeitsfrage und bewerte sie nach den vier Hugo-Dimensionen:

    Frage: {question}
    Antwort: {response}
    Fokus-Dimension: {dimension}

    Hugo-Dimensionen:
    - Vision: Strategisches Denken, Führung, Zielorientierung, Entscheidungsfindung
    - Innovation: Kreativität, Experimentierfreude, Neugier, Veränderungsbereitschaft  
    - Expertise: Fachwissen, Qualität, Analyse, bewährte Methoden
    - Connection: Beziehungen, Teamwork, Empathie, Harmonie

    Bewerte jede Dimension von 0.0 bis 1.0 basierend auf der Antwort.
    Antworte nur mit einem JSON-Objekt im Format:
    {{"Vision": 0.7, "Innovation": 0.3, "Expertise": 0.8, "Connection": 0.6}}
    """
    
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Du bist ein Experte für Persönlichkeitsanalyse. Antworte nur mit dem angeforderten JSON-Format."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=100,
            temperature=0.3
        )
        
        result = response.choices[0].message.content.strip()
        scores = json.loads(result)
        
        # Validate scores
        for dim in ["Vision", "Innovation", "Expertise", "Connection"]:
            if dim not in scores:
                scores[dim] = 0.5
            scores[dim] = max(0.0, min(1.0, float(scores[dim])))
        
        return scores
        
    except Exception as e:
        print(f"LLM analysis error: {e}")
        # Fallback scoring
        base_scores = {"Vision": 0.5, "Innovation": 0.5, "Expertise": 0.5, "Connection": 0.5}
        if dimension in base_scores:
            base_scores[dimension] = 0.7  # Boost the focus dimension
        return base_scores

async def generate_chat_response(question_data: Dict, user_response: str, session: ChatSession) -> str:
    """Generate contextual chat response using LLM"""
    
    if not OPENAI_API_KEY:
        return question_data.get("follow_up", "Danke für deine Antwort! Lass uns zur nächsten Frage.")
    
    prompt = f"""
    Du bist Hugo, ein freundlicher und professioneller Persönlichkeits-Assistent. 
    
    Der Nutzer hat gerade diese Frage beantwortet:
    Frage: {question_data['question']}
    Antwort: {user_response}
    
    Gib eine kurze, empathische Antwort (1-2 Sätze), die zeigt, dass du die Antwort verstanden hast.
    Sei freundlich, professionell und ermutigend. Verwende den Namen {session.participant_name} wenn möglich.
    """
    
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Du bist Hugo, ein empathischer Persönlichkeits-Assistent. Antworte kurz und freundlich."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=100,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"Chat response generation error: {e}")
        return question_data.get("follow_up", "Danke für deine Antwort!")

# Email functions
async def send_invitation_email(email: str, name: str, company: str, sender: str, token: str):
    """Send invitation email with assessment link"""
    
    if not SMTP_USER or not SMTP_PASSWORD:
        print("Email configuration missing - skipping email send")
        return
    
    assessment_link = f"{FRONTEND_URL}/assessment/{token}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Hugo Persönlichkeitsassessment - Einladung</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563eb;">🧠 Hugo</h1>
                <h2 style="color: #4b5563;">Persönlichkeitsassessment</h2>
            </div>
            
            <p>Hallo{' ' + name if name else ''},</p>
            
            <p>{sender} von {company} hat dich zu einem Persönlichkeitsassessment mit Hugo eingeladen!</p>
            
            <p>Hugo hilft dir dabei, deinen Persönlichkeitstyp zu entdecken und zu verstehen, wie du am besten in Teams arbeitest. Das Assessment dauert nur etwa 10-15 Minuten und wird als freundliches Gespräch mit unserem KI-Assistenten geführt.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{assessment_link}" 
                   style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                    Assessment starten
                </a>
            </div>
            
            <p><strong>Was dich erwartet:</strong></p>
            <ul>
                <li>🤖 Freundlicher Chat mit Hugo, unserem KI-Assistenten</li>
                <li>⏱️ Nur 10-15 Minuten deiner Zeit</li>
                <li>🎯 Personalisierte Einblicke in deine Stärken</li>
                <li>🤝 Besseres Verständnis für Teamdynamiken</li>
            </ul>
            
            <p>Deine Daten werden selbstverständlich vertraulich behandelt und sind GDPR-konform geschützt.</p>
            
            <p>Falls der Button nicht funktioniert, kopiere diesen Link in deinen Browser:<br>
            <a href="{assessment_link}">{assessment_link}</a></p>
            
            <p>Bei Fragen kannst du dich gerne an {sender} wenden.</p>
            
            <p>Viel Spaß beim Assessment!<br>
            Dein Hugo-Team</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280; text-align: center;">
                Hugo - Persönlichkeitsassessment & Team Building Platform<br>
                Diese Einladung ist 7 Tage gültig.
            </p>
        </div>
    </body>
    </html>
    """
    
    try:
        msg = MimeMultipart('alternative')
        msg['Subject'] = f"Einladung zum Hugo Persönlichkeitsassessment von {company}"
        msg['From'] = SMTP_USER
        msg['To'] = email
        
        html_part = MimeText(html_content, 'html')
        msg.attach(html_part)
        
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
            
        print(f"Invitation email sent to {email}")
        
    except Exception as e:
        print(f"Failed to send email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send invitation email")

# API Endpoints
@app.post("/invitations")
async def create_invitation(invitation: InvitationCreate, background_tasks: BackgroundTasks):
    """Create and send assessment invitation"""
    
    conn = await get_db_connection()
    try:
        # Generate unique invitation token
        invitation_token = str(uuid.uuid4())
        expires_at = datetime.utcnow() + timedelta(days=7)
        
        # Store invitation in database
        await conn.execute(
            """
            INSERT INTO assessment_invitations 
            (token, participant_email, participant_name, company_name, sender_name, expires_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            """,
            invitation_token, invitation.participant_email, invitation.participant_name,
            invitation.company_name, invitation.sender_name, expires_at
        )
        
        # Send email in background
        background_tasks.add_task(
            send_invitation_email,
            invitation.participant_email,
            invitation.participant_name,
            invitation.company_name,
            invitation.sender_name,
            invitation_token
        )
        
        return {
            "message": "Invitation sent successfully",
            "invitation_token": invitation_token,
            "expires_at": expires_at
        }
        
    finally:
        await conn.close()

@app.get("/invitations/{token}")
async def get_invitation(token: str):
    """Get invitation details"""
    
    conn = await get_db_connection()
    try:
        invitation = await conn.fetchrow(
            """
            SELECT token, participant_email, participant_name, company_name, 
                   sender_name, expires_at, is_used
            FROM assessment_invitations 
            WHERE token = $1 AND expires_at > NOW()
            """,
            token
        )
        
        if not invitation:
            raise HTTPException(status_code=404, detail="Invitation not found or expired")
        
        if invitation["is_used"]:
            raise HTTPException(status_code=400, detail="Invitation already used")
        
        return dict(invitation)
        
    finally:
        await conn.close()

@app.post("/sessions")
async def create_chat_session(registration: ParticipantRegistration):
    """Create new chat session for participant"""
    
    conn = await get_db_connection()
    try:
        # Verify invitation
        invitation = await conn.fetchrow(
            """
            SELECT token, company_name, sender_name, is_used
            FROM assessment_invitations 
            WHERE token = $1 AND expires_at > NOW()
            """,
            registration.invitation_token
        )
        
        if not invitation:
            raise HTTPException(status_code=404, detail="Invalid or expired invitation")
        
        if invitation["is_used"]:
            raise HTTPException(status_code=400, detail="Invitation already used")
        
        # Create chat session
        session_id = str(uuid.uuid4())
        
        await conn.execute(
            """
            INSERT INTO chat_sessions 
            (id, participant_name, participant_email, invitation_token, current_question, responses, dimension_scores)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            """,
            session_id, registration.participant_name, registration.participant_email,
            registration.invitation_token, 0, json.dumps([]), json.dumps({})
        )
        
        # Mark invitation as used
        await conn.execute(
            "UPDATE assessment_invitations SET is_used = true WHERE token = $1",
            registration.invitation_token
        )
        
        return {
            "session_id": session_id,
            "message": f"Hallo {registration.participant_name}! Willkommen bei Hugo. Ich freue mich darauf, dich kennenzulernen! 🚀"
        }
        
    finally:
        await conn.close()

@app.post("/sessions/{session_id}/message")
async def send_message(session_id: str, message: ChatMessage):
    """Process user message and return bot response"""
    
    conn = await get_db_connection()
    try:
        # Get session
        session_data = await conn.fetchrow(
            """
            SELECT id, participant_name, participant_email, current_question, 
                   responses, dimension_scores, is_completed
            FROM chat_sessions 
            WHERE id = $1
            """,
            session_id
        )
        
        if not session_data:
            raise HTTPException(status_code=404, detail="Session not found")
        
        if session_data["is_completed"]:
            raise HTTPException(status_code=400, detail="Assessment already completed")
        
        # Parse session data
        current_question = session_data["current_question"]
        responses = json.loads(session_data["responses"])
        dimension_scores = json.loads(session_data["dimension_scores"])
        
        # Store user message
        await conn.execute(
            """
            INSERT INTO chat_messages (session_id, message, is_user, timestamp)
            VALUES ($1, $2, $3, $4)
            """,
            session_id, message.message, True, datetime.utcnow()
        )
        
        # Process current question response
        if current_question < len(CHAT_QUESTIONS):
            question_data = CHAT_QUESTIONS[current_question]
            
            # Analyze response with LLM
            scores = await analyze_response_with_llm(
                question_data["question"], 
                message.message, 
                question_data["dimension"]
            )
            
            # Update dimension scores
            for dim, score in scores.items():
                if dim in dimension_scores:
                    dimension_scores[dim] = (dimension_scores[dim] + score) / 2
                else:
                    dimension_scores[dim] = score
            
            # Store response
            responses.append({
                "question_id": question_data["id"],
                "question": question_data["question"],
                "answer": message.message,
                "dimension": question_data["dimension"],
                "scores": scores,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            # Generate contextual response
            bot_response = await generate_chat_response(question_data, message.message, session_data)
            
            # Move to next question
            current_question += 1
            
            # Check if assessment is complete
            if current_question >= len(CHAT_QUESTIONS):
                # Calculate final Hugo type
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        f"{HUGO_ENGINE_URL}/analyze-scores",
                        json=dimension_scores
                    )
                    
                    if response.status_code == 200:
                        analysis = response.json()
                        hugo_type = analysis["primary_type"]["code"]
                        
                        # Update session as completed
                        await conn.execute(
                            """
                            UPDATE chat_sessions 
                            SET current_question = $1, responses = $2, dimension_scores = $3, 
                                hugo_type_result = $4, is_completed = true
                            WHERE id = $5
                            """,
                            current_question, json.dumps(responses), json.dumps(dimension_scores),
                            hugo_type, session_id
                        )
                        
                        # Store bot response
                        completion_message = f"🎉 Fantastisch! Ich habe deine Persönlichkeit analysiert. Du bist ein **{analysis['primary_type']['name']} ({hugo_type})**!\n\n{analysis['primary_type']['description']}\n\nDeine Ergebnisse werden jetzt an dein Team weitergeleitet. Vielen Dank für deine Zeit!"
                        
                        await conn.execute(
                            """
                            INSERT INTO chat_messages (session_id, message, is_user, timestamp)
                            VALUES ($1, $2, $3, $4)
                            """,
                            session_id, completion_message, False, datetime.utcnow()
                        )
                        
                        return ChatResponse(
                            message=completion_message,
                            is_question=False,
                            is_completed=True,
                            hugo_type=hugo_type
                        )
            
            # Continue with next question
            next_question = CHAT_QUESTIONS[current_question] if current_question < len(CHAT_QUESTIONS) else None
            
            # Update session
            await conn.execute(
                """
                UPDATE chat_sessions 
                SET current_question = $1, responses = $2, dimension_scores = $3
                WHERE id = $4
                """,
                current_question, json.dumps(responses), json.dumps(dimension_scores), session_id
            )
            
            # Store bot response
            full_response = bot_response
            if next_question:
                full_response += f"\n\n{next_question['question']}"
            
            await conn.execute(
                """
                INSERT INTO chat_messages (session_id, message, is_user, timestamp)
                VALUES ($1, $2, $3, $4)
                """,
                session_id, full_response, False, datetime.utcnow()
            )
            
            return ChatResponse(
                message=full_response,
                is_question=bool(next_question),
                is_completed=False,
                next_question_id=next_question["id"] if next_question else None
            )
        
        else:
            return ChatResponse(
                message="Das Assessment ist bereits abgeschlossen. Vielen Dank!",
                is_question=False,
                is_completed=True
            )
        
    finally:
        await conn.close()

@app.get("/sessions/{session_id}")
async def get_session(session_id: str):
    """Get session details and chat history"""
    
    conn = await get_db_connection()
    try:
        # Get session
        session = await conn.fetchrow(
            """
            SELECT id, participant_name, participant_email, current_question, 
                   responses, dimension_scores, hugo_type_result, is_completed, created_at
            FROM chat_sessions 
            WHERE id = $1
            """,
            session_id
        )
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Get chat messages
        messages = await conn.fetch(
            """
            SELECT message, is_user, timestamp
            FROM chat_messages 
            WHERE session_id = $1 
            ORDER BY timestamp
            """,
            session_id
        )
        
        return {
            "session": dict(session),
            "messages": [dict(msg) for msg in messages]
        }
        
    finally:
        await conn.close()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "chat-assessment-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)
