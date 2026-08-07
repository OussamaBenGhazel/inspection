package com.inspection.repository;

import com.inspection.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    long countByReadStatusFalse();
    List<Notification> findAllByOrderByTimestampDesc();
}
