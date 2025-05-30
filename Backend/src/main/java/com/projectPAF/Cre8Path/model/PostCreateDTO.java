package com.projectPAF.Cre8Path.model;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public class PostCreateDTO {
    private String title;
    private String description;
    private String category;
    private List<MultipartFile> images;

    private MultipartFile video; // Added field
    private List<String> tags;
    private String skillLevel;
    private String isPublic;

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public List<MultipartFile> getImages() { return images; }
    public MultipartFile getVideo() { return video; }
    public void setVideo(MultipartFile video) { this.video = video; }
    public void setImages(List<MultipartFile> images) { this.images = images; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public String getSkillLevel() { return skillLevel; }
    public void setSkillLevel(String skillLevel) { this.skillLevel = skillLevel; }
    public String getIsPublic() { return isPublic; }
    public void setIsPublic(String isPublic) { this.isPublic = isPublic; }
}