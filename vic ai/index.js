/**
 * Vic AI - Complete Local AI System
 *
 * A comprehensive AI system that runs entirely in the browser with:
 * - Advanced emotional intelligence and mood detection
 * - Complete code generation capabilities
 * - Image and video generation
 * - Teaching and learning features
 * - Quality assurance and legal compliance
 *
 * @version 2.0.0 (Vic-AI-Beta)
 * @license MIT
 */

// ============================================================================
// MAIN VIC AI EXPORTS
// ============================================================================

// Core Vic AI Classes
export { default as VicAI } from './src/services/vicai.js'
export { VicAIBeta } from './src/services/vicAIBeta.js'
export { AdvancedMoodAnalyzer, QualityAssuranceSystem, LegalComplianceChecker, ThinkingVisualizer } from './src/services/vicAIBeta.js'

// AI Engine Components
export {
  generateAIResponse,
  streamAIResponse,
  Content,
  Part,
  GenerateContentResponse,
  AdvancedResponseGenerator,
  AdvancedNLPPipeline
} from './server/services/aiEngine.js'

// VicAIThinking (Original System)
export { VicAIThinking } from './src/services/vicAIThinking.js'

// ============================================================================
// FRONTEND COMPONENTS
// ============================================================================

// React Components
export { default as VicAITab } from './src/components/VicAITab.jsx'
export { default as VicAPITab } from './src/components/VicAPITab.jsx'
export { default as BuildTab } from './src/components/BuildTab.jsx'

// ============================================================================
// UTILITY FUNCTIONS & HELPERS
// ============================================================================

// Quick helper functions for immediate use
export async function chat(message, options = {}) {
  const { VicAIBeta } = await import('./src/services/vicAIBeta.js')
  const vicBeta = new VicAIBeta(options)
  const result = await vicBeta.think(message)
  return result.response.content
}

export async function generateCode(description, language = 'javascript', options = {}) {
  const { VicAIBeta } = await import('./src/services/vicAIBeta.js')
  const vicBeta = new VicAIBeta(options)
  const result = await vicBeta.think(`Create ${language} code for: ${description}`)
  return result.response.content
}

export async function teach(topic, level = 'beginner', options = {}) {
  const { VicAIBeta } = await import('./src/services/vicAIBeta.js')
  const vicBeta = new VicAIBeta(options)
  const result = await vicBeta.think(`Teach me about ${topic} at ${level} level`)
  return result.response
}

export async function analyzeMood(text, options = {}) {
  const { AdvancedMoodAnalyzer } = await import('./src/services/vicAIBeta.js')
  const analyzer = new AdvancedMoodAnalyzer()
  return analyzer.analyzeMood(text)
}

export async function checkQuality(content, type = 'response', options = {}) {
  const { QualityAssuranceSystem } = await import('./src/services/vicAIBeta.js')
  const qa = new QualityAssuranceSystem()
  return await qa.performDoubleCheck(content, {}, type)
}

export async function checkCompliance(content, context = {}, options = {}) {
  const { LegalComplianceChecker } = await import('./src/services/vicAIBeta.js')
  const checker = new LegalComplianceChecker()
  return await checker.checkCompliance(content, context)
}

// ============================================================================
// SERVER-SIDE EXPORTS (for backend integration)
// ============================================================================

// Express routes
export { default as aiRoutes } from './server/routes/ai.js'

// Services
export { registerUser, loginUser, verifyToken, getUserById } from './server/services/userService.js'
export { encrypt, decrypt, generateSecureToken, hash } from './server/config/security.js'
export { rateLimiter, recordError, getAbuseStatus } from './server/middleware/rateLimiter.js'

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

export const VIC_AI_VERSION = '2.0.0-beta'
export const VIC_AI_FEATURES = [
  'emotional_intelligence',
  'code_generation',
  'image_generation',
  'video_generation',
  'teaching_system',
  'quality_assurance',
  'legal_compliance',
  'mood_analysis',
  'conversation_memory',
  'multi_language_support'
]

export const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp',
  'rust', 'go', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css'
]

export const AI_CAPABILITIES = {
  codeGeneration: true,
  imageGeneration: true,
  videoGeneration: true,
  teaching: true,
  emotionalIntelligence: true,
  qualityAssurance: true,
  legalCompliance: true,
  multiLanguage: true,
  conversationMemory: true
}

// ============================================================================
// INITIALIZATION HELPERS
// ============================================================================

/**
 * Create a new VicAIBeta instance with custom configuration
 * @param {Object} config - Configuration options
 * @returns {VicAIBeta} Configured Vic AI instance
 */
export async function createVicAI(config = {}) {
  const { VicAIBeta } = await import('./src/services/vicAIBeta.js')
  return new VicAIBeta({
    doubleCheck: config.doubleCheck !== false,
    legalCheck: config.legalCheck !== false,
    moodAnalysis: config.moodAnalysis !== false,
    thinkingVisualization: config.thinkingVisualization !== false,
    ...config
  })
}

/**
 * Initialize Vic AI system with all components
 * @param {Object} config - System configuration
 * @returns {Object} Initialized Vic AI system
 */
export async function initializeVicAI(config = {}) {
  const vicAI = await createVicAI(config)

  return {
    vicAI,
    version: VIC_AI_VERSION,
    features: VIC_AI_FEATURES,
    capabilities: AI_CAPABILITIES,
    supportedLanguages: SUPPORTED_LANGUAGES,

    // Utility methods
    chat: (message) => chat(message, config),
    generateCode: (description, language) => generateCode(description, language, config),
    teach: (topic, level) => teach(topic, level, config),
    analyzeMood: (text) => analyzeMood(text),
    checkQuality: (content, type) => checkQuality(content, type),
    checkCompliance: (content, context) => checkCompliance(content, context)
  }
}

// ============================================================================
// BROWSER ENVIRONMENT DETECTION
// ============================================================================

// Detect if running in browser vs Node.js
export const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'
export const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null

// ============================================================================
// DEFAULT EXPORT - Main VicAI class
// ============================================================================

export { default } from './src/services/vicai.js'

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
Usage Examples:

// Quick chat
import { chat } from 'vic-ai'
const response = await chat('Hello, how are you?')

// Advanced usage with VicAIBeta
import { createVicAI } from 'vic-ai'
const vicAI = await createVicAI({
  doubleCheck: true,
  legalCheck: true,
  moodAnalysis: true
})
const result = await vicAI.think('Create a React component')

// Full system initialization
import { initializeVicAI } from 'vic-ai'
const system = await initializeVicAI()
await system.chat('Hello!')

// React component usage
import { VicAITab, VicAPITab } from 'vic-ai'
// Use components in your React app

// Server-side usage
import { aiRoutes } from 'vic-ai'
// Use routes in your Express app
*/