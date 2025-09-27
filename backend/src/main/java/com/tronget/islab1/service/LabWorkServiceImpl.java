package com.tronget.islab1.service;

import com.tronget.islab1.models.LabWork;
import com.tronget.islab1.repository.LabWorkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LabWorkServiceImpl implements LabWorkService {

    private final LabWorkRepository labWorkRepository;

    @Autowired
    public LabWorkServiceImpl(LabWorkRepository labWorkRepository) {
        this.labWorkRepository = labWorkRepository;
    }

    @Override
    public List<LabWork> findAll() {
        return labWorkRepository.findAll();
    }

    @Override
    public LabWork findById(Long id) {
        return labWorkRepository.findById(id).orElse(null);
    }

    @Override
    public LabWork save(LabWork labWork) {
        Long id = labWork.getId();
        // if we save object with non-existing id -> throw exception
        if (id != null && !labWorkRepository.existsById(id)) {
            throw new IllegalArgumentException("LabWork with id " + id + " not found.");
        }
        return labWorkRepository.save(labWork);
    }

    @Override
    @Transactional
    public LabWork update(LabWork labWork) {
        Long id = labWork.getId();
        if (id == null) {
            return null;
        }
        if (!labWorkRepository.existsById(id)) {
            return null;
        } else {
            return labWorkRepository.save(labWork);
        }
    }

    @Override
    public boolean delete(Long id) {
        try {
            labWorkRepository.deleteById(id);
        } catch (IllegalArgumentException e) {
            return false;
        }

        return true;
    }
}
