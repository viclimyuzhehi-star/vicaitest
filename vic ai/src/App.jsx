import { useState, useEffect } from 'react'
import BuildTab from './components/BuildTab'
import ProjectsTab from './components/ProjectsTab'
import VicAITab from './components/VicAITab'
import VicAPITab from './components/VicAPITab'
import SettingsTab from './components/SettingsTab'
import SignUp from './components/SignUp'
import { isAuthenticated, getCurrentUser } from './services/authService'

function App() {
  const [activeTab, setActiveTab] = useState('build')
  const [authenticated, setAuthenticated] = useState(isAuthenticated())
  const [user, setUser] = useState(getCurrentUser())
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('vic-ai-projects')
    return saved ? JSON.parse(saved) : []
  })
  useEffect(() => {
    localStorage.setItem('vic-ai-projects', JSON.stringify(projects))
  }, [projects])

  // Vic AI operates without API keys - everything runs locally

  const handleSignUp = (userData) => {
    setUser(userData)
    setAuthenticated(true)
  }

  const handleSignOut = () => {
    setAuthenticated(false)
    setUser(null)
    setActiveTab('build')
  }

  const tabs = [
    { id: 'build', label: 'Build' },
    { id: 'projects', label: 'Projects' },
    { id: 'vic-ai', label: 'Vic AI' },
    { id: 'vic-api', label: 'Vic API' },
    { id: 'settings', label: 'Settings' },
  ]

  // Show sign up if not authenticated
  if (!authenticated) {
    return <SignUp onSignUp={handleSignUp} />
  }

  const addProject = (project) => {
    const newProject = {
      id: Date.now().toString(),
      name: project.name || `Project ${projects.length + 1}`,
      idea: project.idea,
      frontend: project.frontend,
      backend: project.backend,
      middleware: project.middleware,
      files: project.files,
      createdAt: new Date().toISOString(),
    }
    setProjects([...projects, newProject])
    return newProject.id
  }

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id))
  }

  // Vic AI operates without API keys

  // No API key revocation needed

  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col relative overflow-hidden scanline-effect">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10 animate-pulse pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 neural-flow-bg opacity-30 pointer-events-none"></div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative z-10">
        <div key={activeTab} className="h-full animate-fadeIn transition-all duration-500">
          {activeTab === 'build' && <BuildTab onProjectGenerated={addProject} />}
          {activeTab === 'projects' && (
            <ProjectsTab
              projects={projects}
              onDelete={deleteProject}
            />
          )}
          {activeTab === 'vic-ai' && <VicAITab />}
          {activeTab === 'vic-api' && <VicAPITab />}
          {activeTab === 'settings' && (
            <SettingsTab onSignOut={handleSignOut} />
          )}
        </div>
      </div>

      {/* Bottom Tab Navigation */}
      <div className="h-20 glass-plus border-t border-white/10 flex items-center justify-center relative z-20">
        <div className="flex gap-2 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-8 h-14 rounded-xl font-semibold transition-all duration-300 ease-out relative
                transform hover:scale-105 active:scale-95
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-700/50'
                }
              `}
            >
              <span className="relative z-10">{tab.label}</span>
              {activeTab === tab.id && (
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-50"></span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
