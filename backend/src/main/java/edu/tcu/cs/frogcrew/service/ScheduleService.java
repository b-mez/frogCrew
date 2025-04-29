package main.java.edu.tcu.cs.frogcrew.service;

import edu.tcu.cs.frogcrew.model.Game;
import edu.tcu.cs.frogcrew.model.Schedule;
import edu.tcu.cs.frogcrew.repository.GameRepository;
import edu.tcu.cs.frogcrew.repository.ScheduleRepository;
import edu.tcu.cs.frogcrew.system.exception.ObjectNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final GameRepository gameRepository;

    public ScheduleService(ScheduleRepository scheduleRepository, GameRepository gameRepository) {
        this.scheduleRepository = scheduleRepository;
        this.gameRepository = gameRepository;
    }

    public Schedule saveSchedule(Schedule s) {
        return scheduleRepository.save(s);
    }

    public Schedule findById(Integer id) {
        return this.scheduleRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Schedule", id));
    }

    public List<Schedule> findAllSchedules() {
        return this.scheduleRepository.findAll();
    }

    public Schedule addGames(Integer id, List<Integer> gameIds) {

        Schedule sched = scheduleRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Schedule", id));

        List<Game> gamesToAdd = gameRepository.findAllById(gameIds);

        if (sched.getGameList() == null) {
            sched.setGameList(new ArrayList<>());
        }

        //append to schedule list
        for (Game g : gamesToAdd) {
            if(!sched.getGameList().contains(g)) {
                sched.getGameList().add(g);
                g.setSchedule(sched);
            }
        }
        //save the updated schedule
        return scheduleRepository.save(sched);

    }

}