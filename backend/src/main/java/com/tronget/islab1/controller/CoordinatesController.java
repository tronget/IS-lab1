package com.tronget.islab1.controller;

import com.tronget.islab1.dto.CoordinatesDto;
import com.tronget.islab1.mappers.CoordinatesMapper;
import com.tronget.islab1.models.Coordinates;
import com.tronget.islab1.service.CoordinatesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/coordinates")
public class CoordinatesController {

    private final CoordinatesService service;
    private final CoordinatesMapper mapper;

    @Autowired
    public CoordinatesController(CoordinatesService coordinatesService, CoordinatesMapper coordinatesMapper) {
        this.service = coordinatesService;
        this.mapper = coordinatesMapper;
    }

    @GetMapping
    public ResponseEntity<List<CoordinatesDto>> getAllCoordinates() {
        List<Coordinates> coordinates = service.findAll();
        List<CoordinatesDto> coordinatesDtos = coordinates.stream().map(mapper::toDto).toList();
        return ResponseEntity.ok(coordinatesDtos);
    }
}

