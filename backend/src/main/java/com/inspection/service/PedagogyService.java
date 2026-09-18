package com.inspection.service;

import com.inspection.model.*;
import com.inspection.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PedagogyService {

    private final EvaluationCompetenceRepository evaluationCompetenceRepository;
    private final RecommandationRepository recommandationRepository;
    private final IndicateurCroissanceRepository indicateurCroissanceRepository;
    private final PlanDeveloppementRepository planDeveloppementRepository;
    private final DiagnosticFinalRepository diagnosticFinalRepository;
    private final InspectionRepository inspectionRepository;

    public PedagogyService(
            EvaluationCompetenceRepository evaluationCompetenceRepository,
            RecommandationRepository recommandationRepository,
            IndicateurCroissanceRepository indicateurCroissanceRepository,
            PlanDeveloppementRepository planDeveloppementRepository,
            DiagnosticFinalRepository diagnosticFinalRepository,
            InspectionRepository inspectionRepository) {
        this.evaluationCompetenceRepository = evaluationCompetenceRepository;
        this.recommandationRepository = recommandationRepository;
        this.indicateurCroissanceRepository = indicateurCroissanceRepository;
        this.planDeveloppementRepository = planDeveloppementRepository;
        this.diagnosticFinalRepository = diagnosticFinalRepository;
        this.inspectionRepository = inspectionRepository;
    }

    public List<EvaluationCompetence> getCompetenciesByInspection(Long inspectionId) {
        if (inspectionId != null) {
            return evaluationCompetenceRepository.findByInspectionIdInspection(inspectionId);
        }
        return evaluationCompetenceRepository.findAll();
    }

    public List<Recommandation> getRecommendationsByEnseignant(Long enseignantId) {
        if (enseignantId != null) {
            return recommandationRepository.findByEnseignantId(enseignantId);
        }
        return recommandationRepository.findAll();
    }

    public List<IndicateurCroissance> getIndicatorsByEnseignant(Long enseignantId) {
        if (enseignantId != null) {
            return indicateurCroissanceRepository.findByEnseignantId(enseignantId);
        }
        return indicateurCroissanceRepository.findAll();
    }

    public List<PlanDeveloppement> getGrowthPlansByEnseignant(Long enseignantId) {
        if (enseignantId != null) {
            return planDeveloppementRepository.findByEnseignantId(enseignantId);
        }
        return planDeveloppementRepository.findAll();
    }

    public DiagnosticFinal getDiagnosticByInspection(Long inspectionId) {
        if (inspectionId != null) {
            return diagnosticFinalRepository.findByInspectionIdInspection(inspectionId).orElse(null);
        }
        List<DiagnosticFinal> list = diagnosticFinalRepository.findAll();
        return list.isEmpty() ? null : list.get(0);
    }

    public IndicateurCroissance updateIndicator(Long id, String valeur, String commentaire) {
        IndicateurCroissance ind = indicateurCroissanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Indicator not found: " + id));
        if (valeur != null) ind.setValeur(valeur);
        if (commentaire != null) ind.setCommentaire(commentaire);
        return indicateurCroissanceRepository.save(ind);
    }

    public Recommandation updateRecommendation(Long id, String statut, Integer progression, String evidence) {
        Recommandation rec = recommandationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recommendation not found: " + id));
        if (statut != null) rec.setStatut(statut);
        if (progression != null) rec.setTauxRealisation(progression);
        if (evidence != null) rec.setPointsActions(evidence);
        return recommandationRepository.save(rec);
    }

    public DiagnosticFinal saveDiagnostic(DiagnosticFinal diag) {
        if (diag.getIdDiagnostic() != null) {
            DiagnosticFinal existing = diagnosticFinalRepository.findById(diag.getIdDiagnostic()).orElse(diag);
            existing.setPointsForts(diag.getPointsForts());
            existing.setPointsFaibles(diag.getPointsFaibles());
            existing.setPriorites(diag.getPriorites());
            existing.setTypeAccompagnement(diag.getTypeAccompagnement());
            return diagnosticFinalRepository.save(existing);
        }
        return diagnosticFinalRepository.save(diag);
    }

    public PlanDeveloppement saveGrowthPlan(PlanDeveloppement plan) {
        if (plan.getIdPlan() != null) {
            PlanDeveloppement existing = planDeveloppementRepository.findById(plan.getIdPlan()).orElse(plan);
            existing.setObjectif(plan.getObjectif());
            existing.setActions(plan.getActions());
            existing.setRessources(plan.getRessources());
            existing.setDateEcheance(plan.getDateEcheance());
            existing.setIndicateurSucces(plan.getIndicateurSucces());
            existing.setStatut(plan.getStatut());
            return planDeveloppementRepository.save(existing);
        }
        return planDeveloppementRepository.save(plan);
    }
}
