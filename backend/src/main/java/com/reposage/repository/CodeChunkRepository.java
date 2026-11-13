package com.reposage.repository;

import com.reposage.entity.CodeChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CodeChunkRepository extends JpaRepository<CodeChunk, Long> {

    @Query(value = """
        SELECT id, repo_name, file_path, content, embedding
        FROM code_chunks
        WHERE repo_name = :repoName
        ORDER BY embedding <=> CAST(:queryEmbedding AS vector)
        LIMIT :limit
        """, nativeQuery = true)
    List<CodeChunk> searchTopKInRepo(
        @Param("repoName") String repoName,
        @Param("queryEmbedding") String queryEmbedding,
        @Param("limit") int limit
    );

    @Query(value = """
        SELECT id, repo_name, file_path, content, embedding
        FROM code_chunks
        ORDER BY embedding <=> CAST(:queryEmbedding AS vector)
        LIMIT :limit
        """, nativeQuery = true)
    List<CodeChunk> searchTopKAll(
        @Param("queryEmbedding") String queryEmbedding,
        @Param("limit") int limit
    );

    default List<CodeChunk> searchTopK(String repoName, String queryEmbedding, int limit) {
        if (repoName != null && !repoName.trim().isEmpty()) {
            return searchTopKInRepo(repoName.trim(), queryEmbedding, limit);
        }
        return searchTopKAll(queryEmbedding, limit);
    }

    default List<CodeChunk> searchTopK(String repoName, String queryEmbedding) {
        return searchTopK(repoName, queryEmbedding, 5);
    }

    List<CodeChunk> findByRepoName(String repoName);

    long countByRepoName(String repoName);

    @Transactional
    @Modifying
    @Query("DELETE FROM CodeChunk c WHERE c.repoName = :repoName")
    void deleteByRepoName(@Param("repoName") String repoName);

    @Query(value = "SELECT DISTINCT repo_name FROM code_chunks ORDER BY repo_name", nativeQuery = true)
    List<String> findDistinctRepoNames();
}
