package test.java.edu.tcu.cs.frogcrewbackend.service;

import edu.tcu.cs.frogcrew.model.Game;
import edu.tcu.cs.frogcrew.model.Schedule;
import edu.tcu.cs.frogcrew.repository.GameRepository;
import edu.tcu.cs.frogcrew.system.exception.ObjectNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GameServiceTest {

    @Mock
    private GameRepository gameRepository;

    @InjectMocks
    private GameService gameService;

    private Game g1, g2;

    @BeforeEach
    void setUp() {
        Schedule fall = new Schedule();
        fall.setScheduleID(1);
        fall.setSport("Football");
        fall.setSeason("Fall");

        Schedule spring = new Schedule();
        fall.setScheduleID(2);
        fall.setSport("Baseball");
        fall.setSeason("Spring");

        g1 = new Game();
        g1.setGameID(1);
        g1.setGameDate(LocalDate.of(2025, 10, 12));
        g1.setGameTime(LocalTime.of(15, 0));
        g1.setOpponent("Baylor");
        g1.setVenue("Amon G Carter");
        g1.setSchedule(fall);
        fall.getGameList().add(g1);

        g2 = new Game();
        g2.setGameID(2);
        g2.setGameDate(LocalDate.of(2025, 10, 19));
        g2.setGameTime(LocalTime.of(19, 0));
        g2.setOpponent("Texas");
        g2.setVenue("Amon G Carter");
        g2.setSchedule(spring);
        fall.getGameList().add(g2);
    }

    @Test
    void findAll_returnsAllGames() {
        given(gameRepository.findAll()).willReturn(List.of(g1, g2));

        List<Game> result = gameService.findAll();

        assertEquals(2, result.size());
        assertSame(g1, result.get(0));
        assertSame(g2, result.get(1));
        verify(gameRepository).findAll();
    }

    @Test
    void findById_existingId() {
        given(gameRepository.findById(1)).willReturn(Optional.of(g1));

        Game result = gameService.findById(1);

        assertEquals(1, result.getGameID());
        assertEquals("Baylor", result.getOpponent());
        verify(gameRepository).findById(1);
    }

    @Test
    void findById_nonExistingId() {
        given(gameRepository.findById(99)).willReturn(Optional.empty());

        assertThrows(
                ObjectNotFoundException.class,
                () -> gameService.findById(99),
                "Expected findById(99) to throw, but it didn't"
        );
        verify(gameRepository).findById(99);
    }

    @Test
    void save_callsRepositoryAndReturnsSaved() {
        given(gameRepository.save(g1)).willReturn(g1);

        Game result = gameService.save(g1);

        assertSame(g1, result);
        verify(gameRepository).save(g1);
    }

    @Test
    void getGamesBySchedule() {
        // given
        given(gameRepository.findBySchedule_ScheduleID(42)).willReturn(List.of(g1, g2));

        // when
        List<Game> result = gameService.getGamesBySchedule(42);

        // then
        assertEquals(2, result.size());
        verify(gameRepository).findBySchedule_ScheduleID(42);
    }

    @Test
    void getGamesForCrewMember() {
        // given
        given(gameRepository.findByCrewMemberId(99)).willReturn(List.of(g2));

        // when
        List<Game> result = gameService.getGamesForCrewMember(99);

        // then
        assertEquals(1, result.size());
        assertSame(g2, result.get(0));
        verify(gameRepository).findByCrewMemberId(99);
    }


}
