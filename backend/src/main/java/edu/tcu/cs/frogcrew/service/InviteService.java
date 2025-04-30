package main.java.edu.tcu.cs.frogcrew.service;

import edu.tcu.cs.frogcrew.dto.InviteRequestDto;
import edu.tcu.cs.frogcrew.model.InviteToken;
import edu.tcu.cs.frogcrew.repository.InviteTokenRepository;
import edu.tcu.cs.frogcrew.system.exception.ObjectNotFoundException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class InviteService {

    private final InviteTokenRepository inviteTokenRepository;

    private final JavaMailSender mailSender;

    public InviteService(InviteTokenRepository inviteTokenRepository, JavaMailSender mailSender) {
        this.inviteTokenRepository = inviteTokenRepository;
        this.mailSender = mailSender;
    }

    //UC‑14: Generate an invitation token for each email, persist it, and send out emails.
    public List<String> sendInvites(InviteRequestDto emails) {
        List<String> sent = new ArrayList<>();

        for (String email : sent) {
            String token = UUID.randomUUID().toString();
            Instant expiresAt = Instant.now().plusSeconds(7 * 24 * 3600);  // 7 days

            InviteToken invite = new InviteToken();
            invite.setEmail(email);
            invite.setToken(token);
            invite.setExpiresAt(expiresAt);
            inviteTokenRepository.save(invite);

            sent.add(email);
        }

        return sent;
    }

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

    private void sendInviteEmail(String toEmail, String token) {
        // Create a MIME message
        MimeMessage message = mailSender.createMimeMessage();

        try {
            // Use a helper to set the details (true = multipart / HTML)
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            // Build registration link
            String link = "http://localhost:8080/register?token=" + token;

            // Set the To/From/Subject
            helper.setTo(toEmail);
            helper.setSubject("You’re Invited to Join FrogCrew!");
            helper.setFrom("no-reply@frogcrew.example.com");

            // Craft an HTML body
            String html = "<p>Hi there,</p>"
                    + "<p>You’ve been invited to join the FrogCrew app. "
                    + "Click the link below to complete your registration:</p>"
                    + "<p><a href=\"" + link + "\">Accept Your Invite</a></p>"
                    + "<br><p>This link expires in 7 days.</p>";

            helper.setText(html, true);

            mailSender.send(message);

        } catch (MessagingException ex) {
            throw new IllegalStateException("Failed to send invite email to " + toEmail, ex);
        }
    }


}