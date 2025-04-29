package main.java.edu.tcu.cs.frogcrew.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record InviteResponseDto (
        //must have at least one valid email address
        @NotEmpty
        List<@Email String> sent
) {}
