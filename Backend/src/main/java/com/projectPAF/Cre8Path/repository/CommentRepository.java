package com.projectPAF.Cre8Path.repository;

import com.projectPAF.Cre8Path.model.Comment;
import com.projectPAF.Cre8Path.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostOrderByCreatedAtAsc(Post post);
}
