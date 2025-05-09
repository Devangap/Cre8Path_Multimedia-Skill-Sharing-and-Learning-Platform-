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

@Entity
@Table(name = "learningp")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Learningp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "UserId",nullable = true)
    private Long user_id;

    @Column(name = "topic",nullable = true)
    private String topic;

    @Column(name = "CourseId",nullable = true)
    private Long course_id;

    @Column(name = "StartDate")
    private Date start_date;
    
    @Column(name = "EndDate")
    private Date end_date;
    
    @Column(name = "ProgressStatus")
    private String status;

}