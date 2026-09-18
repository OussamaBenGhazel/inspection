package com.inspection.service;

import com.inspection.model.*;
import com.inspection.repository.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExcelReportService {

    private final EvaluationCompetenceRepository evaluationCompetenceRepository;
    private final RecommandationRepository recommandationRepository;
    private final EvaluationRepository evaluationRepository;

    public ExcelReportService(
            EvaluationCompetenceRepository evaluationCompetenceRepository,
            RecommandationRepository recommandationRepository,
            EvaluationRepository evaluationRepository) {
        this.evaluationCompetenceRepository = evaluationCompetenceRepository;
        this.recommandationRepository = recommandationRepository;
        this.evaluationRepository = evaluationRepository;
    }

    public byte[] generateExcelReport(Inspection inspection) {
        try (XSSFWorkbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            XSSFSheet sheet = workbook.createSheet("تقرير التفقد البيداغوجي");
            // Native Right-To-Left layout for Arabic
            sheet.setRightToLeft(true);

            // Palette Styles
            XSSFCellStyle titleStyle = createTitleStyle(workbook);
            XSSFCellStyle sectionHeaderStyle = createSectionHeaderStyle(workbook);
            XSSFCellStyle tableHeaderStyle = createTableHeaderStyle(workbook);
            XSSFCellStyle labelStyle = createLabelStyle(workbook);
            XSSFCellStyle valueStyle = createValueStyle(workbook);
            XSSFCellStyle dataStyle = createDataStyle(workbook, false);
            XSSFCellStyle dataAltStyle = createDataStyle(workbook, true);
            XSSFCellStyle numberStyle = createNumberStyle(workbook);

            int rowIdx = 0;

            // 1. Title Banner
            Row titleRow = sheet.createRow(rowIdx++);
            titleRow.setHeightInPoints(34);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("الجمهورية التونسية • وزارة التربية — بطاقة التفقد ومتابعة التطور المهني");
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 5));

            rowIdx++; // blank separator

            // 2. Metadata Section Header
            Row metaSecRow = sheet.createRow(rowIdx++);
            metaSecRow.setHeightInPoints(24);
            Cell metaSecCell = metaSecRow.createCell(0);
            metaSecCell.setCellValue("1. البيانات العامة للزيارة الميدانية");
            metaSecCell.setCellStyle(sectionHeaderStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowIdx - 1, rowIdx - 1, 0, 5));

            // Metadata Grid (4 columns: Label1, Value1, Label2, Value2)
            String teacherName = inspection.getEnseignant() != null ?
                    inspection.getEnseignant().getPrenom() + " " + inspection.getEnseignant().getNom() : "-";
            String inspectorName = inspection.getInspecteur() != null ?
                    inspection.getInspecteur().getPrenom() + " " + inspection.getInspecteur().getNom() : "-";
            String schoolName = (inspection.getEnseignant() != null && inspection.getEnseignant().getEtablissement() != null) ?
                    inspection.getEnseignant().getEtablissement().getNom() : "المؤسسة التربوية";
            String regionName = (inspection.getEnseignant() != null && inspection.getEnseignant().getRegion() != null) ?
                    inspection.getEnseignant().getRegion().getNom() : (inspection.getInspecteur() != null && inspection.getInspecteur().getRegion() != null ? inspection.getInspecteur().getRegion().getNom() : "تونس");
            String subject = inspection.getEnseignant() != null ? inspection.getEnseignant().getMatiere() : "التربية المدنية";
            String visitType = inspection.getTypeVisite() != null ? inspection.getTypeVisite().getLibelle() : "تقييمية";
            String status = "مفتوحة";
            if (inspection.getStatut() == InspectionStatut.cloturee) {
                status = "مغلقة ومصادق عليها";
            } else if (inspection.getStatut() == InspectionStatut.en_cours) {
                status = "قيد المعالجة";
            }

            addMetaRow(sheet, rowIdx++, "رقم الزيارة الميدانية:", String.valueOf(inspection.getIdInspection()), "تاريخ الزيارة:", inspection.getDateVisite().toString(), labelStyle, valueStyle);
            addMetaRow(sheet, rowIdx++, "توقيت الحصة:", inspection.getHeureDebut() + " إلى " + inspection.getHeureFin(), "نوع الزيارة:", visitType, labelStyle, valueStyle);
            addMetaRow(sheet, rowIdx++, "الأستاذ المتابع:", teacherName, "المادة المدرسة:", subject, labelStyle, valueStyle);
            addMetaRow(sheet, rowIdx++, "المتفقد التربوي المشرف:", inspectorName, "المؤسسة التربوية:", schoolName, labelStyle, valueStyle);
            addMetaRow(sheet, rowIdx++, "المندوبية الجهوية:", regionName, "حالة التقرير:", status, labelStyle, valueStyle);

            rowIdx++; // blank separator

            // 3. Competencies Table
            Row compSecRow = sheet.createRow(rowIdx++);
            compSecRow.setHeightInPoints(24);
            Cell compSecCell = compSecRow.createCell(0);
            compSecCell.setCellValue("2. شبكة تقييم الكفايات البيداغوجية الثمانية");
            compSecCell.setCellStyle(sectionHeaderStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowIdx - 1, rowIdx - 1, 0, 5));

            // Table Header
            Row thRow = sheet.createRow(rowIdx++);
            thRow.setHeightInPoints(26);
            String[] compHeaders = {"الرقم", "مجال الكفاية البيداغوجية", "العدد / 4", "المستوى التقديري", "مؤشر التطور", "الملاحظات والتوجيهات الإجرائية"};
            for (int i = 0; i < compHeaders.length; i++) {
                Cell c = thRow.createCell(i);
                c.setCellValue(compHeaders[i]);
                c.setCellStyle(tableHeaderStyle);
            }

            List<EvaluationCompetence> compList = evaluationCompetenceRepository.findByInspectionIdInspection(inspection.getIdInspection());
            if (compList.isEmpty()) {
                // Fallback to general evaluations
                List<Evaluation> evList = evaluationRepository.findByInspectionIdInspection(inspection.getIdInspection());
                int cIdx = 1;
                for (Evaluation ev : evList) {
                    Row dRow = sheet.createRow(rowIdx++);
                    dRow.setHeightInPoints(22);
                    XSSFCellStyle currentStyle = (cIdx % 2 == 0) ? dataAltStyle : dataStyle;

                    Cell c0 = dRow.createCell(0); c0.setCellValue(cIdx++); c0.setCellStyle(numberStyle);
                    Cell c1 = dRow.createCell(1); c1.setCellValue(ev.getCritere()); c1.setCellStyle(currentStyle);
                    Cell c2 = dRow.createCell(2); c2.setCellValue(ev.getNote() + " / 10"); c2.setCellStyle(numberStyle);
                    Cell c3 = dRow.createCell(3); c3.setCellValue(ev.getNote() >= 7 ? "متقن" : "مرض"); c3.setCellStyle(currentStyle);
                    Cell c4 = dRow.createCell(4); c4.setCellValue("↔ مستقر"); c4.setCellStyle(currentStyle);
                    Cell c5 = dRow.createCell(5); c5.setCellValue(ev.getCommentaire() != null ? ev.getCommentaire() : "-"); c5.setCellStyle(currentStyle);
                }
            } else {
                int cIdx = 1;
                for (EvaluationCompetence ec : compList) {
                    Row dRow = sheet.createRow(rowIdx++);
                    dRow.setHeightInPoints(22);
                    XSSFCellStyle currentStyle = (cIdx % 2 == 0) ? dataAltStyle : dataStyle;

                    Cell c0 = dRow.createCell(0); c0.setCellValue(cIdx++); c0.setCellStyle(numberStyle);
                    Cell c1 = dRow.createCell(1); c1.setCellValue(ec.getDomaine()); c1.setCellStyle(currentStyle);
                    Cell c2 = dRow.createCell(2); c2.setCellValue(String.format("%.1f / 4", ec.getNote())); c2.setCellStyle(numberStyle);
                    Cell c3 = dRow.createCell(3); c3.setCellValue(ec.getNiveau() != null ? ec.getNiveau() : "-"); c3.setCellStyle(currentStyle);
                    Cell c4 = dRow.createCell(4); c4.setCellValue(ec.getTendance() != null ? ec.getTendance() : "↔ مستقر"); c4.setCellStyle(currentStyle);
                    Cell c5 = dRow.createCell(5); c5.setCellValue(ec.getCommentaire() != null ? ec.getCommentaire() : "-"); c5.setCellStyle(currentStyle);
                }
            }

            rowIdx++; // blank separator

            // 4. Recommendations Table
            Row recSecRow = sheet.createRow(rowIdx++);
            recSecRow.setHeightInPoints(24);
            Cell recSecCell = recSecRow.createCell(0);
            recSecCell.setCellValue("3. سجل التوصيات البيداغوجية وشواهد الإنجاز");
            recSecCell.setCellStyle(sectionHeaderStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowIdx - 1, rowIdx - 1, 0, 5));

            Row recThRow = sheet.createRow(rowIdx++);
            recThRow.setHeightInPoints(26);
            String[] recHeaders = {"الرقم", "نص التوصية البيداغوجية", "أجل التنفيذ", "نسبة الإنجاز", "الحالة", "القرائن وشواهد التطبيق"};
            for (int i = 0; i < recHeaders.length; i++) {
                Cell c = recThRow.createCell(i);
                c.setCellValue(recHeaders[i]);
                c.setCellStyle(tableHeaderStyle);
            }

            List<Recommandation> recList = (inspection.getEnseignant() != null) ?
                    recommandationRepository.findByEnseignantId(inspection.getEnseignant().getIdEnseignant()) : List.of();

            if (recList.isEmpty()) {
                Row emptyRow = sheet.createRow(rowIdx++);
                emptyRow.setHeightInPoints(22);
                Cell emptyCell = emptyRow.createCell(0);
                emptyCell.setCellValue("لا توجد توصيات سابقة مسجلة لهذا الأستاذ.");
                emptyCell.setCellStyle(dataStyle);
                sheet.addMergedRegion(new CellRangeAddress(rowIdx - 1, rowIdx - 1, 0, 5));
            } else {
                int rIdx = 1;
                for (Recommandation r : recList) {
                    Row dRow = sheet.createRow(rowIdx++);
                    dRow.setHeightInPoints(24);
                    XSSFCellStyle currentStyle = (rIdx % 2 == 0) ? dataAltStyle : dataStyle;

                    Cell c0 = dRow.createCell(0); c0.setCellValue(rIdx++); c0.setCellStyle(numberStyle);
                    Cell c1 = dRow.createCell(1); c1.setCellValue(r.getLibelle()); c1.setCellStyle(currentStyle);
                    Cell c2 = dRow.createCell(2); c2.setCellValue(r.getEcheance() != null ? r.getEcheance().toString() : "نهاية الثلاثي"); c2.setCellStyle(currentStyle);
                    Cell c3 = dRow.createCell(3); c3.setCellValue((r.getTauxRealisation() != null ? r.getTauxRealisation() : 0) + "%"); c3.setCellStyle(numberStyle);
                    Cell c4 = dRow.createCell(4); c4.setCellValue(r.getStatut() != null ? r.getStatut() : "قيد المتابعة"); c4.setCellStyle(currentStyle);
                    Cell c5 = dRow.createCell(5); c5.setCellValue(r.getPointsActions() != null ? r.getPointsActions() : "قيد المتابعة الميدانية"); c5.setCellStyle(currentStyle);
                }
            }

            rowIdx++; // blank separator

            // 5. Remarks & Signature
            Row remSecRow = sheet.createRow(rowIdx++);
            remSecRow.setHeightInPoints(24);
            Cell remSecCell = remSecRow.createCell(0);
            remSecCell.setCellValue("4. الملاحظات العامة وتأشيرة التفقد");
            remSecCell.setCellStyle(sectionHeaderStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowIdx - 1, rowIdx - 1, 0, 5));

            Row remRow = sheet.createRow(rowIdx++);
            remRow.setHeightInPoints(40);
            Cell remCell = remRow.createCell(0);
            String remarks = inspection.getRemarquesGenerales() != null && !inspection.getRemarquesGenerales().isBlank() ?
                    inspection.getRemarquesGenerales() : "تمت الزيارة في ظروف بيداغوجية ملائمة وفق الأهداف المسطرة.";
            remCell.setCellValue("الملاحظات: " + remarks);
            remCell.setCellStyle(dataStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowIdx - 1, rowIdx - 1, 0, 5));

            Row sigRow = sheet.createRow(rowIdx++);
            sigRow.setHeightInPoints(24);
            Cell sigCell = sigRow.createCell(0);
            boolean hasSig = inspection.getSignatureInspecteur() != null && !inspection.getSignatureInspecteur().isBlank();
            sigCell.setCellValue("تأشيرة المتفقد: " + (hasSig ? "معتمد وممضى رقمياً من قبل المتفقد المشرف ✓" : "في انتظار التوقيع"));
            sigCell.setCellStyle(valueStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowIdx - 1, rowIdx - 1, 0, 5));

            // Auto-size columns with minimum padding for perfect Arabic readability
            for (int i = 0; i < 6; i++) {
                sheet.autoSizeColumn(i);
                int currentWidth = sheet.getColumnWidth(i);
                sheet.setColumnWidth(i, Math.max(currentWidth + 1600, 4500));
            }
            sheet.setColumnWidth(1, 11000); // Domain / recommendation name
            sheet.setColumnWidth(5, 14000); // Remarks & evidence text

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate Excel report", e);
        }
    }

    private void addMetaRow(XSSFSheet sheet, int rowIdx, String label1, String val1, String label2, String val2, XSSFCellStyle lStyle, XSSFCellStyle vStyle) {
        Row row = sheet.createRow(rowIdx);
        row.setHeightInPoints(22);

        Cell c0 = row.createCell(0); c0.setCellValue(label1); c0.setCellStyle(lStyle);
        Cell c1 = row.createCell(1); c1.setCellValue(val1); c1.setCellStyle(vStyle);
        Cell c2 = row.createCell(2); c2.setCellValue(""); c2.setCellStyle(vStyle);
        sheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 1, 2));

        Cell c3 = row.createCell(3); c3.setCellValue(label2); c3.setCellStyle(lStyle);
        Cell c4 = row.createCell(4); c4.setCellValue(val2); c4.setCellStyle(vStyle);
        Cell c5 = row.createCell(5); c5.setCellValue(""); c5.setCellStyle(vStyle);
        sheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 4, 5));
    }

    private XSSFCellStyle createTitleStyle(XSSFWorkbook wb) {
        XSSFCellStyle style = wb.createCellStyle();
        XSSFFont font = wb.createFont();
        font.setFontName("Arial");
        font.setBold(true);
        font.setFontHeightInPoints((short) 14);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(new XSSFColor(new byte[]{18, 48, 71}, null)); // #123047
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private XSSFCellStyle createSectionHeaderStyle(XSSFWorkbook wb) {
        XSSFCellStyle style = wb.createCellStyle();
        XSSFFont font = wb.createFont();
        font.setFontName("Arial");
        font.setBold(true);
        font.setFontHeightInPoints((short) 11);
        font.setColor(new XSSFColor(new byte[]{13, 108, 125}, null)); // #0D6C7D
        style.setFont(font);
        style.setFillForegroundColor(new XSSFColor(new byte[]{(byte) 235, (byte) 243, (byte) 245}, null));
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.RIGHT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBottomBorderColor(IndexedColors.GREY_40_PERCENT.getIndex());
        return style;
    }

    private XSSFCellStyle createTableHeaderStyle(XSSFWorkbook wb) {
        XSSFCellStyle style = wb.createCellStyle();
        XSSFFont font = wb.createFont();
        font.setFontName("Arial");
        font.setBold(true);
        font.setFontHeightInPoints((short) 10);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(new XSSFColor(new byte[]{13, 108, 125}, null)); // #0D6C7D
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        setBorders(style);
        return style;
    }

    private XSSFCellStyle createLabelStyle(XSSFWorkbook wb) {
        XSSFCellStyle style = wb.createCellStyle();
        XSSFFont font = wb.createFont();
        font.setFontName("Arial");
        font.setBold(true);
        font.setFontHeightInPoints((short) 10);
        font.setColor(new XSSFColor(new byte[]{71, 85, 105}, null));
        style.setFont(font);
        style.setFillForegroundColor(new XSSFColor(new byte[]{(byte) 248, (byte) 250, (byte) 252}, null));
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.RIGHT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        setBorders(style);
        return style;
    }

    private XSSFCellStyle createValueStyle(XSSFWorkbook wb) {
        XSSFCellStyle style = wb.createCellStyle();
        XSSFFont font = wb.createFont();
        font.setFontName("Arial");
        font.setFontHeightInPoints((short) 10);
        font.setColor(new XSSFColor(new byte[]{15, 23, 42}, null));
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.RIGHT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        setBorders(style);
        return style;
    }

    private XSSFCellStyle createDataStyle(XSSFWorkbook wb, boolean alt) {
        XSSFCellStyle style = wb.createCellStyle();
        XSSFFont font = wb.createFont();
        font.setFontName("Arial");
        font.setFontHeightInPoints((short) 10);
        font.setColor(new XSSFColor(new byte[]{30, 41, 59}, null));
        style.setFont(font);
        if (alt) {
            style.setFillForegroundColor(new XSSFColor(new byte[]{(byte) 248, (byte) 250, (byte) 252}, null));
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        }
        style.setAlignment(HorizontalAlignment.RIGHT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        setBorders(style);
        return style;
    }

    private XSSFCellStyle createNumberStyle(XSSFWorkbook wb) {
        XSSFCellStyle style = wb.createCellStyle();
        XSSFFont font = wb.createFont();
        font.setFontName("Arial");
        font.setBold(true);
        font.setFontHeightInPoints((short) 10);
        font.setColor(new XSSFColor(new byte[]{13, 108, 125}, null));
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        setBorders(style);
        return style;
    }

    private void setBorders(XSSFCellStyle style) {
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setTopBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setBottomBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setLeftBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setRightBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
    }
}
