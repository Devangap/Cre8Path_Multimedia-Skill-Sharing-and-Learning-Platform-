package com.projectPAF.Cre8Path.model;

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

    public PostResponseDTO() {}

    public PostResponseDTO(Post post) {
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
        this.authorUsername = post.getUser().getOauthId(); // ← fallback if username missing
    }
}
