package com.tronget.islab1.service;

import com.tronget.islab1.exceptions.UniqueConstraintViolationException;
import com.tronget.islab1.models.*;
import com.tronget.islab1.repository.*;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Objects;

@Component
public class DomainConstraintValidator {

    private final LabWorkRepository labWorkRepository;
    private final PersonRepository personRepository;
    private final CoordinatesRepository coordinatesRepository;
    private final DisciplineRepository disciplineRepository;
    private final LocationRepository locationRepository;

    public DomainConstraintValidator(LabWorkRepository labWorkRepository,
                                     PersonRepository personRepository,
                                     CoordinatesRepository coordinatesRepository,
                                     DisciplineRepository disciplineRepository,
                                     LocationRepository locationRepository) {
        this.labWorkRepository = labWorkRepository;
        this.personRepository = personRepository;
        this.coordinatesRepository = coordinatesRepository;
        this.disciplineRepository = disciplineRepository;
        this.locationRepository = locationRepository;
    }

    public void validateLabWork(LabWork labWork) {
        if (labWork == null) {
            return;
        }
        validatePerson(labWork.getAuthor());
        validateLocation(
                labWork.getAuthor() != null ? labWork.getAuthor().getLocation() : null);
        validateCoordinates(labWork.getCoordinates());
        validateDiscipline(labWork.getDiscipline());
        ensureLabWorkUniqueness(labWork);
    }

    private void validatePerson(Person author) {
        if (author == null) {
            throw new UniqueConstraintViolationException("author.missing", "Author is required");
        }
        if (author.getWeight() <= 0 || author.getWeight() > 250) {
            throw new UniqueConstraintViolationException(
                    "author.weight", "Author weight must be between (0;250]");
        }
        if (!StringUtils.hasText(author.getName())) {
            throw new UniqueConstraintViolationException("author.name", "Author name is required");
        }
        String trimmedAuthorName = author.getName().trim();
        String locationName = "";
        Location location = author.getLocation();
        if (location != null && StringUtils.hasText(location.getName())) {
            locationName = location.getName().trim();
        }

        if (author.getId() == null &&
                personRepository
                        .existsByNameIgnoreCaseAndNationalityAndLocation_NameIgnoreCase(
                                trimmedAuthorName, author.getNationality(), locationName)) {
            throw new UniqueConstraintViolationException(
                    "author.unique",
                    "Author with same name, nationality and location already exists");
        }
    }

    private void validateLocation(Location location) {
        if (location == null) {
            throw new UniqueConstraintViolationException("location.missing",
                    "Location is required");
        }
        Double x = location.getX();
        Long y = location.getY();
        if (x == null || y == null) {
            throw new UniqueConstraintViolationException("location.coordinates", "Location coordinates are required");
        }
        double roundedX = round(x, 2);
        if (Math.abs(roundedX) > 10_000 || location.getY() > 5_000 ||
                location.getY() < -5_000) {
            throw new UniqueConstraintViolationException("location.bounds", "Location is out of bounds");
        }
        if (!StringUtils.hasText(location.getName())) {
            throw new UniqueConstraintViolationException("location.name", "Location name is required");
        }
        if (location.getId() == null &&
                locationRepository.existsByNameIgnoreCaseAndXAndY(location.getName().trim(), x, y)) {
            throw new UniqueConstraintViolationException(
                    "location.unique", "Location with same name and coordinates already exists");
        }
    }

    private void validateCoordinates(Coordinates coordinates) {
        if (coordinates == null) {
            throw new UniqueConstraintViolationException(
                    "coordinates.missing", "Coordinates are required");
        }
        if (coordinates.getY() == null) {
            throw new UniqueConstraintViolationException("coordinates.y", "Coordinate Y is required");
        }
        if (Math.abs(coordinates.getX()) > 10_000 || coordinates.getY() > 5_000 ||
                coordinates.getY() < -5_000) {
            throw new UniqueConstraintViolationException(
                    "coordinates.bounds", "Coordinates are out of bounds");
        }
        if (coordinates.getId() == null &&
                coordinatesRepository.existsByXAndY(coordinates.getX(),
                        coordinates.getY())) {
            throw new UniqueConstraintViolationException(
                    "coordinates.unique", "Coordinates pair is already used");
        }
    }

    private void validateDiscipline(Discipline discipline) {
        if (discipline == null) {
            return;
        }
        if (discipline.getPracticeHours() + discipline.getSelfStudyHours() <
                discipline.getLabsCount()) {
            throw new UniqueConstraintViolationException(
                    "discipline.hours",
                    "Discipline hours cannot be less than labs count");
        }
        if (discipline.getId() == null &&
                disciplineRepository.existsByNameIgnoreCase(discipline.getName())) {
            throw new UniqueConstraintViolationException(
                    "discipline.name", "Discipline name must be unique");
        }
    }

    private void ensureLabWorkUniqueness(LabWork labWork) {
        Person author = labWork.getAuthor();
        Coordinates coords = labWork.getCoordinates();
        Discipline discipline = labWork.getDiscipline();
        Long excludeId = labWork.getId();

        if (author != null && author.getId() != null) {
            String normalizedName = normalize(labWork.getName());
            boolean exists = labWorkRepository.existsByAuthorAndNormalizedName(
                    author.getId(),
                    normalizedName,
                    excludeId);
            if (exists) {
                throw new UniqueConstraintViolationException(
                        "labwork.name", "LabWork name must be unique per author");
            }
        }

        if (coords != null) {
            boolean exists = labWorkRepository.existsByCoordinatesExact(
                    coords.getX(), coords.getY(), excludeId);
            if (exists) {
                throw new UniqueConstraintViolationException(
                        "labwork.coordinates", "LabWork coordinates must be unique");
            }
        }

        if (discipline != null && discipline.getId() != null) {
            String descriptionHash = hashDescription(labWork.getDescription());
            boolean duplicate = labWorkRepository.findByDiscipline_Id(discipline.getId())
                    .stream()
                    .filter(existing -> !Objects.equals(existing.getId(), excludeId))
                    .anyMatch(existing -> Objects.equals(existing.getDifficulty(),
                            labWork.getDifficulty()) &&
                            Double.compare(existing.getMaximumPoint(),
                                    labWork.getMaximumPoint()) == 0 &&
                            hashDescription(existing.getDescription())
                                    .equals(descriptionHash));
            if (duplicate) {
                throw new UniqueConstraintViolationException(
                        "labwork.spec", "Duplicate lab specification for discipline");
            }
        }
    }

    private String normalize(String value) {
        if (!StringUtils.hasText(value)) {
            return "";
        }
        return value.trim().toLowerCase();
    }

    private double round(Double value, int scale) {
        if (value == null) {
            return 0;
        }
        return BigDecimal.valueOf(value)
                .setScale(scale, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private String hashDescription(String description) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(Objects.toString(description, "").getBytes());
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
