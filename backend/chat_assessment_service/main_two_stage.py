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
from email.mime.text import MIMEText as MimeText
from email.mime.multipart import MIMEMultipart as MimeMultipart

app = FastAPI(title="Hugo App - Two-Stage Chat Assessment Service", version="2.0.0")

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
    current_stage: int = 1  # 1 = initial assessment, 2 = refinement
    current_question: int = 0
    responses: List[Dict[str, Any]] = []
    dimension_scores: Dict[str, float] = {}
    preliminary_types: List[str] = []  # Top 2-3 types from stage 1
    hugo_type_result: Optional[str] = None
    cultural_background: Optional[str] = None
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
    stage: int = 1
    hugo_type: Optional[str] = None
    next_question_id: Optional[int] = None
    preliminary_results: Optional[Dict] = None

class InvitationCreate(BaseModel):
    participant_email: EmailStr
    participant_name: Optional[str] = None
    company_name: str
    sender_name: str

class ParticipantRegistration(BaseModel):
    invitation_token: str
    participant_name: str
    participant_email: EmailStr
    cultural_background: Optional[str] = None

# Two-Stage Assessment Questions
STAGE_1_QUESTIONS = [
    {
        "id": 1,
        "question": "Hallo! Schön, dass du da bist. Ich bin Hugo, dein persönlicher Persönlichkeits-Assistent. 🚀\n\nLass uns mit einer einfachen Frage beginnen: Wenn du in einem Team arbeitest, was motiviert dich am meisten - das große Ganze zu gestalten, neue Wege zu erkunden, Expertise einzubringen oder Menschen zu verbinden?",
        "dimension": "general",
        "type": "open"
    },
    {
        "id": 2,
        "question": "Interessant! Stell dir vor, dein Team steht vor einer wichtigen Entscheidung. Beschreibe mir, wie du normalerweise vorgehst.",
        "dimension": "Vision",
        "type": "open"
    },
    {
        "id": 3,
        "question": "Du bekommst ein völlig neues, unbekanntes Projekt. Was ist dein erster Gedanke und wie gehst du damit um?",
        "dimension": "Innovation",
        "type": "open"
    },
    {
        "id": 4,
        "question": "Wenn du ein komplexes Problem lösen musst, worauf verlässt du dich am meisten - auf bewährte Methoden, tiefe Analyse oder kreative Ansätze?",
        "dimension": "Expertise",
        "type": "open"
    },
    {
        "id": 5,
        "question": "In Meetings und Diskussionen - was ist deine natürliche Rolle? Wie trägst du zum Teamerfolg bei?",
        "dimension": "Connection",
        "type": "open"
    },
    {
        "id": 6,
        "question": "Wenn du an deine größten beruflichen Erfolge denkst - was haben sie gemeinsam? Was hat dich dabei angetrieben?",
        "dimension": "general",
        "type": "open"
    }
]

# Stage 2 questions will be dynamically generated based on preliminary results
STAGE_2_QUESTION_TEMPLATES = {
    "Vision": {
        "V1": "Du scheinst ein natürlicher Führungstyp zu sein. Erzähl mir von einer Situation, wo du andere für eine Vision begeistert hast.",
        "V2": "Du zeigst Eigenschaften eines Entwicklers. Wie hilfst du anderen dabei, ihr Potenzial zu entfalten?",
        "V3": "Du wirkst wie jemand, der gerne organisiert. Wie schaffst du Struktur in chaotischen Situationen?"
    },
    "Innovation": {
        "I1": "Du scheinst ein kreativer Pionier zu sein. Erzähl mir von deiner innovativsten Idee.",
        "I2": "Du zeigst Eigenschaften eines Architekten. Wie designst du Systeme oder Prozesse?",
        "I3": "Du wirkst wie ein Inspirer. Wie motivierst du andere durch deine Kreativität?"
    },
    "Expertise": {
        "E1": "Du scheinst ein analytischer Forscher zu sein. Wie gehst du an komplexe Analysen heran?",
        "E2": "Du zeigst Eigenschaften eines Meisters. Wie stellst du Qualität und Exzellenz sicher?",
        "E3": "Du wirkst wie ein weiser Berater. Wie hilfst du anderen bei wichtigen Entscheidungen?"
    },
    "Connection": {
        "C1": "Du scheinst ein natürlicher Harmonisierer zu sein. Wie schaffst du Stabilität im Team?",
        "C2": "Du zeigst Eigenschaften eines Brückenbauers. Wie verbindest du verschiedene Menschen?",
        "C3": "Du wirkst wie ein praktischer Umsetzer. Wie bringst du Ideen in die Realität?"
    }
}

