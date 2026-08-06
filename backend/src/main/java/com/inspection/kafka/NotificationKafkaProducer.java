package com.inspection.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationKafkaProducer {

    private static final Logger logger = LoggerFactory.getLogger(NotificationKafkaProducer.class);
    private static final String TOPIC = "inspection-notifications";

    @Autowired(required = false)
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendNotification(String key, String message) {
        logger.info("Sending notification event via Kafka. Topic: {}, Key: {}, Message: {}", TOPIC, key, message);
        if (kafkaTemplate == null) {
            logger.warn("KafkaTemplate is not available. Skipping publishing to Kafka.");
            return;
        }
        try {
            kafkaTemplate.send(TOPIC, key, message).whenComplete((result, ex) -> {
                if (ex != null) {
                    logger.error("Failed to deliver Kafka message: {}", ex.getMessage());
                } else {
                    logger.info("Kafka message delivered successfully! Metadata: {}", result.getRecordMetadata());
                }
            });
        } catch (Exception e) {
            logger.error("Error occurred while publishing message to Kafka topic {}: {}", TOPIC, e.getMessage());
        }
    }
}
