package com.projectPAF.Cre8Path.service;

import com.projectPAF.Cre8Path.model.LearningPlan;
import com.projectPAF.Cre8Path.model.User;
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
        Optional<LearningPlan> existingPlanOptional = repository.findById(id);

        if (existingPlanOptional.isPresent()) {
            LearningPlan existingPlan = existingPlanOptional.get();

            // Update the new fields
            existingPlan.setTitle(updatedLearningPlan.getTitle());
            existingPlan.setObjective(updatedLearningPlan.getObjective());
            existingPlan.setTopics(updatedLearningPlan.getTopics());
            existingPlan.setEstimatedDuration(updatedLearningPlan.getEstimatedDuration());
            existingPlan.setResources(updatedLearningPlan.getResources());
            existingPlan.setVisibility(updatedLearningPlan.getVisibility());
            // Do not change user or createdAt

            return ResponseEntity.ok(repository.save(existingPlan));
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

    public List<LearningPlan> getLearningPlansByUser(User user) {
        return repository.findByUser(user);
    }
}
