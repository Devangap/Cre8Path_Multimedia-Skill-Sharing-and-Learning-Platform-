package com.projectPAF.Cre8Path.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password") // Remove nullable = false
    private String password;
    @Column(name = "first_time_login", nullable = false)
    private boolean firstTimeLogin = true; // <- This sets the default in Java

//    @Column(nullable = true)
//    private boolean firstTimeLogin = true;


    public void setEmail(String email) {
        this.email = email;
    }


    public String getEmail() {return email;}


    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }


//    public void setFirstTimeLogin(boolean firstTimeLogin) {
//        this.firstTimeLogin = firstTimeLogin;
//    }
//
//    public boolean isFirstTimeLogin() {
//        return firstTimeLogin;
//    }

    public boolean isFirstTimeLogin() {
        return firstTimeLogin;
    }

    public void setFirstTimeLogin(boolean firstTimeLogin) {
        this.firstTimeLogin = firstTimeLogin;
    }




//    private String role = "USER";
}


