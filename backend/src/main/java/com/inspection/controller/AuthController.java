package com.inspection.controller;

import com.inspection.dto.LoginRequest;
import com.inspection.dto.LoginResponse;
import com.inspection.model.Inspecteur;
import com.inspection.repository.InspecteurRepository;
import com.inspection.service.PasswordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final InspecteurRepository inspecteurRepository;
    private final PasswordService passwordService;

    public AuthController(InspecteurRepository inspecteurRepository, PasswordService passwordService) {
        this.inspecteurRepository = inspecteurRepository;
        this.passwordService = passwordService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Inspecteur inspecteur = inspecteurRepository.findByUsername(loginRequest.getUsername()).orElse(null);

        if (inspecteur == null || !passwordService.checkPassword(loginRequest.getPassword(), inspecteur.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        // Mock token generation
        String mockToken = UUID.randomUUID().toString();
        return ResponseEntity.ok(new LoginResponse(mockToken, inspecteur));
    }
}
