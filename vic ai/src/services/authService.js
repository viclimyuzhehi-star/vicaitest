// Authentication Service
const AUTH_STORAGE_KEY = 'vic-ai-user'
const AUTH_STATE_KEY = 'vic-ai-auth-state'

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

// Set user data
export const setUser = (user) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
}

// Clear user data (sign out)
export const signOut = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(AUTH_STATE_KEY)
}

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getCurrentUser()
}

// Sign up with email
export const signUpWithEmail = async (email, password, name) => {
  // Simulate API call - in production, this would call your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = {
        id: Date.now().toString(),
        email,
        name: name || email.split('@')[0],
        provider: 'email',
        createdAt: new Date().toISOString(),
      }
      setUser(user)
      resolve(user)
    }, 500)
  })
}

// Sign up with GitHub (simulated)
export const signUpWithGitHub = async () => {
  // Simulate GitHub OAuth - in production, integrate with GitHub OAuth
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = {
        id: Date.now().toString(),
        email: `github-user-${Date.now()}@github.vicai.com`,
        name: 'GitHub User',
        provider: 'github',
        avatar: 'https://github.com/identicons/github.png',
        createdAt: new Date().toISOString(),
      }
      setUser(user)
      resolve(user)
    }, 500)
  })
}

// Sign up with Google (simulated)
export const signUpWithGoogle = async () => {
  // Simulate Google OAuth - in production, integrate with Google OAuth
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = {
        id: Date.now().toString(),
        email: `google-user-${Date.now()}@google.vicai.com`,
        name: 'Google User',
        provider: 'google',
        avatar: 'https://www.gstatic.com/images/branding/product/1x/gsa_48dp.png',
        createdAt: new Date().toISOString(),
      }
      setUser(user)
      resolve(user)
    }, 500)
  })
}
