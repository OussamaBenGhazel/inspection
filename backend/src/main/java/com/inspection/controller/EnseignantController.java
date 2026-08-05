package com.inspection.controller;

import com.inspection.model.Enseignant;
import com.inspection.repository.EnseignantRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/enseignants")
public class EnseignantController {

    private final EnseignantRepository enseignantRepository;

    public EnseignantController(EnseignantRepository enseignantRepository) {
        this.enseignantRepository = enseignantRepository;
    }

    @GetMapping
    public List<Enseignant> getAll() {
        return enseignantRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Enseignant> create(@RequestBody Enseignant enseignant) {
        Enseignant saved = enseignantRepository.save(enseignant);
        return ResponseEntity.ok(saved);
    }
}
