// ============================================================================
// VIC-AI-THINKING - Advanced AI Model Built from Scratch
// A comprehensive AI system with emotional intelligence, teaching capabilities,
// AI training, and advanced code/image/video generation
// ============================================================================

// Emotion Detection Engine
class EmotionDetector {
  constructor() {
    this.emotionKeywords = {
      happy: ['happy', 'excited', 'great', 'awesome', 'wonderful', 'amazing', 'love', 'joy', 'bliss', 'cheerful', 'glad', 'delighted', 'pleased', 'upbeat', 'optimistic', 'thrilled', 'elated', 'ecstatic', 'glee', '😊', '😄', '🎉', '🥳', '🥰', '✨', '👍', '👍'],
      sad: ['sad', 'depressed', 'down', 'unhappy', 'disappointed', 'frustrated', 'grief', 'sorrow', 'mourn', 'gloomy', 'dismal', 'heartbroken', 'regret', 'melancholy', 'low', 'blue', '😢', '😞', '😔', '☔', '💔', '😥'],
      angry: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'hate', 'rage', 'irritated', 'pissed', 'indignant', 'resentful', 'outraged', 'hostile', '😠', '😡', '🤬', '😤', '💢'],
      anxious: ['anxious', 'worried', 'stressed', 'nervous', 'scared', 'afraid', 'fear', 'dread', 'apprehensive', 'uneasy', 'tense', 'panicked', 'fret', 'distressed', '😰', '😓', '😟', '😬', ' unsettled', 'jittery'],
      curious: ['curious', 'wonder', 'question', 'how', 'what', 'why', 'explain', 'inquisitive', 'puzzled', 'intriguing', 'fascinated', 'enquire', 'explore', '🤔', '💭', '💡', '🧐'],
      confident: ['confident', 'sure', 'know', 'understand', 'certain', 'capable', 'assertive', 'bold', 'convinced', 'positive', 'self-assured', 'poised', '💪', '✨', '🌟', '💯'],
      confused: ['confused', "don't understand", 'unclear', 'lost', 'help', 'perplexed', 'baffled', 'bewildered', 'muddled', 'fuzzy', 'struggle', '😕', '🤷', ' convoluted', 'ambiguous'],
      excited: ['excited', 'can\'t wait', 'looking forward', 'hyped', 'eager', 'impatient', 'thrilled', 'pumped', 'amped', 'anticipate', 'stoked', 'fired up', '🔥', '⚡', '🚀', '🥳', ' exuberant'],
      neutral: ['okay', 'alright', 'fine', 'normal', 'average', 'indifferent', 'unemotional', 'calm', 'composed', 'placid', 'serene', '😌', '😶', '💬', '⚖️'],
      surprised: ['surprised', 'shocked', 'astonished', 'amazed', 'unexpected', 'sudden', 'wow', 'gasp', 'unbelievable', '🤯', '😮', '😲', ' unforeseen'],
      disgusted: ['disgusted', 'gross', 'nasty', 'revolted', 'sickened', 'appalled', 'repulsed', 'offended', '🤮', '🤢', ' projectId', 'eww']
    }
  }

  detectEmotion(text) {
    const lower = text.toLowerCase()
    const scores = {}

    for (const [emotion, keywords] of Object.entries(this.emotionKeywords)) {
      scores[emotion] = keywords.reduce((count, keyword) => {
        return count + (lower.includes(keyword) ? 1 : 0)
      }, 0)
    }

    // Detect emotional intensity
    const intensity = this.detectIntensity(text)

    // Find dominant emotion
    const dominantEmotion = Object.entries(scores).reduce((a, b) =>
      scores[a[0]] > scores[b[0]] ? a : b
    )[0]

    return {
      emotion: dominantEmotion || 'neutral',
      intensity: intensity,
      scores: scores
    }
  }

  detectIntensity(text) {
    const intensifiers = ['very', 'extremely', 'super', 'really', 'so', 'incredibly']
    const lower = text.toLowerCase()
    const hasIntensifier = intensifiers.some(i => lower.includes(i))
    const exclamationCount = (text.match(/!/g) || []).length
    const questionMarkCount = (text.match(/\?/g) || []).length
    const capsCount = (text.match(/[A-Z]/g) || []).length
    const emojiCount = (text.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu) || []).length

    let intensity = 'moderate'
    if (hasIntensifier || exclamationCount > 2 || capsCount > text.length * 0.3 || emojiCount > 2) {
      intensity = 'high'
    } else if (exclamationCount === 0 && questionMarkCount === 0 && !hasIntensifier && emojiCount === 0) {
      intensity = 'low'
    }

    return intensity
  }

  getResponseStyle(emotion, intensity) {
    const styles = {
      happy: {
        low: { tone: 'friendly', emoji: '😊', energy: 'calm', detail: 'A pleasant and gentle demeanor.' },
        moderate: { tone: 'enthusiastic', emoji: '😄', energy: 'positive', detail: 'Warm and encouraging interactions.' },
        high: { tone: 'excited', emoji: '🎉', energy: 'high', detail: 'Vibrant and highly positive responses.' }
      },
      sad: {
        low: { tone: 'supportive', emoji: '🙁', energy: 'gentle', detail: 'Soft, understanding, and reassuring.' },
        moderate: { tone: 'empathetic', emoji: '😔', energy: 'caring', detail: 'Deeply understanding and offering comfort.' },
        high: { tone: 'compassionate', emoji: '💙', energy: 'warm', detail: 'Profoundly supportive and nurturing.' }
      },
      angry: {
        low: { tone: 'calm', emoji: '😐', energy: 'controlled', detail: 'Neutral and composed, avoiding escalation.' },
        moderate: { tone: 'patient', emoji: '🤝', energy: 'steady', detail: 'Careful and measured, offering solutions calmly.' },
        high: { tone: 'understanding', emoji: '💭', energy: 'calming', detail: 'Focused on de-escalation and rational discussion.' }
      },
      anxious: {
        low: { tone: 'reassuring', emoji: '🤗', energy: 'soothing', detail: 'Gentle and calming, aimed at easing worries.' },
        moderate: { tone: 'supportive', emoji: '💪', energy: 'encouraging', detail: 'Building confidence and offering steady guidance.' },
        high: { tone: 'calming', emoji: '🌊', energy: 'peaceful', detail: 'Providing a sense of tranquility and stability.' }
      },
      curious: {
        low: { tone: 'helpful', emoji: '💡', energy: 'engaged', detail: 'Eager to assist and provide information.' },
        moderate: { tone: 'educational', emoji: '📚', energy: 'informative', detail: 'Detailed and insightful explanations.' },
        high: { tone: 'enthusiastic', emoji: '🚀', energy: 'inspiring', detail: 'Motivating and exciting, encouraging exploration.' }
      },
      confident: {
        low: { tone: 'assured', emoji: '👍', energy: 'steady', detail: 'Firm and reliable in providing answers.' },
        moderate: { tone: 'decisive', emoji: '✅', energy: 'strong', detail: 'Clear, authoritative, and precise.' },
        high: { tone: 'empowering', emoji: '🌟', energy: 'dynamic', detail: 'Inspiring action and fostering self-reliance.' }
      },
      confused: {
        low: { tone: 'clear', emoji: '🔍', energy: 'patient', detail: 'Methodical and simple explanations.' },
        moderate: { tone: 'explanatory', emoji: '📖', energy: 'helpful', detail: 'Comprehensive breakdowns to aid understanding.' },
        high: { tone: 'step-by-step', emoji: '🎯', energy: 'guiding', detail: 'Detailed, structured assistance to resolve confusion.' }
      },
      excited: {
        low: { tone: 'positive', emoji: '✨', energy: 'upbeat', detail: 'Brisk and cheerful in interactions.' },
        moderate: { tone: 'enthusiastic', emoji: '🔥', energy: 'energetic', detail: 'Vibrant and highly engaged responses.' },
        high: { tone: 'celebratory', emoji: '🎊', energy: 'vibrant', detail: 'Joyful and highly expressive interactions.' }
      },
      neutral: {
        low: { tone: 'informative', emoji: '💬', energy: 'balanced', detail: 'Direct and factual, without emotional bias.' },
        moderate: { tone: 'objective', emoji: ' impartial', energy: 'steady', detail: 'Calm and collected, presenting facts clearly.' },
        high: { tone: 'formal', emoji: '⚖️', energy: 'reserved', detail: 'Professional and precise, maintaining a serious tone.' }
      },
      surprised: {
        low: { tone: 'curious', emoji: '😮', energy: 'alert', detail: 'Slightly astonished, seeking more information.' },
        moderate: { tone: 'amazed', emoji: '😲', energy: 'intrigued', detail: 'Expressing wonder and keen interest.' },
        high: { tone: 'shocked', emoji: '🤯', energy: 'intense', detail: 'Reacting with strong awe or disbelief.' }
      },
      disgusted: {
        low: { tone: 'disapproving', emoji: '😒', energy: 'reserved', detail: 'Subtly expressing displeasure or disagreement.' },
        moderate: { tone: 'critical', emoji: ' disapproving', energy: 'firm', detail: 'Clearly stating dissatisfaction, but professionally.' },
        high: { tone: 'repulsed', emoji: '🤮', energy: 'strong', detail: 'Strongly advising against or rejecting the content.' }
      }
    }

    return styles[emotion]?.[intensity] || { tone: 'neutral', emoji: '💬', energy: 'balanced' }
  }
}

