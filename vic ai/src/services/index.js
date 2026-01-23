// Vic AI Services
// Export all AI services and utilities

export { default as VicAI } from './vicai.js'
export { VicAIBeta, AdvancedMoodAnalyzer, QualityAssuranceSystem, LegalComplianceChecker, ThinkingVisualizer } from './vicAIBeta.js'
export { VicAIThinking } from './vicAIThinking.js'
export { generateChatResponse, generateAppCode, generateImage, generateVideo, getAISystemStatus, getAICapabilities } from './llmService.js'
export { default as authService } from './authService.js'
export { default as cryptoService } from './cryptoService.js'
export { default as fileEditor } from './fileEditor.js'
export { default as projectMemory } from './projectMemory.js'
export { default as advancedLocalAI } from './advancedLocalAI.js'