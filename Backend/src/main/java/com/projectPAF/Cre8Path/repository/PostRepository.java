package com.projectPAF.Cre8Path.repository;

import com.projectPAF.Cre8Path.model.Post;
import com.projectPAF.Cre8Path.model.Profile;
import com.projectPAF.Cre8Path.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUser(User user);
    List<Post> findAllByOrderByCreatedAtDesc();
//    List<Post> findByUserUsername(String username);
    List<Post> findByUserEmail(String email);
//    List<Post> findByUserInOrderByCreatedAtDesc(List<User> users);
    List<Post> findByUserInOrderByCreatedAtDesc(List<User> users);





}