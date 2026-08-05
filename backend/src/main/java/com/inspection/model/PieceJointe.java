package com.inspection.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "pieces_jointes")
public class PieceJointe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_piece")
    private Long idPiece;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_inspection", nullable = false)
    private Inspection inspection;

    @NotBlank
    @Size(max = 255)
    @Column(name = "nom_fichier", nullable = false)
    private String nomFichier;

    @NotBlank
    @Size(max = 255)
    @Column(name = "chemin_fichier", nullable = false)
    private String cheminFichier;

    @NotBlank
    @Size(max = 50)
    @Column(name = "type_fichier", nullable = false, length = 50)
    private String typeFichier;

    public PieceJointe() {}

    public PieceJointe(Inspection inspection, String nomFichier, String cheminFichier, String typeFichier) {
        this.inspection = inspection;
        this.nomFichier = nomFichier;
        this.cheminFichier = cheminFichier;
        this.typeFichier = typeFichier;
    }

    public Long getIdPiece() {
        return idPiece;
    }

    public void setIdPiece(Long idPiece) {
        this.idPiece = idPiece;
    }

    public Inspection getInspection() {
        return inspection;
    }

    public void setInspection(Inspection inspection) {
        this.inspection = inspection;
    }

    public String getNomFichier() {
        return nomFichier;
    }

    public void setNomFichier(String nomFichier) {
        this.nomFichier = nomFichier;
    }

    public String getCheminFichier() {
        return cheminFichier;
    }

    public void setCheminFichier(String cheminFichier) {
        this.cheminFichier = cheminFichier;
    }

    public String getTypeFichier() {
        return typeFichier;
    }

    public void setTypeFichier(String typeFichier) {
        this.typeFichier = typeFichier;
    }
}