# Hugo Type Definitions for Analysis
HUGO_TYPES = {
    "V1": {"name": "Pathfinder", "dimension": "Vision", "description": "Zeigt den Weg in eine bessere Zukunft"},
    "V2": {"name": "Developer", "dimension": "Vision", "description": "Hilft Menschen und Teams beim Wachsen"},
    "V3": {"name": "Organizer", "dimension": "Vision", "description": "Schafft Struktur und Effizienz für nachhaltigen Erfolg"},
    "I1": {"name": "Pioneer", "dimension": "Innovation", "description": "Erkundet unbekannte Möglichkeiten und schafft Durchbrüche"},
    "I2": {"name": "Architect", "dimension": "Innovation", "description": "Entwirft Systeme und Strukturen für die Zukunft"},
    "I3": {"name": "Inspirer", "dimension": "Innovation", "description": "Motiviert durch Kreativität und Sinn"},
    "E1": {"name": "Researcher", "dimension": "Expertise", "description": "Entschlüsselt komplexe Zusammenhänge durch tiefe Analyse"},
    "E2": {"name": "Master", "dimension": "Expertise", "description": "Sichert Exzellenz durch bewährte Expertise"},
    "E3": {"name": "Advisor", "dimension": "Expertise", "description": "Gibt weise Ratschläge für nachhaltige Entscheidungen"},
    "C1": {"name": "Harmonizer", "dimension": "Connection", "description": "Schafft Stabilität und psychologische Sicherheit"},
    "C2": {"name": "Bridge-Builder", "dimension": "Connection", "description": "Verbindet Menschen und baut Netzwerke"},
    "C3": {"name": "Implementer", "dimension": "Connection", "description": "Verwandelt Ideen in Realität"}
}

# Database connection
async def get_db_connection():
    return await asyncpg.connect(DATABASE_URL)

# Enhanced LLM Analysis Functions
async def analyze_response_with_llm_stage1(question: str, response: str, dimension: str) -> Dict[str, float]:
    """Stage 1: Broad analysis to identify general tendencies"""
    
    if not OPENAI_API_KEY:
        return {"Vision": 0.5, "Innovation": 0.5, "Expertise": 0.5, "Connection": 0.5}
    
    prompt = f"""
    Analysiere diese Antwort für eine erste Einschätzung der Hugo-Persönlichkeitsdimensionen:

    Frage: {question}
    Antwort: {response}

    Hugo-Dimensionen:
    - Vision: Strategisches Denken, Führung, Zielorientierung, große Pläne
    - Innovation: Kreativität, Experimentieren, Neues schaffen, Veränderung
    - Expertise: Fachwissen, Qualität, Analyse, bewährte Methoden, Perfektion
    - Connection: Beziehungen, Teamwork, Empathie, Harmonie, Menschen verbinden

    Bewerte jede Dimension von 0.0 bis 1.0. Sei großzügig bei der Bewertung - wir suchen nach Tendenzen.
    
    Antworte nur mit JSON:
    {{"Vision": 0.7, "Innovation": 0.3, "Expertise": 0.8, "Connection": 0.6}}
    """
    
    try:
        response_obj = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Du bist ein Experte für Persönlichkeitsanalyse. Antworte nur mit dem angeforderten JSON-Format."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=100,
            temperature=0.3
        )
        
        result = response_obj.choices[0].message.content.strip()
        scores = json.loads(result)
        
        # Validate and normalize scores
        for dim in ["Vision", "Innovation", "Expertise", "Connection"]:
            if dim not in scores:
                scores[dim] = 0.5
            scores[dim] = max(0.0, min(1.0, float(scores[dim])))
        
        return scores
        
    except Exception as e:
        print(f"LLM analysis error: {e}")
        base_scores = {"Vision": 0.5, "Innovation": 0.5, "Expertise": 0.5, "Connection": 0.5}
        if dimension in base_scores:
            base_scores[dimension] = 0.7
        return base_scores

