package com.tronget.islab1.controller;

import com.tronget.islab1.dto.AuthResponseDto;
import com.tronget.islab1.dto.LoginRequestDto;
import com.tronget.islab1.dto.RegisterRequestDto;
import com.tronget.islab1.dto.UserProfileDto;
import com.tronget.islab1.service.UserAccountService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserAccountService userAccountService;

    public AuthController(UserAccountService userAccountService) {
        this.userAccountService = userAccountService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody RegisterRequestDto request) {
        return ResponseEntity.ok(userAccountService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        return ResponseEntity.ok(userAccountService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> profile() {
        return ResponseEntity.ok(userAccountService.profile());
    }
}
