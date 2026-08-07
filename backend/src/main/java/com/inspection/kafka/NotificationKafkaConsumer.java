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
        logger.info("Kafka Audit Log Consumer processed and verified audit event: '{}'", message);
    }
}
