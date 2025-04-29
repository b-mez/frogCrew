package test.java.edu.tcu.cs.frogcrewbackend.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.tcu.cs.frogcrew.FrogCrewBackendApplication;
import edu.tcu.cs.frogcrew.dto.*;
import edu.tcu.cs.frogcrew.model.*;
import edu.tcu.cs.frogcrew.system.Result;
import edu.tcu.cs.frogcrew.system.StatusCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(
        classes = FrogCrewBackendApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = "spring.profiles.active=dev"
)
//@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("dev")
class FullIntegrationTest {

    @LocalServerPort
    int port;

    @Autowired
    TestRestTemplate rest;

    String baseUrl;

    @Autowired
    ObjectMapper mapper;

    @BeforeEach
    void init() {
        baseUrl = "http://localhost:" + port;
    }

//    @Test
//    void smoke() {
//        var resp = rest.getForEntity(baseUrl + "/crew", String.class);
//        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
//    }

    @Test
    void endToEnd_useCases() {
        // UC14: Admin invites a new crew member
//        HttpHeaders adminBasic = new HttpHeaders();
//        adminBasic.setBasicAuth("alice@frogcrew.com", "password1");
//        InviteRequestDto inviteReq = new InviteRequestDto(List.of("charlie@frogcrew.com"));
//        ResponseEntity<InviteResponseDto> inviteResp = rest.exchange(
//                baseUrl + "/invite",
//                HttpMethod.POST,
//                new HttpEntity<>(inviteReq, adminBasic),
//                InviteResponseDto.class
//        );
//        assertThat(inviteResp.getStatusCode()).isEqualTo(HttpStatus.OK);
//        assertThat(inviteResp.getBody().sent()).containsExactly("charlie@frogcrew.com");


        HttpHeaders adminBasic = new HttpHeaders();
//        adminBasic.setBasicAuth("alice@frogcrew.com", "password1");
//        InviteRequestDto inviteReq = new InviteRequestDto(List.of("charlie@frogcrew.com"));
//
//        ResponseEntity<Result> resultResp = rest.exchange(
//                baseUrl + "/invite",
//                HttpMethod.POST,
//                new HttpEntity<>(inviteReq, adminBasic),
//                Result.class
//        );
//
//        assertThat(resultResp.getStatusCode()).isEqualTo(HttpStatus.OK);
//        Result resultBody = resultResp.getBody();
//        assertThat(resultBody).isNotNull();
//        assertThat(resultBody.isFlag()).isTrue();
//        assertThat(resultBody.getCode()).isEqualTo(StatusCode.SUCCESS);
//
//        InviteResponseDto dto = new ObjectMapper()
//                .convertValue(resultBody.getData(), InviteResponseDto.class);
//
//        assertThat(dto.sent()).containsExactly("charlie@frogcrew.com");


        // UC1: Crew member creates profile (public)
        CrewMember newMember = new CrewMember();
        newMember.setCrewMemberID(999);
        newMember.setFirstName("Charlie");
        newMember.setLastName("Brown");
        newMember.setEmail("charlie@frogcrew.com");
        newMember.setPhoneNumber("333-333-3333");
        newMember.setRole(Role.USER);
        newMember.setPassword("password");

//        ResponseEntity<CrewMember> createCrew = rest.postForEntity(
//                baseUrl + "/crew",
//                newMember,
//                CrewMember.class
//        );
//        assertThat(createCrew.getStatusCode()).isEqualTo(HttpStatus.CREATED);
//        int charlieId = createCrew.getBody().getCrewMemberID();

        // 1) post expecting a Result
        ResponseEntity<Result> resp1 = rest.postForEntity(
                baseUrl + "/crew",
                newMember,
                Result.class
        );

        assertThat(resp1.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        // 2) unwrap
        Result resultBody1 = resp1.getBody();
        assertThat(resultBody1).isNotNull();
        assertThat(resultBody1.isFlag()).isTrue();
        assertThat(resultBody1.getCode()).isEqualTo(StatusCode.SUCCESS);

        // 3) extract the data payload as a Map and then read your fields
        @SuppressWarnings("unchecked")
        Map<String,Object> payload1 = (Map<String,Object>) resultBody1.getData();
        Integer charlieId = (Integer) payload1.get("crewMemberID");
        assertThat(charlieId).isEqualTo(3);

        // if you really need a CrewMember instance:
        CrewMember created = mapper.convertValue(payload1, CrewMember.class);
        assertThat(created.getFirstName()).isEqualTo("Charlie");



        // login as Charlie to get JWT (AuthController + JwtProvider)
          HttpHeaders loginHeaders = new HttpHeaders();
          loginHeaders.setBasicAuth("charlie@frogcrew.com", "password3");
//        ResponseEntity<AuthTokenDto> login = rest.exchange(
//                baseUrl + "/auth/login",
//                HttpMethod.POST,
//                new HttpEntity<>(loginHeaders),
//                AuthTokenDto.class
//        );
//        assertThat(login.getStatusCode()).isEqualTo(HttpStatus.OK);
//        String jwt = login.getBody().token();

        // 1) Call expecting a raw Result
        ResponseEntity<Result> resp2 = rest.exchange(
                baseUrl + "/auth/login",
                HttpMethod.POST,
                new HttpEntity<>(loginHeaders),
                Result.class
        );

        assertThat(resp2.getStatusCode()).isEqualTo(HttpStatus.OK);

        Result resultBody2 = resp2.getBody();
        assertThat(resultBody2).isNotNull();
        assertThat(resultBody2.isFlag()).isTrue();
        assertThat(resultBody2.getCode()).isEqualTo(StatusCode.SUCCESS);

// 2) pull the 'data' payload (it comes back as a Map)
        @SuppressWarnings("unchecked")
        Map<String,Object> payload2 = (Map<String,Object>) resultBody2.getData();

// 3) get your JWT
        String jwt = (String) payload2.get("token");
        assertThat(jwt).isNotBlank();



        // prepare Bearer headers for Charlie
        HttpHeaders bearer = new HttpHeaders();
        bearer.setBearerAuth(jwt);

        // UC7: Charlie submits availability
        AvailabilityDto availDto = new AvailabilityDto(charlieId, true, "Available for all games");
        ResponseEntity<Availability> availResp = rest.exchange(
                baseUrl + "/availability",
                HttpMethod.POST,
                new HttpEntity<>(availDto, bearer),
                Availability.class
        );
        assertThat(availResp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(availResp.getBody().getCrewMember().getCrewMemberID()).isEqualTo(charlieId);

        // UC16: Admin views crew members list
        ResponseEntity<CrewMember[]> crewList = rest.exchange(
                baseUrl + "/crew",
                HttpMethod.GET,
                new HttpEntity<>(adminBasic),
                CrewMember[].class
        );
        assertThat(crewList.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(crewList.getBody()).extracting("email")
                .contains("alice@frogcrew.com", "bob@frogcrew.com", "charlie@frogcrew.com");

        // UC18: Admin creates a game schedule
        Schedule createSched = new Schedule();
        createSched.setScheduleID(10);
        createSched.setSport("Football");
        createSched.setSeason("Fall 2025");
        ResponseEntity<Schedule> schedResp = rest.exchange(
                baseUrl + "/schedule",
                HttpMethod.POST,
                new HttpEntity<>(createSched, adminBasic),
                Schedule.class
        );
        assertThat(schedResp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        int scheduleId = schedResp.getBody().getScheduleID();

        // UC20: Admin adds games to schedule
        GameDto gameDto = new GameDto(100, scheduleId,
                LocalDate.of(2025,10,12),
                LocalTime.of(15,0),
                "Stadium","Bears", List.of());
        ResponseEntity<Game> gameResp = rest.exchange(
                baseUrl + "/game",
                HttpMethod.POST,
                new HttpEntity<>(gameDto, adminBasic),
                Game.class
        );
        assertThat(gameResp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        int gameId = gameResp.getBody().getGameID();

        ResponseEntity<Schedule> updatedSched = rest.exchange(
                baseUrl + "/schedule/" + scheduleId,
                HttpMethod.PUT,
                new HttpEntity<>(List.of(gameId), adminBasic),
                Schedule.class
        );
        assertThat(updatedSched.getBody().getGameList()).extracting("gameID").contains(gameId);

        // UC23: Admin schedules crew onto that game
        ResponseEntity<Game> crewed = rest.exchange(
                baseUrl + "/crewSchedule/" + gameId,
                HttpMethod.PUT,
                new HttpEntity<>(List.of(charlieId), adminBasic),
                Game.class
        );
        assertThat(crewed.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(crewed.getBody().getCrewListIDs()).contains(charlieId);

        // UC5: Charlie views general game schedule
        ResponseEntity<Schedule[]> general = rest.exchange(
                baseUrl + "/schedule",
                HttpMethod.GET,
                new HttpEntity<>(bearer),
                Schedule[].class
        );
        assertThat(general.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(general.getBody()).isNotEmpty();

        // UC6: Charlie (USER) views crew list for the game
        ResponseEntity<CrewMember[]> crewForGame = rest.exchange(
                baseUrl + "/crewSchedule/" + gameId,
                HttpMethod.GET,
                new HttpEntity<>(bearer),
                CrewMember[].class
        );
        assertThat(crewForGame.getBody()).extracting("crewMemberID").contains(charlieId);

        // UC3: Charlie views another crew member’s profile
        ResponseEntity<CrewMember> viewAlice = rest.exchange(
                baseUrl + "/crew/" + 123,  // Alice’s seeded ID
                HttpMethod.GET,
                new HttpEntity<>(bearer),
                CrewMember.class
        );
        assertThat(viewAlice.getBody().getEmail()).isEqualTo("alice@frogcrew.com");

        // UC15: Admin deletes a crew member
        ResponseEntity<Void> delete = rest.exchange(
                baseUrl + "/crew/" + charlieId,
                HttpMethod.DELETE,
                new HttpEntity<>(adminBasic),
                Void.class
        );
        assertThat(delete.getStatusCode()).isEqualTo(HttpStatus.OK);
        // verify 404
        ResponseEntity<CrewMember> notFound = rest.exchange(
                baseUrl + "/crew/" + charlieId,
                HttpMethod.GET,
                new HttpEntity<>(bearer),
                CrewMember.class
        );
        assertThat(notFound.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
