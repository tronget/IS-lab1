package com.tronget.islab1.service;

import com.tronget.islab1.dto.LabWorkRequestDto;
import com.tronget.islab1.models.LabWork;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LabWorkService extends FindAllService<LabWork>, SpecOpsService {
    LabWork findById(Long id);
    List<LabWork> findAll(Pageable pageable);
    LabWork save(LabWork labWork);
    LabWork update(Long id, LabWorkRequestDto labWork);
    boolean delete(Long id);
}
