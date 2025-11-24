package com.tronget.islab1.dto;

import com.tronget.islab1.models.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDto {
    private String token;
    private String username;
    private UserRole role;
}
