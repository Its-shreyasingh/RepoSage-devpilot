import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  FolderGit2,
  FileCode,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Database,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Code2,
  Info,
  Compass
} from 'lucide-react';
import { ingestRepo, askQuestion, getIndexedRepos, deleteRepo } from '../services/api';
import ContextChunkModal from './ContextChunkModal';

const PRESET_REPOS = [
  { label: 'Spring PetClinic', url: 'https://github.com/spring-projects/spring-petclinic' },
  { label: 'FastAPI Microservice', url: 'https://github.com/tiangolo/full-stack-fastapi-template' },
  { label: 'Next.js Commerce', url: 'https://github.com/vercel/commerce' },
];

const SAMPLE_QUESTIONS = [
  'Explain the overall architecture and main components of this codebase.',
  'What database entities, tables, and repository queries are defined?',
  'Are there any security risks, missing input validations, or edge cases?',
  'How does the application handle error handling and exceptions?',
];

export default function CodebaseChat({ user }) {
  // Ingestion state
  const [ingestMode, setIngestMode] = useState('github'); // 'github' | 'snippet'
  const [repoUrl, setRepoUrl] = useState('https://github.com/spring-projects/spring-petclinic');
  const [snippetRepoName, setSnippetRepoName] = useState('petclinic-demo');
  const [snippetFilePath, setSnippetFilePath] = useState('OwnerService.java');
  const [snippetCode, setSnippetCode] = useState(`package org.springframework.samples.petclinic.owner;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Collection;

@Service
public class OwnerService {

    private final OwnerRepository owners;

    public OwnerService(OwnerRepository owners) {
        this.owners = owners;
    }

    @Transactional(readOnly = true)
    public Collection<Owner> findByLastName(String lastName) {
        return this.owners.findByLastName(lastName);
    }

    @Transactional
    public void saveOwner(Owner owner) {
        if (owner == null) {
            throw new IllegalArgumentException("Owner cannot be null");
        }
        this.owners.save(owner);
    }
}`);
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestStatus, setIngestStatus] = useState(null);

  // Indexed repos
  const [indexedRepos, setIndexedRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');

  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [selectedModalChunk, setSelectedModalChunk] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadIndexedRepos();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAsking]);

  const loadIndexedRepos = async () => {
    try {
      const repos = await getIndexedRepos();
      setIndexedRepos(repos || []);
      if (repos && repos.length > 0 && !selectedRepo) {
        setSelectedRepo(repos[0].repoName);
      }
    } catch (e) {
      console.error('Failed to load indexed repos:', e);
    }
  };

  const handleIngest = async (e) => {
    e?.preventDefault();
    setIsIngesting(true);
    setIngestStatus(null);

    try {
      let payload = {};
      if (ingestMode === 'github') {
        if (!repoUrl.trim()) return;
        payload = { repoUrl: repoUrl.trim() };
      } else {
        if (!snippetCode.trim()) return;
        payload = {
          repoName: snippetRepoName.trim(),
          filePath: snippetFilePath.trim(),
          code: snippetCode,
        };
      }

      const res = await ingestRepo(payload);
      setIngestStatus({
        type: 'success',
        message: res.message || `Indexed ${res.chunksIndexed} chunks into pgvector.`,
        chunksIndexed: res.chunksIndexed,
        filesIndexed: res.filesIndexed,
        repoName: res.repoName,
      });

      setSelectedRepo(res.repoName);
      await loadIndexedRepos();
    } catch (error) {
      setIngestStatus({
        type: 'error',
        message: error.message || 'Failed to ingest repository into pgvector.',
      });
    } finally {
      setIsIngesting(false);
    }
  };

  const handleDeleteRepo = async (repoName, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete indexed vector embeddings for "${repoName}"?`)) return;

    try {
      await deleteRepo(repoName);
      await loadIndexedRepos();
      if (selectedRepo === repoName) {
        setSelectedRepo('');
      }
    } catch (err) {
      console.error('Failed to delete repo:', err);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const question = textToSend || inputQuestion;
    if (!question.trim() || isAsking) return;

    const userMessage = {
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuestion('');
    setIsAsking(true);

    try {
      const res = await askQuestion({
        repoName: selectedRepo || null,
        question: question.trim(),
      });

      const assistantMessage = {
        role: 'assistant',
        content: res.answer,
        sources: res.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `**Error:** ${error.message || 'Failed to retrieve answer from Repo Sage backend.'}`,
        sources: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-4rem)]">
      {/* LEFT SIDEBAR: Codebase Ingestion & Indexed Repos */}
      <aside className="w-80 md:w-96 border-r border-[#30363d] bg-[#161b22] flex flex-col overflow-y-auto">
        {/* Ingestion Box */}
        <div className="p-4 border-b border-[#30363d]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FolderGit2 className="w-4 h-4 text-[#58a6ff]" />
              <h2 className="font-semibold text-sm text-[#f0f6fc]">Ingest Codebase</h2>
            </div>
            <div className="flex rounded-md bg-[#0d1117] p-0.5 border border-[#30363d] text-xs">
              <button
                onClick={() => setIngestMode('github')}
                className={`px-2 py-0.5 rounded transition-all ${
                  ingestMode === 'github' ? 'bg-[#21262d] text-[#f0f6fc] font-medium' : 'text-[#8b949e]'
                }`}
              >
                GitHub URL
              </button>
              <button
                onClick={() => setIngestMode('snippet')}
                className={`px-2 py-0.5 rounded transition-all ${
                  ingestMode === 'snippet' ? 'bg-[#21262d] text-[#f0f6fc] font-medium' : 'text-[#8b949e]'
                }`}
              >
                Snippet
              </button>
            </div>
          </div>

          {ingestMode === 'github' ? (
            <form onSubmit={handleIngest} className="space-y-3">
              <div>
                <label className="block text-[11px] text-[#8b949e] mb-1 font-medium">Public GitHub Repo URL</label>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/repository"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-xs text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff] transition-all font-mono"
                  disabled={isIngesting}
                />
              </div>

              {/* Preset suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {PRESET_REPOS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setRepoUrl(preset.url)}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-[#c9d1d9] border border-[#30363d] transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isIngesting || !repoUrl.trim()}
                className="w-full mt-2 flex items-center justify-center space-x-2 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-medium px-3 py-2 rounded-md text-xs shadow-sm transition-all"
              >
                {isIngesting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Indexing into pgvector...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-3.5 h-3.5" />
                    <span>Embed & Index into pgvector</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleIngest} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-[#8b949e] mb-1">Repo / Module</label>
                  <input
                    type="text"
                    value={snippetRepoName}
                    onChange={(e) => setSnippetRepoName(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2.5 py-1 text-xs text-[#c9d1d9] font-mono focus:border-[#58a6ff]"
                    placeholder="order-service"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#8b949e] mb-1">File Path</label>
                  <input
                    type="text"
                    value={snippetFilePath}
                    onChange={(e) => setSnippetFilePath(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2.5 py-1 text-xs text-[#c9d1d9] font-mono focus:border-[#58a6ff]"
                    placeholder="OwnerService.java"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#8b949e] mb-1">Code Snippet</label>
                <textarea
                  value={snippetCode}
                  onChange={(e) => setSnippetCode(e.target.value)}
                  rows={6}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-xs font-mono text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff]"
                  placeholder="Paste code to chunk (~50 lines) and embed..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isIngesting || !snippetCode.trim()}
                className="w-full flex items-center justify-center space-x-2 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-medium px-3 py-1.5 rounded-md text-xs transition-all"
              >
                {isIngesting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Chunking & Embedding...</span>
                  </>
                ) : (
                  <>
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Index Snippet (~50 Lines)</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Feedback status */}
          {ingestStatus && (
            <div
              className={`mt-3 p-2.5 rounded-md text-xs border flex items-start space-x-2 ${
                ingestStatus.type === 'success'
                  ? 'bg-emerald-950/50 border-emerald-700/60 text-emerald-300'
                  : 'bg-rose-950/50 border-rose-700/60 text-rose-300'
              }`}
            >
              {ingestStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              )}
              <div className="flex-1">
                <p className="leading-snug">{ingestStatus.message}</p>
                {ingestStatus.chunksIndexed && (
                  <span className="inline-block mt-1 text-[10px] font-mono bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-700">
                    vector(768) embeddings generated
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Indexed Repositories List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
              Indexed Repositories ({indexedRepos.length})
            </h3>
            <button
              onClick={loadIndexedRepos}
              className="text-[11px] text-[#58a6ff] hover:underline"
            >
              Refresh
            </button>
          </div>

          {indexedRepos.length === 0 ? (
            <div className="text-center py-8 text-[#8b949e] text-xs">
              <Database className="w-8 h-8 mx-auto mb-2 text-[#30363d]" />
              <p>No repositories indexed yet.</p>
              <p className="text-[11px] text-[#8b949e]/80 mt-1">Ingest a repository above to start vector RAG search.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {indexedRepos.map((repo) => (
                <div
                  key={repo.repoName}
                  onClick={() => setSelectedRepo(repo.repoName)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    selectedRepo === repo.repoName
                      ? 'bg-[#1f6feb]/15 border-[#1f6feb] text-white shadow-sm'
                      : 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d]'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        selectedRepo === repo.repoName ? 'bg-[#58a6ff]' : 'bg-[#30363d]'
                      }`}
                    ></span>
                    <span className="font-mono truncate font-medium">{repo.repoName}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                      {repo.chunkCount} chunks
                    </span>
                    <button
                      onClick={(e) => handleDeleteRepo(repo.repoName, e)}
                      title="Delete indexed repository"
                      className="p-1 hover:text-rose-400 text-[#8b949e] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info badge */}
        <div className="p-3 border-t border-[#30363d] bg-[#0d1117] text-[11px] text-[#8b949e] flex items-center space-x-2">
          <Info className="w-3.5 h-3.5 text-[#58a6ff] shrink-0" />
          <span>PostgreSQL 16 pgvector cosine similarity search (`&lt;=&gt;`)</span>
        </div>
      </aside>

      {/* MAIN PANEL: Natural Language RAG Chat */}
      <main className="flex-1 flex flex-col bg-[#0d1117] overflow-hidden">
        {/* Active context bar */}
        <div className="h-10 border-b border-[#30363d] bg-[#161b22]/50 px-4 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[#8b949e]">Target Codebase:</span>
            {selectedRepo ? (
              <span className="font-mono text-[#58a6ff] font-medium bg-[#1f6feb]/10 px-2 py-0.5 rounded border border-[#1f6feb]/30">
                {selectedRepo}
              </span>
            ) : (
              <span className="text-[#8b949e] italic">Searching across all indexed repositories</span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-[#8b949e]">
            <span>Model:</span>
            <span className="font-mono text-emerald-400">gemini-2.5-flash (temp: 0.3)</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1f6feb] to-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20">
                <Compass className="w-7 h-7 text-white" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-white mb-2">Welcome to Repo Sage Codebase RAG</h1>
                <p className="text-sm text-[#8b949e] max-w-lg mx-auto">
                  Ask natural language questions about your codebase. Queries are embedded via{' '}
                  <code className="text-[#58a6ff]">text-embedding-004</code> and matched with PostgreSQL{' '}
                  <code className="text-[#58a6ff]">pgvector</code> before synthesis by Gemini.
                </p>
              </div>

              {/* Sample Prompts */}
              <div className="text-left space-y-2">
                <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
                  Suggested Questions:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {SAMPLE_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSendMessage(q)}
                      className="text-left p-3 rounded-lg border border-[#30363d] bg-[#161b22] hover:bg-[#21262d] text-xs text-[#c9d1d9] hover:text-white transition-all flex items-start space-x-2 group"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-[#58a6ff] shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                      <span>{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1.5 px-1">
                  <span className="text-xs font-semibold text-[#f0f6fc]">
                    {msg.role === 'user' ? (user?.name || 'You') : 'Repo Sage AI'}
                  </span>
                  <span className="text-[10px] text-[#8b949e]">{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-3xl rounded-xl p-4 md:p-5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-[#1f6feb] text-white shadow-md'
                      : 'bg-[#161b22] border border-[#30363d] text-[#c9d1d9] shadow-lg w-full'
                  }`}
                >
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>

                  {/* Retrieved Context Chunks Badges */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#30363d]/80">
                      <div className="flex items-center space-x-2 mb-2">
                        <Layers className="w-3.5 h-3.5 text-[#58a6ff]" />
                        <span className="text-xs font-semibold text-[#f0f6fc]">
                          Retrieved Context Chunks ({msg.sources.length}):
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((src, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => setSelectedModalChunk(src)}
                            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#0d1117] hover:bg-[#21262d] text-xs font-mono text-[#58a6ff] border border-[#30363d] hover:border-[#58a6ff] transition-all group"
                          >
                            <span className="text-[10px] px-1 py-0.2 rounded bg-blue-950 text-blue-300">
                              #{sIdx + 1}
                            </span>
                            <span className="truncate max-w-[200px] md:max-w-xs">{src.filePath}</span>
                            <ExternalLink className="w-3 h-3 text-[#8b949e] group-hover:text-[#58a6ff] shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {isAsking && (
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-[#238636] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 text-sm text-[#8b949e] flex items-center space-x-2 shadow-lg">
                <Loader2 className="w-4 h-4 animate-spin text-[#58a6ff]" />
                <span>Searching pgvector cosine similarity & synthesizing answer with Gemini 2.5 Flash...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#30363d] bg-[#161b22]">
          <div className="max-w-4xl mx-auto flex items-end space-x-3 bg-[#0d1117] border border-[#30363d] rounded-xl p-2 focus-within:border-[#58a6ff] transition-all">
            <textarea
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Ask anything about the codebase (e.g. 'Where is authentication enforced?', 'Explain the DB schema'). Press Enter to submit..."
              className="flex-1 bg-transparent text-sm text-[#f0f6fc] placeholder-[#8b949e] focus:outline-none resize-none p-1 font-sans"
              disabled={isAsking}
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isAsking || !inputQuestion.trim()}
              className="p-2.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white shadow-sm transition-all"
            >
              {isAsking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </main>

      {/* Modal for full context chunk inspection */}
      {selectedModalChunk && (
        <ContextChunkModal
          chunk={selectedModalChunk}
          onClose={() => setSelectedModalChunk(null)}
        />
      )}
    </div>
  );
}

