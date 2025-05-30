package com.projectPAF.Cre8Path.service;

import com.projectPAF.Cre8Path.model.Learningp;
import com.projectPAF.Cre8Path.model.User;
import com.projectPAF.Cre8Path.repository.LearningpRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LearningpService {

    @Autowired
    private LearningpRepo repository;

    public Learningp createLearningp(Learningp learningp) {
        return repository.save(learningp); // Save the learning progress with the authenticated user
    }

    public List<Learningp> getAllLearningp() {
        return repository.findAll();
    }

    public ResponseEntity<Learningp> getLearningpById(Long id) {
        Optional<Learningp> learningp = repository.findById(id);
        return learningp.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Learningp> updateLearningp(Long id, Learningp updatedLearningp) {
        Optional<Learningp> existingPlan = repository.findById(id);
        if (existingPlan.isPresent()) {
            updatedLearningp.setId(id); // Ensure the ID is set correctly
            return ResponseEntity.ok(repository.save(updatedLearningp));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<Void> deleteLearningp(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public List<Learningp> getLearningpByUser(User user) {
        return repository.findByUser(user); // Fetch learning progress related to the user
    }
}
