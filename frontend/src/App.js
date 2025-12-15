import React, { useState } from 'react'; // state ulanmak üçin goşuldy
import './App.css'; 

// 🚨 TÄZE NETLIFY FUNCTION API ADRESI
// Bu Netlify Functions tarapyndan awtomatiki ýerleşdirilen funksiýanyň adresidir.
// Ol dogry işleýändigine göz ýetirmeli!
const API_ENDPOINT = "/.netlify/functions/speech-to-text"; 

function App() {
    // State-ler:
    const [isRecording, setIsRecording] = useState(false); // Ýazgy ýagdaýy
    const [transcription, setTranscription] = useState("Transkripsiýa şu ýerde peýda bolar..."); // Transkripsiýa teksti
    const [error, setError] = useState(null); // Ýalňyşlyk habarlary

    let mediaRecorder = null; // MediaRecorder obýekti (ses ýazmak üçin)
    let audioChunks = []; // Ses bölekleri

    // --- Ses Ýazgysyny Dolandyrmak Funksiýalary ---
    
    // Ses ýazgysyny başlatmak
    const startRecording = async () => {
        setError(null);
        setTranscription("Ses ýazgysyna başladyňyz... Ýazgy üçin gürläň.");
        setIsRecording(true);
        audioChunks = [];

        try {
            // Mikrofona rugsat almak
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // MediaRecorder obýektini gurmak
            mediaRecorder = new MediaRecorder(stream);

            // Ses datasy gelende
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            // Ses ýazgysy tamamlananda
            mediaRecorder.onstop = async () => {
                // Ýazylan ses böleklerini birleşdirmek
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm; codecs=opus' });
                stream.getTracks().forEach(track => track.stop()); // Mikrofony ýapmak
                
                // API-na ugratmak
                await sendAudioToAPI(audioBlob);
            };

            mediaRecorder.start(); // Ýazgy prosesini başlatmak

        } catch (err) {
            console.error("Mikrofona girip bilmedik:", err);
            setError("Mikrofona rugsat bermediňiz ýa-da ol elýeterli däl.");
            setIsRecording(false);
        }
    };

    // Ses ýazgysyny tamamlamak
    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            setIsRecording(false);
            setTranscription("Ýazgy tamamlandy. Transkripsiýa üçin garaşyň...");
        }
    };

    // Ses faýlyny Netlify Function-a ugratmak
    const sendAudioToAPI = async (audioBlob) => {
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                // Netlify Functions ses datalaryny almalydyr
                // Biz audioBlob-y göni ugradýarys
                body: audioBlob,
                headers: {
                    'Content-Type': 'audio/webm; codecs=opus'
                    // Hugging Face API açary serverde (Netlify Function-da) gizlin saklanýar
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `API-den ýalňyşlyk: ${response.status}`);
            }

            const data = await response.json();
            setTranscription(data.transcription);
            setError(null);

        } catch (err) {
            console.error("API çagyryş ýalňyşlygy:", err);
            setTranscription("Transkripsiýa ýalňyşlygy.");
            setError(`Ýalňyşlyk: ${err.message}. Netlify Function-yň we API açarynyň işleýändigini barlaň.`);
        }
    };

    // --- Görünýän Komponent ---
    return (
        <div className="App">
            {/* 1. HEADER (Başlyk) */}
            <header className="app-header">
                <h1 className="logo">AI Kömekçi</h1>
                <nav className="nav-menu">
                    <a href="#home">Home</a>
                    <a href="#hub">Kömekçi Hub</a>
                    <a href="#about">About</a>
                </nav>
            </header>

            {/* 2. HERO SECTION (Esasy Bölüm) */}
            <main className="hero-section">
                <h2>AI Multimodal Kömekçi Platformasyna Hoş Geldiňiz</h2>
                <p>Elýeterliligiň täze derejesi: Ses, Görüş we Gest arkaly kömek.</p>
                
                {/* Ýalňyşlyk we Status Habarlary */}
                {error && <div className="status-message error">{error}</div>}
                
                <div className="button-container">
                    {/* ULY DÜWME 1: Sesli Kömek */}
                    <button 
                        className={`main-button speech-button ${isRecording ? 'recording-active' : ''}`}
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={error !== null && !isRecording}
                    >
                        <span role="img" aria-label="Microphone">
                            {isRecording ? '🔴' : '🎤'}
                        </span>
                        <br />
                        {isRecording ? 'Ýazgyny Düzmek...' : 'Sesli Kömek (ASR)'}
                    </button>

                    {/* ULY DÜWME 2: Görüş Kömekçi (Häzirki wagtda işlemeýär) */}
                    <button className="main-button vision-button" onClick={() => alert("Görüş Modulyny soňra goşarys!")}>
                        <span role="img" aria-label="Eye">👁️</span>
                        <br />
                        Görüş Kömekçi (OCR/Düşündiriş)
                    </button>
                </div>
                
                {/* 3. Transkripsiýa Netijesi Bölümi */}
                <div className="transcription-result">
                    <h3>Transkripsiýa Netijesi:</h3>
                    <p className="transcription-text">{transcription}</p>
                </div>
                
            </main>

            {/* 4. FOOTER (Aýak) */}
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
