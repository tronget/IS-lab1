package com.tronget.islab1.dto;

import com.tronget.islab1.models.Color;
import com.tronget.islab1.models.Country;
import lombok.Data;

@Data
public class PersonDto {
    private Long id;
    private String name;
    private Color eyeColor;
    private Color hairColor;
    private LocationDto location;
    private Float weight;
    private Country nationality;
}