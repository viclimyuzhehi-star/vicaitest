// ============================================================================
// LOCAL PROJECT MEMORY SYSTEM
// Stores architecture, files, dependencies, and previous actions
// Makes AI smarter the more you code
// ============================================================================

class ProjectMemory {
  constructor() {
    this.projects = new Map() // projectId -> projectData
    this.currentProjectId = null
    this.maxMemorySize = 10000 // Max stored items per project
  }

  // Initialize or load project memory
  initProject(projectId, initialData = {}) {
    if (!this.projects.has(projectId)) {
      this.projects.set(projectId, {
        id: projectId,
        architecture: {
          type: initialData.type || 'fullstack',
          frontend: initialData.frontend || null,
          backend: initialData.backend || null,
          database: initialData.database || null,
          patterns: [],
          structure: {}
        },
        files: new Map(),
        dependencies: {
          frontend: [],
          backend: [],
          dev: []
        },
        actions: [],
        context: {
          lastEdited: null,
          lastGenerated: null,
          focus: null,
          preferences: {}
        },
        metadata: {
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          version: 1
        }
      })
    }
    
    this.currentProjectId = projectId
    return this.getProject(projectId)
  }

  // Get project data
  getProject(projectId) {
    return this.projects.get(projectId) || null
  }

  // Get current project
  getCurrentProject() {
    return this.currentProjectId ? this.getProject(this.currentProjectId) : null
  }

  // Record a file
  recordFile(projectId, filePath, content, metadata = {}) {
    const project = this.getProject(projectId)
    if (!project) return

    const fileData = {
      path: filePath,
      content,
      metadata: {
        language: this.detectLanguage(filePath, content),
        size: content.length,
        lines: content.split('\n').length,
        lastModified: new Date().toISOString(),
        ...metadata
      }
    }

    project.files.set(filePath, fileData)
    project.metadata.lastModified = new Date().toISOString()
    
    // Update architecture patterns
    this.updateArchitecture(project, filePath, content)
    
    // Extract dependencies
    this.extractDependencies(project, filePath, content)
  }

  // Record an action
  recordAction(projectId, action) {
    const project = this.getProject(projectId)
    if (!project) return

    const actionRecord = {
      id: Date.now().toString(),
      type: action.type, // 'generate', 'edit', 'create', 'delete', 'refactor', 'fix'
      target: action.target, // file path or 'project'
      details: action.details || {},
      timestamp: new Date().toISOString(),
      result: action.result || null
    }

    project.actions.push(actionRecord)
    
    // Keep only recent actions
    if (project.actions.length > this.maxMemorySize) {
      project.actions.shift()
    }

    // Update context
    project.context.lastEdited = actionRecord.target
    if (action.type === 'generate') {
      project.context.lastGenerated = actionRecord.timestamp
    }
  }

  // Update architecture patterns
  updateArchitecture(project, filePath, content) {
    const language = this.detectLanguage(filePath, content)
    const patterns = this.extractPatterns(content, language)
    
    if (!project.architecture.structure[language]) {
      project.architecture.structure[language] = {
        patterns: [],
        conventions: {},
        frameworks: []
      }
    }
    
    project.architecture.structure[language].patterns.push(...patterns)
    
    // Detect framework
    const framework = this.detectFramework(content, language)
    if (framework && !project.architecture.structure[language].frameworks.includes(framework)) {
      project.architecture.structure[language].frameworks.push(framework)
    }
  }

