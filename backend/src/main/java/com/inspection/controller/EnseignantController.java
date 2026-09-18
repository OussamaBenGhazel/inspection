package com.inspection.controller;

import com.inspection.dto.TeacherItemDTO;
import com.inspection.dto.TeacherProfileDTO;
import com.inspection.model.Enseignant;
import com.inspection.repository.EnseignantRepository;
import com.inspection.service.EnseignantService;
import com.inspection.kafka.NotificationKafkaProducer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/enseignants")
public class EnseignantController {

    private final EnseignantRepository enseignantRepository;
    private final EnseignantService enseignantService;
    private final NotificationKafkaProducer kafkaProducer;

    public EnseignantController(
            EnseignantRepository enseignantRepository,
            EnseignantService enseignantService,
            NotificationKafkaProducer kafkaProducer) {
        this.enseignantRepository = enseignantRepository;
        this.enseignantService = enseignantService;
        this.kafkaProducer = kafkaProducer;
    }

    @GetMapping
    public List<TeacherItemDTO> getAll() {
        return enseignantService.getAllTeachers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enseignant> getById(@PathVariable Long id) {
        Enseignant e = enseignantRepository.findById(id).orElse(null);
        if (e == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(e);
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<TeacherProfileDTO> getProfile(@PathVariable Long id) {
        TeacherProfileDTO profile = enseignantService.getTeacherProfile(id);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(profile);
    }

    @PostMapping
    public ResponseEntity<Enseignant> create(@RequestBody Enseignant enseignant) {
        Enseignant saved = enseignantRepository.save(enseignant);

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

        try {
            String logMsg = String.format("تم حذف الأستاذ: %s %s نهائياً من النظام.", existing.getPrenom(), existing.getNom());
            kafkaProducer.sendAuditLog("حذف أستاذ", logMsg, "admin");
        } catch (Exception ignored) {}

        return ResponseEntity.ok().build();
    }
}
