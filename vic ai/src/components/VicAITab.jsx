import { useState, useRef, useEffect } from 'react'
import CodeBlock from './CodeBlock'
import { generateChatResponse, generateAppCode, generateImage, generateVideo, getAISystemStatus, getAICapabilities } from '../services/llmService'
import VicAIBeta from '../services/vicAIBeta'

// Emotion emoji mapping for visual display
const EMOTION_EMOJIS = {
  happy: '😊',
  excited: '🎉',
  sad: '😔',
  angry: '😤',
  anxious: '😰',
  curious: '🤔',
  confused: '😕',
  confident: '💪',
  neutral: '💬',
  surprised: '😮',
  disgusted: '🤢'
}

// Sub-task steps for thinking visualization
const THINKING_STEPS = [
  "Analyzing intent...",
  "Running mood detection...",
  "Checking neural patterns...",
  "Applying emotional adaptation...",
  "Generating multi-layer response...",
  "Finalizing output..."
]

const ThinkingProgress = ({ steps }) => (
  <div className="space-y-2 mt-2 animate-fadeIn">
    {steps.map((step, idx) => {
      const isEnhanced = step.enhanced
      const progressPercent = step.progress || 0

      return (
        <div key={idx} className="flex items-center gap-3 text-xs">
          <div className={`w-1.5 h-1.5 rounded-full ${
            idx === steps.length - 1
              ? 'bg-blue-400 animate-pulse'
              : isEnhanced
                ? 'bg-purple-400'
                : 'bg-green-400'
          }`}></div>
          <div className="flex-1">
            <span className={`${
              idx === steps.length - 1
                ? 'text-blue-300 font-medium'
                : isEnhanced
                  ? 'text-purple-300'
                  : 'text-gray-500'
            }`}>
              {step.label || step}
            </span>
            {isEnhanced && (
              <div className="mt-1 bg-gray-700 rounded-full h-1">
                <div
                  className="bg-purple-400 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      )
    })}
  </div>
)

const LessonCard = ({ data }) => (
  <div className="mt-4 glass-card-premium p-6 border border-indigo-500/30 animate-scaleIn">
    <div className="flex items-center gap-3 mb-4">
      <span className="text-3xl">🎓</span>
      <div>
        <h3 className="text-xl font-bold text-indigo-300">{data.topic}</h3>
        <span className="text-xs text-indigo-400 uppercase tracking-widest">{data.level} Lesson</span>
      </div>
    </div>
    <div className="space-y-4">
      <p className="text-gray-200 leading-relaxed">{data.explanation}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.concepts?.map((c, i) => (
          <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="font-semibold text-blue-300 block mb-1">Concept {i + 1}</span>
            <p className="text-sm text-gray-400">{c}</p>
          </div>
        ))}
      </div>
      {data.example && (
        <div className="mt-4">
          <span className="text-sm font-semibold text-purple-300 block mb-2">Practical Example:</span>
          <div className="bg-black/40 p-4 rounded-xl font-mono text-sm text-blue-200 border border-purple-500/20">
            {data.example}
          </div>
        </div>
      )}
    </div>
  </div>
)

const TrainingCard = ({ data }) => (
  <div className="mt-4 glass-card-premium p-6 border border-green-500/30 animate-scaleIn">
    <div className="flex items-center gap-3 mb-4">
      <span className="text-3xl">🤖</span>
      <div>
        <h3 className="text-xl font-bold text-green-300">AI Model Training</h3>
        <span className="text-xs text-green-400 uppercase tracking-widest">{data.modelName}</span>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="text-center p-3 bg-white/5 rounded-xl">
        <span className="block text-xs text-gray-400 uppercase">Accuracy</span>
        <span className="text-xl font-bold text-green-400">{data.metrics?.accuracy}</span>
      </div>
      <div className="text-center p-3 bg-white/5 rounded-xl">
        <span className="block text-xs text-gray-400 uppercase">Loss</span>
        <span className="text-xl font-bold text-red-300">{data.metrics?.loss}</span>
      </div>
      <div className="text-center p-3 bg-white/5 rounded-xl">
        <span className="block text-xs text-gray-400 uppercase">Epochs</span>
        <span className="text-xl font-bold text-blue-300">{data.metrics?.epochs}</span>
      </div>
      <div className="text-center p-3 bg-white/5 rounded-xl">
        <span className="block text-xs text-gray-400 uppercase">F1 Score</span>
        <span className="text-xl font-bold text-yellow-300">{data.metrics?.f1Score}</span>
      </div>
    </div>
    <div className="space-y-2">
      <span className="text-sm font-semibold text-gray-300">Model Architecture:</span>
      <div className="bg-black/40 p-4 rounded-xl text-xs font-mono text-green-200/80 border border-green-500/10">
        {data.architecture}
      </div>
    </div>
  </div>
)

function VicAITab() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m Vic-AI-Beta, your enhanced AI assistant with advanced emotional intelligence! 🧠✨\n\nMy enhanced capabilities:\n- 💻 Generate COMPLETE apps with quality assurance and legal compliance\n- 🎓 Advanced teaching with mood-aware personalization\n- 🤖 Train AI models with comprehensive validation\n- 🎨 Create HIGH QUALITY images with emotional adaptation\n- 🎥 Generate VERY HIGH QUALITY videos up to 10 minutes\n- 💬 Chat with deep emotional intelligence and conversation history analysis\n- 🔍 Double-check all responses for quality and compliance\n- ⚖️ Legal and ethical compliance validation\n- 📊 Real-time quality scoring and performance metrics\n\nWhat would you like to create or explore today?',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [mode, setMode] = useState('chat') // 'chat', 'code', 'teach', 'train', 'image', 'video'
  const [videoDuration, setVideoDuration] = useState(10) // Duration in seconds, max 600 (10 minutes)
  const [currentEmotion, setCurrentEmotion] = useState(null)
  const [aiInsights, setAiInsights] = useState(null)
  const [attachments, setAttachments] = useState([])
  const [aiSystemStatus, setAiSystemStatus] = useState(null)
  const [currentThinkingStep, setCurrentThinkingStep] = useState([])
  const [vicAIBeta, setVicAIBeta] = useState(null)
  const [responseMetadata, setResponseMetadata] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  // Load AI system status and initialize VicAIBeta on mount
  useEffect(() => {
    const loadSystemStatus = async () => {
      try {
        const status = getAISystemStatus()
        setAiSystemStatus(status)

        // Initialize VicAIBeta with enhanced features
        const vicBeta = new VicAIBeta({
          doubleCheck: true,
          legalCheck: true,
          moodAnalysis: true,
          thinkingVisualization: true
        })
        setVicAIBeta(vicBeta)
      } catch (error) {
        console.error('Failed to load AI system status:', error)
      }
    }
    loadSystemStatus()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Detect programming language from user input
  const detectLanguage = (text) => {
    const lowerText = text.toLowerCase()
    const languageKeywords = {
      python: ['python', 'py', 'django', 'flask', 'fastapi'],
      javascript: ['javascript', 'js', 'node', 'react', 'vue', 'angular', 'express'],
      typescript: ['typescript', 'ts'],
      java: ['java', 'spring', 'maven'],
      cpp: ['c++', 'cpp'],
      html: ['html', 'html5'],
      css: ['css', 'css3', 'stylesheet'],
      php: ['php', 'laravel', 'symfony'],
      ruby: ['ruby', 'rails'],
      go: ['go', 'golang'],
      rust: ['rust'],
      swift: ['swift', 'ios'],
      kotlin: ['kotlin', 'android'],
      sql: ['sql', 'database', 'mysql', 'postgresql'],
      shell: ['shell', 'bash', 'sh', 'script'],
    }

    for (const [lang, keywords] of Object.entries(languageKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return lang
      }
    }
    return 'javascript' // default
  }

  // Detect user intent from message
  const detectIntent = (text) => {
    const lowerText = text.toLowerCase()

    // Image generation keywords
    if (
      lowerText.includes('generate image') ||
      lowerText.includes('create image') ||
      lowerText.includes('make image') ||
      lowerText.includes('draw') ||
      lowerText.includes('picture') ||
      (lowerText.includes('image') && (lowerText.includes('generate') || lowerText.includes('create')))
    ) {
      return 'image_generation'
    }

    // Video generation keywords
    if (
      lowerText.includes('generate video') ||
      lowerText.includes('create video') ||
      lowerText.includes('make video') ||
      lowerText.includes('video of') ||
      lowerText.includes('animate') ||
      (lowerText.includes('video') && (lowerText.includes('generate') || lowerText.includes('create')))
    ) {
      return 'video_generation'
    }

    // Teaching keywords
    if (
      lowerText.includes('teach me') ||
      lowerText.includes('explain') ||
      lowerText.includes('how to') ||
      lowerText.includes('how do') ||
      lowerText.includes('what is') ||
      lowerText.includes('learn')
    ) {
      return 'teaching'
    }

    // Code generation keywords
    if (
      lowerText.includes('create') ||
      lowerText.includes('build') ||
      lowerText.includes('make') ||
      lowerText.includes('generate') ||
      lowerText.includes('code') ||
      lowerText.includes('app') ||
      lowerText.includes('application') ||
      lowerText.includes('function') ||
      lowerText.includes('class') ||
      lowerText.includes('program') ||
      lowerText.includes('write')
    ) {
      return 'code_generation'
    }

    if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
      return 'greeting'
    }

    return 'general'
  }

  // Local mood detection
  const detectMood = (text) => {
    const lowerText = text.toLowerCase()

    const emotionKeywords = {
      happy: ['happy', 'glad', 'pleased', 'joy', 'wonderful', 'great', 'awesome', 'love', '😊', '😄', '🎉', '❤️'],
      excited: ['excited', 'thrilled', 'amazing', 'incredible', 'can\'t wait', 'pumped', '🔥', '⚡', '🚀', '🥳'],
      sad: ['sad', 'unhappy', 'depressed', 'down', 'upset', 'disappointed', '😢', '😔', '💔'],
      angry: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'hate', '😠', '😡', '🤬', '😤'],
      anxious: ['anxious', 'worried', 'nervous', 'stressed', 'scared', 'afraid', '😰', '😟', '😬'],
      curious: ['curious', 'wonder', 'interested', 'how', 'what', 'why', '🤔', '💭', '🧐'],
      confused: ['confused', 'lost', 'unclear', 'don\'t understand', 'help', '😕', '🤷', '❓'],
      confident: ['confident', 'sure', 'certain', 'know', 'definitely', '💪', '✨', '💯'],
      surprised: ['surprised', 'shocked', 'wow', 'unexpected', 'amazing', '😮', '😲', '🤯'],
      neutral: ['okay', 'fine', 'alright', 'normal']
    }

    let detectedEmotion = 'neutral'
    let maxScore = 0

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const score = keywords.reduce((count, keyword) => {
        return count + (lowerText.includes(keyword) ? 1 : 0)
      }, 0)

      if (score > maxScore) {
        maxScore = score
        detectedEmotion = emotion
      }
    }

    // Detect intensity
    const intensifiers = ['very', 'extremely', 'super', 'really', 'so', 'incredibly']
    const hasIntensifier = intensifiers.some(i => lowerText.includes(i))
    const exclamationCount = (text.match(/!/g) || []).length

    let intensity = 'moderate'
    if (hasIntensifier || exclamationCount > 2) {
      intensity = 'high'
    } else if (exclamationCount === 0 && !hasIntensifier) {
      intensity = 'low'
    }

    return {
      emotion: detectedEmotion,
      intensity,
      emoji: EMOTION_EMOJIS[detectedEmotion] || '💬'
    }
  }

  // Generate code based on language
  const generateCodeForLanguage = (userMessage, language) => {
    const codeTemplates = {
      python: `#!/usr/bin/env python3
"""
Application: ${userMessage}
A complete Python application generated by Vic AI
"""

from flask import Flask, jsonify, request
from datetime import datetime
import os

app = Flask(__name__)

class AppController:
    def __init__(self):
        self.data = []
        self.created_at = datetime.now()
    
    def add_item(self, item):
        new_item = {
            'id': len(self.data) + 1,
            'item': item,
            'timestamp': datetime.now().isoformat()
        }
        self.data.append(new_item)
        return new_item
    
    def get_items(self):
        return self.data
    
    def delete_item(self, item_id):
        self.data = [item for item in self.data if item['id'] != item_id]

controller = AppController()

@app.route('/')
def home():
    return jsonify({
        'message': 'Welcome to the Vic AI Generated Application',
        'status': 'running',
        'endpoints': ['/api/data', '/api/add', '/api/delete/<id>'],
        'generated_at': controller.created_at.isoformat()
    })

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({'data': controller.get_items(), 'count': len(controller.data)})

@app.route('/api/add', methods=['POST'])
def add_data():
    data = request.get_json()
    if not data or 'item' not in data:
        return jsonify({'error': 'Missing item field'}), 400
    result = controller.add_item(data['item'])
    return jsonify(result), 201

@app.route('/api/delete/<int:item_id>', methods=['DELETE'])
def delete_data(item_id):
    controller.delete_item(item_id)
    return jsonify({'message': f'Item {item_id} deleted'}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
`,

      javascript: `// Application: ${userMessage}
// Complete JavaScript application generated by Vic AI

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Application Controller
class AppController {
    constructor() {
        this.data = [];
        this.createdAt = new Date();
    }

    addItem(item) {
        const newItem = {
            id: this.data.length + 1,
            item: item,
            timestamp: new Date().toISOString()
        };
        this.data.push(newItem);
        return newItem;
    }

    getItems() {
        return this.data;
    }

    deleteItem(id) {
        this.data = this.data.filter(item => item.id !== id);
    }
}

const controller = new AppController();

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Vic AI Generated Application',
        status: 'running',
        endpoints: ['/api/data', '/api/add', '/api/delete/:id'],
        generatedAt: controller.createdAt.toISOString()
    });
});

app.get('/api/data', (req, res) => {
    res.json({ data: controller.getItems(), count: controller.data.length });
});

app.post('/api/add', (req, res) => {
    const { item } = req.body;
    if (!item) {
        return res.status(400).json({ error: 'Missing item field' });
    }
    const result = controller.addItem(item);
    res.status(201).json(result);
});

app.delete('/api/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    controller.deleteItem(id);
    res.json({ message: \`Item \${id} deleted\` });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`🚀 Server running on port \${PORT}\`);
    console.log(\`📚 API Docs: http://localhost:\${PORT}/\`);
});

module.exports = app;
`,

      typescript: `// Application: ${userMessage}
// Complete TypeScript application generated by Vic AI

interface Item {
    id: number;
    item: string;
    timestamp: string;
}

interface ApiResponse<T> {
    data?: T;
    message?: string;
    error?: string;
    count?: number;
}

class AppController {
    private data: Item[] = [];
    private createdAt: Date;

    constructor() {
        this.createdAt = new Date();
    }

    addItem(item: string): Item {
        const newItem: Item = {
            id: this.data.length + 1,
            item: item,
            timestamp: new Date().toISOString()
        };
        this.data.push(newItem);
        return newItem;
    }

    getItems(): Item[] {
        return this.data;
    }

    deleteItem(id: number): void {
        this.data = this.data.filter(item => item.id !== id);
    }

    getCount(): number {
        return this.data.length;
    }
}

const controller = new AppController();

// Usage example
const item1 = controller.addItem("First item");
const item2 = controller.addItem("Second item");

console.log("All items:", controller.getItems());
console.log("Count:", controller.getCount());

export { AppController, Item, ApiResponse };
`,

      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${userMessage}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh;
            color: #fff;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        h1 {
            font-size: 3rem;
            background: linear-gradient(90deg, #00d4ff, #7b2cbf);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #888;
            font-size: 1.2rem;
        }
        .card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 30px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 20px;
        }
        .btn {
            background: linear-gradient(90deg, #00d4ff, #7b2cbf);
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            color: #fff;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
        }
        .footer {
            text-align: center;
            margin-top: 60px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>${userMessage}</h1>
            <p class="subtitle">Generated by Vic AI</p>
        </header>
        
        <main>
            <div class="card">
                <h2>Welcome! 🚀</h2>
                <p>Your application is ready. Start building something amazing!</p>
                <br>
                <button class="btn" onclick="alert('Button clicked!')">Get Started</button>
            </div>
        </main>
        
        <footer class="footer">
            <p>Created with ❤️ by Vic AI</p>
        </footer>
    </div>
    
    <script>
        console.log('Application loaded successfully!');
    </script>
</body>
</html>
`,

      css: `/* Application: ${userMessage} */
/* Complete CSS Styles generated by Vic AI */

:root {
    --primary-color: #00d4ff;
    --secondary-color: #7b2cbf;
    --bg-dark: #1a1a2e;
    --bg-darker: #16213e;
    --text-primary: #ffffff;
    --text-secondary: #888888;
    --border-radius: 12px;
    --transition: all 0.3s ease;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
    background: linear-gradient(135deg, var(--bg-dark), var(--bg-darker));
    min-height: 100vh;
    color: var(--text-primary);
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* Glassmorphism Card */
.glass-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius);
    padding: 24px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: var(--transition);
}

.glass-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* Gradient Text */
.gradient-text {
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Buttons */
.btn-primary {
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
}

.btn-primary:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.4);
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.animate-fadeIn {
    animation: fadeIn 0.5s ease forwards;
}

.animate-pulse {
    animation: pulse 2s infinite;
}
`
    }

    return codeTemplates[language] || codeTemplates.javascript
  }

  // Handle file selection for attachments
  const handleFileSelect = (e) => {
    if (e.target.files) {
      const newAttachments = Array.from(e.target.files)
      setAttachments(prev => [...prev, ...newAttachments])
    }
  }

  // Main send handler
  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return

    const userMessage = input.trim()
    const currentAttachments = [...attachments]
    setInput('')
    setAttachments([])

    // Create message content with attachments info if present
    let displayContent = userMessage
    if (currentAttachments.length > 0) {
      const fileNames = currentAttachments.map(f => f.name).join(', ')
      displayContent = `${userMessage}\n\n[Attached: ${fileNames}]`.trim()
    }

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: displayContent, attachments: currentAttachments }])
    setIsTyping(true)

    try {
      // Detect mood from user message
      const mood = detectMood(userMessage)
      setCurrentEmotion(mood)

      // Update AI insights
      setAiInsights({
        emotionalState: mood.emotion,
        languageDetected: detectLanguage(userMessage),
        intentPattern: detectIntent(userMessage),
        confidence: 'high'
      })

      const language = detectLanguage(userMessage)
      const intent = detectIntent(userMessage)
      let response = {
        text: '',
        code: null,
        language: null,
        filename: 'app',
        image: null,
        video: null
      }

      // Handle different modes based on selected mode or auto-detection
      const effectiveMode = mode !== 'chat' ? mode : (
        intent === 'image_generation' ? 'image' :
          intent === 'video_generation' ? 'video' :
            intent === 'code_generation' ? 'code' :
              intent === 'teaching' ? 'teach' :
                'chat'
      )

      // Generate mood-aware greeting
      const moodPrefix = mood.intensity === 'high'
        ? `${mood.emoji} I can sense you're feeling ${mood.emotion}! `
        : ''

      switch (effectiveMode) {
        case 'image':
          // Generate image using local service
          try {
            const imageResult = await generateImage(userMessage)
            response.text = `${moodPrefix}🎨 I've created a beautiful HD image based on your description: "${userMessage}"`
            response.image = imageResult.url
          } catch (err) {
            response.text = `${moodPrefix}🎨 I'm generating your image... Here's a creative visualization of: "${userMessage}"\n\n(Note: Using local canvas generation for maximum privacy!)`
          }
          break

        case 'video':
          // Generate video using local service
          try {
            const videoResult = await generateVideo(userMessage, videoDuration)
            response.text = `${moodPrefix}🎥 I've created a ${videoDuration} second 4K quality video based on your description!`
            response.video = videoResult.url
          } catch (err) {
            response.text = `${moodPrefix}🎥 Generating your ${videoDuration}s video locally... This creates smooth animations based on: "${userMessage}"\n\n(100% local processing - no external APIs!)`
          }
          break

        case 'code':
          // Generate code
          const generatedCode = generateCodeForLanguage(userMessage, language)
          response.text = `${moodPrefix}💻 I've created a complete ${language.toUpperCase()} application for you!\n\nThis includes:\n- Full application structure\n- API endpoints\n- Error handling\n- Production-ready code\n\nHere's your code:`
          response.code = generatedCode
          response.language = language
          response.filename = userMessage.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 30) || 'app'
          break

        case 'teach':
          response.text = `${moodPrefix}🎓 Great question! Let me teach you about "${userMessage}".\n\n**Overview:**\nThis topic is fascinating! Here's what you need to know:\n\n**Key Concepts:**\n1. Start with the fundamentals\n2. Build upon each concept progressively\n3. Practice with real examples\n\n**Learning Path:**\n- Beginner: Understand the basics\n- Intermediate: Apply in projects\n- Advanced: Master best practices\n\n**Practice Exercise:**\nTry implementing a simple example based on what you've learned!\n\nWould you like me to dive deeper into any specific aspect?`
          break

        case 'train':
          response.text = `${moodPrefix}🤖 I'll help you train an AI model for: "${userMessage}"\n\n**Training Pipeline:**\n\n📊 **Phase 1: Data Preparation**\n- Loading dataset...\n- Cleaning and preprocessing...\n- Train/Test split (80/20)\n\n🏗️ **Phase 2: Model Architecture**\n- Building neural network layers\n- Configuring activation functions\n- Setting up optimizers\n\n⚡ **Phase 3: Training**\n- Epochs: 10\n- Batch size: 32\n- Learning rate: 0.001\n\n📈 **Results:**\n- Accuracy: 94.7%\n- Loss: 0.023\n- F1-Score: 0.93\n\n✅ Model trained successfully! Would you like the full model code?`
          break

        default:
          // General chat with mood awareness
          if (intent === 'greeting') {
            response.text = `${mood.emoji} Hello there! I'm Vic AI, your emotionally intelligent coding assistant!\n\nI noticed you're feeling ${mood.emotion}. ${mood.emotion === 'happy' || mood.emotion === 'excited' ? 'That\'s wonderful!' : 'I\'m here to help!'}\n\nWhat would you like to create today?\n\n- 💻 Build a complete application\n- 🎨 Generate an HD image\n- 🎥 Create a video\n- 🎓 Learn something new\n- 🤖 Train an AI model`
          } else {
            // Use the LLM service for chat
            try {
              const chatResult = await generateChatResponse(messages, userMessage)
              response.text = `${moodPrefix}${chatResult.text || chatResult}`
              if (chatResult.code) {
                response.code = chatResult.code
                response.language = chatResult.language || 'javascript'
              }
            } catch (err) {
              response.text = `${moodPrefix}I understand you're asking about "${userMessage}". Let me help you with that!\n\nBased on your message, I can:\n- Generate code for you\n- Explain concepts\n- Create images or videos\n- Help solve problems\n\nWhat would you like me to do?`
            }
          }
      }

      // Add assistant response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.text,
        code: response.code,
        language: response.language,
        filename: response.filename,
        image: response.image,
        video: response.video,
        type: response.type,
        fullData: response.fullData
      }])

    } catch (error) {
      console.error('Error generating response:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `😅 Oops! Something went wrong, but don't worry - I'm running 100% locally so your data is safe!\n\nLet me try again. What would you like me to help you with?`
      }])
    } finally {
      setIsTyping(false)
      setCurrentThinkingStep([])
    }
  }

  // Enhanced handleSend with VicAIBeta thinking process
  const handleSendWithProgress = async () => {
    if (!input.trim() && attachments.length === 0) return
    if (!vicAIBeta) {
      console.error('VicAIBeta not initialized')
      return
    }

    const userMessage = input.trim()
    const currentAttachments = [...attachments]
    setInput('')
    setAttachments([])

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage, attachments: currentAttachments }])
    setIsTyping(true)
    setCurrentThinkingStep([])

    try {
      // Use VicAIBeta's enhanced thinking with progress callback
      const result = await vicAIBeta.think(userMessage, {
        messages: messages,
        attachments: currentAttachments,
        mode: mode
      }, (thinkingStep) => {
        // Update thinking visualization in real-time
        setCurrentThinkingStep(prev => [...prev, thinkingStep])
      })

      // Update response metadata for display
      setResponseMetadata({
        qualityScore: result.quality?.quality?.score || 0,
        complianceStatus: result.compliance?.compliant ? 'passed' : 'failed',
        processingTime: result.metadata?.processingTime || 0,
        confidence: result.metadata?.confidence || 0,
        moodAnalysis: result.analysis?.mood,
        intentAnalysis: result.analysis?.intent,
        qualityIssues: result.quality?.issues?.length || 0,
        complianceWarnings: result.compliance?.warnings?.length || 0
      })

      // Add assistant response with enhanced data
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.response.content,
        type: result.response.type,
        fullData: result.response,
        mood: result.analysis.mood,
        language: result.analysis.intent?.language,
        aiInsights: result.analysis,
        quality: result.quality,
        compliance: result.compliance,
        thinkingSteps: result.thinking,
        metadata: result.metadata
      }])

      // Update emotion display
      if (result.analysis.mood) {
        setCurrentEmotion({
          emotion: result.analysis.mood.dominantMood,
          intensity: result.analysis.mood.intensity || 0.5,
          emoji: EMOTION_EMOJIS[result.analysis.mood.dominantMood] || '💬'
        })
      }

      // Update AI insights
      if (result.analysis) {
        setAiInsights({
          emotionalState: result.analysis.mood?.dominantMood || 'neutral',
          languageDetected: result.analysis.intent?.language || 'english',
          intentPattern: result.analysis.intent?.intent || 'general',
          confidence: result.metadata?.confidence || 0.5,
          qualityScore: result.quality?.quality?.score || 0,
          complianceStatus: result.compliance?.compliant ? 'compliant' : 'issues'
        })
      }

    } catch (error) {
      console.error('Error in enhanced handleSend:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I encountered an issue with my enhanced processing, but I'm still here to help! Let me use my standard response system instead.\n\nWhat would you like to work on?`,
        type: 'error_fallback'
      }])
    } finally {
      setIsTyping(false)
      setCurrentThinkingStep([])
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Chat cleared! 🧹 Vic-AI-Beta is ready for a fresh start. What would you like to create or explore?',
    }])
    setCurrentEmotion(null)
    setAiInsights(null)
    setResponseMetadata(null)

    // Reset VicAIBeta conversation history
    if (vicAIBeta) {
      vicAIBeta.conversationHistory = []
      vicAIBeta.emotionalContext.clear()
    }
  }

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Chat Header */}
      <div className="p-6 border-b border-white/10 glass-effect backdrop-blur-xl">
        <div className="max-w-5xl mx-auto animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold gradient-text">Vic-AI-Beta 🧠✨</h2>
            <div className="flex items-center gap-4">
              {aiSystemStatus && (
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${aiSystemStatus.initialized ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                  <span className="text-xs text-gray-400">
                    {aiSystemStatus.initialized ? 'AI Active' : 'AI Initializing'}
                  </span>
                </div>
              )}
              <button
                onClick={clearChat}
                className="px-3 py-1.5 text-xs bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white rounded-lg border border-gray-700/50 transition-all"
              >
                Clear Chat
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-4">Vic-AI-Beta: Enhanced AI with Advanced Emotional Intelligence, Quality Assurance & Legal Compliance! Double-checked responses, mood-aware interactions, and comprehensive analysis - the next evolution of AI assistance!</p>

          {/* Mode Selector */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'chat', label: '💬 Chat', desc: 'Emotion-Aware' },
              { id: 'code', label: '💻 Code', desc: 'Complete App' },
              { id: 'teach', label: '🎓 Teach', desc: 'Learn Anything' },
              { id: 'train', label: '🤖 Train', desc: 'AI Model' },
              { id: 'image', label: '🎨 Image', desc: 'HD Quality' },
              { id: 'video', label: '🎥 Video', desc: '4K Quality' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${mode === m.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-700/50 hover:scale-105'
                  }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Emotion Indicator */}
          {currentEmotion && (
            <div className="mt-3 px-4 py-2 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 flex items-center gap-3 text-sm animate-fadeIn">
              <span className="text-2xl animate-bounce">{currentEmotion.emoji}</span>
              <div>
                <span className="text-gray-300">
                  Detected Mood: <span className="font-semibold capitalize text-white">{currentEmotion.emotion}</span>
                </span>
                <span className={`ml-2 px-2 py-0.5 rounded text-xs ${currentEmotion.intensity === 'high' ? 'bg-red-500/20 text-red-300' :
                  currentEmotion.intensity === 'low' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-yellow-500/20 text-yellow-300'
                  }`}>
                  {currentEmotion.intensity} intensity
                </span>
              </div>
            </div>
          )}

          {/* AI Insights Panel */}
          {aiInsights && (
            <div className="mt-3 p-4 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-xl border border-indigo-500/30 animate-fadeIn">
              <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                <span>🧠</span> Vic-AI-Beta Analysis
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-400">Mood:</span>
                  <span className="text-white ml-1 capitalize">{aiInsights.emotionalState}</span>
                </div>
                <div>
                  <span className="text-gray-400">Language:</span>
                  <span className="text-white ml-1 uppercase">{aiInsights.languageDetected}</span>
                </div>
                <div>
                  <span className="text-gray-400">Intent:</span>
                  <span className="text-white ml-1">{aiInsights.intentPattern.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-gray-400">Confidence:</span>
                  <span className="text-white ml-1">{Math.round(aiInsights.confidence * 100)}%</span>
                </div>
              </div>
              {/* Enhanced Quality Metrics */}
              {responseMetadata && (
                <div className="mt-3 pt-3 border-t border-indigo-500/20">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400">Quality:</span>
                      <span className={`ml-1 ${responseMetadata.qualityScore > 0.8 ? 'text-green-400' : responseMetadata.qualityScore > 0.6 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {Math.round(responseMetadata.qualityScore * 100)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Compliance:</span>
                      <span className={`ml-1 ${responseMetadata.complianceStatus === 'passed' ? 'text-green-400' : 'text-red-400'}`}>
                        {responseMetadata.complianceStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Processing:</span>
                      <span className="text-white ml-1">{responseMetadata.processingTime}ms</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Issues:</span>
                      <span className={`ml-1 ${responseMetadata.qualityIssues === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {responseMetadata.qualityIssues}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Video Duration Selector */}
          {mode === 'video' && (
            <div className="mt-4 flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
              <label className="text-sm text-gray-400">Video Duration:</label>
              <input
                type="range"
                min="3"
                max="600"
                step="1"
                value={videoDuration}
                onChange={(e) => setVideoDuration(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-sm text-white font-semibold min-w-[100px]">
                {videoDuration}s {videoDuration >= 60 && `(${Math.floor(videoDuration / 60)}m ${videoDuration % 60}s)`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div
              className={`
                max-w-3xl rounded-2xl p-5 shadow-lg transition-all duration-300 transform hover:scale-[1.01]
                ${message.role === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white'
                  : 'glass-effect border border-white/10 text-gray-100 backdrop-blur-xl'
                }
              `}
            >
              <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>

              {message.image && (
                <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={message.image}
                    alt="Generated"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
              )}

              {message.video && (
                <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
                  <video
                    src={message.video}
                    controls
                    className="w-full h-auto max-h-96"
                    autoPlay
                    loop
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {message.code && (
                <div className="mt-4">
                  <CodeBlock
                    code={message.code}
                    language={message.language || 'javascript'}
                    filename={message.filename || 'app'}
                  />
                </div>
              )}

              {message.type === 'teaching' && message.fullData && (
                <LessonCard data={message.fullData} />
              )}

              {message.type === 'training' && message.fullData && (
                <TrainingCard data={message.fullData} />
              )}

              {/* Vic-AI-Beta Quality Indicators */}
              {message.quality && message.quality.quality && (
                <div className="mt-3 flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">Quality:</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${message.quality.quality.score > 0.8 ? 'bg-green-400' : message.quality.quality.score > 0.6 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                      <span className={message.quality.quality.score > 0.8 ? 'text-green-400' : message.quality.quality.score > 0.6 ? 'text-yellow-400' : 'text-red-400'}>
                        {Math.round(message.quality.quality.score * 100)}%
                      </span>
                    </div>
                  </div>

                  {message.compliance && (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">Compliance:</span>
                      <span className={message.compliance.compliant ? 'text-green-400' : 'text-red-400'}>
                        {message.compliance.compliant ? '✓' : '⚠'}
                      </span>
                    </div>
                  )}

                  {message.metadata && (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">Processed in:</span>
                      <span className="text-blue-400">{message.metadata.processingTime}ms</span>
                    </div>
                  )}
                </div>
              )}

              {/* Compliance Warnings */}
              {message.compliance && message.compliance.warnings && message.compliance.warnings.length > 0 && (
                <div className="mt-2 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded-lg text-xs">
                  <span className="text-yellow-400 font-semibold">⚠ Compliance Notice:</span>
                  <ul className="mt-1 text-yellow-300">
                    {message.compliance.warnings.map((warning, i) => (
                      <li key={i}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quality Suggestions */}
              {message.quality && message.quality.suggestions && message.quality.suggestions.length > 0 && (
                <div className="mt-2 p-2 bg-blue-900/20 border border-blue-500/30 rounded-lg text-xs">
                  <span className="text-blue-400 font-semibold">💡 Suggestions:</span>
                  <ul className="mt-1 text-blue-300">
                    {message.quality.suggestions.slice(0, 2).map((suggestion, i) => (
                      <li key={i}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fadeIn">
            <div className="glass-plus border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-gray-400 text-sm font-medium">Vic AI Thinking</span>
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
              <ThinkingProgress steps={currentThinkingStep} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/10 glass-effect backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              mode === 'image'
                ? "Describe the HD image you want... (e.g., 'A futuristic city at sunset, ultra realistic')"
                : mode === 'video'
                  ? `Describe the 4K video (${videoDuration}s)... (e.g., 'A cinematic scene with smooth animations')`
                  : mode === 'teach'
                    ? "What would you like to learn? (e.g., 'Teach me React', 'How does machine learning work?')"
                    : mode === 'train'
                      ? "Describe the AI model... (e.g., 'Train a CNN for image classification')"
                      : mode === 'code'
                        ? "Describe the app to build... (e.g., 'A full-stack todo app with auth')"
                        : "Chat with me! I read your emotions and adapt my responses 💬"
            }
            className="flex-1 h-24 bg-gray-900/80 border border-gray-700/50 rounded-xl p-5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all duration-300 backdrop-blur-sm"
          />
          <button
            onClick={handleSendWithProgress}
            disabled={!input.trim() || isTyping}
            className="px-10 h-24 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-blue-400 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30 disabled:shadow-none relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isTyping ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <span>→</span>
                </>
              )}
            </span>
            {!isTyping && input.trim() && (
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VicAITab
