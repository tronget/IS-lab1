package com.tronget.islab1.service;

import com.tronget.islab1.models.Person;
import com.tronget.islab1.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonServiceImpl implements PersonService {

    private final PersonRepository repository;

    @Autowired
    public PersonServiceImpl(PersonRepository personRepository) {
        this.repository = personRepository;
    }

    @Override
    public List<Person> findAll() {
        return repository.findAll();
    }
}
