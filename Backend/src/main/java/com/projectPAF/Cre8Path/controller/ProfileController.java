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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
            System.out.println("Facebook OAuth2 User attributes: " + oauth2User.getAttributes());
            email = oauth2User.getAttribute("email");
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Facebook login did not return an email address.");
            }

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
    @PutMapping(value = "/update", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateProfile(
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
        String email = (oauth2User != null) ? oauth2User.getAttribute("email") : principal.getName();

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        try {
            Profile updatedProfile = profileService.updateProfile(
                    optionalUser.get(),
                    username,
                    fullName,
                    bio,
                    location,
                    website,
                    skillsJson,
                    profilePicture
            );

            // You can return the updated profile if you want, or just a success message
            Map<String, String> response = new HashMap<>();
            response.put("message", "✅ Profile updated successfully!");
            response.put("newUsername", updatedProfile.getUsername()); // 👈 Optional: Return new username if changed

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating profile: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, String>> deleteProfile(
            @AuthenticationPrincipal OAuth2User oauth2User,
            Principal principal,
            @RequestBody(required = false) String dummyBody
    ) {
        Map<String, String> response = new HashMap<>();

        String email = (oauth2User != null) ? oauth2User.getAttribute("email") : principal.getName();

        if (email == null) {
            response.put("error", "User not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            response.put("error", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        try {
            profileService.deleteProfile(optionalUser.get());  // Call the service to delete the profile and user
            response.put("message", "✅ Profile and user deleted successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProfiles(@RequestParam String query) {
        List<Profile> profiles = profileService.searchProfiles(query); // Service method to search profiles
        System.out.println("🔍 Search called with query: " + query); // <-- Include here

        List<Profile> profiles = profileService.searchProfiles(query);

        List<ProfileDTO> result = profiles.stream().map(profile -> {
            ProfileDTO dto = new ProfileDTO();
            dto.setUsername(profile.getUsername());
            dto.setFullName(profile.getFullName());
            dto.setProfilePictureUrl(profile.getProfilePictureUrl());
            return dto;
        }).toList();

        return ResponseEntity.ok(result);
    }





}
