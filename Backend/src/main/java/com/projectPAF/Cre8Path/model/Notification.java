package com.projectPAF.Cre8Path.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Setter;
import lombok.Getter;

import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long recipientId; // The user who will receive the notification
    private String message; // The notification message
    private boolean isRead = false; // If the notification has been read
    private LocalDateTime createdAt; // Timestamp of when the notification was created
    private String type; // Type of notification (LIKE, COMMENT, FOLLOW, etc.)
    private Long referenceId; // ID of the related entity (e.g., post, follow, etc.)

    // Getters and Setters
}
