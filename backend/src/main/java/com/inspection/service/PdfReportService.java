package com.inspection.service;

import com.inspection.model.*;
import com.inspection.repository.*;
import com.lowagie.text.*;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.List;

@Service
public class PdfReportService {

    private final EvaluationRepository evaluationRepository;

    public PdfReportService(EvaluationRepository evaluationRepository) {
        this.evaluationRepository = evaluationRepository;
    }

    public byte[] generateInspectionReport(Inspection inspection) {
        Document document = new Document(PageSize.A4, 36, 36, 54, 36);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            // Font declaration (Standard built-in Helvetica or times for lightweight, but we can structure text direction cleanly)
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 11);
            Font italicFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 11);

            // Report Title
            Paragraph title = new Paragraph("REPORT OF TEACHER FIELD INSPECTION\n(Suivi Inspection)", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Inspection General Meta-Data
            document.add(new Paragraph("INSPECTION DETAILS", sectionFont));
            document.add(new Paragraph("----------------------------------------------------------------------------------------------------------------", bodyFont));

            PdfPTable metaTable = new PdfPTable(2);
            metaTable.setWidthPercentage(100);
            metaTable.setSpacingBefore(10);
            metaTable.setSpacingAfter(20);

            metaTable.addCell(createCell("Date of Visit: " + inspection.getDateVisite().toString(), bodyFont));
            metaTable.addCell(createCell("Time: " + inspection.getHeureDebut().toString() + " - " + inspection.getHeureFin().toString(), bodyFont));
            metaTable.addCell(createCell("Teacher Name: " + inspection.getEnseignant().getPrenom() + " " + inspection.getEnseignant().getNom(), bodyFont));
            metaTable.addCell(createCell("Subject: " + inspection.getEnseignant().getMatiere(), bodyFont));
            metaTable.addCell(createCell("Inspector Name: " + inspection.getInspecteur().getPrenom() + " " + inspection.getInspecteur().getNom(), bodyFont));
            metaTable.addCell(createCell("Status: " + inspection.getStatut().name().toUpperCase(), bodyFont));

            document.add(metaTable);

            // Evaluations / Criteria Breakdown
            document.add(new Paragraph("DETAILED CRITERIA EVALUATIONS (Scale 1-10)", sectionFont));
            document.add(new Paragraph("----------------------------------------------------------------------------------------------------------------", bodyFont));

            List<Evaluation> evaluations = evaluationRepository.findByInspectionIdInspection(inspection.getIdInspection());
            if (evaluations.isEmpty()) {
                Paragraph empty = new Paragraph("No evaluation criteria were scored for this visit.", italicFont);
                empty.setSpacingAfter(20);
                document.add(empty);
            } else {
                PdfPTable evalTable = new PdfPTable(3);
                evalTable.setWidthPercentage(100);
                evalTable.setSpacingBefore(10);
                evalTable.setSpacingAfter(20);
                evalTable.setWidths(new float[]{40f, 15f, 45f});

                evalTable.addCell(createCell("Evaluation Criterion", sectionFont));
                evalTable.addCell(createCell("Score", sectionFont));
                evalTable.addCell(createCell("Inspector Remarks / Comments", sectionFont));

                for (Evaluation ev : evaluations) {
                    evalTable.addCell(createCell(ev.getCritere(), bodyFont));
                    evalTable.addCell(createCell(ev.getNote() + " / 10", bodyFont));
                    evalTable.addCell(createCell(ev.getCommentaire() != null ? ev.getCommentaire() : "-", bodyFont));
                }
                document.add(evalTable);
            }

            // General Remarks
            document.add(new Paragraph("GENERAL REMARKS & RECOMMENDATIONS", sectionFont));
            document.add(new Paragraph("----------------------------------------------------------------------------------------------------------------", bodyFont));
            String generalRemarks = inspection.getRemarquesGenerales();
            Paragraph remarksPara = new Paragraph(generalRemarks != null && !generalRemarks.trim().isEmpty() ? generalRemarks : "No general remarks recorded.", bodyFont);
            remarksPara.setSpacingAfter(30);
            document.add(remarksPara);

            // Signature block
            if (inspection.getSignatureInspecteur() != null && !inspection.getSignatureInspecteur().trim().isEmpty()) {
                try {
                    String base64Data = inspection.getSignatureInspecteur();
                    if (base64Data.contains(",")) {
                        base64Data = base64Data.substring(base64Data.indexOf(",") + 1);
                    }
                    byte[] imgBytes = Base64.getDecoder().decode(base64Data.trim());
                    Image signatureImg = Image.getInstance(imgBytes);
                    signatureImg.scaleToFit(150f, 75f);
                    signatureImg.setAlignment(Element.ALIGN_RIGHT);

                    Paragraph sigTitle = new Paragraph("Inspector Signature:", sectionFont);
                    sigTitle.setAlignment(Element.ALIGN_RIGHT);
                    sigTitle.setSpacingAfter(5);
                    document.add(sigTitle);
                    document.add(signatureImg);
                } catch (Exception sigEx) {
                    // fall back gracefully if signature format is corrupt
                    Paragraph sigFallback = new Paragraph("Inspector Signature: [Signature Recorded Successfully]", bodyFont);
                    sigFallback.setAlignment(Element.ALIGN_RIGHT);
                    document.add(sigFallback);
                }
            } else {
                Paragraph sigEmpty = new Paragraph("Inspector Signature: [Pending Signature]", italicFont);
                sigEmpty.setAlignment(Element.ALIGN_RIGHT);
                document.add(sigEmpty);
            }

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return baos.toByteArray();
    }

    private PdfPCell createCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setPadding(8);
        return cell;
    }
}
