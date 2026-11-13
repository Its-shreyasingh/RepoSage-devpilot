package com.reposage.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.util.*;

@Service
public class GitHubService {

    private static final Logger log = LoggerFactory.getLogger(GitHubService.class);
    private static final int CHUNK_SIZE_LINES = 50;
    private static final int CHUNK_OVERLAP_LINES = 10;
    private static final int MAX_FILES_TO_INDEX = 25;
    private static final int MAX_FILE_SIZE_BYTES = 100 * 1024; // 100KB

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public GitHubService() {
        this.restClient = RestClient.builder()
                .defaultHeader("User-Agent", "RepoSage-App")
                .defaultHeader("Accept", "application/vnd.github.v3+json")
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public record ParsedRepo(String owner, String repoName, String fullName) {}
    public record FileEntry(String path, String content) {}
    public record ChunkEntry(String filePath, String content, int chunkIndex, int startLine, int endLine) {}

    /**
     * Parses GitHub URL or owner/repo string into ParsedRepo.
     */
    public ParsedRepo parseRepoUrl(String input) {
        if (!StringUtils.hasText(input)) {
            throw new IllegalArgumentException("Repository URL or name cannot be empty");
        }
        String clean = input.trim()
                .replaceAll("^https?://github\\.com/", "")
                .replaceAll("\\.git$", "")
                .replaceAll("^/+", "")
                .replaceAll("/+$", "");

        String[] parts = clean.split("/");
        if (parts.length < 2) {
            throw new IllegalArgumentException("Invalid repository format. Please specify 'owner/repository' or full GitHub URL.");
        }
        String owner = parts[0];
        String repo = parts[1];
        return new ParsedRepo(owner, repo, owner + "/" + repo);
    }

    /**
     * Fetches primary code files from a public GitHub repository.
     */
    public List<FileEntry> fetchRepositoryFiles(ParsedRepo repo) {
        List<FileEntry> files = new ArrayList<>();
        try {
            // 1. Get default branch
            String defaultBranch = "main";
            try {
                String repoInfoUrl = String.format("https://api.github.com/repos/%s/%s", repo.owner(), repo.repoName());
                String repoJson = restClient.get().uri(repoInfoUrl).retrieve().body(String.class);
                JsonNode root = objectMapper.readTree(repoJson);
                if (root.has("default_branch")) {
                    defaultBranch = root.path("default_branch").asText("main");
                }
            } catch (Exception e) {
                log.info("Could not fetch repo metadata, defaulting branch to main: {}", e.getMessage());
            }

            // 2. Fetch recursive git tree
            String treeUrl = String.format("https://api.github.com/repos/%s/%s/git/trees/%s?recursive=1",
                    repo.owner(), repo.repoName(), defaultBranch);
            String treeJson = restClient.get().uri(treeUrl).retrieve().body(String.class);
            JsonNode treeRoot = objectMapper.readTree(treeJson);
            JsonNode treeArray = treeRoot.path("tree");

            if (treeArray.isArray()) {
                int count = 0;
                for (JsonNode item : treeArray) {
                    if (count >= MAX_FILES_TO_INDEX) {
                        break;
                    }
                    String type = item.path("type").asText();
                    String path = item.path("path").asText();
                    long size = item.path("size").asLong(0);

                    if ("blob".equalsIgnoreCase(type) && isIndexableCodeFile(path) && size <= MAX_FILE_SIZE_BYTES) {
                        String rawContent = fetchRawFileContent(repo.owner(), repo.repoName(), defaultBranch, path);
                        if (StringUtils.hasText(rawContent)) {
                            files.add(new FileEntry(path, rawContent));
                            count++;
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch repository files for {}: {}", repo.fullName(), e.getMessage());
            throw new RuntimeException("Could not retrieve files from GitHub: " + e.getMessage(), e);
        }

        return files;
    }

    /**
     * Fetches raw file content directly from raw.githubusercontent.com to avoid API rate limits.
     */
    private String fetchRawFileContent(String owner, String repo, String branch, String filePath) {
        try {
            String rawUrl = String.format("https://raw.githubusercontent.com/%s/%s/%s/%s",
                    owner, repo, branch, filePath);
            return restClient.get().uri(rawUrl).retrieve().body(String.class);
        } catch (Exception e) {
            log.warn("Failed to fetch raw content for {}: {}", filePath, e.getMessage());
            return null;
        }
    }

    /**
     * Chunks a text snippet (~50 lines per chunk with 10 lines overlap).
     */
    public List<ChunkEntry> chunkContent(String filePath, String content) {
        List<ChunkEntry> chunks = new ArrayList<>();
        if (!StringUtils.hasText(content)) {
            return chunks;
        }

        String[] lines = content.split("\\r?\\n");
        int totalLines = lines.length;

        if (totalLines <= CHUNK_SIZE_LINES) {
            String formattedChunk = String.format("// File: %s (lines 1-%d)\n%s", filePath, totalLines, content);
            chunks.add(new ChunkEntry(filePath, formattedChunk, 0, 1, totalLines));
            return chunks;
        }

        int step = CHUNK_SIZE_LINES - CHUNK_OVERLAP_LINES; // e.g., 50 - 10 = 40
        int chunkIdx = 0;

        for (int start = 0; start < totalLines; start += step) {
            int end = Math.min(start + CHUNK_SIZE_LINES, totalLines);
            StringBuilder sb = new StringBuilder();
            sb.append(String.format("// File: %s (lines %d-%d)\n", filePath, start + 1, end));
            for (int i = start; i < end; i++) {
                sb.append(lines[i]).append("\n");
            }

            chunks.add(new ChunkEntry(filePath, sb.toString(), chunkIdx++, start + 1, end));

            if (end == totalLines) {
                break;
            }
        }

        return chunks;
    }

    private boolean isIndexableCodeFile(String path) {
        String lower = path.toLowerCase();

        // Exclude unwanted directories and patterns
        if (lower.contains("/.git/") || lower.contains("/test/") || lower.contains("/tests/")
                || lower.contains("/node_modules/") || lower.contains("/dist/") || lower.contains("/target/")
                || lower.contains("/build/") || lower.contains("/vendor/") || lower.contains("/.mvn/")
                || lower.endsWith(".min.js") || lower.endsWith(".map") || lower.endsWith(".lock")
                || lower.endsWith("package-lock.json")) {
            return false;
        }

        // Include common code extensions
        return lower.endsWith(".java") || lower.endsWith(".ts") || lower.endsWith(".tsx")
                || lower.endsWith(".js") || lower.endsWith(".jsx") || lower.endsWith(".py")
                || lower.endsWith(".go") || lower.endsWith(".rs") || lower.endsWith(".sql")
                || lower.endsWith(".kt") || lower.endsWith(".cs") || lower.endsWith(".cpp")
                || lower.endsWith(".c") || lower.endsWith(".h") || lower.endsWith(".yml")
                || lower.endsWith(".yaml") || lower.endsWith(".json") || lower.endsWith(".md");
    }
}

