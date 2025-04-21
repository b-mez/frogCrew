package main.java.edu.tcu.cs.frogcrew.repository;

import edu.tcu.cs.frogcrew.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    //UC-18 and UC-20
}