package com.inspection.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Entity
@Table(name = "enseignants")
@PrimaryKeyJoinColumn(name = "id_enseignant")
public class Enseignant extends Utilisateur {

    @NotBlank(message = "المادة الدراسية إجبارية")
    @Size(max = 100, message = "اسم المادة يجب ألا يتجاوز 100 حرف")
    @Column(name = "matiere", nullable = false, length = 100)
    private String matiere; // e.g. "التربية المدنية"

    @Pattern(regexp = "^(\\+216)?[0-9]{8}$", message = "رقم الهاتف يجب أن يتكون من 8 أرقام صحيحة")
    @Column(name = "telephone", length = 20)
    private String telephone;

    @ManyToOne
    @JoinColumn(name = "id_etablissement")
    private Etablissement etablissement;

    @ManyToOne
    @JoinColumn(name = "id_region")
    private Region region;

    @Column(name = "date_recrutement")
    private LocalDate dateRecrutement;

    @Column(name = "anciennete")
    private Integer anciennete; // in years

    @Size(max = 50)
    @Column(name = "statut", length = 50)
    private String statut; // e.g. "مترسم", "متربص", "متعاقد"

    public Enseignant() {
        super();
        setRole("enseignant");
    }

    public Enseignant(String nom, String prenom, String email, String motDePasse, String matiere, String telephone, Etablissement etablissement, Region region, LocalDate dateRecrutement, Integer anciennete, String statut) {
        super(nom, prenom, email, motDePasse, "enseignant");
        this.matiere = matiere;
        this.telephone = telephone;
        this.etablissement = etablissement;
        this.region = region;
        this.dateRecrutement = dateRecrutement;
        this.anciennete = anciennete;
        this.statut = statut;
    }

    // Backward-compatible constructor
    public Enseignant(String nom, String prenom, String matiere, String email, String telephone) {
        super(nom, prenom, email != null ? email : (prenom.toLowerCase() + "." + nom.toLowerCase() + "@education.tn"), "defaultPass123", "enseignant");
        this.matiere = matiere;
        this.telephone = telephone;
        this.anciennete = 10;
        this.statut = "مترسم";
    }

    public Long getIdEnseignant() {
        return getId();
    }

    public void setIdEnseignant(Long idEnseignant) {
        setId(idEnseignant);
    }

    public String getMatiere() {
        return matiere;
    }

    public void setMatiere(String matiere) {
        this.matiere = matiere;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public Etablissement getEtablissement() {
        return etablissement;
    }

    public void setEtablissement(Etablissement etablissement) {
        this.etablissement = etablissement;
    }

    public Region getRegion() {
        return region;
    }

    public void setRegion(Region region) {
        this.region = region;
    }

    public LocalDate getDateRecrutement() {
        return dateRecrutement;
    }

    public void setDateRecrutement(LocalDate dateRecrutement) {
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
}
