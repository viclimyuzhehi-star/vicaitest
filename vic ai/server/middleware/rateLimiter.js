/**
 * RATE LIMITER & ABUSE DETECTION
 * Intelligent abuse detection with automatic timeout
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { encrypt, decrypt } from '../config/security.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '../data')
const ABUSE_LOG_FILE = path.join(DATA_DIR, 'abuse.encrypted.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
}

/**
 * Rate limiting configuration
 */
const RATE_LIMITS = {
    requestsPerMinute: 60,        // Max requests per minute
    requestsPerHour: 500,         // Max requests per hour
    burstLimit: 10,               // Max requests in 5 seconds (burst)
    minRequestInterval: 100,      // Minimum ms between requests
    timeoutDuration: 2 * 60 * 1000 // 2 minute timeout
}

/**
 * Abuse detection thresholds
 */
const ABUSE_THRESHOLDS = {
    rapidFireCount: 20,           // 20 requests in 10 seconds = abuse
    rapidFireWindow: 10 * 1000,   // 10 seconds
    errorRateThreshold: 0.5,      // 50% error rate = suspicious
    errorWindow: 60 * 1000,       // 1 minute window for error rate
    suspiciousPatterns: 5,        // 5 suspicious patterns = abuse
    repeatedIdenticalRequests: 10 // 10 identical requests = abuse
}

/**
 * Request tracker for each API key/user
 */
class RequestTracker {
    constructor() {
        this.requests = new Map() // keyId -> request history
        this.timeouts = new Map() // keyId -> timeout expiry
        this.suspicionScores = new Map() // keyId -> suspicion score
    }

    /**
     * Load persisted abuse data
     */
    loadAbuseData() {
        try {
            if (fs.existsSync(ABUSE_LOG_FILE)) {
                const encrypted = fs.readFileSync(ABUSE_LOG_FILE, 'utf8')
                const decrypted = decrypt(encrypted)
                const data = JSON.parse(decrypted)

                // Restore active timeouts
                for (const [keyId, expiry] of Object.entries(data.timeouts || {})) {
                    if (expiry > Date.now()) {
                        this.timeouts.set(keyId, expiry)
                    }
                }

                // Restore suspicion scores
                for (const [keyId, score] of Object.entries(data.suspicionScores || {})) {
                    this.suspicionScores.set(keyId, score)
                }
            }
        } catch (error) {
            console.error('Error loading abuse data:', error.message)
        }
    }

    /**
     * Save abuse data
     */
    saveAbuseData() {
        try {
            const data = {
                timeouts: Object.fromEntries(this.timeouts),
                suspicionScores: Object.fromEntries(this.suspicionScores),
                lastUpdated: new Date().toISOString()
            }
            const encrypted = encrypt(JSON.stringify(data))
            fs.writeFileSync(ABUSE_LOG_FILE, encrypted)
        } catch (error) {
            console.error('Error saving abuse data:', error.message)
        }
    }

    /**
     * Record a request
     */
    recordRequest(keyId, request) {
        if (!this.requests.has(keyId)) {
            this.requests.set(keyId, [])
        }

        const history = this.requests.get(keyId)
        history.push({
            timestamp: Date.now(),
            endpoint: request.endpoint,
            hasError: request.hasError || false,
            contentHash: this.hashContent(request.content)
        })

        // Keep only last 5 minutes of history
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
        this.requests.set(keyId, history.filter(r => r.timestamp > fiveMinutesAgo))
    }

    /**
     * Hash content for duplicate detection
     */
    hashContent(content) {
        if (!content) return null
        const str = typeof content === 'string' ? content : JSON.stringify(content)
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i)
            hash = ((hash << 5) - hash) + char
            hash = hash & hash
        }
        return hash.toString(16)
    }

    /**
     * Check if key is currently timed out
     */
    isTimedOut(keyId) {
        const expiry = this.timeouts.get(keyId)
        if (!expiry) return false

        if (Date.now() > expiry) {
            this.timeouts.delete(keyId)
            this.saveAbuseData()
            return false
        }

        return true
    }

    /**
     * Get remaining timeout in seconds
     */
    getTimeoutRemaining(keyId) {
        const expiry = this.timeouts.get(keyId)
        if (!expiry) return 0
        return Math.max(0, Math.ceil((expiry - Date.now()) / 1000))
    }

    /**
     * Apply timeout to a key
     */
    applyTimeout(keyId, reason) {
        const expiry = Date.now() + RATE_LIMITS.timeoutDuration
        this.timeouts.set(keyId, expiry)

        // Increase suspicion score
        const currentScore = this.suspicionScores.get(keyId) || 0
        this.suspicionScores.set(keyId, currentScore + 1)

        this.saveAbuseData()

        console.log(`[SECURITY] Timeout applied to ${keyId}: ${reason}`)

        return {
            timedOut: true,
            reason,
            expiresIn: RATE_LIMITS.timeoutDuration / 1000,
            totalViolations: currentScore + 1
        }
    }

    /**
     * Get request history for key
     */
    getHistory(keyId) {
        return this.requests.get(keyId) || []
    }
}

// Global tracker instance
const tracker = new RequestTracker()
tracker.loadAbuseData()

/**
 * ABUSE DETECTION ENGINE
 */
