// frontend/functions/vision-analysis.js
import { HfInference } from '@huggingface/inference';

// Hugging Face API açary Netlify Environment Variables-dan alynýar
const HF_ACCESS_TOKEN = process.env.HF_API_KEY; 
const hf = new HfInference(HF_ACCESS_TOKEN);

// Suraty düşündirmek üçin ulanjak modelimiz (Multimodal Model)
const VLM_MODEL = 'Salesforce/blip-image-captioning-large';

exports.handler = async (event) => {
    // Diňe POST soraglaryny kabul edýär
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Diňe POST rugsat berilýär.' }),
        };
    }

    try {
        // Gelen suraty (body) Blob faýly hökmünde alyň
        const imageBlob = event.body;

        if (!imageBlob) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Surat datasy tapylmady.' }),
            };
        }

        // 1. Suraty Düşündirmek üçin Inference çagyryşy
        const result = await hf.imageToText({
            model: VLM_MODEL,
            data: Buffer.from(imageBlob, event.isBase64Encoded ? 'base64' : 'binary'),
        });

        // 2. Netijäni yzyna gaýtarmak
        const description = result.generated_text;

        return {
            statusCode: 200,
            body: JSON.stringify({ description: description }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        console.error('Vision API ýalňyşlygy:', error);
        
        // Eger Hugging Face API açary nädogry bolsa ýa-da limit dolan bolsa
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Surat analizinde ýalňyşlyk. API açaryny we limiti barlamaly.', 
                details: error.message 
            }),
        };
    }
};
