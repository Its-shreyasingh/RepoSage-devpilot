package com.reposage.dto;

public class IngestRequest {
    private String repoUrl;
    private String repoName;
    private String filePath;
    private String code;

    public IngestRequest() {}

    public IngestRequest(String repoUrl, String repoName, String filePath, String code) {
        this.repoUrl = repoUrl;
        this.repoName = repoName;
        this.filePath = filePath;
        this.code = code;
    }

    public String getRepoUrl() { return repoUrl; }
    public void setRepoUrl(String repoUrl) { this.repoUrl = repoUrl; }

    public String getRepoName() { return repoName; }
    public void setRepoName(String repoName) { this.repoName = repoName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}