class AbuseDetector {
    /**
     * Analyze request pattern for abuse
     */
    static analyze(keyId, request) {
        const history = tracker.getHistory(keyId)
        const now = Date.now()

        const violations = []

        // 1. Check rapid-fire requests
        const recentRequests = history.filter(r => r.timestamp > now - ABUSE_THRESHOLDS.rapidFireWindow)
        if (recentRequests.length >= ABUSE_THRESHOLDS.rapidFireCount) {
            violations.push({
                type: 'RAPID_FIRE',
                severity: 'HIGH',
                message: `${recentRequests.length} requests in ${ABUSE_THRESHOLDS.rapidFireWindow / 1000}s`
            })
        }

        // 2. Check burst requests (too fast)
        const burstRequests = history.filter(r => r.timestamp > now - 5000)
        if (burstRequests.length > RATE_LIMITS.burstLimit) {
            violations.push({
                type: 'BURST',
                severity: 'MEDIUM',
                message: `${burstRequests.length} requests in 5s exceeds burst limit`
            })
        }

        // 3. Check for repeated identical requests
        const contentHash = tracker.hashContent(request.content)
        if (contentHash) {
            const identicalRecent = history.filter(r =>
                r.contentHash === contentHash && r.timestamp > now - 60000
            )
            if (identicalRecent.length >= ABUSE_THRESHOLDS.repeatedIdenticalRequests) {
                violations.push({
                    type: 'DUPLICATE_SPAM',
                    severity: 'HIGH',
                    message: `${identicalRecent.length} identical requests detected`
                })
            }
        }

        // 4. Check error rate (might be brute forcing)
        const minuteHistory = history.filter(r => r.timestamp > now - ABUSE_THRESHOLDS.errorWindow)
        if (minuteHistory.length >= 10) {
            const errorRate = minuteHistory.filter(r => r.hasError).length / minuteHistory.length
            if (errorRate >= ABUSE_THRESHOLDS.errorRateThreshold) {
                violations.push({
                    type: 'HIGH_ERROR_RATE',
                    severity: 'MEDIUM',
                    message: `${Math.round(errorRate * 100)}% error rate is suspicious`
                })
            }
        }

        // 5. Check requests per minute
        const minuteRequests = history.filter(r => r.timestamp > now - 60000)
        if (minuteRequests.length > RATE_LIMITS.requestsPerMinute) {
            violations.push({
                type: 'RATE_LIMIT',
                severity: 'MEDIUM',
                message: `Exceeded ${RATE_LIMITS.requestsPerMinute} requests/minute`
            })
        }

        // 6. Check minimum interval
        if (history.length > 0) {
            const lastRequest = history[history.length - 1]
            const interval = now - lastRequest.timestamp
            if (interval < RATE_LIMITS.minRequestInterval) {
                violations.push({
                    type: 'TOO_FAST',
                    severity: 'LOW',
                    message: `Request interval ${interval}ms is below minimum`
                })
            }
        }

        return {
            isAbuse: violations.some(v => v.severity === 'HIGH') || violations.length >= 3,
            violations,
            severity: violations.some(v => v.severity === 'HIGH') ? 'HIGH' :
                violations.some(v => v.severity === 'MEDIUM') ? 'MEDIUM' : 'LOW'
        }
    }
}

/**
 * Rate limiter middleware
 */
export function rateLimiter(keyId, request = {}) {
    // Check if already timed out
    if (tracker.isTimedOut(keyId)) {
        const remaining = tracker.getTimeoutRemaining(keyId)
        return {
            allowed: false,
            reason: 'TIMED_OUT',
            message: `Your API key is temporarily suspended due to abuse. Try again in ${remaining} seconds.`,
            retryAfter: remaining
        }
    }

    // Analyze for abuse
    const analysis = AbuseDetector.analyze(keyId, request)

    // Record this request
    tracker.recordRequest(keyId, {
        endpoint: request.endpoint || 'unknown',
        content: request.content,
        hasError: false
    })

    // If abuse detected, apply timeout
    if (analysis.isAbuse) {
        const timeout = tracker.applyTimeout(keyId, analysis.violations.map(v => v.message).join('; '))
        return {
            allowed: false,
            reason: 'ABUSE_DETECTED',
            message: `Abuse detected: ${analysis.violations[0]?.message}. Your API key is suspended for 2 minutes.`,
            retryAfter: timeout.expiresIn,
            violations: analysis.violations
        }
    }

    // If high severity warnings, return warning but allow
    if (analysis.severity === 'MEDIUM') {
        return {
            allowed: true,
            warning: true,
            message: 'Warning: You are approaching rate limits. Slow down to avoid suspension.',
            violations: analysis.violations
        }
    }

    return { allowed: true }
}

/**
 * Record an error for a key
 */
export function recordError(keyId) {
    tracker.recordRequest(keyId, {
        endpoint: 'error',
        hasError: true
    })
}

/**
 * Get abuse status for a key
 */
export function getAbuseStatus(keyId) {
    const isTimedOut = tracker.isTimedOut(keyId)
    const remaining = tracker.getTimeoutRemaining(keyId)
    const suspicionScore = tracker.suspicionScores.get(keyId) || 0
    const history = tracker.getHistory(keyId)

    return {
        isTimedOut,
        timeoutRemaining: remaining,
        suspicionScore,
        recentRequests: history.length,
        status: isTimedOut ? 'SUSPENDED' :
            suspicionScore > 5 ? 'HIGH_RISK' :
                suspicionScore > 2 ? 'WARNED' : 'GOOD'
    }
}

/**
 * Clear timeout (admin function)
 */
export function clearTimeout(keyId) {
    tracker.timeouts.delete(keyId)
    tracker.saveAbuseData()
    return { cleared: true }
}

export { tracker, AbuseDetector, RATE_LIMITS, ABUSE_THRESHOLDS }
export default { rateLimiter, recordError, getAbuseStatus, clearTimeout }
