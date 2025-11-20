/**
 * Analyzes the drawing canvas to guess what is drawn.
 * Calls the serverless function to keep API key secure.
 * @param base64Image The base64 encoded image string from the canvas.
 * @returns A string description of the drawing.
 */
export const analyzeDrawing = async (base64Image: string): Promise<string> => {
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
    return data.result || "I couldn't quite see what that was. Try drawing it again!";
  } catch (error) {
    console.error("Error analyzing drawing:", error);
    return "Sorry, I had trouble seeing your masterpiece. Please check your connection.";
  }
};
