package com.inspection.service;

import com.inspection.model.Inspecteur;
import com.inspection.repository.InspecteurRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final InspecteurRepository inspecteurRepository;

    public CustomUserDetailsService(InspecteurRepository inspecteurRepository) {
        this.inspecteurRepository = inspecteurRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Inspecteur inspecteur = inspecteurRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        String role = inspecteur.getRole() != null ? inspecteur.getRole().toUpperCase() : "INSPECTEUR";
        return new User(
                inspecteur.getUsername(),
                inspecteur.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + role))
        );
    }
}
