# Vic AI Studio

A modern, sleek AI-powered development studio with **100% local processing** - no external APIs, no API keys, complete privacy!

## ✨ Features

- **Build Tab**: Generate complete full-stack projects from simple ideas using advanced local AI engine
- **Projects Tab**: Manage and preview all your generated projects with live preview
- **Vic-AI-Beta Tab**: Enhanced AI chat assistant with advanced emotional intelligence, quality assurance, and legal compliance - codes entire apps, generates images/videos, and provides double-checked responses
- **Vic API Tab**: Learn about local AI features and optional API key generation for integrations
- **Settings Tab**: Manage your account and preferences

## 🚀 Local AI Engine

Vic AI Studio runs **100% locally in your browser** - no external APIs required!

- **Complete Privacy**: All processing happens on your device, nothing sent to external servers
- **Instant Results**: No API wait times or rate limits
- **Production Ready**: Generate enterprise-grade code with best practices
- **Multi-language Support**: Python, JavaScript, TypeScript, React, and more
- **Image Generation**: Create beautiful, high-quality images from text
- **Video Generation**: Generate animated videos up to 10 minutes long

## 🧠 Vic-AI-Beta: Enhanced AI System

Vic-AI-Beta represents the next evolution of AI assistance with advanced emotional intelligence and quality assurance:

### Enhanced Capabilities

- **Emotional Intelligence**: Analyzes conversation history to understand user mood and emotional patterns
- **Quality Assurance**: Double-checks all responses for errors, inconsistencies, and quality issues
- **Legal Compliance**: Validates content for ethical guidelines and legal compliance
- **Personalized Responses**: Adapts communication style based on detected emotions and user preferences
- **Advanced Analytics**: Provides real-time quality scoring and performance metrics

### How Vic-AI-Beta Works

1. **Multi-Layered Analysis**: Processes input through emotional, contextual, and intent analysis layers
2. **Quality Assurance Pipeline**: Applies three-stage validation (syntax, logic, compliance)
3. **Mood-Aware Generation**: Generates responses adapted to user's emotional state
4. **Continuous Learning**: Improves responses based on conversation history and user feedback

### API Testing & Integration

Vic AI Studio includes a built-in API testing interface where you can:

- **Test Endpoints**: Directly test `/api/ai/chat`, `/api/ai/code`, and `/api/ai/teach` endpoints
- **View Responses**: See real-time VicAIBeta responses with quality scores and compliance status
- **Monitor System**: Check system status, processing times, and performance metrics
- **Request History**: View past API calls and responses

#### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/chat` | POST | Enhanced chat with emotional intelligence |
| `/api/ai/code` | POST | Code generation with quality assurance |
| `/api/ai/teach` | POST | Teaching content with personalization |
| `/health` | GET | System status and metrics |

#### Example API Call

```javascript
// Chat endpoint
fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello, I need help with React!',
    context: { mood: 'excited' }
  })
})
.then(res => res.json())
.then(data => {
  console.log('Vic AI Response:', data.response)
  console.log('Quality Score:', data.metadata.qualityScore)
  console.log('Processing Time:', data.metadata.processingTime + 'ms')
})
```

### Original How It Works

1. **Local Processing**: All AI features run directly in your browser using advanced JavaScript engines
2. **Pattern-Based Intelligence**: Sophisticated pattern matching, template systems, and algorithmic generation
3. **Production Quality**: Generated code follows industry best practices with error handling and security

## 🎯 Key Features

### Code Generation
- Generate complete applications from scratch
- Full-stack support (frontend, backend, middleware)
- Production-ready code with error handling
- Security best practices included
- Multiple languages: JavaScript, Python, TypeScript, React, and more

### Image Generation
- High-resolution image creation (up to 1024x1024)
- Custom art styles and color schemes
- Instant generation
- Beautiful gradient backgrounds and patterns

### Video Generation
- Generate videos up to 10 minutes long
- Smooth animations and transitions
- Custom frame-by-frame generation
- High-quality output

### AI Chat Assistant
- Natural language conversations
- Code explanations and help
- Technical question answering
- Instant responses

## 🏁 Getting Started

### Using Vic AI as a Package

Vic AI can be used as a standalone npm package in your projects:

```bash
npm install vic-ai
```

#### Quick Usage

```javascript
// ES Modules
import { chat, generateCode, teach, createVicAI } from 'vic-ai'

// Quick chat
const response = await chat('Hello, how are you?')
console.log(response)

// Generate code
const code = await generateCode('Create a React todo component', 'javascript')
console.log(code)

// Advanced usage with VicAIBeta
const vicAI = await createVicAI({
  doubleCheck: true,
  legalCheck: true,
  moodAnalysis: true
})

const result = await vicAI.think('Create a beautiful login form')
console.log(result.response.content)
```

#### React Components

```jsx
import { VicAITab, VicAPITab } from 'vic-ai'

function MyApp() {
  return (
    <div>
      <VicAITab />
      <VicAPITab />
    </div>
  )
}
```

#### Server Integration

```javascript
import { aiRoutes } from 'vic-ai'
import express from 'express'

const app = express()
app.use('/api/ai', aiRoutes)
```

### Development Setup

If you want to develop or run the full Vic AI Studio:

#### Installation

```bash
npm install
```

#### Development

```bash
npm run dev
```

#### Start Server Only

```bash
npm run start:server
```

#### Build

```bash
npm run build
```

#### Preview Production Build

```bash
npm run preview
```

#### Run Tests

```bash
npm test
```

## 🛠️ Tech Stack

- **React 18** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **LocalStorage** - Local data persistence
- **Canvas API** - Local image and video generation
- **Web Workers** - Background processing (planned)

## 📁 Project Structure

```
src/
  ├── components/
  │   ├── BuildTab.jsx        # Project generation interface
  │   ├── ProjectsTab.jsx     # Project management
  │   ├── VicAITab.jsx        # AI chat, image, and video generation
  │   ├── VicAPITab.jsx       # Local AI info and features
  │   ├── SettingsTab.jsx     # User settings
  │   ├── SignUp.jsx          # Authentication
  │   ├── LivePreview.jsx     # Code preview component
  │   └── CodeViewer.jsx      # File code viewer
  ├── services/
  │   ├── llmService.js       # Local AI engine (built from scratch)
  │   ├── authService.js      # Authentication service
  │   └── cryptoService.js    # Encryption utilities
  ├── App.jsx                 # Main application component
  ├── main.jsx                # Application entry point
  └── index.css               # Global styles
```

## 🔒 Privacy & Security

- **100% Local**: All processing happens in your browser
- **No Data Collection**: Nothing is sent to external servers
- **Encrypted Storage**: User data stored securely in browser
- **No External Dependencies**: No third-party API calls

## 🌟 Why Local AI?

- ✅ Complete privacy - your data never leaves your device
- ✅ No API costs or rate limits
- ✅ Works offline (after initial load)
- ✅ Instant responses
- ✅ No configuration needed
- ✅ Zero external dependencies

## 📝 License

MIT License - Feel free to use and modify as needed!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

Built with ❤️ using React and local AI processing
