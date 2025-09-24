package com.tronget.islab1.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Double x; //Поле не может быть null

    @NotNull
    private Long y; //Поле не может быть null

    @NotNull
    private String name; //Поле не может быть null

    @OneToMany(mappedBy = "location")
    private List<Person> persons;
}
