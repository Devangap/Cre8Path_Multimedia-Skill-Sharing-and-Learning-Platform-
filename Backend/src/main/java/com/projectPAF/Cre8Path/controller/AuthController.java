package com.projectPAF.Cre8Path.controller;
import com.projectPAF.Cre8Path.Repository.UserRepository;
import com.projectPAF.Cre8Path.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/v1/demo")
public class  AuthController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @GetMapping
    public ResponseEntity<String> hello(@AuthenticationPrincipal OAuth2User principal) {
        String name = principal.getAttribute("name");
        return ResponseEntity.ok("Welcome, " + name + "!");
    }
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> userData) {
        String email = userData.get("email");
        String password = userData.get("password");

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists.");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        userRepository.save(user);

        return ResponseEntity.ok("User created successfully.");
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(
            @RequestBody Map<String, String> userData,
            @AuthenticationPrincipal OAuth2User oauthUser
    ) {
        // 👇 Check if user is already logged in via OAuth
        if (oauthUser != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Already signed in via OAuth. Please logout first.");
        }

        String email = userData.get("email");
        String password = userData.get("password");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not found.");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password.");
        }

        return ResponseEntity.ok("Login successful!");
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> getUserDetails(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        String name = principal.getAttribute("name");
        String email = principal.getAttribute("email");

        Map<String, String> response = new HashMap<>();
        response.put("name", name);
        response.put("email", email);

        return ResponseEntity.ok(response);
    }




}
