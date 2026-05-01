from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_report(text: str):
    prompt = f"""
You are a medical AI assistant. Analyze this medical report — it could be a blood test, urine test, liver function test, thyroid panel, lipid profile, kidney function test, or any other medical report.

Automatically detect the type of report and extract ALL test values found.

For each test found, provide:
1. Test name
2. Value with unit
3. Normal range
4. Status (Normal, High, or Low)
5. Brief explanation in simple language

Also provide an overall summary at the end.

Medical Report Text:
{text}

Respond in this exact JSON format:
{{
    "report_type": "Blood Test / Urine Test / Liver Function / etc",
    "tests": [
        {{
            "name": "test name",
            "value": "value with unit",
            "normal_range": "range",
            "status": "Normal/High/Low",
            "explanation": "brief explanation"
        }}
    ],
    "summary": "overall summary here"
}}

For each test found, provide:
1. Test name
2. Value with unit
3. Normal range
4. Status (Normal, High, or Low)
5. Brief explanation

Also provide an overall summary at the end.

Blood Report Text:
{text}

Respond in this exact JSON format:
{{
    "tests": [
        {{
            "name": "test name",
            "value": "value with unit",
            "normal_range": "range",
            "status": "Normal/High/Low",
            "explanation": "brief explanation"
        }}
    ],
    "summary": "overall summary here"
}}
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    
    content = response.choices[0].message.content
    content = content.strip()
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
    content = content.strip()
    return content