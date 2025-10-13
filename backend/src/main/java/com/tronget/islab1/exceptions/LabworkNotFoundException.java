package com.tronget.islab1.exceptions;

import com.tronget.islab1.models.LabWork;

public class LabworkNotFoundException extends NotFoundException {
    public LabworkNotFoundException(Long id) {
        super(LabWork.class.getSimpleName(), id);
    }
}
