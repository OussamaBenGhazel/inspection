package com.inspection.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "etablissements")
public class Etablissement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_etablissement")
    private Long idEtablissement;

    @NotBlank
    @Size(max = 150)
    @Column(name = "nom", nullable = false, length = 150)
    private String nom;

    @Size(max = 50)
    @Column(name = "type", length = 50)
    private String type; // e.g. "مدرسة إعدادية", "معهد ثانوي"

    @ManyToOne
    @JoinColumn(name = "id_region")
    private Region region;

    @Size(max = 100)
    @Column(name = "commune", length = 100)
    private String commune;

    @Size(max = 255)
    @Column(name = "adresse", length = 255)
    private String adresse;

    public Etablissement() {}

    public Etablissement(String nom, String type, Region region, String commune, String adresse) {
        this.nom = nom;
        this.type = type;
        this.region = region;
        this.commune = commune;
        this.adresse = adresse;
    }

    public Long getIdEtablissement() {
        return idEtablissement;
    }

    public void setIdEtablissement(Long idEtablissement) {
        this.idEtablissement = idEtablissement;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Region getRegion() {
        return region;
    }

    public void setRegion(Region region) {
        this.region = region;
    }

    public String getCommune() {
        return commune;
    }

    public void setCommune(String commune) {
        this.commune = commune;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }
}
