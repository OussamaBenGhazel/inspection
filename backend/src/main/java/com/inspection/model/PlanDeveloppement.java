package com.inspection.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Entity
@Table(name = "plans_developpement")
public class PlanDeveloppement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_plan")
    private Long idPlan;

    @NotBlank(message = "الهدف التطويري إجباري")
    @Column(name = "objectif", nullable = false, length = 255)
    private String objectif;

    @Column(name = "actions", columnDefinition = "TEXT")
    private String actions; // List of specific procedural actions

    @Column(name = "ressources", columnDefinition = "TEXT")
    private String ressources;

    @NotNull
    @Column(name = "date_echeance", nullable = false)
    private LocalDate dateEcheance;

    @Column(name = "indicateur_succes", columnDefinition = "TEXT")
    private String indicateurSucces;

    @Size(max = 50)
    @Column(name = "statut", length = 50)
    private String statut; // "قيد التنفيذ", "مكتمل", "بحاجة لتعديل"

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_enseignant", nullable = false)
    private Enseignant enseignant;

    public PlanDeveloppement() {}

    public PlanDeveloppement(String objectif, String actions, String ressources, LocalDate dateEcheance, String indicateurSucces, String statut, Enseignant enseignant) {
        this.objectif = objectif;
        this.actions = actions;
        this.ressources = ressources;
        this.dateEcheance = dateEcheance;
        this.indicateurSucces = indicateurSucces;
        this.statut = statut;
        this.enseignant = enseignant;
    }

    public Long getIdPlan() {
        return idPlan;
    }

    public void setIdPlan(Long idPlan) {
        this.idPlan = idPlan;
    }

    public String getObjectif() {
        return objectif;
    }

    public void setObjectif(String objectif) {
        this.objectif = objectif;
    }

    public String getActions() {
        return actions;
    }

    public void setActions(String actions) {
        this.actions = actions;
    }

    public String getRessources() {
        return ressources;
    }

    public void setRessources(String ressources) {
        this.ressources = ressources;
    }

    public LocalDate getDateEcheance() {
        return dateEcheance;
    }

    public void setDateEcheance(LocalDate dateEcheance) {
        this.dateEcheance = dateEcheance;
    }

    public String getIndicateurSucces() {
        return indicateurSucces;
    }

    public void setIndicateurSucces(String indicateurSucces) {
        this.indicateurSucces = indicateurSucces;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public Enseignant getEnseignant() {
        return enseignant;
    }

    public void setEnseignant(Enseignant enseignant) {
        this.enseignant = enseignant;
    }
}
