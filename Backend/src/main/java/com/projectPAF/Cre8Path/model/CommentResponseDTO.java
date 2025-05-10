package com.projectPAF.Cre8Path.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class CommentResponseDTO {
    private Long id;
    private String authorDisplayName;
    private String authorEmail;
    private String content;
    private LocalDateTime createdAt;
    private List<CommentResponseDTO> replies;
    private String authorOauthId;

    // ✅ Constructor with only Comment (fallback)
    public CommentResponseDTO(Comment comment) {
        this(comment, resolveDisplayName(comment.getUser()));
    }

    // ✅ Constructor used from service layer
    public CommentResponseDTO(Comment comment, String displayName) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
        this.authorOauthId = comment.getUser().getOauthId();

        User user = comment.getUser();
        this.authorEmail = user.getEmail();
        this.authorDisplayName = displayName;

        this.replies = comment.getReplies() != null
                ? comment.getReplies().stream()
                .map(reply -> new CommentResponseDTO(reply, resolveDisplayName(reply.getUser())))
                .collect(Collectors.toList())
                : List.of();
    }

    private static String resolveDisplayName(User user) {
        if (user.getEmail() != null) return user.getEmail();
        if (user.getOauthId() != null) return "User-" + user.getOauthId();
        return "Unknown User";
    }

    public Long getId() { return id; }
    public String getAuthorDisplayName() { return authorDisplayName; }
    public String getAuthorEmail() { return authorEmail; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<CommentResponseDTO> getReplies() { return replies; }
    public String getAuthorOauthId() {
        return authorOauthId;
    }
}
