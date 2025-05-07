package com.projectPAF.Cre8Path.controller;



import com.projectPAF.Cre8Path.model.PostCreateDTO;
import com.projectPAF.Cre8Path.model.PostResponseDTO;

import com.projectPAF.Cre8Path.repository.PostRepository;
import com.projectPAF.Cre8Path.repository.UserRepository;



import com.projectPAF.Cre8Path.model.Post;
import com.projectPAF.Cre8Path.service.PostService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000",allowCredentials = "true")
@RestController
@RequestMapping("api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);
    private final PostService postService;

    @PostMapping(value = "/create", consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, String>> createPost(
            @ModelAttribute PostCreateDTO postDTO,
            @AuthenticationPrincipal OAuth2User oauth2User,
            Principal principal
    ) {
        logger.info("Received request to create post with title: {}", postDTO.getTitle());
        return postService.createPost(postDTO, oauth2User, principal);
    }

    @GetMapping("/my-posts")
    public ResponseEntity<?> getMyPosts(
            @AuthenticationPrincipal OAuth2User oauth2User,
            Principal principal
    ) {
        logger.info("Received request to fetch posts for user.");
        return postService.getMyPosts(oauth2User, principal);
    }

    @GetMapping("/feed")
    public ResponseEntity<List<PostResponseDTO>> getFeed() {
        logger.info("Received request to fetch feed.");
        return postService.getFeed();
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        logger.info("Received request to fetch post with id: {}", id);
        return postService.getPostById(id);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Map<String, String>> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal OAuth2User oauth2User,
            Principal principal
    ) {
        logger.info("Received request to delete post with id: {}", id);
        return postService.deletePost(id, oauth2User, principal);
    }

    @PutMapping(value = "/{id}/update", consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, String>> updatePost(
            @PathVariable Long id,
            @ModelAttribute PostCreateDTO postDTO,
            @AuthenticationPrincipal OAuth2User oauth2User,
            Principal principal
    ) {
        logger.info("Received request to update post with id: {}", id);
        return postService.updatePost(id, postDTO, oauth2User, principal);
    }
    @GetMapping("/user/{username}")
    public ResponseEntity<?> getPostsByUsername(@PathVariable String username) {
        return postService.getPostsByUsername(username);
    }
//    @GetMapping("/feed")
//    public ResponseEntity<List<Post>> getFeed(
//            @AuthenticationPrincipal OAuth2User oauth2User,
//            Principal principal
//    ) {
//        return postService.getFollowedUsersPosts(oauth2User, principal);
//    }





}