package com.inspection.repository;

import com.inspection.model.DiagnosticFinal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DiagnosticFinalRepository extends JpaRepository<DiagnosticFinal, Long> {
    Optional<DiagnosticFinal> findByInspectionIdInspection(Long idInspection);
}
