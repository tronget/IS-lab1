package com.tronget.islab1.service;

public interface SpecOpsService {
    double sumMaximumPoint();
    int countByTunedInWorks(int tunedInWorks);
    void addToDiscipline(Long labId, Long disciplineId);
    void removeFromDiscipline(Long labId, Long disciplineId);
}
