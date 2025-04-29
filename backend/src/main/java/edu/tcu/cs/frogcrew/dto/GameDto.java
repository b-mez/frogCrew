package main.java.edu.tcu.cs.frogcrew.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record GameDto(
        @NotNull Integer gameID,
        @NotNull Integer scheduleID,
        @NotNull LocalDate gameDate,
        @NotNull LocalTime gameTime,
        @NotNull String venue,
        @NotNull String opponent,
        List<Integer> crewListIDs
) {}