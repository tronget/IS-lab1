package com.tronget.islab1.dto;

import com.tronget.islab1.models.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserProfileDto {
    private Long id;
    private String username;
    private UserRole role;
}
