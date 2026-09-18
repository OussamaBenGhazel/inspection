package com.inspection.repository;

import com.inspection.model.Recommandation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecommandationRepository extends JpaRepository<Recommandation, Long> {
    List<Recommandation> findByEnseignantId(Long idEnseignant);
    List<Recommandation> findByInspectionIdInspection(Long idInspection);
}
