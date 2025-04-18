package com.projectPAF.Cre8Path.controller;

import com.projectPAF.Cre8Path.Repository.PostRepository;
import com.projectPAF.Cre8Path.Repository.UserRepository;
import com.projectPAF.Cre8Path.model.Post;
import com.projectPAF.Cre8Path.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1/posts")
public class PostController {

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createPost(
            @RequestBody Map<String, Object> postData,
            @AuthenticationPrincipal OAuth2User principal
    ) {
        logger.info("Received request to create post: {}", postData);
        Map<String, String> response = new HashMap<>();

        if (principal == null) {
            logger.warn("Unauthorized attempt to create post. Principal is null.");
            response.put("error", "User not authenticated.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String email = principal.getAttribute("email");
        if (email == null) {
            logger.warn("Email not found in OAuth2 principal.");
            response.put("error", "Unable to retrieve user email from authentication.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        logger.info("Creating post for user: {}", email);
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            logger.info("User {} not found, creating new user.", email);
            user = new User();
            user.setEmail(email);
            // No password set for OAuth2 users
            try {
                userRepository.save(user);
            } catch (Exception e) {
                logger.error("Failed to save user: {}", e.getMessage(), e);
                response.put("error", "Failed to create user: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        }

        String title = (String) postData.get("title");
        String description = (String) postData.get("description");
        String category = (String) postData.get("category");
        String imageUrl = (String) postData.get("imageUrl");
        List<String> tags;
        try {
            tags = (List<String>) postData.get("tags");
        } catch (ClassCastException e) {
            logger.warn("Invalid tags format: {}", postData.get("tags"));
            response.put("error", "Tags must be a list of strings.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        String skillLevel = (String) postData.get("skillLevel");
        Boolean isPublic = (Boolean) postData.get("isPublic");

        if (title == null || title.trim().isEmpty()) {
            logger.warn("Invalid post data: title is missing.");
            response.put("error", "Title is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            logger.warn("Invalid post data: imageUrl is missing.");
            response.put("error", "Image URL is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Post post = new Post();
        post.setTitle(title);
        post.setDescription(description);
        post.setCategory(category != null ? category : "Uncategorized");
        post.setImageUrl(imageUrl);
        post.setTags(tags);
        post.setSkillLevel(skillLevel != null ? skillLevel : "Beginner");
        post.setPublic(isPublic != null ? isPublic : true);
        post.setCreatedAt(LocalDateTime.now());
        post.setUser(user);

        try {
            postRepository.save(post);
        } catch (Exception e) {
            logger.error("Failed to save post: {}", e.getMessage(), e);
            response.put("error", "Failed to create post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        logger.info("Post created successfully for user: {}", email);
        response.put("message", "Post created successfully.");
        return ResponseEntity.ok(response);
    }
    @GetMapping("/my-posts")
    public ResponseEntity<?> getMyPosts(@AuthenticationPrincipal OAuth2User principal) {
        logger.info("Received request to fetch posts for user.");
        if (principal == null) {
            logger.warn("Unauthorized attempt to fetch posts.");
            Map<String, String> response = new HashMap<>();
            response.put("error", "User not authenticated.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String email = principal.getAttribute("email");
        logger.info("Fetching posts for user: {}", email);
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            logger.warn("User {} not found.", email);
            Map<String, String> response = new HashMap<>();
            response.put("error", "User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        List<Post> posts = postRepository.findByUser(user);
        logger.info("Found {} posts for user: {}", posts.size(), email);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/feed")
    public ResponseEntity<List<Post>> getFeed() {
        logger.info("Received request to fetch feed.");
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        logger.info("Returning {} posts in feed.", posts.size());
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        logger.info("Received request to fetch post with id: {}", id);
        Post post = postRepository.findById(id).orElse(null);

        if (post == null) {
            logger.warn("Post with id {} not found.", id);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Post not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        logger.info("Found post with id: {}", id);
        Map<String, Object> response = new HashMap<>();
        response.put("id", post.getId());
        response.put("title", post.getTitle());
        response.put("description", post.getDescription());
        response.put("category", post.getCategory());
        response.put("imageUrl", post.getImageUrl());
        response.put("tags", post.getTags());
        response.put("skillLevel", post.getSkillLevel());
        response.put("isPublic", post.isPublic());
        response.put("createdAt", post.getCreatedAt());
        response.put("userEmail", post.getUser().getEmail());

        return ResponseEntity.ok(response);
    }
}