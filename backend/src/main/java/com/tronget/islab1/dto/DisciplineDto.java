package com.tronget.islab1.dto;

import lombok.Data;

@Data
public class DisciplineDto {
    private Long id;
    private String name;
    private Long practiceHours;
    private Integer selfStudyHours;
    private Integer labsCount;
}