package com.projectPAF.Cre8Path.service;

import com.projectPAF.Cre8Path.model.Notification;
import com.projectPAF.Cre8Path.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepo;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Create and send notification
    public Notification createAndSend(Long recipientId, String message, String type, Long referenceId) {
        Notification notif = new Notification();
        notif.setRecipientId(recipientId);
        notif.setMessage(message);
        notif.setType(type);
        notif.setReferenceId(referenceId);
        notif.setCreatedAt(LocalDateTime.now());
        Notification saved = notificationRepo.save(notif);

        // Send notification to the user via WebSocket
        messagingTemplate.convertAndSend("/topic/notifications/" + recipientId, saved); // Send to WebSocket topic
        return saved;
    }

    // Get notifications for a user
    public List<Notification> getNotifications(Long userId) {
        return notificationRepo.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    // Mark all notifications as read
    public void markAllAsRead(Long userId) {
        List<Notification> notifs = notificationRepo.findByRecipientIdOrderByCreatedAtDesc(userId);
        notifs.forEach(n -> n.setRead(true));
        notificationRepo.saveAll(notifs);
    }
}
