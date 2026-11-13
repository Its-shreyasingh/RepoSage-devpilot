import React, { useState } from 'react';
import {
  Github,
  Database,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  Lock,
  UserCheck,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import { getGitHubLoginUrl } from '../services/api';

const DEMO_PERSONAS = [
  {
    role: 'Senior Java/Spring Engineer',
    name: 'Alex Rivera',
    username: 'alex-spring-dev',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    bio: 'Specializing in Spring Boot 3, Hibernate JPA, and PostgreSQL pgvector microservices.',
  },
  {
    role: 'Full-Stack RAG Architect',
    name: 'Elena Rostova',
    username: 'elena-rag-architect',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    bio: 'Building vector search systems with Google Gemini 2.5 Flash and embeddings.',
  },
  {
    role: 'Principal Security Reviewer',
    name: 'Marcus Chen',
    username: 'marcus-security',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces',
    bio: 'Auditing code for N+1 queries, race conditions, and null-pointer vulnerabilities.',
  },
];

export default function LoginPage({ onLoginSuccess, onCancel }) {
  const [selectedPersona, setSelectedPersona] = useState(DEMO_PERSONAS[0]);
  const [activeLoginTab, setActiveLoginTab] = useState('demo'); // 'demo' | 'oauth'

  const handleGuestLogin = (persona) => {
    const targetPersona = persona || selectedPersona;
    const profile = {
      authenticated: true,
      demoMode: true,
      username: targetPersona.username,
      name: targetPersona.name,
      avatarUrl: targetPersona.avatarUrl,
      email: `${targetPersona.username}@reposage.local`,
      role: targetPersona.role,
    };
    localStorage.setItem('reposage_demo_user', JSON.stringify(profile));
    onLoginSuccess(profile);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10">
        {/* Left Column: Branding & Feature Highlights */}
        <div className="md:col-span-6 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Repo Sage</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-[#8b949e]">Enterprise Codebase Intelligence & AI Review</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
              Sign in to explore your codebase with vector semantic intelligence.
            </h2>
            <p className="text-sm text-[#8b949e] leading-relaxed">
              Index repositories into PostgreSQL pgvector, query with natural language, and conduct automated AI code
              reviews powered by Google Gemini 2.5 Flash.
            </p>
          </div>

          {/* Key Architectural Value Points */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-3">
              <div className="p-1.5 rounded-md bg-[#161b22] border border-[#30363d] text-emerald-400 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-[#f0f6fc]">Grounded Vector Retrieval</h3>
                <p className="text-[11px] text-[#8b949e]">
                  768-dimensional dense embeddings (`text-embedding-004`) with native PostgreSQL cosine similarity (`&lt;=&gt;`).
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-1.5 rounded-md bg-[#161b22] border border-[#30363d] text-[#58a6ff] mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-[#f0f6fc]">Automated Static Bug Detection</h3>
                <p className="text-[11px] text-[#8b949e]">
                  Evaluates N+1 queries, race conditions, and null-pointer hazards with instant refactoring suggestions.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-1.5 rounded-md bg-[#161b22] border border-[#30363d] text-[#a371f7] mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-[#f0f6fc]">Spring Boot 3 + Spring Security</h3>
                <p className="text-[11px] text-[#8b949e]">
                  Production OAuth2 client integration with flexible interview demo modes.
                </p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#8b949e] flex items-center space-x-2 pt-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted sessions &middot; Private vector storage &middot; Zero model weight training</span>
          </div>
        </div>

        {/* Right Column: Interactive Login Box */}
        <div className="md:col-span-6">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-2xl space-y-6">
            {/* Header Tabs */}
            <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Choose Sign-In Method</h3>
                <p className="text-xs text-[#8b949e]">Select GitHub OAuth or 1-Click Demo Mode</p>
              </div>

              <div className="flex bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
                <button
                  onClick={() => setActiveLoginTab('demo')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    activeLoginTab === 'demo'
                      ? 'bg-[#238636] text-white shadow-sm'
                      : 'text-[#8b949e] hover:text-white'
                  }`}
                >
                  Demo Mode
                </button>
                <button
                  onClick={() => setActiveLoginTab('oauth')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    activeLoginTab === 'oauth'
                      ? 'bg-[#1f6feb] text-white shadow-sm'
                      : 'text-[#8b949e] hover:text-white'
                  }`}
                >
                  GitHub OAuth
                </button>
              </div>
            </div>

            {activeLoginTab === 'demo' ? (
              /* DEMO MODE PERSONA SELECTOR */
              <div className="space-y-4">
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-start space-x-2">
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold">Interview Demo Mode Active:</strong>
                    <p className="text-[11px] text-emerald-300/80 mt-0.5">
                      Log in instantly with a pre-configured engineer persona without needing GitHub OAuth credentials.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[#8b949e]">Select Demo Persona:</label>
                  {DEMO_PERSONAS.map((p) => (
                    <div
                      key={p.username}
                      onClick={() => setSelectedPersona(p)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedPersona.username === p.username
                          ? 'bg-[#1f6feb]/15 border-[#1f6feb] shadow-sm'
                          : 'bg-[#0d1117] border-[#30363d] hover:bg-[#21262d]'
                      }`}
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <img
                          src={p.avatarUrl}
                          alt={p.name}
                          className="w-9 h-9 rounded-full border border-[#30363d] object-cover"
                        />
                        <div className="truncate text-left">
                          <h4 className="text-xs font-semibold text-white">{p.name}</h4>
                          <span className="text-[11px] text-[#58a6ff] font-mono">{p.role}</span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            selectedPersona.username === p.username
                              ? 'border-[#58a6ff] bg-[#58a6ff]'
                              : 'border-[#30363d]'
                          }`}
                        >
                          {selectedPersona.username === p.username && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleGuestLogin(selectedPersona)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-xs md:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <span>Launch Workspace as {selectedPersona.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* GITHUB OAUTH 2.0 LOGIN */
              <div className="space-y-4 py-2">
                <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-[#8b949e] flex items-start space-x-2">
                  <Terminal className="w-4 h-4 text-[#58a6ff] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Uses Spring Security <code>oauth2Login</code> redirecting to GitHub Authorization servers.
                    Ensure <code>GITHUB_CLIENT_ID</code> and <code>GITHUB_CLIENT_SECRET</code> are configured.
                  </p>
                </div>

                <a
                  href={getGitHubLoginUrl()}
                  className="w-full py-3 px-4 rounded-xl bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white font-semibold text-xs md:text-sm flex items-center justify-center space-x-2 shadow-md transition-all group"
                >
                  <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Sign in with GitHub</span>
                  <ArrowRight className="w-4 h-4 ml-1 text-[#8b949e] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </a>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => setActiveLoginTab('demo')}
                    className="text-xs text-[#58a6ff] hover:underline"
                  >
                    Don't have OAuth keys configured? Switch to 1-Click Demo Mode →
                  </button>
                </div>
              </div>
            )}

            {/* Cancel / Skip button */}
            {onCancel && (
              <div className="pt-2 border-t border-[#30363d] text-center">
                <button
                  onClick={onCancel}
                  className="text-xs text-[#8b949e] hover:text-white transition-colors"
                >
                  Continue to Workspace as Guest →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
