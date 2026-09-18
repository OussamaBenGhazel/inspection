import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, HelpCircle, Activity, RefreshCw } from 'lucide-react';
import { apiService } from './apiService';

export default function PerformanceEvolution({ onNavigate }) {
  const [competencies, setCompetencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiService.getPedagogyCompetencies();
        setCompetencies(data || []);
      } catch (err) {
        console.error('Error fetching competencies for evolution:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const progressingAreas = competencies.filter(c => Number(c.note) >= 3.5 || (c.tendance && c.tendance.includes('↑')));
  const needsSupportAreas = competencies.filter(c => Number(c.note) < 2.8 || (c.tendance && c.tendance.includes('دعم')));
  const stableAreas = competencies.filter(c => !progressingAreas.includes(c) && !needsSupportAreas.includes(c));

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
          <p className="text-xs text-slate-400 font-bold mt-1">دراسة تحليلية مفصلة لجوانب الأداء الميداني المصنفة حسب جودة العطاء (بيانات مستخرجة في الوقت الفعلي).</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-16 bg-white rounded-2xl border border-slate-100">
          <RefreshCw className="animate-spin text-blue-600 mr-2" size={20} />
          <span className="text-xs font-bold text-slate-500 mr-3">جاري تحليل بيانات تطور الأداء...</span>
        </div>
      ) : (
        /* CATEGORIZED ANALYSIS PANELS (Screen 06) */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Column 1: Areas with Clear Progress */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-4 bg-emerald-50 text-emerald-800 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="shrink-0 text-emerald-600" size={18} />
                <h3 className="text-xs font-extrabold">جوانب تسجل تقدماً ملموساً</h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-extrabold">
                {progressingAreas.length} مجالات
              </span>
            </div>

            <div className="p-5 flex-1 space-y-3 text-xs font-semibold leading-relaxed">
              {progressingAreas.length === 0 ? (
                <p className="text-slate-400 text-center py-6 text-[11px]">لا توجد مجالات مسجلة في هذه الفئة.</p>
              ) : (
                progressingAreas.map((item, idx) => (
                  <div key={item.idEvalComp || idx} className="p-3 bg-emerald-50/30 border border-emerald-100/60 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-800 font-bold">• {item.domaine}</p>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {item.note} / 4
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">{item.commentaire}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-[10px] text-emerald-700 font-bold flex items-center justify-between">
              <span>مؤشر التطور: متصاعد وممتاز</span>
              <span>مكتمل بنجاح ✨</span>
            </div>
          </div>

          {/* Column 2: Stable Areas */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-4 bg-blue-50 text-blue-800 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="shrink-0 text-blue-600" size={18} />
                <h3 className="text-xs font-extrabold">جوانب مستقرة ومقبولة</h3>
              </div>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] font-extrabold">
                {stableAreas.length} مجالات
              </span>
            </div>

            <div className="p-5 flex-1 space-y-3 text-xs font-semibold leading-relaxed">
              {stableAreas.length === 0 ? (
                <p className="text-slate-400 text-center py-6 text-[11px]">لا توجد مجالات مسجلة في هذه الفئة.</p>
              ) : (
                stableAreas.map((item, idx) => (
                  <div key={item.idEvalComp || idx} className="p-3 bg-blue-50/30 border border-blue-100/60 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-800 font-bold">• {item.domaine}</p>
                      <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                        {item.note} / 4
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">{item.commentaire}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-[10px] text-blue-700 font-bold flex items-center justify-between">
              <span>مؤشر التطور: أداء متوازن ومستقر</span>
              <span>↔ قيد المتابعة</span>
            </div>
          </div>

          {/* Column 3: Areas Needing Support */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-4 bg-red-50 text-red-800 border-b border-red-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="shrink-0 text-red-600" size={18} />
                <h3 className="text-xs font-extrabold">جوانب تحتاج دعماً بيداغوجياً عاجلاً</h3>
              </div>
              <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-[10px] font-extrabold">
                {needsSupportAreas.length} مجالات
              </span>
            </div>

            <div className="p-5 flex-1 space-y-3 text-xs font-semibold leading-relaxed">
              {needsSupportAreas.length === 0 ? (
                <p className="text-slate-400 text-center py-6 text-[11px]">لا توجد مجالات تستدعي التدخل العاجل.</p>
              ) : (
                needsSupportAreas.map((item, idx) => (
                  <div key={item.idEvalComp || idx} className="p-3 bg-red-50/30 border border-red-100/60 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-800 font-bold">• {item.domaine}</p>
                      <span className="text-[10px] font-extrabold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                        {item.note} / 4
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">{item.commentaire}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-[10px] text-red-700 font-bold flex items-center justify-between">
              <span>مؤشر التطور: متدني وبحاجة للمرافقة</span>
              <span>⚠️ أولوية تأطيرية</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
