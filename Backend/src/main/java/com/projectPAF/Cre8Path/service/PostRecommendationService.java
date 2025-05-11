package com.projectPAF.Cre8Path.service;

import com.projectPAF.Cre8Path.model.*;
import com.projectPAF.Cre8Path.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.security.Principal;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostRecommendationService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final QuestionnaireResponseRepository questionnaireRepository;
    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final RecommendationService recommendationService;

    public List<PostResponseDTO> getRecommendedPosts(OAuth2User oauth2User, Principal principal) {
        String email = oauth2User != null ? oauth2User.getAttribute("email") : principal.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        AtomicReference<String> skills = new AtomicReference<>("");
        AtomicReference<String> interests = new AtomicReference<>("");

        profileRepository.findByUser(user).ifPresent(profile -> {
            if (profile.getSkills() != null && !profile.getSkills().isBlank()) {
                skills.set(profile.getSkills());
            }
        });

        questionnaireRepository.findByUser(user).ifPresent(response -> {
            if (response.getInterests() != null && !response.getInterests().isBlank()) {
                interests.set(response.getInterests());
            }
        });

        List<Long> recommendedIds = recommendationService.getRecommendedPostIds(
                user.getId(), skills.get(), interests.get()
        );

        List<Post> posts = postRepository.findAllById(recommendedIds);

        return posts.stream()
                .map(post -> {
                    String username = PostResponseDTO.resolveUsername(post, profileRepository);
                    long likeCount = likeRepository.countByPost(post);
                    long commentCount = commentRepository.countByPost(post);
                    return new PostResponseDTO(post, username, likeCount, commentCount);
                })
                .collect(Collectors.toList());
    }
}
