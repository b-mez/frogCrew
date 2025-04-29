package main.java.edu.tcu.cs.frogcrew.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Entity
//@Table(name = "game")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer gameID;

    @ManyToOne
    private Schedule schedule;

    private LocalDate gameDate;

    private LocalTime gameTime;

    private String venue;

    private String opponent;

    @ManyToMany
    private List<CrewMember> crewList;

    public Game() {}

    public Integer getGameID() {
        return gameID;
    }

    public void setGameID(Integer gameID) {
        this.gameID = gameID;
    }

    public Schedule getSchedule() {
        return schedule;
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }

    public LocalDate getGameDate() {
        return gameDate;
    }

    public void setGameDate(LocalDate gameDate) {
        this.gameDate = gameDate;
    }

    public LocalTime getGameTime() {
        return gameTime;
    }

    public void setGameTime(LocalTime gameTime) {
        this.gameTime = gameTime;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getOpponent() {
        return opponent;
    }

    public void setOpponent(String opponent) {
        this.opponent = opponent;
    }

    public List<CrewMember> getCrewList() {
        return crewList;
    }

    public void setCrewList(List<CrewMember> crewList) {
        this.crewList = crewList;
    }

    @Transient
    public List<Integer> getCrewListIDs() {
        return this.crewList.stream()
                .map(CrewMember::getCrewMemberID)
                .collect(Collectors.toList());
    }

}
