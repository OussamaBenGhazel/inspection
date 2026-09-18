package com.inspection.controller;

import com.inspection.model.*;
import com.inspection.service.PedagogyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/pedagogy")
public class PedagogyController {

    private final PedagogyService pedagogyService;

    public PedagogyController(PedagogyService pedagogyService) {
        this.pedagogyService = pedagogyService;
    }

    @GetMapping("/competencies")
    public List<EvaluationCompetence> getCompetencies(@RequestParam(value = "inspectionId", required = false) Long inspectionId) {
        return pedagogyService.getCompetenciesByInspection(inspectionId);
    }

    @GetMapping("/recommendations")
    public List<Recommandation> getRecommendations(@RequestParam(value = "enseignantId", required = false) Long enseignantId) {
        return pedagogyService.getRecommendationsByEnseignant(enseignantId);
    }

    @GetMapping("/indicators")
    public List<IndicateurCroissance> getIndicators(@RequestParam(value = "enseignantId", required = false) Long enseignantId) {
        return pedagogyService.getIndicatorsByEnseignant(enseignantId);
    }

    @GetMapping("/growth-plans")
    public List<PlanDeveloppement> getGrowthPlans(@RequestParam(value = "enseignantId", required = false) Long enseignantId) {
        return pedagogyService.getGrowthPlansByEnseignant(enseignantId);
    }

    @GetMapping("/diagnostic")
    public ResponseEntity<DiagnosticFinal> getDiagnostic(@RequestParam(value = "inspectionId", required = false) Long inspectionId) {
        DiagnosticFinal diag = pedagogyService.getDiagnosticByInspection(inspectionId);
        if (diag == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(diag);
    }

    @PutMapping("/indicators/{id}")
    public ResponseEntity<IndicateurCroissance> updateIndicator(
            @PathVariable("id") Long id,
            @RequestBody java.util.Map<String, String> body) {
        IndicateurCroissance updated = pedagogyService.updateIndicator(id, body.get("valeur"), body.get("commentaire"));
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/recommendations/{id}")
    public ResponseEntity<Recommandation> updateRecommendation(
            @PathVariable("id") Long id,
            @RequestBody java.util.Map<String, Object> body) {
        String statut = body.get("statut") != null ? body.get("statut").toString() : null;
        Integer prog = body.get("progression") != null ? Integer.valueOf(body.get("progression").toString()) : null;
        String evidence = body.get("evidence") != null ? body.get("evidence").toString() : null;
        Recommandation updated = pedagogyService.updateRecommendation(id, statut, prog, evidence);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/diagnostic")
    public ResponseEntity<DiagnosticFinal> saveDiagnostic(@RequestBody DiagnosticFinal diagnostic) {
        DiagnosticFinal saved = pedagogyService.saveDiagnostic(diagnostic);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/growth-plans")
    public ResponseEntity<PlanDeveloppement> saveGrowthPlan(@RequestBody PlanDeveloppement plan) {
        PlanDeveloppement saved = pedagogyService.saveGrowthPlan(plan);
        return ResponseEntity.ok(saved);
    }
}
