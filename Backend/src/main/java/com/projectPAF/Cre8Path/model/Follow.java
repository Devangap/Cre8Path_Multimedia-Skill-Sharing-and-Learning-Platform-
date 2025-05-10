package com.projectPAF.Cre8Path.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "follows", uniqueConstraints = @UniqueConstraint(columnNames = {"follower_id", "following_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The person who follows someone
    @ManyToOne
    @JoinColumn(name = "follower_id", nullable = false)
    private Profile follower;

    // The person who is being followed
    @ManyToOne
    @JoinColumn(name = "following_id", nullable = false)
    private Profile following;

}
