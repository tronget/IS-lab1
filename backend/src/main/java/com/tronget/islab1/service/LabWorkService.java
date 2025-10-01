package com.tronget.islab1.service;

import com.tronget.islab1.dto.LabWorkRequestDto;
import com.tronget.islab1.models.LabWork;
import java.util.List;

public interface LabWorkService extends FindAllService<LabWork> {
    LabWork findById(Long id);
    LabWork save(LabWork labWork);
    LabWork update(Long id, LabWorkRequestDto labWork);
    boolean delete(Long id);
    double sumMaximumPoint();
    int countByTunedInWorks(int tunedInWorks);
}
