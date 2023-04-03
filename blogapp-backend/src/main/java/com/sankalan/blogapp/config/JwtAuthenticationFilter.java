package com.sankalan.blogapp.config;

import com.sankalan.blogapp.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        // Get Authorization header from request
        final String authHeader = request.getHeader("Authorization");
        // Declare variables for JWT and user email
        final String jwt;
        final String userEmail;

        // Check if Authorization header is present and starts with "Bearer "
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            // Pass the request and response objects to the next filter in the chain
            filterChain.doFilter(request, response);
            return;
        }
        // Extract JWT from Authorization header
        jwt = authHeader.substring(7);
        // Extract user email from JWT
        userEmail = jwtService.extractUsername(jwt);
        // Check if user email is not null and the current authentication context is not already authenticated
        if(userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null){
            // Load user details from user details service
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            if(jwtService.isTokenValid(jwt, userDetails)){
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

        }
        filterChain.doFilter(request, response);
    }
}
