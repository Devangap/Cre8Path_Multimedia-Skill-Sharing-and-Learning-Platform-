package com.projectPAF.Cre8Path.model;

import com.projectPAF.Cre8Path.repository.ProfileRepository;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class PostResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String category;
    private List<String> imageUrls;
    private List<String> tags;
    private String skillLevel;
    private boolean isPublic;
    private String videoUrl;
    private LocalDateTime createdAt;
    private String authorEmail;
    private String authorUsername;
    private long likeCount;
    private long commentCount;

    public PostResponseDTO() {}

    // ✅ Updated full constructor with likes and comments count
    public PostResponseDTO(Post post, String resolvedUsername, long likeCount, long commentCount) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.description = post.getDescription();
        this.category = post.getCategory();
        this.imageUrls = post.getImageUrlList();
        this.tags = post.getTags();
        this.skillLevel = post.getSkillLevel();
        this.isPublic = post.isPublic();
        this.videoUrl = post.getVideoUrl();
        this.createdAt = post.getCreatedAt();
        this.authorEmail = post.getUser().getEmail();
        this.authorUsername = resolvedUsername;
        this.likeCount = likeCount;
        this.commentCount = commentCount;
    }

    // ✅ Optional fallback constructor if no counts are needed
    public PostResponseDTO(Post post, String resolvedUsername) {
        this(post, resolvedUsername, 0, 0); // Defaults likes/comments to 0
    }

    // ✅ Static method to safely resolve username from profile or fallback
    public static String resolveUsername(Post post, ProfileRepository profileRepository) {
        return profileRepository.findByUser(post.getUser())
                .map(Profile::getUsername)
                .orElseGet(() -> {
                    if (post.getUser().getEmail() != null) {
                        return post.getUser().getEmail();
                    }
                    if (post.getUser().getOauthId() != null) {
                        return "User-" + post.getUser().getOauthId();
                    }
                    return "Unknown";
                });
    }
}
