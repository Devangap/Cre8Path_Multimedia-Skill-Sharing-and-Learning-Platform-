package com.projectPAF.Cre8Path.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "questionnaire_responses")
public class QuestionnaireResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String interests; // comma-separated or JSON string

    @Column(name = "skill_level")
    private String skillLevel;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "time_commitment")
    private String timeCommitment;
}
