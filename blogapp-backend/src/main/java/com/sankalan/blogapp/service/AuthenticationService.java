package com.sankalan.blogapp.service;

import com.sankalan.blogapp.model.*;
import com.sankalan.blogapp.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private static final Logger logger = Logger.getLogger(AuthenticationService.class.getName());

    public AuthenticationResponse register(RegisterRequest request) {
        logger.info("Starting register for user: " + request.getEmail());
        try {
            var user = User.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .userName(request.getUserName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.USER)
                    .build();
            userRepository.save(user);
            var jwtToken = jwtService.generateToken(user);
            return AuthenticationResponse.builder().token(jwtToken).build();
        }
        catch (AuthenticationException ex){
            logger.warning("Register failed for user: " + request.getEmail() + " - " + ex.getMessage());
            throw ex;
        }
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        logger.info("Starting authentication for user: " + request.getEmail());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            var user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            var jwtToken = jwtService.generateToken(user);
            return AuthenticationResponse.builder().token(jwtToken).build();
        } catch (AuthenticationException ex) {
            logger.warning("Authentication failed for user: " + request.getEmail() + " - " + ex.getMessage());
            throw ex;
        }
    }

}
