/**
 * SECURITY CONFIGURATION
 * AES-256-GCM encryption for sensitive data
 */

import crypto from 'crypto'
import env from './env.js'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16

// Get encryption key from centralized config
function getEncryptionKey() {
    return env.encryptionKey
}

/**
 * Encrypt sensitive data using AES-256-GCM
 * @param {string} text - Plain text to encrypt
 * @returns {string} - Encrypted string (iv:authTag:encrypted)
 */
export function encrypt(text) {
    if (!text) return null

    const iv = crypto.randomBytes(IV_LENGTH)
    const key = getEncryptionKey()
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const authTag = cipher.getAuthTag()

    // Format: iv:authTag:encryptedData
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

/**
 * Decrypt data encrypted with encrypt()
 * @param {string} encryptedText - Encrypted string from encrypt()
 * @returns {string} - Original plain text
 */
export function decrypt(encryptedText) {
    if (!encryptedText) return null

    try {
        const parts = encryptedText.split(':')
        if (parts.length !== 3) throw new Error('Invalid encrypted format')

        const iv = Buffer.from(parts[0], 'hex')
        const authTag = Buffer.from(parts[1], 'hex')
        const encrypted = parts[2]

        const key = getEncryptionKey()
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
        decipher.setAuthTag(authTag)

        let decrypted = decipher.update(encrypted, 'hex', 'utf8')
        decrypted += decipher.final('utf8')

        return decrypted
    } catch (error) {
        console.error('Decryption failed:', error.message)
        return null
    }
}

/**
 * Generate a secure random token
 * @param {number} length - Length of token in bytes
 * @returns {string} - Hex string token
 */
export function generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex')
}

/**
 * Hash a string using SHA-256
 * @param {string} text - Text to hash
 * @returns {string} - Hash hex string
 */
export function hash(text) {
    return crypto.createHash('sha256').update(text).digest('hex')
}

export default { encrypt, decrypt, generateSecureToken, hash }
