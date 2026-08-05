package com.inspection.dto;

import com.inspection.model.Inspecteur;

public class LoginResponse {
    private String token; // simple mockup session token
    private Inspecteur inspecteur;

    public LoginResponse(String token, Inspecteur inspecteur) {
        this.token = token;
        this.inspecteur = inspecteur;
    }

    public String getToken() {
        return token;
    }

    public Inspecteur getInspecteur() {
        return inspecteur;
    }
}
