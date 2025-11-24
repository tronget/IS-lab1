package com.tronget.islab1.repository;

import com.tronget.islab1.models.LabWork;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabWorkRepository extends JpaRepository<LabWork, Long> {
    @EntityGraph(attributePaths = {"author", "coordinates", "discipline", "author.location"})
    @NonNull
    List<LabWork> findAll();

    @EntityGraph(attributePaths = {"author", "coordinates", "discipline", "author.location"})
    @NonNull
    Page<LabWork> findAll(@NonNull Pageable pageable);

    int countByTunedInWorks(int tunedInWorks);

    @Query("select (count(l) > 0) from LabWork l where " +
            "l.author.id = :authorId and " +
            "lower(trim(BOTH FROM l.name)) = :normalizedName and " +
            "(:excludeId is null or l.id <> :excludeId)")
    boolean existsByAuthorAndNormalizedName(Long authorId, String normalizedName, Long excludeId);

    @Query("select (count(l) > 0) from LabWork l where " +
            "l.coordinates.x = :x and " +
            "l.coordinates.y = :y and " +
            "(:excludeId is null or l.id <> :excludeId)")
    boolean existsByCoordinatesExact(long x, Float y, Long excludeId);

    List<LabWork> findByDiscipline_Id(Long disciplineId);
}
