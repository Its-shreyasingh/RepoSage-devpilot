package com.reposage.dto;

public class ReviewResponse {
    private String review;
    private String language;

    public ReviewResponse() {}

    public ReviewResponse(String review, String language) {
        this.review = review;
        this.language = language;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String review;
        private String language;

        public Builder review(String review) { this.review = review; return this; }
        public Builder language(String language) { this.language = language; return this; }

        public ReviewResponse build() {
            return new ReviewResponse(review, language);
        }
    }

    public String getReview() { return review; }
    public void setReview(String review) { this.review = review; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
