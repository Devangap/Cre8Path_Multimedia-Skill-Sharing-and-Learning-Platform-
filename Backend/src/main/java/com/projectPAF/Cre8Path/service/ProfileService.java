package com.projectPAF.Cre8Path.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectPAF.Cre8Path.Repository.ProfileRepository;
import com.projectPAF.Cre8Path.repository.UserRepository;
import com.projectPAF.Cre8Path.model.Profile;
import com.projectPAF.Cre8Path.model.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

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
        String imageUrl = (profilePicture != null) ? "/uploads/" + profilePicture.getOriginalFilename() : null;

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

}
