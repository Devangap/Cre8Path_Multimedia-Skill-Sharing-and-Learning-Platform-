package com.projectPAF.Cre8Path.config;

import com.projectPAF.Cre8Path.Repository.UserRepository;
import com.projectPAF.Cre8Path.model.User;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId(); // google or facebook

        Object emailObj = oAuth2User.getAttribute("email");
        String email = (emailObj != null) ? emailObj.toString() : null;

        Object oauthIdObj = oAuth2User.getAttribute("sub"); // Google
        if (oauthIdObj == null) {
            oauthIdObj = oAuth2User.getAttribute("id"); // Facebook
        }
        String oauthId = (oauthIdObj != null) ? oauthIdObj.toString() : null;

        if ("facebook".equals(provider)) {
            if (email == null && oauthId != null) {
                email = "facebook_" + oauthId + "@noemail.cre8path";
            }
        }

        if (email == null && oauthId == null) {
            throw new OAuth2AuthenticationException("No valid identifier (email or oauth ID)");
        }

        Optional<User> optionalUser = userRepository.findByEmailOrOauthId(email, oauthId);
        final String finalEmail = email;
        final String finalOauthId = oauthId;

        User user = optionalUser.orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(finalEmail);
            newUser.setOauthId(finalOauthId);
            newUser.setFirstTimeLogin(true);
            newUser.setPassword("OAUTH2_USER"); // <-- Dummy password to fix NULL error
            return userRepository.save(newUser);
        });


        return oAuth2User;
    }


}
