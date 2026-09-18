package com.inspection.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "inspecteurs")
@PrimaryKeyJoinColumn(name = "id_inspecteur")
public class Inspecteur extends Utilisateur {

    @Pattern(regexp = "^[A-Z0-9_-]{3,30}$", message = "رقم المعرف الإداري يجب أن يتكون من 3 إلى 30 رقماً أو حرفاً")
    @Column(name = "matricule", unique = true, length = 50)
    private String matricule;

    @Size(max = 100)
    @Column(name = "specialite", length = 100)
    private String specialite; // e.g. "التربية المدنية"

    @ManyToOne
    @JoinColumn(name = "id_region")
    private Region region;

    @Pattern(regexp = "^(\\+216)?[0-9]{8}$", message = "رقم الهاتف يجب أن يتكون من 8 أرقام صحيحة")
    @Column(name = "telephone", length = 20)
    private String telephone;

    // Optional legacy column for username compatibility
    @Column(name = "username", unique = true, length = 100)
    private String username;

    public Inspecteur() {
        super();
        setRole("inspecteur");
    }

    public Inspecteur(String nom, String prenom, String email, String motDePasse, String matricule, String specialite, Region region, String telephone) {
        super(nom, prenom, email, motDePasse, "inspecteur");
        this.matricule = matricule;
        this.specialite = specialite;
        this.region = region;
        this.telephone = telephone;
        this.username = email;
    }

    // Backward-compatibility constructor
    public Inspecteur(String nom, String prenom, String username, String password, String role) {
        super(nom, prenom, username.contains("@") ? username : username + "@inspection.tn", password, role);
        this.username = username;
        this.matricule = "INS-" + (username.toUpperCase());
        this.specialite = "التربية المدنية";
    }

    public Long getIdInspecteur() {
        return getId();
    }

    public void setIdInspecteur(Long idInspecteur) {
        setId(idInspecteur);
    }

    public String getMatricule() {
        return matricule;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public String getSpecialite() {
        return specialite;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public Region getRegion() {
        return region;
    }

    public void setRegion(Region region) {
        this.region = region;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    // Compatibility getters and setters
    public String getUsername() {
        return username != null ? username : getEmail();
    }

    public void setUsername(String username) {
        this.username = username;
        if (getEmail() == null || getEmail().isEmpty()) {
            setEmail(username.contains("@") ? username : username + "@inspection.tn");
        }
    }

    public String getPassword() {
        return getMotDePasse();
    }

    public void setPassword(String password) {
        setMotDePasse(password);
    }
}
