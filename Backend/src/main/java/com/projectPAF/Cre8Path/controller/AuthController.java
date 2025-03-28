package com.projectPAF.Cre8Path.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/demo")
public class  AuthController {
    @GetMapping
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Crea8Path Homepage!");
    }
}
