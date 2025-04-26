package com.projectPAF.Cre8Path.service;

import com.projectPAF.Cre8Path.model.LearningPlan;
import com.projectPAF.Cre8Path.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository repository;

    public LearningPlan createLearningPlan(LearningPlan learningPlan) {
        return repository.save(learningPlan);
    }

    public List<LearningPlan> getAllLearningPlans() {
        return repository.findAll();
    }

    public ResponseEntity<LearningPlan> getLearningPlan(Long id) {
        Optional<LearningPlan> learningPlan = repository.findById(id);
        return learningPlan.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<LearningPlan> updateLearningPlan(Long id, LearningPlan updatedLearningPlan) {
        if (repository.existsById(id)) {
            updatedLearningPlan.setId(id);
            return ResponseEntity.ok(repository.save(updatedLearningPlan));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<Void> deleteLearningPlan(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
