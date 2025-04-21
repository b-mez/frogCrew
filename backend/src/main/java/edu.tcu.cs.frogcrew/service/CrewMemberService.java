package main.java.edu.tcu.cs.frogcrew.service;

import edu.tcu.cs.frogcrew.model.CrewMember;
import edu.tcu.cs.frogcrew.model.Role;
import edu.tcu.cs.frogcrew.repository.CrewMemberRepository;
import edu.tcu.cs.frogcrew.system.exception.ObjectNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CrewMemberService {

    private final CrewMemberRepository crewRepo;

    public CrewMemberService(CrewMemberRepository crewRepo) {
        this.crewRepo = crewRepo;
    }

    public List<CrewMember> getAllCrewMembers() {
        return crewRepo.findAll();
    }

    public List<CrewMember> getByRole(Role role) {
        return crewRepo.findByRole(role);
    }

    public CrewMember getById(Integer id) {
        return crewRepo.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("CrewMember", id));
    }
}
