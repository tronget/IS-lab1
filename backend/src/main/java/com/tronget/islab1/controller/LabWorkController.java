package com.tronget.islab1.controller;

import com.tronget.islab1.dto.GroupByDescriptionDto;
import com.tronget.islab1.dto.LabWorkRequestDto;
import com.tronget.islab1.dto.LabWorkResponseDto;
import com.tronget.islab1.mappers.LabWorkMapper;
import com.tronget.islab1.models.LabWork;
import com.tronget.islab1.service.LabWorkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<Page<LabWorkResponseDto>> getAllLabWorks(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "size", defaultValue = "5") Integer size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<LabWork> labWorks = service.findAll(pageable);
        Page<LabWorkResponseDto> responseDtos = labWorks.map(mapper::toResponse);
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabWorkResponseDto> getLabWork(@PathVariable Long id) {
        LabWork labWork = service.findById(id);
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
        service.delete(id);

        messagingTemplate.convertAndSend("/topic/labworks", "deleted:" + id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sum-maximum-point")
    public ResponseEntity<Double> sumMaximumPoint() {
        Double sum = service.sumMaximumPoint();
        return ResponseEntity.ok(sum);
    }

    @GetMapping("/group-by-description")
    public ResponseEntity<List<GroupByDescriptionDto>> groupByDescription() {
        return new ResponseEntity<>(service.groupByDescription(), HttpStatus.OK);
    }

    @GetMapping("/count-by-tunedInWorks")
    public ResponseEntity<Integer> countByTunedInWorks(@RequestParam Integer tunedInWorks) {
        int result = service.countByTunedInWorks(tunedInWorks);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{labId}/add-to-discipline/{disciplineId}")
    public ResponseEntity<Void> addToDiscipline(@PathVariable Long labId, @PathVariable Long disciplineId) {
        service.addToDiscipline(labId, disciplineId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{labId}/remove-from-discipline/{disciplineId}")
    public ResponseEntity<Void> removeFromDiscipline(@PathVariable Long labId, @PathVariable Long disciplineId) {
        service.removeFromDiscipline(labId, disciplineId);
        return ResponseEntity.ok().build();
    }
}
