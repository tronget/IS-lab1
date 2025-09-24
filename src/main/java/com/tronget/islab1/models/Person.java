package com.tronget.islab1.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name; //Поле не может быть null, Строка не может быть пустой

    @Enumerated(EnumType.STRING)
    @NotNull
    private Color eyeColor; //Поле не может быть null

    @Enumerated(EnumType.STRING)
    @NotNull
    private Color hairColor; //Поле не может быть null

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "location_id")
    @NotNull
    private Location location; //Поле не может быть null

    @Positive
    private float weight; //Значение поля должно быть больше 0

    @Enumerated(EnumType.STRING)
    @NotNull
    private Country nationality; //Поле не может быть null

    @OneToMany(mappedBy = "author")
    private List<Labwork> labworks;
}
