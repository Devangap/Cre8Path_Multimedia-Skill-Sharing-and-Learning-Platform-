package com.projectPAF.Cre8Path.repository;

import com.projectPAF.Cre8Path.model.Profile;
import com.projectPAF.Cre8Path.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByUser(User user);
    Optional<Profile> findByUsername(String username);
    List<Profile> findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCase(String username, String fullName);
}
