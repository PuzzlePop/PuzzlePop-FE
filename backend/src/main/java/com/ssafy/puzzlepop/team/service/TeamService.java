package com.ssafy.puzzlepop.team.service;

import com.ssafy.puzzlepop.team.domain.Team;
import com.ssafy.puzzlepop.team.exception.TeamNotFoundException;
import com.ssafy.puzzlepop.team.repository.TeamRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TeamService {
    private final TeamRepository teamRepository;

    public List<Team> getAllTeam() {
        return teamRepository.findAll();
    }

    public Team getTeamById(Long teamId) {
        return teamRepository.findById(teamId).orElseThrow(() -> new TeamNotFoundException("Team not found with id: " + teamId));
    }

    public Team createTeam(Team team) {
        return teamRepository.save(team);
    }

    public void updateTeam(Team team) {

    }

    public void deleteTeam(Long teamId) {
        teamRepository.delete(getTeamById(teamId));
    }
}
