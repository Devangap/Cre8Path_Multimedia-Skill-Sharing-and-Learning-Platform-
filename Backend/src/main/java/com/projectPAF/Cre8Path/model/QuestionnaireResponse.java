package com.projectPAF.Cre8Path.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @JsonBackReference
    private User user;


    @Column(columnDefinition = "TEXT")
    private String interests;

    @Column(name = "skill_level")
    private String skillLevel;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "time_commitment")
    private String timeCommitment;
}
