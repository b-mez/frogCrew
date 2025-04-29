package main.java.edu.tcu.cs.frogcrew.controller;

import edu.tcu.cs.frogcrew.model.CrewMember;
import edu.tcu.cs.frogcrew.model.Game;
import edu.tcu.cs.frogcrew.service.CrewScheduleService;
import edu.tcu.cs.frogcrew.system.Result;
import edu.tcu.cs.frogcrew.system.StatusCode;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/crewSchedule")
public class CrewScheduleController {

    private final CrewScheduleService crewScheduleService;

    public CrewScheduleController(CrewScheduleService crewScheduleService) {
        this.crewScheduleService = crewScheduleService;
    }

    //GET /crewSchedule/{gameId}
    @GetMapping("/{gameId}")
    public Result getCrewMembersForGame(@PathVariable Integer gameId) {
        List<CrewMember> crew = crewScheduleService.getCrewForGame(gameId);
        return new Result(
                true,
                StatusCode.SUCCESS,
                "Get Crew List Success",
                crew
        );
    }

    //UT /crewSchedule/{gameId}
    @PutMapping("/{gameId}")
    @ResponseStatus(HttpStatus.CREATED)
    public Result replaceCrewForGame(
            @PathVariable Integer gameId,
            @RequestBody List<Integer> crewMemberIds
    ) {
        Game updatedGame = crewScheduleService.replaceCrewForGame(gameId, crewMemberIds);
        return new Result(
                true,
                StatusCode.SUCCESS,
                "Replace Crew List Success",
                updatedGame
        );
    }
}
