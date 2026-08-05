import React, { useEffect, useState } from 'react';
import { apiService } from './apiService';
import { PlusCircle, FileText, Calendar, Clock, ArrowLeft, ArrowRight, UserCheck, ShieldAlert, FileMinus } from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    today: 0,
    open: 0,
    closed: 0,
    teachersCount: 0
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [inspections, teachers] = await Promise.all([
          apiService.getInspections(),
          apiService.getEnseignants()
        ]);

        const todayStr = new Date().toISOString().split('T')[0];
        const todayCount = inspections.filter(i => i.dateVisite === todayStr).length;
        const openCount = inspections.filter(i => i.statut === 'ouverte' || i.statut === 'en_cours').length;
        const closedCount = inspections.filter(i => i.statut === 'cloturee').length;

        setStats({
          today: todayCount,
          open: openCount,
          closed: closedCount,
          teachersCount: teachers.length
        });

        // Get recent 5
        const sorted = [...inspections].sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
        setRecent(sorted.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* Top Welcome / Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">مرحباً بك في لوحة التحكم العامة</h1>
          <p className="text-slate-500 mt-1">متابعة دقيقة وفورية لعمليات التفقد والزيارات الميدانية للأساتذة.</p>
        </div>
        <button
          onClick={() => onNavigate('new-inspection')}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition duration-150 shrink-0"
        >
          <PlusCircle size={20} />
          <span>تفقد جديد (سريع)</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-semibold">تفقد اليوم</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{stats.today}</h3>
          </div>
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
            <Calendar size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-semibold">عمليات التفقد المفتوحة</p>
            <h3 className="text-3xl font-extrabold text-yellow-600 mt-2">{stats.open}</h3>
          </div>
          <div className="p-4 bg-yellow-50 text-yellow-600 rounded-2xl">
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-semibold">عمليات التفقد المغلقة</p>
            <h3 className="text-3xl font-extrabold text-green-600 mt-2">{stats.closed}</h3>
          </div>
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-semibold">عدد الأساتذة المسجلين</p>
            <h3 className="text-3xl font-extrabold text-blue-600 mt-2">{stats.teachersCount}</h3>
          </div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <FileText size={24} />
          </div>
        </div>
      </div>

      {/* Last 5 Inspections List Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">آخر عمليات التفقد المضافة</h2>
          <button
            onClick={() => onNavigate('inspections-list')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
          >
            <span>عرض الكل</span>
            <ArrowLeft size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm font-semibold">
                <th className="p-4">التاريخ</th>
                <th className="p-4">الأستاذ</th>
                <th className="p-4">المادة</th>
                <th className="p-4">الوقت</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recent.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-medium">لا توجد عمليات تفقد حالياً.</td>
                </tr>
              ) : (
                recent.map((insp) => (
                  <tr key={insp.idInspection} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-semibold">{insp.dateVisite}</td>
                    <td className="p-4">{insp.enseignant?.prenom} {insp.enseignant?.nom}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                        {insp.enseignant?.matiere}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{insp.heureDebut} - {insp.heureFin}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                        insp.statut === 'ouverte' ? 'bg-yellow-100 text-yellow-800' :
                        insp.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        <span className={`h-2 w-2 rounded-full ${
                          insp.statut === 'ouverte' ? 'bg-yellow-500' :
                          insp.statut === 'en_cours' ? 'bg-blue-500' :
                          'bg-green-500'
                        }`} />
                        {insp.statut === 'ouverte' ? 'مفتوحة' :
                         insp.statut === 'en_cours' ? 'قيد المعالجة' : 'مغلقة'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => onNavigate('inspection-details', insp.idInspection)}
                        className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-800 font-semibold rounded-xl text-xs transition"
                      >
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
