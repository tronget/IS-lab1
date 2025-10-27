package com.tronget.islab1.dto;

import com.tronget.islab1.models.Difficulty;
import lombok.Data;

import java.util.Date;

@Data
public class LabWorkResponseDto {
    private Long id;
    private String name;
    private String description;
    private Difficulty difficulty;
    private float minimalPoint;
    private double maximumPoint;
    private int tunedInWorks;
    private Date creationDate;

    private PersonDto author;
    private DisciplineDto discipline;
    private CoordinatesDto coordinates;
}
