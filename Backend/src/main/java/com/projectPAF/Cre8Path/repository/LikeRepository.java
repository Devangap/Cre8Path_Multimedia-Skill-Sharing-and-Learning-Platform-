package com.projectPAF.Cre8Path.repository;

import com.projectPAF.Cre8Path.model.Like;
import com.projectPAF.Cre8Path.model.Post;
import com.projectPAF.Cre8Path.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByPostAndUser(Post post, User user);
    long countByPost(Post post);
    void deleteByPostAndUser(Post post, User user);
}
