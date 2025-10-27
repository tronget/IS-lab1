package com.tronget.islab1.mappers;

import com.tronget.islab1.dto.PersonDto;
import com.tronget.islab1.models.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PersonMapper implements Mapper<Person, PersonDto> {

    private final LocationMapper locationMapper;

    @Autowired
    public PersonMapper(LocationMapper locationMapper) {
        this.locationMapper = locationMapper;
    }


    @Override
    public Person toEntity(PersonDto dto) {
        Person entity = new Person();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setEyeColor(dto.getEyeColor());
        entity.setHairColor(dto.getHairColor());
        entity.setLocation(locationMapper.toEntity(dto.getLocation()));
        entity.setWeight(dto.getWeight());
        entity.setNationality(dto.getNationality());
        return entity;
    }

    @Override
    public PersonDto toDto(Person entity) {
        PersonDto dto = new PersonDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setEyeColor(entity.getEyeColor());
        dto.setHairColor(entity.getHairColor());
        dto.setLocation(locationMapper.toDto(entity.getLocation()));
        dto.setWeight(entity.getWeight());
        dto.setNationality(entity.getNationality());
        return dto;
    }
}
