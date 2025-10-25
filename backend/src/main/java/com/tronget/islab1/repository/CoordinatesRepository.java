package com.tronget.islab1.repository;

import com.tronget.islab1.models.Coordinates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoordinatesRepository extends CrudRepository<Coordinates, Long> {
}
