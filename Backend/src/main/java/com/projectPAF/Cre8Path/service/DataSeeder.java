package com.projectPAF.Cre8Path.service;

import com.projectPAF.Cre8Path.model.Profile;
import com.projectPAF.Cre8Path.model.QuestionnaireResponse;
import com.projectPAF.Cre8Path.model.User;
import com.projectPAF.Cre8Path.repository.ProfileRepository;
import com.projectPAF.Cre8Path.repository.QuestionnaireResponseRepository;
import com.projectPAF.Cre8Path.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Component
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final QuestionnaireResponseRepository questionnaireResponseRepository;

    // ✅ Set to true if you want to always add synthetic data
    private final boolean forceSeed = false;

    @PostConstruct
    public void seedData() {
        // ✅ create data folder if not exists
        new File("data").mkdirs();

        if (!forceSeed && userRepository.count() > 0) {
            System.out.println("[DataSeeder] Skipped → existing users found.");
            return;
        }

        System.out.println("[DataSeeder] Seeding synthetic data...");
        Random random = new Random();

        List<String> skillsList = Arrays.asList("Photography", "Videography", "Graphic Designing", "Animation", "Music Production", "UI/UX", "Content Creation", "Advertising", "Marketing");
        List<String> levels = Arrays.asList("Beginner", "Intermediate", "Advanced");
        List<String> contentTypes = Arrays.asList("Video tutorials", "Written guides", "Interactive activities");
        List<String> timeCommitments = Arrays.asList("< 1 hour", "1–3 hours", "3–5 hours", "5+ hours");

        IntStream.rangeClosed(1, 100).forEach(i -> {
            User user = new User();
            user.setEmail("user" + i + "@test.com");
            userRepository.save(user);

            Profile profile = new Profile();
            profile.setUser(user);
            profile.setUsername("user" + i);

            // Randomize 2–4 skills
            Collections.shuffle(skillsList);
            profile.setSkills(skillsList.stream().limit(2 + random.nextInt(3)).collect(Collectors.joining(",")));
            profile.setLocation("City " + random.nextInt(100));
            profileRepository.save(profile);

            QuestionnaireResponse q = new QuestionnaireResponse();
            q.setUser(user);

            // Randomize 2–4 interests
            Collections.shuffle(skillsList);
            q.setInterests(skillsList.stream().limit(2 + random.nextInt(3)).collect(Collectors.joining(",")));

            q.setSkillLevel(levels.get(random.nextInt(levels.size())));
            q.setContentType(contentTypes.get(random.nextInt(contentTypes.size())));
            q.setTimeCommitment(timeCommitments.get(random.nextInt(timeCommitments.size())));
            questionnaireResponseRepository.save(q);
        });

        System.out.println("[DataSeeder] ✅ Synthetic dataset (100 users) created.");
    }
}
