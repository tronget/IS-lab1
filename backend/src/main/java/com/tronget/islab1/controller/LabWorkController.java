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

    private final LabWorkService labWorkService;
    private final LabWorkMapper labWorkMapper;

    @Autowired
    public LabWorkController(LabWorkService labWorkService, LabWorkMapper labWorkMapper) {
        this.labWorkService = labWorkService;
        this.labWorkMapper = labWorkMapper;
    }

    @GetMapping
    public ResponseEntity<List<LabWorkResponseDto>> getAllLabWorks() {
        List<LabWork> labWorks = labWorkService.findAll();
        List<LabWorkResponseDto> responseDtos = labWorks.stream().map(labWorkMapper::toResponse).toList();
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabWorkResponseDto> getLabWork(@PathVariable Long id) {
        LabWork labWork = labWorkService.findById(id);

        if (labWork == null) {
            return ResponseEntity.notFound().build();
        }

        LabWorkResponseDto responseDto = labWorkMapper.toResponse(labWork);
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping
    public ResponseEntity<LabWork> create(@RequestBody LabWorkRequestDto requestDto) {
        LabWork entity = labWorkMapper.toEntity(requestDto);
        LabWork saved = labWorkService.save(entity);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabWorkResponseDto> update(@PathVariable Long id, @RequestBody LabWorkRequestDto requestDto) {
        LabWork entity = labWorkMapper.toEntity(requestDto);
        entity.setId(id);
        LabWork updated = labWorkService.update(entity);

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        LabWorkResponseDto responseDto = labWorkMapper.toResponse(updated);
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = labWorkService.delete(id);
        return deleted == true ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
