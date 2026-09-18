import React, { useState, useEffect } from 'react';
import { ArrowRight, Compass, HelpCircle, HardHat, Milestone, Calendar, Sparkles, Plus, RefreshCw, CheckCircle2 } from 'lucide-react';
import { apiService } from './apiService';

export default function GrowthRoadmap({ onNavigate }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    objectif: '',
    actions: '',
    ressources: '',
    echeance: '',
    indicateurSucces: '',
    statut: 'قيد التنفيذ'
  });

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPedagogyGrowthPlans();
      setGoals(data || []);
    } catch (err) {
      console.error('Failed to load growth roadmap plans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      await apiService.saveGrowthPlan(newGoal);
      setShowModal(false);
      setNewGoal({
        objectif: '',
        actions: '',
        ressources: '',
        echeance: '',
        indicateurSucces: '',
        statut: 'قيد التنفيذ'
      });
      await loadGoals();
    } catch (err) {
      console.error('Failed to create growth plan:', err);
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
            <h1 className="text-2xl font-extrabold text-slate-800">خطة النمو الشخصية والتأطير المستمر</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">خارطة طريق مهنية تحدد الأهداف التنموية للأستاذ لرفع جودة وكفاءة الممارسات الفصلية (مستقاة من السيرفر).</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-100"
        >
          <Plus size={15} />
          <span>إضافة هدف تنموي جديد</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-16 bg-white rounded-2xl border border-slate-100">
          <RefreshCw className="animate-spin text-blue-600 mr-2" size={20} />
          <span className="text-xs font-bold text-slate-500 mr-3">جاري تحميل أهداف خطة النمو...</span>
        </div>
      ) : goals.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-100 text-center text-xs font-bold text-slate-400">
          لا توجد أهداف تنموية مسجلة حتى الآن. انقر على "إضافة هدف تنموي جديد" لإدراج هدف.
        </div>
      ) : (
        /* ROADMAP CARDS */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {goals.map((goal, idx) => (
            <div
              key={goal.idPlan || idx}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                    <Sparkles size={18} />
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    goal.statut === 'مكتمل' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {goal.statut || 'قيد التنفيذ'}
                  </span>
                </div>

                <h3 className="text-xs font-extrabold text-slate-800 leading-relaxed border-b border-slate-100 pb-2">
                  {goal.objectif}
                </h3>

                {/* Card breakdown */}
                <div className="space-y-3 text-[11px] leading-relaxed">
                  <div>
                    <span className="text-slate-400 font-bold">الإجراءات المحددة (Action):</span>
                    <p className="text-slate-700 font-semibold mt-0.5">{goal.actions}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">الموارد المطلوبة (Resources):</span>
                    <p className="text-slate-700 font-semibold mt-0.5">{goal.ressources}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">تاريخ الإنجاز المستهدف:</span>
                    <p className="text-blue-600 font-bold flex items-center gap-1 mt-0.5">
                      <Calendar size={12} />
                      <span>{goal.echeance ? goal.echeance.toString() : 'غير محدد'}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-4 bg-slate-50 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 font-extrabold">مؤشر النجاح المقاس (KPI):</span>
                <p className="text-[10px] text-emerald-700 font-extrabold mt-1">
                  {goal.indicateurSucces || 'تحقيق تحسن ملحوظ في الأداء الصفي'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding a new growth goal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800">إضافة هدف تنموي جديد</h3>
            <form onSubmit={handleCreateGoal} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">عنوان الهدف التنموي:</label>
                <input
                  type="text"
                  required
                  value={newGoal.objectif}
                  onChange={e => setNewGoal({ ...newGoal, objectif: e.target.value })}
                  placeholder="مثال: تنويع طرائق التقييم التكويني"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">الإجراءات المحددة (Actions):</label>
                <input
                  type="text"
                  required
                  value={newGoal.actions}
                  onChange={e => setNewGoal({ ...newGoal, actions: e.target.value })}
                  placeholder="مثال: إعداد بنك أسئلة واعتماد بطاقة ملاحظة"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">الموارد المطلوبة (Resources):</label>
                <input
                  type="text"
                  value={newGoal.ressources}
                  onChange={e => setNewGoal({ ...newGoal, ressources: e.target.value })}
                  placeholder="مثال: نماذج تقييم معتمدة + ورشة عمل"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">مؤشر النجاح المقاس (KPI):</label>
                <input
                  type="text"
                  value={newGoal.indicateurSucces}
                  onChange={e => setNewGoal({ ...newGoal, indicateurSucces: e.target.value })}
                  placeholder="مثال: تحسن بنسبة 20% في تفاعل التلاميذ"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">تاريخ الاستحقاق (Deadline):</label>
                <input
                  type="date"
                  value={newGoal.echeance}
                  onChange={e => setNewGoal({ ...newGoal, echeance: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
                >
                  حفظ الهدف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
