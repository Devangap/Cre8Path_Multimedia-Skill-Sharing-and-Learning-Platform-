package com.projectPAF.Cre8Path.model;

import lombok.Data;

@Data
public class ProfileDTO {
    private String username;
    private String fullName;
    private String bio;
    private String skills;
    private String profilePictureUrl;
    private String location;
    private String website;
}
