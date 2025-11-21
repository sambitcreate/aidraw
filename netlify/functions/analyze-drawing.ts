import type { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

// Server-side API key (not exposed to client)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const enhancementPrompt = `You are a professional illustrator. Transform the provided sketch into a polished, realistic or artistically stylized image while preserving the subject, proportions, and core shapes. Keep the background clean with subtle depth, avoid text or captions, and deliver a single finished artwork ready for saving.`;

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
      model: 'gemini-2.0-flash-nano-banana-001',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'image/png',
                data: base64Data,
              },
            },
            {
              text: enhancementPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'image/png',
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData?.data
    )?.inlineData;

    if (!imagePart?.data) {
      throw new Error('Gemini did not return an image payload');
    }

    const dataUrl = `data:${imagePart.mimeType || 'image/png'};base64,${imagePart.data}`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: dataUrl,
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
