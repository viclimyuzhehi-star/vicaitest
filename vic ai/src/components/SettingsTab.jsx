import { useState } from 'react'
import { getCurrentUser, signOut } from '../services/authService'

function SettingsTab({ onSignOut }) {
  const user = getCurrentUser()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = () => {
    setIsSigningOut(true)
    setTimeout(() => {
      signOut()
      onSignOut()
      setIsSigningOut(false)
    }, 500)
  }

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="p-6 border-b border-white/10 glass-effect backdrop-blur-xl">
        <div className="max-w-5xl mx-auto animate-fadeIn">
          <h2 className="text-3xl font-bold gradient-text mb-2">Settings</h2>
          <p className="text-sm text-gray-400">Manage your account and preferences</p>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
          {/* Account Section */}
          <div className="glass-effect border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              Account Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-4 text-white">
                  {user?.email || 'No email found'}
                </div>
              </div>

              {user?.name && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-4 text-white">
                    {user.name}
                  </div>
                </div>
              )}

              {user?.provider && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Sign in method</label>
                  <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-4 text-white capitalize">
                    {user.provider}
                  </div>
                </div>
              )}

              {user?.createdAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Member since</label>
                  <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-4 text-white">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions Section */}
          <div className="glass-effect border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              Actions
            </h3>
            
            <div className="space-y-4">
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="w-full bg-gradient-to-br from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-red-500/30 disabled:shadow-none relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSigningOut ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Signing out...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="glass-effect border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              About Vic AI Studio
            </h3>
            
            <div className="space-y-3 text-gray-400 text-sm">
              <p>Version 2.0.0</p>
              <p>Vic AI Studio - Your AI-powered development companion</p>
              <p className="pt-2 text-xs">Generate code, images, videos, and build amazing projects with the power of AI.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsTab
