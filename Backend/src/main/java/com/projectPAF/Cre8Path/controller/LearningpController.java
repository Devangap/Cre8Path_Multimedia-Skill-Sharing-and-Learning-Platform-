package com.projectPAF.Cre8Path.controller;

import com.projectPAF.Cre8Path.model.Learningp;
import com.projectPAF.Cre8Path.model.User;
import com.projectPAF.Cre8Path.repository.UserRepository;
import com.projectPAF.Cre8Path.service.LearningpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/learningp")
public class LearningpController {

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

        if (principal instanceof org.springframework.security.oauth2.core.user.OAuth2User oauthUser) {
            // DEBUG: Print attributes to console
            System.out.println("OAuth2 attributes: " + oauthUser.getAttributes());

            // Try all common keys
            email = oauthUser.getAttribute("email");
            if (email == null) {
                email = oauthUser.getAttribute("preferred_username"); // fallback for some providers
            }
            if (email == null) {
                email = oauthUser.getAttribute("login"); // fallback for GitHub
            }
        } else if (principal instanceof org.springframework.security.core.userdetails.User user) {
            email = user.getUsername(); // For form-based login
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

        // Set the authenticated user
        learningp.setUser(user);

        try {
            Learningp saved = service.createLearningp(learningp);
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
        return service.getLearningpById(id);
    }

    @GetMapping("/user-learningp")
    public ResponseEntity<List<Learningp>> getLearningpByUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        String email = principal.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(service.getLearningpByUser(user));
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
