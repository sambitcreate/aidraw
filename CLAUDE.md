# Google Gemini API Configuration Guide

This document provides detailed configuration and setup instructions for integrating Google Gemini AI into the AIRDRAW application.

## Overview

AIRDRAW uses **Google Gemini 2.5 Flash** as its AI analysis engine to interpret user drawings and provide enthusiastic, constructive feedback in the style of a Pictionary game.

## API Details

### Model Information

- **Model Name**: Gemini 2.5 Flash
- **Model ID**: `gemini-2.5-flash`
- **Provider**: Google AI Studio
- **API Version**: Latest (2025)
- **SDK Library**: `@google/genai` v1.30.0

### Key Features

- **Multimodal Input**: Supports text and images
- **Fast Response**: Optimized for quick inference (1-3 seconds)
- **Vision Capabilities**: Advanced image understanding
- **Cost-Effective**: Flash variant optimized for performance/cost balance

## Getting Your API Key

### Step 1: Create Google Account

Ensure you have a Google account. If not, create one at [accounts.google.com](https://accounts.google.com).

### Step 2: Access Google AI Studio

1. Navigate to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Accept the terms of service if prompted

### Step 3: Generate API Key

1. Click **"Create API Key"** button
2. Select or create a Google Cloud project (or use "Quickstart")
3. Copy the generated API key
4. Store it securely - you won't be able to see it again

### Step 4: Configure Environment

Create a `.env.local` file in the project root:

```bash
# .env.local
API_KEY=AIzaSy...your_actual_api_key_here
```

**Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

## Installation

### Install SDK

Using Yarn (recommended):

```bash
yarn add @google/genai
```

Using npm:

```bash
npm install @google/genai
```

### Verify Installation

Check that the package is listed in `package.json`:

```json
{
  "dependencies": {
    "@google/genai": "^1.30.0"
  }
}
```

## Configuration

### Environment Variable Loading

Vite automatically loads environment variables from `.env.local`:

```typescript
// Accessed in code as:
const apiKey = import.meta.env.VITE_API_KEY;
```

**Note**: Current implementation uses `API_KEY` directly (requires Vite config adjustment for production).

### SDK Initialization

The Gemini client is initialized in [services/geminiService.ts](services/geminiService.ts):

```typescript
import { GoogleGenerativeAI } from '@google/genai';

const apiKey = import.meta.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
```

## Usage in AIRDRAW

### Main Function: analyzeDrawing

Located in [services/geminiService.ts](services/geminiService.ts):

```typescript
export async function analyzeDrawing(dataUrl: string): Promise<string> {
  try {
    // Extract base64 image data
    const base64Data = dataUrl.split(',')[1];

    // Create prompt
    const prompt = "You are an art critic playing Pictionary. " +
                   "Briefly guess what this drawing represents. " +
                   "Be enthusiastic and constructive. Keep it under 30 words.";

    // Send to Gemini
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Data
        }
      }
    ]);

    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! I had trouble analyzing your drawing. Please try again!";
  }
}
```

### Request Flow

1. **User Action**: Clicks "GUESS DRAWING" button in UI
2. **Canvas Capture**: Canvas converted to base64 PNG via `canvas.toDataURL("image/png")`
3. **API Call**: `analyzeDrawing()` sends image + prompt to Gemini
4. **Processing**: Gemini analyzes image and generates response
5. **Response**: Text interpretation returned to UI
6. **Display**: Result shown in toast notification

## Prompt Engineering

### Current Prompt

```text
You are an art critic playing Pictionary. Briefly guess what this drawing represents.
Be enthusiastic and constructive. Keep it under 30 words.
```

### Prompt Design Principles

- **Role Definition**: "art critic playing Pictionary" sets the tone
- **Task Clarity**: "guess what this drawing represents" defines the goal
- **Tone Guidance**: "enthusiastic and constructive" ensures positive feedback
- **Length Constraint**: "under 30 words" keeps responses concise

### Customization Ideas

You can modify the prompt for different use cases:

**Educational Mode**:

```text
You are a supportive art teacher. Analyze this drawing and provide
encouragement with specific observations. Keep it under 30 words.
```

**Detailed Analysis**:

```text
Describe this drawing in detail, noting colors, shapes, composition,
and potential subject matter. Be specific and analytical. 50 words max.
```

**Game Mode**:

```text
You're playing Pictionary! Make your best guess at what this drawing is
in 3 words or less. Be confident and fun!
```

## API Limits & Quotas

### Free Tier Limits

As of 2025, Google AI Studio provides:

- **Requests per minute (RPM)**: 15
- **Requests per day (RPD)**: 1,500
- **Tokens per minute (TPM)**: 1 million

### Rate Limiting Handling

The current implementation doesn't explicitly handle rate limits. For production:

```typescript
// Add cooldown between requests
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 4000; // 4 seconds

export async function analyzeDrawing(dataUrl: string): Promise<string> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    return "Please wait a moment before analyzing again!";
  }

  lastRequestTime = now;
  // ... rest of implementation
}
```

### Cost Considerations

Gemini 2.5 Flash pricing (as of 2025):

- **Input**: $0.075 per million tokens
- **Output**: $0.30 per million tokens
- **Images**: Counted as ~258 tokens per image

For typical AIRDRAW usage (small drawings), costs are minimal in development.

## Error Handling

### Common Errors

#### 1. Invalid API Key

```typescript
Error: API key not valid
```

Solution: Verify API key in `.env.local` and restart dev server.

#### 2. Rate Limit Exceeded

```typescript
Error: 429 Too Many Requests
```

Solution: Implement cooldown period between requests.

#### 3. Network Error

```typescript
Error: Failed to fetch
```

Solution: Check internet connection and API endpoint availability.

#### 4. Invalid Image Format

```typescript
Error: Invalid inline data
```

Solution: Ensure canvas data is valid base64 PNG.

### Graceful Degradation

Always provide fallback messages:

```typescript
try {
  return await performAnalysis();
} catch (error) {
  if (error.message.includes('429')) {
    return "Too many requests! Please wait a moment and try again.";
  }
  return "Oops! Something went wrong. Please try again!";
}
```

## Security Best Practices

### Production Recommendations

1. **Never Expose API Keys**
   - Don't commit `.env.local` to git
   - Don't expose keys in client-side code
   - Use server-side proxy for production

2. **Implement Server-Side Proxy**

   ```typescript
   // Instead of calling Gemini directly from browser:
   // client → your-api-server → Gemini

   // Example server endpoint:
   app.post('/api/analyze', async (req, res) => {
     const { imageData } = req.body;
     const result = await analyzeDrawing(imageData);
     res.json({ result });
   });
   ```

3. **Add Request Validation**
   - Verify image size limits
   - Check request frequency per user
   - Sanitize input data

4. **Monitor Usage**
   - Track API calls
   - Set up alerts for quota limits
   - Log errors for debugging

## Testing

### Manual Testing

1. Start dev server: `yarn dev`
2. Draw something on canvas
3. Click "GUESS DRAWING"
4. Verify response appears in toast

### Testing Different Prompts

Modify the prompt in `geminiService.ts` to test variations:

```typescript
const prompts = {
  standard: "You are an art critic...",
  detailed: "Provide detailed analysis...",
  brief: "In 5 words or less..."
};

// Use different prompts for testing
const prompt = prompts.detailed;
```

### Error Simulation

Test error handling by temporarily using an invalid API key:

```bash
# .env.local (for testing only)
API_KEY=invalid_key_for_testing
```

## Performance Optimization

### Tips for Faster Responses

1. **Reduce Image Size**: Downscale canvas before sending
2. **Optimize Prompt**: Shorter prompts = faster processing
3. **Use Flash Model**: Already optimal for speed
4. **Implement Caching**: Cache repeated image analyses (advanced)

### Example: Image Downscaling

```typescript
function downscaleCanvas(canvas: HTMLCanvasElement, maxSize: number = 512) {
  const scale = Math.min(1, maxSize / Math.max(canvas.width, canvas.height));
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width * scale;
  tempCanvas.height = canvas.height * scale;

  const ctx = tempCanvas.getContext('2d');
  ctx?.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

  return tempCanvas.toDataURL('image/png');
}
```

## Troubleshooting

### Issue: "API key not found"

**Cause**: Environment variable not loaded

**Solutions**:

- Verify `.env.local` exists in project root
- Check file name (no typos)
- Restart development server after creating `.env.local`
- Ensure `API_KEY` matches variable name in code

### Issue: Slow responses

**Cause**: Large image size or network latency

**Solutions**:

- Reduce canvas resolution
- Downscale image before sending
- Check network connection
- Consider using compression

### Issue: "Invalid image format"

**Cause**: Canvas data corrupted or invalid

**Solutions**:

- Verify canvas is not empty
- Check `toDataURL()` format is PNG
- Ensure base64 extraction is correct

## Additional Resources

- [Google AI Studio Documentation](https://ai.google.dev/docs)
- [Gemini API Reference](https://ai.google.dev/api/rest)
- [Gemini Pricing](https://ai.google.dev/pricing)
- [Best Practices](https://ai.google.dev/docs/best_practices)
- [Google AI Forum](https://discuss.ai.google.dev/)

## Version Compatibility

- **Gemini API**: v1 (Latest)
- **@google/genai SDK**: v1.30.0 or higher
- **Node.js**: v20 or higher
- **TypeScript**: v5.8 or higher

## Migration Notes

If upgrading from previous Gemini versions:

- Gemini 2.5 Flash replaces earlier Flash models
- API interface remains compatible
- Performance improvements included
- No breaking changes for image analysis

## Support

For Gemini API issues:

- [Google AI Studio Support](https://ai.google.dev/support)
- [GitHub Issues](https://github.com/sambitcreate/aidraw/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/gemini-api)

---

**Last Updated**: November 20, 2025
**Gemini Model**: 2.5 Flash
**SDK Version**: 1.30.0
