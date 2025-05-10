package com.projectPAF.Cre8Path.service;

import com.projectPAF.Cre8Path.model.Profile;
import com.projectPAF.Cre8Path.model.QuestionnaireResponse;
import com.projectPAF.Cre8Path.model.User;
import com.projectPAF.Cre8Path.repository.ProfileRepository;
import com.projectPAF.Cre8Path.repository.QuestionnaireResponseRepository;
import com.projectPAF.Cre8Path.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.projectPAF.Cre8Path.model.Post;
import com.projectPAF.Cre8Path.repository.PostRepository;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DataExportService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ProfileRepository profileRepository;
    private final QuestionnaireResponseRepository questionnaireResponseRepository;

    private final String DATA_FOLDER = "data";

    public void exportUsers() throws IOException {
        ensureDataFolderExists();

        File file = new File(DATA_FOLDER + "/users.csv");
        try (FileWriter writer = new FileWriter(file)) {
            writer.append("id,email\n");
            for (User user : userRepository.findAll()) {
                writer.append(user.getId() + "," + (user.getEmail() != null ? user.getEmail() : "") + "\n");
            }
        }
        System.out.println("[DataExportService] ✅ users.csv exported to: " + file.getAbsolutePath());
    }

    public void exportDataset() throws IOException {
        ensureDataFolderExists();

        File file = new File(DATA_FOLDER + "/dataset.csv");
        try (FileWriter writer = new FileWriter(file)) {
            writer.append("user_id,username,skills,location,interests,skillLevel,contentType,timeCommitment\n");
            for (Profile profile : profileRepository.findAll()) {
                QuestionnaireResponse q = questionnaireResponseRepository.findByUser(profile.getUser()).orElse(null);
                writer.append(profile.getUser().getId() + "," +
                        safeString(profile.getUsername()) + "," +
                        safeString(profile.getSkills()) + "," +
                        safeString(profile.getLocation()) + "," +
                        safeString(q != null ? q.getInterests() : "") + "," +
                        safeString(q != null ? q.getSkillLevel() : "") + "," +
                        safeString(q != null ? q.getContentType() : "") + "," +
                        safeString(q != null ? q.getTimeCommitment() : "") + "\n");
            }
        }
        System.out.println("[DataExportService] ✅ dataset.csv exported to: " + file.getAbsolutePath());
    }

    private void ensureDataFolderExists() {
        File folder = new File(DATA_FOLDER);
        if (!folder.exists()) {
            folder.mkdirs();
            System.out.println("[DataExportService] Created data folder: " + folder.getAbsolutePath());
        }
        System.out.println("[DataExportService] Current working directory: " + new File(".").getAbsolutePath());
    }

    private String safeString(String value) {
        return value != null ? value.replace(",", ";").replace("\n", " ") : "";
    }
    public void exportPosts() throws IOException {
        ensureDataFolderExists();

        File file = new File(DATA_FOLDER + "/posts.csv");
        try (FileWriter writer = new FileWriter(file)) {
            writer.append("post_id,title,tags,category,skillLevel\n");
            for (Post post : postRepository.findAll()) {
                writer.append(post.getId() + "," +
                        safeString(post.getTitle()) + "," +
                        safeString(post.getTags() != null ? String.join(",", post.getTags()) : "") + "," +
                        safeString(post.getCategory()) + "," +
                        safeString(post.getSkillLevel()) + "\n");
            }
        }
        System.out.println("[DataExportService] ✅ posts.csv exported to: " + file.getAbsolutePath());
    }
}
