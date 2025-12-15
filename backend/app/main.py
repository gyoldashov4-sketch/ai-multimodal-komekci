from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(
    title="AI Multimodal Kömekçi API",
    description="Ses, OCR we Gest Modullary üçin esasy Backend.",
    version="1.0.0"
)

# CORS Sazlamalary (Frontend bilen baglanyşyk üçin)
origins = ["*"] # Synag üçin hemmesini açyk goýalyň
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    """API-niň işleýändigini barlamak üçin esasy nokat"""
    return {"status": "ok", "message": "AI Kömekçi API-si işjeň!"}

# Sesden Tekste nokady (Placeholder)
@app.post("/api/speech-to-text/")
async def speech_to_text(audio_file: UploadFile = File(...)):
    return {
        "filename": audio_file.filename,
        "transcription": "Bu AI Kömekçiniň ilkinji synag transkriptidir (Placeholder)."
    }
