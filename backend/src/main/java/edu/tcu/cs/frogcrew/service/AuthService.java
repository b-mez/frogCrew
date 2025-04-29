package main.java.edu.tcu.cs.frogcrew.service;

import edu.tcu.cs.frogcrew.config.JwtProvider;
import edu.tcu.cs.frogcrew.config.MyUserPrincipal;
import edu.tcu.cs.frogcrew.dto.AuthTokenDto;
import edu.tcu.cs.frogcrew.dto.LoginRequestDto;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtProvider jwtProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
    }

    //Authenticate using email/password, generate a JWT, and return an AuthToken DTO.
    public AuthTokenDto login(LoginRequestDto credentials) {
        // 1. Delegate to AuthenticationManager (uses your CustomUserDetailsService + BCrypt)
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        credentials.email(),
                        credentials.password()
                )
        );

        // 2. Our custom principal holds the CrewMember
        MyUserPrincipal principal = (MyUserPrincipal) auth.getPrincipal();

        // 3. Generate a signed JWT
        String token = jwtProvider.generateToken(principal);

        // 4. Parse it back to get the expiration timestamp
        Jwt parsedJwt = jwtProvider.validateToken(token);
        Instant expiresAt = parsedJwt.getExpiresAt();

        // 5. Build and return the AuthToken DTO
        return new AuthTokenDto(
                principal.getCrewMember().getCrewMemberID(),
                principal.getCrewMember().getRole(),
                token,
                expiresAt
        );
    }
}
