package com.reposage.dto;

public class SourceChunkDto {
    private Long id;
    private String repoName;
    private String filePath;
    private String snippet;

    public SourceChunkDto() {}

    public SourceChunkDto(Long id, String repoName, String filePath, String snippet) {
        this.id = id;
        this.repoName = repoName;
        this.filePath = filePath;
        this.snippet = snippet;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String repoName;
        private String filePath;
        private String snippet;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder repoName(String repoName) { this.repoName = repoName; return this; }
        public Builder filePath(String filePath) { this.filePath = filePath; return this; }
        public Builder snippet(String snippet) { this.snippet = snippet; return this; }

        public SourceChunkDto build() {
            return new SourceChunkDto(id, repoName, filePath, snippet);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRepoName() { return repoName; }
    public void setRepoName(String repoName) { this.repoName = repoName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getSnippet() { return snippet; }
    public void setSnippet(String snippet) { this.snippet = snippet; }
}
