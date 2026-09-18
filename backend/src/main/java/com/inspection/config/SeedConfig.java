package com.inspection.config;

import com.inspection.model.*;
import com.inspection.repository.*;
import com.inspection.service.PasswordService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Configuration
public class SeedConfig {

    @Bean
    CommandLineRunner seedDatabase(
            RegionRepository regionRepository,
            EtablissementRepository etablissementRepository,
            RoleRepository roleRepository,
            TypeVisiteRepository typeVisiteRepository,
            InspecteurRepository inspecteurRepository,
            EnseignantRepository enseignantRepository,
            InspectionRepository inspectionRepository,
            EvaluationCompetenceRepository evaluationCompetenceRepository,
            RecommandationRepository recommandationRepository,
            IndicateurCroissanceRepository indicateurCroissanceRepository,
            PlanDeveloppementRepository planDeveloppementRepository,
            DiagnosticFinalRepository diagnosticFinalRepository,
            NotificationRepository notificationRepository,
            PasswordService passwordService) {
        return args -> {
            // 1. Seed Regions
            if (regionRepository.count() == 0) {
                regionRepository.saveAll(List.of(
                        new Region("قابس", "GAB"),
                        new Region("صفاقس", "SFA"),
                        new Region("تونس", "TUN"),
                        new Region("سوسة", "SOU")
                ));
            }
            Region regGab = regionRepository.findAll().stream().filter(r -> r.getNom().contains("قابس")).findFirst().orElse(null);
            Region regSfa = regionRepository.findAll().stream().filter(r -> r.getNom().contains("صفاقس")).findFirst().orElse(null);
            Region regTun = regionRepository.findAll().stream().filter(r -> r.getNom().contains("تونس")).findFirst().orElse(null);
            Region regSou = regionRepository.findAll().stream().filter(r -> r.getNom().contains("سوسة")).findFirst().orElse(null);

            // 2. Seed Schools (Etablissements)
            if (etablissementRepository.count() == 0) {
                etablissementRepository.saveAll(List.of(
                        new Etablissement("إعدادية ابن رشد", "مدرسة إعدادية", regGab, "قابس المدينة", "شارع الجمهورية، قابس"),
                        new Etablissement("معهد حي الأمل", "معهد ثانوي", regSfa, "صفاقس الغربية", "حي الأمل، صفاقس"),
                        new Etablissement("إعدادية 2 مارس", "مدرسة إعدادية", regTun, "باب الخضراء", "نهج 2 مارس، تونس"),
                        new Etablissement("معهد النور", "معهد ثانوي", regSou, "حمام سوسة", "طريق الشاطئ، سوسة")
                ));
            }
            Etablissement ecoleIbnRochd = etablissementRepository.findAll().stream().filter(e -> e.getNom().contains("ابن رشد")).findFirst().orElse(null);
            Etablissement ecoleAmal = etablissementRepository.findAll().stream().filter(e -> e.getNom().contains("حي الأمل")).findFirst().orElse(null);
            Etablissement ecoleMars = etablissementRepository.findAll().stream().filter(e -> e.getNom().contains("2 مارس")).findFirst().orElse(null);
            Etablissement ecoleNour = etablissementRepository.findAll().stream().filter(e -> e.getNom().contains("النور")).findFirst().orElse(null);

            // 3. Seed Visit Types
            if (typeVisiteRepository.count() == 0) {
                typeVisiteRepository.saveAll(List.of(
                        new TypeVisite("تشخيصية", "زيارة أولية لتشخيص الممارسات الصفية وتحديد الاحتياجات"),
                        new TypeVisite("متابعة", "زيارة للوقوف على مدى تطبيق التوصيات ومساندة المعلم"),
                        new TypeVisite("مرافقة", "مرافقة بيداغوجية مستمرة تركز على مجالات الدعم المستهدفة"),
                        new TypeVisite("تقييمية", "تقييم ختامي شامل لمستويات الأداء والكفايات الثمانية")
                ));
            }
            TypeVisite typeDiag = typeVisiteRepository.findAll().stream().filter(t -> t.getLibelle().contains("تشخيصية")).findFirst().orElse(null);
            TypeVisite typeSuivi = typeVisiteRepository.findAll().stream().filter(t -> t.getLibelle().contains("متابعة")).findFirst().orElse(null);
            TypeVisite typeEval = typeVisiteRepository.findAll().stream().filter(t -> t.getLibelle().contains("تقييمية")).findFirst().orElse(null);

            // 4. Seed Inspectors
            if (inspecteurRepository.count() == 0) {
                String adminHashed = passwordService.hashPassword("admin");
                String spectHashed = passwordService.hashPassword("password");

                Inspecteur principal = new Inspecteur("العربي", "أحمد", "admin", adminHashed, "administrateur");
                principal.setMatricule("INS-ADM-01");
                principal.setSpecialite("التربية المدنية");
                principal.setRegion(regTun);
                principal.setTelephone("98112233");

                Inspecteur spect1 = new Inspecteur("حسين", "محمد", "inspecteur1", spectHashed, "inspecteur");
                spect1.setMatricule("INS-SFA-02");
                spect1.setSpecialite("التربية المدنية");
                spect1.setRegion(regSfa);
                spect1.setTelephone("97445566");

                Inspecteur spect2 = new Inspecteur("فرحات", "آمنة", "inspecteur2", spectHashed, "inspecteur");
                spect2.setMatricule("INS-GAB-03");
                spect2.setSpecialite("التربية المدنية");
                spect2.setRegion(regGab);
                spect2.setTelephone("22889900");

                inspecteurRepository.saveAll(List.of(principal, spect1, spect2));
            }
            Inspecteur amna = inspecteurRepository.findByUsername("inspecteur2")
                    .orElseGet(() -> inspecteurRepository.findAll().get(0));

            // 5. Seed Teachers
            if (enseignantRepository.count() == 0) {
                Enseignant e1 = new Enseignant("بن عمر", "سناء", "sana.benomar@education.tn", passwordService.hashPassword("pass123"), "التربية المدنية", "22446688", ecoleIbnRochd, regGab, LocalDate.of(2014, 9, 15), 12, "أستاذ أول");
                Enseignant e2 = new Enseignant("الجمني", "حسام", "houssem.jemni@education.tn", passwordService.hashPassword("pass123"), "التربية المدنية", "98123456", ecoleAmal, regSfa, LocalDate.of(2018, 9, 15), 8, "أستاذ تعليم ثانوي");
                Enseignant e3 = new Enseignant("السعيدي", "آمنة", "amna.saidi@education.tn", passwordService.hashPassword("pass123"), "التربية المدنية", "55667788", ecoleMars, regTun, LocalDate.of(2011, 9, 15), 15, "أستاذ أول مميز");
                Enseignant e4 = new Enseignant("الطرابلسي", "منير", "mounir.trabelsi@education.tn", passwordService.hashPassword("pass123"), "التربية المدنية", "99001122", ecoleNour, regSou, LocalDate.of(2024, 9, 15), 2, "أستاذ متعاقد");
                Enseignant e5 = new Enseignant("البكوش", "صالح", "salah.bakouch@education.tn", passwordService.hashPassword("pass123"), "التربية المدنية", "98765432", ecoleIbnRochd, regGab, LocalDate.of(2012, 9, 15), 14, "أستاذ أول");

                enseignantRepository.saveAll(List.of(e1, e2, e3, e4, e5));
            }
            Enseignant sana = enseignantRepository.findAll().stream().filter(e -> e.getNom().contains("بن عمر")).findFirst().orElse(null);
            Enseignant houssem = enseignantRepository.findAll().stream().filter(e -> e.getNom().contains("الجمني")).findFirst().orElse(null);

            // 6. Seed Inspections & Competency Evaluations
            if (inspectionRepository.count() == 0 && sana != null && amna != null) {
                // Visit 1: Diagnostic
                Inspection v1 = new Inspection();
                v1.setDateVisite(LocalDate.of(2026, 10, 12));
                v1.setHeureDebut(LocalTime.of(8, 30));
                v1.setHeureFin(LocalTime.of(10, 0));
                v1.setEnseignant(sana);
                v1.setInspecteur(amna);
                v1.setTypeVisite(typeDiag);
                v1.setStatut(InspectionStatut.cloturee);
                v1.setRemarquesGenerales("بداية طيبة للعام الدراسي مع انضباط صفي واضح وحاجة لتفعيل التعلم التعاوني.");
                v1.setSignatureInspecteur("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...");
                inspectionRepository.save(v1);

                // Visit 2: Follow-up
                Inspection v2 = new Inspection();
                v2.setDateVisite(LocalDate.of(2027, 1, 18));
                v2.setHeureDebut(LocalTime.of(10, 30));
                v2.setHeureFin(LocalTime.of(12, 0));
                v2.setEnseignant(sana);
                v2.setInspecteur(amna);
                v2.setTypeVisite(typeSuivi);
                v2.setStatut(InspectionStatut.cloturee);
                v2.setRemarquesGenerales("تطور ملموس في التخطيط المرحلي وإشراك التلاميذ، التوصيات السابقة قيد التنفيذ.");
                inspectionRepository.save(v2);

                // Visit 3: Evaluation (Latest)
                Inspection v3 = new Inspection();
                v3.setDateVisite(LocalDate.of(2027, 5, 20));
                v3.setHeureDebut(LocalTime.of(9, 0));
                v3.setHeureFin(LocalTime.of(10, 30));
                v3.setEnseignant(sana);
                v3.setInspecteur(amna);
                v3.setTypeVisite(typeEval);
                v3.setStatut(InspectionStatut.cloturee);
                v3.setRemarquesGenerales("حصة نموذجية متميزة تم خلالها استيفاء الكفايات البيداغوجية، مع توظيف ممتاز لأنشطة التعلم التشاركي.");
                inspectionRepository.save(v3);

                // 8 Domains Evaluation Competencies for v3
                if (evaluationCompetenceRepository.count() == 0) {
                    evaluationCompetenceRepository.saveAll(List.of(
                            new EvaluationCompetence(v3, "التخطيط للتعلمات", 3.5, "متقن", "↑ تطور إيجابي", "تخطيط بيداغوجي مرحلي متميز يربط التعلمات بالوضعيات الحياتية."),
                            new EvaluationCompetence(v3, "إدارة التعلمات", 4.0, "متقن", "↑ تطور إيجابي", "تنويع ملهم للوضعيات التعليمية وضمان انخراط نشط لجميع المتعلمين."),
                            new EvaluationCompetence(v3, "إدارة القسم", 3.0, "مرض", "↔ استقرار", "تحكم مقبول ومحترم للزمن المدرسي مع بيئة صفية يسودها الاحترام المتبادل."),
                            new EvaluationCompetence(v3, "التقييم والدعم", 2.5, "في طور التمكن", "↑ تحسن", "توظيف أولي لبطاقات التقويم التكويني السريع مع الحاجة لتنويع أشكال الدعم."),
                            new EvaluationCompetence(v3, "خصوصيات التدريس", 3.5, "متقن", "↑ إيجابي", "تمكن معرفي دقيق من مفاهيم المواطنة وحقوق الإنسان وتوظيف محكم للنصوص القانونية."),
                            new EvaluationCompetence(v3, "المهارات الحياتية", 3.0, "مرض", "↔ استقرار", "حضور مشجع لمهارات الحوار وقبول الآخر وحل النزاعات السلمي."),
                            new EvaluationCompetence(v3, "الموارد الرقمية والذكاء الاصطناعي", 2.0, "يحتاج دعما", "↑ يحتاج دعما", "الحاجة الملحة لدمج برمجيات العروض التفاعلية وتطبيقات استطلاع الرأي الرقمية."),
                            new EvaluationCompetence(v3, "التطور المهني", 3.5, "متقن", "↑ تطور", "انفتاح بيداغوجي ورغبة مستمرة في التكوين الذاتي والمشاركة في الأيام الدراسية.")
                    ));
                }

                // 7. Seed Recommendations
                if (recommandationRepository.count() == 0) {
                    recommandationRepository.saveAll(List.of(
                            new Recommandation("تنويع طرائق التقييم الشفهي والكتابي", LocalDate.of(2027, 1, 18), LocalDate.of(2027, 6, 1), "منجزة جزئيا", 65, "استعمال بطاقات خروج;أسئلة تفكير قصيرة;شبكات تقييم ذاتي", v2, sana),
                            new Recommandation("إدماج مورد رقمي تفاعلي في حصص الدعم", LocalDate.of(2027, 1, 18), LocalDate.of(2027, 5, 15), "غير منجزة", 20, "غياب منصة موحدة بالمؤسسة;الحاجة إلى تكوين تقني مسبق", v2, sana),
                            new Recommandation("استثمار التغذية الراجعة في التخطيط اللاحق", LocalDate.of(2026, 10, 12), LocalDate.of(2027, 1, 15), "منجزة بالكامل", 100, "خطة أسبوعية محسنة;قرائن واضحة في كراس التحضير اليومي", v1, sana),
                            new Recommandation("تنمية مبادرات التعلم التعاوني داخل القسم", LocalDate.of(2027, 1, 18), LocalDate.of(2027, 5, 20), "منجزة جزئيا", 70, "تخصيص أدوار واضحة داخل كل مجموعة;تحسن ملحوظ في انخراط المتعلمين", v2, sana)
                    ));
                }

                // 8. Seed 10 Qualitative Growth Indicators
                if (indicateurCroissanceRepository.count() == 0) {
                    indicateurCroissanceRepository.saveAll(List.of(
                            new IndicateurCroissance("استثمار التغذية الراجعة", "yes", "توظيف مباشر للملاحظات السابقة في كراس التحضير", sana, v3),
                            new IndicateurCroissance("التفكير في الممارسة المهنية", "partial", "حاجة لكتابة اليوميات البيداغوجية بانتظام", sana, v3),
                            new IndicateurCroissance("تطوير الموارد التعليمية", "yes", "إنتاج وثائق وسائطية ومطبوعات موجهة", sana, v3),
                            new IndicateurCroissance("تجديد طرائق التدريس", "partial", "الانتقال التدريجي نحو بيداغوجيا المشروع", sana, v3),
                            new IndicateurCroissance("تنويع استراتيجيات التقييم", "no", "الاعتماد لا يزال شبه كلي على الاختبارات التقليدية", sana, v3),
                            new IndicateurCroissance("دمج التكنولوجيا", "partial", "استخدام شاشة العرض دون برمجيات تفاعلية", sana, v3),
                            new IndicateurCroissance("المشاركة في التكوين المستمر", "yes", "حضور كافة الملتقيات البيداغوجية الجهوية", sana, v3),
                            new IndicateurCroissance("انتقال أثر التكوين إلى القسم", "partial", "بدء تطبيق آليات التعلم النشط بحذر", sana, v3),
                            new IndicateurCroissance("الإسهام في الحياة المدرسية", "yes", "تأطير نادي التربية على المواطنة وحقوق الإنسان", sana, v3),
                            new IndicateurCroissance("التعاون مع الزملاء", "yes", "تنسيق وثيق ومثمر مع أساتذة المادة بالمؤسسة", sana, v3)
                    ));
                }

                // 9. Seed Personal Growth Plan (Roadmap)
                if (planDeveloppementRepository.count() == 0) {
                    planDeveloppementRepository.saveAll(List.of(
                            new PlanDeveloppement("رفع جودة التقييم التكويني", "إعداد بنك أسئلة قصيرة;اعتماد بطاقة ملاحظة أسبوعية", "نماذج تقييم معتمدة + ورشة تكوينية", LocalDate.of(2027, 6, 30), "تحسن بنسبة 20% في مؤشر التقييم والدعم", "قيد التنفيذ", sana),
                            new PlanDeveloppement("دمج الموارد الرقمية التفاعلية", "استخدام عرض تفاعلي مرتين شهريا;تجريب منصة مسابقات قصيرة", "حاسوب محمول + جهاز عرض + اشتراك رقمي", LocalDate.of(2027, 5, 15), "تنفيذ 4 حصص رقمية ناجحة وموثقة", "قيد التنفيذ", sana),
                            new PlanDeveloppement("تعزيز التعلم التعاوني وحل النزاعات", "إعادة توزيع الأدوار داخل المجموعات;تصميم وضعيات لعب الأدوار", "بطاقات عمل المجموعات وأوراق التقييم البيني", LocalDate.of(2027, 4, 10), "ارتفاع نسبة مشاركة التلاميذ الهادئين", "مكتمل", sana)
                    ));
                }

                // 10. Seed Final Diagnostic
                if (diagnosticFinalRepository.count() == 0) {
                    diagnosticFinalRepository.save(new DiagnosticFinal(
                            v3,
                            "ظهر تحسن لافت في التخطيط المرحلي، وتنشيط التعلمات، واعتماد أساليب تشاركية محفزة داخل القسم، والتزام عالٍ بميثاق القسم.",
                            "لا يزال توظيف الموارد الرقمية الحديثة وتنويع استراتيجيات التقييم التكويني بحاجة إلى مواكبة منتظمة وتدريب عملي.",
                            "التركيز على التقييم التكويني الرقمي السريع، وبناء أنشطة دعم أكثر تفريداً تراعي الفروق الفردية بين التلاميذ.",
                            "مرافقة ميدانية"
                    ));
                }
            }

            // 11. Seed Dynamic Notifications
            if (notificationRepository.count() == 0) {
                notificationRepository.saveAll(List.of(
                        new Notification("مواعيد التفقد", "اقتراب موعد زيارة ميدانية", "تبقى 3 أيام على موعد زيارة التفقد المبرمجة للأستاذ حسام الجمني بمعهد حي الأمل.", "warning", false),
                        new Notification("التقييم البيداغوجي", "إضافة تقييم كفايات جديد", "تمت إضافة واعتماد تقييم الأداء الجديد لزيارة الأستاذة سناء بن عمر بنجاح.", "normal", false),
                        new Notification("متابعة التوصيات", "توصية بحاجة إلى متابعة عاجلة", "توصية 'إدماج مورد رقمي تفاعلي في حصص الدعم' تجاوزت أجل التنفيذ المحدد.", "critical", false),
                        new Notification("خطة النمو", "موعد إنجاز هدف خطة التطوير", "اقترب أجل استحقاق الهدف التطويري: دمج الموارد الرقمية التفاعلية في نهاية الأسبوع.", "normal", false),
                        new Notification("التقارير", "تقرير تفقد جاهز للطباعة", "تم توليد تقرير الزيارة التقييمية المؤرخة في 20 ماي 2027 بصيغة PDF قابلة للتصدير.", "normal", true),
                        new Notification("المؤسسات", "تحديث بيانات المؤسسة التربوية", "تمت مراجعة بيانات إعدادية ابن رشد بقابس واعتماد المنسقين البيداغوجيين.", "normal", true)
                ));
            }
        };
    }
}
