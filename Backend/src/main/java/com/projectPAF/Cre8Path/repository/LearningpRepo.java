package com.projectPAF.Cre8Path.repository;

import com.projectPAF.Cre8Path.model.Learningp;
import com.projectPAF.Cre8Path.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LearningpRepo extends JpaRepository<Learningp, Long> {
    List<Learningp> findByUser(User user);
}