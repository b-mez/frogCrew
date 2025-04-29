package main.java.edu.tcu.cs.frogcrew.config;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

@Service
public class JwtProvider {
    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;

    public JwtProvider(JwtEncoder jwtEncoder, JwtDecoder jwtDecoder) {
        this.jwtEncoder = jwtEncoder;
        this.jwtDecoder = jwtDecoder;
    }


    //Generates a signed JWT for the given user
    public String generateToken(UserDetails user) {
        Instant now = Instant.now();
        long expiresIn = 2;

        String authorities = user.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .collect(Collectors.joining(" "));// MUST BE space-delimited.

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("frogcrew-api")
                .issuedAt(now)
                .expiresAt(now.plus(expiresIn, ChronoUnit.HOURS))
                .subject(user.getUsername())
                .claim("authorities", authorities)
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims))
                .getTokenValue();
    }


     // Validates and parses an incoming JWT.
     // Throws an exception if the token is invalid or expired.
    public Jwt validateToken(String token) {
        return jwtDecoder.decode(token);
    }
}
