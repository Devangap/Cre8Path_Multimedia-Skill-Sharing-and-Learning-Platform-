package com.projectPAF.Cre8Path.service;

import com.projectPAF.Cre8Path.model.Post;
import com.projectPAF.Cre8Path.model.PostCreateDTO;
import com.projectPAF.Cre8Path.model.User;
import com.projectPAF.Cre8Path.Repository.PostRepository;
import com.projectPAF.Cre8Path.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PostService {

    private static final Logger logger = LoggerFactory.getLogger(PostService.class);
    private static final String UPLOAD_DIR = "uploads/";

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public ResponseEntity<Map<String, String>> createPost(PostCreateDTO postDTO, OAuth2User oauth2User, Principal principal) {
        Map<String, String> response = new HashMap<>();
        String email = extractEmail(oauth2User, principal);

        if (email == null) {
            response.put("error", "User not authenticated.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            return userRepository.save(newUser);
        });

        if (postDTO.getTitle() == null || postDTO.getTitle().trim().isEmpty()) {
            response.put("error", "Title is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (postDTO.getImage() == null || postDTO.getImage().isEmpty() ||
                !postDTO.getImage().getContentType().startsWith("image/")) {
            response.put("error", "Valid image is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        String imageUrl;
        try {
            imageUrl = saveImage(postDTO.getImage());
        } catch (IOException e) {
            response.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        Post post = new Post();
        post.setTitle(postDTO.getTitle());
        post.setDescription(postDTO.getDescription());
        post.setCategory(Optional.ofNullable(postDTO.getCategory()).orElse("Uncategorized"));
        post.setImageUrl(imageUrl);
        post.setTags(postDTO.getTags());
        post.setSkillLevel(Optional.ofNullable(postDTO.getSkillLevel()).orElse("Beginner"));
        post.setPublic(postDTO.getIsPublic() == null || Boolean.parseBoolean(postDTO.getIsPublic()));
        post.setCreatedAt(LocalDateTime.now());
        post.setUser(user);

        postRepository.save(post);
        response.put("message", "Post created successfully.");
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> getMyPosts(OAuth2User oauth2User, Principal principal) {
        String email = extractEmail(oauth2User, principal);
        if (email == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "User not authenticated.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        List<Post> posts = postRepository.findByUser(user);
        return ResponseEntity.ok(posts);
    }

    public ResponseEntity<List<Post>> getFeed() {
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(posts);
    }

    public ResponseEntity<?> getPostById(Long id) {
        Post post = postRepository.findById(id).orElse(null);
        if (post == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Post not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

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

    public ResponseEntity<Map<String, String>> deletePost(Long id, OAuth2User oauth2User, Principal principal) {
        Map<String, String> response = new HashMap<>();
        String email = extractEmail(oauth2User, principal);

        if (email == null) {
            response.put("error", "User not authenticated.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        Post post = postRepository.findById(id).orElse(null);
        if (post == null) {
            response.put("error", "Post not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        if (!post.getUser().getEmail().equals(email)) {
            response.put("error", "You are not authorized to delete this post.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        try {
            deleteImage(post.getImageUrl());
            postRepository.delete(post);
            response.put("message", "Post deleted successfully.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Failed to delete post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    public ResponseEntity<Map<String, String>> updatePost(Long id, PostCreateDTO postDTO, OAuth2User oauth2User, Principal principal) {
        Map<String, String> response = new HashMap<>();
        String email = extractEmail(oauth2User, principal);

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

        if (postDTO.getTitle() != null) existingPost.setTitle(postDTO.getTitle());
        if (postDTO.getDescription() != null) existingPost.setDescription(postDTO.getDescription());
        if (postDTO.getCategory() != null) existingPost.setCategory(postDTO.getCategory());
        if (postDTO.getSkillLevel() != null) existingPost.setSkillLevel(postDTO.getSkillLevel());
        if (postDTO.getTags() != null) existingPost.setTags(postDTO.getTags());
        if (postDTO.getIsPublic() != null) existingPost.setPublic(Boolean.parseBoolean(postDTO.getIsPublic()));

        if (postDTO.getImage() != null && !postDTO.getImage().isEmpty()) {
            try {
                deleteImage(existingPost.getImageUrl());
                String newImageUrl = saveImage(postDTO.getImage());
                existingPost.setImageUrl(newImageUrl);
            } catch (IOException e) {
                response.put("error", "Failed to upload new image: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        }

        postRepository.save(existingPost);
        response.put("message", "Post updated successfully.");
        return ResponseEntity.ok(response);
    }

    private String extractEmail(OAuth2User oauth2User, Principal principal) {
        if (oauth2User != null) {
            return oauth2User.getAttribute("email");
        } else if (principal != null) {
            return principal.getName();
        }
        return null;
    }

    private String saveImage(org.springframework.web.multipart.MultipartFile image) throws IOException {
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        String originalFilename = image.getOriginalFilename();
        String fileExtension = originalFilename != null
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String newFilename = UUID.randomUUID().toString() + fileExtension;
        Path filePath = Paths.get(UPLOAD_DIR, newFilename);
        Files.write(filePath, image.getBytes());

        return "/uploads/" + newFilename;
    }

    private void deleteImage(String imageUrl) {
        if (imageUrl != null) {
            String path = "uploads/" + new File(imageUrl).getName();
            File file = new File(path);
            if (file.exists()) file.delete();
        }
    }
}
