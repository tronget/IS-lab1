package com.tronget.islab1.controller;

import com.tronget.islab1.dto.LabWorkRequestDto;
import com.tronget.islab1.dto.LabWorkResponseDto;
import com.tronget.islab1.mappers.LabWorkMapper;
import com.tronget.islab1.models.LabWork;
import com.tronget.islab1.service.LabWorkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labworks")
public class LabWorkController {

    private final LabWorkService service;
    private final LabWorkMapper mapper;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public LabWorkController(LabWorkService service, LabWorkMapper mapper, SimpMessagingTemplate messagingTemplate) {
        this.service = service;
        this.mapper = mapper;
        this.messagingTemplate = messagingTemplate;
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
        LabWork entity = new LabWork();
        mapper.setEntityValues(entity, requestDto);
        LabWork saved = service.save(entity);
        LabWorkResponseDto responseDto = mapper.toResponse(saved);

        messagingTemplate.convertAndSend("/topic/labworks", responseDto);

        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabWorkResponseDto> update(@PathVariable Long id, @RequestBody LabWorkRequestDto requestDto) {

        LabWork updated = service.update(id, requestDto);

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        LabWorkResponseDto responseDto = mapper.toResponse(updated);

        messagingTemplate.convertAndSend("/topic/labworks", responseDto);

        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = service.delete(id);

        if (deleted) {
            messagingTemplate.convertAndSend("/topic/labworks", "deleted:" + id);
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/sum-maximum-point")
    public ResponseEntity<Double> sumMaximumPoint() {
        Double sum = service.sumMaximumPoint();
        return ResponseEntity.ok(sum);
    }

    @GetMapping("/count-by-tunedInWorks")
    public ResponseEntity<Integer> countByTunedInWorks(@RequestParam Integer tunedInWorks) {
        int result = service.countByTunedInWorks(tunedInWorks);
        return ResponseEntity.ok(result);
    }
}
