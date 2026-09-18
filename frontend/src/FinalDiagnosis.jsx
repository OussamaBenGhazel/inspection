import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, FileText, LayoutList, RefreshCw } from 'lucide-react';
import { apiService } from './apiService';

export default function FinalDiagnosis({ onNavigate }) {
  const [diagnostic, setDiagnostic] = useState({
    pointsForts: '',
    defis: '',
    prioritesDeveloppement: '',
    typeAccompagnement: 'مرافقة ميدانية'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Support Type Selectors state
  const [supportTypes, setSupportTypes] = useState({
    training: true,
    fieldSupport: true,
    experienceSharing: false,
    actionResearch: false
  });

  useEffect(() => {
    async function loadDiagnostic() {
      try {
        setLoading(true);
        const data = await apiService.getPedagogyDiagnostic();
        if (data) {
          setDiagnostic(data);
          const typeStr = data.typeAccompagnement || '';
          setSupportTypes({
            training: typeStr.includes('تدريب') || typeStr.includes('تكوين'),
            fieldSupport: typeStr.includes('ميدان') || typeStr.includes('مرافقة'),
            experienceSharing: typeStr.includes('خبرات') || typeStr.includes('تبادل'),
            actionResearch: typeStr.includes('بحوث') || typeStr.includes('إجرائي')
          });
        }
      } catch (err) {
        console.error('Failed to load final diagnostic:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDiagnostic();
  }, []);

  const handleCheckboxChange = (key) => {
    const updated = { ...supportTypes, [key]: !supportTypes[key] };
    setSupportTypes(updated);

    const labels = [];
    if (updated.training) labels.push('دورات تدريبية مكثفة');
    if (updated.fieldSupport) labels.push('تأطير ميداني مباشر');
    if (updated.experienceSharing) labels.push('تبادل ومشاركة الخبرات');
    if (updated.actionResearch) labels.push('البحوث الإجرائية الميدانية');

    setDiagnostic(prev => ({
      ...prev,
      typeAccompagnement: labels.join('، ')
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiService.saveDiagnostic(diagnostic);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onNavigate('dashboard');
      }, 1500);
    } catch (err) {
      console.error('Failed to save diagnostic:', err);
      alert('حدث خطأ أثناء حفظ التشخيص الختامي.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">
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
            <h1 className="text-2xl font-extrabold text-slate-800">التشخيص الختامي والتقييم النهائي</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">صياغة بيداغوجية سردية مفصلة تحدد خلاصة الأداء والتوصيات الإستراتيجية للأستاذ (محفوظة في السيرفر).</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>تم اعتماد وحفظ التشخيص بنجاح!</span>
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-1.5 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-100"
          >
            {saving ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
            <span>{saving ? 'جاري الحفظ...' : 'اعتماد التشخيص الختامي'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-16 bg-white rounded-2xl border border-slate-100">
          <RefreshCw className="animate-spin text-blue-600 mr-2" size={20} />
          <span className="text-xs font-bold text-slate-500 mr-3">جاري تحميل وثيقة التشخيص الختامي...</span>
        </div>
      ) : (
        <>
          {/* SUMMARY CARDS LAYOUT (Screen 11) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">

            {/* Block 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <label className="block text-slate-500 font-bold">جوانب النمو والتطور المهني المحققة (Strengths):</label>
              <textarea
                rows="3"
                value={diagnostic.pointsForts || ''}
                onChange={e => setDiagnostic({ ...diagnostic, pointsForts: e.target.value })}
                placeholder="أدخل جوانب القوة والتقدم التي أظهرها الأستاذ..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Block 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <label className="block text-slate-500 font-bold">المجالات والتحديات التي تتطلب دعماً مستمراً (Challenges):</label>
              <textarea
                rows="3"
                value={diagnostic.defis || ''}
                onChange={e => setDiagnostic({ ...diagnostic, defis: e.target.value })}
                placeholder="أدخل الصعوبات أو التحديات المرصودة..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Block 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <label className="block text-slate-500 font-bold">الأولويات التنموية للمرحلة القادمة (Priorities):</label>
              <textarea
                rows="3"
                value={diagnostic.prioritesDeveloppement || ''}
                onChange={e => setDiagnostic({ ...diagnostic, prioritesDeveloppement: e.target.value })}
                placeholder="أدخل الأولويات الإستراتيجية للتطوير القادم..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Block 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <label className="block text-slate-500 font-bold">نوع المرافقة المسجلة حالياً في النظام:</label>
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-blue-900 font-bold text-xs h-[88px] flex items-center">
                {diagnostic.typeAccompagnement || 'مرافقة ميدانية وتكوين مستمر'}
              </div>
            </div>

          </div>

          {/* SUPPORT TYPE SELECTORS (Screen 11) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-slate-800 border-b border-slate-100 pb-2">
              نوع التدخل التأطيري والمتابعة المقترحة (Support Type)
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold">

              <label className="flex items-center gap-2.5 p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={supportTypes.training}
                  onChange={() => handleCheckboxChange('training')}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-slate-700">دورات تدريبية مكثفة</span>
              </label>

              <label className="flex items-center gap-2.5 p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={supportTypes.fieldSupport}
                  onChange={() => handleCheckboxChange('fieldSupport')}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-slate-700">تأطير ميداني مباشر</span>
              </label>

              <label className="flex items-center gap-2.5 p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={supportTypes.experienceSharing}
                  onChange={() => handleCheckboxChange('experienceSharing')}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-slate-700">تبادل ومشاركة الخبرات</span>
              </label>

              <label className="flex items-center gap-2.5 p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={supportTypes.actionResearch}
                  onChange={() => handleCheckboxChange('actionResearch')}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-slate-700">البحوث الإجرائية الميدانية</span>
              </label>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
