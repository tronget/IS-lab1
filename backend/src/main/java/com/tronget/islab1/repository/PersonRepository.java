package com.tronget.islab1.repository;

import com.tronget.islab1.models.Country;
import com.tronget.islab1.models.Person;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

@Repository
public interface PersonRepository extends CrudRepository<Person, Long> {
    @EntityGraph(attributePaths = {"location"})
    @NonNull
    List<Person> findAll();

    boolean existsByNameIgnoreCaseAndNationalityAndLocation_NameIgnoreCase(
            String name, Country nationality, String locationName);
}
