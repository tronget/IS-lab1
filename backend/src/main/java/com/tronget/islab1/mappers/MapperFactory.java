package com.tronget.islab1.mappers;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Getter
public class MapperFactory {

    private final PersonMapper personMapper;
    private final DisciplineMapper disciplineMapper;
    private final CoordinatesMapper coordinatesMapper;
    private final LocationMapper locationMapper;

    @Autowired
    public MapperFactory(PersonMapper personMapper, DisciplineMapper disciplineMapper, CoordinatesMapper coordinatesMapper, LocationMapper locationMapper) {
        this.personMapper = personMapper;
        this.disciplineMapper = disciplineMapper;
        this.coordinatesMapper = coordinatesMapper;
        this.locationMapper = locationMapper;
    }

}
