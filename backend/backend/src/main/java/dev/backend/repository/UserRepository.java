package dev.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import dev.backend.entity.User;
import java.util.List;


public interface UserRepository extends JpaRepository<User,UUID>{
    Optional<User> findByGithubID(Long githubID);
}
