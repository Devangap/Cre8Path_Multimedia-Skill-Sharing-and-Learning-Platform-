package com.projectPAF.Cre8Path.repository;

import com.projectPAF.Cre8Path.model.Follow;
import com.projectPAF.Cre8Path.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    boolean existsByFollowerAndFollowing(Profile follower, Profile following);
    Optional<Follow> findByFollowerAndFollowing(Profile follower, Profile following);
    long countByFollowing(Profile profile);
    long countByFollower(Profile profile);
}
