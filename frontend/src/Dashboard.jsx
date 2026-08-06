import React, { useState } from 'react';
import {
  Users, CheckSquare, TrendingUp, Award, Activity, Search, Bell, User, PlusCircle,
  MapPin, School, BookOpen, Clock, Calendar, ArrowLeft, ArrowRight, ShieldCheck,
  Star, ChevronRight, MessageSquare, Flame, CheckCircle, FileText
} from 'lucide-react';

export default function Dashboard({ onNavigate, teachers, recentInspections }) {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. KPI Stats derived dynamically
  const totalTeachers = teachers.length || 124;
  const completedVisits = recentInspections.length || 48;
  const recommendationsCompletionRate = 76; // Screen 1 requirement
  const overallAvg = "3.2 / 4"; // Screen 1 requirement

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
            <p className="text-xs text-slate-400 mt-0.5">تقييم تفصيلي من أصل 124 معلماً نشطاً</p>
          </div>

          <div className="my-6 flex items-center justify-center">
            <div className="relative h-40 w-40 rounded-full border-12 border-emerald-500 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-12 border-blue-500 rotate-90" />
              <div className="absolute inset-0 rounded-full border-12 border-yellow-400 rotate-180" />
              <div className="absolute inset-0 rounded-full border-12 border-red-500 rotate-270" />
              <div className="text-center">
                <span className="text-2xl font-extrabold text-slate-800">83%</span>
                <p className="text-[10px] text-slate-400 font-bold">مستقر أو متطور</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-semibold text-slate-600">متقن (40 أستاذ)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500 shrink-0" />
              <span className="font-semibold text-slate-600">مرضٍ (55 أستاذ)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-yellow-400 shrink-0" />
              <span className="font-semibold text-slate-600">في طور التمكن (20 أستاذ)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500 shrink-0" />
              <span className="font-semibold text-slate-600">يحتاج دعماً (9 أساتذة)</span>
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

            {/* Simulated Line Sparkles */}
            <div className="flex-1 flex flex-col items-center gap-2 z-10">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">2.8</span>
              <div className="w-4 bg-blue-500 rounded-t h-16 transition-all duration-500 hover:bg-blue-600" />
              <span className="text-[10px] text-slate-400 font-bold">الأسبوع 1</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 z-10">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">3.0</span>
              <div className="w-4 bg-blue-500 rounded-t h-24 transition-all duration-500 hover:bg-blue-600" />
              <span className="text-[10px] text-slate-400 font-bold">الأسبوع 2</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 z-10">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">3.1</span>
              <div className="w-4 bg-blue-500 rounded-t h-28 transition-all duration-500 hover:bg-blue-600" />
              <span className="text-[10px] text-slate-400 font-bold">الأسبوع 3</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 z-10">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">3.2</span>
              <div className="w-4 bg-emerald-500 rounded-t h-32 transition-all duration-500 hover:bg-emerald-600" />
              <span className="text-[10px] text-slate-400 font-bold">الأسبوع 4</span>
            </div>
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
          <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/50 space-y-2 hover:bg-blue-50/30 transition">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-extrabold rounded-full">زيارة تقييمية</span>
              <span className="text-[10px] text-slate-400 font-bold">اليوم</span>
            </div>
            <h4 className="text-xs font-bold text-slate-800">تم اعتماد زيارة للأستاذة سناء بن عمر</h4>
            <p className="text-[11px] text-slate-500">تم تسجيل كافة تقييمات الكفايات الثمانية بنجاح.</p>
            <span className="text-[10px] font-bold text-slate-400 block pt-1">المندوبية الجهوية بقابس</span>
          </div>

          <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/50 space-y-2 hover:bg-amber-50/30 transition">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-extrabold rounded-full">توصية جديدة</span>
              <span className="text-[10px] text-slate-400 font-bold">أمس</span>
            </div>
            <h4 className="text-xs font-bold text-slate-800">إضافة خطة دعم في إدارة الصف</h4>
            <p className="text-[11px] text-slate-500">تم إشراك الأستاذ صالح البكوش في ورشة عمل جهوية.</p>
            <span className="text-[10px] font-bold text-slate-400 block pt-1">المندوبية الجهوية بصفاقس</span>
          </div>

          <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/50 space-y-2 hover:bg-purple-50/30 transition">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-extrabold rounded-full">تقرير جماعي</span>
              <span className="text-[10px] text-slate-400 font-bold">هذا الأسبوع</span>
            </div>
            <h4 className="text-xs font-bold text-slate-800">تصدير تقرير الأداء ربع السنوي</h4>
            <p className="text-[11px] text-slate-500">تمت مشاركة النتائج والتحاليل مع المندوب الجهوي.</p>
            <span className="text-[10px] font-bold text-slate-400 block pt-1">صيغة PDF مدمجة</span>
          </div>
        </div>
      </div>
    </div>
  );
}
