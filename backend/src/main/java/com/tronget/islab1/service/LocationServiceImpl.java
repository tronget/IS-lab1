package com.tronget.islab1.service;

import com.tronget.islab1.models.Location;
import com.tronget.islab1.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationServiceImpl implements LocationService {

    private final LocationRepository repository;

    @Autowired
    public LocationServiceImpl(LocationRepository locationRepository) {
        this.repository = locationRepository;
    }

    @Override
    public List<Location> findAll() {
        return repository.findAll();
    }
}

