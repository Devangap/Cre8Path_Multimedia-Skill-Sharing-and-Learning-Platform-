package com.projectPAF.Cre8Path.controller;

import com.projectPAF.Cre8Path.model.Profile;
import com.projectPAF.Cre8Path.service.ProfileService;
import com.projectPAF.Cre8Path.Repository.UserRepository;
import com.projectPAF.Cre8Path.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createProfile(
            @RequestParam("username") String username,
            @RequestParam("fullName") String fullName,
            @RequestParam("bio") String bio,
            @RequestParam("location") String location,
            @RequestParam("website") String website,
            @RequestParam("skills") String skillsJson,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture,
            Principal principal
    ) {
        if (principal == null || principal.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        String email = principal.getName(); // ✅ Works for both OAuth2 and email/password

        // 🔍 Confirm user exists (optional)
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        try {
            Profile profile = profileService.createProfile(
                    username, fullName, bio, location, website, skillsJson, profilePicture, email
            );
            return ResponseEntity.ok("✅ Profile created for: " + profile.getUsername());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }
}
