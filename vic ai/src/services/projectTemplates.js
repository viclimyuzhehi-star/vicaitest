// ============================================================================
// PROJECT TEMPLATES - One-Click Starter Templates
// Pre-built templates for beginners and rapid prototyping
// ============================================================================

export const PROJECT_TEMPLATES = {
  'ai-chatbot': {
    name: 'AI Chatbot Starter',
    description: 'A complete AI-powered chatbot with React frontend and Node.js backend',
    icon: '🤖',
    category: 'fullstack',
    language: 'javascript',
    structure: {
      frontend: {
        'src/App.jsx': `import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\\'m your AI assistant. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Could not connect to server' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={\`message \${msg.role}\`}>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App`,
        'src/App.css': `.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
}

.message {
  margin-bottom: 16px;
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
}

.message.user .message-content {
  background: #007bff;
  color: white;
}

.message.assistant .message-content {
  background: white;
  color: #333;
}

.input-area {
  display: flex;
  gap: 10px;
  padding: 20px 0;
}

.input-area input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 24px;
  font-size: 16px;
}

.input-area button {
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-size: 16px;
}

.input-area button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}`,
        'package.json': JSON.stringify({
          name: 'ai-chatbot',
          version: '1.0.0',
          private: true,
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0'
          },
          scripts: {
            start: 'react-scripts start',
            build: 'react-scripts build'
          }
        }, null, 2)
      },
      backend: {
        'server.js': `const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

// Simple AI chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body
  
  // Simulate AI response (replace with actual AI model)
  const responses = [
    "That's interesting! Tell me more.",
    "I understand. How can I help you with that?",
    "Great question! Let me think about that...",
    "Thanks for sharing! What else would you like to know?"
  ]
  
  const response = responses[Math.floor(Math.random() * responses.length)]
  
  setTimeout(() => {
    res.json({ response })
  }, 500)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`)
})`,
        'package.json': JSON.stringify({
          name: 'ai-chatbot-backend',
          version: '1.0.0',
          dependencies: {
            express: '^4.18.2',
            cors: '^2.8.5'
          },
          scripts: {
            start: 'node server.js',
            dev: 'nodemon server.js'
          }
        }, null, 2)
      }
    }
  },

  'fullstack-auth': {
    name: 'Fullstack Auth App',
    description: 'Complete authentication system with React frontend and Express backend',
    icon: '🔐',
    category: 'fullstack',
    language: 'javascript',
    structure: {
      frontend: {
        'src/App.jsx': `import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetch('http://localhost:3001/api/me', {
        headers: { 'Authorization': \`Bearer \${token}\` }
      })
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => localStorage.removeItem('token'))
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const endpoint = isLogin ? '/api/login' : '/api/register'
    
    const res = await fetch(\`http://localhost:3001\${endpoint}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    const data = await res.json()
    if (data.token) {
      localStorage.setItem('token', data.token)
      setUser(data.user)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  if (user) {
    return (
      <div className="app">
        <div className="dashboard">
          <h1>Welcome, {user.email}!</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="auth-container">
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  )
}

export default App`,
        'src/App.css': `.app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-container {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
}

.auth-container h1 {
  margin-bottom: 24px;
  text-align: center;
}

.auth-container form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-container input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.auth-container button {
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.auth-container p {
  margin-top: 16px;
  text-align: center;
  color: #667eea;
  cursor: pointer;
}

.dashboard {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}`,
        'package.json': JSON.stringify({
          name: 'fullstack-auth',
          version: '1.0.0',
          private: true,
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0'
          },
          scripts: {
            start: 'react-scripts start',
            build: 'react-scripts build'
          }
        }, null, 2)
      },
      backend: {
        'server.js': `const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const app = express()

app.use(cors())
app.use(express.json())

const JWT_SECRET = 'your-secret-key'
const users = []

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = { id: users.length + 1, email, password: hashedPassword }
  users.push(user)
  const token = jwt.sign({ userId: user.id, email }, JWT_SECRET)
  res.json({ token, user: { id: user.id, email } })
})

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  const user = users.find(u => u.email === email)
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  const token = jwt.sign({ userId: user.id, email }, JWT_SECRET)
  res.json({ token, user: { id: user.id, email } })
})

app.get('/api/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = users.find(u => u.id === decoded.userId)
    res.json({ user: { id: user.id, email: user.email } })
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`)
})`,
        'package.json': JSON.stringify({
          name: 'fullstack-auth-backend',
          version: '1.0.0',
          dependencies: {
            express: '^4.18.2',
            cors: '^2.8.5',
            jsonwebtoken: '^9.0.0',
            bcryptjs: '^2.4.3'
          },
          scripts: {
            start: 'node server.js',
            dev: 'nodemon server.js'
          }
        }, null, 2)
      }
    }
  },

  'todo-react': {
    name: 'Todo List React',
    description: 'Classic todo app with React, local storage, and beautiful UI',
    icon: '✅',
    category: 'frontend',
    language: 'javascript',
    structure: {
      frontend: {
        'src/App.jsx': `import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('todos')
    if (saved) setTodos(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (!input.trim()) return
    setTodos([...todos, { id: Date.now(), text: input, done: false }])
    setInput('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div className="app">
      <div className="container">
        <h1>✨ My Todos</h1>
        <div className="input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new todo..."
          />
          <button onClick={addTodo}>Add</button>
        </div>
        <div className="todos">
          {todos.map(todo => (
            <div key={todo.id} className={\`todo \${todo.done ? 'done' : ''}\`}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
              <button onClick={() => deleteTodo(todo.id)}>×</button>
            </div>
          ))}
        </div>
        {todos.length === 0 && (
          <p className="empty">No todos yet. Add one above!</p>
        )}
      </div>
    </div>
  )
}

export default App`,
        'src/App.css': `.app {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.input-area {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.input-area input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.input-area button {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.todos {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 6px;
}

.todo.done span {
  text-decoration: line-through;
  opacity: 0.6;
}

.todo input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.todo span {
  flex: 1;
}

.todo button {
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 20px;
}

.empty {
  text-align: center;
  color: #999;
  margin-top: 20px;
}`,
        'package.json': JSON.stringify({
          name: 'todo-react',
          version: '1.0.0',
          private: true,
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0'
          },
          scripts: {
            start: 'react-scripts start',
            build: 'react-scripts build'
          }
        }, null, 2)
      }
    }
  },

  'game-starter': {
    name: 'Game Starter (JS)',
    description: 'Simple game framework with HTML5 Canvas',
    icon: '🎮',
    category: 'frontend',
    language: 'javascript',
    structure: {
      frontend: {
        'index.html': `<!DOCTYPE html>
<html>
<head>
  <title>Game Starter</title>
  <style>
    body {
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #1a1a2e;
    }
    canvas {
      border: 2px solid #fff;
      background: #0f0f1e;
    }
  </style>
</head>
<body>
  <canvas id="gameCanvas"></canvas>
  <script src="game.js"></script>
</body>
</html>`,
        'game.js': `const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

canvas.width = 800
canvas.height = 600

let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  speed: 5,
  color: '#00ff00'
}

let keys = {}

document.addEventListener('keydown', (e) => {
  keys[e.key] = true
})

document.addEventListener('keyup', (e) => {
  keys[e.key] = false
})

function update() {
  if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed
  if (keys['ArrowRight'] || keys['d']) player.x += player.speed
  if (keys['ArrowUp'] || keys['w']) player.y -= player.speed
  if (keys['ArrowDown'] || keys['s']) player.y += player.speed
  
  // Boundary check
  player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x))
  player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y))
}

function draw() {
  // Clear canvas
  ctx.fillStyle = '#0f0f1e'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Draw player
  ctx.beginPath()
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2)
  ctx.fillStyle = player.color
  ctx.fill()
  
  // Draw instructions
  ctx.fillStyle = '#fff'
  ctx.font = '16px Arial'
  ctx.fillText('Use WASD or Arrow Keys to move', 10, 30)
}

function gameLoop() {
  update()
  draw()
  requestAnimationFrame(gameLoop)
}

gameLoop()`
      }
    }
  },

  'python-automation': {
    name: 'Python Automation Starter',
    description: 'Template for automating tasks with Python',
    icon: '🐍',
    category: 'backend',
    language: 'python',
    structure: {
      backend: {
        'main.py': `#!/usr/bin/env python3
"""
Python Automation Starter
A template for building automation scripts
"""

import os
import json
from datetime import datetime
import requests

class AutomationTool:
    def __init__(self):
        self.logs = []
    
    def log(self, message):
        """Log a message with timestamp"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {message}"
        self.logs.append(log_entry)
        print(log_entry)
    
    def process_file(self, filepath):
        """Process a file (example function)"""
        try:
            if os.path.exists(filepath):
                self.log(f"Processing file: {filepath}")
                # Add your file processing logic here
                return True
            else:
                self.log(f"File not found: {filepath}")
                return False
        except Exception as e:
            self.log(f"Error processing file: {e}")
            return False
    
    def fetch_data(self, url):
        """Fetch data from URL (example function)"""
        try:
            self.log(f"Fetching data from: {url}")
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            self.log(f"Error fetching data: {e}")
            return None
    
    def save_logs(self, filename='automation_log.json'):
        """Save logs to file"""
        with open(filename, 'w') as f:
            json.dump(self.logs, f, indent=2)
        self.log(f"Logs saved to {filename}")

def main():
    """Main execution function"""
    tool = AutomationTool()
    tool.log("Automation tool started")
    
    # Add your automation tasks here
    # Example:
    # tool.process_file("data.txt")
    # data = tool.fetch_data("https://api.example.com/data")
    
    tool.log("Automation completed")
    tool.save_logs()

if __name__ == "__main__":
    main()`,
        'requirements.txt': `requests==2.31.0`,
        'README.md': `# Python Automation Starter

A template for building automation scripts with Python.

## Setup

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Usage

\`\`\`bash
python main.py
\`\`\`

## Customization

Edit \`main.py\` to add your automation tasks.`
      }
    }
  },

  'discord-bot': {
    name: 'Discord Bot Starter',
    description: 'Template for creating Discord bots with Node.js',
    icon: '🤖',
    category: 'backend',
    language: 'javascript',
    structure: {
      backend: {
        'index.js': `const { Client, GatewayIntentBits } = require('discord.js')
require('dotenv').config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

client.once('ready', () => {
  console.log(\`🤖 Bot is online as \${client.user.tag}!\`)
})

client.on('messageCreate', async (message) => {
  // Ignore bot messages
  if (message.author.bot) return
  
  // Simple ping command
  if (message.content === '!ping') {
    await message.reply('Pong! 🏓')
  }
  
  // Echo command
  if (message.content.startsWith('!echo ')) {
    const text = message.content.slice(6)
    await message.reply(text)
  }
  
  // Help command
  if (message.content === '!help') {
    await message.reply(\`
📚 Available Commands:
- !ping - Check if bot is online
- !echo <text> - Echo your message
- !help - Show this help message
\`)
  }
})

client.login(process.env.DISCORD_TOKEN)`,
        'package.json': JSON.stringify({
          name: 'discord-bot-starter',
          version: '1.0.0',
          dependencies: {
            'discord.js': '^14.11.0',
            dotenv: '^16.3.1'
          },
          scripts: {
            start: 'node index.js',
            dev: 'nodemon index.js'
          }
        }, null, 2),
        '.env.example': `DISCORD_TOKEN=your_bot_token_here`,
        'README.md': `# Discord Bot Starter

A simple Discord bot template using discord.js.

## Setup

1. Create a bot on Discord Developer Portal
2. Copy your bot token
3. Create a \`.env\` file:
   \`\`\`
   DISCORD_TOKEN=your_bot_token_here
   \`\`\`
4. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
5. Run the bot:
   \`\`\`bash
   npm start
   \`\`\`

## Commands

- !ping - Check if bot is online
- !echo <text> - Echo your message
- !help - Show help message`
      }
    }
  },
  'vic-premium-dashboard': {
    name: 'Vic Premium Dashboard',
    description: 'Ultra-premium glassmorphic dashboard with real-time analytics and dark mode',
    icon: '📊',
    category: 'frontend',
    language: 'javascript',
    structure: {
      frontend: {
        'src/Dashboard.jsx': `import React from 'react';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-glass">
      <nav className="side-nav">
        <div className="logo">Vic AI</div>
        <div className="nav-items">
          <div className="active">Overview</div>
          <div>Analytics</div>
          <div>Projects</div>
          <div>Settings</div>
        </div>
      </nav>
      <main className="content">
        <header>
          <h1>Premium Overview</h1>
          <div className="user-profile">
            <span>John Doe</span>
            <div className="avatar">JD</div>
          </div>
        </header>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Active Users</h3>
            <p className="value">2,854</p>
            <span className="trend positive">+12%</span>
          </div>
          <div className="stat-card">
            <h3>Revenue</h3>
            <p className="value">$42,910</p>
            <span className="trend positive">+8%</span>
          </div>
          <div className="stat-card">
            <h3>Avg. Time</h3>
            <p className="value">12m 45s</p>
            <span className="trend neutral">0%</span>
          </div>
        </div>
        <div className="charts">
          <div className="chart-large">
            <h3>Growth Analysis</h3>
            <div className="mock-chart"></div>
          </div>
        </div>
      </main>
    </div>
  );
}`,
        'src/Dashboard.css': `.dashboard-glass {
  display: flex;
  min-height: 100vh;
  background: radial-gradient(circle at top left, #1a1a2e, #16213e);
  color: white;
  font-family: 'Inter', sans-serif;
}

.side-nav {
  width: 260px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 40px 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}`
      }
    }
  },
  'vic-creative-studio': {
    name: 'Vic Creative Studio',
    description: 'High-end canvas workspace with local layer management and AI generation',
    icon: '🎨',
    category: 'frontend',
    language: 'javascript',
    structure: {
      frontend: {
        'src/Studio.jsx': `import React, { useState } from 'react';
import './Studio.css';

export default function CreativeStudio() {
  const [layers, setLayers] = useState([{ id: 1, name: 'Background', visible: true }]);
  
  return (
    <div className="studio-container">
      <div className="toolbar">
        <button>Select</button>
        <button>Brush</button>
        <button>Type</button>
        <button className="primary">Generate AI</button>
      </div>
      <div className="canvas-area">
        <div className="canvas-mock">
          Canvas Content Here
        </div>
      </div>
      <div className="layers-panel">
        <h3>Layers</h3>
        {layers.map(l => (
          <div key={l.id} className="layer-item">
            <span>{l.name}</span>
            <button>Visibility</button>
          </div>
        ))}
      </div>
    </div>
  );
}`,
        'src/Studio.css': `.studio-container {
  display: grid;
  grid-template-columns: 80px 1fr 280px;
  height: 100vh;
  background: #0a0a0a;
  color: #e0e0e0;
}

.toolbar {
  background: #151515;
  border-right: 1px solid #252525;
  display: flex;
  flex-direction: column;
  padding: 20px 10px;
  gap: 15px;
}`
      }
    }
  },
  'vic-expert-tutor': {
    name: 'Vic Expert Tutor',
    description: 'Animated teaching platform with interactive assessments and local AI',
    icon: '🎓',
    category: 'frontend',
    language: 'javascript',
    structure: {
      frontend: {
        'src/Tutor.jsx': `import React, { useState } from 'react';
import './Tutor.css';

export default function ExpertTutor() {
  const [progress, setProgress] = useState(35);
  
  return (
    <div className="tutor-layout">
      <aside className="curriculum">
        <h2>Modern JavaScript</h2>
        <div className="module active">1. Variable Scopes</div>
        <div className="module">2. Closures & Context</div>
        <div className="module">3. Async Patterns</div>
      </aside>
      <main className="lesson-view">
        <header>
          <div className="progress-bar">
            <div className="fill" style={{ width: \`\${progress}%\` }}></div>
          </div>
          <span>\${progress}% Complete</span>
        </header>
        <div className="lesson-card">
          <h1>Understanding Closures</h1>
          <p>Closures are a fundamental concept in JavaScript...</p>
          <div className="code-example">
            <code>{\`function outer() {
  const secret = "I'm hidden";
  return function inner() {
    console.log(secret);
  };
}\`}</code>
          </div>
          <button className="btn-next">Got it, Next!</button>
        </div>
      </main>
    </div>
  );
}`,
        'src/Tutor.css': `.tutor-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  height: 100vh;
  background: #f8f9fa;
}

.lesson-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  max-width: 800px;
  margin: 40px auto;
}`
      }
    }
  }
}

// Helper function to get template by key
export const getTemplate = (key) => {
  return PROJECT_TEMPLATES[key] || null
}

// Get all templates
export const getAllTemplates = () => {
  return Object.entries(PROJECT_TEMPLATES).map(([key, template]) => ({
    key,
    ...template
  }))
}

// Get templates by category
export const getTemplatesByCategory = (category) => {
  return getAllTemplates().filter(t => t.category === category)
}

// Get templates by language
export const getTemplatesByLanguage = (language) => {
  return getAllTemplates().filter(t => t.language === language)
}

export default PROJECT_TEMPLATES
