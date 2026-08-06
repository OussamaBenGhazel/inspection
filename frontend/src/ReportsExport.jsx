import React from 'react';
import { ArrowRight, FileText, Download, Award, ShieldCheck, Star } from 'lucide-react';

export default function ReportsExport({ onNavigate }) {
  // Mock summary metrics (Screen 12)
  const reportStats = {
    overallAvg: "3.2 / 4",
    visitCount: "3 زيارات ميدانية",
    recommendationsCompletion: "76%"
  };

  const handleExport = (format) => {
    alert(`جاري تصدير التقرير البيداغوجي الموحد بصيغة ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6" dir="rtl">
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
            <h1 className="text-2xl font-extrabold text-slate-800">مركز التقارير وتصدير البيانات</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">توليد وتصدير تقارير الأداء الميداني الفردية والجماعية وصياغتها بصيغ رقمية مختلفة.</p>
          </div>
        </div>
      </div>

      {/* EXPORT BAR (Screen 12) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="text-xs font-bold text-slate-700">تصدير التقرير البيداغوجي الموحد للأستاذ:</div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition"
          >
            <Download size={14} />
            <span>تصدير PDF 📕</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl text-xs font-bold transition"
          >
            <Download size={14} />
            <span>تصدير Excel 📗</span>
          </button>
          <button
            onClick={() => handleExport('word')}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold transition"
          >
            <Download size={14} />
            <span>تصدير Word 📘</span>
          </button>
        </div>
      </div>

      {/* REPORT PREVIEW & STATS (Screen 12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs font-bold leading-relaxed">
        {/* Statistics block */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs text-slate-800 border-b border-slate-100 pb-2">مؤشرات إحصائية للتقرير</h3>
          <div className="space-y-4 font-semibold">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 text-[10px] font-bold block">المعدل العام للكفايات</span>
              <span className="text-lg font-extrabold text-blue-600 mt-1 block">{reportStats.overallAvg}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 text-[10px] font-bold block">مجموع الزيارات المنجزة</span>
              <span className="text-lg font-extrabold text-slate-800 mt-1 block">{reportStats.visitCount}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 text-[10px] font-bold block">نسبة تطبيق التوصيات المقترحة</span>
              <span className="text-lg font-extrabold text-emerald-600 mt-1 block">{reportStats.recommendationsCompletion}</span>
            </div>
          </div>
        </div>

        {/* Preview pane */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs text-slate-800 border-b border-slate-100 pb-2">معاينة التقرير البيداغوجي الموحد (Preview)</h3>
          <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/50 space-y-4 h-64 overflow-y-auto font-medium text-[11px] leading-relaxed">
            <div className="text-center font-extrabold text-xs text-slate-800">جمهورية تونس • وزارة التربية</div>
            <div className="text-center font-bold text-slate-500">تقرير زيارة تفقدية شاملة للأساتذة</div>
            <div className="border-b border-slate-200 pb-2" />
            <div className="space-y-2 text-slate-700">
              <p>• <span className="font-bold">اسم الأستاذ المشاهد:</span> سناء بن عمر</p>
              <p>• <span className="font-bold">المعدل الإجمالي المحقق:</span> 3.2 من 4 نقاط</p>
              <p>• <span className="font-bold">خلاصة التشخيص الختامي:</span> يظهر المعلم تفوقاً ممتازاً في بناء الأنشطة والتعلم الجماعي، مع فرص واعدة لتحسين دمج أدوات الذكاء الاصطناعي والموارد الرقمية.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
