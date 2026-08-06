import React from 'react';
import { ArrowRight, Smartphone, Bell, Calendar, Star, FileText, CheckCircle } from 'lucide-react';

export default function MobilePreview({ onNavigate }) {
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
            <h1 className="text-2xl font-extrabold text-slate-800">محاكاة ومعاينة الهواتف واللوحيات</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">عرض وتأكيد واجهة النظام المخصصة والمتجاوبة مع الهواتف الذكية للتنقل السريع في العمل الميداني.</p>
          </div>
        </div>
      </div>

      {/* RESPONSIVE VIEWPORT SIMULATOR (Screen 15) */}
      <div className="flex justify-center items-center py-6 bg-slate-100/50 rounded-2xl border border-slate-200/50">
        <div className="w-[360px] h-[640px] bg-white border-[12px] border-slate-800 rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col justify-between">

          {/* Phone Ear Piece Bar */}
          <div className="h-6 bg-slate-800 w-32 mx-auto rounded-b-xl absolute top-0 inset-x-0 z-50 flex items-center justify-center">
            <span className="h-1.5 w-10 bg-slate-600 rounded-full" />
          </div>

          {/* Phone Content viewport */}
          <div className="flex-1 overflow-y-auto pt-8 pb-4 px-4 space-y-4 text-xs font-bold text-slate-800" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-extrabold text-blue-600">التفقد الميداني</span>
              <span className="text-[10px] text-slate-400 font-bold">14:15</span>
            </div>

            {/* Welcome widget */}
            <div className="p-3 bg-blue-600 text-white rounded-xl shadow-sm">
              <h4 className="text-[11px] font-extrabold">مرحباً أ. آمنة فرحات</h4>
              <p className="text-[9px] text-blue-100 mt-1 font-semibold">تطبيق متجاوب تماماً مع جهازك المحمول.</p>
            </div>

            {/* STACKED ESSENTIAL WIDGETS (Screen 15) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/50 text-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase">الأساتذة</p>
                <h4 className="text-base font-extrabold text-slate-800 mt-1">124</h4>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/50 text-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase">الزيارات</p>
                <h4 className="text-base font-extrabold text-blue-600 mt-1">48</h4>
              </div>
            </div>

            {/* Upcoming visit scheduler item */}
            <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">الزيارة المجدولة القادمة:</span>
                <span className="text-blue-600 font-bold">غداً 08:30</span>
              </div>
              <p className="text-[10px] text-slate-700 leading-relaxed font-semibold">أ. صالح البكوش • المدرسة الإعدادية بالرياض</p>
            </div>

            {/* Active Goals checklist */}
            <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl space-y-2">
              <h5 className="text-[10px] text-slate-400 font-extrabold border-b border-slate-100 pb-1">أهداف النمو النشطة:</h5>
              <ul className="space-y-1 text-[10px] text-slate-600 font-medium">
                <li className="flex items-center gap-1.5">• استخدام Kahoot أسبوعياً</li>
                <li className="flex items-center gap-1.5">• توظيف بطاقات التقييم السريع</li>
              </ul>
            </div>
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="h-4 bg-slate-800 flex items-center justify-center shrink-0">
            <span className="h-1 w-24 bg-slate-600 rounded-full" />
          </div>

        </div>
      </div>
    </div>
  );
}
