package main.java.edu.tcu.cs.frogcrew.service;

import edu.tcu.cs.frogcrew.model.CrewMember;
import edu.tcu.cs.frogcrew.model.Game;
import edu.tcu.cs.frogcrew.repository.CrewMemberRepository;
import edu.tcu.cs.frogcrew.repository.GameRepository;
import edu.tcu.cs.frogcrew.system.exception.ObjectNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class CrewScheduleService {

    private final GameRepository gameRepository;

    private final CrewMemberRepository crewMemberRepository;

    public CrewScheduleService(GameRepository gameRepository, CrewMemberRepository crewMemberRepository) {
        this.gameRepository = gameRepository;
        this.crewMemberRepository = crewMemberRepository;
    }

    public List<CrewMember> getCrewForGame(Integer gameId) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new ObjectNotFoundException("Game", gameId));
        return game.getCrewList();
    }

    public Game replaceCrewForGame(Integer gameId, List<Integer> crewMemberIds) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new ObjectNotFoundException("Game", gameId));

        // Load all crew members
        List<CrewMember> crew = crewMemberRepository.findAllById(crewMemberIds);
        if (crew.size() != crewMemberIds.size()) {
            throw new IllegalArgumentException("One or more CrewMember IDs are invalid");
        }

        // Overwrite the list
        game.setCrewList(crew);

        return gameRepository.save(game);
    }


}
