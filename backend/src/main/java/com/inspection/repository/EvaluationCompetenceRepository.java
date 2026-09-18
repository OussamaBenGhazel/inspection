package com.inspection.repository;

import com.inspection.model.EvaluationCompetence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EvaluationCompetenceRepository extends JpaRepository<EvaluationCompetence, Long> {
    List<EvaluationCompetence> findByInspectionIdInspection(Long idInspection);
}
