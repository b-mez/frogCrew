package main.java.edu.tcu.cs.frogcrew.repository;

import edu.tcu.cs.frogcrew.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Integer> {
    // UC‑5 (general schedule) – all games in a schedule
    List<Game> findBySchedule_ScheduleID(Integer scheduleID);

    // UC‑4 (my assigned games) – games where a given crew member is in the crewList
    // possibly use code below for custom query with SQL
    @Query("select g from Game g join g.crewList cm where cm.crewMemberID = :memberId")
    List<Game> findByCrewMemberId(@Param("memberId") Integer memberId);
}