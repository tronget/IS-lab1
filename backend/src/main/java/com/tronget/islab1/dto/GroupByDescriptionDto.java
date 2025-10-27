package com.tronget.islab1.dto;

import com.tronget.islab1.models.LabWork;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GroupByDescriptionDto {
    private String description;
    private List<LabWorkResponseDto> labWorks;
}
