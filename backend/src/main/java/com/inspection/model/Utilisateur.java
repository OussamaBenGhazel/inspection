package com.inspection.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "utilisateurs")
@Inheritance(strategy = InheritanceType.JOINED)
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotBlank(message = "اللقب إجباري")
    @Size(max = 100, message = "اللقب يجب ألا يتجاوز 100 حرف")
    @Column(name = "nom", nullable = false, length = 100)
    private String nom;

    @NotBlank(message = "الاسم إجباري")
    @Size(max = 100, message = "الاسم يجب ألا يتجاوز 100 حرف")
    @Column(name = "prenom", nullable = false, length = 100)
    private String prenom;

    @NotBlank(message = "البريد الإلكتروني إجباري")
    @Email(message = "صيغة البريد الإلكتروني غير صالحة")
    @Size(max = 150, message = "البريد الإلكتروني يجب ألا يتجاوز 150 حرف")
    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @NotBlank(message = "كلمة المرور إجبارية")
    @Size(max = 255)
    @Column(name = "mot_de_passe", nullable = false)
    private String motDePasse;

    @Size(max = 50)
    @Column(name = "role", length = 50)
    private String role; // e.g. "administrateur", "inspecteur", "enseignant"

    @Column(name = "actif", nullable = false)
    private Boolean actif = true;

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @PrePersist
    protected void onCreate() {
        if (this.dateCreation == null) {
            this.dateCreation = LocalDateTime.now();
        }
        if (this.actif == null) {
            this.actif = true;
        }
    }

    public Utilisateur() {}

    public Utilisateur(String nom, String prenom, String email, String motDePasse, String role) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.role = role;
        this.actif = true;
        this.dateCreation = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getActif() {
        return actif;
    }

    public void setActif(Boolean actif) {
        this.actif = actif;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }
}
