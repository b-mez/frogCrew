package main.java.edu.tcu.cs.frogcrew.dto;


public record InviteValidationDto (
        boolean valid,
        String token
)
{}