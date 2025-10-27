package com.tronget.islab1.mappers;

import com.tronget.islab1.dto.LocationDto;
import com.tronget.islab1.models.Location;
import org.springframework.stereotype.Component;

@Component
public class LocationMapper implements Mapper<Location, LocationDto> {
    @Override
    public Location toEntity(LocationDto dto) {
        Location location = new Location();
        location.setId(dto.getId());
        location.setX(dto.getX());
        location.setY(dto.getY());
        location.setName(dto.getName());
        return location;
    }

    @Override
    public LocationDto toDto(Location entity) {
        LocationDto dto = new LocationDto();
        dto.setId(entity.getId());
        dto.setX(entity.getX());
        dto.setY(entity.getY());
        dto.setName(entity.getName());
        return dto;
    }
}
