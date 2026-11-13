import React from 'react';
import { Database, Sparkles, MessageSquareCode, ShieldCheck, Github, ExternalLink, Cpu } from 'lucide-react';
import { getGitHubLoginUrl } from '../services/api';

export default function Navbar({ activeTab, setActiveTab, user, authLoading }) {
  return (
    <header className="h-16 border-b border-[#30363d] bg-[#161b22]/90 backdrop-blur sticky top-0 z-50 px-4 md:px-6 flex items-center justify-between">
      {/* Brand & Badge */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Database className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-white tracking-tight">Repo Sage</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-700/60 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              Spring Boot + pgvector RAG
            </span>
          </div>
          <span className="text-[11px] text-[#8b949e]">Google Gemini 2.5 Flash &middot; Codebase Intelligence</span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <nav className="flex items-center bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
        <button
          onClick={() => setActiveTab('rag')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all ${
            activeTab === 'rag'
              ? 'bg-[#238636] text-white shadow-sm'
              : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d]'
          }`}
        >
          <MessageSquareCode className="w-4 h-4" />
          <span>Codebase RAG Chat</span>
        </button>

        <button
          onClick={() => setActiveTab('reviewer')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all ${
            activeTab === 'reviewer'
              ? 'bg-[#1f6feb] text-white shadow-sm'
              : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Code Reviewer</span>
        </button>
      </nav>

      {/* GitHub Auth Section */}
      <div className="flex items-center space-x-3">
        {authLoading ? (
          <div className="h-8 w-24 bg-[#21262d] animate-pulse rounded-md"></div>
        ) : user?.authenticated ? (
          <div className="flex items-center space-x-2.5 bg-[#0d1117] border border-[#30363d] px-2.5 py-1 rounded-lg">
            <img
              src={user.avatarUrl || 'https://avatars.githubusercontent.com/u/583231?v=4'}
              alt={user.username}
              className="w-6 h-6 rounded-full border border-[#30363d]"
            />
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-[#f0f6fc] leading-tight">
                {user.name || user.username}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {user.demoMode ? '● Guest / Demo Mode' : '● GitHub OAuth'}
              </span>
            </div>
          </div>
        ) : (
          <a
            href={getGitHubLoginUrl()}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] transition-all"
          >
            <Github className="w-4 h-4" />
            <span>Sign in with GitHub</span>
          </a>
        )}
      </div>
    </header>
  );
}

