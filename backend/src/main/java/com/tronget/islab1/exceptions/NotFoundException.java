package com.tronget.islab1.exceptions;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class NotFoundException extends RuntimeException {

    private final String className;
    private final Long id;

    @Override
    public String getMessage() {
        return className + " with id " + id + " not found";
    }
}
