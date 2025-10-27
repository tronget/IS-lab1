package com.tronget.islab1.controller;

import com.tronget.islab1.dto.DisciplineDto;
import com.tronget.islab1.mappers.DisciplineMapper;
import com.tronget.islab1.models.Discipline;
import com.tronget.islab1.service.DisciplineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/disciplines")
public class DisciplineController {

    private final DisciplineService service;
    private final DisciplineMapper mapper;

    @Autowired
    public DisciplineController(DisciplineService disciplineService, DisciplineMapper disciplineMapper) {
        this.service = disciplineService;
        this.mapper = disciplineMapper;
    }

    @GetMapping
    public ResponseEntity<List<DisciplineDto>> getAllDisciplines() {
        List<Discipline> disciplines = service.findAll();
        List<DisciplineDto> disciplineDtos = disciplines.stream().map(mapper::toDto).toList();
        return ResponseEntity.ok(disciplineDtos);
    }

}
