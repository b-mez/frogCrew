package main.java.edu.tcu.cs.frogcrew.repository;

import edu.tcu.cs.frogcrew.model.InviteToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InviteTokenRepository extends JpaRepository<InviteToken, Integer> {
    //UC-14
    Optional<InviteToken> findByToken(String token);
}