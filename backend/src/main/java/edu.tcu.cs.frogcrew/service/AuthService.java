package main.java.edu.tcu.cs.frogcrew.service;

import edu.tcu.cs.frogcrew.model.CrewMember;
import edu.tcu.cs.frogcrew.repository.CrewMemberRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements UserDetailsService {

    private final CrewMemberRepository crewRepo;

    public AuthService(CrewMemberRepository crewRepo) {
        this.crewRepo = crewRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        CrewMember user = crewRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("No user with email: " + email)
                );
        // wrap in your UserPrincipal or similar
        return new UserPrincipal(user);
    }
}
