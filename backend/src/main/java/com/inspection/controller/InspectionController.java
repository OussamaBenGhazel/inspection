package com.inspection.controller;

import com.inspection.dto.EvaluationDTO;
import com.inspection.dto.InspectionDTO;
import com.inspection.model.*;
import com.inspection.repository.*;
import com.inspection.service.PdfReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/inspections")
public class InspectionController {

    private final InspectionRepository inspectionRepository;
    private final EnseignantRepository enseignantRepository;
    private final InspecteurRepository inspecteurRepository;
    private final EvaluationRepository evaluationRepository;
    private final PieceJointeRepository pieceJointeRepository;
    private final PdfReportService pdfReportService;

    // Define local upload directory
    private final String uploadDir = System.getProperty("user.dir") + "/uploads/";

    public InspectionController(
            InspectionRepository inspectionRepository,
            EnseignantRepository enseignantRepository,
            InspecteurRepository inspecteurRepository,
            EvaluationRepository evaluationRepository,
            PieceJointeRepository pieceJointeRepository,
            PdfReportService pdfReportService) {
        this.inspectionRepository = inspectionRepository;
        this.enseignantRepository = enseignantRepository;
        this.inspecteurRepository = inspecteurRepository;
        this.evaluationRepository = evaluationRepository;
        this.pieceJointeRepository = pieceJointeRepository;
        this.pdfReportService = pdfReportService;

        // Ensure upload directory exists
        File uploadFolder = new File(uploadDir);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }
    }

    @GetMapping
    public List<Inspection> getAll() {
        return inspectionRepository.findAll();
    }

    @GetMapping("/recent")
    public List<Inspection> getRecent() {
        return inspectionRepository.findTop5ByOrderByDateCreationDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Inspection inspection = inspectionRepository.findById(id).orElse(null);
        if (inspection == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(inspection);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody InspectionDTO dto) {
        Enseignant enseignant = enseignantRepository.findById(dto.getIdEnseignant()).orElse(null);
        Inspecteur inspecteur = inspecteurRepository.findById(dto.getIdInspecteur()).orElse(null);

        if (enseignant == null || inspecteur == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Enseignant or Inspecteur not found");
        }

        Inspection inspection = new Inspection();
        inspection.setDateVisite(dto.getDateVisite());
        inspection.setHeureDebut(dto.getHeureDebut());
        inspection.setHeureFin(dto.getHeureFin());
        inspection.setEnseignant(enseignant);
        inspection.setInspecteur(inspecteur);
        inspection.setStatut(InspectionStatut.ouverte);
        inspection.setRemarquesGenerales(dto.getRemarquesGenerales());

        Inspection savedInspection = inspectionRepository.save(inspection);

        // Save evaluations if provided
        if (dto.getEvaluations() != null) {
            for (EvaluationDTO evDto : dto.getEvaluations()) {
                Evaluation ev = new Evaluation();
                ev.setInspection(savedInspection);
                ev.setCritere(evDto.getCritere());
                ev.setNote(evDto.getNote());
                ev.setCommentaire(evDto.getCommentaire());
                evaluationRepository.save(ev);
            }
        }

        return ResponseEntity.ok(savedInspection);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody InspectionDTO dto) {
        Inspection inspection = inspectionRepository.findById(id).orElse(null);
        if (inspection == null) {
            return ResponseEntity.notFound().build();
        }

        if (inspection.getStatut() == InspectionStatut.cloturee) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot update a closed inspection");
        }

        // Business rules: "ouverte" can modify everything. "en_cours" can modify comments/general remarks.
        if (inspection.getStatut() == InspectionStatut.ouverte) {
            if (dto.getDateVisite() != null) inspection.setDateVisite(dto.getDateVisite());
            if (dto.getHeureDebut() != null) inspection.setHeureDebut(dto.getHeureDebut());
            if (dto.getHeureFin() != null) inspection.setHeureFin(dto.getHeureFin());
            if (dto.getIdEnseignant() != null) {
                Enseignant e = enseignantRepository.findById(dto.getIdEnseignant()).orElse(null);
                if (e != null) inspection.setEnseignant(e);
            }
        }

        // Both "ouverte" and "en_cours" can update general remarks and signatures
        if (dto.getRemarquesGenerales() != null) {
            inspection.setRemarquesGenerales(dto.getRemarquesGenerales());
        }
        if (dto.getSignatureInspecteur() != null) {
            inspection.setSignatureInspecteur(dto.getSignatureInspecteur());
        }
        if (dto.getStatut() != null) {
            try {
                inspection.setStatut(InspectionStatut.valueOf(dto.getStatut()));
            } catch (Exception ignored) {}
        }

        Inspection updated = inspectionRepository.save(inspection);

        // Update evaluations if "ouverte"
        if (inspection.getStatut() == InspectionStatut.ouverte && dto.getEvaluations() != null) {
            // Delete existing evaluations for simplicity in updates, or merge them.
            List<Evaluation> existing = evaluationRepository.findByInspectionIdInspection(id);
            evaluationRepository.deleteAll(existing);

            for (EvaluationDTO evDto : dto.getEvaluations()) {
                Evaluation ev = new Evaluation();
                ev.setInspection(updated);
                ev.setCritere(evDto.getCritere());
                ev.setNote(evDto.getNote());
                ev.setCommentaire(evDto.getCommentaire());
                evaluationRepository.save(ev);
            }
        }

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Inspection inspection = inspectionRepository.findById(id).orElse(null);
        if (inspection == null) {
            return ResponseEntity.notFound().build();
        }

        // Rule: cannot delete closed inspections
        if (inspection.getStatut() == InspectionStatut.cloturee) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot delete a closed inspection");
        }

        // Delete dependencies
        evaluationRepository.deleteAll(evaluationRepository.findByInspectionIdInspection(id));
        pieceJointeRepository.deleteAll(pieceJointeRepository.findByInspectionIdInspection(id));
        inspectionRepository.delete(inspection);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/evaluations")
    public List<Evaluation> getEvaluations(@PathVariable Long id) {
        return evaluationRepository.findByInspectionIdInspection(id);
    }

    @GetMapping("/{id}/pieces")
    public List<PieceJointe> getPieces(@PathVariable Long id) {
        return pieceJointeRepository.findByInspectionIdInspection(id);
    }

    @PostMapping("/{id}/pieces")
    public ResponseEntity<?> uploadPiece(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        Inspection inspection = inspectionRepository.findById(id).orElse(null);
        if (inspection == null) {
            return ResponseEntity.notFound().build();
        }

        // File checks
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Uploaded file is empty");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("File size exceeds 5MB limit");
        }

        String originalName = file.getOriginalFilename();
        String extension = originalName != null && originalName.contains(".") ?
                originalName.substring(originalName.lastIndexOf(".")).toLowerCase() : "";

        if (!extension.equals(".pdf") && !extension.equals(".png") && !extension.equals(".jpg") && !extension.equals(".jpeg")) {
            return ResponseEntity.badRequest().body("Invalid file format. Only PDF, JPG, and PNG are allowed");
        }

        try {
            String newFilename = UUID.randomUUID().toString() + extension;
            Path targetPath = Paths.get(uploadDir, newFilename);
            Files.copy(file.getInputStream(), targetPath);

            PieceJointe pj = new PieceJointe();
            pj.setInspection(inspection);
            pj.setNomFichier(originalName);
            pj.setCheminFichier(newFilename);
            pj.setTypeFichier(extension.replace(".", "").toUpperCase());

            PieceJointe saved = pieceJointeRepository.save(pj);
            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not store file: " + e.getMessage());
        }
    }

    @GetMapping("/pieces/download/{filename}")
    public ResponseEntity<?> downloadPiece(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir, filename);
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            byte[] fileBytes = Files.readAllBytes(filePath);
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(fileBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error reading file: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/report")
    public ResponseEntity<?> getPdfReport(@PathVariable Long id) {
        Inspection inspection = inspectionRepository.findById(id).orElse(null);
        if (inspection == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] pdfBytes = pdfReportService.generateInspectionReport(inspection);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "inspection-report-" + id + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
