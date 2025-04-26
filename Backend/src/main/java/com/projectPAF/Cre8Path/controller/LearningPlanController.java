package com.projectPAF.Cre8Path.controller;

import com.projectPAF.Cre8Path.model.LearningPlan;
import com.projectPAF.Cre8Path.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
// "REST API" means the API follows rules like HTTP methods, clean URLs, JSON responses, and meaningful HTTP codes

// this controller has 5 APIs --> POST | GET | PUT | DELETE | get all
// spring web annotations

// @RestController --> Marks this class as a REST API controller
// @RequestMapping --> All URLs in this controller will start with/learning-plans
@RestController
@RequestMapping("/learning-plans")

// ResponseEntity --> HTTP response handling
// The controller uses this service to handle business logic
public class LearningPlanController {
    @Autowired
    private LearningPlanService learningPlanService;

    // POST a learning plan
    @PostMapping
    public ResponseEntity<LearningPlan> createLearningPlan(@RequestBody LearningPlan learningPlan) {
        return ResponseEntity.status(HttpStatus.CREATED).body(learningPlanService.createLearningPlan(learningPlan));
    }

    // GET a single learning plan
    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getLearningPlan(@PathVariable Long id) {
        return learningPlanService.getLearningPlan(id);
    }

    // UPDATE a learning plan
    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updateLearningPlan(@PathVariable Long id, @RequestBody LearningPlan learningPlan) {
        return ResponseEntity.ok(learningPlanService.updateLearningPlan(id, learningPlan));
    }

    // DELETE a learning plan
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable Long id) {
        learningPlanService.deleteLearningPlan(id);
        return ResponseEntity.noContent().build();
    }

    // GET all learning plans
    @GetMapping
    public ResponseEntity<List<LearningPlan>> getAllLearningPlans() {
        return ResponseEntity.ok(learningPlanService.getAllLearningPlans());
    }
}