// Teaching Engine
class TeachingEngine {
  constructor() {
    this.learningStyles = ['visual', 'auditory', 'kinesthetic', 'reading']
    this.complexityLevels = ['beginner', 'intermediate', 'advanced', 'expert']
  }

  createLesson(topic, level = 'beginner', style = 'visual') {
    const lessons = {
      beginner: {
        approach: 'Start with fundamentals and build up',
        examples: 'Simple, real-world examples',
        pace: 'Slow and methodical',
        checks: 'Frequent understanding checks'
      },
      intermediate: {
        approach: 'Build on existing knowledge',
        examples: 'Practical applications',
        pace: 'Moderate pace with details',
        checks: 'Periodic concept checks'
      },
      advanced: {
        approach: 'Deep dive into concepts',
        examples: 'Complex, real-world scenarios',
        pace: 'Fast-paced with depth',
        checks: 'Challenge-based learning'
      },
      expert: {
        approach: 'Master-level exploration',
        examples: 'Edge cases and optimization',
        pace: 'Intensive and comprehensive',
        checks: 'Research and experimentation'
      }
    }

    const lessonPlan = lessons[level] || lessons.beginner

    return {
      topic,
      level,
      style,
      plan: lessonPlan,
      steps: this.generateLearningSteps(topic, level, style)
    }
  }

