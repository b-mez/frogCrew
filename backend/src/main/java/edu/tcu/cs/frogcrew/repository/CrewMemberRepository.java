package main.java.edu.tcu.cs.frogcrew.repository;

import edu.tcu.cs.frogcrew.model.CrewMember;
import edu.tcu.cs.frogcrew.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CrewMemberRepository extends JpaRepository<CrewMember, Integer> {
    //UC 1,3,15,16
    Optional<CrewMember> findByEmail(String email); //for login and unique-email checks
    List<CrewMember> findByRole(Role role); //list all admins or list all users

}