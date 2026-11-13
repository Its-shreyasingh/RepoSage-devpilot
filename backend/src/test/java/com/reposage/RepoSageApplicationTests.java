package com.reposage;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:postgresql://localhost:5432/reposage",
    "app.auth.enabled=false"
})
class RepoSageApplicationTests {

    @Test
    void contextLoads() {
    }
}

