package test.java.edu.tcu.cs.frogcrewbackend.service;

import edu.tcu.cs.frogcrew.model.Game;
import edu.tcu.cs.frogcrew.model.Schedule;
import edu.tcu.cs.frogcrew.repository.GameRepository;
import edu.tcu.cs.frogcrew.repository.ScheduleRepository;
import edu.tcu.cs.frogcrew.system.exception.ObjectNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static java.util.List.of;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ScheduleServiceTest {

    @Mock
    private ScheduleRepository scheduleRepository;

    @Mock
    private GameRepository gameRepository;

    @InjectMocks
    private ScheduleService scheduleService;

    private Schedule sched;
    private Game g1, g2;

    @BeforeEach
    void setUp() {
        // a schedule with one existing game
        sched = new Schedule();
        sched.setScheduleID(1);
        sched.setSport("Football");
        sched.setSeason("Fall");

        g1 = new Game();
        g1.setGameID(100);
        // link both sides in-memory
        g1.setSchedule(sched);
        sched.getGameList().add(g1);

        g2 = new Game();
        g2.setGameID(200);
        // leave g2 unlinked for the "add new" test
    }

    @Test
    void save_delegatesToRepository() {
        when(scheduleRepository.save(sched)).thenReturn(sched);

        Schedule result = scheduleService.saveSchedule(sched);

        assertSame(sched, result);
        verify(scheduleRepository).save(sched);
    }

    @Test
    void findAll_delegatesToRepository() {
        when(scheduleRepository.findAll()).thenReturn(of(sched));

        List<Schedule> all = scheduleService.findAllSchedules();

        assertEquals(1, all.size());
        assertSame(sched, all.get(0));
        verify(scheduleRepository).findAll();
    }

    @Test
    void findById_existing() {
        when(scheduleRepository.findById(1)).thenReturn(Optional.of(sched));

        Schedule result = scheduleService.findById(1);

        assertSame(sched, result);
        verify(scheduleRepository).findById(1);
    }

    @Test
    void findById_missing() {
        when(scheduleRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(ObjectNotFoundException.class,
                () -> scheduleService.findById(99),
                "Should throw when schedule ID not found");
        verify(scheduleRepository).findById(99);
    }

    @Test
    void addGames_appendsOnlyNewGamesAndSaves() {
        // schedule exists
        when(scheduleRepository.findById(1)).thenReturn(Optional.of(sched));
        // repository returns both games; g1 is already there, g2 is new
        when(gameRepository.findAllById(of(100, 200))).thenReturn(of(g1, g2));
        // simulate save returning the passed-in schedule
        when(scheduleRepository.save(sched)).thenReturn(sched);

        Schedule updated = scheduleService.addGames(1, of(100, 200));

        // both g1 and g2 should be in the list, but only one copy of g1
        assertEquals(2, updated.getGameList().size());
        assertTrue(updated.getGameList().contains(g1));
        assertTrue(updated.getGameList().contains(g2));

        // check that g2 now has its back-reference set
        assertSame(sched, g2.getSchedule());

        // verify interactions
        verify(scheduleRepository).findById(1);
        verify(gameRepository).findAllById(of(100, 200));
        verify(scheduleRepository).save(sched);
    }

    @Test
    void addGames_whenScheduleMissing_throwsObjectNotFound() {
        when(scheduleRepository.findById(5)).thenReturn(Optional.empty());

        assertThrows(ObjectNotFoundException.class,
                () -> scheduleService.addGames(5, of(1,2)));
        verify(scheduleRepository).findById(5);
        verifyNoMoreInteractions(gameRepository, scheduleRepository);
    }
}
