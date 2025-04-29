package main.java.edu.tcu.cs.frogcrew.controller;

import edu.tcu.cs.frogcrew.model.Availability;
import edu.tcu.cs.frogcrew.service.AvailabilityService;
import edu.tcu.cs.frogcrew.system.Result;
import edu.tcu.cs.frogcrew.system.StatusCode;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/availability")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    //POST /availability
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Result createAvailability(@Valid @RequestBody Availability availability) {
        Availability saved = availabilityService.saveAvailability(availability);
        return new Result(
                true,
                StatusCode.SUCCESS,
                "Create Availability Success",
                saved
        );
    }

    //PUT /availability/{id}
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public Result updateAvailability(
            @PathVariable Integer id,
            @Valid @RequestBody Availability availability
    ) {
        Availability updated = availabilityService.updateAvailability(id, availability);
        return new Result(
                true,
                StatusCode.SUCCESS,
                "Update Availability Success",
                updated
        );
    }

    //GET /availability
    @GetMapping
    public Result getAvailability() {
        List<Availability> all = availabilityService.findAll();
        return new Result(
                true,
                StatusCode.SUCCESS,
                "List All Availability Success",
                all
        );
    }

    //GET /availability/crew/{crewMemberId}
    @GetMapping("/crew/{crewMemberId}")
    public Result getAvailabilityByCrewMember(@PathVariable Integer crewMemberId) {
        List<Availability> list = availabilityService.listAllAvailability(crewMemberId);
        return new Result(
                true,
                StatusCode.SUCCESS,
                "List Availability By Crew Member Success",
                list
        );
    }
}
