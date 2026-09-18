package com.inspection.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_role")
    private Long idRole;

    @NotBlank
    @Size(max = 50)
    @Column(name = "libelle", unique = true, nullable = false, length = 50)
    private String libelle;

    @Column(name = "permissions", columnDefinition = "TEXT")
    private String permissions;

    public Role() {}

    public Role(String libelle, String permissions) {
        this.libelle = libelle;
        this.permissions = permissions;
    }

    public Long getIdRole() {
        return idRole;
    }

    public void setIdRole(Long idRole) {
        this.idRole = idRole;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public String getPermissions() {
        return permissions;
    }

    public void setPermissions(String permissions) {
        this.permissions = permissions;
    }
}
