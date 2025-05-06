package com.projectPAF.Cre8Path.service;

import com.projectPAF.Cre8Path.model.Post;
import com.projectPAF.Cre8Path.model.PostCreateDTO;
import com.projectPAF.Cre8Path.model.User;
import com.projectPAF.Cre8Path.repository.PostRepository;
import com.projectPAF.Cre8Path.repository.UserRepository;
import com.projectPAF.Cre8Path.model.PostResponseDTO;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

        List<String> imageUrls = new ArrayList<>();
        try {
            for (MultipartFile image : postDTO.getImages()) {
                if (image != null && image.getContentType().startsWith("image/")) {
                    String url = saveFile(image);
                    imageUrls.add(url);
                }
            }
        } catch (IOException e) {
            response.put("error", "Image upload failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        String videoUrl = null;
        try {
            if (postDTO.getVideo() != null && postDTO.getVideo().getContentType().startsWith("video/")) {
                videoUrl = saveFile(postDTO.getVideo());
            }
        } catch (IOException e) {
            response.put("error", "Video upload failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        Post post = new Post();
        post.setTitle(postDTO.getTitle());
        post.setDescription(postDTO.getDescription());
        post.setCategory(Optional.ofNullable(postDTO.getCategory()).orElse("Uncategorized"));
        post.setImageUrls(imageUrls);
        post.setTags(postDTO.getTags());
        post.setSkillLevel(Optional.ofNullable(postDTO.getSkillLevel()).orElse("Beginner"));
        post.setPublic(postDTO.getIsPublic() == null || Boolean.parseBoolean(postDTO.getIsPublic()));
        post.setCreatedAt(LocalDateTime.now());
        post.setUser(user);
        post.setVideoUrl(videoUrl);

        postRepository.save(post);
        response.put("message", "Post created successfully.");
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> getMyPosts(OAuth2User oauth2User, Principal principal) {
        String email = extractEmail(oauth2User, principal);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authenticated."));
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found."));
        }

        List<Post> posts = postRepository.findByUser(user);
        List<PostResponseDTO> dtoList = posts.stream().map(PostResponseDTO::new).toList();
        return ResponseEntity.ok(dtoList);
    }

    public ResponseEntity<List<PostResponseDTO>> getFeed() {
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        List<PostResponseDTO> dtoList = posts.stream().map(PostResponseDTO::new).toList();
        return ResponseEntity.ok(dtoList);
    }

    public ResponseEntity<?> getPostById(Long id) {
        Post post = postRepository.findById(id).orElse(null);
        if (post == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Post not found."));
        }
        return ResponseEntity.ok(new PostResponseDTO(post));
    }

    public ResponseEntity<Map<String, String>> deletePost(Long id, OAuth2User oauth2User, Principal principal) {
        String email = extractEmail(oauth2User, principal);
        Map<String, String> response = new HashMap<>();

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
            response.put("error", "Unauthorized.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        if (post.getImageUrlList() != null) {
            post.getImageUrlList().forEach(this::deleteFile);
        }

        if (post.getVideoUrl() != null) {
            deleteFile(post.getVideoUrl());
        }

        postRepository.delete(post);
        response.put("message", "Post deleted successfully.");
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, String>> updatePost(Long id, PostCreateDTO postDTO, OAuth2User oauth2User, Principal principal) {
        String email = extractEmail(oauth2User, principal);
        Map<String, String> response = new HashMap<>();

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
            response.put("error", "Unauthorized.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        if (postDTO.getTitle() != null) post.setTitle(postDTO.getTitle());
        if (postDTO.getDescription() != null) post.setDescription(postDTO.getDescription());
        if (postDTO.getCategory() != null) post.setCategory(postDTO.getCategory());
        if (postDTO.getSkillLevel() != null) post.setSkillLevel(postDTO.getSkillLevel());
        if (postDTO.getTags() != null) post.setTags(postDTO.getTags());
        if (postDTO.getIsPublic() != null) post.setPublic(Boolean.parseBoolean(postDTO.getIsPublic()));

        if (postDTO.getImages() != null && !postDTO.getImages().isEmpty()) {
            post.getImageUrlList().forEach(this::deleteFile);
            List<String> newImageUrls = new ArrayList<>();
            for (MultipartFile image : postDTO.getImages()) {
                try {
                    newImageUrls.add(saveFile(image));
                } catch (IOException e) {
                    response.put("error", "Image upload failed: " + e.getMessage());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }
            }
            post.setImageUrls(newImageUrls);
        }

        try {
            if (postDTO.getVideo() != null && postDTO.getVideo().getContentType().startsWith("video/")) {
                if (post.getVideoUrl() != null) deleteFile(post.getVideoUrl());
                String videoUrl = saveFile(postDTO.getVideo());
                post.setVideoUrl(videoUrl);
            }
        } catch (IOException e) {
            response.put("error", "Video upload failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        postRepository.save(post);
        response.put("message", "Post updated successfully.");
        return ResponseEntity.ok(response);
    }

    private String extractEmail(OAuth2User oauth2User, Principal principal) {
        if (oauth2User != null) return oauth2User.getAttribute("email");
        if (principal != null) return principal.getName();
        return null;
    }

    private String saveFile(MultipartFile file) throws IOException {
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        String extension = Optional.ofNullable(file.getOriginalFilename())
                .filter(f -> f.contains("."))
                .map(f -> f.substring(f.lastIndexOf(".")))
                .orElse("");

        String filename = UUID.randomUUID() + extension;
        Path path = Paths.get(UPLOAD_DIR, filename);
        Files.write(path, file.getBytes());

        return "/uploads/" + filename;
    }

    private void deleteFile(String fileUrl) {
        if (fileUrl != null) {
            File file = new File(UPLOAD_DIR + new File(fileUrl).getName());
            if (file.exists()) file.delete();
        }
    }
}