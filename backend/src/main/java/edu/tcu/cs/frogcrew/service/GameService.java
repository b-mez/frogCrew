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

    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    //View a crew member’s assigned games
    public List<Game> getGamesForCrewMember(Integer crewMemberId) {
        return gameRepository.findByCrewMemberId(crewMemberId);
    }

    //View all games in a schedule
    public List<Game> getGamesBySchedule(Integer scheduleId) {
        return gameRepository.findBySchedule_ScheduleID(scheduleId);
    }

    //Basic CRUD for games
    public List<Game> findAll() {
        return gameRepository.findAll();
    }

    public Game findById(Integer id) {
        return gameRepository.findById(id)
                .orElseThrow(() ->
                        new ObjectNotFoundException("Game", id)
                );
    }

    public Game save(Game game) {
        return gameRepository.save(game);
    }

}


