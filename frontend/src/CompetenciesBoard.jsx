import React, { useState, useEffect } from 'react';
import {
  Award, TrendingUp, AlertTriangle, CheckCircle, ArrowRight,
  BookOpen, Users, Compass, HelpCircle, HardHat, Flame, Laptop, RefreshCw
} from 'lucide-react';
import { apiService } from './apiService';

export default function CompetenciesBoard({ onNavigate }) {
  const [competencies, setCompetencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCompetencies() {
      try {
        setLoading(true);
        const data = await apiService.getPedagogyCompetencies();
        setCompetencies(data || []);
      } catch (err) {
        console.error('Failed to load competencies:', err);
        setError('تعذر تحميل بيانات الكفايات البيداغوجية');
      } finally {
        setLoading(false);
      }
    }
    loadCompetencies();
  }, []);

  const getDomainIcon = (domaine, idx) => {
    if (!domaine) return <Award size={18} />;
    if (domaine.includes('تخطيط')) return <BookOpen size={18} />;
    if (domaine.includes('تدبير التعلمات') || domaine.includes('إدارة التعلمات')) return <Users size={18} />;
    if (domaine.includes('القسم') || domaine.includes('الفصل')) return <Compass size={18} />;
    if (domaine.includes('التقويم') || domaine.includes('التقييم')) return <HelpCircle size={18} />;
    if (domaine.includes('المهارات') || domaine.includes('الحياتية')) return <HardHat size={18} />;
    if (domaine.includes('الرقمية') || domaine.includes('الذكاء')) return <Laptop size={18} />;
    if (domaine.includes('التطور') || domaine.includes('التطوير')) return <TrendingUp size={18} />;
    if (domaine.includes('المادة') || domaine.includes('خصوصيات')) return <Flame size={18} />;
    return <Award size={18} />;
  };

  const getTrendBadge = (trend, score) => {
    const isPositive = (trend && trend.includes('↑')) || score >= 3.5;
    const isIntervention = (trend && trend.includes('دعم')) || score < 2.5;

    if (isPositive) {
      return {
        text: 'تطور إيجابي 📈',
        className: 'bg-green-50 text-green-700'
      };
    }
    if (isIntervention) {
      return {
        text: 'بحاجة لتدخل ⚠️',
        className: 'bg-red-50 text-red-700 animate-pulse'
      };
    }
    return {
      text: 'مستقر ➖',
      className: 'bg-blue-50 text-blue-700'
    };
  };

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
            <p className="text-xs text-slate-400 font-bold mt-1">تتبع دقيق لمستوى الكفاءة البيداغوجية والمهنية للأستاذ عبر 8 مجالات رئيسية (بيانات حية ومباشرة من النظام).</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-16 bg-white rounded-2xl border border-slate-100">
          <RefreshCw className="animate-spin text-blue-600 mr-2" size={20} />
          <span className="text-xs font-bold text-slate-500 mr-3">جاري تحميل مصفوفة الكفايات البيداغوجية...</span>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-xs font-bold text-center">
          {error}
        </div>
      ) : competencies.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-100 text-center text-xs font-bold text-slate-400">
          لا توجد تقييمات كفايات مسجلة في قاعدة البيانات حالياً.
        </div>
      ) : (
        /* COMPETENCY CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {competencies.map((comp, idx) => {
            const trendBadge = getTrendBadge(comp.tendance, comp.note);
            return (
              <div key={comp.idEvalComp || idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      {getDomainIcon(comp.domaine, idx)}
                    </span>

                    {/* Score Indicator */}
                    <div className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold text-slate-800">
                      <span>{Number(comp.note || 0).toFixed(1)}</span>
                      <span className="text-slate-400 text-[10px]"> / 4</span>
                    </div>
                  </div>

                  <h3 className="text-xs font-extrabold text-slate-800">{comp.domaine}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed h-12 overflow-hidden">
                    {comp.commentaire || 'تقييم شامل للمجال البيداغوجي وفق شبكة المعايير المعتمدة.'}
                  </p>
                </div>

                {/* Level and Trend */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold">
                    المستوى: <strong className="text-blue-700">{comp.niveau || 'متقن'}</strong>
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-extrabold ${trendBadge.className}`}>
                    {trendBadge.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
