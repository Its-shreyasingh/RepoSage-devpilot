package com.reposage;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RepoSageApplication {

    public static void main(String[] args) {
        // Enforce IPv4 to avoid IPv6 handshake hangs with external CDNs and GitHub on Windows
        System.setProperty("java.net.preferIPv4Stack", "true");
        SpringApplication.run(RepoSageApplication.class, args);
    }
}


