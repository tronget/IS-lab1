package com.tronget.islab1.repository;

import com.tronget.islab1.models.LabWork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LabWorkRepository extends JpaRepository<LabWork, Long> {
}
