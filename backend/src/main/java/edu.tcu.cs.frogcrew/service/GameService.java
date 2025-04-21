package main.java.edu.tcu.cs.frogcrew.service;

import edu.tcu.cs.frogcrew.model.Game;
import edu.tcu.cs.frogcrew.repository.GameRepository;
import edu.tcu.cs.frogcrew.system.exception.ObjectNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class GameService {

    private final GameRepository gameRepo;

    public GameService(GameRepository gameRepo) {
        this.gameRepo = gameRepo;
    }

    /** UC‑5: View general game schedule (all games in a schedule) */
    public List<Game> getGamesBySchedule(Integer scheduleId) {
        return gameRepo.findBySchedule_ScheduleID(scheduleId);
    }

    /** UC‑4: View a crew member’s assigned games */
    public List<Game> getGamesForCrewMember(Integer crewMemberId) {
        return gameRepo.findByCrewMemberId(crewMemberId);
    }

    /** Basic CRUD for games **/
    public List<Game> findAll() {
        return gameRepo.findAll();
    }

    public Game findById(Integer id) {
        return gameRepo.findById(id)
                .orElseThrow(() ->
                        new ObjectNotFoundException("Game", "id", id)
                );
    }

    public Game save(Game game) {
        return gameRepo.save(game);
    }

    public void delete(Integer id) {
        // will throw EmptyResultDataAccessException if not found
        gameRepo.deleteById(id);
    }
}


