package main.java.edu.tcu.cs.frogcrew.dto;

import jakarta.validation.constraints.NotNull;

public record AvailabilityDto(
        @NotNull Integer crewMemberID,
        @NotNull Boolean available,
        @NotNull String comment
) {}