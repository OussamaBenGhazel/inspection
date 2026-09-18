package com.inspection.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "indicateurs_croissance")
public class IndicateurCroissance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_indicateur")
    private Long idIndicateur;

    @NotBlank(message = "عنوان المؤشر إجباري")
    @Size(max = 200)
    @Column(name = "libelle", nullable = false, length = 200)
    private String libelle;

    @NotBlank(message = "قيمة المؤشر إجبارية")
    @Size(max = 20)
    @Column(name = "valeur", nullable = false, length = 20)
    private String valeur; // "نعم", "جزئيا", "لا" (or "yes", "partial", "no")

    @Column(name = "commentaire", columnDefinition = "TEXT")
    private String commentaire;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_enseignant", nullable = false)
    private Enseignant enseignant;

    @ManyToOne
    @JoinColumn(name = "id_inspection")
    private Inspection inspection;

    public IndicateurCroissance() {}

    public IndicateurCroissance(String libelle, String valeur, String commentaire, Enseignant enseignant, Inspection inspection) {
        this.libelle = libelle;
        this.valeur = valeur;
        this.commentaire = commentaire;
        this.enseignant = enseignant;
        this.inspection = inspection;
    }

    public Long getIdIndicateur() {
        return idIndicateur;
    }

    public void setIdIndicateur(Long idIndicateur) {
        this.idIndicateur = idIndicateur;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public String getValeur() {
        return valeur;
    }

    public void setValeur(String valeur) {
        this.valeur = valeur;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public Enseignant getEnseignant() {
        return enseignant;
    }

    public void setEnseignant(Enseignant enseignant) {
        this.enseignant = enseignant;
    }

    public Inspection getInspection() {
        return inspection;
    }

    public void setInspection(Inspection inspection) {
        this.inspection = inspection;
    }
}
