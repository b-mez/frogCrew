package main.java.edu.tcu.cs.frogcrew.controller;

import edu.tcu.cs.frogcrew.model.Game;
import edu.tcu.cs.frogcrew.service.GameService;
import edu.tcu.cs.frogcrew.system.Result;
import edu.tcu.cs.frogcrew.system.StatusCode;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/game")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    /**
     * GET /game
     * List all games
     */
    @GetMapping
    public Result listGames() {
        List<Game> games = gameService.findAll();
        return new Result(
                true,
                StatusCode.SUCCESS,
                "List Games Success",
                games
        );
    }

    /**
     * GET /game/schedule/{sid}/games
     * List games for a given schedule
     */
    @GetMapping("/schedule/{sid}/games")
    public Result listBySchedule(@PathVariable Integer sid) {
        List<Game> games = gameService.getGamesBySchedule(sid);
        return new Result(
                true,
                StatusCode.SUCCESS,
                "List Games By Schedule Success",
                games
        );
    }

    /**
     * GET /game/crew/{mid}/games
     * List games for a given crew member
     */
    @GetMapping("/crew/{mid}/games")
    public Result listByMember(@PathVariable Integer mid) {
        List<Game> games = gameService.getGamesForCrewMember(mid);
        return new Result(
                true,
                StatusCode.SUCCESS,
                "List Games By Crew Member Success",
                games
        );
    }

    /**
     * POST /game
     * Create a new game
     */
    @PostMapping
    public Result createGame(@Valid @RequestBody Game game) {
        Game saved = gameService.save(game);
        return new Result(
                true,
                StatusCode.SUCCESS,
                "Create Game Success",
                saved
        );
    }

    /**
     * GET /game/{gameId}
     * Retrieve one game
     */
    @GetMapping("/{gameId}")
    public Result getGame(@PathVariable Integer gameId) {
        Game found = gameService.findById(gameId);
        return new Result(
                true,
                StatusCode.SUCCESS,
                "Get Game Success",
                found
        );
    }


}
