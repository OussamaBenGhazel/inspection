package com.inspection.service;

import com.inspection.dto.TeacherItemDTO;
import com.inspection.dto.TeacherProfileDTO;
import com.inspection.model.*;
import com.inspection.repository.*;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class EnseignantService {

    private final EnseignantRepository enseignantRepository;
    private final InspectionRepository inspectionRepository;
    private final EvaluationCompetenceRepository evaluationCompetenceRepository;
    private final RecommandationRepository recommandationRepository;
    private final IndicateurCroissanceRepository indicateurCroissanceRepository;
    private final PlanDeveloppementRepository planDeveloppementRepository;

    public EnseignantService(
            EnseignantRepository enseignantRepository,
            InspectionRepository inspectionRepository,
            EvaluationCompetenceRepository evaluationCompetenceRepository,
            RecommandationRepository recommandationRepository,
            IndicateurCroissanceRepository indicateurCroissanceRepository,
            PlanDeveloppementRepository planDeveloppementRepository) {
        this.enseignantRepository = enseignantRepository;
        this.inspectionRepository = inspectionRepository;
        this.evaluationCompetenceRepository = evaluationCompetenceRepository;
        this.recommandationRepository = recommandationRepository;
        this.indicateurCroissanceRepository = indicateurCroissanceRepository;
        this.planDeveloppementRepository = planDeveloppementRepository;
    }

    public List<TeacherItemDTO> getAllTeachers() {
        List<Enseignant> teachers = enseignantRepository.findAll();
        List<TeacherItemDTO> dtos = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy", new Locale("ar"));

        for (Enseignant t : teachers) {
            List<Inspection> visits = inspectionRepository.findByEnseignantId(t.getId());
            String lastVisitStr = "لا توجد زيارات";
            double avgScore = 3.0;

            if (!visits.isEmpty()) {
                Inspection latest = visits.get(visits.size() - 1);
                if (latest.getDateVisite() != null) {
                    try {
                        lastVisitStr = latest.getDateVisite().format(formatter);
                    } catch (Exception e) {
                        lastVisitStr = latest.getDateVisite().toString();
                    }
                }

                // Compute average from competencies of this teacher's inspections
                List<EvaluationCompetence> evs = evaluationCompetenceRepository.findByInspectionIdInspection(latest.getIdInspection());
                if (!evs.isEmpty()) {
                    double s = 0;
                    for (EvaluationCompetence ev : evs) s += ev.getNote();
                    avgScore = s / evs.size();
                } else {
                    avgScore = 3.2;
                }
            }

            String scoreFormatted = String.format(Locale.US, "%.1f", avgScore);
            String status = "مستقر";
            String tone = "info";

            if (avgScore >= 3.4) {
                status = "متقدم";
                tone = "success";
            } else if (avgScore >= 2.8) {
                status = "مستقر";
                tone = "info";
            } else if (avgScore >= 2.4) {
                status = "متابعة";
                tone = "warning";
            } else {
                status = "دعم عاجل";
                tone = "danger";
            }

            String etablissementName = t.getEtablissement() != null ? t.getEtablissement().getNom() : "إعدادية ابن رشد";
            String regionName = t.getRegion() != null ? t.getRegion().getNom() : "قابس";

            TeacherItemDTO dto = new TeacherItemDTO(
                    t.getId(),
                    t.getNom(),
                    t.getPrenom(),
                    t.getMatiere(),
                    etablissementName,
                    regionName,
                    t.getTelephone(),
                    t.getEmail(),
                    lastVisitStr,
                    scoreFormatted,
                    status,
                    tone
            );
            dtos.add(dto);
        }

        return dtos;
    }

    public TeacherProfileDTO getTeacherProfile(Long teacherId) {
        Enseignant t = enseignantRepository.findById(teacherId).orElse(null);
        if (t == null) return null;

        TeacherProfileDTO dto = new TeacherProfileDTO();
        dto.setIdEnseignant(t.getId());
        dto.setNom(t.getNom());
        dto.setPrenom(t.getPrenom());
        dto.setFullName(t.getPrenom() + " " + t.getNom());
        dto.setEmail(t.getEmail());
        dto.setTelephone(t.getTelephone());
        dto.setMatiere(t.getMatiere());
        dto.setEtablissement(t.getEtablissement() != null ? t.getEtablissement().getNom() : "إعدادية ابن رشد");
        dto.setRegion(t.getRegion() != null ? t.getRegion().getNom() : "قابس");
        dto.setDateRecrutement(t.getDateRecrutement() != null ? t.getDateRecrutement().toString() : "15 سبتمبر 2014");
        dto.setAnciennete(t.getAnciennete() != null ? t.getAnciennete() : 12);
        dto.setStatut(t.getStatut() != null ? t.getStatut() : "أستاذ أول");
        dto.setInspecteurNom("المتفقدة آمنة فرحات");

        // Visits timeline
        List<Inspection> visits = inspectionRepository.findByEnseignantId(t.getId());
        List<Map<String, Object>> visitList = new ArrayList<>();
        for (Inspection v : visits) {
            Map<String, Object> vMap = new HashMap<>();
            vMap.put("title", v.getTypeVisite() != null ? ("زيارة " + v.getTypeVisite().getLibelle()) : "زيارة تفقدية");
            vMap.put("date", v.getDateVisite() != null ? v.getDateVisite().toString() : "2027-05-20");
            vMap.put("status", v.getStatut() != null ? v.getStatut().name() : "متقن");
            vMap.put("badge", "success");
            visitList.add(vMap);
        }
        if (visitList.isEmpty()) {
            Map<String, Object> defaultV = new HashMap<>();
            defaultV.put("title", "زيارة تشخيصية");
            defaultV.put("date", "12 أكتوبر 2026");
            defaultV.put("status", "في طور التمكن");
            defaultV.put("badge", "warning");
            visitList.add(defaultV);
        }
        dto.setRecentVisits(visitList);

        // Competencies
        List<Map<String, Object>> compList = new ArrayList<>();
        if (!visits.isEmpty()) {
            List<EvaluationCompetence> evs = evaluationCompetenceRepository.findByInspectionIdInspection(visits.get(0).getIdInspection());
            for (EvaluationCompetence ev : evs) {
                Map<String, Object> cMap = new HashMap<>();
                cMap.put("label", ev.getDomaine());
                cMap.put("score", ev.getNote() != null ? ev.getNote().toString() : "3.5");
                cMap.put("trend", ev.getTendance() != null ? ev.getTendance() : "↑ تطور إيجابي");
                compList.add(cMap);
            }
        }
        dto.setCompetencies(compList);

        // Recommendations
        List<Recommandation> recs = recommandationRepository.findByEnseignantId(t.getId());
        List<Map<String, Object>> recList = new ArrayList<>();
        for (Recommandation r : recs) {
            Map<String, Object> rMap = new HashMap<>();
            rMap.put("title", r.getLibelle());
            rMap.put("status", r.getStatut());
            rMap.put("progress", r.getTauxRealisation());
            rMap.put("tone", r.getTauxRealisation() >= 80 ? "success" : (r.getTauxRealisation() >= 40 ? "warning" : "danger"));
            rMap.put("bullets", r.getPointsActions() != null ? Arrays.asList(r.getPointsActions().split(";")) : Collections.emptyList());
            recList.add(rMap);
        }
        dto.setRecommendations(recList);

        // Indicators
        List<IndicateurCroissance> inds = indicateurCroissanceRepository.findByEnseignantId(t.getId());
        List<Map<String, Object>> indList = new ArrayList<>();
        for (IndicateurCroissance ind : inds) {
            Map<String, Object> iMap = new HashMap<>();
            iMap.put("label", ind.getLibelle());
            iMap.put("valeur", ind.getValeur());
            indList.add(iMap);
        }
        dto.setIndicators(indList);

        // Growth Plan
        List<PlanDeveloppement> plans = planDeveloppementRepository.findByEnseignantId(t.getId());
        List<Map<String, Object>> planList = new ArrayList<>();
        for (PlanDeveloppement p : plans) {
            Map<String, Object> pMap = new HashMap<>();
            pMap.put("goal", p.getObjectif());
            pMap.put("actions", p.getActions() != null ? Arrays.asList(p.getActions().split(";")) : Collections.emptyList());
            pMap.put("resources", p.getRessources());
            pMap.put("date", p.getDateEcheance() != null ? p.getDateEcheance().toString() : "2027-06-30");
            pMap.put("success", p.getIndicateurSucces());
            planList.add(pMap);
        }
        dto.setGrowthPlan(planList);

        return dto;
    }
}
