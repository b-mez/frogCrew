package test.java.edu.tcu.cs.frogcrewbackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.tcu.cs.frogcrew.model.CrewMember;
import edu.tcu.cs.frogcrew.model.Role;
import edu.tcu.cs.frogcrew.service.CrewMemberService;
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

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

//@SpringBootTest(
//        classes = edu.tcu.cs.frogcrew.FrogCrewBackendApplication.class,
//        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
//)
@WebMvcTest(CrewMemberController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("dev")
class CrewMemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CrewMemberService service;

    private final ObjectMapper mapper = new ObjectMapper();

    private CrewMember c1;

    @BeforeEach
    void setUp() {
        c1 = new CrewMember();
        c1.setCrewMemberID(1);
        c1.setFirstName("Alice");
        c1.setLastName("Smith");
        c1.setEmail("alice@frogcrew.com");
        c1.setPhoneNumber("111-111-1111");
        c1.setRole(Role.USER);
        c1.setPassword("password");
    }

    @Test
    void createCrewMember_returnsCreated() throws Exception {
        given(service.saveCrewMember(any(CrewMember.class))).willReturn(c1);

        mockMvc.perform(post("/crew")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(c1)))
                .andExpect(status().isCreated())
                // notice the extra "data"
                .andExpect(jsonPath("$.data.crewMemberID").value(1))
                .andExpect(jsonPath("$.data.email").value("alice@frogcrew.com"));

        verify(service).saveCrewMember(any(CrewMember.class));
    }

    @Test
    void getAllCrewMembers_returnsList() throws Exception {
        given(service.getAllCrewMembers()).willReturn(List.of(c1));

        mockMvc.perform(get("/crew"))
                .andExpect(status().isOk())
                // data is now a list under the envelope
                .andExpect(jsonPath("$.data[0].crewMemberID").value(1))
                .andExpect(jsonPath("$.data[0].firstName").value("Alice"));

        verify(service).getAllCrewMembers();
    }

    @Test
    void getCrewMember_returnsMember() throws Exception {
        given(service.getById(1)).willReturn(c1);

        mockMvc.perform(get("/crew/{id}", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.firstName").value("Alice"))
                .andExpect(jsonPath("$.data.role").value("USER"));

        verify(service).getById(1);
    }

    @Test
    void getCrewMember_notFound() throws Exception {
        when(service.getById(99))
                .thenThrow(new ObjectNotFoundException("CrewMember", 99));

        mockMvc.perform(get("/crew/{id}", 99))
                .andExpect(status().isNotFound());

        verify(service).getById(99);
    }

    @Test
    void deleteCrewMember() throws Exception {
        doNothing().when(service).delete(1);

        mockMvc.perform(delete("/crew/{id}", 1))
                .andExpect(status().isOk());

        verify(service).delete(1);
    }

    @Test
    void deleteCrewMember_notFound() throws Exception {
        doThrow(new ObjectNotFoundException("CrewMember", 2))
                .when(service).delete(2);

        mockMvc.perform(delete("/crew/{id}", 2))
                .andExpect(status().isNotFound());

        verify(service).delete(2);
    }
}