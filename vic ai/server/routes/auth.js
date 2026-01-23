/**
 * AUTHENTICATION ROUTES
 * User registration, login, and session management
 */

import express from 'express'
import { registerUser, loginUser, verifyToken } from '../services/userService.js'

const router = express.Router()

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
        }

        const user = await registerUser(email, password, name)

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

/**
 * POST /api/auth/login
 * Login and get JWT token
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
        }

        const result = await loginUser(email, password)

        res.json({
            success: true,
            message: 'Login successful',
            token: result.token,
            user: result.user
        })
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
})

/**
 * GET /api/auth/verify
 * Verify JWT token
 */
router.get('/verify', async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' })
        }

        const token = authHeader.split(' ')[1]
        const user = await verifyToken(token)

        res.json({
            valid: true,
            user
        })
    } catch (error) {
        res.status(401).json({ valid: false, error: error.message })
    }
})

/**
 * POST /api/auth/logout
 * Logout (client-side token removal)
 */
router.post('/logout', (req, res) => {
    // JWT tokens are stateless, so logout is handled client-side
    res.json({
        success: true,
        message: 'Logged out successfully'
    })
})

export default router
