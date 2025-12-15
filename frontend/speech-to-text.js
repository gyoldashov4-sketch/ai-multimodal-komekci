// Netlify Functions bilen Hugging Face Inference API-ny çagyrmak
const fetch = require('node-fetch');

// Hugging Face API URL-i (Türkmen dili modeli)
const API_URL = "https://api-inference.huggingface.co/models/Sunbird/asr-whisper-large-v3-salt";

// Backend funksiýasy (Netlify tarapyndan awtomatiki ýerleşdirilýär)
exports.handler = async (event) => {
    
    // API Açaryny Daşky Gurşaw Üýtgeýjisinden (Netlify-dan) al
    const HUGGING_FACE_API_KEY = process.env.HF_API_KEY;

    if (!HUGGING_FACE_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "HF_API_KEY daşky gurşawda sazlanmady." }),
        };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Diňe POST rugsat berilýär' };
    }

    try {
        // Ses faýlyny (base64 görnüşinde) Body-dan alyň
        const audioBuffer = Buffer.from(event.body, 'base64');

        // Hugging Face API-na sorag ibermek
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
                "Content-Type": "audio/webm; codecs=opus" // Wajyp: Netlify audio faýl hökmünde tanamalydyr
            },
            body: audioBuffer,
        });

        if (!response.ok) {
            // Hugging Face ýalňyşlyk berse
            const errorText = await response.text();
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `Hugging Face API-den Ýalňyşlyk: ${errorText}` }),
            };
        }

        const result = await response.json();
        
        // Netijäni Frontend-e gaýtarmak
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                transcription: result[0]?.text || 'Transkript tapylmady.',
            }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Funksiýany işlemekde kynçylyk: " + error.message }),
        };
    }
};
