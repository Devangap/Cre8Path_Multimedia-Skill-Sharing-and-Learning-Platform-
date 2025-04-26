package com.projectPAF.Cre8Path.service;

import com.projectPAF.Cre8Path.Repository.LearningPlanRepository;
import com.projectPAF.Cre8Path.model.LearningPlan;
import com.projectPAF.Cre8Path.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    public LearningPlan createLearningPlan(LearningPlan learningPlan) {
        return learningPlanRepository.save(learningPlan);
    }

    public LearningPlan getLearningPlan(Long id) {
        return learningPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning Plan not found"));
    }

    public LearningPlan updateLearningPlan(Long id, LearningPlan learningPlan) {
        if (!learningPlanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Learning Plan not found");
        }
        learningPlan.setId(id);
        return learningPlanRepository.save(learningPlan);
    }

    public void deleteLearningPlan(Long id) {
        if (!learningPlanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Learning Plan not found");
        }
        learningPlanRepository.deleteById(id);
    }

    public List<LearningPlan> getAllLearningPlans() {
        return learningPlanRepository.findAll();
    }
}
