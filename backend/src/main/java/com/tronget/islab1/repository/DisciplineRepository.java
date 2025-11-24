package com.tronget.islab1.repository;

import com.tronget.islab1.models.Discipline;
import org.springframework.data.repository.CrudRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisciplineRepository extends CrudRepository<Discipline, Long> {
    @NonNull
    List<Discipline> findAll();

    boolean existsByNameIgnoreCase(String name);
}
