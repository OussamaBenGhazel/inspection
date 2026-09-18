package com.inspection.repository;

import com.inspection.model.Inspection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InspectionRepository extends JpaRepository<Inspection, Long> {
    List<Inspection> findTop5ByOrderByDateCreationDesc();
    List<Inspection> findByEnseignantId(Long idEnseignant);
}
