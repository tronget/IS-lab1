package com.tronget.islab1.service;

import com.tronget.islab1.dto.LabWorkRequestDto;
import com.tronget.islab1.exceptions.DisciplineNotFoundException;
import com.tronget.islab1.exceptions.LabworkNotFoundException;
import com.tronget.islab1.exceptions.ManualIdAssignmentException;
import com.tronget.islab1.exceptions.NotFoundException;
import com.tronget.islab1.mappers.*;
import com.tronget.islab1.models.Discipline;
import com.tronget.islab1.models.LabWork;
import com.tronget.islab1.repository.DisciplineRepository;
import com.tronget.islab1.repository.LabWorkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class LabWorkServiceImpl implements LabWorkService {

    private final LabWorkRepository labWorkRepository;
    private final DisciplineRepository disciplineRepository;
    private final LabWorkMapper mapper;

    @Autowired
    public LabWorkServiceImpl(
            LabWorkRepository labWorkRepository,
            DisciplineRepository disciplineRepository,
            LabWorkMapper mapper
    ) {
        this.labWorkRepository = labWorkRepository;
        this.disciplineRepository = disciplineRepository;
        this.mapper = mapper;
    }

    @Override
    public List<LabWork> findAll() {
        return labWorkRepository.findAll();
    }

    @Override
    public Page<LabWork> findAll(Pageable pageable) {
        return labWorkRepository.findAll(pageable);
    }

    @Override
    public LabWork findById(Long id) {
        return labWorkRepository
                .findById(id)
                .orElseThrow(() -> new LabworkNotFoundException(id));
    }

    @Override
    public LabWork save(LabWork labWork) {
        Long id = labWork.getId();
        // if we save object with non-existing id -> throw exception
        if (id != null && !labWorkRepository.existsById(id)) {
            throw new ManualIdAssignmentException();
        }
        return labWorkRepository.save(labWork);
    }

    @Override
    @Transactional
    public LabWork update(Long id, LabWorkRequestDto requestDto) {
        if (id == null) {
            return null;
        }

        LabWork existing = labWorkRepository
                .findById(id)
                .orElseThrow(() -> new LabworkNotFoundException(id));

        mapper.setEntityValues(existing, requestDto);

        return labWorkRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("id must not be null");
        }

        labWorkRepository.deleteById(id);
    }

    @Override
    public double sumMaximumPoint() {
        List<LabWork> labworks = labWorkRepository.findAll();

        double result = labworks
                .stream()
                .mapToDouble(LabWork::getMaximumPoint)
                .reduce((a, b) -> a + b)
                .orElse(0);

        return result;
    }

    @Override
    public int countByTunedInWorks(int tunedInWorks) {
        List<LabWork> labworks = labWorkRepository.findAll();
        int cnt = 0;
        for (LabWork labWork : labworks) {
            if (labWork.getTunedInWorks() == tunedInWorks) {
                cnt++;
            }
        }
        return cnt;
    }

    @Override
    public void addToDiscipline(Long labId, Long disciplineId) {
        LabWork labWork = labWorkRepository
                .findById(labId)
                .orElseThrow(() -> new LabworkNotFoundException(labId));

        Discipline discipline = disciplineRepository
                .findById(disciplineId)
                .orElseThrow(() -> new DisciplineNotFoundException(disciplineId));

        labWork.setDiscipline(discipline);
        labWorkRepository.save(labWork);
    }

    @Override
    public void removeFromDiscipline(Long labId, Long disciplineId) {
        LabWork labWork = labWorkRepository
                .findById(labId)
                .orElseThrow(() -> new LabworkNotFoundException(labId));

        Discipline discipline = disciplineRepository
                .findById(disciplineId)
                .orElseThrow(() -> new DisciplineNotFoundException(disciplineId));

        if (Objects.equals(labWork.getDiscipline().getId(), discipline.getId())) {
            labWorkRepository.delete(labWork);
        } else {
            throw new IllegalArgumentException("LabWork with id " + labId + " not found in discipline with id " + disciplineId);
        }
    }
}
