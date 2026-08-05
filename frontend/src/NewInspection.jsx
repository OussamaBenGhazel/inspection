import React, { useEffect, useState } from 'react';
import { apiService } from './apiService';
import { useAuth } from './AuthContext';
import { ArrowRight, Save, Plus, Trash2, Calendar, Clock, BookOpen, AlertCircle } from 'lucide-react';

const PREDEFINED_CRITERIA = [
  "التمكن العلمي من المادة المعرفية",
  "التخطيط وتدبير الحصة الدراسية",
  "التواصل وبناء العلاقات الصفية",
  "توظيف الوسائط التكنولوجية والتعليمية",
  "ملاءمة وضعيات التقويم المعتمدة"
];

export default function NewInspection({ onNavigate }) {
  const { user } = useAuth();
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // form fields
  const [idEnseignant, setIdEnseignant] = useState('');
  const [dateVisite, setDateVisite] = useState(new Date().toISOString().split('T')[0]);
  const [heureDebut, setHeureDebut] = useState('08:00');
  const [heureFin, setHeureFin] = useState('09:30');
  const [remarquesGenerales, setRemarquesGenerales] = useState('');
  const [evaluations, setEvaluations] = useState([
    { critere: PREDEFINED_CRITERIA[0], note: 8, commentaire: '' }
  ]);

  useEffect(() => {
    async function loadTeachers() {
      try {
        const list = await apiService.getEnseignants();
        setEnseignants(list);
        if (list.length > 0) {
          setIdEnseignant(list[0].idEnseignant.toString());
        }
      } catch (err) {
        console.error(err);
        setError('تعذر تحميل قائمة الأساتذة');
      } finally {
        setLoading(false);
      }
    }
    loadTeachers();
  }, []);

  const addEvaluationRow = () => {
    const nextCritere = PREDEFINED_CRITERIA[evaluations.length % PREDEFINED_CRITERIA.length];
    setEvaluations([...evaluations, { critere: nextCritere, note: 8, commentaire: '' }]);
  };

  const removeEvaluationRow = (index) => {
    setEvaluations(evaluations.filter((_, i) => i !== index));
  };

  const handleEvaluationChange = (index, field, value) => {
    const updated = [...evaluations];
    updated[index][field] = value;
    setEvaluations(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!idEnseignant) {
      setError('الرجاء اختيار الأستاذ');
      return;
    }

    if (evaluations.length === 0) {
      setError('يجب إضافة تقييم واحد على الأقل للمتابعة');
      return;
    }

    try {
      const dto = {
        idEnseignant: parseInt(idEnseignant),
        idInspecteur: user.idInspecteur,
        dateVisite,
        heureDebut: heureDebut + ':00',
        heureFin: heureFin + ':00',
        remarquesGenerales,
        evaluations: evaluations.map(ev => ({
          critere: ev.critere,
          note: parseInt(ev.note),
          commentaire: ev.commentaire
        }))
      };

      const result = await apiService.createInspection(dto);
      onNavigate('inspection-details', result.idInspection);
    } catch (err) {
      setError(err.message || 'فشلت عملية حفظ التفتيش الجديد');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">
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
            <h1 className="text-2xl font-bold text-slate-800">إنشاء عملية تفقد جديدة</h1>
            <p className="text-slate-500 mt-1">قم بتعبئة حقول التفقد والمعايير لتوثيق الزيارة الصفية.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-r-4 border-red-500 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle className="shrink-0" size={20} />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic visit details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-bold mb-2 text-sm flex items-center gap-1.5">
              <BookOpen size={16} className="text-slate-400" />
              <span>الأستاذ المعني بالتفقد *</span>
            </label>
            <select
              value={idEnseignant}
              onChange={(e) => setIdEnseignant(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 font-semibold transition"
              required
            >
              <option value="">-- اختر الأستاذ --</option>
              {enseignants.map(e => (
                <option key={e.idEnseignant} value={e.idEnseignant}>
                  {e.prenom} {e.nom} ({e.matiere})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-2 text-sm flex items-center gap-1.5">
              <Calendar size={16} className="text-slate-400" />
              <span>تاريخ الزيارة *</span>
            </label>
            <input
              type="date"
              value={dateVisite}
              onChange={(e) => setDateVisite(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 font-semibold transition"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-2 text-sm flex items-center gap-1.5">
                <Clock size={16} className="text-slate-400" />
                <span>وقت البدء *</span>
              </label>
              <input
                type="time"
                value={heureDebut}
                onChange={(e) => setHeureDebut(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 font-semibold transition"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-2 text-sm flex items-center gap-1.5">
                <Clock size={16} className="text-slate-400" />
                <span>وقت الانتهاء *</span>
              </label>
              <input
                type="time"
                value={heureFin}
                onChange={(e) => setHeureFin(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 font-semibold transition"
                required
              />
            </div>
          </div>
        </div>

        {/* Dynamic Evaluations Fields */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">معايير التقييم البيداغوجي</h3>
              <p className="text-slate-500 text-xs mt-1">حدد المعيار والنقطة من 1 إلى 10 مع ملاحظاتك الإرشادية للأستاذ.</p>
            </div>
            <button
              type="button"
              onClick={addEvaluationRow}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl text-xs transition"
            >
              <Plus size={16} />
              <span>إضافة معيار تقييم</span>
            </button>
          </div>

          <div className="space-y-4">
            {evaluations.map((ev, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 relative space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  {/* Criterion selection */}
                  <div className="w-full md:flex-1">
                    <label className="block text-slate-600 font-semibold mb-1 text-xs">معيار التقييم</label>
                    <select
                      value={ev.critere}
                      onChange={(e) => handleEvaluationChange(index, 'critere', e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:outline-none"
                    >
                      {PREDEFINED_CRITERIA.map((crit, idx) => (
                        <option key={idx} value={crit}>{crit}</option>
                      ))}
                      {!PREDEFINED_CRITERIA.includes(ev.critere) && (
                        <option value={ev.critere}>{ev.critere}</option>
                      )}
                    </select>
                  </div>

                  {/* Score (1-10) */}
                  <div className="w-full md:w-32">
                    <label className="block text-slate-600 font-semibold mb-1 text-xs">النقطة (1 - 10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={ev.note}
                      onChange={(e) => handleEvaluationChange(index, 'note', e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 font-bold focus:outline-none"
                      required
                    />
                  </div>

                  {/* Remove action */}
                  {evaluations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEvaluationRow(index)}
                      className="p-2.5 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-red-600 rounded-lg shrink-0 mt-5 md:mt-5 transition"
                      title="حذف هذا المعيار"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Comment row */}
                <div>
                  <label className="block text-slate-600 font-semibold mb-1 text-xs">تعليق وملاحظات المعيار</label>
                  <textarea
                    rows="2"
                    value={ev.commentaire}
                    onChange={(e) => handleEvaluationChange(index, 'commentaire', e.target.value)}
                    placeholder="اكتب ملاحظات توجيهية خاصة بهذا المعيار..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Remarks */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <label className="block text-slate-700 font-bold text-sm">ملاحظات وتوصيات عامة</label>
          <textarea
            rows="4"
            value={remarquesGenerales}
            onChange={(e) => setRemarquesGenerales(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition"
            placeholder="اكتب التوصيات البيداغوجية والتعليمية العامة للأستاذ..."
          />
        </div>

        {/* Actions bar */}
        <div className="flex items-center gap-4 justify-end">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl transition"
          >
            إلغاء الأمر
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition"
          >
            <Save size={18} />
            <span>حفظ عملية التفقد</span>
          </button>
        </div>
      </form>
    </div>
  );
}
