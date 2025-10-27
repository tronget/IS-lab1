package com.tronget.islab1.repository;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Getter
public class RepositoryFactory {
    private final LocationRepository locationRepository;
    private final PersonRepository personRepository;
    private final LabWorkRepository labWorkRepository;
    private final DisciplineRepository disciplineRepository;
    private final CoordinatesRepository coordinatesRepository;

    @Autowired
    public RepositoryFactory(LocationRepository locationRepository, PersonRepository personRepository, LabWorkRepository labWorkRepository, DisciplineRepository disciplineRepository, CoordinatesRepository coordinatesRepository) {
        this.locationRepository = locationRepository;
        this.personRepository = personRepository;
        this.labWorkRepository = labWorkRepository;
        this.disciplineRepository = disciplineRepository;
        this.coordinatesRepository = coordinatesRepository;
    }
}
