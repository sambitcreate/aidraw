import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes the drawing canvas to guess what is drawn.
 * @param base64Image The base64 encoded image string from the canvas.
 * @returns A string description of the drawing.
 */
export const analyzeDrawing = async (base64Image: string): Promise<string> => {
  try {
    // Remove the data URL prefix if present to get just the base64 data
    const base64Data = base64Image.replace(/^data:image\/(png|jpeg);base64,/, "");

    const response: GenerateContentResponse = await ai.models.generateContent({
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

    return response.text || "I couldn't quite see what that was. Try drawing it again!";
  } catch (error) {
    console.error("Error analyzing drawing:", error);
    return "Sorry, I had trouble seeing your masterpiece. Please check your connection.";
  }
};