async def analyze_response_with_llm_stage2(question: str, response: str, preliminary_types: List[str]) -> Dict[str, float]:
    """Stage 2: Refined analysis to distinguish between similar types"""
    
    if not OPENAI_API_KEY:
        return {ptype: 0.5 for ptype in preliminary_types}
    
    type_descriptions = {ptype: f"{HUGO_TYPES[ptype]['name']} - {HUGO_TYPES[ptype]['description']}" 
                        for ptype in preliminary_types}
    
    prompt = f"""
    Analysiere diese Antwort, um zwischen ähnlichen Hugo-Typen zu unterscheiden:

    Frage: {question}
    Antwort: {response}

    Mögliche Hugo-Typen:
    {json.dumps(type_descriptions, indent=2, ensure_ascii=False)}

    Bewerte, wie gut die Antwort zu jedem Typ passt (0.0 bis 1.0).
    Achte auf spezifische Unterschiede zwischen den Typen.
    
    Antworte nur mit JSON:
    {{{", ".join([f'"{ptype}": 0.7' for ptype in preliminary_types])}}}
    """
    
    try:
        response_obj = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Du bist ein Experte für Hugo-Persönlichkeitstypen. Antworte nur mit dem angeforderten JSON-Format."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.2
        )
        
        result = response_obj.choices[0].message.content.strip()
        scores = json.loads(result)
        
        # Validate scores
        for ptype in preliminary_types:
            if ptype not in scores:
                scores[ptype] = 0.5
            scores[ptype] = max(0.0, min(1.0, float(scores[ptype])))
        
        return scores
        
    except Exception as e:
        print(f"Stage 2 LLM analysis error: {e}")
        return {ptype: 0.5 for ptype in preliminary_types}

def determine_preliminary_types(dimension_scores: Dict[str, float]) -> List[str]:
    """Determine top 2-3 Hugo types based on stage 1 scores"""
    
    # Find the dominant dimension
    dominant_dim = max(dimension_scores.keys(), key=lambda k: dimension_scores[k])
    
    # Get all types from the dominant dimension
    dominant_types = [code for code, info in HUGO_TYPES.items() 
                     if info["dimension"] == dominant_dim]
    
    # Also consider types from secondary dimensions if scores are close
    secondary_types = []
    for dim, score in dimension_scores.items():
        if dim != dominant_dim and score >= dimension_scores[dominant_dim] - 0.2:
            secondary_types.extend([code for code, info in HUGO_TYPES.items() 
                                  if info["dimension"] == dim])
    
    # Return top 2-3 types
    all_candidates = dominant_types + secondary_types[:2]
    return all_candidates[:3]

def generate_stage2_questions(preliminary_types: List[str]) -> List[Dict]:
    """Generate targeted questions for stage 2 based on preliminary types"""
    
    questions = []
    
    # Group types by dimension
    dimensions = {}
    for ptype in preliminary_types:
        dim = HUGO_TYPES[ptype]["dimension"]
        if dim not in dimensions:
            dimensions[dim] = []
        dimensions[dim].append(ptype)
    
    # Generate questions for each dimension
    question_id = 1
    for dim, types in dimensions.items():
        if len(types) > 1:
            # Need to distinguish between types in this dimension
            for ptype in types:
                if ptype in STAGE_2_QUESTION_TEMPLATES[dim]:
                    questions.append({
                        "id": question_id,
                        "question": STAGE_2_QUESTION_TEMPLATES[dim][ptype],
                        "dimension": dim,
                        "target_type": ptype,
                        "type": "refinement"
                    })
                    question_id += 1
    
    # Add cultural background question
    questions.append({
        "id": question_id,
        "question": "Zum Abschluss: Aus welchem kulturellen Hintergrund kommst du? Das hilft mir, deine Arbeitsweise noch besser zu verstehen.",
        "dimension": "culture",
        "type": "culture"
    })
    
    return questions

