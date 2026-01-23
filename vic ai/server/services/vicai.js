/**
 * VIC AI - Importable AI Package
 * 
 * Usage:
 * import { VicAI, generateResponse, chat, code, teach } from 'vic-ai'
 * 
 * // Or use the class
 * const vic = new VicAI({ apiKey: 'your-key' })
 * const response = await vic.chat('Hello!')
 */

// Import core modules
import { generateAIResponse, streamAIResponse, Content, Part, GenerateContentResponse } from './aiEngine.js'
import security from '../config/security.js'

/**
 * VicAI Client Class - Main entry point for the AI
 */
export class VicAI {
    constructor(config = {}) {
        this.apiKey = config.apiKey || null
        this.baseUrl = config.baseUrl || 'http://localhost:3001/api'
        this.timeout = config.timeout || 30000
        this.maxRetries = config.maxRetries || 3
        this._authenticated = false
    }

    /**
     * No authentication required - Vic AI operates locally and openly
     */
    async authenticate() {
        this._authenticated = true
        return { authenticated: true, userId: 'local-user' }
    }

    /**
     * Check if authenticated
     */
    isAuthenticated() {
        return this._authenticated
    }

    /**
     * Generate AI response (main method)
     */
    async generate(prompt, options = {}) {
        const response = await generateAIResponse(prompt, options)
        return {
            text: response.text,
            metadata: {
                promptTokens: response.usageMetadata?.promptTokenCount,
                responseTokens: response.usageMetadata?.candidatesTokenCount,
                totalTokens: response.usageMetadata?.totalTokenCount
            }
        }
    }

    /**
     * Chat with the AI
     */
    async chat(message, context = {}) {
        return this.generate(message, { ...context, mode: 'chat' })
    }

    /**
     * Generate code
     */
    async code(request, language = 'javascript') {
        return this.generate(`Create ${language} code: ${request}`, { mode: 'code', language })
    }

    /**
     * Get teaching content
     */
    async teach(topic, level = 'beginner') {
        return this.generate(`Explain ${topic} for a ${level}`, { mode: 'teach', level })
    }

    /**
     * Stream response (async generator)
     */
    async *stream(prompt, options = {}) {
        for await (const chunk of streamAIResponse(prompt, options)) {
            yield chunk
        }
    }
}

/**
 * Quick helper functions for simple usage
 */
export async function generateResponse(prompt, options = {}) {
    const response = await generateAIResponse(prompt, options)
    return response.text
}

export async function chat(message) {
    const response = await generateAIResponse(message, { mode: 'chat' })
    return response.text
}

export async function code(request, language = 'javascript') {
    const response = await generateAIResponse(`Create ${language} code: ${request}`, { mode: 'code' })
    return response.text
}

export async function teach(topic) {
    const response = await generateAIResponse(`Explain ${topic}`, { mode: 'teach' })
    return response.text
}

/**
 * Create a new VicAI instance with configuration
 */
export function createVicAI(config = {}) {
    return new VicAI(config)
}

// Export types and utilities
export { Content, Part, GenerateContentResponse }
export { security }

// Default export
export default VicAI
