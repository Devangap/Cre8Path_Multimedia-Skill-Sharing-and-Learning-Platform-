package com.projectPAF.Cre8Path.service;

import com.projectPAF.Cre8Path.repository.UserRepository;
import com.projectPAF.Cre8Path.model.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    public ResponseEntity<?> signup(Map<String, String> userData, HttpServletRequest request) {
        String email = userData.get("email");
        String password = userData.get("password");

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists.");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            request.getSession().setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Signup successful and logged in!");
            response.put("email", email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Signup succeeded, but login failed.");
        }
    }

    public ResponseEntity<?> signin(Map<String, String> userData, HttpServletRequest request) {
        String email = userData.get("email");
        String password = userData.get("password");

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            request.getSession().setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful!");
            response.put("email", email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        }
    }

    public ResponseEntity<Map<String, String>> getUserDetails(Object principal) {
        Map<String, String> response = new HashMap<>();

        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        if (principal instanceof OAuth2User oauthUser) {
            String email = oauthUser.getAttribute("email");
            String name = oauthUser.getAttribute("name");
            String login = oauthUser.getAttribute("login");
            String oauthId = oauthUser.getAttribute("sub");

            response.put("name", name != null ? name : login);
            response.put("username", login);
            response.put("email", email);
            response.put("oauthId", oauthId); // ✅ ADD THIS


            // ✅ Lookup firstTimeLogin from DB
            userRepository.findByEmail(email).ifPresent(user ->
                    response.put("firstTimeLogin", String.valueOf(user.isFirstTimeLogin()))
            );

        } else if (principal instanceof UserDetails userDetails) {
            String email = userDetails.getUsername();
            response.put("name", email);
            response.put("username", email);
            response.put("email", email);


            userRepository.findByEmail(email).ifPresent(user ->
                    response.put("firstTimeLogin", String.valueOf(user.isFirstTimeLogin()))
            );
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<String> completeQuestionnaire(Object principal) {
        String email = null;

        if (principal instanceof OAuth2User oauthUser) {
            email = oauthUser.getAttribute("email");
        } else if (principal instanceof UserDetails user) {
            email = user.getUsername();
        }

        if (email != null) {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                user.setFirstTimeLogin(false); // ✅ Set to false
                userRepository.save(user);
                return ResponseEntity.ok("Questionnaire completed.");
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
    }



}
