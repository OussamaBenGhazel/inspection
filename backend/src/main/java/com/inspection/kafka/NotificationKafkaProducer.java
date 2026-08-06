package com.inspection.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationKafkaProducer {

    private static final Logger logger = LoggerFactory.getLogger(NotificationKafkaProducer.class);
    private static final String NOTIFICATION_TOPIC = "inspection-notifications";
    private static final String AUDIT_TOPIC = "audit-logs";

    @Autowired(required = false)
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendNotification(String key, String message) {
        logger.info("Sending notification event via Kafka. Topic: {}, Key: {}, Message: {}", NOTIFICATION_TOPIC, key, message);
        if (kafkaTemplate == null) {
            logger.warn("KafkaTemplate is not available. Skipping publishing to Kafka.");
            return;
        }
        try {
            kafkaTemplate.send(NOTIFICATION_TOPIC, key, message).whenComplete((result, ex) -> {
                if (ex != null) {
                    logger.error("Failed to deliver Kafka message: {}", ex.getMessage());
                } else {
                    logger.info("Kafka message delivered successfully! Metadata: {}", result.getRecordMetadata());
                }
            });
        } catch (Exception e) {
            logger.error("Error occurred while publishing message to Kafka topic {}: {}", NOTIFICATION_TOPIC, e.getMessage());
        }
    }

    public void sendAuditLog(String actionName, String message, String username) {
        String payload = String.format("%s|||%s|||%s", actionName, message, username != null ? username : "system");
        logger.info("Publishing audit log event to Kafka topic '{}': {}", AUDIT_TOPIC, payload);
        if (kafkaTemplate == null) {
            logger.warn("KafkaTemplate is not available. Skipping publishing audit to Kafka.");
            return;
        }
        try {
            kafkaTemplate.send(AUDIT_TOPIC, actionName, payload).whenComplete((result, ex) -> {
                if (ex != null) {
                    logger.error("Failed to deliver Kafka audit event: {}", ex.getMessage());
                } else {
                    logger.info("Kafka audit event delivered successfully! Metadata: {}", result.getRecordMetadata());
                }
            });
        } catch (Exception e) {
            logger.error("Error occurred while publishing audit event to Kafka: {}", e.getMessage());
        }
    }
}
