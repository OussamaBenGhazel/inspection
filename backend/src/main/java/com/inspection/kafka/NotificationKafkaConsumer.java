package com.inspection.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationKafkaConsumer {

    private static final Logger logger = LoggerFactory.getLogger(NotificationKafkaConsumer.class);

    @KafkaListener(topics = "inspection-notifications", groupId = "inspection-notification-group")
    public void consumeNotification(String message) {
        logger.info("Kafka Notification Consumer received event message: '{}'", message);

        // Execute workflow for notifications, e.g., processing email templates, system alerts routing
        try {
            logger.info("Triggered System Alert Workflow for notification: {}", message);
        } catch (Exception e) {
            logger.error("Error running Kafka notification workflow: {}", e.getMessage());
        }
    }
}
