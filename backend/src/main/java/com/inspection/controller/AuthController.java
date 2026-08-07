package com.inspection.controller;

import com.inspection.dto.LoginRequest;
import com.inspection.dto.LoginResponse;
import com.inspection.model.Inspecteur;
import com.inspection.repository.InspecteurRepository;
import com.inspection.service.PasswordService;
import com.inspection.service.JwtUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final InspecteurRepository inspecteurRepository;
    private final PasswordService passwordService;
    private final JwtUtils jwtUtils;

    public AuthController(InspecteurRepository inspecteurRepository, PasswordService passwordService, JwtUtils jwtUtils) {
        this.inspecteurRepository = inspecteurRepository;
        this.passwordService = passwordService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Inspecteur inspecteur = inspecteurRepository.findByUsername(loginRequest.getUsername()).orElse(null);

        if (inspecteur == null || !passwordService.checkPassword(loginRequest.getPassword(), inspecteur.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        // Generate a valid JWT token
        String jwtToken = jwtUtils.generateToken(inspecteur.getUsername());
        return ResponseEntity.ok(new LoginResponse(jwtToken, inspecteur));
    }
}
