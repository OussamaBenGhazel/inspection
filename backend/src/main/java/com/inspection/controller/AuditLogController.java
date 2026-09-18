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
    private final com.inspection.repository.UtilisateurRepository utilisateurRepository;

    public AuditLogController(
            AuditLogRepository auditLogRepository,
            NotificationKafkaProducer kafkaProducer,
            com.inspection.repository.UtilisateurRepository utilisateurRepository) {
        this.auditLogRepository = auditLogRepository;
        this.kafkaProducer = kafkaProducer;
        this.utilisateurRepository = utilisateurRepository;
    }

    @GetMapping("/users")
    public List<java.util.Map<String, Object>> getSystemUsers() {
        return utilisateurRepository.findAll().stream().map(u -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", u.getId());
            map.put("name", u.getPrenom() + " " + u.getNom());
            map.put("email", u.getEmail());
            map.put("role", u.getRole());
            map.put("actif", u.getActif());
            map.put("status", Boolean.TRUE.equals(u.getActif()) ? "نشط 🟢" : "غير نشط ⚪");
            map.put("lastLogin", "اليوم");
            return map;
        }).toList();
    }

    @GetMapping("/roles-summary")
    public List<java.util.Map<String, Object>> getRolesSummary() {
        long adminCount = utilisateurRepository.findAll().stream().filter(u -> "administrateur".equalsIgnoreCase(u.getRole())).count();
        long inspectorCount = utilisateurRepository.findAll().stream().filter(u -> "inspecteur".equalsIgnoreCase(u.getRole())).count();
        long teacherCount = utilisateurRepository.findAll().stream().filter(u -> "enseignant".equalsIgnoreCase(u.getRole())).count();

        return List.of(
            java.util.Map.of("title", "مدير النظام (System Admin)", "count", adminCount + " مستخدم نشط", "desc", "كامل صلاحيات الإدارة والتهيئة، إضافة المؤسسات، والمستخدمين وسجل العمليات."),
            java.util.Map.of("title", "المتفقد التربوي (Inspectors)", "count", inspectorCount + " مستخدمين", "desc", "صلاحيات تسجيل الزيارات الميدانية، تقييم كفايات الأساتذة، رسم التوقيع والتصدير."),
            java.util.Map.of("title", "الأستاذ (Teachers)", "count", teacherCount + " مستخدم نشط", "desc", "صلاحيات العرض فقط، قراءة التقارير المعتمدة وتحديث أهداف خطة النمو الشخصية.")
        );
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
