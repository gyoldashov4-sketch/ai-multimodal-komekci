import React, { useState, useRef } from 'react';
import './App.css'; 

// Netlify Functions API EndPoints
const ASR_API_ENDPOINT = "/.netlify/functions/speech-to-text";
const VISION_API_ENDPOINT = "/.netlify/functions/vision-analysis"; // GÖZLEME FUNKSIÝASY

function App() {
    // --- SES (ASR) STATE ---
    const [isRecording, setIsRecording] = useState(false);
    const [asrResult, setAsrResult] = useState("Ses transkripsiýasy bu ýerde peýda bolar...");
    
    // --- GÖZLEME (VISION) STATE ---
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [visionResult, setVisionResult] = useState("Surat düşündirişi bu ýerde peýda bolar...");
    const fileInputRef = useRef(null); // Surat faýlyny saýlamak üçin
    
    // --- UMUMY STATE ---
    const [error, setError] = useState(null); 
    const [activeModule, setActiveModule] = useState('none'); // 'asr' ýa-da 'vision'

    let mediaRecorder = null; 
    let audioChunks = []; 

    // --- SES ÝAZGYSYNY DOLANDYRMAK ---
    // (Ses funksiýalaryny sadalaşdyrýaryn, sebäbi olar eýýäm bardy)
    const startRecording = async () => {
        // ... (Kynçylyksyz işläp başlaýan ASR kody) ...
    };

    const stopRecording = () => {
        // ... (Kynçylyksyz işläp başlaýan ASR kody) ...
    };

    const sendAudioToAPI = async (audioBlob) => {
        // ... (Kynçylyksyz işläp başlaýan ASR kody, ASR_API_ENDPOINT ulanar) ...
    };


    // --- GÖZLEME FUNKSIÝASYNY DOLANDYRMAK ---
    
    // Faýl saýlamak düwmesine basylanda
    const triggerFileInput = () => {
        fileInputRef.current.click();
        setActiveModule('vision');
        setError(null);
        setVisionResult("Surat düşündirişi bu ýerde peýda bolar...");
    };

    // Surat saýlanylanda
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            analyzeImage(file);
        }
    };

    // Suraty Vision API-na ugratmak
    const analyzeImage = async (file) => {
        setIsAnalyzing(true);
        setVisionResult("Surat analiz edilýär... Garaşyň.");
        
        try {
            const response = await fetch(VISION_API_ENDPOINT, {
                method: 'POST',
                // Göni surat faýlyny ugradýarys
                body: file,
                headers: {
                    'Content-Type': file.type || 'application/octet-stream', 
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `API-den ýalňyşlyk: ${response.status}`);
            }

            const data = await response.json();
            setVisionResult(data.description);
            setError(null);

        } catch (err) {
            console.error("Vision API çagyryş ýalňyşlygy:", err);
            setVisionResult("Analiz ýalňyşlygy.");
            setError(`Vision ýalňyşlygy: ${err.message}.`);
        } finally {
            setIsAnalyzing(false);
        }
    };


    // --- KODUŇ GÖRNÜŞI (RETURN) ---
    return (
        <div className="App">
            {/* 1. HEADER */}
            <header className="app-header">
                <h1 className="logo">AI Kömekçi</h1>
                <nav className="nav-menu">
                    <a href="#home">Home</a>
                    <a href="#hub">Kömekçi Hub</a>
                    <a href="#about">About</a>
                </nav>
            </header>

            {/* 2. HERO SECTION */}
            <main className="hero-section">
                <h2>AI Multimodal Kömekçi Platformasyna Hoş Geldiňiz</h2>
                <p>Elýeterliligiň täze derejesi: Ses we Görüş arkaly kömek.</p>
                
                {error && <div className="status-message error">{error}</div>}
                
                <div className="button-container">
                    {/* ULY DÜWME 1: Sesli Kömek */}
                    <button 
                        className={`main-button speech-button ${activeModule === 'asr' ? (isRecording ? 'recording-active' : 'active') : ''}`}
                        onClick={() => {
                            if (activeModule !== 'asr') setActiveModule('asr');
                            isRecording ? stopRecording() : startRecording();
                        }}
                    >
                        <span role="img" aria-label="Microphone">
                            {isRecording ? '🔴' : '🎤'}
                        </span>
                        <br />
                        {isRecording ? 'Ýazgyny Düzmek...' : 'Sesli Kömek (ASR)'}
                    </button>

                    {/* ULY DÜWME 2: Görüş Kömekçi */}
                    <button 
                        className={`main-button vision-button ${activeModule === 'vision' ? (isAnalyzing ? 'analyzing-active' : 'active') : ''}`}
                        onClick={triggerFileInput}
                        disabled={isAnalyzing}
                    >
                        <span role="img" aria-label="Eye">
                            {isAnalyzing ? '⏳' : '👁️'}
                        </span>
                        <br />
                        {isAnalyzing ? 'Analiz Edilýär...' : 'Görüş Kömekçi (VLM)'}
                    </button>
                </div>
                
                {/* 3. NETIJE BÖLÜMLERI */}
                <div className="result-container">
                    {activeModule === 'asr' && (
                        <div className="transcription-result">
                            <h3>Ses Transkripsiýa Netijesi:</h3>
                            <p className="result-text">{asrResult}</p>
                        </div>
                    )}

                    {activeModule === 'vision' && (
                         <div className="transcription-result">
                            <h3>Surat Analiz Netijesi:</h3>
                            <p className="result-text">{visionResult}</p>
                        </div>
                    )}
                    {activeModule === 'none' && (
                         <div className="transcription-result">
                            <p className="result-text">Funksiýany saýlaň (Ses ýa-da Görüş) we ulanyp başlaň.</p>
                        </div>
                    )}
                </div>
                
                {/* Gizlin Faýl Inputy */}
                <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleFileChange}
                />
                
            </main>

            {/* 4. FOOTER */}
            <footer className="app-footer">
                <p>© 2025 AI Kömekçi. Ähli hukuklar goralandyr.</p>
                <div className="sdg-icons">
                    <span role="img" aria-label="SDG 3">❤️ SDG 3</span>
                    <span role="img" aria-label="SDG 4">📚 SDG 4</span>
                    <span role="img" aria-label="SDG 10">🤝 SDG 10</span>
                </div>
            </footer>
        </div>
    );
}

export default App;
// (Görnüş üçin 'startRecording' we 'stopRecording' funksiýalary sadalaşdyryldy. Siz soňky işlän kodyňyzy ulanmaly)
