import React, { useEffect, useState } from 'react';
import { apiService } from './apiService';
import { Search, Filter, Calendar, Clock, PlusCircle, Trash2 } from 'lucide-react';

export default function InspectionsList({ onNavigate }) {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    async function load() {
      try {
        const data = await apiService.getInspections();
        setInspections(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من حذف عملية التفقد هذه؟')) {
      try {
        await apiService.deleteInspection(id);
        setInspections(inspections.filter(i => i.idInspection !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredInspections = inspections.filter(insp => {
    const fullName = `${insp.enseignant?.prenom || ''} ${insp.enseignant?.nom || ''}`.toLowerCase();
    const matiere = (insp.enseignant?.matiere || '').toLowerCase();
    const date = (insp.dateVisite || '');
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                          matiere.includes(searchTerm.toLowerCase()) ||
                          date.includes(searchTerm);

    const matchesStatus = statusFilter === 'ALL' || insp.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">قائمة عمليات التفقد</h1>
          <p className="text-slate-500 mt-1">عرض وتصفية وبحث شامل في جميع السجلات والزيارات.</p>
        </div>
        <button
          onClick={() => onNavigate('new-inspection')}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition shrink-0"
        >
          <PlusCircle size={20} />
          <span>إضافة تفقد جديد</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 pointer-events-none">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-11 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition"
            placeholder="البحث باسم الأستاذ، المادة، أو تاريخ الزيارة..."
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <span className="text-slate-500 text-sm font-semibold whitespace-nowrap flex items-center gap-1.5">
            <Filter size={16} />
            <span>الحالة:</span>
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 transition font-medium"
          >
            <option value="ALL">الكل</option>
            <option value="ouverte">مفتوحة 🟡</option>
            <option value="en_cours">قيد المعالجة 🔵</option>
            <option value="cloturee">مغلقة 🟢</option>
          </select>
        </div>
      </div>

      {/* Main Table view */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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
              {filteredInspections.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400 font-medium">لم يتم العثور على أي عمليات تفقد مطابقة للبحث.</td>
                </tr>
              ) : (
                filteredInspections.map((insp) => (
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
                    <td className="p-4 flex items-center gap-2">
                      <button
                        onClick={() => onNavigate('inspection-details', insp.idInspection)}
                        className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-800 font-semibold rounded-xl text-xs transition"
                      >
                        عرض التفاصيل
                      </button>
                      {insp.statut !== 'cloturee' && (
                        <button
                          onClick={(e) => handleDelete(insp.idInspection, e)}
                          className="p-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded-xl transition"
                          title="حذف التفقد"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
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
