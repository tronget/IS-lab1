package com.tronget.islab1.mappers;

import com.tronget.islab1.dto.CoordinatesDto;
import com.tronget.islab1.models.Coordinates;
import org.springframework.stereotype.Component;

@Component
public class CoordinatesMapper implements Mapper<Coordinates, CoordinatesDto> {
    @Override
    public Coordinates toEntity(CoordinatesDto dto) {
        Coordinates entity = new Coordinates();
        entity.setId(dto.getId());
        entity.setX(dto.getX());
        entity.setY(dto.getY());
        return entity;
    }

    @Override
    public CoordinatesDto toDto(Coordinates entity) {
        CoordinatesDto dto = new CoordinatesDto();
        dto.setId(entity.getId());
        dto.setX(entity.getX());
        dto.setY(entity.getY());
        return dto;
    }
}
