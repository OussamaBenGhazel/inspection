import React from 'react';
import {
  Award, TrendingUp, AlertTriangle, CheckCircle, ArrowRight,
  BookOpen, Users, Compass, HelpCircle, HardHat, Flame, Laptop
} from 'lucide-react';

export default function CompetenciesBoard({ onNavigate }) {
  // 8 teaching competencies (Screen 05)
  const competencies = [
    { name: "تخطيط التعلمات", score: "3.5", desc: "قدرة عالية على تصميم الجذاذات وبناء الأنشطة التعليمية.", trend: "positive" },
    { name: "تدبير التعلمات", score: "3.2", desc: "تنظيم متميز لزمن الحصة وتفعيل دور المتعلم النشط.", trend: "stable" },
    { name: "تدبير الفصل الدراسي", score: "2.8", desc: "يحتاج لآليات أكثر مرونة في ضبط المجموعات المشاغبة.", trend: "intervention" },
    { name: "التقويم والدعم البيداغوجي", score: "3.0", desc: "توظيف جيد لتقنيات التقويم التكويني السريع.", trend: "stable" },
    { name: "المهارات الحياتية والريادة", score: "3.8", desc: "تكامل رائع لمهارات التواصل وحل المشكلات لدى التلاميذ.", trend: "positive" },
    { name: "الموارد الرقمية والذكاء الاصطناعي", score: "1.5", desc: "ضعف واضح في دمج أدوات التكنولوجيا الحديثة بالحصة.", trend: "intervention" },
    { name: "التطوير المهني الذاتي", score: "3.2", desc: "مشاركة إيجابية في الدورات التدريبية والملتقيات.", trend: "stable" },
    { name: "خصوصيات التدريس المادة", score: "3.6", desc: "تمكن علمي ممتاز ومواكب لمستجدات المنهج الدراسي.", trend: "positive" }
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header and Back navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition"
          >
            <ArrowRight size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">لوحة الكفايات الثمانية</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">تتبع دقيق لمستوى الكفاءة البيداغوجية والمهنية للأستاذ عبر 8 مجالات رئيسية.</p>
          </div>
        </div>
      </div>

      {/* COMPETENCY CARDS GRID (Screen 05) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {competencies.map((comp, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  {idx === 0 && <BookOpen size={18} />}
                  {idx === 1 && <Users size={18} />}
                  {idx === 2 && <Compass size={18} />}
                  {idx === 3 && <HelpCircle size={18} />}
                  {idx === 4 && <HardHat size={18} />}
                  {idx === 5 && <Laptop size={18} />}
                  {idx === 6 && <TrendingUp size={18} />}
                  {idx === 7 && <Award size={18} />}
                </span>

                {/* Score Indicator */}
                <div className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold text-slate-800">
                  <span>{comp.score}</span>
                  <span className="text-slate-400 text-[10px]"> / 4</span>
                </div>
              </div>

              <h3 className="text-xs font-extrabold text-slate-800">{comp.name}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed h-12 overflow-hidden">{comp.desc}</p>
            </div>

            {/* TREND INDICATORS (Screen 05) */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold">اتجاه الكفاية</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-extrabold ${
                comp.trend === 'positive' ? 'bg-green-50 text-green-700' :
                comp.trend === 'stable' ? 'bg-blue-50 text-blue-700' :
                'bg-red-50 text-red-700 animate-pulse'
              }`}>
                {comp.trend === 'positive' ? 'تطور إيجابي 📈' :
                 comp.trend === 'stable' ? 'مستقر ➖' : 'بحاجة لتدخل ⚠️'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
