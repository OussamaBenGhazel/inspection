package com.inspection;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inspection.dto.EvaluationDTO;
import com.inspection.dto.InspectionDTO;
import com.inspection.model.Enseignant;
import com.inspection.model.Inspecteur;
import com.inspection.model.Inspection;
import com.inspection.repository.EnseignantRepository;
import com.inspection.repository.InspecteurRepository;
import com.inspection.repository.InspectionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class InspectionApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private InspecteurRepository inspecteurRepository;

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Autowired
    private InspectionRepository inspectionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testAuthenticationSuccess() throws Exception {
        String loginJson = "{\"username\": \"admin\", \"password\": \"admin\"}";

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.inspecteur.username").value("admin"));
    }

    @Test
    public void testAuthenticationFailure() throws Exception {
        String loginJson = "{\"username\": \"admin\", \"password\": \"wrongpass\"}";

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isUnauthorized());
    }

    private String obtainAccessToken() throws Exception {
        String loginJson = "{\"username\": \"admin\", \"password\": \"admin\"}";
        String response = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andReturn().getResponse().getContentAsString();

        com.fasterxml.jackson.databind.JsonNode root = objectMapper.readTree(response);
        return root.path("token").asText();
    }

    @Test
    public void testGetEnseignants() throws Exception {
        String token = obtainAccessToken();
        mockMvc.perform(get("/api/enseignants")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testCreateAndGetInspection() throws Exception {
        String token = obtainAccessToken();
        List<Inspecteur> inspecteurs = inspecteurRepository.findAll();
        List<Enseignant> enseignants = enseignantRepository.findAll();

        assertThat(inspecteurs).isNotEmpty();
        assertThat(enseignants).isNotEmpty();

        InspectionDTO dto = new InspectionDTO();
        dto.setIdInspecteur(inspecteurs.get(0).getIdInspecteur());
        dto.setIdEnseignant(enseignants.get(0).getIdEnseignant());
        dto.setDateVisite(LocalDate.now());
        dto.setHeureDebut(LocalTime.of(8, 0));
        dto.setHeureFin(LocalTime.of(9, 30));
        dto.setRemarquesGenerales("ممتاز");

        EvaluationDTO evDto = new EvaluationDTO();
        evDto.setCritere("التحضير");
        evDto.setNote(8);
        evDto.setCommentaire("ممتاز جدا");
        dto.setEvaluations(List.of(evDto));

        String requestBody = objectMapper.writeValueAsString(dto);

        mockMvc.perform(post("/api/inspections")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statut").value("ouverte"))
                .andExpect(jsonPath("$.remarquesGenerales").value("ممتاز"));
    }

    @Test
    public void testGetPdfReport() throws Exception {
        String token = obtainAccessToken();
        List<Inspection> inspections = inspectionRepository.findAll();
        assertThat(inspections).isNotEmpty();
        Long id = inspections.get(0).getIdInspection();

        mockMvc.perform(get("/api/inspections/" + id + "/report")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF));

        // Test with query parameter token
        mockMvc.perform(get("/api/inspections/" + id + "/report?token=" + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF));
    }

    @Test
    public void testGetExcelReport() throws Exception {
        String token = obtainAccessToken();
        List<Inspection> inspections = inspectionRepository.findAll();
        assertThat(inspections).isNotEmpty();
        Long id = inspections.get(0).getIdInspection();

        mockMvc.perform(get("/api/inspections/" + id + "/excel")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));

        // Test with query parameter token
        mockMvc.perform(get("/api/inspections/" + id + "/excel?token=" + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
    }
}
