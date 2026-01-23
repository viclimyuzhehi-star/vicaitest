/**
 * VIC AI API CLIENT
 * Frontend service to communicate with the secure backend
 */

const API_BASE_URL = 'http://localhost:3001/api'

/**
 * Storage for auth token
 */
let authToken = localStorage.getItem('vic_auth_token') || null

/**
 * Set authentication token
 */
export function setAuthToken(token) {
    authToken = token
    if (token) {
        localStorage.setItem('vic_auth_token', token)
    } else {
        localStorage.removeItem('vic_auth_token')
    }
}

/**
 * Get current auth token
 */
export function getAuthToken() {
    return authToken
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
    return !!authToken
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    }

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'API request failed')
        }

        return data
    } catch (error) {
        // If server is not running, fall back to local AI
        if (error.message.includes('fetch')) {
            console.warn('Backend server not available, using local fallback')
            return null
        }
        throw error
    }
}

// ============ AUTH API ============

/**
 * Register a new user
 */
export async function register(email, password, name = '') {
    const result = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name })
    })
    return result
}

/**
 * Login user
 */
export async function login(email, password) {
    const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    })

    if (result?.token) {
        setAuthToken(result.token)
    }

    return result
}

/**
 * Logout user
 */
export function logout() {
    setAuthToken(null)
    return { success: true }
}

/**
 * Verify current token
 */
export async function verifyAuth() {
    if (!authToken) return { valid: false }

    try {
        const result = await apiRequest('/auth/verify')
        return result
    } catch {
        setAuthToken(null)
        return { valid: false }
    }
}

// ============ AI API ============

/**
 * Send chat message to AI
 */
export async function sendChatMessage(message, context = {}) {
    const result = await apiRequest('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, context })
    })

    return result
}

/**
 * Generate code
 */
export async function generateCode(request, language = 'javascript', framework = null) {
    const result = await apiRequest('/ai/code', {
        method: 'POST',
        body: JSON.stringify({ request, language, framework })
    })

    return result
}

/**
 * Get teaching content
 */
export async function getTeachingContent(topic, level = 'beginner') {
    const result = await apiRequest('/ai/teach', {
        method: 'POST',
        body: JSON.stringify({ topic, level })
    })

    return result
}

// ============ API KEYS ============

/**
 * Generate new API key
 */
export async function generateApiKey(name = 'default') {
    const result = await apiRequest('/keys/generate', {
        method: 'POST',
        body: JSON.stringify({ name })
    })

    return result
}

/**
 * Get all API keys
 */
export async function getApiKeys() {
    const result = await apiRequest('/keys')
    return result?.keys || []
}

/**
 * Revoke API key
 */
export async function revokeApiKey(keyId) {
    const result = await apiRequest(`/keys/${keyId}`, {
        method: 'DELETE'
    })

    return result
}

/**
 * Store external API key
 */
export async function storeExternalKey(provider, apiKey) {
    const result = await apiRequest('/keys/external', {
        method: 'POST',
        body: JSON.stringify({ provider, apiKey })
    })

    return result
}

// ============ HEALTH CHECK ============

/**
 * Check if backend server is running
 */
export async function checkServerHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`)
        const data = await response.json()
        return { online: true, ...data }
    } catch {
        return { online: false }
    }
}

export default {
    // Auth
    register,
    login,
    logout,
    verifyAuth,
    isAuthenticated,
    setAuthToken,
    getAuthToken,

    // AI
    sendChatMessage,
    generateCode,
    getTeachingContent,

    // Keys
    generateApiKey,
    getApiKeys,
    revokeApiKey,
    storeExternalKey,

    // Health
    checkServerHealth
}
