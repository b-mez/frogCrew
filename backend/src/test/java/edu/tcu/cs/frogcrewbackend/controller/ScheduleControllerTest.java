package test.java.edu.tcu.cs.frogcrewbackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.tcu.cs.frogcrew.model.Schedule;
import edu.tcu.cs.frogcrew.service.ScheduleService;
import edu.tcu.cs.frogcrew.system.exception.ObjectNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static java.util.List.of;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

//@WebMvcTest(ScheduleController.class)
//@ActiveProfiles("dev")
//@ExtendWith(org.springframework.test.context.junit.jupiter.SpringExtension.class)
//@SpringBootTest(
//        classes = edu.tcu.cs.frogcrew.FrogCrewBackendApplication.class,
//        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
//)
@WebMvcTest(ScheduleController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("dev")
class ScheduleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ScheduleService scheduleService;

    @Autowired
    private ObjectMapper mapper;

    private Schedule sched;

    @BeforeEach
    void setUp() {
        sched = new Schedule();
        sched.setScheduleID(1);
        sched.setSport("Football");
        sched.setSeason("Fall");
    }

    @Test
    void createSchedule_returnsCreatedAndBody() throws Exception {
        given(scheduleService.saveSchedule(any(Schedule.class))).willReturn(sched);

        mockMvc.perform(post("/schedule")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(sched)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.scheduleID").value(1))
                .andExpect(jsonPath("$.data.sport").value("Football"))
                .andExpect(jsonPath("$.data.season").value("Fall"));

        verify(scheduleService).saveSchedule(any(Schedule.class));
    }

    @Test
    void findAllSchedules_returnsList() throws Exception {
        given(scheduleService.findAllSchedules()).willReturn(of(sched));

        mockMvc.perform(get("/schedule"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].scheduleID").value(1))
                .andExpect(jsonPath("$.data[0].sport").value("Football"));

        verify(scheduleService).findAllSchedules();
    }

    @Test
    void getSchedule_existing_returnsSchedule() throws Exception {
        given(scheduleService.findById(1)).willReturn(sched);

        mockMvc.perform(get("/schedule/{id}", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.season").value("Fall"));

        verify(scheduleService).findById(1);
    }

    @Test
    void getSchedule_missing_returns404() throws Exception {
        given(scheduleService.findById(99))
                .willThrow(new ObjectNotFoundException("Schedule", 99));

        mockMvc.perform(get("/schedule/{id}", 99))
                .andExpect(status().isNotFound());

        verify(scheduleService).findById(99);
    }

    @Test
    void addGames_appendsAndReturnsUpdatedSchedule() throws Exception {
        // imagine we append gameIds [10,20] and get back the same sched
        given(scheduleService.addGames(eq(1), anyList())).willReturn(sched);

        // send a JSON array of ints as the request body
        mockMvc.perform(put("/schedule/{id}", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(of(10, 20))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.scheduleID").value(1));

        verify(scheduleService).addGames(1, of(10, 20));
    }
}