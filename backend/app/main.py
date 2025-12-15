from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import os # Daşky gurşaw üýtgeýjilerini ulanmak üçin goşuldy

app = FastAPI(
    title="AI Multimodal Kömekçi API",
    description="Sesden Tekste (Hugging Face) we beýleki modullar üçin Backend.",
    version="1.0.0"
)

# CORS Sazlamalary
origins = ["*"] 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hugging Face Modeli we API nokady (Endpoint)
HUGGING_FACE_MODEL = "Sunbird/asr-whisper-large-v3-salt" # Türkmen dilini goldaýan model
API_URL = f"https://api-inference.huggingface.co/models/{HUGGING_FACE_MODEL}"

# ⚠️ HUGGING FACE API AÇARY (TOKEN)
# Açary koddany aýyryp, Daşky Gurşawdan (Render) alýarys
HUGGING_FACE_API_KEY = os.getenv("HF_API_KEY") 

# Eger açar goýulmadyk bolsa, koda ýalňyşlyk goýýarys
if not HUGGING_FACE_API_KEY:
    # Bu ýalňyşlyk Render-de açar goýulmadyk bolsa, sizi duýdurar
    print("FATAL: HF_API_KEY daşky gurşaw üýtgeýjisi tapylmady!")

headers = {
    # Açary Daşky Gurşawdan alýarys
    "Authorization": f"Bearer {HUGGING_FACE_API_KEY}" 
}

@app.get("/")
def read_root():
    """API-niň işleýändigini barlamak üçin esasy nokat"""
    return {"status": "ok", "message": "AI Kömekçi API-si işjeň (HF Integration taýyn)!"}

# Sesden Tekste funksiýasy (Hugging Face API arkaly)
@app.post("/api/speech-to-text/")
async def speech_to_text(audio_file: UploadFile = File(...)):
    
    if not HUGGING_FACE_API_KEY:
        # Eger Render-de açar goýulmadyk bolsa, ulanyja habar ber
        raise HTTPException(
            status_code=500, 
            detail="Serverde HF API Açary (HF_API_KEY) sazlanmady. Admin bilen habarlaşyň."
        )

    # 1. Ses faýlyny okamak
    audio_content = await audio_file.read()
    
    # 2. Hugging Face API-na ugratmak
    try:
        response = requests.post(API_URL, headers=headers, data=audio_content)
        response.raise_for_status() # Eger kynçylyk bolsa, ýalňyşlyk döret
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Hugging Face API-den Ýalňyşlyk: {e}")

    # 3. Netijäni gaýtarmak
    result = response.json()
    
    # 4. Eger Hugging Face jogabynda ýalňyşlyk bar bolsa
    if 'error' in result:
        raise HTTPException(status_code=503, detail=f"HF Modeli Ýalňyşlyk Berdi: {result['error']}")

    transcribed_text = result.get('text', 'Transkript tapylmady.')

    return {
        "filename": audio_file.filename,
        "transcription": transcribed_text
    }
