package test.java.edu.tcu.cs.frogcrewbackend.service;

import edu.tcu.cs.frogcrew.config.JwtProvider;
import edu.tcu.cs.frogcrew.config.MyUserPrincipal;
import edu.tcu.cs.frogcrew.dto.AuthTokenDto;
import edu.tcu.cs.frogcrew.dto.LoginRequestDto;
import edu.tcu.cs.frogcrew.model.CrewMember;
import edu.tcu.cs.frogcrew.model.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.jwt.JwtDecoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    AuthenticationManager authenticationManager;

    @Mock
    JwtProvider jwtProvider;

    @Mock
    JwtDecoder jwtDecoder;

    @InjectMocks
    AuthService authService;

    LoginRequestDto loginRequest;
    UsernamePasswordAuthenticationToken authToken;
    CrewMember crewMember;
    MyUserPrincipal principal;
    Authentication authResult;

    @BeforeEach
    void setUp() {
        loginRequest = new LoginRequestDto("alice@frogcrew.com", "secret");
        // this matches how AuthService creates the token
        authToken = new UsernamePasswordAuthenticationToken(
                loginRequest.email(), loginRequest.password()
        );

        // create a dummy CrewMember and wrap in MyUserPrincipal
        crewMember = new CrewMember();
        crewMember.setCrewMemberID(42);
        crewMember.setRole(Role.ADMIN);
        principal = new MyUserPrincipal(crewMember);

        // configure an Authentication result whose getPrincipal() returns principal
        authResult = mock(Authentication.class);
//        when(authResult.getPrincipal()).thenReturn(principal);
    }

    @Test
    void loginSuccess() {
        // mock authenticate
        when(authenticationManager.authenticate(argThat(token ->
                token.getName().equals("alice@frogcrew.com") &&
                        token.getCredentials().equals("secret")
        ))).thenReturn(authResult);

        when(authResult.getPrincipal()).thenReturn(principal);

        // mock jwtProvider.generateToken(...) → a fake JWT
        when(jwtProvider.generateToken(principal)).thenReturn("fake-jwt-token");

        // call service
        AuthTokenDto result = authService.login(loginRequest);

        // verify returned DTO fields
        assertEquals(42, result.userId());
        assertEquals(Role.ADMIN, result.role());
        assertEquals("fake-jwt-token", result.token());
        assertNotNull(result.expiresAt(), "expiresAt should be set");

        // 5) verify interactions
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtProvider).generateToken(principal);
    }

    @Test
    void loginBadCredentials() {
        // mock authenticate to throw BadCredentialsException
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // assert that AuthService propagates the exception
        AuthenticationException ex = assertThrows(
                BadCredentialsException.class,
                () -> authService.login(loginRequest)
        );
        assertTrue(ex.getMessage().contains("Bad credentials"));

        // jwtProvider should never be called
        verifyNoInteractions(jwtProvider);
    }
}
