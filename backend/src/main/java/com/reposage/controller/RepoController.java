package com.reposage.controller;

import com.reposage.dto.AskRequest;
import com.reposage.dto.AskResponse;
import com.reposage.dto.IngestRequest;
import com.reposage.dto.IngestResponse;
import com.reposage.service.RepoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/repos")
public class RepoController {

    private final RepoService repoService;

    public RepoController(RepoService repoService) {
        this.repoService = repoService;
    }

    @PostMapping("/ingest")
    public ResponseEntity<IngestResponse> ingest(@RequestBody IngestRequest request) {
        IngestResponse response = repoService.ingest(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/ask")
    public ResponseEntity<AskResponse> ask(@RequestBody AskRequest request) {
        AskResponse response = repoService.ask(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listIndexedRepos() {
        return ResponseEntity.ok(repoService.listIndexedRepos());
    }

    @DeleteMapping("/{repoName}")
    public ResponseEntity<Map<String, Object>> deleteRepo(@PathVariable String repoName) {
        repoService.deleteRepo(repoName);
        return ResponseEntity.ok(Map.of("success", true, "message", "Deleted indexed repository: " + repoName));
    }
}
