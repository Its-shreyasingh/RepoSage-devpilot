package com.reposage.dto;

public class IngestResponse {
    private boolean success;
    private String repoName;
    private int filesIndexed;
    private int chunksIndexed;
    private String message;

    public IngestResponse() {}

    public IngestResponse(boolean success, String repoName, int filesIndexed, int chunksIndexed, String message) {
        this.success = success;
        this.repoName = repoName;
        this.filesIndexed = filesIndexed;
        this.chunksIndexed = chunksIndexed;
        this.message = message;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private boolean success;
        private String repoName;
        private int filesIndexed;
        private int chunksIndexed;
        private String message;

        public Builder success(boolean success) { this.success = success; return this; }
        public Builder repoName(String repoName) { this.repoName = repoName; return this; }
        public Builder filesIndexed(int filesIndexed) { this.filesIndexed = filesIndexed; return this; }
        public Builder chunksIndexed(int chunksIndexed) { this.chunksIndexed = chunksIndexed; return this; }
        public Builder message(String message) { this.message = message; return this; }

        public IngestResponse build() {
            return new IngestResponse(success, repoName, filesIndexed, chunksIndexed, message);
        }
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getRepoName() { return repoName; }
    public void setRepoName(String repoName) { this.repoName = repoName; }

    public int getFilesIndexed() { return filesIndexed; }
    public void setFilesIndexed(int filesIndexed) { this.filesIndexed = filesIndexed; }

    public int getChunksIndexed() { return chunksIndexed; }
    public void setChunksIndexed(int chunksIndexed) { this.chunksIndexed = chunksIndexed; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
