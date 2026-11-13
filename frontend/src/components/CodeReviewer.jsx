import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-go';
import 'prismjs/themes/prism-tomorrow.css';
import {
  Sparkles,
  Play,
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  ShieldAlert,
  Zap,
  CheckCircle,
  FileCode2,
  Loader2,
  Terminal,
} from 'lucide-react';
import { reviewCode } from '../services/api';

const SAMPLE_BUGS = {
  nplusone: {
    language: 'java',
    title: 'Spring Boot N+1 & NPE Bug',
    code: `package com.example.service;

import com.example.model.Order;
import com.example.model.Customer;
import com.example.repository.OrderRepository;
import com.example.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderReportService {

    // ANTI-PATTERN: Field injection or uninitialized dependencies
    private OrderRepository orderRepository;
    private CustomerRepository customerRepository;

    /**
     * Generates order summaries.
     * Contains N+1 database queries, potential NullPointerExceptions, and unhandled Optional!
     */
    public List<OrderSummaryDto> generateWeeklyReport(Long merchantId) {
        // Query 1: Fetches all orders
        List<Order> orders = orderRepository.findByMerchantId(merchantId);
        List<OrderSummaryDto> summaries = new ArrayList<>();

        for (Order order : orders) {
            // BUG: N+1 query problem! Issues 1 SELECT query for EVERY customer in loop
            Customer customer = customerRepository.findById(order.getCustomerId()).get();

            // BUG: Potential NullPointerException if address or city is null
            String city = customer.getAddress().getCity();

            OrderSummaryDto dto = new OrderSummaryDto();
            dto.setOrderId(order.getId());
            // BUG: Potential NPE if customer.getName() is null
            dto.setCustomerName(customer.getName().toUpperCase());
            dto.setCity(city);
            dto.setTotal(order.getAmount());

            summaries.add(dto);
        }

        return summaries;
    }
}`,
  },
  concurrency: {
    language: 'java',
    title: 'Thread Safety & Race Condition',
    code: `package com.example.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class RateLimiterService {

    // BUG: Not thread-safe! Concurrent requests can cause infinite loop or corrupt count
    private Map<String, Integer> requestCounts = new HashMap<>();

    public boolean allowRequest(String clientId, int maxLimit) {
        Integer count = requestCounts.get(clientId);
        if (count == null) {
            requestCounts.put(clientId, 1);
            return true;
        }

        if (count >= maxLimit) {
            return false;
        }

        // RACE CONDITION: Non-atomic check-then-act increment
        requestCounts.put(clientId, count + 1);
        return true;
    }
}`,
  },
  resourceLeak: {
    language: 'java',
    title: 'Resource Leak & Unclosed Connection',
    code: `package com.example.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class LegacyUserDao {

    public String getUserEmail(long userId) throws Exception {
        // BUG: Connection, Statement, and ResultSet never closed!
        // Triggers database connection pool exhaustion under load.
        Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/reposage", "postgres", "postgres");
        Statement stmt = conn.createStatement();
        
        // BUG: SQL Injection vulnerability!
        String query = "SELECT email FROM users WHERE id = " + userId;
        ResultSet rs = stmt.executeQuery(query);

        if (rs.next()) {
            return rs.getString("email");
        }
        return null;
    }
}`,
  },
};

