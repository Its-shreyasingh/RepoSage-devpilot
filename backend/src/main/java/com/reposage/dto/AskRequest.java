package com.reposage.dto;

public class AskRequest {
    private String repoName;
    private String question;

    public AskRequest() {}

    public AskRequest(String repoName, String question) {
        this.repoName = repoName;
        this.question = question;
    }

    public String getRepoName() { return repoName; }
    public void setRepoName(String repoName) { this.repoName = repoName; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
}
