package main.java.edu.tcu.cs.frogcrew.model;

import edu.tcu.cs.frogcrew.service.ScheduleService;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Entity
@Table(name = "schedule")
public class Schedule {

    @Id
    @Column(name = "schedule_id")
    private Integer scheduleID;

    @NotBlank
    @Column(nullable = false)
    private String sport;

    @NotBlank
    @Column(nullable = false)
    private String season;

    @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Game> gameList;

    public Schedule() {}

    public Integer getScheduleID() {
        return scheduleID;
    }

    public void setScheduleID(Integer scheduleID) {
        this.scheduleID = scheduleID;
    }

    public String getSport() {
        return sport;
    }

    public void setSport(String sport) {
        this.sport = sport;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public List<Game> getGameList() {
        return gameList;
    }

    public void setGameList(List<Game> gameList) {
        this.gameList = gameList;
    }
}
