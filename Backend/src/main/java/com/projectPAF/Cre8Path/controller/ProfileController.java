package com.projectPAF.Cre8Path.controller;

import com.projectPAF.Cre8Path.model.Profile;
import com.projectPAF.Cre8Path.model.ProfileDTO;
import com.projectPAF.Cre8Path.service.ProfileService;
import com.projectPAF.Cre8Path.repository.UserRepository;
import com.projectPAF.Cre8Path.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
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
            @AuthenticationPrincipal OAuth2User oauth2User,
            Principal principal
    ) {
        String email = null;

        if (oauth2User != null) {
            email = oauth2User.getAttribute("email");
        } else if (principal != null) {
            email = principal.getName();
        }

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

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

    @GetMapping("/{username}")
    public ResponseEntity<?> getProfileByUsername(@PathVariable String username) {
        Optional<Profile> optionalProfile = profileService.getProfileByUsername(username);

        if (optionalProfile.isPresent()) {
            Profile profile = optionalProfile.get();
            ProfileDTO profileDTO = new ProfileDTO();
            profileDTO.setUsername(profile.getUsername());
            profileDTO.setFullName(profile.getFullName());
            profileDTO.setBio(profile.getBio());
            profileDTO.setSkills(profile.getSkills());
            profileDTO.setProfilePictureUrl(profile.getProfilePictureUrl());
            profileDTO.setLocation(profile.getLocation());
            profileDTO.setWebsite(profile.getWebsite());

            return ResponseEntity.ok(profileDTO); // ✅ Send DTO not Entity
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile not found");
        }
    }
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal OAuth2User oauth2User, Principal principal) {
        System.out.println("🔍 /me endpoint called"); // <-- ADD THIS
        String email = null;

        if (oauth2User != null) {
            email = oauth2User.getAttribute("email");
            System.out.println("OAuth2 Email: " + email); // <-- ADD THIS
        } else if (principal != null) {
            email = principal.getName();
            System.out.println("Principal Email: " + email); // <-- ADD THIS
        }

        if (email == null) {
            System.out.println("❌ No email found!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            System.out.println("❌ User not found for email: " + email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        Optional<Profile> optionalProfile = profileService.getProfileByUser(optionalUser.get());
        if (optionalProfile.isEmpty()) {
            System.out.println("❌ Profile not found for user: " + optionalUser.get().getEmail());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile not found");
        }

        Profile profile = optionalProfile.get();
        System.out.println("✅ Profile found for: " + profile.getUsername());

        ProfileDTO profileDTO = new ProfileDTO();
        profileDTO.setUsername(profile.getUsername());
        profileDTO.setFullName(profile.getFullName());
        profileDTO.setBio(profile.getBio());
        profileDTO.setSkills(profile.getSkills());
        profileDTO.setProfilePictureUrl(profile.getProfilePictureUrl());
        profileDTO.setLocation(profile.getLocation());
        profileDTO.setWebsite(profile.getWebsite());

        return ResponseEntity.ok(profileDTO);
    }


}
