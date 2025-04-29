package main.java.edu.tcu.cs.frogcrew.service;

import edu.tcu.cs.frogcrew.model.CrewMember;
import edu.tcu.cs.frogcrew.model.Role;
import edu.tcu.cs.frogcrew.repository.CrewMemberRepository;
import edu.tcu.cs.frogcrew.system.exception.ObjectNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class CrewMemberService {

    private final CrewMemberRepository crewMemberRepository;

    public CrewMemberService(CrewMemberRepository crewMemberRepository) {
        this.crewMemberRepository = crewMemberRepository;
    }

    public CrewMember saveCrewMember(CrewMember crewMember) {
        return crewMemberRepository.save(crewMember);
    }

    public List<CrewMember> getAllCrewMembers() {
        return crewMemberRepository.findAll();
    }

    public CrewMember getById(Integer id) {
        return crewMemberRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("CrewMember", id));
    }

    public void delete(Integer id) {
        this.crewMemberRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("CrewMember", id));
        this.crewMemberRepository.deleteById(id);
    }

    public CrewMember findByEmail(String email) {
        return crewMemberRepository.findByEmail(email)
                .orElseThrow(() -> new ObjectNotFoundException("CrewMember", email));
    }

    public List<CrewMember> findByRole(Role role) {
        return crewMemberRepository.findByRole(role);
    }


}