package main.java.edu.tcu.cs.frogcrew.controller;

import edu.tcu.cs.frogcrew.dto.AuthTokenDto;
import edu.tcu.cs.frogcrew.dto.LoginRequestDto;
import edu.tcu.cs.frogcrew.service.AuthService;
import edu.tcu.cs.frogcrew.system.Result;
import edu.tcu.cs.frogcrew.system.StatusCode;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    //POST /auth/login
    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public Result login(@Valid @RequestBody LoginRequestDto request) {
        AuthTokenDto tokenDto = authService.login(request);
        return new Result(
                true,
                StatusCode.SUCCESS,
                "Login Success",
                tokenDto
        );
    }

    //GET /auth/loginSuccess
    @GetMapping("/loginSuccess")
    public Result loginSuccess(@AuthenticationPrincipal Jwt jwt) {
        // grab whatever you need out of the Jwt
        Instant expiresAt = jwt.getExpiresAt();
        Map<String, Object> details = Map.of(
                "expiresAt", expiresAt,
                "subject",     jwt.getSubject(),
                "claims",      jwt.getClaims()
        );
        return new Result(
                true,
                StatusCode.SUCCESS,
                "Token validated",
                details
        );
    }
}