package com.inspection.config;

import com.inspection.model.Enseignant;
import com.inspection.model.Inspecteur;
import com.inspection.model.Inspection;
import com.inspection.model.InspectionStatut;
import com.inspection.model.Evaluation;
import com.inspection.model.Notification;
import com.inspection.repository.EnseignantRepository;
import com.inspection.repository.InspecteurRepository;
import com.inspection.repository.InspectionRepository;
import com.inspection.repository.EvaluationRepository;
import com.inspection.repository.NotificationRepository;
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
            InspecteurRepository inspecteurRepository,
            EnseignantRepository enseignantRepository,
            InspectionRepository inspectionRepository,
            EvaluationRepository evaluationRepository,
            NotificationRepository notificationRepository,
            PasswordService passwordService) {
        return args -> {
            if (inspecteurRepository.count() == 0) {
                // Pre-populate some inspectors
                String adminHashed = passwordService.hashPassword("admin");
                String spectHashed = passwordService.hashPassword("password");

                Inspecteur principal = new Inspecteur("أحمد", "العربي", "admin", adminHashed, "administrateur");
                Inspecteur spect1 = new Inspecteur("محمد", "حسين", "inspecteur1", spectHashed, "inspecteur");
                Inspecteur spect2 = new Inspecteur("آمنة", "فرحات", "inspecteur2", spectHashed, "inspecteur");

                inspecteurRepository.saveAll(List.of(principal, spect1, spect2));
                System.out.println("Inspectors seeded successfully.");
            }

            if (enseignantRepository.count() == 0) {
                // Pre-populate some teachers (enseignants)
                Enseignant e1 = new Enseignant("صالح", "البكوش", "الرياضيات", "salah.bakouch@email.com", "98765432");
                Enseignant e2 = new Enseignant("سناء", "بن عمر", "علوم الحياة والأرض", "sana.benomar@email.com", "22446688");
                Enseignant e3 = new Enseignant("سليم", "الهرماسي", "الفيزياء والكيمياء", "selim.hermassi@email.com", "55667788");
                Enseignant e4 = new Enseignant("ليلى", "المنصوري", "اللغة العربية", "leila.mansouri@email.com", "99001122");

                enseignantRepository.saveAll(List.of(e1, e2, e3, e4));
                System.out.println("Teachers (enseignants) seeded successfully.");
            }

            if (inspectionRepository.count() == 0) {
                // Add some initial inspections for demonstration
                Inspecteur ins = inspecteurRepository.findByUsername("admin").orElse(null);
                Enseignant ens1 = enseignantRepository.findAll().stream().filter(e -> e.getNom().contains("سناء")).findFirst().orElse(null);
                Enseignant ens2 = enseignantRepository.findAll().stream().filter(e -> e.getNom().contains("صالح")).findFirst().orElse(null);

                if (ins != null && ens1 != null) {
                    Inspection insp1 = new Inspection();
                    insp1.setDateVisite(LocalDate.now());
                    insp1.setHeureDebut(LocalTime.of(9, 0));
                    insp1.setHeureFin(LocalTime.of(10, 30));
                    insp1.setEnseignant(ens1);
                    insp1.setInspecteur(ins);
                    insp1.setStatut(InspectionStatut.en_cours);
                    insp1.setRemarquesGenerales("الاستعداد البيداغوجي متميز والدرس شيق جداً.");
                    inspectionRepository.save(insp1);

                    Evaluation ev1 = new Evaluation(insp1, "التمكن العلمي من المادة المعرفية", 9, "متمكنة جداً ولديها قدرة فائقة على تبسيط المفاهيم.");
                    Evaluation ev2 = new Evaluation(insp1, "التخطيط وتدبير الحصة الدراسية", 8, "التخطيط بيداغوجي واضح ومحترم للزمن المدرسي.");
                    evaluationRepository.saveAll(List.of(ev1, ev2));
                }

                if (ins != null && ens2 != null) {
                    Inspection insp2 = new Inspection();
                    insp2.setDateVisite(LocalDate.now().minusDays(1));
                    insp2.setHeureDebut(LocalTime.of(14, 0));
                    insp2.setHeureFin(LocalTime.of(15, 30));
                    insp2.setEnseignant(ens2);
                    insp2.setInspecteur(ins);
                    insp2.setStatut(InspectionStatut.ouverte);
                    insp2.setRemarquesGenerales("زيارة تفقد عادية لمستوى السنة الأولى ب.");
                    inspectionRepository.save(insp2);

                    Evaluation ev3 = new Evaluation(insp2, "التواصل وبناء العلاقات الصفية", 7, "المعلم بحاجة لإشراك الفئات الضعيفة بصفة أكبر.");
                    evaluationRepository.save(ev3);
                }

                System.out.println("Default inspections and evaluations seeded.");
            }

            if (notificationRepository.count() == 0) {
                notificationRepository.save(new Notification("مواعيد التفقد", "تذكير بزيارة تفقدية مبرمجة للأستاذ صالح البكوش", "موعد الزيارة مقرر غداً في تمام الساعة 08:30 صباحاً بمقر المدرسة الإعدادية بالرياض.", "high", false));
                notificationRepository.save(new Notification("التقييم البيداغوجي", "تم إضافة تقييم كفايات جديد بنجاح", "قامت المتفقدة آمنة فرحات باعتماد التقييمات الرقمية لزيارة المعلمة سناء بن عمر.", "normal", false));
                notificationRepository.save(new Notification("متابعة التوصيات", "توصية تجاوزت السقف الزمني المحدد لتطبيقها", "توصية 'تفعيل بطاقات التقويم التكويني السريع' للأستاذ سليم الهرماسي بحاجة لمتابعة عاجلة.", "critical", false));
                notificationRepository.save(new Notification("خطة النمو", "تحديث أهداف خطة النمو الشخصية", "الأستاذة ليلى المنصوري قامت بتعيين هدف تنمية رقمي جديد للربع السنوي القادم.", "normal", false));
                System.out.println("Default notifications seeded successfully.");
            }
        };
    }
}
