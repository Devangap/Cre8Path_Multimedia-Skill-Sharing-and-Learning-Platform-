package com.projectPAF.Cre8Path.service;
import com.projectPAF.Cre8Path.model.Follow;
import com.projectPAF.Cre8Path.model.Profile;
import com.projectPAF.Cre8Path.repository.FollowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.projectPAF.Cre8Path.service.NotificationService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FollowService {
    private final FollowRepository followRepository;
    private final NotificationService notificationService;

    public boolean toggleFollow(Profile follower, Profile following) {
        Optional<Follow> existing = followRepository.findByFollowerAndFollowing(follower, following);

        if (existing.isPresent()) {
            followRepository.delete(existing.get());
            notificationService.createAndSend(following.getUser().getId(), follower.getUser().getEmail() + " unfollowed you", "UNFOLLOW", follower.getId());
            return false; // unfollowed
        } else {
            Follow follow = new Follow();
            follow.setFollower(follower);
            follow.setFollowing(following);
            followRepository.save(follow);
            notificationService.createAndSend(following.getUser().getId(), follower.getUser().getEmail() + " followed you", "FOLLOW", follower.getId());
            return true; // followed
        }
    }

    public boolean isFollowing(Profile follower, Profile following) {
        return followRepository.existsByFollowerAndFollowing(follower, following);
    }

    public long getFollowerCount(Profile profile) {
        return followRepository.countByFollowing(profile);
    }

    public long getFollowingCount(Profile profile) {
        return followRepository.countByFollower(profile);
    }
}