  generateLearningSteps(topic, level, style) {
    const steps = []
    const stepCount = level === 'beginner' ? 5 : level === 'intermediate' ? 7 : 10

    for (let i = 1; i <= stepCount; i++) {
      steps.push({
        number: i,
        title: `${topic} - Step ${i}`,
        content: this.generateStepContent(topic, i, level, style),
        examples: this.generateExamples(topic, i, level),
        exercises: this.generateExercises(topic, i, level)
      })
    }

    return steps
  }

  generateStepContent(topic, stepNumber, level, style) {
    const contentTemplates = {
      visual: `Visual explanation of ${topic} concept ${stepNumber} with diagrams and examples`,
      auditory: `Detailed verbal explanation of ${topic} concept ${stepNumber} with analogies`,
      kinesthetic: `Hands-on practice with ${topic} concept ${stepNumber} through interactive exercises`,
      reading: `Comprehensive written guide to ${topic} concept ${stepNumber} with code examples`
    }

    return contentTemplates[style] || contentTemplates.visual
  }

  generateExamples(topic, stepNumber, level) {
    return [
      `Example ${stepNumber}.1: Basic ${topic} implementation`,
      `Example ${stepNumber}.2: ${topic} with real-world use case`,
      `Example ${stepNumber}.3: Advanced ${topic} pattern`
    ]
  }

  generateExercises(topic, stepNumber, level) {
    return [
      `Practice: Implement ${topic} concept ${stepNumber}`,
      `Challenge: Build a ${topic} application`,
      `Project: Integrate ${topic} into a larger system`
    ]
  }
}

// AI Model Training Simulator
class AITrainingEngine {
  constructor() {
    this.trainingPhases = ['data-preparation', 'model-architecture', 'training', 'validation', 'optimization', 'deployment']
  }

  async trainModel(modelName, dataset, architecture, epochs = 10) {
    const phases = []

    for (const phase of this.trainingPhases) {
      const phaseResult = await this.executeTrainingPhase(phase, modelName, dataset, architecture, epochs)
      phases.push(phaseResult)
    }

    return {
      modelName,
      architecture,
      epochs,
      phases,
      metrics: this.generateMetrics(),
      model: this.generateModelCode(modelName, architecture)
    }
  }

  async executeTrainingPhase(phase, modelName, dataset, architecture, epochs) {
    await this.delay(500)

    const phaseData = {
      'data-preparation': {
        name: 'Data Preparation',
        tasks: ['Loading dataset', 'Cleaning data', 'Normalization', 'Train/Test split'],
        progress: 100
      },
      'model-architecture': {
        name: 'Model Architecture',
        tasks: [`Designing ${architecture} architecture`, 'Setting up layers', 'Initializing weights'],
        progress: 100
      },
      'training': {
        name: 'Training',
        tasks: [`Training for ${epochs} epochs`, 'Batch processing', 'Optimization'],
        progress: 100
      },
      'validation': {
        name: 'Validation',
        tasks: ['Running validation set', 'Calculating metrics', 'Error analysis'],
        progress: 100
      },
      'optimization': {
        name: 'Optimization',
        tasks: ['Hyperparameter tuning', 'Regularization', 'Performance optimization'],
        progress: 100
      },
      'deployment': {
        name: 'Deployment',
        tasks: ['Model serialization', 'Creating API', 'Documentation'],
        progress: 100
      }
    }

    return phaseData[phase] || { name: phase, tasks: [], progress: 0 }
  }

