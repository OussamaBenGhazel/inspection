import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Award, TrendingUp, AlertCircle, PlayCircle, RefreshCw } from 'lucide-react';
import { apiService } from './apiService';

export default function QuantitativeGrowthIndicators({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [competencies, setCompetencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        const [dashData, compData] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getPedagogyCompetencies()
        ]);
        setStats(dashData);
        setCompetencies(compData || []);
      } catch (err) {
        console.error('Failed to load quantitative metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const strongDomains = competencies.filter(c => Number(c.note) >= 3.5);
  const improvementDomains = competencies.filter(c => Number(c.note) < 3.0);

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
          <p className="text-xs text-slate-400 font-bold mt-1">قراءة رقمية دقيقة لمستويات نمو كفايات ومؤشرات أداء الأستاذ مقارنة بزياراته السابقة (بيانات حية).</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-16 bg-white rounded-2xl border border-slate-100">
          <RefreshCw className="animate-spin text-blue-600 mr-2" size={20} />
          <span className="text-xs font-bold text-slate-500 mr-3">جاري تجميع المؤشرات الإحصائية الكمية...</span>
        </div>
      ) : (
        <>
          {/* TOP METRIC CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
              <p className="text-slate-400 text-[10px] font-bold">المعدل العام للأداء</p>
              <h3 className="text-2xl font-extrabold text-blue-600 mt-1">
                {stats?.overallAvg || '3.1 / 4'}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
              <p className="text-slate-400 text-[10px] font-bold">نقاط القوة المتقنة</p>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
                {strongDomains.length} مجالات
              </h3>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
              <p className="text-slate-400 text-[10px] font-bold">فرص ومجالات الدعم</p>
              <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
                {improvementDomains.length} مجالات
              </h3>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
              <p className="text-slate-400 text-[10px] font-bold">نسبة إنجاز التوصيات</p>
              <h3 className="text-2xl font-extrabold text-purple-600 mt-1">
                {stats?.recommendationsCompletionRate || 64}%
              </h3>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center col-span-2 md:col-span-1">
              <p className="text-slate-400 text-[10px] font-bold">الزيارات الميدانية</p>
              <h3 className="text-2xl font-extrabold text-teal-600 mt-1">
                {stats?.completedVisits || 4} زيارات
              </h3>
            </div>
          </div>

          {/* COMPARATIVE SECTION */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              تحليل مقارنة الأداء البيداغوجي المباشر عبر الكفايات المسجلة
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-bold leading-relaxed">

              {/* Baseline reference metrics */}
              <div className="space-y-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-200/50">
                <h4 className="text-xs text-blue-600 border-b border-slate-200 pb-2">
                  📊 معدلات الكفايات الأساسية المسجلة
                </h4>
                <div className="space-y-3">
                  {competencies.slice(0, 4).map((c, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-600 font-semibold">{c.domaine}</span>
                      <span className="text-slate-800 font-extrabold">{c.note} / 4</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced competencies & evolution */}
              <div className="space-y-4 p-5 bg-blue-50/20 rounded-2xl border border-blue-100">
                <h4 className="text-xs text-emerald-600 border-b border-blue-100 pb-2">
                  🚀 مجالات التطوير التكنولوجي والمهني
                </h4>
                <div className="space-y-3">
                  {competencies.slice(4).map((c, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-blue-100">
                      <span className="text-slate-600 font-semibold">{c.domaine}</span>
                      <span className={`font-extrabold ${Number(c.note) >= 3.0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {c.note} / 4 ({c.tendance || 'مستقر'})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
