package main.java.edu.tcu.cs.frogcrew.repository;

import edu.tcu.cs.frogcrew.model.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Integer> {
    //UC 7,8,17
    //Availability records for a crew member
    List<Availability> findByCrewMember_CrewMemberID(Integer crewMemberId);
}