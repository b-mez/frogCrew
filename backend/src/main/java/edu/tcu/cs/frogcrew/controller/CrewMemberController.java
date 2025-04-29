package main.java.edu.tcu.cs.frogcrew.controller;

import edu.tcu.cs.frogcrew.model.CrewMember;
import edu.tcu.cs.frogcrew.service.CrewMemberService;
import edu.tcu.cs.frogcrew.system.Result;
import edu.tcu.cs.frogcrew.system.StatusCode;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/crew")
public class CrewMemberController {

    private final CrewMemberService crewMemberService;

    public CrewMemberController(CrewMemberService crewMemberService) {
        this.crewMemberService = crewMemberService;
    }

    // POST /crew
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Result createCrewMember(@Valid @RequestBody CrewMember crewMember) {
        CrewMember saved = crewMemberService.saveCrewMember(crewMember);
        return new Result(
                true,
                StatusCode.SUCCESS,
                "Create Crew Member Success",
                saved
        );
    }

    // GET /crew
    @GetMapping
    public Result getAllCrewMembers() {
        List<CrewMember> list = crewMemberService.getAllCrewMembers();
        return new Result(
                true,
                StatusCode.SUCCESS,
                "List All Crew Members Success",
                list
        );
    }

    // GET /crew/{crewMemberId}
    @GetMapping("/{crewMemberId}")
    public Result getCrewMember(@PathVariable Integer crewMemberId) {
        CrewMember found = crewMemberService.getById(crewMemberId);
        return new Result(
                true,
                StatusCode.SUCCESS,
                "Get Crew Member Success",
                found
        );
    }

    // DELETE /crew/{crewMemberId}
    @DeleteMapping("/{crewMemberId}")
    public Result deleteCrewMember(@PathVariable Integer crewMemberId) {
        crewMemberService.delete(crewMemberId);
        return new Result(
                true,
                StatusCode.SUCCESS,
                "Delete Crew Member Success"
        );
    }
}
