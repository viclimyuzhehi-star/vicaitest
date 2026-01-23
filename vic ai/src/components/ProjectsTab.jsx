import { useState } from 'react'
import LivePreview from './LivePreview'
import CodeViewer from './CodeViewer'

function ProjectsTab({ projects, onDelete }) {
  const [selectedProject, setSelectedProject] = useState(null)
  const [viewMode, setViewMode] = useState('preview') // 'preview' or 'files'

  if (projects.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 animate-fadeIn">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">📁</div>
          <p className="text-lg">No projects yet</p>
          <p className="text-sm mt-2 text-gray-500">Create one in the Build tab!</p>
        </div>
      </div>
    )
  }

  const selected = selectedProject || projects[0]

  return (
    <div className="h-full flex bg-transparent">
      {/* Left Sidebar - Project List */}
      <div className="w-80 border-r border-white/10 glass-effect backdrop-blur-xl flex flex-col">
        <div className="p-5 border-b border-white/10">
          <h2 className="text-2xl font-bold gradient-text">Projects</h2>
          <p className="text-sm text-gray-400 mt-2">{projects.length} project(s)</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {projects.map((project, index) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`
                p-4 mb-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] animate-slideIn
                ${
                  selected?.id === project.id
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-lg'
                    : 'glass-effect border border-white/5 hover:border-white/20 hover:bg-white/5'
                }
              `}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <h3 className="font-semibold text-white mb-1">{project.name}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">{project.idea}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Project Details */}
      <div className="flex-1 flex flex-col animate-fadeIn">
        {selected && (
          <>
            {/* Header with Actions */}
            <div className="p-6 border-b border-white/10 glass-effect backdrop-blur-xl flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold gradient-text">{selected.name}</h2>
                <p className="text-sm text-gray-400 mt-2">{selected.idea}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`
                    px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105
                    ${
                      viewMode === 'preview'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                        : 'glass-effect border border-white/10 text-gray-300 hover:text-white hover:border-white/20'
                    }
                  `}
                >
                  Preview
                </button>
                <button
                  onClick={() => setViewMode('files')}
                  className={`
                    px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105
                    ${
                      viewMode === 'files'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                        : 'glass-effect border border-white/10 text-gray-300 hover:text-white hover:border-white/20'
                    }
                  `}
                >
                  Files
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this project?')) {
                      onDelete(selected.id)
                      setSelectedProject(null)
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/30"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden p-6">
              {viewMode === 'preview' ? (
                <div className="h-full glass-effect border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
                  <div className="px-5 py-3 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-b border-white/10 backdrop-blur-sm">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Live Preview Sandbox
                    </h3>
                  </div>
                  <div className="h-[calc(100%-48px)] overflow-auto">
                    <LivePreview code={selected} />
                  </div>
                </div>
              ) : (
                <div className="h-full glass-effect border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
                  <div className="px-5 py-3 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-b border-white/10 backdrop-blur-sm">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      Project Files
                    </h3>
                  </div>
                  <div className="h-[calc(100%-48px)] overflow-auto">
                    <CodeViewer files={selected.files} />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProjectsTab
