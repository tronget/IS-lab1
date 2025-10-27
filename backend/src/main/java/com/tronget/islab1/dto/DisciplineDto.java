package com.tronget.islab1.dto;

import lombok.Data;

@Data
public class DisciplineDto {
    private Long id;
    private String name;
    private long practiceHours;
    private int selfStudyHours;
    private int labsCount;
}