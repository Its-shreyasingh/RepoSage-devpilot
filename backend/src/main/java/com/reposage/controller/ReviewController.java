package com.reposage.controller;

import com.reposage.dto.ReviewRequest;
import com.reposage.dto.ReviewResponse;
import com.reposage.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/review")
public class ReviewController {

    private final GeminiService geminiService;

    public ReviewController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> reviewCode(@RequestBody ReviewRequest request) {
        if (request == null || !StringUtils.hasText(request.getCode())) {
            return ResponseEntity.badRequest().body(ReviewResponse.builder()
                    .review("Error: Code snippet cannot be empty.")
                    .language(request != null ? request.getLanguage() : "java")
                    .build());
        }

        String language = StringUtils.hasText(request.getLanguage()) ? request.getLanguage() : "java";
        String reviewMarkdown = geminiService.reviewCode(request.getCode(), language);

        return ResponseEntity.ok(ReviewResponse.builder()
                .review(reviewMarkdown)
                .language(language)
                .build());
    }
}
