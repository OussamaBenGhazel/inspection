import React from 'react';
import { ArrowRight, Star, Award, TrendingUp, AlertCircle, PlayCircle } from 'lucide-react';

export default function QuantitativeGrowthIndicators({ onNavigate }) {
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
          <h1 className="text-2xl font-extrabold text-slate-800">المؤشرات الكمية للتطور والنمو المهني</h1>
          <p className="text-xs text-slate-400 font-bold mt-1">قراءة رقمية دقيقة لمستويات نمو كفايات ومؤشرات أداء الأستاذ مقارنة بزياراته السابقة.</p>
        </div>
      </div>

      {/* TOP METRIC CARDS (Screen 10) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
          <p className="text-slate-400 text-[10px] font-bold">المعدل العام</p>
          <h3 className="text-2xl font-extrabold text-blue-600 mt-1">3.2 / 4</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
          <p className="text-slate-400 text-[10px] font-bold">نقاط القوة</p>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">5 مجالات</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
          <p className="text-slate-400 text-[10px] font-bold">فرص التحسين</p>
          <h3 className="text-2xl font-extrabold text-yellow-600 mt-1">3 مجالات</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
          <p className="text-slate-400 text-[10px] font-bold">التوصيات المنجزة</p>
          <h3 className="text-2xl font-extrabold text-purple-600 mt-1">3 توصيات</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center col-span-2 md:col-span-1">
          <p className="text-slate-400 text-[10px] font-bold">المبادرات الإبداعية</p>
          <h3 className="text-2xl font-extrabold text-red-600 mt-1">مبادرة 1</h3>
        </div>
      </div>

      {/* COMPARATIVE SECTION (Screen 10) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">تحليل مقارنة الأداء (الزيارة التشخيصية الأولى ضد الزيارة الحالية)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-bold leading-relaxed">

          {/* Diagnostic visit performance metrics */}
          <div className="space-y-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-200/50">
            <h4 className="text-xs text-blue-600 border-b border-slate-200 pb-2">📊 الزيارة التشخيصية الأولى (سبتمبر 2026)</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">تخطيط التعلمات</span>
                <span className="text-slate-800">2.5 / 4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">تدبير التعلمات</span>
                <span className="text-slate-800">2.2 / 4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">دمج التكنولوجيا والذكاء الاصطناعي</span>
                <span className="text-slate-800">1.0 / 4</span>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-400 font-semibold text-[10px] leading-relaxed">
              الملاحظة: أداء بيداغوجي تقليدي ويحتاج توجيها مكثفاً بخصوص بناء الحصص التفاعلية.
            </div>
          </div>

          {/* Current performance metrics */}
          <div className="space-y-4 p-5 bg-blue-50/20 rounded-2xl border border-blue-100">
            <h4 className="text-xs text-emerald-600 border-b border-blue-100 pb-2">🚀 الزيارة التقييمية الحالية (نوفمبر 2026)</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">تخطيط التعلمات</span>
                <span className="text-emerald-600">3.5 / 4 (تطور ملحوظ)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">تدبير التعلمات</span>
                <span className="text-emerald-600">3.2 / 4 (تحسن جيد)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">دمج التكنولوجيا والذكاء الاصطناعي</span>
                <span className="text-amber-600">1.5 / 4 (قيد المتابعة)</span>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-blue-100 text-blue-700 font-semibold text-[10px] leading-relaxed">
              الملاحظة: استجابة ممتازة لتوصيات التخطيط وتدبير الحصص مع التزام واضح بخارطة الدعم.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
