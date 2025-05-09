package com.projectPAF.Cre8Path.service;

import com.projectPAF.Cre8Path.model.*;
import com.projectPAF.Cre8Path.repository.*;
import org.hibernate.Hibernate;

import jakarta.transaction.Transactional;
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
import java.nio.file.*;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private static final Logger logger = LoggerFactory.getLogger(PostService.class);
    private static final String UPLOAD_DIR = "uploads/";

    private final PostRepository postRepository;
    private final ProfileRepository profileRepository;
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    public ResponseEntity<Map<String, String>> createPost(PostCreateDTO postDTO, OAuth2User oauth2User, Principal principal) {
        Map<String, String> response = new HashMap<>();
        String email = extractEmail(oauth2User, principal);

        if (email == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authenticated."));

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            return userRepository.save(newUser);
        });

        if (postDTO.getTitle() == null || postDTO.getTitle().trim().isEmpty())
            return ResponseEntity.badRequest().body(Map.of("error", "Title is required."));

        List<String> imageUrls = new ArrayList<>();
        try {
            for (MultipartFile image : postDTO.getImages()) {
                if (image != null && image.getContentType().startsWith("image/")) {
                    String url = saveFile(image);
                    imageUrls.add(url);
                }
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Image upload failed: " + e.getMessage()));
        }

        String videoUrl = null;
        try {
            if (postDTO.getVideo() != null && postDTO.getVideo().getContentType().startsWith("video/")) {
                videoUrl = saveFile(postDTO.getVideo());
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Video upload failed: " + e.getMessage()));
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
        return ResponseEntity.ok(Map.of("message", "Post created successfully."));
    }

    public ResponseEntity<?> getMyPosts(OAuth2User oauth2User, Principal principal) {
        String email = extractEmail(oauth2User, principal);
        if (email == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authenticated."));

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found."));

        List<Post> posts = postRepository.findByUser(user);

        List<PostResponseDTO> dtoList = posts.stream()
                .map(post -> {
                    String username = PostResponseDTO.resolveUsername(post, profileRepository);
                    long likeCount = likeRepository.countByPost(post);
                    long commentCount = commentRepository.countByPost(post);
                    return new PostResponseDTO(post, username, likeCount, commentCount);
                })
                .toList();

        return ResponseEntity.ok(dtoList);
    }

    public ResponseEntity<List<PostResponseDTO>> getFeed(OAuth2User oauth2User, Principal principal) {
        String email = oauth2User != null ? oauth2User.getAttribute("email") : principal.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Profile profile = profileRepository.findByUser(user).orElseThrow();

        List<Follow> followRecords = followRepository.findByFollower(profile);
        List<User> followedUsers = followRecords.stream()
                .map(follow -> follow.getFollowing().getUser())
                .toList();

        List<Post> feedPosts = postRepository.findByUserInOrderByCreatedAtDesc(followedUsers);

        List<PostResponseDTO> response = feedPosts.stream()
                .map(post -> {
                    String resolvedUsername = PostResponseDTO.resolveUsername(post, profileRepository);
                    long likeCount = likeRepository.countByPost(post);
                    long commentCount = commentRepository.countByPost(post);
                    return new PostResponseDTO(post, resolvedUsername, likeCount, commentCount);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> getPostById(Long id) {
        Post post = postRepository.findById(id).orElse(null);
        if (post == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Post not found."));

        String username = PostResponseDTO.resolveUsername(post, profileRepository);
        return ResponseEntity.ok(new PostResponseDTO(post, username));
    }

    public ResponseEntity<Map<String, String>> deletePost(Long id, OAuth2User oauth2User, Principal principal) {
        String email = extractEmail(oauth2User, principal);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authenticated."));
        Post post = postRepository.findById(id).orElse(null);
        if (post == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Post not found."));
        if (!post.getUser().getEmail().equals(email)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Unauthorized."));
        if (post.getImageUrlList() != null) post.getImageUrlList().forEach(this::deleteFile);
        if (post.getVideoUrl() != null) deleteFile(post.getVideoUrl());
        postRepository.delete(post);
        return ResponseEntity.ok(Map.of("message", "Post deleted successfully."));
    }

    public ResponseEntity<Map<String, String>> updatePost(Long id, PostCreateDTO postDTO, OAuth2User oauth2User, Principal principal) {
        String email = extractEmail(oauth2User, principal);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authenticated."));
        Post post = postRepository.findById(id).orElse(null);
        if (post == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Post not found."));
        if (!post.getUser().getEmail().equals(email)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Unauthorized."));

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
                    return ResponseEntity.internalServerError().body(Map.of("error", "Image upload failed: " + e.getMessage()));
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
            return ResponseEntity.internalServerError().body(Map.of("error", "Video upload failed: " + e.getMessage()));
        }

        postRepository.save(post);
        return ResponseEntity.ok(Map.of("message", "Post updated successfully."));
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

    public ResponseEntity<?> getPostsByUsername(String username) {
        Optional<Profile> profileOpt = profileRepository.findByUsername(username);
        if (profileOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        String email = profileOpt.get().getUser().getEmail();
        List<Post> posts = postRepository.findByUserEmail(email);

        List<PostResponseDTO> dtoList = posts.stream()
                .map(post -> {
                    String resolvedUsername = PostResponseDTO.resolveUsername(post, profileRepository);
                    long likeCount = likeRepository.countByPost(post);
                    long commentCount = commentRepository.countByPost(post);
                    return new PostResponseDTO(post, resolvedUsername, likeCount, commentCount);
                })
                .toList();

        return ResponseEntity.ok(dtoList);
    }

    public ResponseEntity<?> toggleLike(Long postId, Principal principal) {
        String email = principal.getName();
        Post post = postRepository.findById(postId).orElse(null);
        User user = userRepository.findByEmail(email).orElse(null);

        if (post == null || user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User or Post not found"));

        if (likeRepository.existsByPostAndUser(post, user)) {
            likeRepository.deleteByPostAndUser(post, user);
            return ResponseEntity.ok(Map.of("message", "Unliked"));
        } else {
            Like like = new Like();
            like.setPost(post);
            like.setUser(user);
            likeRepository.save(like);
            return ResponseEntity.ok(Map.of("message", "Liked"));
        }
    }

    public ResponseEntity<Long> getLikeCount(Long postId) {
        Post post = postRepository.findById(postId).orElse(null);
        if (post == null) return ResponseEntity.ok(0L);
        return ResponseEntity.ok(likeRepository.countByPost(post));
    }

    public ResponseEntity<?> getComments(Long postId) {
        Post post = postRepository.findById(postId).orElse(null);
        if (post == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Post not found"));
        }

        List<Comment> comments = commentRepository.findByPostOrderByCreatedAtAsc(post);

        List<Comment> topLevelComments = comments.stream()
                .filter(c -> c.getParent() == null)
                .toList();

        topLevelComments.forEach(this::initializeRepliesRecursively);

        List<CommentResponseDTO> dtoList = topLevelComments.stream()
                .map(c -> {
                    String displayName = profileRepository.findByUser(c.getUser())
                            .map(Profile::getUsername)
                            .orElseGet(() -> c.getUser().getEmail() != null
                                    ? c.getUser().getEmail()
                                    : "User-" + c.getUser().getOauthId());
                    return new CommentResponseDTO(c, displayName);
                })
                .toList();

        return ResponseEntity.ok(Map.of(
                "postOwnerEmail", post.getUser().getEmail(),
                "comments", dtoList
        ));
    }

    private void initializeRepliesRecursively(Comment comment) {
        Hibernate.initialize(comment.getReplies());
        if (comment.getReplies() != null) {
            for (Comment reply : comment.getReplies()) {
                initializeRepliesRecursively(reply);
            }
        }
    }

    @Transactional
    public ResponseEntity<?> addComment(Long postId, String content, Principal principal) {
        String email = principal.getName();
        Post post = postRepository.findById(postId).orElse(null);
        User user = userRepository.findByEmail(email).orElse(null);

        if (post == null || user == null || content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid comment"));
        }

        Comment comment = new Comment();
        comment.setContent(content.trim());
        comment.setPost(post);
        comment.setUser(user);
        comment.setCreatedAt(LocalDateTime.now());
        commentRepository.save(comment);

        return ResponseEntity.ok(Map.of("message", "Comment added"));
    }

    public ResponseEntity<?> replyToComment(Long postId, Long commentId, String content, Principal principal) {
        String email = principal.getName();
        Post post = postRepository.findById(postId).orElse(null);
        User user = userRepository.findByEmail(email).orElse(null);
        Comment parentComment = commentRepository.findById(commentId).orElse(null);

        if (post == null || user == null || parentComment == null || content == null || content.trim().isEmpty())
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid reply"));

        Comment reply = new Comment();
        reply.setPost(post);
        reply.setUser(user);
        reply.setContent(content.trim());
        reply.setParent(parentComment);
        reply.setCreatedAt(LocalDateTime.now());

        commentRepository.save(reply);

        return ResponseEntity.ok(Map.of("message", "Reply added"));
    }

    public ResponseEntity<?> deleteComment(Long postId, Long commentId, Principal principal) {
        String requesterEmail = principal.getName();

        Comment comment = commentRepository.findById(commentId).orElse(null);
        if (comment == null || !comment.getPost().getId().equals(postId)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Comment not found"));
        }

        Post post = comment.getPost();
        String postOwnerEmail = post.getUser().getEmail();

        if (!comment.getUser().getEmail().equals(requesterEmail) &&
                !postOwnerEmail.equals(requesterEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Not allowed"));
        }

        commentRepository.delete(comment);
        return ResponseEntity.ok(Map.of("message", "Comment deleted"));
    }
}
