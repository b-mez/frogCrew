package main.java.edu.tcu.cs.frogcrew.service;

import edu.tcu.cs.frogcrew.model.Availability;
import edu.tcu.cs.frogcrew.repository.AvailabilityRepository;
import edu.tcu.cs.frogcrew.system.exception.ObjectNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class AvailabilityService {
    private final AvailabilityRepository availabilityRepository;

    public AvailabilityService(AvailabilityRepository availabilityRepository) {
        this.availabilityRepository = availabilityRepository;
    }

    public List<Availability> findAll() {
        return availabilityRepository.findAll();
    }


    public Availability saveAvailability(Availability avail) {
        return availabilityRepository.save(avail);
    }

    public List<Availability> listAllAvailability(Integer crewMemberId) {
        return availabilityRepository.findByCrewMember_CrewMemberID(crewMemberId);
    }

    public Availability updateAvailability(Integer id, Availability input) {
        Availability existing = availabilityRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Availability", id));
        // apply changes
        existing.setAvailable(input.isAvailable());
        existing.setComment(input.getComment());

        return availabilityRepository.save(existing);
    }

}