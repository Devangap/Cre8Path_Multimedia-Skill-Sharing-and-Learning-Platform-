package com.projectPAF.Cre8Path.model;

import java.sql.Date;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GenerationType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// means it is a database entity
@Entity
@Table(name = "learning_plans") // Maps it to a table named learning_plans in your database
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LearningPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "UserId")  // Assuming the user who created the learning plan
    private Long userId;

    @Column(name = "Topic")
    private String topic; // The learning topic, e.g., "Advanced Color Grading in Premiere Pro"

    @Column(name = "Resources")
    private String resources; // Links or references to resources used for learning, e.g., "YouTube tutorial, online course"

    @Column(name = "Timeline")
    private String timeline; // The completion timeline for the learning plan

    @Column(name = "Start_Date")
    private Date startDate; // Start date of the learning plan

    @Column(name = "End_Date")
    private Date endDate; // Expected end date of the learning plan

    @Column(name = "Progress_Status")
    private String status; // The current status of the learning plan, e.g., "In Progress", "Completed"
}