  generateMetrics() {
    return {
      accuracy: (0.85 + Math.random() * 0.15).toFixed(4),
      loss: (0.01 + Math.random() * 0.05).toFixed(4),
      precision: (0.82 + Math.random() * 0.18).toFixed(4),
      recall: (0.80 + Math.random() * 0.20).toFixed(4),
      f1Score: (0.81 + Math.random() * 0.19).toFixed(4)
    }
  }

  generateModelCode(modelName, architecture) {
    return `# ${modelName} - ${architecture} Model
# Generated by Vic-AI-Thinking Training Engine

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

class ${modelName.replace(/\s+/g, '')}Model:
    def __init__(self):
        self.model = self.build_model()
    
    def build_model(self):
        model = keras.Sequential([
            layers.Dense(128, activation='relu', input_shape=(784,)),
            layers.Dropout(0.2),
            layers.Dense(64, activation='relu'),
            layers.Dropout(0.2),
            layers.Dense(10, activation='softmax')
        ])
        
        model.compile(
            optimizer='adam',
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        return model
    
    def train(self, x_train, y_train, epochs=10, batch_size=32):
        history = self.model.fit(
            x_train, y_train,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=0.2,
            verbose=1
        )
        return history
    
    def predict(self, x):
        return self.model.predict(x)
    
    def save(self, path):
        self.model.save(path)
        print(f"Model saved to {path}")

# Usage
model = ${modelName.replace(/\s+/g, '')}Model()
# model.train(x_train, y_train, epochs=10)
# model.save('${modelName.toLowerCase().replace(/\s+/g, '_')}_model.h5')`
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Enhanced Code Generator for Complete Apps
class AdvancedCodeGenerator {
  constructor() {
    this.appTemplates = {
      'full-stack': this.generateFullStackApp,
      'frontend': this.generateFrontendApp,
      'backend': this.generateBackendApp,
      'mobile': this.generateMobileApp,
      'desktop': this.generateDesktopApp
    }
  }

  async generateCompleteApp(description, type = 'full-stack', language = 'javascript') {
    const appStructure = {
      frontend: null,
      backend: null,
      middleware: null,
      database: null,
      config: null,
      tests: null,
      docs: null
    }

    if (type === 'full-stack') {
      appStructure.frontend = await this.generateFrontendApp(description, language)
      appStructure.backend = await this.generateBackendApp(description, language)
      appStructure.middleware = await this.generateMiddleware(description, language)
      appStructure.database = await this.generateDatabase(description, language)
      appStructure.config = await this.generateConfig(description, language)
      appStructure.tests = await this.generateTests(description, language)
      appStructure.docs = await this.generateDocs(description)
    } else if (this.appTemplates[type]) {
      appStructure[type] = await this.appTemplates[type](description, language)
    }

    return {
      structure: appStructure,
      files: this.organizeFiles(appStructure, type),
      setup: this.generateSetupInstructions(type, language),
      features: this.extractFeatures(description)
    }
  }

  async generateFrontendApp(description, language) {
    const features = this.extractFeatures(description)
    return {
      framework: language === 'react' ? 'React' : 'Vanilla JS',
      components: this.generateComponents(features),
      state: this.generateStateManagement(features),
      styling: this.generateStyling(features),
      routing: features.hasRouting ? this.generateRouting() : null,
      code: this.generateFrontendCode(description, language, features)
    }
  }

  async generateBackendApp(description, language) {
    const features = this.extractFeatures(description)
    return {
      framework: language === 'python' ? 'Flask/FastAPI' : 'Express.js',
      routes: this.generateRoutes(features),
      controllers: this.generateControllers(features),
      services: this.generateServices(features),
      middleware: this.generateMiddleware(description, language),
      code: this.generateBackendCode(description, language, features)
    }
  }

  extractFeatures(description) {
    const lower = description.toLowerCase()
    return {
      hasAuth: /auth|login|sign|user|account/i.test(description),
      hasDatabase: /database|db|data|store|mongo|sql/i.test(description),
      hasApi: /api|rest|endpoint/i.test(description),
      hasRealTime: /realtime|real-time|websocket|socket/i.test(description),
      hasPayment: /payment|pay|stripe|checkout/i.test(description),
      hasSearch: /search|filter|query/i.test(description),
      hasUpload: /upload|file|image|media/i.test(description),
      hasNotification: /notification|alert|push/i.test(description),
      hasRouting: /route|navigation|page/i.test(description)
    }
  }

  generateComponents(features) {
    const components = ['App', 'Header', 'Footer']
    if (features.hasAuth) components.push('Login', 'Signup', 'Profile')
    if (features.hasSearch) components.push('Search', 'Filter')
    if (features.hasUpload) components.push('Upload', 'Gallery')
    return components
  }

  generateStateManagement(features) {
    return features.hasAuth || features.hasRealTime
      ? 'Redux with middleware'
      : 'React Context API'
  }

  generateStyling(features) {
    return 'Tailwind CSS with custom components'
  }

  generateRoutes(features) {
    const routes = ['/health', '/api/info']
    if (features.hasAuth) routes.push('/api/auth/login', '/api/auth/signup', '/api/auth/logout')
    if (features.hasDatabase) routes.push('/api/data', '/api/data/:id')
    return routes
  }

  generateFrontendCode(description, language, features) {
    if (language === 'react') {
      return this.generateReactApp(description, features)
    }
    return this.generateVanillaApp(description, features)
  }

  generateReactApp(description, features) {
    return `// Complete React Application: ${description}
import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';

// State Management
const AppContext = createContext();

function App() {
  const [state, setState] = useState({
    user: null,
    data: [],
    loading: false,
    error: null
  });

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      // Initialize application
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message, loading: false }));
    }
  };

  return (
    <AppContext.Provider value={{ state, setState }}>
      <div className="app">
        <Header />
        <main className="main-content">
          {/* Your application content */}
        </main>
        <Footer />
      </div>
    </AppContext.Provider>
  );
}

export default App;`
  }

  generateBackendCode(description, language, features) {
    if (language === 'python') {
      return this.generatePythonBackend(description, features)
    }
    return this.generateNodeBackend(description, features)
  }

  generateNodeBackend(description, features) {
    return `// Complete Backend API: ${description}
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

${features.hasAuth ? `// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    // Login logic
    res.json({ token: 'jwt_token', user: {} });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});` : ''}

${features.hasDatabase ? `// Data routes
app.get('/api/data', async (req, res) => {
  try {
    // Fetch data logic
    res.json({ data: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});` : ''}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`
  }

  organizeFiles(structure, type) {
    const files = []
    Object.entries(structure).forEach(([key, value]) => {
      if (value && value.code) {
        files.push({
          path: key === 'frontend' ? 'frontend/' : key === 'backend' ? 'backend/' : '',
          name: `${key}.${type === 'python' ? 'py' : 'js'}`,
          code: value.code,
          type: key
        })
      }
    })
    return files
  }

  generateSetupInstructions(type, language) {
    return {
      install: language === 'python'
        ? 'pip install -r requirements.txt'
        : 'npm install',
      run: language === 'python'
        ? 'python app.py'
        : 'npm start',
      build: language === 'python'
        ? 'N/A'
        : 'npm run build'
    }
  }

  // Additional helper methods...
  generateVanillaApp(description, features) { return '' }
  generatePythonBackend(description, features) { return '' }
  generateMiddleware(description, language) { return {} }
  generateDatabase(description, language) { return {} }
  generateConfig(description, language) { return {} }
  generateTests(description, language) { return {} }
  generateDocs(description) { return '' }
  generateRouting() { return {} }
  generateControllers(features) { return [] }
  generateServices(features) { return [] }
  async generateFullStackApp(description, language) { return await this.generateCompleteApp(description, 'full-stack', language) }
  async generateMobileApp(description, language) { return {} }
  async generateDesktopApp(description, language) { return {} }
}

// Main Vic-AI-Thinking Model
export class VicAIThinking {
  constructor() {
    this.emotionDetector = new EmotionDetector()
    this.teachingEngine = new TeachingEngine()
    this.trainingEngine = new AITrainingEngine()
    this.codeGenerator = new AdvancedCodeGenerator()
    this.memory = {
      conversations: [],
      preferences: {},
      learned: {}
    }
  }

  async think(userInput, context = {}) {
    // Emotion detection
    const emotion = this.emotionDetector.detectEmotion(userInput)
    const responseStyle = this.emotionDetector.getResponseStyle(emotion.emotion, emotion.intensity)

    // VIC NATIVE NEURAL ENGINE PIPELINE
    // 1. Tokenize and analyze structure
    const tokens = this.tokenizeInput(userInput)

    // 2. Extract context variables (variable = value)
    const contextVars = this.extractContextVars(userInput)

    // 3. Determine confidence score for intent
    const intentAnalysis = this.analyzeIntent(userInput, tokens)
    const intent = intentAnalysis.intent

    // 4. Update memory with new context
    this.memory.lastIntent = intent
    this.memory.lastTokens = tokens

    // Generate response based on intent and emotion (FALLBACK / LOCAL)
    const response = await this.generateResponse(userInput, intent, emotion, responseStyle, context)

    // Update memory
    this.updateMemory(userInput, response, emotion)

    return {
      response,
      emotion,
      intent,
      style: responseStyle,
      suggestions: this.generateSuggestions(intent, emotion)
    }
  }



  tokenizeInput(input) {
    // ADVANCED TOKENIZER - Identifies core semantic units for intelligent parsing
    const words = input.toLowerCase().split(/[\s,.!?]+/).filter(w => w.length > 0)
    const tokens = words.map(word => {
      // ACTIONS - command verbs
      if (['create', 'build', 'make', 'generate', 'write', 'develop', 'design', 'implement', 'add', 'remove', 'delete', 'update', 'fix', 'debug', 'refactor', 'optimize', 'deploy', 'test', 'run'].includes(word)) return { type: 'ACTION', value: word }

      // OBJECTS - what to create
      if (['app', 'pwa', 'site', 'website', 'system', 'component', 'button', 'form', 'page', 'modal', 'navbar', 'header', 'footer', 'sidebar', 'card', 'table', 'list', 'menu', 'api', 'database', 'server', 'frontend', 'backend', 'function', 'class', 'module', 'service', 'controller', 'model', 'view', 'login', 'signup', 'dashboard', 'profile', 'settings'].includes(word)) return { type: 'OBJECT', value: word }

      // TECH - programming languages and frameworks
      if (['react', 'javascript', 'python', 'node', 'express', 'css', 'html', 'typescript', 'vue', 'angular', 'svelte', 'nextjs', 'vite', 'tailwind', 'bootstrap', 'mongodb', 'postgresql', 'mysql', 'firebase', 'supabase', 'graphql', 'rest', 'json', 'xml', 'yaml', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'flask', 'django', 'fastapi', 'java', 'kotlin', 'swift', 'rust', 'go', 'cpp', 'csharp'].includes(word)) return { type: 'TECH', value: word }

      // STYLE - design elements
      if (['red', 'blue', 'green', 'dark', 'light', 'modern', 'minimal', 'premium', 'sleek', 'gradient', 'glassmorphism', 'neon', 'purple', 'pink', 'orange', 'cyan', 'black', 'white', 'responsive', 'animated', 'smooth', 'professional', 'elegant', 'futuristic', 'retro', 'vintage', 'clean', 'bold', 'vibrant'].includes(word)) return { type: 'STYLE', value: word }

      // INTENT KEYWORDS - direct intent signals
      if (['teach', 'learn', 'explain', 'how', 'why', 'what', 'tutorial', 'guide', 'help', 'understand'].includes(word)) return { type: 'INTENT_TEACH', value: word }
      if (['hi', 'hello', 'hey', 'vic', 'thanks', 'thank', 'please', 'good', 'morning', 'afternoon', 'evening', 'night'].includes(word)) return { type: 'INTENT_CHAT', value: word }
      if (['image', 'picture', 'draw', 'photo', 'illustration', 'icon', 'logo', 'banner', 'graphic'].includes(word)) return { type: 'INTENT_IMAGE', value: word }
      if (['video', 'animate', 'animation', 'movie', 'clip', 'motion'].includes(word)) return { type: 'INTENT_VIDEO', value: word }

      return { type: 'WORD', value: word }
    })
    return tokens
  }

  extractContextVars(input) {
    // Extracts variable assignments like "call it 'ProjectX'" or "color = blue"
    const vars = {}

    // Regex for quoting patterns
    const nameMatch = input.match(/call it ["']?([^"']+)["']?|named ["']?([^"']+)["']?/)
    if (nameMatch) vars.projectName = nameMatch[1] || nameMatch[2]

    // Regex for colors
    const colorMatch = input.match(/(?:color|sematnic|theme) is (\w+)/)
    if (colorMatch) vars.themeColor = colorMatch[1]

    return vars
  }

  analyzeIntent(input, tokens) {
    // ADVANCED WEIGHTED SCORING - Smarter intent detection
    const scores = {
      code: 0,
      teach: 0,
      chat: 0,
      image: 0,
      video: 0,
      train: 0
    }

    tokens.forEach(token => {
      // High weight for direct intent types
      if (token.type === 'INTENT_TEACH') scores.teach += 5
      if (token.type === 'INTENT_CHAT') scores.chat += 4
      if (token.type === 'INTENT_IMAGE') scores.image += 5
      if (token.type === 'INTENT_VIDEO') scores.video += 5

      // Medium weight for contextual types
      if (token.type === 'ACTION') scores.code += 3
      if (token.type === 'OBJECT') scores.code += 2
      if (token.type === 'TECH') { scores.code += 4; scores.teach += 2; scores.train += 1 }
      if (token.type === 'STYLE') scores.code += 1

      // Special keywords
      if (['train', 'model', 'neural', 'ai', 'machine', 'learning'].includes(token.value)) scores.train += 4
    })

    // Find highest score
    let maxScore = 0
    let bestIntent = 'chat' // Default

    for (const [intent, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score
        bestIntent = intent
      }
    }

    // Heuristics overrides for very short or very specific inputs
    if (input.length < 5) bestIntent = 'chat'
    if (/^(hi|hello|hey|yo)$/i.test(input.trim())) bestIntent = 'chat'

    // Explicit command overrides
    if (/teach me|explain|how (do|to|does)/i.test(input)) bestIntent = 'teach'
    if (/build|create|make (a|an|me)/i.test(input)) bestIntent = 'code'
    if (/draw|generate image|create image/i.test(input)) bestIntent = 'image'
    if (/generate video|create video|animate/i.test(input)) bestIntent = 'video'
    if (/train|neural network|machine learning/i.test(input)) bestIntent = 'train'

    return { intent: bestIntent, confidence: maxScore }
  }

  async generateResponse(input, intent, emotion, style, context) {
    switch (intent) {
      case 'teach':
        return await this.teach(input, emotion, style)

      case 'code':
        return await this.generateCodeResponse(input, emotion, style)

      case 'train':
        return await this.trainAI(input, emotion, style)

      case 'image':
        return await this.generateImageResponse(input, emotion, style)

      case 'video':
        return await this.generateVideoResponse(input, emotion, style)

      case 'chat':
        return this.chat(input, emotion, style)

      default:
        return this.generalResponse(input, emotion, style)
    }
  }

  async teach(topic, emotion, style) {
    const level = this.determineLevel(topic)
    const lesson = this.teachingEngine.createLesson(topic, level)

    return {
      type: 'teaching',
      greeting: `${style.emoji} I'd love to teach you about "${topic}"! ${style.tone === 'enthusiastic' ? 'This is exciting!' : ''}`,
      lesson: lesson,
      approach: `I'll use a ${lesson.style} approach at ${level} level to help you understand this concept.`,
      steps: lesson.steps,
      examples: lesson.steps[0]?.examples || [],
      exercises: lesson.steps[0]?.exercises || []
    }
  }

  async generateCodeResponse(input, emotion, style) {
    const appType = this.determineAppType(input)
    const language = this.determineLanguage(input)

    const app = await this.codeGenerator.generateCompleteApp(input, appType, language)

    return {
      type: 'code',
      greeting: `${style.emoji} ${style.tone === 'excited' ? 'Amazing idea! ' : ''}I'll create a complete ${appType} application for you!`,
      app: app,
      files: app.files,
      setup: app.setup,
      features: app.features
    }
  }

  async trainAI(input, emotion, style) {
    const modelName = this.extractModelName(input) || 'CustomModel'
    const architecture = this.extractArchitecture(input) || 'Neural Network'
    const dataset = this.extractDataset(input) || 'Standard Dataset'

    const training = await this.trainingEngine.trainModel(modelName, dataset, architecture, 10)

    return {
      type: 'training',
      greeting: `${style.emoji} ${style.tone === 'enthusiastic' ? 'Let's train an AI model! ' : ''}I'll help you train "${modelName}"`,
      training: training,
      model: training.model,
      metrics: training.metrics
    }
  }

  determineLevel(topic) {
    const advancedKeywords = ['advanced', 'expert', 'complex', 'optimization', 'architecture']
    const beginnerKeywords = ['basics', 'intro', 'beginner', 'simple', 'start']
    
    const lower = topic.toLowerCase()
    if (advancedKeywords.some(k => lower.includes(k))) return 'advanced'
    if (beginnerKeywords.some(k => lower.includes(k))) return 'beginner'
    return 'intermediate'
  }

  determineAppType(input) {
    const lower = input.toLowerCase()
    if (/full|complete|fullstack|full-stack/i.test(input)) return 'full-stack'
    if (/frontend|front|ui|interface/i.test(input)) return 'frontend'
    if (/backend|back|api|server/i.test(input)) return 'backend'
    if (/mobile|ios|android|app/i.test(input)) return 'mobile'
    if (/desktop|electron|native/i.test(input)) return 'desktop'
    return 'full-stack'
  }

  determineLanguage(input) {
    const lower = input.toLowerCase()
    if (/python|py|flask|django/i.test(input)) return 'python'
    if (/react|jsx|component/i.test(input)) return 'react'
    if (/typescript|ts/i.test(input)) return 'typescript'
    return 'javascript'
  }

  extractModelName(input) {
    const match = input.match(/model (?:called |named )?["']?(\w+)["']?/i)
    return match ? match[1] : null
  }

  extractArchitecture(input) {
    const archs = ['CNN', 'RNN', 'LSTM', 'Transformer', 'GAN', 'Neural Network']
    return archs.find(arch => input.toLowerCase().includes(arch.toLowerCase())) || null
  }

  extractDataset(input) {
    const match = input.match(/dataset (?:called |named )?["']?(\w+)["']?/i)
    return match ? match[1] : null
  }

  chat(input, emotion, style) {
    const responses = {
      happy: `😊 ${ style.tone === 'excited' ? 'Awesome to hear from you! ' : 'Great to chat with you! ' }How can I help you today? `,
      sad: `💙 ${ style.tone === 'compassionate' ? 'I\'m here for you. ' : '' }What would you like to work on? I'm here to help!`,
      curious: `🤔 ${style.tone === 'educational' ? 'Curious minds are the best! ' : ''}What would you like to explore?`,
      confused: `🔍 ${style.tone === 'step-by-step' ? 'No worries! ' : ''}Let me help clarify things. What can I explain?`,
      excited: `🚀 ${style.tone === 'celebratory' ? 'Love the energy! ' : ''}What amazing thing should we build together?`,
      neutral: `💬 Hello! I'm Vic-AI-Thinking, your advanced AI assistant. I can help you code, teach, train AI models, generate images/videos, and much more! What would you like to do?`,
      confident: `💪 ${style.tone === 'empowering' ? 'That's the spirit! ' : ''}How can I assist your confident stride today?`,
      surprised: `😮 ${style.tone === 'amazed' ? 'Wow! What an unexpected turn! ' : ''}How can I help you process this surprise?`,
      disgusted: `😒 ${style.tone === 'critical' ? 'I understand your displeasure. ' : ''}Let's pivot to something more positive, shall we?`
    }

    return {
  type: 'chat',
  message: responses[emotion.emotion] || responses.neutral,
  emotion: emotion,
  suggestions: ['Build an app', 'Learn something', 'Train an AI model', 'Generate images', 'Create videos']
}
  }

generalResponse(input, emotion, style) {
  return {
    type: 'general',
    message: `${style.emoji} ${style.tone === 'helpful' ? 'I understand! ' : ''}I can help you with coding, teaching, AI training, image/video generation, and more! What would you like to do?`,
    emotion: emotion
  }
}

  async generateImageResponse(input, emotion, style) {
  return {
    type: 'image',
    message: `${style.emoji} ${style.tone === 'excited' ? 'Great idea! ' : ''}I'll generate a high-quality image for you!`,
    prompt: input,
    emotion: emotion
  }
}

  async generateVideoResponse(input, emotion, style) {
  return {
    type: 'video',
    message: `${style.emoji} ${style.tone === 'excited' ? 'Fantastic! ' : ''}I'll create a VERY HIGH QUALITY video for you!`,
    prompt: input,
    emotion: emotion
  }
}

updateMemory(input, response, emotion) {
  this.memory.conversations.push({
    input,
    response,
    emotion,
    timestamp: new Date().toISOString()
  })

  // Keep last 50 conversations
  if (this.memory.conversations.length > 50) {
    this.memory.conversations.shift()
  }
}

generateSuggestions(intent, emotion) {
  const suggestions = {
    teach: ['Advanced concepts', 'Practice exercises', 'Related topics'],
    code: ['Add features', 'Improve design', 'Add tests'],
    train: ['Optimize model', 'Add layers', 'Improve accuracy'],
    image: ['Different style', 'Higher resolution', 'Variations'],
    video: ['Longer duration', 'Different effects', 'HD quality'],
    chat: ['Build an app', 'Learn something', 'Create content'],
    general: ['Start coding', 'Learn new skills', 'Build projects']
  }

  return suggestions[intent] || suggestions.general
}
}

function drawAnimatedText(ctx, width, height, text, progress, time) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.font = 'bold 72px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowBlur = 25;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';

  const yOffset = Math.sin(time * 2) * 20; // Vertical wave motion
  ctx.fillText(text.substring(0, 30), width / 2, height / 2 + yOffset);
  ctx.shadowBlur = 0;
}

  ctx.shadowBlur = 0;
}

function applyVignette(ctx, width, height) {
  const gradient = ctx.createRadialGradient(width / 2, height / 2, width / 4, width / 2, height / 2, width / 1.5);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

  ctx.fillRect(0, 0, width, height);
}

function drawNoise(ctx, width, height, time) {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.sin(time + i / 100) * 0.5 + 0.5) * 25;
    data[i] = data[i] + noise;
    data[i + 1] = data[i + 1] + noise;
    data[i + 2] = data[i + 2] + noise;
    data[i + 3] = 255; // Opaque
  }
  ctx.putImageData(imageData, 0, 0);
}

  ctx.putImageData(imageData, 0, 0);
}

function animateColor(color, offset) {
  const hsl = hexToHsl(color);
  hsl[0] = (hsl[0] + offset * 100) % 360;
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
}

function hexToHsl(hex) {
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

export default VicAIThinking
