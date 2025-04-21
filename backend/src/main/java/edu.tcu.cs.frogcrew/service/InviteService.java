package main.java.edu.tcu.cs.frogcrew.service;

import edu.tcu.cs.frogcrew.model.InviteToken;
import edu.tcu.cs.frogcrew.repository.InviteTokenRepository;
import edu.tcu.cs.frogcrew.system.exception.ObjectNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class InviteService {

    private final InviteTokenRepository inviteTokenRepository;

    public InviteService(InviteTokenRepository inviteTokenRepository) {
        this.inviteTokenRepository = inviteTokenRepository;
    }

    /**
     * 1) Look up the token string in the DB
     * 2) Throw if it doesn’t exist
     * 3) Throw if it’s expired
     * 4) Otherwise return it
     */
    public InviteToken validateInviteToken(String tokenString) {
        InviteToken invite = inviteTokenRepository
                .findByToken(tokenString)
                .orElseThrow(() ->
                        new ObjectNotFoundException("Invalid invite token: " + tokenString)
                );

        if (Instant.now().isAfter(invite.getExpiresAt())) {
            throw new IllegalStateException("Invite token has expired: " + tokenString);
        }

        return invite;
    }

    // ... other invite-related methods ...
}

