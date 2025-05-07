package com.projectPAF.Cre8Path.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "follows", uniqueConstraints = @UniqueConstraint(columnNames = {"follower_id", "following_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Profile who follows
    @ManyToOne
    @JoinColumn(name = "follower_id", nullable = false)
    private Profile follower;

    // Profile being followed
    @ManyToOne
    @JoinColumn(name = "following_id", nullable = false)
    private Profile following;
}
