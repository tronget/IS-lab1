package com.tronget.islab1.exceptions;

import com.tronget.islab1.models.Discipline;

public class DisciplineNotFoundException extends NotFoundException {
    public DisciplineNotFoundException(Long id) {
        super(Discipline.class.getSimpleName(), id);
    }
}
