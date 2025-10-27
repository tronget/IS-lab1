package com.tronget.islab1.repository;

import com.tronget.islab1.models.Location;
import org.springframework.data.repository.CrudRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends CrudRepository<Location, Long> {
    @NonNull
    List<Location> findAll();
}
