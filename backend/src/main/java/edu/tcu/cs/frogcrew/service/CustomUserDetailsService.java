package main.java.edu.tcu.cs.frogcrew.service;

import edu.tcu.cs.frogcrew.config.MyUserPrincipal;
import edu.tcu.cs.frogcrew.model.CrewMember;
import edu.tcu.cs.frogcrew.repository.CrewMemberRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final CrewMemberRepository crewMemberRepository;

    public CustomUserDetailsService(CrewMemberRepository crewMemberRepository) {
        this.crewMemberRepository = crewMemberRepository;
    }

    public UserDetails loadUserByUsername (String email) throws UsernameNotFoundException {
        CrewMember user = crewMemberRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("no user with email " + email));
        return new MyUserPrincipal(user);
    }

}
