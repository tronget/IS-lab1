package com.tronget.islab1.controller;

import com.tronget.islab1.dto.LabWorkRequestDto;
import com.tronget.islab1.dto.LabWorkResponseDto;
import com.tronget.islab1.mappers.LabWorkMapper;
import com.tronget.islab1.models.LabWork;
import com.tronget.islab1.service.LabWorkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labworks")
public class LabWorkController {

    private final LabWorkService service;
    private final LabWorkMapper mapper;

    @Autowired
    public LabWorkController(LabWorkService service, LabWorkMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public ResponseEntity<List<LabWorkResponseDto>> getAllLabWorks() {
        List<LabWork> labWorks = service.findAll();
        List<LabWorkResponseDto> responseDtos = labWorks.stream().map(mapper::toResponse).toList();
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabWorkResponseDto> getLabWork(@PathVariable Long id) {
        LabWork labWork = service.findById(id);

        if (labWork == null) {
            return ResponseEntity.notFound().build();
        }

        LabWorkResponseDto responseDto = mapper.toResponse(labWork);
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping
    public ResponseEntity<LabWorkResponseDto> create(@RequestBody LabWorkRequestDto requestDto) {
        LabWork entity = mapper.toEntity(requestDto);
        LabWork saved = service.save(entity);
        LabWorkResponseDto responseDto = mapper.toResponse(saved);
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabWorkResponseDto> update(@PathVariable Long id, @RequestBody LabWorkRequestDto requestDto) {
        LabWork entity = mapper.toEntity(requestDto);
        entity.setId(id);
        LabWork updated = service.update(entity);

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        LabWorkResponseDto responseDto = mapper.toResponse(updated);
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = service.delete(id);
        return deleted == true ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
