/**
 * CENTRALIZED ENVIRONMENT CONFIGURATION
 * Secure environment variable management with validation
 */

import crypto from 'crypto'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

/**
 * Environment configuration with validation and security
 */
class EnvironmentConfig {
  constructor() {
    this.validateConfiguration()
  }

  /**
   * Validate all required environment variables
   */
  validateConfiguration() {
    const required = ['ENCRYPTION_KEY', 'JWT_SECRET']

    for (const key of required) {
      if (!process.env[key]) {
        throw new Error(`Required environment variable ${key} is not set. Please check your .env file.`)
      }
    }

    // Validate encryption key length
    if (this.encryptionKey.length < 32) {
      throw new Error('ENCRYPTION_KEY must be at least 32 characters long')
    }

    // Validate JWT secret length
    if (this.jwtSecret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long')
    }
  }

  // =============================================
  // SECURITY CONFIGURATION
  // =============================================

  /**
   * Get encryption key (hashed to ensure 32 bytes)
   */
  get encryptionKey() {
    return crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY).digest()
  }

  /**
   * Get JWT secret
   */
  get jwtSecret() {
    return process.env.JWT_SECRET
  }

  /**
   * Get session expiry
   */
  get sessionExpiry() {
    return process.env.SESSION_EXPIRY || '24h'
  }

  // =============================================
  // DATABASE CONFIGURATION
  // =============================================

  /**
   * Get MongoDB URI
   */
  get mongoUri() {
    return process.env.MONGODB_URI || 'mongodb://localhost:27017/vic_ai'
  }

  // =============================================
  // EXTERNAL API KEYS - REMOVED
  // Vic AI operates 100% locally - no external APIs needed
  // =============================================

  /**
   * No external API keys needed - Vic AI is completely self-sufficient
   */
  get availableLLMs() {
    return [] // No external LLMs required - everything runs locally
  }

  // =============================================
  // SERVER CONFIGURATION
  // =============================================

  /**
   * Get server port
   */
  get port() {
    return parseInt(process.env.PORT) || 3001
  }

  /**
   * Get node environment
   */
  get nodeEnv() {
    return process.env.NODE_ENV || 'development'
  }

  /**
   * Check if in production
   */
  get isProduction() {
    return this.nodeEnv === 'production'
  }

  /**
   * Check if in development
   */
  get isDevelopment() {
    return this.nodeEnv === 'development'
  }

  /**
   * Get CORS origins
   */
  get corsOrigins() {
    const origins = process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000'
    return origins.split(',').map(origin => origin.trim())
  }

  // =============================================
  // RATE LIMITING
  // =============================================

  /**
   * Get rate limit window (minutes)
   */
  get rateLimitWindow() {
    return parseInt(process.env.RATE_LIMIT_WINDOW) || 15
  }

  /**
   * Get rate limit max requests
   */
  get rateLimitMax() {
    return parseInt(process.env.RATE_LIMIT_MAX) || 100
  }

  // =============================================
  // LOGGING & MONITORING
  // =============================================

  /**
   * Get log level
   */
  get logLevel() {
    return process.env.LOG_LEVEL || 'info'
  }

  /**
   * Check if request logging is enabled
   */
  get enableRequestLogging() {
    return process.env.ENABLE_REQUEST_LOGGING !== 'false'
  }

  // =============================================
  // FILE STORAGE
  // =============================================

  /**
   * Get upload directory
   */
  get uploadDir() {
    return process.env.UPLOAD_DIR || './uploads'
  }

  /**
   * Get max file size
   */
  get maxFileSize() {
    return parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB
  }

  // =============================================
  // CACHE CONFIGURATION
  // =============================================

  /**
   * Get Redis URL
   */
  get redisUrl() {
    return process.env.REDIS_URL
  }

  /**
   * Get cache TTL
   */
  get cacheTtl() {
    return parseInt(process.env.CACHE_TTL) || 3600
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  /**
   * Get configuration summary (safe for logging)
   */
  getConfigSummary() {
    return {
      port: this.port,
      nodeEnv: this.nodeEnv,
      mongoUri: this.mongoUri ? '[CONFIGURED]' : '[NOT SET]',
      availableLLMs: this.availableLLMs.map(llm => ({ name: llm.name, configured: !!llm.key })),
      corsOrigins: this.corsOrigins,
      rateLimitWindow: this.rateLimitWindow,
      rateLimitMax: this.rateLimitMax,
      logLevel: this.logLevel,
      enableRequestLogging: this.enableRequestLogging,
      uploadDir: this.uploadDir,
      maxFileSize: this.maxFileSize,
      redisUrl: this.redisUrl ? '[CONFIGURED]' : '[NOT SET]',
      cacheTtl: this.cacheTtl
    }
  }

  /**
   * No external API validation needed - Vic AI is self-sufficient
   */
  validateApiKeys() {
    return [] // No external APIs to validate
  }

  /**
   * Get security status
   */
  getSecurityStatus() {
    return {
      encryptionKeyLength: process.env.ENCRYPTION_KEY?.length || 0,
      jwtSecretLength: this.jwtSecret.length,
      hasExternalLLMs: this.availableLLMs.length > 0,
      validationIssues: this.validateApiKeys()
    }
  }
}

// Export singleton instance
const env = new EnvironmentConfig()

export default env
export { EnvironmentConfig }