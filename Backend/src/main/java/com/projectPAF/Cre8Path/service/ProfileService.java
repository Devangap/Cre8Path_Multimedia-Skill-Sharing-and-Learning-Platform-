package com.projectPAF.Cre8Path.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.projectPAF.Cre8Path.repository.ProfileRepository;

import com.projectPAF.Cre8Path.repository.UserRepository;
import com.projectPAF.Cre8Path.model.Profile;
import com.projectPAF.Cre8Path.model.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads"; // Same as Post Upload

    @Transactional
    public Profile createProfile(
            String username,
            String fullName,
            String bio,
            String location,
            String website,
            String skillsJson,
            MultipartFile profilePicture,
            String email
    ) throws IOException {

        if (email == null) {
            throw new IllegalArgumentException("User email is null.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (profileRepository.findByUser(user).isPresent()) {
            throw new IllegalStateException("Profile already exists for this user.");
        }

        List<String> skills = objectMapper.readValue(skillsJson, new TypeReference<>() {});

        String imageUrl = null;

        if (profilePicture != null && !profilePicture.isEmpty()) {
            // Ensure uploads directory exists
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // Save with random UUID filename
            String originalFilename = profilePicture.getOriginalFilename();
            String fileExtension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg"; // fallback to jpg

            String newFilename = UUID.randomUUID().toString() + fileExtension;
            Path filePath = Paths.get(UPLOAD_DIR, newFilename);
            Files.write(filePath, profilePicture.getBytes());

            // Set the image URL for database
            imageUrl = "/uploads/" + newFilename;
        }

        Profile profile = new Profile();
        profile.setUser(user);
        profile.setUsername(username);
        profile.setFullName(fullName);
        profile.setBio(bio);
        profile.setLocation(location);
        profile.setWebsite(website);
        profile.setSkills(skillsJson);
        profile.setProfilePictureUrl(imageUrl);
        profile.setJoinedAt(LocalDateTime.now());

        System.out.println("Before saving profile: " + profile);

        Profile savedProfile = profileRepository.save(profile);

        System.out.println("After saving profile: " + savedProfile);

        return savedProfile;
    }
    public Optional<Profile> getProfileByUsername(String username) {
        return profileRepository.findByUsername(username);
    }

    public Optional<Profile> getProfileByUser(User user) {
        return profileRepository.findByUser(user);
    }


    @Transactional
    public Profile updateProfile(User user, String username, String fullName, String bio, String location, String website, String skillsJson, MultipartFile profilePicture) {

        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Profile does not exist."));

        profile.setUsername(username);
        profile.setFullName(fullName);
        profile.setBio(bio);
        profile.setLocation(location);
        profile.setWebsite(website);
        profile.setSkills(skillsJson);

        if (profilePicture != null && !profilePicture.isEmpty()) {
            try {
                // Save new picture
                File uploadDir = new File(UPLOAD_DIR);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }
                String originalFilename = profilePicture.getOriginalFilename();
                String fileExtension = (originalFilename != null && originalFilename.contains("."))
                        ? originalFilename.substring(originalFilename.lastIndexOf("."))
                        : ".jpg";
                String newFilename = UUID.randomUUID().toString() + fileExtension;
                Path filePath = Paths.get(UPLOAD_DIR, newFilename);
                Files.write(filePath, profilePicture.getBytes());

                profile.setProfilePictureUrl("/uploads/" + newFilename);

            } catch (IOException e) {
                throw new RuntimeException("Failed to upload profile picture", e);
            }
        }

        return profileRepository.save(profile);
    }

    @Transactional
    public void deleteProfile(User user) {
        Optional<Profile> optionalProfile = profileRepository.findByUser(user);

        if (optionalProfile.isPresent()) {
            profileRepository.delete(optionalProfile.get());
        } else {
            throw new IllegalStateException("Profile not found for user");
        }
    }




}
