package com.projectPAF.Cre8Path.controller;

import com.projectPAF.Cre8Path.model.PostCreateDTO;
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
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/posts")
public class PostController {

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);
    private static final String UPLOAD_DIR = "uploads/";

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping(value = "/create", consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, String>> createPost(
            @ModelAttribute PostCreateDTO postDTO,
            @AuthenticationPrincipal OAuth2User oauth2User,
            Principal principal
    ) {
        logger.info("Received request to create post with title: {}", postDTO.getTitle());
        Map<String, String> response = new HashMap<>();

        // Identify user email (whether normal login or Google OAuth2)
        String email = null;
        if (oauth2User != null) {
            email = oauth2User.getAttribute("email");
        } else if (principal != null) {
            email = principal.getName();
        }

        if (email == null) {
            logger.warn("Unauthorized attempt to create post. No email found.");
            response.put("error", "User not authenticated.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        logger.info("Creating post for user: {}", email);
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            logger.info("User {} not found, creating new user.", email);
            user = new User();
            user.setEmail(email);
            try {
                userRepository.save(user);
            } catch (Exception e) {
                logger.error("Failed to save user: {}", e.getMessage(), e);
                response.put("error", "Failed to create user: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        }

        // Validate required fields
        if (postDTO.getTitle() == null || postDTO.getTitle().trim().isEmpty()) {
            logger.warn("Invalid post data: title is missing.");
            response.put("error", "Title is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (postDTO.getImage() == null || postDTO.getImage().isEmpty()) {
            logger.warn("Invalid post data: image is missing.");
            response.put("error", "Image is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Validate image type
        if (!postDTO.getImage().getContentType().startsWith("image/")) {
            logger.warn("Invalid post data: uploaded file is not an image.");
            response.put("error", "Uploaded file must be an image.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Save the image file
        String imageUrl;
        try {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String originalFilename = postDTO.getImage().getOriginalFilename();
            String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
            String newFilename = UUID.randomUUID().toString() + fileExtension;
            Path filePath = Paths.get(UPLOAD_DIR, newFilename);
            Files.write(filePath, postDTO.getImage().getBytes());

            imageUrl = "/uploads/" + newFilename;
        } catch (IOException e) {
            logger.error("Failed to save image: {}", e.getMessage(), e);
            response.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        // Parse isPublic
        Boolean isPublic = postDTO.getIsPublic() != null ? Boolean.parseBoolean(postDTO.getIsPublic()) : true;

        // Create the post
        Post post = new Post();
        post.setTitle(postDTO.getTitle());
        post.setDescription(postDTO.getDescription());
        post.setCategory(postDTO.getCategory() != null ? postDTO.getCategory() : "Uncategorized");
        post.setImageUrl(imageUrl);
        post.setTags(postDTO.getTags());
        post.setSkillLevel(postDTO.getSkillLevel() != null ? postDTO.getSkillLevel() : "Beginner");
        post.setPublic(isPublic);
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
    public ResponseEntity<?> getMyPosts(
            @AuthenticationPrincipal OAuth2User oauth2User,
            Principal principal
    ) {
        logger.info("Received request to fetch posts for user.");
        if (principal == null && oauth2User == null) {
            logger.warn("Unauthorized attempt to fetch posts.");
            Map<String, String> response = new HashMap<>();
            response.put("error", "User not authenticated.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String email = null;
        if (oauth2User != null) {
            // Google OAuth2 login
            email = oauth2User.getAttribute("email");
        } else if (principal != null) {
            // Normal email login (e.g., session-based)
            email = principal.getName();
        }

        if (email == null) {
            logger.warn("Unable to retrieve user email from authentication.");
            Map<String, String> response = new HashMap<>();
            response.put("error", "Unable to retrieve user email.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        logger.info("Fetching posts for user: {}", email);
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            logger.warn("User {}/ul> not found.", email);
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

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Map<String, String>> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal OAuth2User oauth2User,
            Principal principal
    ) {
        Map<String, String> response = new HashMap<>();
        String email = null;

        // Retrieve user email from either login method
        if (oauth2User != null) {
            email = oauth2User.getAttribute("email");
        } else if (principal != null) {
            email = principal.getName();
        }

        if (email == null) {
            response.put("error", "User not authenticated.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        // Find post by ID
        Post post = postRepository.findById(id).orElse(null);
        if (post == null) {
            response.put("error", "Post not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // Check ownership
        if (!post.getUser().getEmail().equals(email)) {
            response.put("error", "You are not authorized to delete this post.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        try {
            // Optionally delete image file
            String imagePath = "uploads/" + new File(post.getImageUrl()).getName();
            File imageFile = new File(imagePath);
            if (imageFile.exists()) {
                imageFile.delete();
            }

            postRepository.delete(post);
            response.put("message", "Post deleted successfully.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Failed to delete post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);}
    }

    @PutMapping(value = "/{id}/update", consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, String>> updatePost(
            @PathVariable Long id,
            @ModelAttribute PostCreateDTO postDTO,
            @AuthenticationPrincipal OAuth2User oauth2User,
            Principal principal
    ) {
        Map<String, String> response = new HashMap<>();
        String email = null;

        if (oauth2User != null) {
            email = oauth2User.getAttribute("email");
        } else if (principal != null) {
            email = principal.getName();
        }

        if (email == null) {
            response.put("error", "User not authenticated.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        Post existingPost = postRepository.findById(id).orElse(null);
        if (existingPost == null) {
            response.put("error", "Post not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        if (!existingPost.getUser().getEmail().equals(email)) {
            response.put("error", "You are not authorized to update this post.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        // Update fields
        if (postDTO.getTitle() != null) existingPost.setTitle(postDTO.getTitle());
        if (postDTO.getDescription() != null) existingPost.setDescription(postDTO.getDescription());
        if (postDTO.getCategory() != null) existingPost.setCategory(postDTO.getCategory());
        if (postDTO.getSkillLevel() != null) existingPost.setSkillLevel(postDTO.getSkillLevel());
        if (postDTO.getTags() != null) existingPost.setTags(postDTO.getTags());
        if (postDTO.getIsPublic() != null) {
            existingPost.setPublic(Boolean.parseBoolean(postDTO.getIsPublic()));
        }

        // Handle image update if a new image is uploaded
        if (postDTO.getImage() != null && !postDTO.getImage().isEmpty()) {
            try {
                File uploadDir = new File(UPLOAD_DIR);
                if (!uploadDir.exists()) uploadDir.mkdirs();

                String originalFilename = postDTO.getImage().getOriginalFilename();
                String fileExtension = originalFilename != null
                        ? originalFilename.substring(originalFilename.lastIndexOf("."))
                        : ".jpg";
                String newFilename = UUID.randomUUID().toString() + fileExtension;
                Path filePath = Paths.get(UPLOAD_DIR, newFilename);
                Files.write(filePath, postDTO.getImage().getBytes());

                // Optionally delete old image
                String oldImagePath = "uploads/" + new File(existingPost.getImageUrl()).getName();
                File oldImageFile = new File(oldImagePath);
                if (oldImageFile.exists()) oldImageFile.delete();

                existingPost.setImageUrl("/uploads/" + newFilename);
            } catch (IOException e) {
                response.put("error", "Failed to upload new image: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        }

        postRepository.save(existingPost);
        response.put("message", "Post updated successfully.");
        return ResponseEntity.ok(response);
    }


}