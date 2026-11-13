import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Database } from 'lucide-react';

export default function ContextChunkModal({ chunk, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!chunk) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(chunk.snippet || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#30363d] flex items-center justify-between bg-[#0d1117]">
          <div className="flex items-center space-x-2.5">
            <FileCode className="w-4 h-4 text-[#58a6ff]" />
            <span className="font-mono text-xs md:text-sm text-[#f0f6fc] font-medium break-all">
              {chunk.filePath}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
              pgvector match
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-xs text-[#c9d1d9] transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto font-mono text-xs text-[#e6edf3] bg-[#090d13] flex-1">
          <pre className="whitespace-pre-wrap leading-relaxed">
            <code>{chunk.snippet}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-[#30363d] bg-[#161b22] flex items-center justify-between text-xs text-[#8b949e]">
          <div className="flex items-center space-x-2">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Repository: <strong className="text-[#f0f6fc] font-mono">{chunk.repoName}</strong></span>
          </div>
          <span className="text-[11px]">Cosine Distance Index: Top-K Vector Match</span>
        </div>
      </div>
    </div>
  );
}

