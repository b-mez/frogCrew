package test.java.edu.tcu.cs.frogcrewbackend.service;

import edu.tcu.cs.frogcrew.dto.InviteRequestDto;
import edu.tcu.cs.frogcrew.model.InviteToken;
import edu.tcu.cs.frogcrew.repository.InviteTokenRepository;
import edu.tcu.cs.frogcrew.system.exception.ObjectNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InviteServiceTest {

    @Mock
    private InviteTokenRepository tokenRepository;

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private InviteService inviteService;

    private List<String> emails;
    private InviteRequestDto request;

    @BeforeEach
    void setUp() {
        emails = List.of("alice@gmail.com", "bob@gmail.com");
        request = new InviteRequestDto(emails);
    }

//    @Test
//    void sendInvites_success_savesTokensAndSendsEmails() {
//        // given
//        when(tokenRepository.save(any(InviteToken.class)))
//                .thenAnswer(inv -> inv.getArgument(0));
//
//        // when
//        List<String> sent = inviteService.sendInvites(emails);
//
//        // then
//        assertEquals(emails, sent);
//        verify(tokenRepository, times(emails.size())).save(any());
//        verify(mailSender,   times(emails.size())).send(any(SimpleMailMessage.class));
//
//    }



    @Test
    void validateInviteToken_existingToken_returnsIt() {
        // arrange
        InviteToken token = new InviteToken();
        token.setToken("abc123");
        token.setExpiresAt(Instant.now().plusSeconds(3600));
        when(tokenRepository.findByToken("abc123"))
                .thenReturn(Optional.of(token));

        // act
        InviteToken result = inviteService.validateInviteToken("abc123");

        // assert
        assertSame(token, result);
        verify(tokenRepository).findByToken("abc123");
    }

    @Test
    void validateInviteToken_missingToken_throwsException() {
        // arrange
        when(tokenRepository.findByToken("nope"))
                .thenReturn(Optional.empty());

        // act & assert
        assertThrows(
                ObjectNotFoundException.class,
                () -> inviteService.validateInviteToken("nope"),
                "Expected missing token to cause ObjectNotFoundException"
        );
        verify(tokenRepository).findByToken("nope");
    }
}