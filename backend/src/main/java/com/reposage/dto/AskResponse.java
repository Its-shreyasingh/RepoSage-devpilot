package com.reposage.dto;

import java.util.List;

public class AskResponse {
    private String answer;
    private List<SourceChunkDto> sources;

    public AskResponse() {}

    public AskResponse(String answer, List<SourceChunkDto> sources) {
        this.answer = answer;
        this.sources = sources;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String answer;
        private List<SourceChunkDto> sources;

        public Builder answer(String answer) { this.answer = answer; return this; }
        public Builder sources(List<SourceChunkDto> sources) { this.sources = sources; return this; }

        public AskResponse build() {
            return new AskResponse(answer, sources);
        }
    }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public List<SourceChunkDto> getSources() { return sources; }
    public void setSources(List<SourceChunkDto> sources) { this.sources = sources; }
}
