package com.reposage.service;

import com.pgvector.PGvector;
import com.reposage.dto.*;
import com.reposage.entity.CodeChunk;
import com.reposage.repository.CodeChunkRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;

@Service
public class RepoService {

    private static final Logger log = LoggerFactory.getLogger(RepoService.class);

    private final CodeChunkRepository codeChunkRepository;
    private final GeminiService geminiService;
    private final GitHubService githubService;

    public RepoService(CodeChunkRepository codeChunkRepository,
                       GeminiService geminiService,
                       GitHubService githubService) {
        this.codeChunkRepository = codeChunkRepository;
        this.geminiService = geminiService;
        this.githubService = githubService;
    }

    /**
     * Ingests a repository from a public GitHub URL OR from directly supplied code snippet.
     */
    @Transactional
    public IngestResponse ingest(IngestRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Ingest request payload cannot be null");
        }

        // Case 1: Ingesting a direct snippet / pasted file
        if (StringUtils.hasText(request.getCode())) {
            String repoName = StringUtils.hasText(request.getRepoName()) ? request.getRepoName().trim() : "custom-snippet";
            String filePath = StringUtils.hasText(request.getFilePath()) ? request.getFilePath().trim() : "Snippet.java";

            // Remove previous chunks for this exact file in this repo if present
            List<CodeChunk> existing = codeChunkRepository.findByRepoName(repoName);
            for (CodeChunk chunk : existing) {
                if (filePath.equalsIgnoreCase(chunk.getFilePath())) {
                    codeChunkRepository.delete(chunk);
                }
            }

            List<GitHubService.ChunkEntry> chunkEntries = githubService.chunkContent(filePath, request.getCode());
            List<CodeChunk> toSave = new ArrayList<>();

            for (GitHubService.ChunkEntry entry : chunkEntries) {
                PGvector embedding = geminiService.generateEmbedding(entry.content());
                CodeChunk chunk = CodeChunk.builder()
                        .repoName(repoName)
                        .filePath(entry.filePath())
                        .content(entry.content())
                        .embedding(embedding)
                        .build();
                toSave.add(chunk);
            }

            codeChunkRepository.saveAll(toSave);

            return IngestResponse.builder()
                    .success(true)
                    .repoName(repoName)
                    .filesIndexed(1)
                    .chunksIndexed(toSave.size())
                    .message(String.format("Successfully indexed %d chunks from %s into %s.", toSave.size(), filePath, repoName))
                    .build();
        }

        // Case 2: Ingesting from GitHub URL
        if (!StringUtils.hasText(request.getRepoUrl())) {
            throw new IllegalArgumentException("Either 'repoUrl' or 'code' must be provided for ingestion.");
        }

        GitHubService.ParsedRepo parsedRepo = githubService.parseRepoUrl(request.getRepoUrl());
        String repoFullName = parsedRepo.fullName();

        // Clear existing chunks for this repository to ensure fresh indexing
        codeChunkRepository.deleteByRepoName(repoFullName);

        List<GitHubService.FileEntry> files = githubService.fetchRepositoryFiles(parsedRepo);
        if (files.isEmpty()) {
            throw new RuntimeException("No supported code files found in repository " + repoFullName);
        }

        List<CodeChunk> allChunks = new ArrayList<>();
        int fileCount = 0;

        for (GitHubService.FileEntry file : files) {
            List<GitHubService.ChunkEntry> chunks = githubService.chunkContent(file.path(), file.content());
            for (GitHubService.ChunkEntry chunkEntry : chunks) {
                PGvector embedding = geminiService.generateEmbedding(chunkEntry.content());
                CodeChunk codeChunk = CodeChunk.builder()
                        .repoName(repoFullName)
                        .filePath(chunkEntry.filePath())
                        .content(chunkEntry.content())
                        .embedding(embedding)
                        .build();
                allChunks.add(codeChunk);
            }
            fileCount++;
        }

        codeChunkRepository.saveAll(allChunks);

        return IngestResponse.builder()
                .success(true)
                .repoName(repoFullName)
                .filesIndexed(fileCount)
                .chunksIndexed(allChunks.size())
                .message(String.format("Successfully indexed %d chunks from %d files for repository %s.",
                        allChunks.size(), fileCount, repoFullName))
                .build();
    }

    /**
     * Performs vector similarity search and answers question grounded in the retrieved code chunks.
     */
    @Transactional(readOnly = true)
    public AskResponse ask(AskRequest request) {
        if (request == null || !StringUtils.hasText(request.getQuestion())) {
            throw new IllegalArgumentException("Question cannot be empty.");
        }

        String repoName = request.getRepoName();
        String question = request.getQuestion().trim();

        // 1. Generate 768-dim query embedding
        PGvector queryVector = geminiService.generateEmbedding(question);
        String queryEmbeddingStr = geminiService.toSqlVectorString(queryVector);

        // 2. Perform pgvector cosine similarity search
        List<CodeChunk> matchedChunks = codeChunkRepository.searchTopK(repoName, queryEmbeddingStr, 5);

        if (matchedChunks.isEmpty()) {
            return AskResponse.builder()
                    .answer("No relevant code chunks were found in the indexed repository. Please ensure the repository is indexed first.")
                    .sources(Collections.emptyList())
                    .build();
        }

        // 3. Format sources
        List<SourceChunkDto> sources = matchedChunks.stream()
                .map(chunk -> SourceChunkDto.builder()
                        .id(chunk.getId())
                        .repoName(chunk.getRepoName())
                        .filePath(chunk.getFilePath())
                        .snippet(createSnippet(chunk.getContent()))
                        .build())
                .toList();

        // 4. Call Gemini to answer question using retrieved chunks
        String answer = geminiService.answerCodebaseQuestion(question, matchedChunks);

        return AskResponse.builder()
                .answer(answer)
                .sources(sources)
                .build();
    }

    /**
     * Lists all indexed repository names and their chunk counts.
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> listIndexedRepos() {
        List<String> names = codeChunkRepository.findDistinctRepoNames();
        List<Map<String, Object>> result = new ArrayList<>();
        for (String name : names) {
            long count = codeChunkRepository.countByRepoName(name);
            result.add(Map.of(
                    "repoName", name,
                    "chunkCount", count
            ));
        }
        return result;
    }

    /**
     * Deletes all chunks associated with a repository name.
     */
    @Transactional
    public void deleteRepo(String repoName) {
        codeChunkRepository.deleteByRepoName(repoName);
    }

    private String createSnippet(String content) {
        if (!StringUtils.hasText(content)) {
            return "";
        }
        String[] lines = content.split("\\r?\\n");
        int maxLines = Math.min(lines.length, 12);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < maxLines; i++) {
            sb.append(lines[i]).append("\n");
        }
        if (lines.length > maxLines) {
            sb.append("// ... [").append(lines.length - maxLines).append(" more lines]");
        }
        return sb.toString();
    }
}
