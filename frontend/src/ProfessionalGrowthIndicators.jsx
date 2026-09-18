import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Award, Target, Settings, RefreshCw } from 'lucide-react';
import { apiService } from './apiService';

export default function ProfessionalGrowthIndicators({ onNavigate }) {
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function fetchIndicators() {
      try {
        setLoading(true);
        const data = await apiService.getPedagogyIndicators();
        setIndicators(data || []);
      } catch (err) {
        console.error('Failed to load indicators:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchIndicators();
  }, []);

  const handleSelection = async (ind, choice) => {
    // Immediate optimistic update
    setIndicators(prev => prev.map(i => i.idIndicateur === ind.idIndicateur ? { ...i, valeur: choice } : i));

    try {
      await apiService.updateIndicator(ind.idIndicateur, { valeur: choice });
    } catch (err) {
      console.error('Failed to update indicator:', err);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      for (const ind of indicators) {
        await apiService.updateIndicator(ind.idIndicateur, { valeur: ind.valeur });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save indicators:', err);
    } finally {
      setSaving(false);
    }
  };

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
            <h1 className="text-2xl font-extrabold text-slate-800">مؤشرات النمو المهني البيداغوجي</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">مصفوفة تقييم نوعية لرصد التزام وتفاعل الأستاذ مع معايير التطوير (متزامنة مباشرة مع السيرفر).</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 flex items-center gap-1.5 animate-fade-in">
              <CheckCircle size={14} />
              <span>تم الحفظ والتزامن بنجاح!</span>
            </span>
          )}
          <button
            onClick={handleSaveAll}
            disabled={saving || loading}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-100"
          >
            {saving ? <RefreshCw className="animate-spin" size={15} /> : <CheckCircle size={15} />}
            <span>{saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-16 bg-white rounded-2xl border border-slate-100">
          <RefreshCw className="animate-spin text-blue-600 mr-2" size={20} />
          <span className="text-xs font-bold text-slate-500 mr-3">جاري تحميل مصفوفة المؤشرات النوعية...</span>
        </div>
      ) : indicators.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-100 text-center text-xs font-bold text-slate-400">
          لا توجد مؤشرات مسجلة حتى الآن.
        </div>
      ) : (
        /* QUALITATIVE MATRIX LIST */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold border-b border-slate-100">
                  <th className="p-4 w-12 text-center">الرقم</th>
                  <th className="p-4">مؤشر النمو البيداغوجي النوعي</th>
                  <th className="p-4">الشاهد / الملاحظة الإجرائية</th>
                  <th className="p-4 text-center w-64">خيارات التقييم والمطابقة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {indicators.map((ind, index) => {
                  const isYes = ind.valeur === 'yes' || ind.valeur === 'نعم';
                  const isPartial = ind.valeur === 'partial' || ind.valeur === 'جزئيا';
                  const isNo = ind.valeur === 'no' || ind.valeur === 'لا';

                  return (
                    <tr key={ind.idIndicateur || index} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 text-center font-bold text-slate-400">{index + 1}</td>
                      <td className="p-4 font-bold text-slate-800">{ind.libelle}</td>
                      <td className="p-4 text-slate-500 text-[11px] font-medium leading-relaxed">
                        {ind.commentaire || '---'}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-6">
                          <label className="flex items-center gap-1.5 cursor-pointer font-extrabold">
                            <input
                              type="radio"
                              name={`ind-${ind.idIndicateur}`}
                              checked={isYes}
                              onChange={() => handleSelection(ind, 'yes')}
                              className="text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                            />
                            <span className="text-emerald-700">نعم</span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer font-extrabold">
                            <input
                              type="radio"
                              name={`ind-${ind.idIndicateur}`}
                              checked={isPartial}
                              onChange={() => handleSelection(ind, 'partial')}
                              className="text-amber-600 focus:ring-amber-500 h-4 w-4"
                            />
                            <span className="text-amber-700">جزئياً</span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer font-extrabold">
                            <input
                              type="radio"
                              name={`ind-${ind.idIndicateur}`}
                              checked={isNo}
                              onChange={() => handleSelection(ind, 'no')}
                              className="text-red-600 focus:ring-red-500 h-4 w-4"
                            />
                            <span className="text-red-700">لا</span>
                          </label>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
