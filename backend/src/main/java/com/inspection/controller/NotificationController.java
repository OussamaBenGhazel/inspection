package com.inspection.controller;

import com.inspection.model.Notification;
import com.inspection.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public List<Notification> getAll() {
        return notificationRepository.findAllByOrderByTimestampDesc();
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount() {
        long count = notificationRepository.countByReadStatusFalse();
        return ResponseEntity.ok(count);
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification == null) {
            return ResponseEntity.notFound().build();
        }
        notification.setReadStatus(true);
        Notification saved = notificationRepository.save(notification);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/read-all")
    public ResponseEntity<?> markAllAsRead() {
        List<Notification> notifications = notificationRepository.findAll();
        for (Notification n : notifications) {
            n.setReadStatus(true);
        }
        notificationRepository.saveAll(notifications);
        return ResponseEntity.ok().build();
    }
}
