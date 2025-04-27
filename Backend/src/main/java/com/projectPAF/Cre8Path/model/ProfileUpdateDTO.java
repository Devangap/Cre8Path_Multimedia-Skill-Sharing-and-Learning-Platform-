package com.projectPAF.Cre8Path.model;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProfileUpdateDTO {
    private String username;
    private String fullName;
    private String bio;
    private String skills;
    private String location;
    private String website;
    private MultipartFile profilePicture;
}
