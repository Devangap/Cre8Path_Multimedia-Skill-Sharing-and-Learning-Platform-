package com.projectPAF.Cre8Path.controller;

import com.projectPAF.Cre8Path.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/v1/demo")
public class AuthController {

    @Autowired
    private AuthService authService;

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

    @PostMapping("/complete-questionnaire")
    public ResponseEntity<String> completeQuestionnaire(@AuthenticationPrincipal Object principal) {
        return authService.completeQuestionnaire(principal);
    }

}
