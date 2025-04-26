package com.projectPAF.Cre8Path.controller;

import com.projectPAF.Cre8Path.repository.UserRepository;
import com.projectPAF.Cre8Path.model.User;
import jakarta.servlet.http.HttpServletRequest;
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
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/v1/demo")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

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
        String email = userData.get("email");
        String password = userData.get("password");

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists.");
        }

        // Create and save the new user
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        try {
            // Automatically log the user in after signup
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Store context in session
            request.getSession().setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            System.out.println("Signup and login successful for: " + email + ", Session ID: " + request.getSession().getId());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Signup successful and logged in!");
            response.put("email", email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Signup succeeded but login failed: " + email + ", Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Signup succeeded, but login failed.");
        }
    }


    @PostMapping("/signin")
    public ResponseEntity<?> signin(
            @RequestBody Map<String, String> userData,
            HttpServletRequest request // <-- Added to persist session
    ) {
        String email = userData.get("email");
        String password = userData.get("password");

        try {
            // Authenticate user using AuthenticationManager
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            // Store Authentication in SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Persist SecurityContext in session manually
            request.getSession().setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            System.out.println("Email login successful for: " + email + ", Session ID: " + request.getSession().getId());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful!");
            response.put("email", email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Email login failed for: " + email + ", Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> getUserDetails(@AuthenticationPrincipal Object principal) {
        Map<String, String> response = new HashMap<>();

        if (principal == null) {
            System.out.println("No principal found for /me request");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        if (principal instanceof OAuth2User oauthUser) {
            String name = oauthUser.getAttribute("name"); // e.g., "Devanga Palliyaguru"
            String login = oauthUser.getAttribute("login"); // e.g., "Devangap" (GitHub username)
            String email = oauthUser.getAttribute("email"); // May be null for GitHub

            // Prefer name, then login
            response.put("name", name != null ? name : login);
            response.put("username", login);
            response.put("email", email); // This may be null

            System.out.println("OAuth2 user accessed /me: " + (email != null ? email : login));
        } else if (principal instanceof org.springframework.security.core.userdetails.User user) {
            response.put("email", user.getUsername());
            response.put("name", user.getUsername());
            response.put("username", user.getUsername());

            System.out.println("Email user accessed /me: " + user.getUsername());
        } else {
            System.out.println("Unknown principal type: " + principal.getClass());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        return ResponseEntity.ok(response);
    }

}