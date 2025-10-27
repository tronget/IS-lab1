package com.tronget.islab1.mappers;

import com.tronget.islab1.dto.*;
import com.tronget.islab1.models.*;
import com.tronget.islab1.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

@Component
public class LabWorkMapper {
    private final RepositoryFactory repositoryFactory;
    private final MapperFactory mapperFactory;

    @Autowired
    public LabWorkMapper(RepositoryFactory repositoryFactory, MapperFactory mapperFactory) {
        this.repositoryFactory = repositoryFactory;
        this.mapperFactory = mapperFactory;
    }

    public void setEntityValues(LabWork labWork, LabWorkRequestDto request) {
        labWork.setName(request.getName());
        labWork.setDescription(request.getDescription());
        labWork.setDifficulty(request.getDifficulty());
        labWork.setMinimalPoint(request.getMinimalPoint());
        labWork.setMaximumPoint(request.getMaximumPoint());
        labWork.setTunedInWorks(request.getTunedInWorks());

        labWork.setAuthor(resolvePerson(request.getAuthor()));
        labWork.setDiscipline(resolveDiscipline(request.getDiscipline()));
        labWork.setCoordinates(resolveCoordinates(request.getCoordinates()));
    }

    private Person resolvePerson(@NonNull PersonDto dto) {
        if (dto.getId() != null) {
            PersonRepository repository = repositoryFactory.getPersonRepository();
            return repository.findById(dto.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Person with id " + dto.getId() + " not found"));
        }

        PersonMapper mapper = mapperFactory.getPersonMapper();
        return mapper.toEntity(dto);
    }

    private Discipline resolveDiscipline(@NonNull DisciplineDto dto) {
        if (dto.getId() != null) {
            DisciplineRepository repository = repositoryFactory.getDisciplineRepository();
            return repository.findById(dto.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Discipline with id " + dto.getId() + " not found"));
        }

        DisciplineMapper mapper = mapperFactory.getDisciplineMapper();
        return mapper.toEntity(dto);
    }

    private Coordinates resolveCoordinates(@NonNull CoordinatesDto dto) {
        if (dto.getId() != null) {
            CoordinatesRepository repository = repositoryFactory.getCoordinatesRepository();
            return repository.findById(dto.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Coordinates with id " + dto.getId() + " not found"));
        }

        CoordinatesMapper mapper = mapperFactory.getCoordinatesMapper();
        return mapper.toEntity(dto);
    }

    public LabWorkResponseDto toResponse(@NonNull LabWork labWork) {
        LabWorkResponseDto response = new LabWorkResponseDto();
        response.setId(labWork.getId());
        response.setName(labWork.getName());
        response.setDescription(labWork.getDescription());
        response.setDifficulty(labWork.getDifficulty());
        response.setMinimalPoint(labWork.getMinimalPoint());
        response.setMaximumPoint(labWork.getMaximumPoint());
        response.setTunedInWorks(labWork.getTunedInWorks());
        response.setCreationDate(labWork.getCreationDate());

        PersonDto author = mapperFactory.getPersonMapper().toDto(labWork.getAuthor());
        DisciplineDto discipline = mapperFactory.getDisciplineMapper().toDto(labWork.getDiscipline());
        CoordinatesDto coordinates = mapperFactory.getCoordinatesMapper().toDto(labWork.getCoordinates());

        response.setAuthor(author);
        response.setDiscipline(discipline);
        response.setCoordinates(coordinates);

        return response;
    }
}
