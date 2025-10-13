package com.tronget.islab1.service;

import com.tronget.islab1.dto.GroupByDescriptionDto;

import java.util.List;

public interface SpecOpsService {
    double sumMaximumPoint();
    List<GroupByDescriptionDto> groupByDescription();
    int countByTunedInWorks(int tunedInWorks);
    void addToDiscipline(Long labId, Long disciplineId);
    void removeFromDiscipline(Long labId, Long disciplineId);
}
