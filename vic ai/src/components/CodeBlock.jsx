import { useState } from 'react'

function CodeBlock({ code, language = 'javascript', filename = 'code' }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCode = () => {
    const extension = getFileExtension(language)
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getFileExtension = (lang) => {
    const extensions = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      html: 'html',
      css: 'css',
      json: 'json',
      xml: 'xml',
      yaml: 'yaml',
      markdown: 'md',
      php: 'php',
      ruby: 'rb',
      go: 'go',
      rust: 'rs',
      swift: 'swift',
      kotlin: 'kt',
      sql: 'sql',
      shell: 'sh',
      bash: 'sh',
    }
    return extensions[language.toLowerCase()] || 'txt'
  }

  return (
    <div className="bg-black border border-gray-700/50 rounded-xl overflow-hidden my-4 shadow-2xl animate-fadeIn">
      {/* Header with language and buttons */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-gray-900 to-gray-950 border-b border-gray-700/50">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{language}</span>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 text-xs bg-gradient-to-r from-blue-600/80 to-blue-500/80 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 font-semibold shadow-lg shadow-blue-500/20"
          >
            {copied ? (
              <>
                <span className="text-green-300">✓</span> Copied!
              </>
            ) : (
              <>
                <span>📋</span> Copy
              </>
            )}
          </button>
          <button
            onClick={downloadCode}
            className="px-4 py-2 text-xs bg-gradient-to-r from-purple-600/80 to-purple-500/80 hover:from-purple-500 hover:to-purple-400 text-white rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 font-semibold shadow-lg shadow-purple-500/20"
          >
            <span>💾</span> Download
          </button>
        </div>
      </div>
      {/* Code content */}
      <pre className="p-5 overflow-x-auto bg-black/90 backdrop-blur-sm">
        <code className="text-sm font-mono text-green-400 whitespace-pre leading-relaxed">{code}</code>
      </pre>
    </div>
  )
}

export default CodeBlock
