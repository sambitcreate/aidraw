# AIRDRAW - AI-Powered Gesture Drawing Canvas

AIRDRAW is an innovative web application that combines computer vision with AI to create a unique drawing experience. Use hand gestures to draw on a virtual canvas, then let AI analyze your artwork!

## Features

- **Gesture-Based Drawing**: Use hand tracking to draw with pinch gestures
- **Real-Time Hand Tracking**: Powered by Google MediaPipe for smooth cursor movement
- **AI Art Analysis**: Google Gemini AI analyzes and interprets your drawings
- **Color Palette**: Choose from vibrant neon colors for your artwork
- **Adjustable Brush Sizes**: Multiple brush sizes for different drawing styles
- **Desktop Experience**: Optimized for desktop browsers with webcam support

## How It Works

1. **Allow Camera Access**: The app requests permission to access your webcam
2. **Hand Tracking**: MediaPipe detects your hand movements and tracks your index finger
3. **Pinch to Draw**: Make a pinch gesture (thumb and index finger together) to draw
4. **Create Art**: Move your hand while pinching to draw on the canvas
5. **AI Analysis**: Click "GUESS DRAWING" to have AI analyze your creation

## Technology Stack

- **Frontend**: React with TypeScript
- **Computer Vision**: Google MediaPipe Hand Landmarker
- **AI Analysis**: Google Gemini 2.5 Flash
- **Build Tool**: Vite
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js (version 18 or higher)
- A desktop device with a webcam
- Google Gemini API key

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sambitcreate/aidraw.git
   cd aidraw
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```
   API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

## API Setup

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key and add it to your `.env.local` file

## Project Structure

```
aidraw/
├── components/
│   ├── VideoCanvas.tsx    # Main canvas with hand tracking
│   └── Toolbar.tsx        # UI controls for colors and actions
├── services/
│   └── geminiService.ts   # AI analysis service
├── types.ts               # TypeScript type definitions
├── App.tsx               # Main application component
├── AGENTS.md             # AI agents documentation
└── netlify.toml          # Deployment configuration
```

## Deployment

The app is configured for easy deployment to Netlify:

1. Connect your repository to Netlify
2. Set the `API_KEY` environment variable in Netlify's dashboard
3. Deploy - Netlify will automatically build and deploy your app

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

**Note**: Mobile devices are not supported due to the requirement for precise hand tracking and webcam positioning.

## Privacy

- Webcam feed is processed locally in your browser
- Only canvas images are sent to Gemini for analysis
- No video or personal data is stored or transmitted

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Google MediaPipe](https://mediapipe.dev/) for hand tracking technology
- [Google Gemini](https://ai.google.dev/) for AI analysis capabilities
- [Vite](https://vitejs.dev/) for the build tool
- [React](https://reactjs.org/) for the UI framework

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/sambitcreate/aidraw/issues) on GitHub.
