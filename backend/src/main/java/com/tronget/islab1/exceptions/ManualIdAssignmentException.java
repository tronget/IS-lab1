package com.tronget.islab1.exceptions;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class ManualIdAssignmentException extends RuntimeException {

    @Override
    public String getMessage() {
        return "Manual id assignment is forbidden.";
    }
}
