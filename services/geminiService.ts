/**
 * Enhances the drawing canvas and returns a Gemini-upscaled image.
 * Calls the serverless function to keep API key secure.
 * @param base64Image The base64 encoded image string from the canvas.
 * @returns A base64 encoded enhanced image the user can save.
 */
export const enhanceDrawing = async (base64Image: string): Promise<string> => {
  const candidates: string[] = [];

  // 1) Explicit override for local dev flexibility
  const envOrigin =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FUNCTIONS_ORIGIN) ||
    (typeof process !== 'undefined' && process.env?.VITE_FUNCTIONS_ORIGIN);
  if (envOrigin) candidates.push(envOrigin);

  // 2) Same-origin first (works in production / Netlify Dev)
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    const currentOrigin = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
    candidates.push(currentOrigin);

    // 3) Common local Netlify/Functions ports
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      candidates.push('http://localhost:8888');   // Netlify Dev default
      candidates.push('http://127.0.0.1:8888');
      candidates.push('http://localhost:9999');    // netlify functions:serve default
      candidates.push('http://127.0.0.1:9999');
      candidates.push('http://localhost:3001');    // Netlify Dev when main site port overridden to 3000
      candidates.push('http://127.0.0.1:3001');
    }
  }

  // Deduplicate candidates
  const uniqueCandidates = Array.from(new Set(candidates.filter(Boolean)));
  const errors: string[] = [];

  for (const origin of uniqueCandidates) {
    try {
      const response = await fetch(`${origin}/.netlify/functions/analyze-drawing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: base64Image }),
      });

      if (!response.ok) {
        errors.push(`${origin} -> HTTP ${response.status}`);
        continue;
      }

      const data = await response.json();
      return data.enhancedImage || '';
    } catch (err) {
      errors.push(`${origin} -> ${(err as Error).message}`);
      continue;
    }
  }

  console.error('Error enhancing drawing. Tried:', errors.join(' | '));
  console.warn(
    'Make sure a Netlify functions server is running. Quick fix: run `yarn dev` (Netlify Dev) or set VITE_FUNCTIONS_ORIGIN to your functions URL.'
  );
  return '';
};
