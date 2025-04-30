package main.java.edu.tcu.cs.frogcrew.dto;

import java.util.List;

public record InviteRequestDto(
        List<String> emails
) {}