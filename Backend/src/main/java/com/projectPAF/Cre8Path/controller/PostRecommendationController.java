package com.projectPAF.Cre8Path.controller;

import com.projectPAF.Cre8Path.model.Post;

import com.projectPAF.Cre8Path.model.PostResponseDTO;

import com.projectPAF.Cre8Path.model.User;
import com.projectPAF.Cre8Path.repository.PostRepository;
import com.projectPAF.Cre8Path.repository.ProfileRepository;
import com.projectPAF.Cre8Path.repository.QuestionnaireResponseRepository;
import com.projectPAF.Cre8Path.repository.UserRepository;
import com.projectPAF.Cre8Path.service.PostRecommendationService;
import com.projectPAF.Cre8Path.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;

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
    private final PostRecommendationService postRecommendationService;



    @GetMapping("/post")
    public ResponseEntity<List<PostResponseDTO>> getRecommendedPosts(
            @AuthenticationPrincipal OAuth2User oauth2User,
            Principal principal
    ) {
        List<PostResponseDTO> posts = postRecommendationService.getRecommendedPosts(oauth2User, principal);
        return ResponseEntity.ok(posts);
    }


}
