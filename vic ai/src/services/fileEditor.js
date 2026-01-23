// ============================================================================
// FILE-BY-FILE EDITING SYSTEM
// Enables AI to edit, create, fix, and refactor individual files
// ============================================================================

import { vicAI } from './llmService'

class FileEditor {
  constructor() {
    this.openFiles = new Map() // Map of filePath -> fileContent
    this.folders = new Set() // Set of folderPaths
    this.fileHistory = new Map() // Map of filePath -> history array
    this.maxHistorySize = 50
  }

  // Open a file for editing
  openFile(filePath, content = '') {
    if (!this.openFiles.has(filePath)) {
      this.openFiles.set(filePath, content)
      this.fileHistory.set(filePath, [content])
      this.ensureParentFolders(filePath)
    }
    return {
      path: filePath,
      content: this.openFiles.get(filePath),
      history: this.fileHistory.get(filePath) || []
    }
  }

  // Create a new file
  createFile(filePath, content = '', template = null) {
    let initialContent = content

    if (template) {
      initialContent = this.applyTemplate(template, filePath)
    }

    this.openFiles.set(filePath, initialContent)
    this.fileHistory.set(filePath, [initialContent])
    this.ensureParentFolders(filePath)

    return {
      path: filePath,
      content: initialContent,
      created: true
    }
  }

  // Create a new folder
  createFolder(folderPath) {
    // Normalize path to remove trailing slash
    const normalizedPath = folderPath.replace(/\/$/, '')
    this.folders.add(normalizedPath)
    this.ensureParentFolders(normalizedPath)

    return {
      path: normalizedPath,
      created: true
    }
  }

