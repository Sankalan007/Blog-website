package com.sankalan.blogapp.controller;

import com.sankalan.blogapp.model.*;
import com.sankalan.blogapp.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ){
        return ResponseEntity.ok(authenticationService.register(request));
    }
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ){
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @GetMapping("/user-details")
    public ResponseEntity<User> getUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User userDetails = (User) authentication.getPrincipal();

        var response = User.builder()
                .id(userDetails.getId())
                .firstName(userDetails.getFirstName())
                .lastName(userDetails.getLastName())
                .userName(userDetails.getUserName())
                .email(userDetails.getEmail())
                .password(userDetails.getPassword())
                .role(Role.USER)
                .build();
        return ResponseEntity.ok(response);
    }
}