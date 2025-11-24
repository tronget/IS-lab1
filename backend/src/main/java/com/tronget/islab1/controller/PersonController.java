package com.tronget.islab1.controller;

import com.tronget.islab1.dto.PersonDto;
import com.tronget.islab1.mappers.PersonMapper;
import com.tronget.islab1.models.Person;
import com.tronget.islab1.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/persons")
public class PersonController {
    private final PersonService service;
    private final PersonMapper mapper;

    @Autowired
    public PersonController(PersonService personService, PersonMapper personMapper) {
        this.service = personService;
        this.mapper = personMapper;
    }

    @GetMapping
    public ResponseEntity<List<PersonDto>> getAllPersons() {
        List<Person> authors = service.findAll();
        List<PersonDto> personDtos = authors.stream().map(mapper::toDto).toList();
        return ResponseEntity.ok(personDtos);
    }
}
