package com.tronget.islab1.service;

import com.tronget.islab1.dto.AuthResponseDto;
import com.tronget.islab1.dto.LoginRequestDto;
import com.tronget.islab1.dto.RegisterRequestDto;
import com.tronget.islab1.dto.UserProfileDto;
import com.tronget.islab1.exceptions.UniqueConstraintViolationException;
import com.tronget.islab1.models.UserAccount;
import com.tronget.islab1.models.UserRole;
import com.tronget.islab1.repository.UserAccountRepository;
import com.tronget.islab1.security.JwtService;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserAccountService {

    private final UserAccountRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserAccountService(UserAccountRepository repository,
                              PasswordEncoder passwordEncoder,
                              JwtService jwtService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponseDto register(RegisterRequestDto request) {
        String normalized = request.getUsername().trim();
        if (repository.existsByUsernameIgnoreCase(normalized)) {
            throw new UniqueConstraintViolationException("username",
                    "User already exists");
        }
        UserAccount account = new UserAccount();
        account.setUsername(normalized.toLowerCase());
        account.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        account.setRole(UserRole.USER);
        repository.save(account);
        String token = jwtService.generateToken(account);
        return new AuthResponseDto(token, account.getUsername(), account.getRole());
    }

    public AuthResponseDto login(LoginRequestDto request) {
        String normalized = request.getUsername().trim();
        UserAccount account =
                repository.findByUsernameIgnoreCase(normalized)
                        .orElseThrow(
                                () -> new BadCredentialsException("Invalid credentials"));
        if (!passwordEncoder.matches(request.getPassword(),
                account.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        String token = jwtService.generateToken(account);
        return new AuthResponseDto(token, account.getUsername(), account.getRole());
    }

    public UserProfileDto profile() {
        UserAccount account = getCurrentAccount();
        return new UserProfileDto(account.getId(), account.getUsername(),
                account.getRole());
    }

    public UserAccount getCurrentAccount() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() ||
                authentication instanceof AnonymousAuthenticationToken) {
            throw new BadCredentialsException("Not authenticated");
        }
        String username = authentication.getName();
        return repository.findByUsernameIgnoreCase(username).orElseThrow(
                () -> new BadCredentialsException("User not found"));
    }
}
