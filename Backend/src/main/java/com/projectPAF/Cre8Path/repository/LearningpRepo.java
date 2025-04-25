package com.projectPAF.Cre8Path.repository;

import com.projectPAF.Cre8Path.model.Learningp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LearningpRepo extends JpaRepository<Learningp, Long> {
}