  // Helper to ensure parent folders exist
  ensureParentFolders(path) {
    const parts = path.split('/')
    // Remove the last part (file name or current folder)
    parts.pop()

    let currentPath = ''
    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part
      this.folders.add(currentPath)
    }
  }

  // Edit a file using AI
  async editFile(filePath, instruction, context = {}) {
    const currentContent = this.openFiles.get(filePath) || ''

    // Use Vic-AI-Thinking to understand the edit instruction
    const editPrompt = `Edit this file following the instruction: "${instruction}"

Current file content:
\`\`\`
${currentContent.substring(0, 5000)}${currentContent.length > 5000 ? '\n... (truncated)' : ''}
\`\`\`

${context.additionalContext ? `Additional context: ${context.additionalContext}` : ''}

Provide the complete edited file content.`

    const result = await vicAI.think(editPrompt, {
      previousMessages: context.previousMessages || [],
      filePath,
      operation: 'edit'
    })

    // Extract the edited code from response
    const editedContent = this.extractCodeFromResponse(result, currentContent)

    // Save to history
    this.saveToHistory(filePath, editedContent)
    this.openFiles.set(filePath, editedContent)

    return {
      path: filePath,
      content: editedContent,
      changes: this.detectChanges(currentContent, editedContent)
    }
  }

  // Fix errors in a file
  async fixErrors(filePath, errors = []) {
    const currentContent = this.openFiles.get(filePath) || ''

    const fixPrompt = `Fix the following errors in this file:

Errors:
${errors.map(e => `- ${e.message} (${e.line ? `Line ${e.line}` : 'Unknown location'})`).join('\n')}

Current file content:
\`\`\`
${currentContent.substring(0, 5000)}${currentContent.length > 5000 ? '\n... (truncated)' : ''}
\`\`\`

Provide the complete fixed file content.`

    const result = await vicAI.think(fixPrompt, {
      filePath,
      operation: 'fix',
      errors
    })

    const fixedContent = this.extractCodeFromResponse(result, currentContent)

    this.saveToHistory(filePath, fixedContent)
    this.openFiles.set(filePath, fixedContent)

    return {
      path: filePath,
      content: fixedContent,
      fixedErrors: errors.length
    }
  }

  // Refactor code
  async refactorFile(filePath, refactorType = 'general', goals = []) {
    const currentContent = this.openFiles.get(filePath) || ''

    const refactorPrompt = `Refactor this code with the following goals:
${goals.map(g => `- ${g}`).join('\n')}

Refactor type: ${refactorType}

Current file content:
\`\`\`
${currentContent.substring(0, 5000)}${currentContent.length > 5000 ? '\n... (truncated)' : ''}
\`\`\`

Provide the complete refactored file content with improved:
- Code organization
- Performance
- Readability
- Best practices`

    const result = await vicAI.think(refactorPrompt, {
      filePath,
      operation: 'refactor',
      refactorType,
      goals
    })

    const refactoredContent = this.extractCodeFromResponse(result, currentContent)

    this.saveToHistory(filePath, refactoredContent)
    this.openFiles.set(filePath, refactoredContent)

    return {
      path: filePath,
      content: refactoredContent,
      refactored: true
    }
  }

  // Extract code from AI response
  extractCodeFromResponse(result, fallback) {
    if (result.response && result.response.type === 'code') {
      if (result.response.code) {
        return result.response.code
      }
      if (result.response.app && result.response.app.structure) {
        // Extract from app structure
        const parts = []
        if (result.response.app.structure.frontend?.code) {
          parts.push(result.response.app.structure.frontend.code)
        }
        if (result.response.app.structure.backend?.code) {
          parts.push(result.response.app.structure.backend.code)
        }
        return parts.join('\n\n') || fallback
      }
    }

    // Try to extract from message/text
    const responseText = result.response?.message || result.response?.greeting || ''

    // Look for code blocks
    const codeBlockRegex = /```(?:[\w]+)?\n?([\s\S]*?)```/g
    const matches = [...responseText.matchAll(codeBlockRegex)]

    if (matches.length > 0) {
      return matches.map(m => m[1].trim()).join('\n\n')
    }

    // Fallback: return original or extracted text
    return responseText || fallback
  }

  // Save to history
  saveToHistory(filePath, content) {
    const history = this.fileHistory.get(filePath) || []
    history.push(content)

    if (history.length > this.maxHistorySize) {
      history.shift()
    }

    this.fileHistory.set(filePath, history)
  }

  // Detect changes between two versions
  detectChanges(oldContent, newContent) {
    const oldLines = oldContent.split('\n')
    const newLines = newContent.split('\n')

    return {
      linesAdded: Math.max(0, newLines.length - oldLines.length),
      linesRemoved: Math.max(0, oldLines.length - newLines.length),
      linesModified: oldLines.filter((line, idx) =>
        newLines[idx] && line !== newLines[idx]
      ).length,
      totalChanges: oldContent !== newContent
    }
  }

  // Undo last change
  undo(filePath) {
    const history = this.fileHistory.get(filePath) || []
    if (history.length > 1) {
      history.pop() // Remove current
      const previous = history[history.length - 1]
      this.openFiles.set(filePath, previous)
      return {
        path: filePath,
        content: previous,
        canUndo: history.length > 1
      }
    }
    return null
  }

  // Apply template
  applyTemplate(template, filePath) {
    const templates = {
      'react-component': `import React from 'react'

function ${this.getComponentName(filePath)}() {
  return (
    <div>
      {/* Component content */}
    </div>
  )
}

export default ${this.getComponentName(filePath)}`,
      'express-route': `const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'Route handler' })
})

module.exports = router`,
      'python-class': `class ${this.getClassName(filePath)}:
    def __init__(self):
        pass
    
    def method(self):
        pass`
    }

    return templates[template] || ''
  }

  getComponentName(filePath) {
    const name = filePath.split('/').pop().replace(/\.[^.]+$/, '')
    return name.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('')
  }

  getClassName(filePath) {
    const name = filePath.split('/').pop().replace(/\.[^.]+$/, '')
    return name.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).lower()
    ).join('')
  }

  // Get all open files
  getOpenFiles() {
    return Array.from(this.openFiles.entries()).map(([path, content]) => ({
      path,
      content,
      historyLength: (this.fileHistory.get(path) || []).length
    }))
  }

  // Close a file
  closeFile(filePath) {
    this.openFiles.delete(filePath)
    return { closed: true }
  }

  // Save file content
  saveFile(filePath, content) {
    this.openFiles.set(filePath, content)
    this.saveToHistory(filePath, content)
    return { saved: true }
  }
}

// Export singleton instance
export const fileEditor = new FileEditor()

// Export convenience functions
export const editFile = async (filePath, instruction, context) => {
  return await fileEditor.editFile(filePath, instruction, context)
}

export const createFile = (filePath, content, template) => {
  return fileEditor.createFile(filePath, content, template)
}

export const fixErrors = async (filePath, errors) => {
  return await fileEditor.fixErrors(filePath, errors)
}

export const refactorFile = async (filePath, refactorType, goals) => {
  return await fileEditor.refactorFile(filePath, refactorType, goals)
}

export const createFolder = (folderPath) => {
  return fileEditor.createFolder(folderPath)
}

export default fileEditor
