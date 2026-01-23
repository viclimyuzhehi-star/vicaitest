/**
 * VIC-AI-BETA ROUTES
 * Enhanced AI response generation endpoints with VicAIBeta
 */

import express from 'express'
import { generateAIResponse } from '../services/aiEngine.js'
import { rateLimiter, recordError } from '../middleware/rateLimiter.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Import VicAIBeta dynamically (since it's ESM)
let vicAIBeta = null
const initializeVicAIBeta = async () => {
  if (!vicAIBeta) {
    try {
      const { VicAIBeta } = await import('../../src/services/vicAIBeta.js')
      vicAIBeta = new VicAIBeta({
        doubleCheck: true,
        legalCheck: true,
        moodAnalysis: true,
        thinkingVisualization: false // Disable visualization for API responses
      })
    } catch (error) {
      console.error('Failed to initialize VicAIBeta:', error)
    }
  }
  return vicAIBeta
}

const router = express.Router()

/**
 * Simplified middleware - no authentication required for Vic AI
 * Vic AI operates completely locally and openly
 */
function openAccess(req, res, next) {
    req.userId = 'local-user' // Default user ID for local operations
    req.keyId = 'local'

    // Basic rate limiting for abuse prevention
    const rateCheck = rateLimiter('local', {
        endpoint: req.path,
        content: req.body?.message || req.body?.request
    })

    if (!rateCheck.allowed) {
        return res.status(429).json({
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please wait before trying again.',
            retryAfter: rateCheck.retryAfter
        })
    }

    next()
}

/**
 * POST /api/ai/chat
 * Generate enhanced AI response using VicAIBeta
 */
router.post('/chat', openAccess, async (req, res) => {
    try {
        const { message, context } = req.body

        if (!message) {
            return res.status(400).json({ error: 'Message is required' })
        }

        // Initialize VicAIBeta if needed
        const vicAI = await initializeVicAIBeta()

        if (!vicAI) {
            // Fallback to old system if VicAIBeta fails to load
            const result = generateAIResponse(message, context || {})
            return res.json({
                success: true,
                response: result.response,
                metadata: {
                    intent: result.intent,
                    confidence: result.confidence,
                    language: result.language,
                    keywords: result.keywords,
                    system: 'fallback'
                }
            })
        }

        // Generate enhanced response using VicAIBeta
        const result = await vicAI.think(message, context || {})

        res.json({
            success: true,
            response: result.response.content,
            type: result.response.type,
            metadata: {
                mood: result.analysis.mood.dominantMood,
                intent: result.analysis.intent.intent,
                confidence: result.metadata.confidence,
                qualityScore: result.quality.quality.score,
                complianceStatus: result.compliance.compliant ? 'passed' : 'issues',
                processingTime: result.metadata.processingTime,
                system: 'vic-ai-beta'
            },
            analysis: {
                emotion: result.analysis.mood.dominantEmotion,
                intent: result.analysis.intent.intent,
                confidence: result.metadata.confidence
            },
            quality: {
                score: result.quality.quality.score,
                issues: result.quality.issues.length,
                suggestions: result.quality.suggestions.length
            },
            compliance: {
                status: result.compliance.compliant ? 'compliant' : 'violations',
                violations: result.compliance.violations.length,
                warnings: result.compliance.warnings.length
            }
        })
    } catch (error) {
        console.error('VicAIBeta Error:', error.message)
        res.status(500).json({ error: 'Failed to generate enhanced response' })
    }
})

/**
 * POST /api/ai/code
 * Generate enhanced code using VicAIBeta
 */
router.post('/code', openAccess, async (req, res) => {
    try {
        const { request, language, framework } = req.body

        if (!request) {
            return res.status(400).json({ error: 'Code request is required' })
        }

        // Initialize VicAIBeta if needed
        const vicAI = await initializeVicAIBeta()

        if (!vicAI) {
            // Fallback to old system
            const context = { type: 'code', language, framework }
            const codePrompt = `create ${language || 'javascript'} code for: ${request}`
            const result = generateAIResponse(codePrompt, context)
            return res.json({
                success: true,
                response: result.response,
                language: result.language,
                system: 'fallback'
            })
        }

        // Generate enhanced code using VicAIBeta
        const codePrompt = `Create ${language || 'javascript'} code for: ${request}`
        const result = await vicAI.think(codePrompt, { type: 'code', language, framework })

        res.json({
            success: true,
            response: result.response.content,
            type: result.response.type,
            language: language || 'javascript',
            metadata: {
                qualityScore: result.quality.quality.score,
                complianceStatus: result.compliance.compliant ? 'passed' : 'issues',
                processingTime: result.metadata.processingTime,
                system: 'vic-ai-beta'
            },
            quality: {
                score: result.quality.quality.score,
                issues: result.quality.issues.length,
                suggestions: result.quality.suggestions.length
            },
            compliance: {
                status: result.compliance.compliant ? 'compliant' : 'violations',
                violations: result.compliance.violations.length
            }
        })
    } catch (error) {
        console.error('VicAIBeta Code Generation Error:', error.message)
        res.status(500).json({ error: 'Failed to generate enhanced code' })
    }
})

/**
 * POST /api/ai/teach
 * Generate enhanced teaching content using VicAIBeta
 */
router.post('/teach', openAccess, async (req, res) => {
    try {
        const { topic, level } = req.body

        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' })
        }

        // Initialize VicAIBeta if needed
        const vicAI = await initializeVicAIBeta()

        if (!vicAI) {
            // Fallback to old system
            const teachPrompt = `teach me about ${topic}`
            const result = generateAIResponse(teachPrompt, { level: level || 'beginner' })
            return res.json({
                success: true,
                response: result.response,
                topic,
                keywords: result.keywords,
                system: 'fallback'
            })
        }

        // Generate enhanced teaching content using VicAIBeta
        const teachPrompt = `Teach me about ${topic} at ${level || 'beginner'} level`
        const result = await vicAI.think(teachPrompt, { type: 'teach', level: level || 'beginner' })

        res.json({
            success: true,
            response: result.response.content,
            type: result.response.type,
            topic,
            level: level || 'beginner',
            metadata: {
                qualityScore: result.quality.quality.score,
                complianceStatus: result.compliance.compliant ? 'passed' : 'issues',
                processingTime: result.metadata.processingTime,
                system: 'vic-ai-beta'
            },
            analysis: {
                emotion: result.analysis.mood.dominantEmotion,
                intent: result.analysis.intent.intent
            },
            quality: {
                score: result.quality.quality.score,
                issues: result.quality.issues.length,
                suggestions: result.quality.suggestions.length
            },
            compliance: {
                status: result.compliance.compliant ? 'compliant' : 'violations',
                violations: result.compliance.violations.length
            }
        })
    } catch (error) {
        console.error('VicAIBeta Teaching Error:', error.message)
        res.status(500).json({ error: 'Failed to generate enhanced teaching content' })
    }
})

export default router
