package com.tronget.islab1.repository;

import com.tronget.islab1.models.Coordinates;
import org.springframework.data.repository.CrudRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoordinatesRepository extends CrudRepository<Coordinates, Long> {
    @NonNull
    List<Coordinates> findAll();
}
