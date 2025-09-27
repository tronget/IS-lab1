package com.tronget.islab1.models;

import com.tronget.islab1.dto.LocationDto;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotNull
    private Double x; //Поле не может быть null

    @Column(nullable = false)
    @NotNull
    private Long y; //Поле не может быть null

    @Column(nullable = false)
    @NotNull
    private String name; //Поле не может быть null

    @OneToMany(mappedBy = "location")
    private List<Person> persons;
}
