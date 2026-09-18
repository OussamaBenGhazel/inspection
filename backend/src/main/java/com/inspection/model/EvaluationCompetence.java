package com.inspection.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "evaluations_competence")
public class EvaluationCompetence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_eval_comp")
    private Long idEvalComp;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_inspection", nullable = false)
    private Inspection inspection;

    @NotBlank
    @Size(max = 150)
    @Column(name = "domaine", nullable = false, length = 150)
    private String domaine; // One of the 8 domains

    @NotNull
    @Column(name = "note", nullable = false)
    private Double note; // e.g. 3.5 / 4.0

    @NotBlank
    @Size(max = 50)
    @Column(name = "niveau", nullable = false, length = 50)
    private String niveau; // e.g. "متقن", "مرض", "في طور التمكن", "يحتاج دعما"

    @Size(max = 50)
    @Column(name = "tendance", length = 50)
    private String tendance; // e.g. "↑ تطور إيجابي", "↔ استقرار", "↑ يحتاج دعما"

    @Column(name = "commentaire", columnDefinition = "TEXT")
    private String commentaire;

    public EvaluationCompetence() {}

    public EvaluationCompetence(Inspection inspection, String domaine, Double note, String niveau, String tendance, String commentaire) {
        this.inspection = inspection;
        this.domaine = domaine;
        this.note = note;
        this.niveau = niveau;
        this.tendance = tendance;
        this.commentaire = commentaire;
    }

    public Long getIdEvalComp() {
        return idEvalComp;
    }

    public void setIdEvalComp(Long idEvalComp) {
        this.idEvalComp = idEvalComp;
    }

    public Inspection getInspection() {
        return inspection;
    }

    public void setInspection(Inspection inspection) {
        this.inspection = inspection;
    }

    public String getDomaine() {
        return domaine;
    }

    public void setDomaine(String domaine) {
        this.domaine = domaine;
    }

    public Double getNote() {
        return note;
    }

    public void setNote(Double note) {
        this.note = note;
    }

    public String getNiveau() {
        return niveau;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }

    public String getTendance() {
        return tendance;
    }

    public void setTendance(String tendance) {
        this.tendance = tendance;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }
}
