package com.tronget.islab1.service;

import com.tronget.islab1.models.Discipline;
import com.tronget.islab1.repository.DisciplineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DisciplineServiceImpl implements DisciplineService {

    private final DisciplineRepository repository;

    @Autowired
    public DisciplineServiceImpl(DisciplineRepository disciplineRepository) {
        this.repository = disciplineRepository;
    }

    @Override
    public List<Discipline> findAll() {
        return repository.findAll();
    }
}
