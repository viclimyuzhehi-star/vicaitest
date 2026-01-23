function LivePreview({ code }) {
  // Simple preview rendering
  const previewContent = code.frontend || code.files?.find(f => f.type === 'frontend')?.code || ''

  return (
    <div className="p-6 h-full">
      <div className="bg-gradient-to-br from-gray-50 to-white text-black rounded-xl p-8 h-full overflow-auto shadow-inner animate-fadeIn">
        <div className="prose max-w-none">
          {previewContent ? (
            <div className="bg-gray-100 rounded-xl p-6 shadow-lg border border-gray-200">
              <pre className="text-sm overflow-auto">
                <code className="text-gray-800 font-mono whitespace-pre-wrap leading-relaxed">{previewContent}</code>
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-3 opacity-50">👁️</div>
                <p className="text-lg">Preview will appear here when code is generated</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LivePreview
