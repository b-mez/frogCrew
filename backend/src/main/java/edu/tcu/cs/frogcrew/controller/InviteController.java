package main.java.edu.tcu.cs.frogcrew.controller;

import edu.tcu.cs.frogcrew.dto.InviteRequestDto;
import edu.tcu.cs.frogcrew.model.InviteToken;
import edu.tcu.cs.frogcrew.service.InviteService;
import edu.tcu.cs.frogcrew.system.Result;
import edu.tcu.cs.frogcrew.system.StatusCode;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invite")
public class InviteController {

    private final InviteService inviteService;

    public InviteController(InviteService inviteService) {
        this.inviteService = inviteService;
    }

    //POST /invite
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Result sendInvites(@Valid @RequestBody InviteRequestDto request) {
        // service returns an InviteResponseDto object
        List<String> response = inviteService.sendInvites(request);
        return new Result(
                true,
                StatusCode.SUCCESS,
                "Send Invites Success",
                response
        );
    }



    //GET /invite/{token}
    @GetMapping("/{token}")
    public Result validate(@PathVariable String token) {
        InviteToken validation = inviteService.validateInviteToken(token);
        return new Result(
                true,
                StatusCode.SUCCESS,
                "Validate Invite Success",
                validation
        );
    }
}
