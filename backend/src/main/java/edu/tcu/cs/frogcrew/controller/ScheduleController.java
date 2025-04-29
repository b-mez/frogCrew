package main.java.edu.tcu.cs.frogcrew.controller;

import edu.tcu.cs.frogcrew.model.Schedule;
import edu.tcu.cs.frogcrew.service.ScheduleService;
import edu.tcu.cs.frogcrew.system.Result;
import edu.tcu.cs.frogcrew.system.StatusCode;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedule")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    /**
     * POST /schedule
     * createSchedule
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Result createSchedule(@Valid @RequestBody Schedule schedule) {
        Schedule saved = scheduleService.saveSchedule(schedule);
        return new Result(
                true,
                StatusCode.SUCCESS,
                "Create Schedule Success",
                saved
        );
    }

    /**
     * PUT /schedule/{scheduleId}
     * addGames
     */
    @PutMapping("/{scheduleId}")
    @ResponseStatus(HttpStatus.CREATED)
    public Result addGames(
            @PathVariable Integer scheduleId,
            @RequestBody List<Integer> gameIds
    ) {
        Schedule updated = scheduleService.addGames(scheduleId, gameIds);
        return new Result(
                true,
                StatusCode.SUCCESS,
                "Add Games Success",
                updated
        );
    }

    /**
     * GET /schedule
     * findAllSchedules
     */
    @GetMapping
    public Result findAllSchedules() {
        List<Schedule> list = scheduleService.findAllSchedules();
        return new Result(
                true,
                StatusCode.SUCCESS,
                "Find All Schedules Success",
                list
        );
    }

    /**
     * GET /schedule/{scheduleId}
     * findById
     */
    @GetMapping("/{scheduleId}")
    public Result findById(@PathVariable Integer scheduleId) {
        Schedule found = scheduleService.findById(scheduleId);
        return new Result(
                true,
                StatusCode.SUCCESS,
                "Find Schedule Success",
                found
        );
    }
}
