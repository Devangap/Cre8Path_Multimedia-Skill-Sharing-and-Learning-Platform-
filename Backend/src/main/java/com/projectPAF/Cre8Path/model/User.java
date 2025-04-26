package com.projectPAF.Cre8Path.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "oauth_id", unique = true)
    private String oauthId;

    @Column(unique = true, nullable = true)
    private String email;

    @Column(name = "password")
    private String password; // Should stay String

    @Column(name = "first_time_login", nullable = false)
    private boolean firstTimeLogin = true;
}
