package com.inspection.kafka;

import com.inspection.model.AuditLog;
import com.inspection.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class NotificationKafkaConsumer {

    private static final Logger logger = LoggerFactory.getLogger(NotificationKafkaConsumer.class);

    @Autowired
    private AuditLogRepository auditLogRepository;

    @KafkaListener(topics = "inspection-notifications", groupId = "inspection-notification-group")
    public void consumeNotification(String message) {
        logger.info("Kafka Notification Consumer received event message: '{}'", message);
        try {
            logger.info("Triggered System Alert Workflow for notification: {}", message);
        } catch (Exception e) {
            logger.error("Error running Kafka notification workflow: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "audit-logs", groupId = "inspection-notification-group")
    public void consumeAuditLog(String message) {
        logger.info("Kafka Audit Log Consumer received event: '{}'", message);
        try {
            if (message != null && message.contains("|||")) {
                String[] parts = message.split("\\|\\|\\|");
                if (parts.length >= 3) {
                    String actionName = parts[0];
                    String logMsg = parts[1];
                    String username = parts[2];

                    AuditLog auditLog = new AuditLog();
                    auditLog.setActionName(actionName);
                    auditLog.setMessage(logMsg);
                    auditLog.setUsername(username);
                    auditLog.setTimestamp(LocalDateTime.now());

                    AuditLog saved = auditLogRepository.save(auditLog);
                    logger.info("Successfully persisted Kafka consumed AuditLog (ID: {}) to PostgreSQL", saved.getId());
                }
            }
        } catch (Exception e) {
            logger.error("Failed to parse and save consumed Kafka audit log message: {}", e.getMessage());
        }
    }
}
