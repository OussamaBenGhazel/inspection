package com.inspection.repository;

import com.inspection.model.IndicateurCroissance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IndicateurCroissanceRepository extends JpaRepository<IndicateurCroissance, Long> {
    List<IndicateurCroissance> findByEnseignantId(Long idEnseignant);
}
