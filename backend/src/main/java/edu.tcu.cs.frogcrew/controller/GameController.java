package main.java.edu.tcu.cs.frogcrew.controller;

import edu.tcu.cs.frogcrew.model.Game;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public class GameController {

    @GetMapping("/schedule/{sid}/games")
    public List<Game> listBySchedule(@PathVariable Integer sid) {
        return gameService.getGamesBySchedule(sid);
    }

    @GetMapping("/crew/{mid}/games")
    public List<Game> listByMember(@PathVariable Integer mid) {
        return gameService.getGamesForCrewMember(mid);
    }

}
