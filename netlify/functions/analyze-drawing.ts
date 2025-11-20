import type { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

// Server-side API key (not exposed to client)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { imageData } = JSON.parse(event.body || '{}');

    if (!imageData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No image data provided' }),
      };
    }

    // Remove data URL prefix if present
    const base64Data = imageData.replace(/^data:image\/(png|jpeg);base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Data,
            },
          },
          {
            text: "You are an art critic playing Pictionary. Briefly guess what this drawing represents. Be enthusiastic and constructive. Keep it under 30 words.",
          },
        ],
      },
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        result: response.text || "I couldn't quite see what that was. Try drawing it again!",
      }),
    };
  } catch (error) {
    console.error('Error analyzing drawing:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to analyze drawing',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
