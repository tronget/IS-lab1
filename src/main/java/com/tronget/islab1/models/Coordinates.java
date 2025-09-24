package com.tronget.islab1.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Coordinates {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private long x;

    @Column(nullable = false)
    @NotNull
    @Max(508)
    private Float y; //Максимальное значение поля: 508, Поле не может быть null

    @OneToMany(mappedBy = "coordinates")
    private List<Labwork> labworks;
}
