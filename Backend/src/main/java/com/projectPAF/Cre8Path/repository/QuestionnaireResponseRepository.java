package com.projectPAF.Cre8Path.repository;

import com.projectPAF.Cre8Path.model.QuestionnaireResponse;
import com.projectPAF.Cre8Path.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuestionnaireResponseRepository extends JpaRepository<QuestionnaireResponse, Long> {
    Optional<QuestionnaireResponse> findByUser(User user);
}
