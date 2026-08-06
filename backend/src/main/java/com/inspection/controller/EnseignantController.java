package com.inspection.controller;

import com.inspection.model.Enseignant;
import com.inspection.repository.EnseignantRepository;
import com.inspection.kafka.NotificationKafkaProducer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/enseignants")
public class EnseignantController {

    private final EnseignantRepository enseignantRepository;
    private final NotificationKafkaProducer kafkaProducer;

    public EnseignantController(EnseignantRepository enseignantRepository, NotificationKafkaProducer kafkaProducer) {
        this.enseignantRepository = enseignantRepository;
        this.kafkaProducer = kafkaProducer;
    }

    @GetMapping
    public List<Enseignant> getAll() {
        return enseignantRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Enseignant> create(@RequestBody Enseignant enseignant) {
        Enseignant saved = enseignantRepository.save(enseignant);

        // Log action to Kafka
        try {
            String logMsg = String.format("تمت إضافة أستاذ جديد بنجاح: %s %s.", saved.getPrenom(), saved.getNom());
            kafkaProducer.sendAuditLog("إضافة أستاذ", logMsg, "admin");
        } catch (Exception ignored) {}

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Enseignant> update(@PathVariable Long id, @RequestBody Enseignant updated) {
        Enseignant existing = enseignantRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        existing.setNom(updated.getNom());
        existing.setPrenom(updated.getPrenom());
        existing.setEmail(updated.getEmail());
        existing.setTelephone(updated.getTelephone());
        existing.setMatiere(updated.getMatiere());

        Enseignant saved = enseignantRepository.save(existing);

        // Log action to Kafka
        try {
            String logMsg = String.format("تم تحديث بيانات الأستاذ: %s %s.", saved.getPrenom(), saved.getNom());
            kafkaProducer.sendAuditLog("تعديل أستاذ", logMsg, "admin");
        } catch (Exception ignored) {}

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Enseignant existing = enseignantRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        enseignantRepository.delete(existing);

        // Log action to Kafka
        try {
            String logMsg = String.format("تم حذف الأستاذ: %s %s نهائياً من النظام.", existing.getPrenom(), existing.getNom());
            kafkaProducer.sendAuditLog("حذف أستاذ", logMsg, "admin");
        } catch (Exception ignored) {}

        return ResponseEntity.ok().build();
    }
}
