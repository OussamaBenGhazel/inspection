package com.inspection.dto;

public class TeacherItemDTO {
    private Long idEnseignant;
    private String nom;
    private String prenom;
    private String fullName;
    private String matiere;
    private String etablissement;
    private String region;
    private String telephone;
    private String email;
    private String lastVisitDate;
    private String score;
    private String status; // "متقدم", "متابعة", "مستقر", "دعم عاجل"
    private String tone;   // "success", "warning", "info", "danger"

    public TeacherItemDTO() {}

    public TeacherItemDTO(Long idEnseignant, String nom, String prenom, String matiere, String etablissement, String region, String telephone, String email, String lastVisitDate, String score, String status, String tone) {
        this.idEnseignant = idEnseignant;
        this.nom = nom;
        this.prenom = prenom;
        this.fullName = prenom + " " + nom;
        this.matiere = matiere;
        this.etablissement = etablissement;
        this.region = region;
        this.telephone = telephone;
        this.email = email;
        this.lastVisitDate = lastVisitDate;
        this.score = score;
        this.status = status;
        this.tone = tone;
    }

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

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLastVisitDate() {
        return lastVisitDate;
    }

    public void setLastVisitDate(String lastVisitDate) {
        this.lastVisitDate = lastVisitDate;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTone() {
        return tone;
    }

    public void setTone(String tone) {
        this.tone = tone;
    }
}
