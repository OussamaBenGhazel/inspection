package com.inspection.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "diagnostics_finals")
public class DiagnosticFinal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_diagnostic")
    private Long idDiagnostic;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_inspection", nullable = false)
    private Inspection inspection;

    @Column(name = "points_forts", columnDefinition = "TEXT")
    private String pointsForts;

    @Column(name = "points_faibles", columnDefinition = "TEXT")
    private String pointsFaibles;

    @Column(name = "priorites", columnDefinition = "TEXT")
    private String priorites;

    @Size(max = 100)
    @Column(name = "type_accompagnement", length = 100)
    private String typeAccompagnement; // "تكوين", "مرافقة ميدانية", "تبادل خبرات", "بحث إجرائي"

    public DiagnosticFinal() {}

    public DiagnosticFinal(Inspection inspection, String pointsForts, String pointsFaibles, String priorites, String typeAccompagnement) {
        this.inspection = inspection;
        this.pointsForts = pointsForts;
        this.pointsFaibles = pointsFaibles;
        this.priorites = priorites;
        this.typeAccompagnement = typeAccompagnement;
    }

    public Long getIdDiagnostic() {
        return idDiagnostic;
    }

    public void setIdDiagnostic(Long idDiagnostic) {
        this.idDiagnostic = idDiagnostic;
    }

    public Inspection getInspection() {
        return inspection;
    }

    public void setInspection(Inspection inspection) {
        this.inspection = inspection;
    }

    public String getPointsForts() {
        return pointsForts;
    }

    public void setPointsForts(String pointsForts) {
        this.pointsForts = pointsForts;
    }

    public String getPointsFaibles() {
        return pointsFaibles;
    }

    public void setPointsFaibles(String pointsFaibles) {
        this.pointsFaibles = pointsFaibles;
    }

    public String getPriorites() {
        return priorites;
    }

    public void setPriorites(String priorites) {
        this.priorites = priorites;
    }

    public String getTypeAccompagnement() {
        return typeAccompagnement;
    }

    public void setTypeAccompagnement(String typeAccompagnement) {
        this.typeAccompagnement = typeAccompagnement;
    }
}
