package com.inspection.service;

import com.inspection.model.*;
import com.inspection.repository.*;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.Base64;
import java.util.List;

@Service
public class PdfReportService {

    private final EvaluationRepository evaluationRepository;
    private final EvaluationCompetenceRepository evaluationCompetenceRepository;
    private final RecommandationRepository recommandationRepository;
    private final DiagnosticFinalRepository diagnosticFinalRepository;

    public PdfReportService(
            EvaluationRepository evaluationRepository,
            EvaluationCompetenceRepository evaluationCompetenceRepository,
            RecommandationRepository recommandationRepository,
            DiagnosticFinalRepository diagnosticFinalRepository) {
        this.evaluationRepository = evaluationRepository;
        this.evaluationCompetenceRepository = evaluationCompetenceRepository;
        this.recommandationRepository = recommandationRepository;
        this.diagnosticFinalRepository = diagnosticFinalRepository;
    }

    private BaseFont getArabicBaseFont() {
        String[] fontPaths = {
                "C:/Windows/Fonts/arial.ttf",
                "C:/Windows/Fonts/tahoma.ttf",
                "C:/Windows/Fonts/seguiui.ttf",
                "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
        };
        for (String path : fontPaths) {
            try {
                File file = new File(path);
                if (file.exists()) {
                    return BaseFont.createFont(path, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
                }
            } catch (Exception ignored) {
            }
        }
        try {
            return BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
        } catch (Exception e) {
            throw new RuntimeException("Could not initialize BaseFont", e);
        }
    }

    public byte[] generateInspectionReport(Inspection inspection) {
        Document document = new Document(PageSize.A4, 32, 32, 36, 36);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, baos);
            writer.setRunDirection(PdfWriter.RUN_DIRECTION_RTL);
            document.open();

            BaseFont bf = getArabicBaseFont();

            // Color Palette
            Color brandNavy = new Color(18, 48, 71);     // #123047
            Color brandTeal = new Color(13, 108, 125);   // #0D6C7D
            Color brandOrange = new Color(230, 126, 34); // #E67E22
            Color slateDark = new Color(30, 41, 59);
            Color slateLight = new Color(248, 250, 252);
            Color slateBorder = new Color(226, 232, 240);
            Color headerBg = new Color(235, 243, 245);

            // Typography
            Font superTitleFont = new Font(bf, 11, Font.BOLD, brandNavy);
            Font titleFont = new Font(bf, 15, Font.BOLD, brandNavy);
            Font subtitleFont = new Font(bf, 11, Font.NORMAL, brandTeal);
            Font sectionFont = new Font(bf, 11, Font.BOLD, brandTeal);
            Font tableHeaderFont = new Font(bf, 9, Font.BOLD, Color.WHITE);
            Font labelFont = new Font(bf, 8, Font.BOLD, brandNavy);
            Font valueFont = new Font(bf, 8, Font.NORMAL, slateDark);
            Font bodyFont = new Font(bf, 8, Font.NORMAL, slateDark);
            Font noteFont = new Font(bf, 9, Font.BOLD, brandTeal);

            // 1. Institutional Top Header (Ministry Emblem & Republic Details)
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setRunDirection(PdfWriter.RUN_DIRECTION_RTL);
            headerTable.setWidths(new float[]{55f, 45f});

            PdfPCell hRight = createRtlCell("الجمهورية التونسية\nوزارة التربية\nالإدارة العامة للتفقد البيداغوجي", superTitleFont, Element.ALIGN_RIGHT, null, 2);
            hRight.setBorder(Rectangle.NO_BORDER);

            String schoolYear = "السنة الدراسية: 2026/2027\nمرجع التفقد الميداني: INS-" + inspection.getIdInspection() + "\nتاريخ التقرير: " + java.time.LocalDate.now();
            PdfPCell hLeft = createRtlCell(schoolYear, subtitleFont, Element.ALIGN_LEFT, null, 2);
            hLeft.setBorder(Rectangle.NO_BORDER);

            headerTable.addCell(hRight);
            headerTable.addCell(hLeft);
            document.add(headerTable);

            // Title Banner
            PdfPTable bannerTable = new PdfPTable(1);
            bannerTable.setWidthPercentage(100);
            bannerTable.setSpacingBefore(10);
            bannerTable.setSpacingAfter(12);

            PdfPCell bannerCell = createRtlCell("بطاقة التفقد ومتابعة التطور المهني — مادة التربية المدنية", titleFont, Element.ALIGN_CENTER, headerBg, 8);
            bannerCell.setBorderColor(brandTeal);
            bannerCell.setBorderWidth(1.2f);
            bannerTable.addCell(bannerCell);
            document.add(bannerTable);

            // 2. Section: General Metadata
            addSectionHeader(document, "1. البيانات العامة للمدرس والزيارة الميدانية", sectionFont, brandTeal);

            PdfPTable metaTable = new PdfPTable(4);
            metaTable.setWidthPercentage(100);
            metaTable.setRunDirection(PdfWriter.RUN_DIRECTION_RTL);
            metaTable.setWidths(new float[]{20f, 30f, 20f, 30f});
            metaTable.setSpacingBefore(4);
            metaTable.setSpacingAfter(10);

            String teacherName = inspection.getEnseignant() != null ?
                    inspection.getEnseignant().getPrenom() + " " + inspection.getEnseignant().getNom() : "-";
            String inspectorName = inspection.getInspecteur() != null ?
                    inspection.getInspecteur().getPrenom() + " " + inspection.getInspecteur().getNom() : "-";
            String schoolName = (inspection.getEnseignant() != null && inspection.getEnseignant().getEtablissement() != null) ?
                    inspection.getEnseignant().getEtablissement().getNom() : "المؤسسة التربوية";
            String regionName = (inspection.getEnseignant() != null && inspection.getEnseignant().getRegion() != null) ?
                    inspection.getEnseignant().getRegion().getNom() : (inspection.getInspecteur() != null && inspection.getInspecteur().getRegion() != null ? inspection.getInspecteur().getRegion().getNom() : "تونس");
            String visitType = inspection.getTypeVisite() != null ? inspection.getTypeVisite().getLibelle() : "تقييمية";
            String teacherStatus = inspection.getEnseignant() != null && inspection.getEnseignant().getStatut() != null ?
                    inspection.getEnseignant().getStatut() : "أستاذ أول";

            addMetaField(metaTable, "الأستاذ المعني:", teacherName, labelFont, valueFont, slateLight);
            addMetaField(metaTable, "المؤسسة التربوية:", schoolName, labelFont, valueFont, slateLight);

            addMetaField(metaTable, "المتفقد المشرف:", inspectorName, labelFont, valueFont, slateLight);
            addMetaField(metaTable, "المندوبية الجهوية:", regionName, labelFont, valueFont, slateLight);

            addMetaField(metaTable, "تاريخ الزيارة:", inspection.getDateVisite().toString(), labelFont, valueFont, slateLight);
            addMetaField(metaTable, "التوقيت الصفي:", inspection.getHeureDebut() + " - " + inspection.getHeureFin(), labelFont, valueFont, slateLight);

            addMetaField(metaTable, "نوع الزيارة:", visitType, labelFont, valueFont, slateLight);
            addMetaField(metaTable, "الرتبة والصفة:", teacherStatus, labelFont, valueFont, slateLight);

            document.add(metaTable);

            // 3. Section: 8 Pedagogical Competencies
            addSectionHeader(document, "2. شبكة تقييم الكفايات البيداغوجية الثمانية", sectionFont, brandTeal);

            List<EvaluationCompetence> compList = evaluationCompetenceRepository.findByInspectionIdInspection(inspection.getIdInspection());

            PdfPTable compTable = new PdfPTable(6);
            compTable.setWidthPercentage(100);
            compTable.setRunDirection(PdfWriter.RUN_DIRECTION_RTL);
            compTable.setWidths(new float[]{6f, 25f, 12f, 15f, 15f, 27f});
            compTable.setSpacingBefore(4);
            compTable.setSpacingAfter(10);

            // Header row
            String[] headers = {"الرقم", "مجال الكفاية", "العدد / 4", "المستوى", "اتجاه التطور", "الملاحظات البيداغوجية"};
            for (String h : headers) {
                PdfPCell thCell = createRtlCell(h, tableHeaderFont, Element.ALIGN_CENTER, brandTeal, 5);
                compTable.addCell(thCell);
            }

            if (compList.isEmpty()) {
                List<Evaluation> evList = evaluationRepository.findByInspectionIdInspection(inspection.getIdInspection());
                int idx = 1;
                for (Evaluation ev : evList) {
                    Color bg = (idx % 2 == 0) ? slateLight : Color.WHITE;
                    compTable.addCell(createRtlCell(String.valueOf(idx++), labelFont, Element.ALIGN_CENTER, bg, 4));
                    compTable.addCell(createRtlCell(ev.getCritere(), labelFont, Element.ALIGN_RIGHT, bg, 4));
                    compTable.addCell(createRtlCell(ev.getNote() + " / 10", noteFont, Element.ALIGN_CENTER, bg, 4));
                    compTable.addCell(createRtlCell(ev.getNote() >= 7 ? "متقن" : "مرض", valueFont, Element.ALIGN_CENTER, bg, 4));
                    compTable.addCell(createRtlCell("↔ مستقر", valueFont, Element.ALIGN_CENTER, bg, 4));
                    compTable.addCell(createRtlCell(ev.getCommentaire() != null ? ev.getCommentaire() : "-", valueFont, Element.ALIGN_RIGHT, bg, 4));
                }
            } else {
                int idx = 1;
                for (EvaluationCompetence ec : compList) {
                    Color bg = (idx % 2 == 0) ? slateLight : Color.WHITE;
                    compTable.addCell(createRtlCell(String.valueOf(idx++), labelFont, Element.ALIGN_CENTER, bg, 4));
                    compTable.addCell(createRtlCell(ec.getDomaine(), labelFont, Element.ALIGN_RIGHT, bg, 4));
                    compTable.addCell(createRtlCell(String.format("%.1f", ec.getNote()), noteFont, Element.ALIGN_CENTER, bg, 4));
                    compTable.addCell(createRtlCell(ec.getNiveau() != null ? ec.getNiveau() : "-", valueFont, Element.ALIGN_CENTER, bg, 4));
                    compTable.addCell(createRtlCell(ec.getTendance() != null ? ec.getTendance() : "↔ مستقر", valueFont, Element.ALIGN_CENTER, bg, 4));
                    compTable.addCell(createRtlCell(ec.getCommentaire() != null ? ec.getCommentaire() : "-", valueFont, Element.ALIGN_RIGHT, bg, 4));
                }
            }
            document.add(compTable);

            // 4. Section: Recommendations & Evidence
            addSectionHeader(document, "3. التوصيات البيداغوجية وشواهد الإنجاز والمتابعة", sectionFont, brandTeal);

            List<Recommandation> recList = (inspection.getEnseignant() != null) ?
                    recommandationRepository.findByEnseignantId(inspection.getEnseignant().getIdEnseignant()) : List.of();

            PdfPTable recTable = new PdfPTable(5);
            recTable.setWidthPercentage(100);
            recTable.setRunDirection(PdfWriter.RUN_DIRECTION_RTL);
            recTable.setWidths(new float[]{6f, 32f, 15f, 15f, 32f});
            recTable.setSpacingBefore(4);
            recTable.setSpacingAfter(10);

            String[] recHeaders = {"الرقم", "نص التوصية البيداغوجية", "أجل التنفيذ", "نسبة الإنجاز", "القرائن وشواهد التطبيق"};
            for (String h : recHeaders) {
                PdfPCell thCell = createRtlCell(h, tableHeaderFont, Element.ALIGN_CENTER, brandNavy, 5);
                recTable.addCell(thCell);
            }

            if (recList.isEmpty()) {
                PdfPCell empty = createRtlCell("لا توجد توصيات سابقة مسجلة لهذا الأستاذ.", bodyFont, Element.ALIGN_CENTER, Color.WHITE, 6);
                empty.setColspan(5);
                recTable.addCell(empty);
            } else {
                int rIdx = 1;
                for (Recommandation r : recList) {
                    Color bg = (rIdx % 2 == 0) ? slateLight : Color.WHITE;
                    recTable.addCell(createRtlCell(String.valueOf(rIdx++), labelFont, Element.ALIGN_CENTER, bg, 4));
                    recTable.addCell(createRtlCell(r.getLibelle(), labelFont, Element.ALIGN_RIGHT, bg, 4));
                    recTable.addCell(createRtlCell(r.getEcheance() != null ? r.getEcheance().toString() : "نهاية الثلاثي", valueFont, Element.ALIGN_CENTER, bg, 4));
                    recTable.addCell(createRtlCell((r.getTauxRealisation() != null ? r.getTauxRealisation() : 0) + "%", noteFont, Element.ALIGN_CENTER, bg, 4));
                    recTable.addCell(createRtlCell(r.getPointsActions() != null ? r.getPointsActions() : "قيد المتابعة الميدانية", valueFont, Element.ALIGN_RIGHT, bg, 4));
                }
            }
            document.add(recTable);

            // 5. Section: Final Diagnostic & General Remarks
            DiagnosticFinal diag = diagnosticFinalRepository.findByInspectionIdInspection(inspection.getIdInspection()).orElse(null);

            addSectionHeader(document, "4. التشخيص الختامي والملاحظات العامة", sectionFont, brandTeal);

            PdfPTable diagTable = new PdfPTable(2);
            diagTable.setWidthPercentage(100);
            diagTable.setRunDirection(PdfWriter.RUN_DIRECTION_RTL);
            diagTable.setWidths(new float[]{50f, 50f});
            diagTable.setSpacingBefore(4);
            diagTable.setSpacingAfter(8);

            String pointsForts = diag != null && diag.getPointsForts() != null ? diag.getPointsForts() : "سجل الأستاذ تقدماً إيجابياً في التخطيط وإشراك التلاميذ والانضباط الصفي.";
            String pointsFaibles = diag != null && diag.getPointsFaibles() != null ? diag.getPointsFaibles() : "مواصلة تنويع طرائق التقويم التكويني وتوظيف الموارد الرقمية في حصص الدعم.";

            PdfPCell cellForts = createRtlCell("• نقاط القوة والتطور المهني:\n" + pointsForts, bodyFont, Element.ALIGN_RIGHT, slateLight, 6);
            PdfPCell cellFaibles = createRtlCell("• مجالات الدعم ذات الأولوية:\n" + pointsFaibles, bodyFont, Element.ALIGN_RIGHT, slateLight, 6);
            diagTable.addCell(cellForts);
            diagTable.addCell(cellFaibles);
            document.add(diagTable);

            String generalRemarks = inspection.getRemarquesGenerales() != null && !inspection.getRemarquesGenerales().isBlank() ?
                    inspection.getRemarquesGenerales() : "حصة نموذجية استوفت الشروط البيداغوجية مع ضرورة مواكبة أثر التكوين المستمر.";

            PdfPTable remarksTable = new PdfPTable(1);
            remarksTable.setWidthPercentage(100);
            remarksTable.setRunDirection(PdfWriter.RUN_DIRECTION_RTL);
            remarksTable.setSpacingAfter(12);

            PdfPCell remCell = createRtlCell("الملاحظات والتوجيهات العامة للمتفقد المشرف:\n" + generalRemarks, bodyFont, Element.ALIGN_RIGHT, Color.WHITE, 6);
            remCell.setBorderColor(brandTeal);
            remarksTable.addCell(remCell);
            document.add(remarksTable);

            // 6. Signature Block
            PdfPTable sigTable = new PdfPTable(2);
            sigTable.setWidthPercentage(100);
            sigTable.setRunDirection(PdfWriter.RUN_DIRECTION_RTL);
            sigTable.setWidths(new float[]{50f, 50f});
            sigTable.setKeepTogether(true);

            PdfPCell sigLeft = createRtlCell("اطلعت عليه وأشهد بصحته\nالأستاذ(ة) المعني(ة)", labelFont, Element.ALIGN_CENTER, null, 2);
            sigLeft.setBorder(Rectangle.NO_BORDER);

            PdfPCell sigRight = createRtlCell("توقيع وختم المتفقد التربوي المشرف\n" + inspectorName, labelFont, Element.ALIGN_CENTER, null, 2);
            sigRight.setBorder(Rectangle.NO_BORDER);

            sigTable.addCell(sigLeft);
            sigTable.addCell(sigRight);

            // Signature image row
            PdfPCell imgLeftCell = new PdfPCell();
            imgLeftCell.setBorder(Rectangle.NO_BORDER);
            imgLeftCell.setPadding(4);
            imgLeftCell.setHorizontalAlignment(Element.ALIGN_CENTER);

            PdfPCell imgRightCell = new PdfPCell();
            imgRightCell.setBorder(Rectangle.NO_BORDER);
            imgRightCell.setPadding(4);
            imgRightCell.setHorizontalAlignment(Element.ALIGN_CENTER);

            boolean hasSignature = false;
            if (inspection.getSignatureInspecteur() != null && !inspection.getSignatureInspecteur().isBlank()) {
                try {
                    String base64Data = inspection.getSignatureInspecteur();
                    if (base64Data.contains(",")) {
                        base64Data = base64Data.substring(base64Data.indexOf(",") + 1);
                    }
                    byte[] imgBytes = Base64.getDecoder().decode(base64Data.trim());
                    Image signatureImg = Image.getInstance(imgBytes);
                    signatureImg.scaleToFit(120f, 55f);
                    signatureImg.setAlignment(Element.ALIGN_CENTER);
                    imgRightCell.addElement(signatureImg);
                    hasSignature = true;
                } catch (Exception ignored) {
                }
            }

            if (!hasSignature) {
                Paragraph certP = new Paragraph("معتمد ومؤشر إلكترونياً بالمنظومة\n[ختم المصلحة البيداغوجية]", subtitleFont);
                certP.setAlignment(Element.ALIGN_CENTER);
                imgRightCell.addElement(certP);
            }

            Paragraph profAck = new Paragraph("[تأشيرة الأستاذ]", subtitleFont);
            profAck.setAlignment(Element.ALIGN_CENTER);
            imgLeftCell.addElement(profAck);

            sigTable.addCell(imgLeftCell);
            sigTable.addCell(imgRightCell);

            document.add(sigTable);

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error generating Arabic PDF report: " + e.getMessage(), e);
        }

