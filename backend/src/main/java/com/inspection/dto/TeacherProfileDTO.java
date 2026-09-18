package com.inspection.dto;

import java.util.List;
import java.util.Map;

public class TeacherProfileDTO {
    private Long idEnseignant;
    private String nom;
    private String prenom;
    private String fullName;
    private String email;
    private String telephone;
    private String matiere;
    private String etablissement;
    private String region;
    private String dateRecrutement;
    private Integer anciennete;
    private String statut;
    private String inspecteurNom;
    private List<Map<String, Object>> recentVisits;
    private List<Map<String, Object>> competencies;
    private List<Map<String, Object>> recommendations;
    private List<Map<String, Object>> indicators;
    private List<Map<String, Object>> growthPlan;

    public TeacherProfileDTO() {}

    public Long getIdEnseignant() {
        return idEnseignant;
    }

    public void setIdEnseignant(Long idEnseignant) {
        this.idEnseignant = idEnseignant;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getMatiere() {
        return matiere;
    }

    public void setMatiere(String matiere) {
        this.matiere = matiere;
    }

    public String getEtablissement() {
        return etablissement;
    }

    public void setEtablissement(String etablissement) {
        this.etablissement = etablissement;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getDateRecrutement() {
        return dateRecrutement;
    }

    public void setDateRecrutement(String dateRecrutement) {
        this.dateRecrutement = dateRecrutement;
    }

    public Integer getAnciennete() {
        return anciennete;
    }

    public void setAnciennete(Integer anciennete) {
        this.anciennete = anciennete;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getInspecteurNom() {
        return inspecteurNom;
    }

    public void setInspecteurNom(String inspecteurNom) {
        this.inspecteurNom = inspecteurNom;
    }

    public List<Map<String, Object>> getRecentVisits() {
        return recentVisits;
    }

    public void setRecentVisits(List<Map<String, Object>> recentVisits) {
        this.recentVisits = recentVisits;
    }

    public List<Map<String, Object>> getCompetencies() {
        return competencies;
    }

    public void setCompetencies(List<Map<String, Object>> competencies) {
        this.competencies = competencies;
    }

    public List<Map<String, Object>> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<Map<String, Object>> recommendations) {
        this.recommendations = recommendations;
    }

    public List<Map<String, Object>> getIndicators() {
        return indicators;
    }

    public void setIndicators(List<Map<String, Object>> indicators) {
        this.indicators = indicators;
    }

    public List<Map<String, Object>> getGrowthPlan() {
        return growthPlan;
    }

    public void setGrowthPlan(List<Map<String, Object>> growthPlan) {
        this.growthPlan = growthPlan;
    }
}