  // Extract patterns from code
  extractPatterns(content, language) {
    const patterns = []
    
    // Detect common patterns
    if (language === 'javascript' || language === 'typescript') {
      if (/const\s+\w+\s*=\s*require\(/.test(content)) patterns.push('commonjs')
      if (/import\s+.+\s+from\s+['"]/.test(content)) patterns.push('es6-modules')
      if (/class\s+\w+\s+extends\s+React\.Component/.test(content)) patterns.push('class-components')
      if (/function\s+\w+\s*\(/.test(content)) patterns.push('function-components')
      if (/useState|useEffect|useContext/.test(content)) patterns.push('react-hooks')
      if (/async\s+function/.test(content)) patterns.push('async-await')
      if (/\.then\(/.test(content)) patterns.push('promises')
    }
    
    if (language === 'python') {
      if (/class\s+\w+\(/.test(content)) patterns.push('classes')
      if (/def\s+\w+\s*\(/.test(content)) patterns.push('functions')
      if (/@\w+/.test(content)) patterns.push('decorators')
      if (/async\s+def/.test(content)) patterns.push('async')
    }

    return [...new Set(patterns)] // Remove duplicates
  }

  // Detect framework
  detectFramework(content, language) {
    if (language === 'javascript' || language === 'typescript') {
      if (/from\s+['"]react['"]/.test(content)) return 'react'
      if (/from\s+['"]vue['"]/.test(content)) return 'vue'
      if (/angular/i.test(content)) return 'angular'
      if (/express/.test(content)) return 'express'
      if (/next/.test(content)) return 'next.js'
    }
    
    if (language === 'python') {
      if (/from\s+flask\s+import/.test(content)) return 'flask'
      if (/from\s+fastapi\s+import/.test(content)) return 'fastapi'
      if (/from\s+django/.test(content)) return 'django'
    }
    
    return null
  }

  // Extract dependencies
  extractDependencies(project, filePath, content) {
    const language = this.detectLanguage(filePath, content)
    
    // JavaScript/TypeScript dependencies
    if (language === 'javascript' || language === 'typescript') {
      const importRegex = /import\s+.+\s+from\s+['"]([^'"]+)['"]/g
      const requireRegex = /require\(['"]([^'"]+)['"]\)/g
      
      let match
      const deps = new Set()
      
      while ((match = importRegex.exec(content)) !== null) {
        deps.add(match[1])
      }
      
      while ((match = requireRegex.exec(content)) !== null) {
        deps.add(match[1])
      }
      
      // Categorize dependencies
      deps.forEach(dep => {
        if (!dep.startsWith('.') && !dep.startsWith('/')) {
          // External dependency
          if (filePath.includes('frontend') || filePath.includes('src')) {
            if (!project.dependencies.frontend.includes(dep)) {
              project.dependencies.frontend.push(dep)
            }
          } else {
            if (!project.dependencies.backend.includes(dep)) {
              project.dependencies.backend.push(dep)
            }
          }
        }
      })
    }
    
    // Python dependencies
    if (language === 'python') {
      const importRegex = /^import\s+(\w+)|^from\s+(\w+)/gm
      let match
      const deps = new Set()
      
      while ((match = importRegex.exec(content)) !== null) {
        deps.add(match[1] || match[2])
      }
      
      deps.forEach(dep => {
        // Filter out stdlib
        const stdlib = ['os', 'sys', 'json', 'datetime', 'time', 'math', 'random']
        if (!stdlib.includes(dep) && !project.dependencies.backend.includes(dep)) {
          project.dependencies.backend.push(dep)
        }
      })
    }
  }

  // Detect language from file path and content
  detectLanguage(filePath, content) {
    const ext = filePath.split('.').pop()?.toLowerCase()
    
    const languageMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'go': 'go',
      'rs': 'rust',
      'php': 'php',
      'rb': 'ruby',
      'swift': 'swift',
      'kt': 'kotlin',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml'
    }
    
    return languageMap[ext] || 'text'
  }

  // Get context for AI
  getContext(projectId, options = {}) {
    const project = this.getProject(projectId)
    if (!project) return null

    const context = {
      project: {
        id: project.id,
        architecture: project.architecture,
        type: project.architecture.type
      },
      files: Array.from(project.files.entries()).slice(-10).map(([path, data]) => ({
        path,
        language: data.metadata.language,
        size: data.metadata.size
      })),
      dependencies: project.dependencies,
      recentActions: project.actions.slice(-5),
      context: project.context
    }

    // Add file contents if requested
    if (options.includeContent) {
      context.files = Array.from(project.files.entries()).slice(-5).map(([path, data]) => ({
        path,
        content: data.content.substring(0, 2000), // Limit content size
        language: data.metadata.language
      }))
    }

    // Add patterns
    if (options.includePatterns) {
      context.patterns = {}
      Object.keys(project.architecture.structure).forEach(lang => {
        context.patterns[lang] = project.architecture.structure[lang].patterns
      })
    }

    return context
  }

  // Save to localStorage
  saveToStorage() {
    try {
      const projectsData = {}
      this.projects.forEach((project, id) => {
        projectsData[id] = {
          ...project,
          files: Object.fromEntries(project.files),
          actions: project.actions.slice(-100) // Keep only recent actions
        }
      })
      
      localStorage.setItem('vic-ai-project-memory', JSON.stringify(projectsData))
      localStorage.setItem('vic-ai-current-project', this.currentProjectId || '')
    } catch (error) {
      console.error('Failed to save project memory:', error)
    }
  }

  // Load from localStorage
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('vic-ai-project-memory')
      if (saved) {
        const projectsData = JSON.parse(saved)
        Object.entries(projectsData).forEach(([id, data]) => {
          this.projects.set(id, {
            ...data,
            files: new Map(Object.entries(data.files || {}))
          })
        })
      }
      
      this.currentProjectId = localStorage.getItem('vic-ai-current-project') || null
    } catch (error) {
      console.error('Failed to load project memory:', error)
    }
  }

  // Clear project memory
  clearProject(projectId) {
    this.projects.delete(projectId)
    if (this.currentProjectId === projectId) {
      this.currentProjectId = null
    }
    this.saveToStorage()
  }
}

// Export singleton instance
export const projectMemory = new ProjectMemory()

// Initialize on load
if (typeof window !== 'undefined') {
  projectMemory.loadFromStorage()
  
  // Auto-save every 30 seconds
  setInterval(() => {
    projectMemory.saveToStorage()
  }, 30000)
}

export default projectMemory