        return baos.toByteArray();
    }

    private void addSectionHeader(Document doc, String title, Font font, Color color) throws DocumentException {
        PdfPTable t = new PdfPTable(1);
        t.setWidthPercentage(100);
        t.setRunDirection(PdfWriter.RUN_DIRECTION_RTL);
        t.setSpacingBefore(4);

        PdfPCell c = createRtlCell(title, font, Element.ALIGN_RIGHT, null, 2);
        c.setBorder(Rectangle.BOTTOM);
        c.setBorderColor(color);
        c.setBorderWidth(1.2f);
        t.addCell(c);
        doc.add(t);
    }

    private void addMetaField(PdfPTable table, String label, String value, Font lFont, Font vFont, Color bg) {
        PdfPCell lCell = createRtlCell(label, lFont, Element.ALIGN_RIGHT, bg, 4);
        PdfPCell vCell = createRtlCell(value, vFont, Element.ALIGN_RIGHT, Color.WHITE, 4);
        table.addCell(lCell);
        table.addCell(vCell);
    }

    private PdfPCell createRtlCell(String text, Font font, int alignment, Color bgColor, int padding) {
        PdfPCell cell = new PdfPCell(new Paragraph(text != null ? text : "", font));
        cell.setRunDirection(PdfWriter.RUN_DIRECTION_RTL);
        cell.setHorizontalAlignment(alignment);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        if (bgColor != null) {
            cell.setBackgroundColor(bgColor);
        }
        cell.setPadding(padding);
        cell.setBorderColor(new Color(226, 232, 240));
        return cell;
    }
}
