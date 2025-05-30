package com.projectPAF.Cre8Path.controller;
import com.projectPAF.Cre8Path.model.QuestionnaireResponse;
import com.projectPAF.Cre8Path.repository.QuestionnaireResponseRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import com.projectPAF.Cre8Path.repository.UserRepository;
import com.projectPAF.Cre8Path.model.User;
import com.projectPAF.Cre8Path.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;


import java.security.Principal;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/demo")
public class AuthController {


    @Autowired
    private AuthService authService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionnaireResponseRepository questionnaireResponseRepository;

    @GetMapping
    public ResponseEntity<String> hello(@AuthenticationPrincipal OAuth2User principal) {
        String name = principal != null ? principal.getAttribute("name") : null;
        return ResponseEntity.ok("Welcome, " + (name != null ? name : "User") + "!");
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @RequestBody Map<String, String> userData,
            HttpServletRequest request
    ) {
        return authService.signup(userData, request);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(
            @RequestBody Map<String, String> userData,
            HttpServletRequest request
    ) {
        return authService.signin(userData, request);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> getUserDetails(@AuthenticationPrincipal Object principal) {
        return authService.getUserDetails(principal);
    }


    //    @PostMapping("/complete-questionnaire")
//    public ResponseEntity<String> completeQuestionnaire(@AuthenticationPrincipal Object principal) {
//        return authService.completeQuestionnaire(principal);
//    }
    @GetMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
        }
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
    @PostMapping("/complete-questionnaire")
    @Transactional
    public ResponseEntity<?> saveQuestionnaire(@RequestBody QuestionnaireResponse dto, Principal principal) {
        Optional<User> userOpt = userRepository.findByEmailOrOauthId(principal.getName(), principal.getName());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        User user = userOpt.get();

        QuestionnaireResponse response = new QuestionnaireResponse();
        response.setUser(user);
        response.setInterests(dto.getInterests() != null ? String.join(",", dto.getInterests()) : "");
        response.setSkillLevel(dto.getSkillLevel());
        response.setContentType(dto.getContentType());
        response.setTimeCommitment(dto.getTimeCommitment());

        questionnaireResponseRepository.save(response);

        user.setFirstTimeLogin(false);

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("message", "Questionnaire completed successfully");
        responseMap.put("firstTimeLogin", false);

        return ResponseEntity.ok(responseMap);
    }



}
