package com.projectPAF.Cre8Path.controller;

import com.projectPAF.Cre8Path.model.Learningp;
import com.projectPAF.Cre8Path.service.LearningpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learningp")
public class LearningpController {

    @Autowired
    private LearningpService service;

    @PostMapping
    public Learningp createLearningp(@RequestBody Learningp learningp) {
        return service.createLearningp(learningp);
    }

    @GetMapping
    public List<Learningp> getAllLearningp() {
        return service.getAllLearningp();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Learningp> getLearningpById(@PathVariable Long id) {
        return service.getLearningpById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Learningp> updateLearningp(@PathVariable Long id, @RequestBody Learningp learningp) {
        return service.updateLearningp(id, learningp);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningp(@PathVariable Long id) {
        return service.deleteLearningp(id);
    }
}