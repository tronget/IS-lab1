package com.tronget.islab1.repository;

import com.tronget.islab1.models.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    boolean existsByNameIgnoreCaseAndXAndY(String name, Double x, Long y);
}
