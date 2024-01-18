package com.ssafy.puzzlepop.team.repository;

import com.ssafy.puzzlepop.team.domain.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
}
