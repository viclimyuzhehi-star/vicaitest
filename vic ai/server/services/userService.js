/**
 * USER SERVICE
 * Secure user registration, login, and session management
 */

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { generateSecureToken } from '../config/security.js'
import env from '../config/env.js'
import vault from './vaultService.js'

/**
 * Load users from vault
 */
async function loadUsers() {
    try {
        const usersData = await vault.retrieve('users')
        return usersData || {}
    } catch (error) {
        console.error('Error loading users from vault:', error.message)
        return {}
    }
}

/**
 * Save users to vault
 */
async function saveUsers(users) {
    try {
        await vault.store('users', 'user_data', users, 'system')
        return true
    } catch (error) {
        console.error('Error saving users to vault:', error.message)
        return false
    }
}

/**
 * Register a new user
 */
export async function registerUser(email, password, name = '') {
    if (!email || !password) {
        throw new Error('Email and password are required')
    }

    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters')
    }

    const users = await loadUsers()
    const emailLower = email.toLowerCase()

    if (users[emailLower]) {
        throw new Error('User already exists')
    }

    // Hash password with bcrypt (10 rounds)
    const passwordHash = await bcrypt.hash(password, 10)

    const userId = generateSecureToken(16)

    users[emailLower] = {
        id: userId,
        email: emailLower,
        name: name,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        preferences: {},
        conversationHistory: []
    }

    await saveUsers(users)

    return {
        id: userId,
        email: emailLower,
        name: name
    }
}

/**
 * Login user and return JWT token
 */
export async function loginUser(email, password) {
    if (!email || !password) {
        throw new Error('Email and password are required')
    }

    const users = await loadUsers()
    const emailLower = email.toLowerCase()
    const user = users[emailLower]

    if (!user) {
        throw new Error('Invalid credentials')
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
        throw new Error('Invalid credentials')
    }

    // Update last login
    user.lastLogin = new Date().toISOString()
    await saveUsers(users)

    // Generate JWT token
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        env.jwtSecret,
        { expiresIn: env.sessionExpiry }
    )

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name
        }
    }
}

/**
 * Verify JWT token and return user
 */
export async function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, env.jwtSecret)
        const users = await loadUsers()
        const user = Object.values(users).find(u => u.id === decoded.userId)

        if (!user) {
            throw new Error('User not found')
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name
        }
    } catch (error) {
        throw new Error('Invalid token')
    }
}

/**
 * Get user by ID
 */
export async function getUserById(userId) {
    const users = await loadUsers()
    const user = Object.values(users).find(u => u.id === userId)

    if (!user) return null

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        preferences: user.preferences,
        createdAt: user.createdAt
    }
}

/**
 * Save conversation to user history
 */
export async function saveConversation(userId, message, response) {
    const users = await loadUsers()
    const user = Object.values(users).find(u => u.id === userId)

    if (!user) return false

    user.conversationHistory.push({
        timestamp: new Date().toISOString(),
        message,
        response
    })

    // Keep only last 100 conversations
    if (user.conversationHistory.length > 100) {
        user.conversationHistory = user.conversationHistory.slice(-100)
    }

    return await saveUsers(users)
}

export default { registerUser, loginUser, verifyToken, getUserById, saveConversation }
