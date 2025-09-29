package com.tronget.islab1.service;

import com.tronget.islab1.dto.LabWorkRequestDto;
import com.tronget.islab1.mappers.*;
import com.tronget.islab1.models.LabWork;
import com.tronget.islab1.repository.LabWorkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LabWorkServiceImpl implements LabWorkService {

    private final LabWorkRepository repository;
    private final LabWorkMapper mapper;

    @Autowired
    public LabWorkServiceImpl(LabWorkRepository repository, LabWorkMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<LabWork> findAll() {
        return repository.findAll();
    }

    @Override
    public LabWork findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public LabWork save(LabWork labWork) {
        Long id = labWork.getId();
        // if we save object with non-existing id -> throw exception
        if (id != null && !repository.existsById(id)) {
            throw new IllegalArgumentException("LabWork with id " + id + " not found.");
        }
        return repository.save(labWork);
    }

    @Override
    @Transactional
    public LabWork update(Long id, LabWorkRequestDto requestDto) {
        if (id == null) {
            return null;
        }

        LabWork existing = repository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("LabWork with id " + id + " not found.")
        );

        mapper.setEntityValues(existing, requestDto);

        return repository.save(existing);
    }

    @Override
    public boolean delete(Long id) {
        try {
            repository.deleteById(id);
        } catch (IllegalArgumentException e) {
            return false;
        }

        return true;
    }

    @Override
    public double sumMaximumPoint() {
        List<LabWork> labworks = repository.findAll();

        double result = labworks
                .stream()
                .mapToDouble(LabWork::getMaximumPoint)
                .reduce((a, b) -> a + b)
                .orElse(0);

        return result;
    }
}
