import React, { useState } from 'react';
import {
  Users, CheckSquare, TrendingUp, Award, Activity, Search, Bell, User, PlusCircle,
  MapPin, School, BookOpen, Clock, Calendar, ArrowLeft, ArrowRight, ShieldCheck,
  Star, ChevronRight, MessageSquare, Flame, CheckCircle, FileText
} from 'lucide-react';

export default function Dashboard({ onNavigate, teachers, recentInspections, stats, refreshStats }) {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. KPI Stats derived dynamically from backend stats endpoint
  const totalTeachers = stats ? stats.totalTeachers : (teachers.length || 124);
  const completedVisits = stats ? stats.completedVisits : (recentInspections.length || 48);
  const recommendationsCompletionRate = stats ? stats.recommendationsCompletionRate : 76;
  const overallAvg = stats ? stats.overallAvg : "3.2 / 4";

  // Level counts
  const levelCounts = stats ? stats.levelCounts : { expert: 40, satisfactory: 55, developing: 20, needsSupport: 9 };
  const totalLevels = levelCounts.expert + levelCounts.satisfactory + levelCounts.developing + levelCounts.needsSupport;
  const percentStableOrDeveloping = totalLevels > 0 ? Math.round(((levelCounts.expert + levelCounts.satisfactory + levelCounts.developing) / totalLevels) * 100) : 83;

  // Evolution weeks
  const evolutionWeeks = stats ? stats.evolutionWeeks : [
    { week: "الأسبوع 1", avg: 2.8 },
    { week: "الأسبوع 2", avg: 3.0 },
    { week: "الأسبوع 3", avg: 3.1 },
    { week: "الأسبوع 4", avg: 3.2 }
  ];

  // Recent activities
  const recentActivities = stats ? stats.recentActivities : [
    {
      type: "زيارة تقييمية",
      title: "تم اعتماد زيارة للأستاذة سناء بن عمر",
      desc: "تم تسجيل كافة تقييمات الكفايات الثمانية بنجاح.",
      region: "المندوبية الجهوية بقابس",
      time: "اليوم"
    },
    {
      type: "توصية جديدة",
      title: "إضافة خطة دعم في إدارة الصف",
      desc: "تم إشراك الأستاذ صالح البكوش في ورشة عمل جهوية.",
      region: "المندوبية الجهوية بصفاقس",
      time: "أمس"
    },
    {
      type: "تقرير جماعي",
      title: "تصدير تقرير الأداء ربع السنوي",
      desc: "تمت مشاركة النتائج والتحاليل مع المندوب الجهوي.",
      region: "صيغة PDF مدمجة",
      time: "هذا الأسبوع"
    }
  ];

  return (
    <div className="space-y-8" dir="rtl">
      {/* HEADER & TOP BAR (Screen 01) */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-600 font-extrabold text-lg shadow-inner">
            آف
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800">آمنة فرحات (متفقدة أولى)</h1>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">لوحة المؤشرات العامة • السنة الدراسية 2026/2027</p>
          </div>
        </div>

        {/* Quick Search and Notification Badge */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="بحث سريع عن أستاذ أو مؤسسة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 text-xs transition"
            />
          </div>

          <button
            onClick={() => onNavigate('notifications-alerts')}
            className="relative p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-xl border border-slate-200 transition shrink-0"
          >
            <Bell size={18} />
            <span className="absolute -top-1.5 -left-1.5 h-5 w-5 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
              12
            </span>
          </button>
        </div>
      </div>

      {/* KEY METRICS CARDS (Screen 01) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Teachers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer" onClick={() => onNavigate('teachers-list')}>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">عدد الأساتذة</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{totalTeachers}</h3>
            <span className="text-[11px] text-green-500 font-bold flex items-center gap-0.5 mt-1">
              <span>+8 هذا الشهر</span>
            </span>
          </div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-inner">
            <Users size={22} />
          </div>
        </div>

        {/* Card 2: Completed Visits */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer" onClick={() => onNavigate('inspections-list')}>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">الزيارات المنجزة</p>
            <h3 className="text-3xl font-extrabold text-blue-600 mt-2">{completedVisits}</h3>
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-0.5 mt-1">
              <span>من أصل 60 زيارة مستهدفة</span>
            </span>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner">
            <CheckSquare size={22} />
          </div>
        </div>

        {/* Card 3: Recommendation completion */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer" onClick={() => onNavigate('recommendations-tracking')}>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">نسبة إنجاز التوصيات</p>
            <h3 className="text-3xl font-extrabold text-amber-600 mt-2">{recommendationsCompletionRate}%</h3>
            <span className="text-[11px] text-green-500 font-bold flex items-center gap-0.5 mt-1">
              <span>أعلى من الفصل السابق</span>
            </span>
          </div>
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl shadow-inner">
            <TrendingUp size={22} />
          </div>
        </div>

        {/* Card 4: Overall score average */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer" onClick={() => onNavigate('quantitative-indicators')}>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">متوسط الأداء العام</p>
            <h3 className="text-3xl font-extrabold text-purple-600 mt-2">{overallAvg}</h3>
            <span className="text-[11px] text-green-500 font-bold flex items-center gap-0.5 mt-1">
              <span>اتجاه تصاعدي مستمر</span>
            </span>
          </div>
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl shadow-inner">
            <Award size={22} />
          </div>
        </div>
      </div>

      {/* VISUAL ANALYTICS (Screen 01) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance Distribution Donut Mock */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">توزيع مستويات الأداء (كفايات الأساتذة)</h3>
            <p className="text-xs text-slate-400 mt-0.5">تقييم تفصيلي من أصل {totalTeachers} معلماً نشطاً</p>
          </div>

          <div className="my-6 flex items-center justify-center">
            <div className="relative h-40 w-40 rounded-full border-12 border-emerald-500 flex items-center justify-center animate-spin-slow">
              <div className="absolute inset-0 rounded-full border-12 border-blue-500 rotate-90" />
              <div className="absolute inset-0 rounded-full border-12 border-yellow-400 rotate-180" />
              <div className="absolute inset-0 rounded-full border-12 border-red-500 rotate-270" />
              <div className="text-center rotate-0">
                <span className="text-2xl font-extrabold text-slate-800">{percentStableOrDeveloping}%</span>
                <p className="text-[10px] text-slate-400 font-bold">مستقر أو متطور</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-semibold text-slate-600">متقن ({levelCounts.expert} أستاذ)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500 shrink-0" />
              <span className="font-semibold text-slate-600">مرضٍ ({levelCounts.satisfactory} أستاذ)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-yellow-400 shrink-0" />
              <span className="font-semibold text-slate-600">في طور التمكن ({levelCounts.developing} أستاذ)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500 shrink-0" />
              <span className="font-semibold text-slate-600">يحتاج دعماً ({levelCounts.needsSupport} أساتذة)</span>
            </div>
          </div>
        </div>

        {/* Performance Evolution Line Graph Mock */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">اتجاهات التطور خلال الفصل الحالي</h3>
            <p className="text-xs text-slate-400 mt-0.5">مقارنة أسبوعية لمؤشرات الأداء المهني العام</p>
          </div>

          <div className="h-44 my-6 flex items-end gap-3 px-2 border-b border-slate-100 relative">
            {/* Grid background lines */}
            <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-slate-100" />
            <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-slate-100" />
            <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-slate-100" />

            {evolutionWeeks.map((ew, idx) => {
              // Convert 4.0 scale to percentage height
              const score = parseFloat(ew.avg);
              const heightPercent = score ? Math.round((score / 4.0) * 100) : 70;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 z-10">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${idx === evolutionWeeks.length - 1 ? 'text-emerald-600 bg-emerald-50' : 'text-blue-600 bg-blue-50'}`}>
                    {ew.avg}
                  </span>
                  <div
                    style={{ height: `${heightPercent * 1.1}px` }}
                    className={`w-4 rounded-t transition-all duration-500 ${idx === evolutionWeeks.length - 1 ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                  />
                  <span className="text-[10px] text-slate-400 font-bold">{ew.week}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>البداية (سبتمبر)</span>
            <span>المنتصف (أكتوبر)</span>
            <span>الحالي (نوفمبر)</span>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY FEED (Screen 01) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <Activity className="text-blue-600 animate-pulse" size={18} />
            <span>آخر الأنشطة والفعاليات الميدانية</span>
          </h3>
          <button
            onClick={() => onNavigate('inspections-list')}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            عرض كافة الزيارات
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentActivities.slice(0, 3).map((act, idx) => {
            let badgeBg = "bg-blue-50 text-blue-600";
            let hoverBg = "hover:bg-blue-50/30";
            if (idx === 1) {
              badgeBg = "bg-amber-50 text-amber-600";
              hoverBg = "hover:bg-amber-50/30";
            } else if (idx === 2) {
              badgeBg = "bg-purple-50 text-purple-600";
              hoverBg = "hover:bg-purple-50/30";
            }
            return (
              <div key={idx} className={`p-4 bg-slate-50/50 rounded-xl border border-slate-200/50 space-y-2 ${hoverBg} transition`}>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${badgeBg}`}>{act.type}</span>
                  <span className="text-[10px] text-slate-400 font-bold">{act.time === "ouverte" ? "مفتوحة" : act.time === "en_cours" ? "قيد المعالجة" : act.time === "cloturee" ? "مغلقة" : act.time}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">{act.title}</h4>
                <p className="text-[11px] text-slate-500">{act.desc}</p>
                <span className="text-[10px] font-bold text-slate-400 block pt-1">{act.region}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
