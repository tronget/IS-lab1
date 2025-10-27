package com.tronget.islab1.service;

import com.tronget.islab1.models.Coordinates;
import com.tronget.islab1.repository.CoordinatesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoordinatesServiceImpl implements CoordinatesService {

    private final CoordinatesRepository repository;

    @Autowired
    public CoordinatesServiceImpl(CoordinatesRepository coordinatesRepository) {
        this.repository = coordinatesRepository;
    }

    @Override
    public List<Coordinates> findAll() {
        return repository.findAll();
    }
}

