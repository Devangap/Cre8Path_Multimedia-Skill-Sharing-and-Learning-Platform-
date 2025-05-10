package com.projectPAF.Cre8Path.controller;

import com.projectPAF.Cre8Path.model.Post;
import com.projectPAF.Cre8Path.model.User;
import com.projectPAF.Cre8Path.repository.PostRepository;
import com.projectPAF.Cre8Path.repository.ProfileRepository;
import com.projectPAF.Cre8Path.repository.QuestionnaireResponseRepository;
import com.projectPAF.Cre8Path.repository.UserRepository;
import com.projectPAF.Cre8Path.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/recommended")
@RequiredArgsConstructor
public class PostRecommendationController {

    private final RecommendationService recommendationService;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final QuestionnaireResponseRepository questionnaireRepository;

    @GetMapping("/post")
    public ResponseEntity<List<Post>> getRecommendedPosts(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();

        // 🔧 Use arrays to allow mutation inside lambdas
        String[] skills = {""};
        String[] interests = {""};

        // 🔹 Get skills from Profile
        profileRepository.findByUser(user).ifPresent(profile -> {
            if (profile.getSkills() != null) {
                skills[0] = profile.getSkills();
            }
        });

        // 🔹 Get interests from QuestionnaireResponse
        questionnaireRepository.findByUser(user).ifPresent(response -> {
            if (response.getInterests() != null) {
                interests[0] = response.getInterests();
            }
        });

        List<Long> recommendedIds = recommendationService.getRecommendedPostIds(
                user.getId(), skills[0], interests[0]
        );

        List<Post> posts = postRepository.findAllById(recommendedIds);
        return ResponseEntity.ok(posts);
    }
}
