package com.projectPAF.Cre8Path.model;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

@Entity
@Table(name = "learning_plans")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LearningPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) // Foreign key to User
    private User user;

    @Column(name = "topic", nullable = false)
    private String topic;

    @Column(name = "resources", length = 1000)
    private String resources;

    @Column(name = "timeline", length = 255)
    private String timeline;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "progress_status", length = 50)
    private String status;
}