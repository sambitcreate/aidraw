# AI Agents and Services in AIRDRAW

This document outlines the AI agents and services integrated into the AIRDRAW application.

## Primary AI Agent: Google Gemini

### Service Details
- **Provider**: Google
- **Model**: Gemini 2.5 Flash
- **Service**: Google Generative AI
- **API Library**: @google/genai

### Purpose
The Gemini AI agent serves as the "Art Critic" for the AIRDRAW application, analyzing user drawings and providing enthusiastic, constructive feedback about what the drawing represents.

### Implementation
- **File**: [`services/geminiService.ts`](services/geminiService.ts)
- **Function**: [`analyzeDrawing()`](services/geminiService.ts:10)
- **Authentication**: API key stored in environment variable `API_KEY`

### How It Works
1. When a user clicks the "GUESS DRAWING" button, the canvas content is captured as a base64 PNG image
2. The image is sent to Gemini 2.5 Flash with a specific prompt: "You are an art critic playing Pictionary. Briefly guess what this drawing represents. Be enthusiastic and constructive. Keep it under 30 words."
3. The AI analyzes the visual content and returns a concise, enthusiastic interpretation
4. The result is displayed in a toast notification at the top of the screen

### Configuration
- **Model**: `gemini-2.5-flash`
- **Input Format**: Base64 encoded PNG image
- **Response Format**: Text string (max 30 words)
- **Error Handling**: Returns fallback messages if analysis fails

## Computer Vision Agent: MediaPipe Hand Landmarker

### Service Details
- **Provider**: Google MediaPipe
- **Model**: Hand Landmarker
- **Service**: Computer Vision for hand tracking
- **API Library**: @mediapipe/tasks-vision

### Purpose
The MediaPipe Hand Landmarker enables gesture-based drawing by tracking hand movements through the webcam and detecting pinch gestures for drawing interactions.

### Implementation
- **File**: [`components/VideoCanvas.tsx`](components/VideoCanvas.tsx)
- **Model Path**: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`
- **Delegate**: GPU acceleration
- **Running Mode**: VIDEO (real-time processing)

### How It Works
1. Accesses user's webcam with permission
2. Continuously analyzes video frames to detect hand landmarks
3. Tracks index finger tip position for cursor movement
4. Detects pinch gesture (thumb and index finger proximity) for drawing
5. Maps normalized coordinates to screen space for drawing
6. Provides smooth cursor movement with interpolation

### Configuration
- **Pinch Threshold**: 0.08 (distance between thumb and index finger)
- **Smoothing Factor**: 0.2 (for cursor movement)
- **Max Hands**: 1
- **Hardware Acceleration**: GPU delegate enabled

## Integration Flow

1. **User Interaction**: User makes hand gestures in front of camera
2. **Hand Tracking**: MediaPipe detects hand landmarks and pinch gestures
3. **Drawing**: When pinching, user can draw on the canvas with selected colors and brush sizes
4. **AI Analysis**: User triggers analysis, canvas is sent to Gemini
5. **Feedback**: Gemini returns interpretation displayed in UI

## Environment Setup

### Required Environment Variables
- `API_KEY`: Google Gemini API key for drawing analysis

### Dependencies
- `@google/genai`: For Gemini AI integration
- `@mediapipe/tasks-vision`: For hand tracking

## Future Enhancements

Potential additional AI agents that could be integrated:
1. **Drawing Enhancement AI**: Auto-complete or refine drawings
2. **Style Transfer AI**: Apply artistic styles to drawings
3. **Object Recognition**: More detailed object detection and labeling
4. **Voice Commands**: Add voice-controlled AI assistant
5. **Collaborative AI**: AI that can draw alongside users

## Privacy Considerations

- Webcam feed is processed locally in the browser
- Only canvas images are sent to Gemini for analysis
- No video or personal data is stored or transmitted
- API key should be kept secure and not exposed in client-side code