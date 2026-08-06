import React from 'react';
import { ArrowRight, Compass, HelpCircle, HardHat, Milestone, Calendar, Sparkles } from 'lucide-react';

export default function GrowthRoadmap({ onNavigate }) {
  // Goals detail breakdowns (Screen 09)
  const roadmapGoals = [
    {
      title: "تطوير جودة التقويم التكويني السريع",
      action: "تصميم واستخدام بطاقات الخروج ومسابقات كاهوت بشكل دوري.",
      resources: "اشتراك إنترنت بالمؤسسة، شاشات عرض تفاعلية.",
      date: "31 ديسمبر 2026",
      kpi: "تطبيق التقييم بنسبة 90% بنهاية الفصل الدراسي الأول."
    },
    {
      title: "دمج الموارد والوسائط الرقمية التفاعلية",
      action: "إنشاء سيناريوهات بيداغوجية تستخدم تطبيقات تكنولوجية في تقديم الدروس.",
      resources: "جهاز حاسوب محمول، منصة تدريب الأستاذ الرقمية.",
      date: "15 فيفري 2027",
      kpi: "تقديم درسين على الأقل شهرياً باعتماد تقنيات حديثة."
    },
    {
      title: "تحسين مهارات العمل الجماعي التعاوني",
      action: "إعادة تنظيم توزيع طاولات الفصل بأسلوب الطاولات المستديرة.",
      resources: "تنظيم فصلي مرن، بطاقات توزيع الأدوار للتلاميذ.",
      date: "30 جانفي 2027",
      kpi: "إشراك كافة فئات التلاميذ بنشاط كلي بنسبة 100%."
    }
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition"
        >
          <ArrowRight size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">خطة النمو الشخصية والتأطير المستمر</h1>
          <p className="text-xs text-slate-400 font-bold mt-1">خارطة طريق مهنية تحدد الأهداف التنموية للأستاذ لرفع جودة وكفاءة الممارسات الفصلية.</p>
        </div>
      </div>

      {/* ROADMAP CARDS (Screen 09) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {roadmapGoals.map((goal, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <Sparkles size={18} />
                </span>
                <span className="text-[10px] text-slate-400 font-bold">هدف رقم {idx + 1}</span>
              </div>

              <h3 className="text-xs font-extrabold text-slate-800 leading-relaxed border-b border-slate-100 pb-2">{goal.title}</h3>

              {/* Card breakdown */}
              <div className="space-y-3 text-[11px] leading-relaxed">
                <div>
                  <span className="text-slate-400 font-bold">الإجراءات المحددة (Action):</span>
                  <p className="text-slate-700 font-semibold mt-0.5">{goal.action}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold">الموارد المطلوبة (Resources):</span>
                  <p className="text-slate-700 font-semibold mt-0.5">{goal.resources}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold">تاريخ الإنجاز المستهدف:</span>
                  <p className="text-blue-600 font-bold flex items-center gap-1 mt-0.5">
                    <Calendar size={12} />
                    <span>{goal.date}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 mt-4 bg-slate-50 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-extrabold">مؤشر النجاح المقاس (KPI):</span>
              <p className="text-[10px] text-emerald-700 font-extrabold mt-1">{goal.kpi}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
