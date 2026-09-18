import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Clock, Search, Filter, RefreshCw, CheckSquare } from 'lucide-react';
import { apiService } from './apiService';

export default function RecommendationsTracking({ onNavigate }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPedagogyRecommendations();
      setRecommendations(data || []);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const handleUpdateStatus = async (rec, newStatus, newProgress) => {
    try {
      setUpdatingId(rec.idRecommandation);
      await apiService.updateRecommendation(rec.idRecommandation, {
        statut: newStatus,
        progression: newProgress
      });
      await loadRecommendations();
    } catch (err) {
      console.error('Failed to update recommendation status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRecs = recommendations.filter(rec => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'completed') return rec.statut === 'منجزة بالكامل' || rec.progression === 100;
    if (statusFilter === 'partial') return rec.statut === 'منجزة جزئيا' || (rec.progression > 0 && rec.progression < 100);
    if (statusFilter === 'pending') return rec.statut === 'غير منجزة' || rec.progression === 0;
    return true;
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition"
          >
            <ArrowRight size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">سجل تتبع التوصيات البيداغوجية</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">رصد ومتابعة دقيقة لمدى التزام وتطبيق الأساتذة بالتوصيات المقترحة (متصلة بقاعدة البيانات مباشرة).</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              statusFilter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            الكل ({recommendations.length})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              statusFilter === 'completed' ? 'bg-green-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            مكتملة
          </button>
          <button
            onClick={() => setStatusFilter('partial')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              statusFilter === 'partial' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            قيد الإنجاز
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              statusFilter === 'pending' ? 'bg-red-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            غير منجزة
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-16 bg-white rounded-2xl border border-slate-100">
          <RefreshCw className="animate-spin text-blue-600 mr-2" size={20} />
          <span className="text-xs font-bold text-slate-500 mr-3">جاري تحميل التوصيات البيداغوجية...</span>
        </div>
      ) : filteredRecs.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-100 text-center text-xs font-bold text-slate-400">
          لا توجد توصيات تطابق هذا المعيار حالياً.
        </div>
      ) : (
        /* RECOMMENDATION CARDS GRID */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredRecs.map((rec, idx) => {
            const isCompleted = rec.statut === 'منجزة بالكامل' || rec.progression === 100;
            const isPartial = rec.statut === 'منجزة جزئيا' || (rec.progression > 0 && rec.progression < 100);

            return (
              <div
                key={rec.idRecommandation || idx}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      isCompleted ? 'bg-green-50 text-green-700' :
                      isPartial ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700 animate-pulse'
                    }`}>
                      {isCompleted ? 'منجزة بالكامل ✨' :
                       isPartial ? 'منجزة جزئياً ⏳' : 'غير منجزة ❌'}
                    </span>

                    <span className="text-[10px] text-slate-400 font-bold">
                      أجل التنفيذ: {rec.dateEcheance || 'نهاية الثلاثي'}
                    </span>
                  </div>

                  <h3 className="text-xs font-extrabold text-slate-800 leading-relaxed">
                    {rec.texteRecommandation}
                  </h3>
                  {rec.enseignant && (
                    <p className="text-[10px] text-blue-600 font-bold">
                      الأستاذ: {rec.enseignant.prenom} {rec.enseignant.nom}
                    </p>
                  )}
                </div>

                {/* Progress Bar & Evidence */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-400">نسبة التقدم والتطبيق:</span>
                    <span className="text-blue-600">{rec.progression || 0}%</span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-green-500' :
                        isPartial ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${rec.progression || 0}%` }}
                    />
                  </div>

                  {/* Details & Evidence */}
                  <div className="pt-2">
                    <p className="text-[10px] text-slate-400 font-bold">القرائن وشواهد التطبيق (Evidence):</p>
                    <p className="text-[10px] text-slate-600 mt-1 italic font-medium leading-relaxed">
                      {rec.evidence || 'قيد المتابعة من قبل المتفقد البيداغوجي خلال الزيارات القادمة.'}
                    </p>
                  </div>

                  {/* Quick Action Buttons to update status directly */}
                  <div className="pt-2 flex items-center justify-end gap-1.5 border-t border-slate-50">
                    <button
                      onClick={() => handleUpdateStatus(rec, 'منجزة بالكامل', 100)}
                      disabled={updatingId === rec.idRecommandation}
                      className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded text-[9px] font-extrabold transition"
                      title="اعتماد الإنجاز بالكامل"
                    >
                      اعتماد 100%
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(rec, 'منجزة جزئيا', 60)}
                      disabled={updatingId === rec.idRecommandation}
                      className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded text-[9px] font-extrabold transition"
                      title="تحديد قيد الإنجاز"
                    >
                      تحديد 60%
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
