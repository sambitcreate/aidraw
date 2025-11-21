/**
 * Enhances the drawing canvas by sending it to the serverless function that
 * calls Gemini image generation. Returns a data URL for the improved artwork.
 * @param base64Image The base64 encoded image string from the canvas.
 * @returns A base64 data URL of the enhanced drawing, or null if generation fails.
 */
export const enhanceDrawing = async (base64Image: string): Promise<string | null> => {
  try {
    const response = await fetch('/.netlify/functions/analyze-drawing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData: base64Image,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return typeof data.image === 'string' ? data.image : null;
  } catch (error) {
    console.error("Error analyzing drawing:", error);
    return null;
  }
};
