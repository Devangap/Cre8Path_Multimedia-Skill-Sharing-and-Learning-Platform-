package com.projectPAF.Cre8Path.controller;

import com.projectPAF.Cre8Path.service.DataExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final DataExportService dataExportService;

    @GetMapping("/export-users")
    public ResponseEntity<String> exportUsers() {
        try {
            dataExportService.exportUsers();
            return ResponseEntity.ok("users.csv exported!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/export-dataset")
    public ResponseEntity<String> exportDataset() {
        try {
            dataExportService.exportDataset();
            return ResponseEntity.ok("dataset.csv exported!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    @GetMapping("/export-posts")
    public ResponseEntity<String> exportPosts() {
        try {
            dataExportService.exportPosts();
            return ResponseEntity.ok("posts.csv exported!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
