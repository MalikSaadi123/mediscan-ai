from fastapi import FastAPI, HTTPException, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv
from models import UserRegister, UserLogin
from pydantic import BaseModel
from auth import hash_password, verify_password, create_token, decode_token
from ai_engine import analyze_report
from pdf_parser import extract_text_from_pdf
from bson import ObjectId
from datetime import datetime
import json
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

mongo_client = MongoClient(os.getenv("MONGODB_URL"))
db = mongo_client[os.getenv("DATABASE_NAME")]

from groq import Groq
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    try:
        payload = decode_token(token)
        return payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/")
def root():
    return {"message": "MediScan AI backend is running 🚀"}

@app.post("/auth/register")
def register(user: UserRegister):
    if db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(user.password)
    new_user = {"name": user.name, "email": user.email, "password": hashed}
    result = db.users.insert_one(new_user)
    token = create_token({"user_id": str(result.inserted_id)})
    return {"token": token, "user": {"id": str(result.inserted_id), "name": user.name, "email": user.email}}

@app.post("/auth/login")
def login(user: UserLogin):
    found = db.users.find_one({"email": user.email})
    if not found or not verify_password(user.password, found["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token({"user_id": str(found["_id"])})
    return {"token": token, "user": {"id": str(found["_id"]), "name": found["name"], "email": found["email"]}}

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), authorization: str = Header(None)):
    user_id = get_current_user(authorization)
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    contents = await file.read()
    text = extract_text_from_pdf(contents)
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")
    result = analyze_report(text)
    try:
        parsed = json.loads(result)
    except:
        parsed = {"raw": result}
    report = {
        "user_id": user_id,
        "filename": file.filename,
        "result": parsed,
        "created_at": datetime.utcnow()
    }
    db.reports.insert_one(report)
    return {"status": "success", "data": parsed}

class ChatMessage(BaseModel):
    message: str
    report_context: str = ""

@app.post("/chat")
def chat(msg: ChatMessage, authorization: str = Header(None)):
    get_current_user(authorization)
    
    system_prompt = """You are MediBot, a helpful medical AI assistant specialized in blood reports. 
You explain medical terms in simple, friendly language. 
You always remind users to consult a doctor for medical decisions.
Keep responses concise and clear."""

    context = f"\n\nReport context: {msg.report_context}" if msg.report_context else ""
    
    from groq import Groq as GroqClient
    _groq = GroqClient(api_key=os.getenv("GROQ_API_KEY"))
    response = _groq.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": msg.message + context}
        ],
        temperature=0.7,
        max_tokens=500,
    )
    
    return {"reply": response.choices[0].message.content}

class RecommendationRequest(BaseModel):
    report_data: str

@app.post("/recommendations")
def get_recommendations(req: RecommendationRequest, authorization: str = Header(None)):
    get_current_user(authorization)
    
    prompt = f"""
You are an expert medical AI assistant. Based on this blood report analysis, provide detailed personalized recommendations.

Report Data:
{req.report_data}

Provide recommendations in this exact JSON format:
{{
    "overall_status": "Good/Fair/Poor",
    "lifestyle": [
        {{"title": "recommendation title", "description": "detailed description", "priority": "High/Medium/Low"}}
    ],
    "diet": {{
        "foods_to_eat": ["food1", "food2", "food3", "food4", "food5"],
        "foods_to_avoid": ["food1", "food2", "food3", "food4", "food5"]
    }},
    "exercise": [
        {{"title": "exercise name", "description": "how it helps", "frequency": "how often"}}
    ],
    "doctor_visit": {{
        "urgency": "Immediate/Soon/Routine",
        "reasons": ["reason1", "reason2"],
        "specialists": ["specialist type1", "specialist type2"]
    }},
    "followup_tests": ["test1", "test2", "test3"]
}}
"""
    
    from groq import Groq as GroqClient
    _groq = GroqClient(api_key=os.getenv("GROQ_API_KEY"))
    response = _groq.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=1500,
    )
    
    content = response.choices[0].message.content.strip()
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
    content = content.strip()
    
    try:
        return {"recommendations": json.loads(content)}
    except:
        return {"recommendations": None, "raw": content}

@app.get("/trends")
def get_trends(authorization: str = Header(None)):
    user_id = get_current_user(authorization)
    reports = list(db.reports.find({"user_id": user_id}).sort("created_at", 1))
    
    trends = {}
    dates = []
    
    for report in reports:
        date = report["created_at"].strftime("%d/%m/%Y")
        dates.append(date)
        tests = report.get("result", {}).get("tests", [])
        for test in tests:
            name = test.get("name", "")
            value = test.get("value", "0")
            status = test.get("status", "Normal")
            # Extract numeric value
            import re
            numeric = re.findall(r"[\d.]+", str(value))
            numeric_val = float(numeric[0]) if numeric else 0
            
            if name not in trends:
                trends[name] = []
            trends[name].append({
                "date": date,
                "value": numeric_val,
                "raw_value": value,
                "status": status
            })
    
    return {
        "trends": trends,
        "dates": dates,
        "total_reports": len(reports)
    }

ADMIN_EMAIL = "saadibrar001@gmail.com"

def require_admin(authorization: str = Header(None)):
    user_id = get_current_user(authorization)
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user or user.get("email") != ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user_id

@app.get("/admin/stats")
def admin_stats(authorization: str = Header(None)):
    require_admin(authorization)
    total_users = db.users.count_documents({})
    total_reports = db.reports.count_documents({})
    recent_users = list(db.users.find().sort("_id", -1).limit(10))
    for u in recent_users:
        u["_id"] = str(u["_id"])
        u.pop("password", None)
        u["report_count"] = db.reports.count_documents({"user_id": str(u["_id"])})
    recent_reports = list(db.reports.find().sort("created_at", -1).limit(10))
    for r in recent_reports:
        r["_id"] = str(r["_id"])
    return {
        "total_users": total_users,
        "total_reports": total_reports,
        "recent_users": recent_users,
        "recent_reports": recent_reports
    }

@app.get("/reports")
def get_reports(authorization: str = Header(None)):
    user_id = get_current_user(authorization)
    reports = list(db.reports.find({"user_id": user_id}))
    for r in reports:
        r["_id"] = str(r["_id"])
    return {"reports": reports}