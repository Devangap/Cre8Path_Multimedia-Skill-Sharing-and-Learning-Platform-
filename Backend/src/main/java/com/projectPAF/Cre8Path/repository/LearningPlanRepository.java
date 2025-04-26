package com.projectPAF.Cre8Path.repository;

import com.projectPAF.Cre8Path.model.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {
}
