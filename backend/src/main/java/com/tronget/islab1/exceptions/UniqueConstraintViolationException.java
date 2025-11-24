package com.tronget.islab1.exceptions;

import lombok.Getter;

@Getter
public class UniqueConstraintViolationException extends RuntimeException {
    private final String code;

    public UniqueConstraintViolationException(String code, String message) {
        super(message);
        this.code = code;
    }

}
