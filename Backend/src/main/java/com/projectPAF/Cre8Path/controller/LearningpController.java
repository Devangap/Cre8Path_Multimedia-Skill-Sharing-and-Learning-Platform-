package com.projectPAF.Cre8Path.controller;

import com.projectPAF.Cre8Path.model.Learningp;
import com.projectPAF.Cre8Path.model.User;
import com.projectPAF.Cre8Path.repository.LearningpRepo;
import com.projectPAF.Cre8Path.repository.UserRepository;
import com.projectPAF.Cre8Path.service.LearningpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/learningp")
public class LearningpController {

    @Autowired
    private LearningpRepo repository;

    @Autowired
    private LearningpService service;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createLearningp(
            @AuthenticationPrincipal Object principal,
            @RequestBody Learningp learningp
    ) {
        Map<String, String> response = new HashMap<>();

        if (principal == null) {
            response.put("error", "User not authenticated.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String email = null;

        // Retrieve user email based on authentication method
        if (principal instanceof OAuth2User oauthUser) {
            email = oauthUser.getAttribute("email");
        } else if (principal instanceof org.springframework.security.core.userdetails.User user) {
            email = user.getUsername(); // For email/password login
        }

        if (email == null) {
            response.put("error", "Email not found in authentication principal.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        // Find or create user
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            userRepository.save(user);
        }

        learningp.setUser(user); // Set the authenticated user

        try {
            Learningp saved = service.createLearningp(learningp); // Ensure the service layer is updated for new fields
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            response.put("error", "Failed to create learning progress: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping
    public List<Learningp> getAllLearningp() {
        return service.getAllLearningp();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Learningp> getLearningpById(@PathVariable Long id) {
        Optional<Learningp> learningp = repository.findById(id);
        return learningp.map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user-learningp")
    public ResponseEntity<List<Learningp>> getLearningpByUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = principal.getName();
        User user = userRepository.findByEmail(email)
                                  .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(service.getLearningpByUser(user)); // Fetch only the learning progress data of the logged-in user
    }

    @PutMapping("/{id}")
    public ResponseEntity<Learningp> updateLearningp(@PathVariable Long id, @RequestBody Learningp learningp) {
        Optional<Learningp> existingPlan = repository.findById(id);
        if (existingPlan.isPresent()) {
            Learningp existingLearningp = existingPlan.get();

            // Preserve the user field from the existing record
            learningp.setUser(existingLearningp.getUser());
            learningp.setId(id); // Ensure the ID is set correctly

            Learningp updatedLearningp = repository.save(learningp);
            return ResponseEntity.ok(updatedLearningp);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningp(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
