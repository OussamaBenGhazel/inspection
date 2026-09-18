package com.inspection.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Entity
@Table(name = "recommandations")
public class Recommandation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_recommandation")
    private Long idRecommandation;

    @NotBlank(message = "نص التوصية إجباري")
    @Column(name = "libelle", nullable = false, columnDefinition = "TEXT")
    private String libelle;

    @NotNull
    @Column(name = "date_emission", nullable = false)
    private LocalDate dateEmission;

    @Column(name = "echeance")
    private LocalDate echeance;

    @NotBlank
    @Size(max = 50)
    @Column(name = "statut", nullable = false, length = 50)
    private String statut; // "منجزة بالكامل", "منجزة جزئيا", "غير منجزة"

    @NotNull
    @Min(0)
    @Max(100)
    @Column(name = "taux_realisation", nullable = false)
    private Integer tauxRealisation = 0; // 0 to 100

    @Column(name = "points_actions", columnDefinition = "TEXT")
    private String pointsActions; // JSON or comma-separated list of actions / evidence

    @ManyToOne
    @JoinColumn(name = "id_inspection")
    private Inspection inspection;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_enseignant", nullable = false)
    private Enseignant enseignant;

    public Recommandation() {}

    public Recommandation(String libelle, LocalDate dateEmission, LocalDate echeance, String statut, Integer tauxRealisation, String pointsActions, Inspection inspection, Enseignant enseignant) {
        this.libelle = libelle;
        this.dateEmission = dateEmission;
        this.echeance = echeance;
        this.statut = statut;
        this.tauxRealisation = tauxRealisation;
        this.pointsActions = pointsActions;
        this.inspection = inspection;
        this.enseignant = enseignant;
    }

    public Long getIdRecommandation() {
        return idRecommandation;
    }

    public void setIdRecommandation(Long idRecommandation) {
        this.idRecommandation = idRecommandation;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public LocalDate getDateEmission() {
        return dateEmission;
    }

    public void setDateEmission(LocalDate dateEmission) {
        this.dateEmission = dateEmission;
    }

    public LocalDate getEcheance() {
        return echeance;
    }

    public void setEcheance(LocalDate echeance) {
        this.echeance = echeance;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public Integer getTauxRealisation() {
        return tauxRealisation;
    }

    public void setTauxRealisation(Integer tauxRealisation) {
        this.tauxRealisation = tauxRealisation;
    }

    public String getPointsActions() {
        return pointsActions;
    }

    public void setPointsActions(String pointsActions) {
        this.pointsActions = pointsActions;
    }

    public Inspection getInspection() {
        return inspection;
    }

    public void setInspection(Inspection inspection) {
        this.inspection = inspection;
    }

    public Enseignant getEnseignant() {
        return enseignant;
    }

    public void setEnseignant(Enseignant enseignant) {
        this.enseignant = enseignant;
    }
}
