import React from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, HelpCircle, Activity } from 'lucide-react';

export default function PerformanceEvolution({ onNavigate }) {
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
          <h1 className="text-2xl font-extrabold text-slate-800">تحليل تطور الأداء والنمو البيداغوجي</h1>
          <p className="text-xs text-slate-400 font-bold mt-1">دراسة تحليلية مفصلة لجوانب الأداء الميداني المصنفة حسب جودة العطاء.</p>
        </div>
      </div>

      {/* CATEGORIZED ANALYSIS PANELS (Screen 06) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Column 1: Areas with Clear Progress */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 bg-emerald-50 text-emerald-800 border-b border-emerald-100 flex items-center gap-2">
            <CheckCircle2 className="shrink-0" size={18} />
            <h3 className="text-xs font-extrabold">جوانب تسجل تقدماً ملموساً</h3>
          </div>

          <div className="p-5 flex-1 space-y-4 text-xs font-semibold leading-relaxed">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <p className="text-slate-800 font-bold">• تفعيل العمل الجماعي والتعاوني</p>
              <p className="text-slate-500 text-[11px]">مشاركة ممتازة لكافة الفئات الطلابية داخل الفصل عبر ورش عمل مصغرة ومنافسات تفاعلية.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <p className="text-slate-800 font-bold">• جودة التخطيط المسبق وبناء الحصة</p>
              <p className="text-slate-500 text-[11px]">احترام كامل للزمن المدرسي ولتسلسل المراحل التعليمية البيداغوجية بكل دقة.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <p className="text-slate-800 font-bold">• دمج المهارات الحياتية</p>
              <p className="text-slate-500 text-[11px]">التركيز على تنمية شخصية المتعلم ومهارات التواصل والإقناع بطرق إبداعية.</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
            مؤشر التطور: متصاعد وممتاز
          </div>
        </div>

        {/* Column 2: Stable Areas */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 bg-blue-50 text-blue-800 border-b border-blue-100 flex items-center gap-2">
            <HelpCircle className="shrink-0" size={18} />
            <h3 className="text-xs font-extrabold">جوانب مستقرة ومقبولة</h3>
          </div>

          <div className="p-5 flex-1 space-y-4 text-xs font-semibold leading-relaxed">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <p className="text-slate-800 font-bold">• إدارة وضبط الفصل الدراسي</p>
              <p className="text-slate-500 text-[11px]">السيطرة على الفصل مقبولة جداً، مع توظيف آليات تقليدية فعالة لمنع الفوضى.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <p className="text-slate-800 font-bold">• توظيف التقويم التكويني</p>
              <p className="text-slate-500 text-[11px]">استخدام روتيني ومستقر لأوراق العمل والأسئلة الشفوية لتقييم مدى استيعاب التلاميذ.</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
            مؤشر التطور: ثابت
          </div>
        </div>

        {/* Column 3: Areas Needing Support */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 bg-red-50 text-red-800 border-b border-red-100 flex items-center gap-2">
            <AlertCircle className="shrink-0" size={18} />
            <h3 className="text-xs font-extrabold">جوانب تحتاج دعماً بيداغوجياً عاجلاً</h3>
          </div>

          <div className="p-5 flex-1 space-y-4 text-xs font-semibold leading-relaxed">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <p className="text-slate-800 font-bold">• توظيف الموارد الرقمية والذكاء الاصطناعي</p>
              <p className="text-slate-500 text-[11px]">غياب شبه تام لاستخدام التكنولوجيا في الفصل، والاعتماد المطلق على الكتاب المدرسي والسبورة.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <p className="text-slate-800 font-bold">• تنويع تقنيات التقويم والدعم</p>
              <p className="text-slate-500 text-[11px]">الافتقار إلى أساليب تقويم حديثة تفرق بين مستويات الطلاب الفردية البطيئة والسريعة.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <p className="text-slate-800 font-bold">• أدوات الدعم الفردي</p>
              <p className="text-slate-500 text-[11px]">ضعف في وضع خطط علاجية مخصصة للمتعثرين دراسياً داخل الفصل.</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
            مؤشر التطور: متدني وبحاجة للمتابعة المستمرة
          </div>
        </div>

      </div>
    </div>
  );
}
