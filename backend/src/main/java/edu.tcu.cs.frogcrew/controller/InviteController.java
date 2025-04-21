package main.java.edu.tcu.cs.frogcrew.controller;

import edu.tcu.cs.frogcrew.dto.InviteValidationDto;
import edu.tcu.cs.frogcrew.model.InviteToken;
import edu.tcu.cs.frogcrew.service.InviteService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/invite")
public class InviteController {

    private final InviteService inviteService;

    public InviteController(InviteService inviteService) {
        this.inviteService = inviteService;
    }

    @GetMapping("/{token}")
    public InviteValidationDto validate(@PathVariable String token) {
        InviteToken invite = inviteService.validateInviteToken(token);
        return new InviteValidationDto(true, invite.getToken());
    }
}