export default function CodeReviewer() {
  const [code, setCode] = useState(SAMPLE_BUGS.nplusone.code);
  const [language, setLanguage] = useState('java');
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleRunReview = async () => {
    if (!code.trim() || isReviewing) return;

    setIsReviewing(true);
    setReviewResult(null);

    try {
      const res = await reviewCode({
        code: code.trim(),
        language,
      });
      setReviewResult(res.review);
    } catch (err) {
      setReviewResult(`### Error during Code Review\n\n${err.message || 'Unable to communicate with Gemini API.'}`);
    } finally {
      setIsReviewing(false);
    }
  };

  const handleLoadSample = (key) => {
    const sample = SAMPLE_BUGS[key];
    if (sample) {
      setCode(sample.code);
      setLanguage(sample.language);
      setReviewResult(null);
    }
  };

  const handleCopyReview = () => {
    if (!reviewResult) return;
    navigator.clipboard.writeText(reviewResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightCode = (input) => {
    const grammar = Prism.languages[language] || Prism.languages.clike;
    return Prism.highlight(input, grammar, language);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-4rem)] bg-[#0d1117]">
      {/* LEFT PANEL: Code Editor */}
      <section className="flex-1 flex flex-col border-r border-[#30363d] overflow-hidden">
        {/* Editor Toolbar */}
        <div className="h-12 border-b border-[#30363d] bg-[#161b22] px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <FileCode2 className="w-4 h-4 text-[#58a6ff]" />
            <span className="font-semibold text-xs md:text-sm text-[#f0f6fc]">Input Code Snippet</span>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] text-xs text-[#c9d1d9] rounded px-2 py-1 font-mono focus:border-[#58a6ff] outline-none ml-2"
            >
              <option value="java">Java (Spring Boot)</option>
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="go">Go</option>
            </select>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] text-[#8b949e] hidden lg:inline">Presets:</span>
            <button
              onClick={() => handleLoadSample('nplusone')}
              className="text-[11px] px-2 py-0.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] transition-all"
              title="Spring Boot N+1 Query & Null Pointer"
            >
              N+1 & NPE
            </button>
            <button
              onClick={() => handleLoadSample('concurrency')}
              className="text-[11px] px-2 py-0.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] transition-all"
              title="Race condition in Spring singleton"
            >
              Race Condition
            </button>
            <button
              onClick={() => handleLoadSample('resourceLeak')}
              className="text-[11px] px-2 py-0.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] transition-all"
              title="Resource leak and SQL injection"
            >
              Resource Leak
            </button>
          </div>
        </div>

        {/* Syntax-Highlighted Code Editor */}
        <div className="flex-1 overflow-auto bg-[#090d13] p-4 font-mono text-xs md:text-sm">
          <Editor
            value={code}
            onValueChange={(c) => setCode(c)}
            highlight={highlightCode}
            padding={10}
            className="font-mono min-h-full leading-relaxed"
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 13,
            }}
          />
        </div>

        {/* Editor Bottom Actions */}
        <div className="h-14 border-t border-[#30363d] bg-[#161b22] px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs text-[#8b949e]">
            <Terminal className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>Ready for AST inspection & bug analysis</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCode('')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              onClick={handleRunReview}
              disabled={isReviewing || !code.trim()}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#1f6feb] hover:bg-[#388bfd] disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
            >
              {isReviewing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing with Gemini 2.5 Flash...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Review Code with Gemini</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* RIGHT PANEL: Structured Markdown Review Output */}
      <section className="flex-1 flex flex-col overflow-hidden bg-[#0d1117]">
        {/* Review Toolbar */}
        <div className="h-12 border-b border-[#30363d] bg-[#161b22] px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-xs md:text-sm text-[#f0f6fc]">AI Code Review Report</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
              Structured Assessment
            </span>
          </div>

          {reviewResult && (
            <button
              onClick={handleCopyReview}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-xs text-[#c9d1d9] border border-[#30363d] transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Report'}</span>
            </button>
          )}
        </div>

        {/* Review Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {isReviewing ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#1f6feb]/20 border border-[#1f6feb] flex items-center justify-center animate-pulse">
                <Sparkles className="w-6 h-6 text-[#58a6ff] animate-spin" />
              </div>
              <p className="text-sm font-medium text-[#f0f6fc]">Inspecting Code with Google Gemini 2.5 Flash...</p>
              <p className="text-xs text-[#8b949e]">
                Checking for N+1 queries, null-safety, concurrency vulnerabilities, and complexity optimizations
              </p>
            </div>
          ) : reviewResult ? (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="markdown-body bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-xl">
                <ReactMarkdown>{reviewResult}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#8b949e]">
                <ShieldAlert className="w-7 h-7 text-[#58a6ff]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#f0f6fc]">No Active Review</h3>
                <p className="text-xs text-[#8b949e] max-w-sm mt-1">
                  Click <strong>&quot;Review Code with Gemini&quot;</strong> to evaluate the code on the left for bugs, edge cases,
                  complexity, and refactored implementation.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

