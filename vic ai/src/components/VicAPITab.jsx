import { useState, useEffect } from 'react'

function VicAPITab() {
  const [activeSection, setActiveSection] = useState('overview')
  const [copiedCode, setCopiedCode] = useState(null)
  const [apiTesting, setApiTesting] = useState({
    endpoint: 'chat',
    request: '',
    response: null,
    loading: false,
    error: null,
    history: []
  })
  const [systemStatus, setSystemStatus] = useState(null)

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // API Testing Functions
  const testAPI = async () => {
    if (!apiTesting.request.trim()) return

    setApiTesting(prev => ({ ...prev, loading: true, error: null }))

    try {
      const endpoint = apiTesting.endpoint
      let requestBody = {}

      // Build request based on endpoint
      switch (endpoint) {
        case 'chat':
          requestBody = { message: apiTesting.request }
          break
        case 'code':
          requestBody = {
            request: apiTesting.request,
            language: 'javascript'
          }
          break
        case 'teach':
          requestBody = {
            topic: apiTesting.request,
            level: 'beginner'
          }
          break
        default:
          requestBody = { message: apiTesting.request }
      }

      const response = await fetch(`http://localhost:3001/api/ai/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'API request failed')
      }

      // Add to history
      const newEntry = {
        timestamp: new Date().toLocaleTimeString(),
        endpoint,
        request: apiTesting.request,
        response: data,
        status: response.status
      }

      setApiTesting(prev => ({
        ...prev,
        response: data,
        loading: false,
        history: [newEntry, ...prev.history.slice(0, 9)] // Keep last 10
      }))

    } catch (error) {
      setApiTesting(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }))
    }
  }

  const loadSystemStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/health')
      const data = await response.json()
      setSystemStatus(data)
    } catch (error) {
      setSystemStatus({ status: 'offline', error: error.message })
    }
  }

  useEffect(() => {
    loadSystemStatus()
    // Refresh status every 30 seconds
    const interval = setInterval(loadSystemStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const CodeExample = ({ code, language, id, title }) => (
    <div className="relative group">
      {title && <div className="text-xs text-gray-400 mb-2">{title}</div>}
      <pre className="bg-gray-900/80 rounded-xl p-4 overflow-x-auto border border-gray-700/50">
        <code className="text-sm text-gray-300">{code}</code>
      </pre>
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-3 right-3 px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 text-xs text-gray-400 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 border border-gray-600/50"
      >
        {copiedCode === id ? '✓ Copied!' : 'Copy'}
      </button>
    </div>
  )

  const FeatureCard = ({ emoji, title, description, status, color }) => (
    <div className={`p-5 bg-gradient-to-br ${color} rounded-xl border border-opacity-30 hover:scale-105 transition-all duration-300`}>
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-300 mb-3">{description}</p>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        <span className="text-xs text-green-300">{status}</span>
      </div>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-transparent overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full p-8 space-y-8 animate-fadeIn">

        {/* Hero Section */}
        <div className="glass-effect border border-white/10 rounded-3xl p-10 backdrop-blur-xl shadow-2xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
          <div className="relative z-10">
            <div className="text-6xl mb-4">🚀</div>
            <h1 className="text-5xl font-bold gradient-text mb-4">Vic AI Studio</h1>
            <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Your complete AI-powered coding assistant - running <span className="text-green-400 font-semibold">100% locally</span> in your browser with advanced emotional intelligence.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <span className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm">✅ No API Keys Required</span>
              <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm">🔒 Complete Privacy</span>
              <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm">⚡ Instant Responses</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-2 bg-gray-900/50 rounded-2xl border border-gray-700/50 overflow-x-auto">
          {[
            { id: 'overview', label: '📖 Overview' },
            { id: 'features', label: '✨ Features' },
            { id: 'quickstart', label: '🚀 Quick Start' },
            { id: 'examples', label: '💻 Examples' },
            { id: 'api', label: '🔧 Local API' },
            { id: 'testing', label: '🧪 API Testing' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${activeSection === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="glass-effect border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
              <h2 className="text-3xl font-bold gradient-text mb-6">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-black/40 rounded-xl border border-gray-700/50">
                  <div className="text-4xl mb-4">1️⃣</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Describe Your Idea</h3>
                  <p className="text-gray-400">Simply type what you want to build, learn, or create. Our AI understands natural language.</p>
                </div>
                <div className="p-6 bg-black/40 rounded-xl border border-gray-700/50">
                  <div className="text-4xl mb-4">2️⃣</div>
                  <h3 className="text-xl font-semibold text-white mb-2">AI Processes Locally</h3>
                  <p className="text-gray-400">Everything runs in your browser. No data leaves your device. Complete privacy guaranteed.</p>
                </div>
                <div className="p-6 bg-black/40 rounded-xl border border-gray-700/50">
                  <div className="text-4xl mb-4">3️⃣</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Get Instant Results</h3>
                  <p className="text-gray-400">Receive production-ready code, images, videos, or explanations instantly.</p>
                </div>
              </div>
            </div>

            {/* AI Technology Stack */}
            <div className="glass-effect border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
              <h2 className="text-3xl font-bold gradient-text mb-6">🧠 AI Technology Stack</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Neural Pattern Engine', status: 'Active', color: 'blue' },
                  { name: 'Mood Detector', status: 'Active', color: 'purple' },
                  { name: 'Language Analyzer', status: 'Active', color: 'green' },
                  { name: 'Code Generator', status: 'Active', color: 'orange' },
                  { name: 'Image Generator', status: 'Active', color: 'pink' },
                  { name: 'Video Generator', status: 'Active', color: 'cyan' },
                  { name: 'Teaching Engine', status: 'Active', color: 'yellow' },
                  { name: 'Training Simulator', status: 'Active', color: 'red' },
                ].map((tech, i) => (
                  <div key={i} className={`p-4 bg-${tech.color}-900/20 border border-${tech.color}-500/30 rounded-xl`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-xs text-green-300">{tech.status}</span>
                    </div>
                    <span className="text-sm text-white font-medium">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {activeSection === 'features' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="glass-effect border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
              <h2 className="text-3xl font-bold gradient-text mb-6">🌟 All Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureCard
                  emoji="🎭"
                  title="Mood Detection"
                  description="AI detects your emotions from text and adapts responses with empathy and understanding."
                  status="Real-time analysis"
                  color="from-purple-600/20 to-purple-500/20 border-purple-500"
                />
                <FeatureCard
                  emoji="💻"
                  title="Code Generation"
                  description="Generate complete applications in 15+ languages including React, Python, TypeScript, and more."
                  status="Production-ready code"
                  color="from-blue-600/20 to-blue-500/20 border-blue-500"
                />
                <FeatureCard
                  emoji="🎨"
                  title="Image Generation"
                  description="Create HD images up to 1024x1024 using advanced canvas rendering techniques."
                  status="HD quality"
                  color="from-pink-600/20 to-pink-500/20 border-pink-500"
                />
                <FeatureCard
                  emoji="🎥"
                  title="Video Generation"
                  description="Generate smooth animated videos up to 10 minutes with 4K quality local processing."
                  status="Up to 10 minutes"
                  color="from-green-600/20 to-green-500/20 border-green-500"
                />
                <FeatureCard
                  emoji="🎓"
                  title="Teaching Mode"
                  description="Personalized lessons with step-by-step guides, examples, and exercises for any topic."
                  status="Adaptive learning"
                  color="from-yellow-600/20 to-yellow-500/20 border-yellow-500"
                />
                <FeatureCard
                  emoji="🤖"
                  title="AI Training"
                  description="Simulate training neural networks with real metrics, architecture design, and code generation."
                  status="Full simulation"
                  color="from-orange-600/20 to-orange-500/20 border-orange-500"
                />
                <FeatureCard
                  emoji="🌍"
                  title="Multi-Language"
                  description="Detects and responds in multiple human languages including English, Spanish, French, German, and more."
                  status="Auto-detection"
                  color="from-cyan-600/20 to-cyan-500/20 border-cyan-500"
                />
                <FeatureCard
                  emoji="🧠"
                  title="Context Memory"
                  description="Remembers conversation context and learns your preferences for better responses."
                  status="Session-based"
                  color="from-indigo-600/20 to-indigo-500/20 border-indigo-500"
                />
                <FeatureCard
                  emoji="🔒"
                  title="Complete Privacy"
                  description="All processing happens locally. Zero data sent to external servers. Your ideas stay yours."
                  status="100% local"
                  color="from-red-600/20 to-red-500/20 border-red-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Quick Start Section */}
        {activeSection === 'quickstart' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="glass-effect border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
              <h2 className="text-3xl font-bold gradient-text mb-6">🚀 Quick Start Guide</h2>

              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-blue-900/20 to-blue-800/20 rounded-xl border border-blue-500/30">
                  <h3 className="text-xl font-semibold text-blue-300 mb-4 flex items-center gap-2">
                    <span>Step 1:</span> Navigate to Vic AI Tab
                  </h3>
                  <p className="text-gray-300 mb-4">Click on <strong>"Vic AI"</strong> in the bottom navigation to open the AI chat interface.</p>
                  <div className="p-4 bg-black/40 rounded-lg">
                    <span className="text-green-400">💡 Tip:</span> The AI is already active - no setup required!
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-purple-900/20 to-purple-800/20 rounded-xl border border-purple-500/30">
                  <h3 className="text-xl font-semibold text-purple-300 mb-4 flex items-center gap-2">
                    <span>Step 2:</span> Choose Your Mode
                  </h3>
                  <p className="text-gray-300 mb-4">Select what you want to do:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      '💬 Chat - Talk with emotional AI',
                      '💻 Code - Generate apps',
                      '🎓 Teach - Learn anything',
                      '🤖 Train - AI models',
                      '🎨 Image - Create HD images',
                      '🎥 Video - Generate videos'
                    ].map((mode, i) => (
                      <div key={i} className="px-3 py-2 bg-gray-800/50 rounded-lg text-sm text-gray-300">{mode}</div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-green-900/20 to-green-800/20 rounded-xl border border-green-500/30">
                  <h3 className="text-xl font-semibold text-green-300 mb-4 flex items-center gap-2">
                    <span>Step 3:</span> Start Creating!
                  </h3>
                  <p className="text-gray-300 mb-4">Just type naturally and the AI will understand:</p>
                  <CodeExample
                    code={`// Examples of what you can ask:\n\n"Create a React todo app with authentication"\n"Generate an image of a sunset over mountains"\n"Teach me how machine learning works"\n"I'm frustrated with this bug, help me debug"\n"Build a full-stack e-commerce API in Python"`}
                    language="text"
                    id="quickstart-examples"
                    title="Example prompts"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Examples Section */}
        {activeSection === 'examples' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="glass-effect border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
              <h2 className="text-3xl font-bold gradient-text mb-6">💻 Code Examples</h2>

              <div className="space-y-8">
                {/* JavaScript Example */}
                <div className="p-6 bg-black/40 rounded-xl border border-gray-700/50">
                  <h3 className="text-xl font-semibold text-white mb-4">JavaScript / Node.js API</h3>
                  <p className="text-gray-400 mb-4">Ask: "Create an Express.js REST API with CRUD operations"</p>
                  <CodeExample
                    code={`const express = require('express');
const app = express();
app.use(express.json());

let items = [];

// Get all items
app.get('/api/items', (req, res) => {
  res.json({ data: items, count: items.length });
});

// Create item
app.post('/api/items', (req, res) => {
  const item = { id: Date.now(), ...req.body };
  items.push(item);
  res.status(201).json(item);
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
  items = items.filter(i => i.id !== parseInt(req.params.id));
  res.json({ message: 'Deleted' });
});

app.listen(3000, () => console.log('🚀 Running on port 3000'));`}
                    language="javascript"
                    id="js-example"
                  />
                </div>

                {/* Python Example */}
                <div className="p-6 bg-black/40 rounded-xl border border-gray-700/50">
                  <h3 className="text-xl font-semibold text-white mb-4">Python / FastAPI</h3>
                  <p className="text-gray-400 mb-4">Ask: "Build a Python API with FastAPI"</p>
                  <CodeExample
                    code={`from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Vic AI Generated API")

class Item(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

items: List[Item] = []

@app.get("/api/items")
async def get_items():
    return {"data": items, "count": len(items)}

@app.post("/api/items", status_code=201)
async def create_item(item: Item):
    items.append(item)
    return item

@app.delete("/api/items/{item_id}")
async def delete_item(item_id: int):
    items[:] = [i for i in items if i.id != item_id]
    return {"message": "Deleted"}`}
                    language="python"
                    id="py-example"
                  />
                </div>

                {/* React Example */}
                <div className="p-6 bg-black/40 rounded-xl border border-gray-700/50">
                  <h3 className="text-xl font-semibold text-white mb-4">React Component</h3>
                  <p className="text-gray-400 mb-4">Ask: "Create a React component with state management"</p>
                  <CodeExample
                    code={`import React, { useState, useEffect } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, done: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? {...t, done: !t.done} : t));
  };

  return (
    <div className="app">
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} onClick={() => toggleTodo(todo.id)}>
            {todo.done ? '✓ ' : ''}{todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;`}
                    language="jsx"
                    id="react-example"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Section */}
        {activeSection === 'api' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="glass-effect border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
              <h2 className="text-3xl font-bold gradient-text mb-6">🔧 Local AI Services</h2>
              <p className="text-gray-400 mb-6">All AI services run locally in your browser. Here's how to use them programmatically:</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Import Services</h3>
                  <CodeExample
                    code={`// Import local AI services
import { 
  generateChatResponse,
  generateAppCode,
  generateImage,
  generateVideo,
  getAISystemStatus 
} from './services/llmService';`}
                    language="javascript"
                    id="import-services"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Generate Code</h3>
                  <CodeExample
                    code={`// Generate application code
const result = await generateAppCode(
  "Create a todo app with React",
  "javascript"
);
console.log(result.code);`}
                    language="javascript"
                    id="generate-code"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Chat with AI</h3>
                  <CodeExample
                    code={`// Get AI chat response with mood detection
const response = await generateChatResponse(
  previousMessages,
  "I'm excited to learn React!"
);
console.log(response.text);
console.log(response.mood); // { emotion: 'excited', intensity: 'high' }`}
                    language="javascript"
                    id="chat-ai"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Generate Media</h3>
                  <CodeExample
                    code={`// Generate image
const image = await generateImage("A sunset over mountains");
console.log(image.url); // Base64 or blob URL

// Generate video
const video = await generateVideo("Animated particles", 10); // 10 seconds
console.log(video.url);`}
                    language="javascript"
                    id="generate-media"
                  />
                </div>

                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
                  <p className="text-green-300 flex items-center gap-2">
                    <span className="text-xl">✅</span>
                    <span>All services are ready to use! No configuration needed.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Testing Section */}
        {activeSection === 'testing' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="glass-effect border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
              <h2 className="text-3xl font-bold gradient-text mb-6">🧪 Test Vic AI APIs</h2>
              <p className="text-gray-400 mb-6">Test the Vic AI endpoints directly from your browser. All processing happens locally!</p>

              {/* System Status */}
              <div className="mb-6 p-4 bg-black/40 rounded-xl border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-3">System Status</h3>
                {systemStatus ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className={`ml-2 ${systemStatus.status === 'healthy' ? 'text-green-400' : 'text-red-400'}`}>
                        {systemStatus.status || 'unknown'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Uptime:</span>
                      <span className="text-white ml-2">
                        {systemStatus.uptime ? `${Math.floor(systemStatus.uptime / 60)}m ${Math.floor(systemStatus.uptime % 60)}s` : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Memory:</span>
                      <span className="text-white ml-2">
                        {systemStatus.memory ? `${Math.round(systemStatus.memory.heapUsed / 1024 / 1024)}MB` : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Timestamp:</span>
                      <span className="text-white ml-2">
                        {systemStatus.timestamp ? new Date(systemStatus.timestamp).toLocaleTimeString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-yellow-400">Loading system status...</div>
                )}
              </div>

              {/* API Testing Interface */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Request Panel */}
                  <div className="p-6 bg-black/40 rounded-xl border border-gray-700/50">
                    <h3 className="text-xl font-semibold text-white mb-4">API Request</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Endpoint</label>
                        <select
                          value={apiTesting.endpoint}
                          onChange={(e) => setApiTesting(prev => ({ ...prev, endpoint: e.target.value, request: '', response: null, error: null }))}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="chat">💬 Chat</option>
                          <option value="code">💻 Code Generation</option>
                          <option value="teach">🎓 Teaching</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          {apiTesting.endpoint === 'chat' && 'Message'}
                          {apiTesting.endpoint === 'code' && 'Code Request'}
                          {apiTesting.endpoint === 'teach' && 'Topic to Learn'}
                        </label>
                        <textarea
                          value={apiTesting.request}
                          onChange={(e) => setApiTesting(prev => ({ ...prev, request: e.target.value }))}
                          placeholder={
                            apiTesting.endpoint === 'chat' ? 'Hello, how are you feeling today?' :
                            apiTesting.endpoint === 'code' ? 'Create a React todo component' :
                            'Teach me about machine learning'
                          }
                          className="w-full h-24 px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                        />
                      </div>

                      <button
                        onClick={testAPI}
                        disabled={!apiTesting.request.trim() || apiTesting.loading}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                      >
                        {apiTesting.loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Testing API...
                          </div>
                        ) : (
                          '🚀 Test API'
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Response Panel */}
                  <div className="p-6 bg-black/40 rounded-xl border border-gray-700/50">
                    <h3 className="text-xl font-semibold text-white mb-4">API Response</h3>

                    {apiTesting.error && (
                      <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg mb-4">
                        <div className="text-red-400 font-semibold">Error:</div>
                        <div className="text-red-300 mt-1">{apiTesting.error}</div>
                      </div>
                    )}

                    {apiTesting.response ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                          <div className="text-green-400 font-semibold mb-2">✅ Success</div>
                          <div className="text-gray-300 text-sm">
                            <strong>Response:</strong>
                            <div className="mt-2 p-3 bg-black/40 rounded border font-mono text-sm text-blue-200">
                              {typeof apiTesting.response.response === 'string'
                                ? apiTesting.response.response
                                : JSON.stringify(apiTesting.response.response, null, 2)
                              }
                            </div>
                          </div>

                          {apiTesting.response.metadata && (
                            <div className="mt-3 pt-3 border-t border-green-500/20">
                              <div className="text-xs text-gray-400 mb-1">Metadata:</div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {Object.entries(apiTesting.response.metadata).map(([key, value]) => (
                                  <div key={key}>
                                    <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                    <span className="text-white ml-1">{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : !apiTesting.loading && (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">🎯</div>
                        <div>Enter a request and click "Test API" to see Vic AI in action!</div>
                      </div>
                    )}

                    {apiTesting.loading && (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="text-blue-400">Vic AI is processing your request...</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Request History */}
                {apiTesting.history.length > 0 && (
                  <div className="p-6 bg-black/40 rounded-xl border border-gray-700/50">
                    <h3 className="text-xl font-semibold text-white mb-4">Request History</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {apiTesting.history.map((entry, index) => (
                        <div key={index} className="p-3 bg-gray-800/30 rounded-lg border border-gray-600/30">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">{entry.timestamp}</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                entry.endpoint === 'chat' ? 'bg-blue-500/20 text-blue-300' :
                                entry.endpoint === 'code' ? 'bg-green-500/20 text-green-300' :
                                'bg-purple-500/20 text-purple-300'
                              }`}>
                                {entry.endpoint.toUpperCase()}
                              </span>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              entry.status < 400 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                              {entry.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-300 mb-1">
                            <strong>Request:</strong> {entry.request}
                          </div>
                          <div className="text-sm text-gray-400">
                            <strong>Response:</strong> {typeof entry.response.response === 'string'
                              ? entry.response.response.substring(0, 100) + (entry.response.response.length > 100 ? '...' : '')
                              : 'Complex response'
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Status */}
        <div className="glass-effect border border-white/10 rounded-2xl p-6 backdrop-blur-xl text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-green-300 font-semibold">All Systems Operational</span>
          </div>
          <p className="text-gray-400 text-sm">Vic AI Studio v1.0 • Running 100% Locally • No External APIs</p>
        </div>

      </div>
    </div>
  )
}

export default VicAPITab