async def generate_chat_response(question_data: Dict, user_response: str, session: ChatSession, stage: int) -> str:
    """Generate contextual chat response using LLM"""
    
    if not OPENAI_API_KEY:
        return "Danke für deine Antwort! Das hilft mir sehr, dich besser zu verstehen."
    
    if stage == 1:
        prompt = f"""
        Du bist Hugo, ein freundlicher Persönlichkeits-Assistent. 
        
        Der Nutzer {session.participant_name} hat gerade diese Frage beantwortet:
        Frage: {question_data['question']}
        Antwort: {user_response}
        
        Gib eine kurze, empathische Antwort (1-2 Sätze), die zeigt, dass du die Antwort verstanden hast.
        Sei ermutigend und zeige Interesse an der Person.
        """
    else:
        prompt = f"""
        Du bist Hugo, ein Persönlichkeits-Assistent in der Vertiefungsphase.
        
        {session.participant_name} beantwortet gerade Fragen zur Verfeinerung des Persönlichkeitstyps.
        Frage: {question_data['question']}
        Antwort: {user_response}
        
        Gib eine kurze, bestätigende Antwort, die zeigt, dass du die Nuancen verstehst.
        """
    
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Du bist Hugo, ein empathischer Persönlichkeits-Assistent. Antworte kurz und freundlich."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=80,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"Chat response generation error: {e}")
        return "Danke für deine Antwort! Das hilft mir sehr."

# Email functions (same as before)
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
            
            <p>{sender} von {company} hat dich zu einem innovativen Persönlichkeitsassessment mit Hugo eingeladen!</p>
            
            <p>Hugo verwendet einen <strong>zweistufigen Ansatz</strong>, um deinen Persönlichkeitstyp präzise zu bestimmen. Das Assessment dauert etwa 15-20 Minuten und wird als freundliches Gespräch mit unserem KI-Assistenten geführt.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{assessment_link}" 
                   style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                    Assessment starten
                </a>
            </div>
            
            <p><strong>Was dich erwartet:</strong></p>
            <ul>
                <li>🤖 Intelligenter Chat mit Hugo, unserem KI-Assistenten</li>
                <li>📊 Zweistufige Analyse für präzise Ergebnisse</li>
                <li>⏱️ Nur 15-20 Minuten deiner Zeit</li>
                <li>🎯 Personalisierte Einblicke in deine Stärken</li>
                <li>🌍 Berücksichtigung kultureller Unterschiede</li>
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
        invitation_token = str(uuid.uuid4())
        expires_at = datetime.utcnow() + timedelta(days=7)
        
        await conn.execute(
            """
            INSERT INTO assessment_invitations 
            (token, participant_email, participant_name, company_name, sender_name, expires_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            """,
            invitation_token, invitation.participant_email, invitation.participant_name,
            invitation.company_name, invitation.sender_name, expires_at
        )
        
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
        
        session_id = str(uuid.uuid4())
        
        await conn.execute(
            """
            INSERT INTO chat_sessions 
            (id, participant_name, participant_email, invitation_token, current_question, 
             responses, dimension_scores, cultural_background)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            """,
            session_id, registration.participant_name, registration.participant_email,
            registration.invitation_token, 0, json.dumps([]), json.dumps({}),
            registration.cultural_background
        )
        
        await conn.execute(
            "UPDATE assessment_invitations SET is_used = true WHERE token = $1",
            registration.invitation_token
        )
        
        return {
            "session_id": session_id,
            "message": f"Hallo {registration.participant_name}! Willkommen bei Hugo. Ich freue mich darauf, dich in einem zweistufigen Prozess kennenzulernen! 🚀\n\nZuerst erkunde ich deine grundlegenden Persönlichkeitstendenzen, dann vertiefen wir gemeinsam die Details. Lass uns beginnen!"
        }
        
    finally:
        await conn.close()

