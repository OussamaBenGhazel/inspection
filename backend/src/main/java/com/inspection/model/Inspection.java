package com.inspection.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "inspections")
public class Inspection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inspection")
    private Long idInspection;

    @Column(name = "date_visite", nullable = false)
    private LocalDate dateVisite;

    @Column(name = "heure_debut", nullable = false)
    private LocalTime heureDebut;

    @Column(name = "heure_fin", nullable = false)
    private LocalTime heureFin;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_enseignant", nullable = false)
    private Enseignant enseignant;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_inspecteur", nullable = false)
    private Inspecteur inspecteur;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false, length = 20)
    private InspectionStatut statut = InspectionStatut.ouverte;

    @Column(name = "remarques_generales", columnDefinition = "TEXT")
    private String remarquesGenerales;

    // We can store signature as base64 string or a large text block. Text is more stable and versatile for modern base64 drawings than standard raw BLOB.
    @Column(name = "signature_inspecteur", columnDefinition = "TEXT")
    private String signatureInspecteur;

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDateTime.now();
        if (this.statut == null) {
            this.statut = InspectionStatut.ouverte;
        }
    }

    public Inspection() {}

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

    public Enseignant getEnseignant() {
        return enseignant;
    }

    public void setEnseignant(Enseignant enseignant) {
        this.enseignant = enseignant;
    }

    public Inspecteur getInspecteur() {
        return inspecteur;
    }

    public void setInspecteur(Inspecteur inspecteur) {
        this.inspecteur = inspecteur;
    }

    public InspectionStatut getStatut() {
        return statut;
    }

    public void setStatut(InspectionStatut statut) {
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

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }
}
