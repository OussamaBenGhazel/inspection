package com.inspection.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class InspectionDTO {
    private Long idInspection;
    private LocalDate dateVisite;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private Long idEnseignant;
    private Long idInspecteur;
    private String statut; // "ouverte", "en_cours", "cloturee"
    private String remarquesGenerales;
    private String signatureInspecteur;
    private List<EvaluationDTO> evaluations;

    public InspectionDTO() {}

    public Long getIdInspection() {
        return idInspection;
    }

    public void setIdInspection(Long idInspection) {
        this.idInspection = idInspection;
    }

    public LocalDate getDateVisite() {
        return dateVisite;
    }

    public void setDateVisite(LocalDate dateVisite) {
        this.dateVisite = dateVisite;
    }

    public LocalTime getHeureDebut() {
        return heureDebut;
    }

    public void setHeureDebut(LocalTime heureDebut) {
        this.heureDebut = heureDebut;
    }

    public LocalTime getHeureFin() {
        return heureFin;
    }

    public void setHeureFin(LocalTime heureFin) {
        this.heureFin = heureFin;
    }

    public Long getIdEnseignant() {
        return idEnseignant;
    }

    public void setIdEnseignant(Long idEnseignant) {
        this.idEnseignant = idEnseignant;
    }

    public Long getIdInspecteur() {
        return idInspecteur;
    }

    public void setIdInspecteur(Long idInspecteur) {
        this.idInspecteur = idInspecteur;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getRemarquesGenerales() {
        return remarquesGenerales;
    }

    public void setRemarquesGenerales(String remarquesGenerales) {
        this.remarquesGenerales = remarquesGenerales;
    }

    public String getSignatureInspecteur() {
        return signatureInspecteur;
    }

    public void setSignatureInspecteur(String signatureInspecteur) {
        this.signatureInspecteur = signatureInspecteur;
    }

    public List<EvaluationDTO> getEvaluations() {
        return evaluations;
    }

    public void setEvaluations(List<EvaluationDTO> evaluations) {
        this.evaluations = evaluations;
    }
}
