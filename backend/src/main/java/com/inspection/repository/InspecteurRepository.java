package com.inspection.repository;

import com.inspection.model.Inspecteur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InspecteurRepository extends JpaRepository<Inspecteur, Long> {
    Optional<Inspecteur> findByUsername(String username);
}
