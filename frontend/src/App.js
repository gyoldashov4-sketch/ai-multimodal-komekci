import React from 'react';
import './App.css'; 

function App() {
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

        <div className="button-container">
          {/* ULY DÜWME 1: Sesli Kömek */}
          <button className="main-button speech-button" onClick={() => alert("Ses Modulyna geç...")}>
            <span role="img" aria-label="Microphone">🎤</span>
            <br />
            Sesli Kömek (ASR/TTS)
          </button>

          {/* ULY DÜWME 2: Görüş Kömekçi */}
          <button className="main-button vision-button" onClick={() => alert("Görüş Modulyna geç...")}>
            <span role="img" aria-label="Eye">👁️</span>
            <br />
            Görüş Kömekçi (OCR/Düşündiriş)
          </button>
        </div>
      </main>

      {/* 3. FOOTER (Aýak) */}
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
