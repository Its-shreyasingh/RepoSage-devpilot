package com.reposage.entity;

import com.pgvector.PGvector;
import jakarta.persistence.*;

@Entity
@Table(name = "code_chunks", indexes = {
    @Index(name = "idx_code_chunks_repo", columnList = "repo_name")
})
public class CodeChunk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "repo_name", nullable = false)
    private String repoName;

    @Column(name = "file_path", nullable = false, length = 1024)
    private String filePath;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "embedding", columnDefinition = "vector(768)")
    private PGvector embedding;

    public CodeChunk() {}

    public CodeChunk(Long id, String repoName, String filePath, String content, PGvector embedding) {
        this.id = id;
        this.repoName = repoName;
        this.filePath = filePath;
        this.content = content;
        this.embedding = embedding;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String repoName;
        private String filePath;
        private String content;
        private PGvector embedding;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder repoName(String repoName) { this.repoName = repoName; return this; }
        public Builder filePath(String filePath) { this.filePath = filePath; return this; }
        public Builder content(String content) { this.content = content; return this; }
        public Builder embedding(PGvector embedding) { this.embedding = embedding; return this; }

        public CodeChunk build() {
            return new CodeChunk(id, repoName, filePath, content, embedding);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRepoName() { return repoName; }
    public void setRepoName(String repoName) { this.repoName = repoName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public PGvector getEmbedding() { return embedding; }
    public void setEmbedding(PGvector embedding) { this.embedding = embedding; }
}
