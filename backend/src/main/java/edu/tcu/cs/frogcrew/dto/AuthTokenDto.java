package main.java.edu.tcu.cs.frogcrew.dto;

import edu.tcu.cs.frogcrew.model.Role;
import jakarta.validation.constraints.NotEmpty;

import java.time.Instant;

public record AuthTokenDto(
        @NotEmpty
        Integer userId,
        @NotEmpty
        Role role,
        @NotEmpty
        String token,
        @NotEmpty
        Instant expiresAt
) {}