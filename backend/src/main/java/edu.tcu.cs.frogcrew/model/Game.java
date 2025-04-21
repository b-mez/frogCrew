package main.java.edu.tcu.cs.frogcrew.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
//@Table(name = "game")
public class Game {

    @Id
    @Column(name = "game_id")
    private Integer gameID;

    @ManyToOne
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @Column(nullable = false)
    private LocalDate gameDate;

    @Column(nullable = false)
    private LocalTime gameTime;

    @Column(nullable = false)
    private String venue;

    @Column(nullable = false)
    private String opponent;

    @ManyToMany
    @JoinTable(
            name = "game_crew",
            joinColumns = @JoinColumn(name = "game_id"),
            inverseJoinColumns = @JoinColumn(name = "crew_member_id")
    )
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
}
