package main.java.edu.tcu.cs.frogcrew.system;

import edu.tcu.cs.frogcrew.model.*;
import edu.tcu.cs.frogcrew.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
@Profile("dev")
public class DBDataInitializer implements CommandLineRunner {

    private final CrewMemberRepository crewRepo;
    private final ScheduleRepository scheduleRepo;
    private final GameRepository gameRepo;
    private final AvailabilityRepository availRepo;

    public DBDataInitializer(
            CrewMemberRepository crewRepo,
            ScheduleRepository scheduleRepo,
            GameRepository gameRepo,
            AvailabilityRepository availRepo
    ) {
        this.crewRepo = crewRepo;
        this.scheduleRepo = scheduleRepo;
        this.gameRepo = gameRepo;
        this.availRepo = availRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        // Crew Members
        CrewMember c1 = new CrewMember();
        c1.setFirstName("Alice");
        c1.setLastName("Smith");
        c1.setEmail("alice@frogcrew.com");
        c1.setPhoneNumber("111-111-1111");
        c1.setPassword("password1"); // hash it
        c1.setRole(Role.ADMIN);
        crewRepo.save(c1);

        CrewMember c2 = new CrewMember();
        c2.setFirstName("Bob");
        c2.setLastName("Jones");
        c2.setEmail("bob@frogcrew.com");
        c2.setPhoneNumber("222-222-2222");
        c2.setPassword("password2");
        c2.setRole(Role.USER);
        crewRepo.save(c2);

        // Fall Schedule with two Games (cascade persists games)
        Schedule fall = new Schedule();
        fall.setSeason("Fall");
        fall.setSport("Football");

        Game fg1 = new Game();
        fg1.setGameDate(LocalDate.of(2025, 10, 12));
        fg1.setGameTime(LocalTime.of(15, 0));
        fg1.setOpponent("Baylor");
        fg1.setVenue("Amon G Carter");
        fg1.setSchedule(fall);
        fall.getGameList().add(fg1);

        Game fg2 = new Game();
        fg2.setGameDate(LocalDate.of(2025, 10, 19));
        fg2.setGameTime(LocalTime.of(19, 0));
        fg2.setOpponent("Texas");
        fg2.setVenue("Amon G Carter");
        fg2.setSchedule(fall);
        fall.getGameList().add(fg2);

        // Persist the schedule and its games
        scheduleRepo.save(fall);

        // Spring Schedule with one Game
        Schedule spring = new Schedule();
        spring.setSeason("Spring");
        spring.setSport("Baseball");

        Game sg1 = new Game();
        sg1.setGameDate(LocalDate.of(2026, 3, 1));
        sg1.setGameTime(LocalTime.of(19, 0));
        sg1.setOpponent("Texas");
        sg1.setVenue("Lupton");
        sg1.setSchedule(spring);
        spring.getGameList().add(sg1);

        scheduleRepo.save(spring);

        // Availability for Alice and Bob
        Availability a1 = new Availability();
        a1.setCrewMember(c1);
        a1.setAvailable(true);
        a1.setComment("Available for all Fall games");
        availRepo.save(a1);

        Availability a2 = new Availability();
        a2.setCrewMember(c2);
        a2.setAvailable(false);
        a2.setComment("Unavailable for Spring season");
        availRepo.save(a2);
    }

}