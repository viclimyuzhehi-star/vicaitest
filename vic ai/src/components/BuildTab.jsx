import { useState } from 'react'
import LivePreview from './LivePreview'
import CodeViewer from './CodeViewer'
import { generateAppCode } from '../services/llmService'
import { getAllTemplates, getTemplate } from '../services/projectTemplates'

function BuildTab({ onProjectGenerated }) {
  const [idea, setIdea] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState(null)
  const [error, setError] = useState(null)
  const [generationProgress, setGenerationProgress] = useState('')

  const handleTemplateSelect = async (templateKey) => {
    const template = getTemplate(templateKey)
    if (!template) return

    setIsGenerating(true)
    setError(null)
    setGenerationProgress(`🎨 Loading ${template.name} template...`)

    try {
      // Convert template structure to project format
      const allFiles = []
      
      if (template.structure.frontend) {
        Object.entries(template.structure.frontend).forEach(([path, code]) => {
          allFiles.push({
            name: path,
            code: code,
            type: 'frontend'
          })
        })
      }
      
      if (template.structure.backend) {
        Object.entries(template.structure.backend).forEach(([path, code]) => {
          allFiles.push({
            name: path,
            code: code,
            type: 'backend'
          })
        })
      }

      const codeData = {
        frontend: allFiles.filter(f => f.type === 'frontend').map(f => f.code).join('\n\n'),
        backend: allFiles.filter(f => f.type === 'backend').map(f => f.code).join('\n\n'),
        middleware: '',
        files: allFiles,
        idea: template.description,
        name: template.name,
        isTemplate: true,
        templateKey: templateKey
      }

      setGeneratedCode(codeData)
      setGenerationProgress('Template loaded!')
      setIsGenerating(false)
      
      // Auto-save to projects
      onProjectGenerated(codeData)
    } catch (err) {
      console.error('Template error:', err)
      setError(err.message || 'Failed to load template. Please try again.')
      setIsGenerating(false)
      setGenerationProgress('')
    }
  }

  const generateCode = async () => {
    if (!idea.trim()) return

    // No API token needed - everything runs locally!
    setIsGenerating(true)
    setError(null)
    setGenerationProgress('Initializing AI generation...')

    try {
      const projectName = idea.split(' ').slice(0, 3).join(' ') || 'New Project'

      // Enhanced language detection
      const lowerIdea = idea.toLowerCase()
      let language = 'javascript'
      if (lowerIdea.includes('python') || lowerIdea.includes('flask') || lowerIdea.includes('django') || lowerIdea.includes('fastapi')) {
        language = 'python'
      } else if (lowerIdea.includes('typescript') || lowerIdea.includes('ts ')) {
        language = 'typescript'
      } else if (lowerIdea.includes('java') || lowerIdea.includes('spring')) {
        language = 'java'
      } else if (lowerIdea.includes('react') || lowerIdea.includes('vue') || lowerIdea.includes('angular') || lowerIdea.includes('next.js')) {
        language = 'javascript'
      } else if (lowerIdea.includes('rust')) {
        language = 'rust'
      } else if (lowerIdea.includes('go ') || lowerIdea.includes('golang')) {
        language = 'go'
      }

      // Generate frontend with ENHANCED prompt for production quality
      setGenerationProgress('🧠 Generating PRODUCTION-READY frontend code with local AI engine...')
      const frontendPrompt = `Generate a COMPLETE, ENTERPRISE-GRADE frontend application for: "${idea}". 
CRITICAL REQUIREMENTS:
- Modern, beautiful UI/UX with fully responsive design (mobile, tablet, desktop)
- React/Vue/Angular components with proper component architecture
- Professional styling using Tailwind CSS or styled-components
- Complete state management (Redux/Context API/Zustand)
- Comprehensive error handling and loading states
- Form validation and user feedback
- Accessibility features (ARIA labels, keyboard navigation)
- Performance optimization (lazy loading, code splitting)
- SEO optimization
- Dark mode support
- All components fully functional with zero placeholders
- Production-ready code following industry best practices
Generate the COMPLETE frontend code now (NO placeholders, NO incomplete functions):`
      const frontendCode = await generateAppCode(frontendPrompt, language)

      // Generate backend with ENHANCED prompt for production quality
      setGenerationProgress('🔧 Generating PRODUCTION-READY backend API with enterprise features...')
      const backendPrompt = `Generate a COMPLETE, ENTERPRISE-GRADE backend API for: "${idea}". 
CRITICAL REQUIREMENTS:
- RESTful API with Express/Node.js (or FastAPI/Django for Python)
- Proper MVC/MVP architecture with separation of concerns
- Complete route structure with controllers, services, and models
- Database integration (MongoDB/PostgreSQL/SQLite) with proper schema
- JWT-based authentication and role-based authorization
- Comprehensive input validation and sanitization
- Error handling middleware with proper HTTP status codes
- Request logging and monitoring
- Rate limiting and security headers
- API documentation (Swagger/OpenAPI)
- Environment configuration management
- Database migrations and seeding
- Unit and integration test examples
- All endpoints fully implemented with zero TODOs
- Production-ready code with security best practices
Generate the COMPLETE backend code now (NO placeholders, NO incomplete functions):`
      const backendCode = await generateAppCode(backendPrompt, language)

      // Generate middleware with ENHANCED prompt for production quality
      setGenerationProgress('⚙️ Generating enterprise middleware and configuration...')
      const middlewarePrompt = `Generate COMPLETE middleware, configuration, and infrastructure code for: "${idea}". 
CRITICAL REQUIREMENTS:
- CORS configuration with proper origins
- Authentication and authorization middleware
- Comprehensive error handling middleware
- Request/response logging with Winston/Morgan
- Rate limiting with Redis or in-memory store
- Security headers (Helmet, CSP)
- Input sanitization middleware
- Environment variable configuration with validation
- Database connection pooling and migrations
- Docker configuration (Dockerfile, docker-compose)
- CI/CD pipeline configuration (GitHub Actions/GitLab CI)
- Testing setup (Jest/Mocha with examples)
- API documentation setup
- Monitoring and health check endpoints
- All configurations production-ready
Generate ALL middleware and configuration code now (NO placeholders):`
      const middlewareCode = await generateAppCode(middlewarePrompt, language)

      // Parse and structure files
      const parseCodeIntoFiles = (code, prefix, type) => {
        const files = []
        const codeBlockRegex = /```(?:(\w+))?\n([\s\S]*?)```/g
        let match
        let fileIndex = 1

        while ((match = codeBlockRegex.exec(code)) !== null) {
          const lang = match[1] || 'js'
          const codeContent = match[2].trim()
          const ext = lang === 'python' ? 'py' : lang === 'jsx' ? 'jsx' : lang === 'typescript' ? 'ts' : 'js'
          files.push({
            name: `${prefix}/${prefix === 'frontend' ? 'component' : 'server'}${fileIndex}.${ext}`,
            code: codeContent,
            type: type
          })
          fileIndex++
        }

        // If no code blocks found, use the whole code
        if (files.length === 0 && code.trim()) {
          files.push({
            name: `${prefix}/main.${language === 'python' ? 'py' : 'js'}`,
            code: code.trim(),
            type: type
          })
        }

        return files
      }

      const frontendFiles = parseCodeIntoFiles(frontendCode, 'frontend', 'frontend')
      const backendFiles = parseCodeIntoFiles(backendCode, 'backend', 'backend')
      const middlewareFiles = parseCodeIntoFiles(middlewareCode, 'middleware', 'middleware')

      const allFiles = [...frontendFiles, ...backendFiles, ...middlewareFiles]

      // Add package.json if JavaScript project
      if (language === 'javascript') {
        allFiles.push({
          name: 'package.json',
          code: JSON.stringify({
            name: projectName.toLowerCase().replace(/\s/g, '-'),
            version: '1.0.0',
            scripts: {
              start: 'node backend/server.js',
              dev: 'nodemon backend/server.js'
            },
            dependencies: {
              express: '^4.18.2',
              cors: '^2.8.5',
              helmet: '^7.0.0'
            }
          }, null, 2),
          type: 'backend'
        })
      }

      const codeData = {
        frontend: frontendCode,
        backend: backendCode,
        middleware: middlewareCode,
        files: allFiles,
        idea,
        name: projectName,
      }

      setGeneratedCode(codeData)
      setGenerationProgress('Generation complete!')
      setIsGenerating(false)

      // Auto-save to projects
      onProjectGenerated(codeData)
    } catch (err) {
      console.error('Generation error:', err)
      setError(err.message || 'Failed to generate code. Please try again.')
      setIsGenerating(false)
      setGenerationProgress('')
    }
  }

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Top Section - Input Area */}
      <div className="p-8 border-b border-white/10 glass-effect backdrop-blur-xl">
        <div className="max-w-5xl mx-auto animate-fadeIn">
          <h2 className="text-3xl font-bold mb-2 gradient-text">Build Your Project</h2>
          <p className="text-gray-400 mb-4 text-sm">Transform your ideas into full-stack applications instantly with AI-powered code generation</p>
          
          {/* Project Templates Section */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-3 font-semibold">🚀 One-Click Project Templates:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
              {getAllTemplates().map((template) => (
                <button
                  key={template.key}
                  onClick={() => handleTemplateSelect(template.key)}
                  className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 hover:from-blue-600/40 hover:to-purple-600/40 border border-blue-500/30 hover:border-blue-400/50 text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 group"
                >
                  <div className="text-2xl mb-1">{template.icon}</div>
                  <div className="text-xs font-semibold group-hover:text-blue-300 transition-colors">
                    {template.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Example Prompts - Enhanced Templates */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Quick Start Ideas (Click to use):</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIdea('A modern todo app with authentication, real-time sync, and dark mode')}
                className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 text-gray-300 rounded-lg transition-all duration-300 hover:scale-105"
              >
                📝 Todo App
              </button>
              <button
                onClick={() => setIdea('A weather dashboard with React, API integration, location detection, and 7-day forecast')}
                className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 text-gray-300 rounded-lg transition-all duration-300 hover:scale-105"
              >
                🌤️ Weather Dashboard
              </button>
              <button
                onClick={() => setIdea('An e-commerce website with shopping cart, payment integration, product search, and user reviews')}
                className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 text-gray-300 rounded-lg transition-all duration-300 hover:scale-105"
              >
                🛒 E-commerce
              </button>
              <button
                onClick={() => setIdea('A blog platform with user authentication, rich text editor, comments, and categories')}
                className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 text-gray-300 rounded-lg transition-all duration-300 hover:scale-105"
              >
                ✍️ Blog Platform
              </button>
              <button
                onClick={() => setIdea('A social media app with posts, likes, comments, followers, and real-time notifications')}
                className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 text-gray-300 rounded-lg transition-all duration-300 hover:scale-105"
              >
                👥 Social Media
              </button>
              <button
                onClick={() => setIdea('A project management tool with tasks, teams, kanban boards, and time tracking')}
                className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 text-gray-300 rounded-lg transition-all duration-300 hover:scale-105"
              >
                📊 Project Manager
              </button>
              <button
                onClick={() => setIdea('A chat application with real-time messaging, file sharing, groups, and encryption')}
                className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 text-gray-300 rounded-lg transition-all duration-300 hover:scale-105"
              >
                💬 Chat App
              </button>
              <button
                onClick={() => setIdea('A music player with playlists, search, equalizer, and lyrics display')}
                className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 text-gray-300 rounded-lg transition-all duration-300 hover:scale-105"
              >
                🎵 Music Player
              </button>
              <button
                onClick={() => setIdea('A finance tracker with expenses, income, budgets, charts, and export features')}
                className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 text-gray-300 rounded-lg transition-all duration-300 hover:scale-105"
              >
                💰 Finance Tracker
              </button>
              <button
                onClick={() => setIdea('A recipe app with search, favorites, meal planning, shopping lists, and nutritional info')}
                className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 text-gray-300 rounded-lg transition-all duration-300 hover:scale-105"
              >
                🍳 Recipe App
              </button>
              <button
                onClick={() => setIdea('A fitness tracker with workouts, progress tracking, goals, and statistics')}
                className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 text-gray-300 rounded-lg transition-all duration-300 hover:scale-105"
              >
                💪 Fitness Tracker
              </button>
              <button
                onClick={() => setIdea('A code editor with syntax highlighting, multiple files, terminal, and git integration')}
                className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 text-gray-300 rounded-lg transition-all duration-300 hover:scale-105"
              >
                💻 Code Editor
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your project idea here... (e.g., 'A todo app with user authentication')"
              className="flex-1 h-36 bg-gray-900/80 border border-gray-700/50 rounded-xl p-5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all duration-300 backdrop-blur-sm"
            />
            <button
              onClick={generateCode}
              disabled={isGenerating || !idea.trim()}
              className="px-10 h-36 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-blue-400 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30 disabled:shadow-none relative overflow-hidden group"
            >
              <span className="relative z-10">
                {isGenerating ? (
                  <span className="flex flex-col items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span className="text-xs">AI Generating...</span>
                  </span>
                ) : (
                  'Generate with AI'
                )}
              </span>
              {!isGenerating && idea.trim() && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300 animate-fadeIn">
              <p className="text-sm font-semibold">⚠️ Error: {error}</p>
            </div>
          )}
          {generationProgress && (
            <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500/50 rounded-xl text-blue-300 animate-fadeIn">
              <p className="text-xs">{generationProgress}</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section - Preview and Code */}
      {generatedCode ? (
        <div className="flex-1 flex gap-6 p-6 overflow-hidden animate-fadeIn">
          {/* Live Preview */}
          <div className="flex-1 flex flex-col glass-effect border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
            <div className="px-5 py-3 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-b border-white/10 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Live Preview Sandbox
              </h3>
            </div>
            <div className="flex-1 overflow-auto">
              <LivePreview code={generatedCode} />
            </div>
          </div>

          {/* Files and Code */}
          <div className="w-1/2 flex flex-col glass-effect border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
            <div className="px-5 py-3 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-b border-white/10 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Generated Files
              </h3>
            </div>
            <div className="flex-1 overflow-auto">
              <CodeViewer files={generatedCode.files} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400 animate-fadeIn">
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-20">⚡</div>
            <p className="text-lg">Enter your idea above and click Generate to see your project</p>
            <p className="text-sm mt-2 text-gray-500">AI will create frontend, backend, and middleware automatically</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default BuildTab
