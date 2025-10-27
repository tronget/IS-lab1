package com.tronget.islab1.controller;

import com.tronget.islab1.dto.LocationDto;
import com.tronget.islab1.mappers.LocationMapper;
import com.tronget.islab1.models.Location;
import com.tronget.islab1.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService service;
    private final LocationMapper mapper;

    @Autowired
    public LocationController(LocationService locationService, LocationMapper locationMapper) {
        this.service = locationService;
        this.mapper = locationMapper;
    }

    @GetMapping
    public ResponseEntity<List<LocationDto>> getAllLocations() {
        List<Location> locations = service.findAll();
        List<LocationDto> locationDtos = locations.stream().map(mapper::toDto).toList();
        return ResponseEntity.ok(locationDtos);
    }
}

