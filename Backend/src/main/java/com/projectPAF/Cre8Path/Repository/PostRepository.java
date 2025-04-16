package com.projectPAF.Cre8Path.Repository;

import com.projectPAF.Cre8Path.model.Post;
import com.projectPAF.Cre8Path.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUser(User user);
    List<Post> findAllByOrderByCreatedAtDesc();
}