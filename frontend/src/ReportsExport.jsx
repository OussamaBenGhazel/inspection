import React, { useState, useEffect } from 'react';
import { ArrowRight, FileText, Download, Award, ShieldCheck, Star, RefreshCw } from 'lucide-react';
import { apiService } from './apiService';

export default function ReportsExport({ onNavigate }) {
  const [inspections, setInspections] = useState([]);
  const [selectedInspectionId, setSelectedInspectionId] = useState('');
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInspections() {
      try {
        const data = await apiService.getInspections();
        setInspections(data);
        if (data.length > 0) {
          setSelectedInspectionId(data[0].idInspection);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchInspections();
  }, []);

  useEffect(() => {
    if (selectedInspectionId) {
      const found = inspections.find(i => i.idInspection === Number(selectedInspectionId));
      setSelectedInspection(found);
    } else {
      setSelectedInspection(null);
    }
  }, [selectedInspectionId, inspections]);

  const handlePdfDownload = () => {
    if (!selectedInspectionId) {
      alert('يرجى تحديد زيارة ميدانية أولاً لتوليد التقرير.');
      return;
    }
    // Directly navigate or trigger download of the real dynamic PDF report from the backend!
    window.open(`/api/inspections/${selectedInspectionId}/report`, '_blank');
  };

  const handleExport = (format) => {
    if (format === 'pdf') {
      handlePdfDownload();
    } else if (format === 'excel') {
      if (!selectedInspectionId) {
        alert('يرجى تحديد زيارة ميدانية أولاً لتوليد التقرير.');
        return;
      }
      window.open(`/api/inspections/${selectedInspectionId}/excel`, '_blank');
    } else {
      alert(`جاري تصدير التقرير البيداغوجي الموحد بصيغة ${format.toUpperCase()} (محاكاة)...`);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition"
          >
            <ArrowRight size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">مركز التقارير وتصدير البيانات</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">توليد وتصدير تقارير الأداء الميداني الفردية والجماعية وصياغتها بصيغ رقمية مختلفة.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-100">
          <RefreshCw className="animate-spin text-blue-600 mr-2" />
          <span className="text-xs font-bold text-slate-500">جاري تحميل الزيارات الميدانية المتوفرة...</span>
        </div>
      ) : (
        <>
          {/* EXPORT BAR */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="space-y-1 w-full md:w-auto">
              <label className="text-xs font-bold text-slate-700 block">اختر الزيارة الميدانية لتوليد تقريرها:</label>
              {inspections.length === 0 ? (
                <span className="text-xs font-bold text-red-500">لا توجد زيارات ميدانية مسجلة حتى الآن.</span>
              ) : (
                <select
                  value={selectedInspectionId}
                  onChange={(e) => setSelectedInspectionId(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none w-full md:w-80"
                >
                  {inspections.map((ins) => (
                    <option key={ins.idInspection} value={ins.idInspection}>
                      زيارة للأستاذ: {ins.enseignant?.prenom} {ins.enseignant?.nom} ({ins.dateVisite})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={() => handleExport('pdf')}
                disabled={!selectedInspectionId}
                className={`flex items-center gap-1.5 px-4.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition ${
                  !selectedInspectionId ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Download size={14} />
                <span>توليد وتنزيل تقرير PDF المعتمد 📕</span>
              </button>
              <button
                onClick={() => handleExport('excel')}
                disabled={!selectedInspectionId}
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl text-xs font-bold transition"
              >
                <Download size={14} />
                <span>تصدير Excel 📗</span>
              </button>
            </div>
          </div>

          {/* REPORT PREVIEW & STATS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs font-bold leading-relaxed">
            {/* Statistics block */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-xs text-slate-800 border-b border-slate-100 pb-2">مؤشرات إحصائية للتقرير المحدد</h3>
              <div className="space-y-4 font-semibold">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 text-[10px] font-bold block">الأستاذ المتابع</span>
                  <span className="text-xs font-extrabold text-blue-800 mt-1 block">
                    {selectedInspection ? `${selectedInspection.enseignant?.prenom} ${selectedInspection.enseignant?.nom}` : '---'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 text-[10px] font-bold block">المتفقد المشرف</span>
                  <span className="text-xs font-extrabold text-slate-800 mt-1 block">
                    {selectedInspection ? `${selectedInspection.inspecteur?.prenom} ${selectedInspection.inspecteur?.nom}` : '---'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 text-[10px] font-bold block">حالة الزيارة</span>
                  <span className="text-xs font-extrabold text-emerald-600 mt-1 block">
                    {selectedInspection ? selectedInspection.statut : '---'}
                  </span>
                </div>
              </div>
            </div>

            {/* Preview pane */}
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-xs text-slate-800 border-b border-slate-100 pb-2">معاينة تفاصيل الزيارة (Preview)</h3>
              <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/50 space-y-4 h-64 overflow-y-auto font-medium text-[11px] leading-relaxed">
                <div className="text-center font-extrabold text-xs text-slate-800">جمهورية تونس • وزارة التربية</div>
                <div className="text-center font-bold text-slate-500">تفاصيل زيارة التفقد المعتمدة</div>
                <div className="border-b border-slate-200 pb-2" />
                {selectedInspection ? (
                  <div className="space-y-2 text-slate-700">
                    <p>• <span className="font-bold">تاريخ الزيارة:</span> {selectedInspection.dateVisite}</p>
                    <p>• <span className="font-bold">الموضوع / الحصة:</span> {selectedInspection.heureDebut} إلى {selectedInspection.heureFin}</p>
                    <p>• <span className="font-bold">الملاحظات العامة المدونة:</span></p>
                    <p className="bg-white p-3 rounded-lg border border-slate-100 italic text-slate-500 mt-1">
                      {selectedInspection.remarquesGenerales || 'لا توجد ملاحظات عامة مسجلة بعد لهذه الزيارة.'}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 font-bold py-12">الرجاء اختيار زيارة لعرض المعاينة والملخص.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
