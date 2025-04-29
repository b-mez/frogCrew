package main.java.edu.tcu.cs.frogcrew.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.io.Serializable;
import java.util.List;

@Entity
//@Table(name = "crew_member")
public class CrewMember implements Serializable {

    @Id
    @Column(name = "crew_member_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer crewMemberID;

    @NotBlank
    @Column(nullable = false)
    private String firstName;

    @NotBlank
    @Column(nullable = false)
    private String lastName;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @Pattern(regexp = "\\d{3}-\\d{3}-\\d{4}")
    @Column(nullable = false)
    private String phoneNumber;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Role role;  // consider converting to an enum

    // bi‑directional link if you need to navigate back from Game → CrewMember
    @ManyToMany(mappedBy = "crewList")
    private List<Game> assignedGames;

    public CrewMember() {
    }

    public Integer getCrewMemberID() {
        return crewMemberID;
    }

    public void setCrewMemberID(Integer crewMemberID) {
        this.crewMemberID = crewMemberID;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public List<Game> getAssignedGames() {
        return assignedGames;
    }

    public void setAssignedGames(List<Game> assignedGames) {
        this.assignedGames = assignedGames;
    }
}