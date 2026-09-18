package com.inspection.repository;

import com.inspection.model.TypeVisite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeVisiteRepository extends JpaRepository<TypeVisite, Long> {
}
