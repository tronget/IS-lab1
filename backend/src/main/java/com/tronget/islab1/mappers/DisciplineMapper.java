package com.tronget.islab1.mappers;

import com.tronget.islab1.dto.DisciplineDto;
import com.tronget.islab1.models.Discipline;
import org.springframework.stereotype.Component;

@Component
public class DisciplineMapper implements Mapper<Discipline, DisciplineDto> {

    @Override
    public Discipline toEntity(DisciplineDto dto) {
        Discipline entity = new Discipline();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setPracticeHours(dto.getPracticeHours());
        entity.setSelfStudyHours(dto.getSelfStudyHours());
        entity.setLabsCount(dto.getLabsCount());
        return entity;
    }

    @Override
    public DisciplineDto toDto(Discipline entity) {
        DisciplineDto dto = new DisciplineDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setPracticeHours(entity.getPracticeHours());
        dto.setSelfStudyHours(entity.getSelfStudyHours());
        dto.setLabsCount(entity.getLabsCount());
        return dto;
    }
}
