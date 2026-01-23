/**
 * VIC AI - Main Export Index
 * 
 * Import the VicAI package:
 * 
 * // ES Modules
 * import { VicAI, chat, code, teach } from './server/index.js'
 * 
 * // CommonJS
 * const { VicAI, chat, code, teach } = require('./server/index.js')
 */

// Core VicAI client
export { VicAI, createVicAI, generateResponse, chat, code, teach } from './services/vicai.js'

// AI Engine
export {
    generateAIResponse,
    streamAIResponse,
    Content,
    Part,
    GenerateContentResponse
} from './services/aiEngine.js'

// Language Detection & Subject Knowledge
export {
    LanguageDetector,
    MathSolver,
    SubjectDetector,
    SUBJECT_KNOWLEDGE
} from './services/languageAndSubjects.js'

// Security
export { encrypt, decrypt, generateSecureToken, hash } from './config/security.js'

// Rate Limiting
export {
    rateLimiter,
    recordError,
    getAbuseStatus,
    clearTimeout,
    RATE_LIMITS,
    ABUSE_THRESHOLDS
} from './middleware/rateLimiter.js'

// User Service
export { registerUser, loginUser, verifyToken, getUserById } from './services/userService.js'

// Key Service
// API key management removed - Vic AI operates without external API keys

// Default export is the VicAI class
export { default } from './services/vicai.js'
