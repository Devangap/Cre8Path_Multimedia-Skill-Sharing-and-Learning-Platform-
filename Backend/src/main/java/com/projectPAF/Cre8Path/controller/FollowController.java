package com.projectPAF.Cre8Path.controller;

import com.projectPAF.Cre8Path.model.Profile;
import com.projectPAF.Cre8Path.model.User;
import com.projectPAF.Cre8Path.repository.ProfileRepository;
import com.projectPAF.Cre8Path.repository.UserRepository;
import com.projectPAF.Cre8Path.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/follow")
@RequiredArgsConstructor
public class FollowController {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final FollowService followService;


    @PostMapping("/{username}")
    public ResponseEntity<?> toggleFollow(
            @PathVariable String username,
            @AuthenticationPrincipal OAuth2User oauth2User,
            Principal principal
    ) {
        String email = oauth2User != null ? oauth2User.getAttribute("email") : principal.getName();

        if (email == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not authenticated"));
        }

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Profile followerProfile = profileRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Profile for authenticated user not found"));

        Profile targetProfile = profileRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Target profile not found"));

        if (followerProfile.getId().equals(targetProfile.getId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "You cannot follow yourself"));
        }

        boolean isNowFollowing = followService.toggleFollow(followerProfile, targetProfile);

        return ResponseEntity.ok(Map.of(
                "message", isNowFollowing ? "Followed" : "Unfollowed",
                "isFollowing", isNowFollowing
        ));
    }


    @GetMapping("/{username}/status")
    public ResponseEntity<?> getFollowStatus(
            @PathVariable String username,
            @AuthenticationPrincipal OAuth2User oauth2User,
            Principal principal
    ) {
        String email = oauth2User != null ? oauth2User.getAttribute("email") : principal.getName();

        if (email == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not authenticated"));
        }

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Profile viewerProfile = profileRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Viewer profile not found"));

        Profile targetProfile = profileRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Target profile not found"));

        boolean isFollowing = followService.isFollowing(viewerProfile, targetProfile);
        long followerCount = followService.getFollowerCount(targetProfile);
        long followingCount = followService.getFollowingCount(targetProfile);

        Map<String, Object> response = new HashMap<>();
        response.put("isFollowing", isFollowing);
        response.put("followerCount", followerCount);
        response.put("followingCount", followingCount);

        return ResponseEntity.ok(response);
    }
}
