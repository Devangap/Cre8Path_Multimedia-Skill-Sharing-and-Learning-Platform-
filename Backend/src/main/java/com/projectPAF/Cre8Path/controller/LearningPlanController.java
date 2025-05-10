package com.projectPAF.Cre8Path.controller;

import com.projectPAF.Cre8Path.model.LearningPlan;
import com.projectPAF.Cre8Path.model.User;
import com.projectPAF.Cre8Path.repository.UserRepository;
import com.projectPAF.Cre8Path.service.LearningPlanService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/learning-plans")
public class LearningPlanController {

    private static final Logger logger = LoggerFactory.getLogger(LearningPlanController.class);

    @Autowired
    private LearningPlanService learningPlanService;

    @Autowired
    private UserRepository userRepository;

    // Create a Learning Plan
    @PostMapping
    public ResponseEntity<?> createLearningPlan(
            @AuthenticationPrincipal Object principal,
            @RequestBody LearningPlan learningPlan
    ) {
        Map<String, String> response = new HashMap<>();

        if (principal == null) {
            response.put("error", "User not authenticated.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String email = null;

        if (principal instanceof OAuth2User oauthUser) {
            email = oauthUser.getAttribute("email");
        } else if (principal instanceof org.springframework.security.core.userdetails.User user) {
            email = user.getUsername(); // For email/password login
        }

        if (email == null) {
            response.put("error", "Email not found in authentication principal.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            userRepository.save(user);
        }

        learningPlan.setUser(user);
        learningPlan.setCreatedAt(LocalDateTime.now());

        try {
            LearningPlan savedPlan = learningPlanService.createLearningPlan(learningPlan);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPlan);
        } catch (Exception e) {
            response.put("error", "Failed to create learning plan: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get a single Learning Plan
    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getLearningPlan(@PathVariable Long id) {
        return learningPlanService.getLearningPlan(id);
    }

    // Update a Learning Plan
    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updateLearningPlan(@PathVariable Long id, @RequestBody LearningPlan updatedPlan) {
        return learningPlanService.updateLearningPlan(id, updatedPlan);
    }

    // Delete a Learning Plan
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteLearningPlan(@PathVariable Long id) {
        learningPlanService.deleteLearningPlan(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Learning plan with ID " + id + " deleted successfully.");
        return ResponseEntity.ok(response);
    }

    // Get All Learning Plans
    @GetMapping
    public ResponseEntity<List<LearningPlan>> getAllLearningPlans() {
        return ResponseEntity.ok(learningPlanService.getAllLearningPlans());
    }

    // Get Current Logged-in User's Plans
    @GetMapping("/my-plans")
    public ResponseEntity<?> getMyLearningPlans(@AuthenticationPrincipal Object principal) {
        Map<String, String> response = new HashMap<>();

        if (principal == null) {
            response.put("error", "Unauthorized access. Please log in.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String email = null;

        if (principal instanceof OAuth2User oauthUser) {
            email = oauthUser.getAttribute("email");
        } else if (principal instanceof org.springframework.security.core.userdetails.User user) {
            email = user.getUsername();
        }

        if (email == null) {
            response.put("error", "Email not found in authentication principal.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            response.put("error", "User not found in the system.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        List<LearningPlan> myPlans = learningPlanService.getLearningPlansByUser(user);
        return ResponseEntity.ok(myPlans);
    }
}
