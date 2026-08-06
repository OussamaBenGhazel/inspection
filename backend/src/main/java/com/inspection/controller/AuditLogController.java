package com.inspection.controller;

import com.inspection.model.AuditLog;
import com.inspection.repository.AuditLogRepository;
import com.inspection.kafka.NotificationKafkaProducer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;
    private final NotificationKafkaProducer kafkaProducer;

    public AuditLogController(AuditLogRepository auditLogRepository, NotificationKafkaProducer kafkaProducer) {
        this.auditLogRepository = auditLogRepository;
        this.kafkaProducer = kafkaProducer;
    }

    @GetMapping
    public List<AuditLog> getAll() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    @PostMapping
    public ResponseEntity<AuditLog> triggerManualAudit(
            @RequestParam("action") String action,
            @RequestParam("message") String message,
            @RequestParam(value = "username", required = false) String username) {

        // Publish to Kafka, which will consume and save it asynchronously
        String user = username != null ? username : "admin";
        kafkaProducer.sendAuditLog(action, message, user);

        // Also save manually to database as fallback immediately for instant UI visibility if Kafka template is offline
        AuditLog backupLog = new AuditLog(action, message, user);
        AuditLog saved = auditLogRepository.save(backupLog);

        return ResponseEntity.ok(saved);
    }
}
