package com.tronget.islab1.service;

import com.tronget.islab1.models.LabWork;
import java.util.List;

public interface LabWorkService {
    List<LabWork> findAll();
    LabWork findById(Long id);
    LabWork save(LabWork labWork);
    LabWork update(LabWork labWork);
    boolean delete(Long id);
}
