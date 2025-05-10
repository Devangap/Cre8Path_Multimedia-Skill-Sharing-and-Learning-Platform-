package com.projectPAF.Cre8Path.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class RecommendationService {
    private final RestTemplate restTemplate = new RestTemplate();

    public List<Long> getRecommendedPostIds(Long userId, String skills, String interests) {
        String baseUrl = "http://localhost:5050/recommend?user_id=" + userId;

        if (skills != null && !skills.isBlank()) {
            baseUrl += "&skills=" + skills.replace(" ", "%20");
        }
        if (interests != null && !interests.isBlank()) {
            baseUrl += "&interests=" + interests.replace(" ", "%20");
        }

        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(baseUrl, Map.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                List<Integer> ids = (List<Integer>) response.getBody().get("recommended_post_ids");
                return ids != null ? ids.stream().map(Long::valueOf).toList() : List.of();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return List.of();
    }

}

