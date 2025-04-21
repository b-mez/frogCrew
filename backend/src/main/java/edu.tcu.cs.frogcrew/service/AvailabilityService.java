package main.java.edu.tcu.cs.frogcrew.service;

import edu.tcu.cs.frogcrew.model.Availability;
import edu.tcu.cs.frogcrew.repository.AvailabilityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvailabilityService {
    private final AvailabilityRepository repo;

    public AvailabilityService(AvailabilityRepository repo) {
        this.repo = repo;
    }

    public Availability save(Availability avail) {
        return repo.save(avail);
    }

    public List<Availability> getByCrewMember(Integer crewMemberId) {
        return repo.findByCrewMember_CrewMemberID(crewMemberId);
    }
}