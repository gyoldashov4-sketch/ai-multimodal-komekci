// frontend/functions/speech-to-text.js

import { HfInference } from '@huggingface/inference';

// Hugging Face API açary Netlify Environment Variables-dan alynýar
const HF_ACCESS_TOKEN = process.env.HF_API_KEY; 
const hf = new HfInference(HF_ACCESS_TOKEN);

// Türkmen dili üçin uly ASR modeli
const ASR_MODEL = 'Turkmen-ASR/wav2vec2-large-xlsr-turkish-Turkmen-mixed';

exports.handler = async (event) => {
    // Diňe POST soraglaryny kabul etmeli
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Diňe POST rugsat berilýär.' }),
        };
    }

    try {
        // Gelen ses faýlyny (event.body) alyň
        const audioBlob = event.body;

        if (!audioBlob) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Ses faýly tapylmady.' }),
            };
        }

        // 1. Suraty Düşündirmek üçin Inference çagyryşy
        const result = await hf.automaticSpeechRecognition({
            model: ASR_MODEL,
            data: Buffer.from(audioBlob, event.isBase64Encoded ? 'base64' : 'binary'),
        });

        // 2. Netijäni yzyna gaýtarmak
        const transcription = result.text;

        return {
            statusCode: 200,
            body: JSON.stringify({ transcription: transcription }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        console.error('ASR API ýalňyşlygy:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Ses transkripsiýasynda ýalňyşlyk.', 
                details: error.message 
            }),
        };
    }
};
