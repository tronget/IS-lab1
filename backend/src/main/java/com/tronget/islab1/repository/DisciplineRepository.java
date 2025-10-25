package com.tronget.islab1.repository;

import com.tronget.islab1.models.Discipline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DisciplineRepository extends CrudRepository<Discipline, Long> {
}
