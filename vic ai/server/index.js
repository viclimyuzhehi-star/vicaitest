// Vic AI Server Components
// Export all server-side functionality

export { default as aiRoutes } from './routes/ai.js'
export { default as authRoutes } from './routes/auth.js'

export { registerUser, loginUser, verifyToken, getUserById } from './services/userService.js'
export { encrypt, decrypt, generateSecureToken, hash } from './config/security.js'
export { rateLimiter, recordError, getAbuseStatus } from './middleware/rateLimiter.js'

// Re-export AI engine components
export {
  generateAIResponse,
  streamAIResponse,
  Content,
  Part,
  GenerateContentResponse,
  AdvancedResponseGenerator,
  AdvancedNLPPipeline
} from './services/aiEngine.js'

// Language and subject services
export {
  LanguageDetector,
  MathSolver,
  SubjectDetector,
  SUBJECT_KNOWLEDGE
} from './services/languageAndSubjects.js'

// Vault service
export { default as vaultService } from './services/vaultService.js'