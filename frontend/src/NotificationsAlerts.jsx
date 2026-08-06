import React from 'react';
import { ArrowRight, Bell, AlertTriangle, CheckCircle, Calendar, Sparkles } from 'lucide-react';

export default function NotificationsAlerts({ onNavigate }) {
  // Alert types categorization (Screen 13)
  const notifications = [
    {
      id: 1,
      category: "مواعيد التفقد",
      title: "تذكير بزيارة تفقدية مبرمجة للأستاذ صالح البكوش",
      desc: "موعد الزيارة مقرر غداً في تمام الساعة 08:30 صباحاً بمقر المدرسة الإعدادية بالرياض.",
      urgency: "high"
    },
    {
      id: 2,
      category: "التقييم البيداغوجي",
      title: "تم إضافة تقييم كفايات جديد بنجاح",
      desc: "قامت المتفقدة آمنة فرحات باعتماد التقييمات الرقمية لزيارة المعلمة سناء بن عمر.",
      urgency: "normal"
    },
    {
      id: 3,
      category: "متابعة التوصيات",
      title: "توصية تجاوزت السقف الزمني المحدد لتطبيقها",
      desc: "توصية 'تفعيل بطاقات التقويم التكويني السريع' للأستاذ سليم الهرماسي بحاجة لمتابعة عاجلة.",
      urgency: "critical"
    },
    {
      id: 4,
      category: "خطة النمو",
      title: "تحديث أهداف خطة النمو الشخصية",
      desc: "الأستاذة ليلى المنصوري قامت بتعيين هدف تنمية رقمي جديد للربع السنوي القادم.",
      urgency: "normal"
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition"
          >
            <ArrowRight size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">مركز التنبيهات والإشعارات الفورية</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">تنبيهات ورسائل تذكير فورية بخصوص مجريات العمليات البيداغوجية، زيارات المتابعة، والالتزامات الزمنية.</p>
          </div>
        </div>
      </div>

      {/* NOTIFICATION FEED CARDS (Screen 13) */}
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`bg-white p-5 rounded-2xl border flex flex-col sm:flex-row items-start justify-between gap-4 transition hover:shadow-sm ${
              notif.urgency === 'critical' ? 'border-red-100 bg-red-50/10' :
              notif.urgency === 'high' ? 'border-yellow-100 bg-yellow-50/10' : 'border-slate-100'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <span className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                notif.urgency === 'critical' ? 'bg-red-50 text-red-600' :
                notif.urgency === 'high' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {notif.urgency === 'critical' && <AlertTriangle size={18} />}
                {notif.urgency === 'high' && <Calendar size={18} />}
                {notif.urgency === 'normal' && <Bell size={18} />}
              </span>

              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{notif.category}</span>
                <h3 className="font-extrabold text-slate-800 leading-relaxed">{notif.title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{notif.desc}</p>
              </div>
            </div>

            <div className="shrink-0 flex items-center">
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded ${
                notif.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                notif.urgency === 'high' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {notif.urgency === 'critical' ? 'عاجل وحرج 🚨' :
                 notif.urgency === 'high' ? 'أولوية مرتفعة ⚠️' : 'عادي ℹ️'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
