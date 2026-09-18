package com.inspection.repository;

import com.inspection.model.PlanDeveloppement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlanDeveloppementRepository extends JpaRepository<PlanDeveloppement, Long> {
    List<PlanDeveloppement> findByEnseignantId(Long idEnseignant);
}