@app.post("/sessions/{session_id}/message")
async def send_message(session_id: str, message: ChatMessage):
    """Process user message and return bot response - Two-Stage Implementation"""
    
    conn = await get_db_connection()
    try:
        # Get session
        session_data = await conn.fetchrow(
            """
            SELECT id, participant_name, participant_email, current_question, 
                   responses, dimension_scores, is_completed, cultural_background
            FROM chat_sessions 
            WHERE id = $1
            """,
            session_id
        )
        
        if not session_data:
            raise HTTPException(status_code=404, detail="Session not found")
        
        if session_data["is_completed"]:
            return ChatResponse(
                message="Das Assessment ist bereits abgeschlossen. Vielen Dank!",
                is_question=False,
                is_completed=True
            )
        
        # Store user message
        await conn.execute(
            """
            INSERT INTO chat_messages (session_id, message, is_user, timestamp)
            VALUES ($1, $2, $3, $4)
            """,
            session_id, message.message, True, datetime.utcnow()
        )
        
        # Parse session data
        current_question = session_data["current_question"]
        responses = json.loads(session_data["responses"])
        dimension_scores = json.loads(session_data["dimension_scores"])
        
        # Determine current stage
        stage = 1 if current_question < len(STAGE_1_QUESTIONS) else 2
        
        if stage == 1:
            # Stage 1: Initial broad assessment
            question_data = STAGE_1_QUESTIONS[current_question]
            
            # Analyze response
            scores = await analyze_response_with_llm_stage1(
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
                "response": message.message,
                "dimension": question_data["dimension"],
                "scores": scores,
                "stage": 1
            })
            
            current_question += 1
            
            # Generate bot response
            bot_response = await generate_chat_response(question_data, message.message, session_data, 1)
            
            # Check if stage 1 is complete
            if current_question >= len(STAGE_1_QUESTIONS):
                # Determine preliminary types
                preliminary_types = determine_preliminary_types(dimension_scores)
                
                # Generate stage 2 questions
                stage2_questions = generate_stage2_questions(preliminary_types)
                
                # Store preliminary results
                await conn.execute(
                    """
                    UPDATE chat_sessions 
                    SET current_question = $1, responses = $2, dimension_scores = $3
                    WHERE id = $4
                    """,
                    current_question, json.dumps(responses), json.dumps(dimension_scores), session_id
                )
                
                # Transition message
                transition_msg = f"\n\n🎯 Perfekt! Ich habe eine erste Einschätzung deiner Persönlichkeit. Du zeigst starke Tendenzen in Richtung {', '.join([HUGO_TYPES[t]['name'] for t in preliminary_types])}.\n\nJetzt lass uns in die Vertiefung gehen, um deinen exakten Hugo-Typ zu bestimmen!"
                
                bot_response += transition_msg
                
                # Add first stage 2 question
                if stage2_questions:
                    bot_response += f"\n\n{stage2_questions[0]['question']}"
                    
                    # Store stage 2 questions in session
                    await conn.execute(
                        """
                        UPDATE chat_sessions 
                        SET responses = $1
                        WHERE id = $2
                        """,
                        json.dumps(responses + [{"stage2_questions": stage2_questions, "preliminary_types": preliminary_types}]), 
                        session_id
                    )
                
                await conn.execute(
                    """
                    INSERT INTO chat_messages (session_id, message, is_user, timestamp)
                    VALUES ($1, $2, $3, $4)
                    """,
                    session_id, bot_response, False, datetime.utcnow()
                )
                
                return ChatResponse(
                    message=bot_response,
                    is_question=bool(stage2_questions),
                    is_completed=False,
                    stage=2,
                    preliminary_results={"types": preliminary_types, "scores": dimension_scores}
                )
            
            else:
                # Continue with next stage 1 question
                next_question = STAGE_1_QUESTIONS[current_question]
                full_response = bot_response + f"\n\n{next_question['question']}"
                
                await conn.execute(
                    """
                    UPDATE chat_sessions 
                    SET current_question = $1, responses = $2, dimension_scores = $3
                    WHERE id = $4
                    """,
                    current_question, json.dumps(responses), json.dumps(dimension_scores), session_id
                )
                
                await conn.execute(
                    """
                    INSERT INTO chat_messages (session_id, message, is_user, timestamp)
                    VALUES ($1, $2, $3, $4)
                    """,
                    session_id, full_response, False, datetime.utcnow()
                )
                
                return ChatResponse(
                    message=full_response,
                    is_question=True,
                    is_completed=False,
                    stage=1,
                    next_question_id=next_question["id"]
                )
        
        else:
            # Stage 2: Refinement
            # Get stage 2 data from responses
            stage2_data = None
            preliminary_types = []
            
            for resp in responses:
                if "stage2_questions" in resp:
                    stage2_data = resp["stage2_questions"]
                    preliminary_types = resp["preliminary_types"]
                    break
            
            if not stage2_data:
                raise HTTPException(status_code=500, detail="Stage 2 data not found")
            
            # Calculate stage 2 question index
            stage2_question_idx = current_question - len(STAGE_1_QUESTIONS)
            
            if stage2_question_idx < len(stage2_data):
                question_data = stage2_data[stage2_question_idx]
                
                # Handle cultural background question
                if question_data.get("type") == "culture":
                    await conn.execute(
                        """
                        UPDATE chat_sessions 
                        SET cultural_background = $1
                        WHERE id = $2
                        """,
                        message.message, session_id
                    )
                    
                    bot_response = "Vielen Dank! Das hilft mir, deine Arbeitsweise im kulturellen Kontext zu verstehen."
                    
                else:
                    # Analyze response for type refinement
                    type_scores = await analyze_response_with_llm_stage2(
                        question_data["question"], 
                        message.message, 
                        preliminary_types
                    )
                    
                    bot_response = await generate_chat_response(question_data, message.message, session_data, 2)
                
                # Store response
                responses.append({
                    "question_id": question_data["id"],
                    "question": question_data["question"],
                    "response": message.message,
                    "dimension": question_data.get("dimension"),
                    "type_scores": type_scores if question_data.get("type") != "culture" else None,
                    "stage": 2
                })
                
                current_question += 1
                
                # Check if assessment is complete
                if stage2_question_idx + 1 >= len(stage2_data):
                    # Calculate final Hugo type
                    final_type_scores = {}
                    for resp in responses:
                        if resp.get("stage") == 2 and "type_scores" in resp and resp["type_scores"]:
                            for ptype, score in resp["type_scores"].items():
                                if ptype in final_type_scores:
                                    final_type_scores[ptype] += score
                                else:
                                    final_type_scores[ptype] = score
                    
                    # Determine final type
                    if final_type_scores:
                        final_type = max(final_type_scores.keys(), key=lambda k: final_type_scores[k])
                    else:
                        # Fallback to highest scoring preliminary type
                        final_type = preliminary_types[0] if preliminary_types else "V1"
                    
                    # Update session as completed
                    await conn.execute(
                        """
                        UPDATE chat_sessions 
                        SET current_question = $1, responses = $2, dimension_scores = $3, 
                            hugo_type_result = $4, is_completed = true
                        WHERE id = $5
                        """,
                        current_question, json.dumps(responses), json.dumps(dimension_scores),
                        final_type, session_id
                    )
                    
                    # Generate completion message
                    type_info = HUGO_TYPES[final_type]
                    completion_message = f"🎉 Fantastisch! Nach der zweistufigen Analyse kann ich dir mit hoher Präzision sagen:\n\nDu bist ein **{type_info['name']} ({final_type})**!\n\n{type_info['description']}\n\nDeine Ergebnisse werden jetzt an dein Team weitergeleitet. Vielen Dank für deine Zeit und deine offenen Antworten!"
                    
                    full_response = bot_response + f"\n\n{completion_message}"
                    
                    await conn.execute(
                        """
                        INSERT INTO chat_messages (session_id, message, is_user, timestamp)
                        VALUES ($1, $2, $3, $4)
                        """,
                        session_id, full_response, False, datetime.utcnow()
                    )
                    
                    return ChatResponse(
                        message=full_response,
                        is_question=False,
                        is_completed=True,
                        stage=2,
                        hugo_type=final_type
                    )
                
                else:
                    # Continue with next stage 2 question
                    next_question = stage2_data[stage2_question_idx + 1]
                    full_response = bot_response + f"\n\n{next_question['question']}"
                    
                    await conn.execute(
                        """
                        UPDATE chat_sessions 
                        SET current_question = $1, responses = $2
                        WHERE id = $3
                        """,
                        current_question, json.dumps(responses), session_id
                    )
                    
                    await conn.execute(
                        """
                        INSERT INTO chat_messages (session_id, message, is_user, timestamp)
                        VALUES ($1, $2, $3, $4)
                        """,
                        session_id, full_response, False, datetime.utcnow()
                    )
                    
                    return ChatResponse(
                        message=full_response,
                        is_question=True,
                        is_completed=False,
                        stage=2,
                        next_question_id=next_question["id"]
                    )
        
    finally:
        await conn.close()

@app.get("/sessions/{session_id}")
async def get_session(session_id: str):
    """Get session details and chat history"""
    
    conn = await get_db_connection()
    try:
        session = await conn.fetchrow(
            """
            SELECT id, participant_name, participant_email, current_question, 
                   responses, dimension_scores, hugo_type_result, is_completed, 
                   created_at, cultural_background
            FROM chat_sessions 
            WHERE id = $1
            """,
            session_id
        )
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
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
    return {"status": "healthy", "service": "two-stage-chat-assessment-service", "version": "2.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)
