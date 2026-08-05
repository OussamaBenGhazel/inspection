import React, { useEffect, useState } from 'react';
import { apiService } from './apiService';
import { useAuth } from './AuthContext';
import SignatureCanvas from './SignatureCanvas';
import { ArrowRight, Lock, Unlock, FileText, CheckCircle, Upload, Download, Edit3, Trash2, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InspectionDetails({ idInspection, onNavigate }) {
  const { user } = useAuth();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  // editable fields
  const [remarquesGenerales, setRemarquesGenerales] = useState('');
  const [signature, setSignature] = useState(null);

  // loading trigger
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiService.getInspectionDetails(idInspection);
        setInspection(data);
        setRemarquesGenerales(data.remarquesGenerales || '');
        setSignature(data.signatureInspecteur || null);
      } catch (err) {
        console.error(err);
        setError('تعذر تحميل تفاصيل عملية التفقد');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [idInspection, trigger]);

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الملف يتجاوز الحد الأقصى المسموح به (5 ميجابايت)');
      return;
    }

    setUploading(true);
    try {
      await apiService.uploadPieceJointe(idInspection, file);
      setTrigger(prev => prev + 1);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      alert(err.message || 'فشل تحميل الملف المرفق');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (newStatut) => {
    try {
      const dto = {
        remarquesGenerales,
        signatureInspecteur: signature,
        statut: newStatut || inspection.statut
      };

      await apiService.updateInspection(idInspection, dto);
      setTrigger(prev => prev + 1);

      if (newStatut === 'cloturee') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else {
        alert('تم حفظ التعديلات بنجاح');
      }
    } catch (err) {
      alert(err.message || 'فشلت عملية التعديل');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !inspection) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-2xl flex items-center gap-3">
        <ShieldAlert size={24} />
        <span className="font-semibold">{error || 'لم يتم العثور على تفتيش.'}</span>
      </div>
    );
  }

  const isClosed = inspection.statut === 'cloturee';
  const isOpen = inspection.statut === 'ouverte';

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">
      {/* Header with back navigation and print action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition"
          >
            <ArrowRight size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">تفاصيل ومتابعة التفتيش</h1>
            <p className="text-slate-500 text-sm mt-1">حالة التفتيش:
              <span className={`mr-1.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                isClosed ? 'bg-green-100 text-green-800' :
                isOpen ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {isClosed ? 'مغلقة (قراءة فقط)' : isOpen ? 'مفتوحة (تعديل كامل)' : 'قيد المعالجة (تعديل محدود)'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/api/inspections/${idInspection}/report`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition"
          >
            <FileText size={18} />
            <span>تصدير تقرير PDF</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Details vs Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: General Info & Evaluation Criteria (Takes 2/3 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Metadata */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 pb-3 border-b border-slate-100">المعلومات العامة</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">الأستاذ المعني:</p>
                <p className="font-bold text-slate-800 mt-1">{inspection.enseignant?.prenom} {inspection.enseignant?.nom}</p>
              </div>
              <div>
                <p className="text-slate-400">المادة المدرسية:</p>
                <p className="font-bold text-slate-800 mt-1">{inspection.enseignant?.matiere}</p>
              </div>
              <div>
                <p className="text-slate-400">تاريخ التفقد:</p>
                <p className="font-bold text-slate-800 mt-1">{inspection.dateVisite}</p>
              </div>
              <div>
                <p className="text-slate-400">توقيت الزيارة:</p>
                <p className="font-bold text-slate-800 mt-1">{inspection.heureDebut} - {inspection.heureFin}</p>
              </div>
              <div>
                <p className="text-slate-400">المتفقد المتابع:</p>
                <p className="font-bold text-slate-800 mt-1">{inspection.inspecteur?.prenom} {inspection.inspecteur?.nom}</p>
              </div>
              <div>
                <p className="text-slate-400">تاريخ الإنشاء في النظام:</p>
                <p className="font-bold text-slate-800 mt-1">{new Date(inspection.dateCreation).toLocaleDateString('ar-TN')}</p>
              </div>
            </div>
          </div>

          {/* Detailed Criteria Scores */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 pb-3 border-b border-slate-100">نتائج معايير التقييم البيداغوجي</h2>
            <div className="space-y-4">
              {inspection.evaluations?.length === 0 ? (
                <p className="text-slate-400 text-sm text-center">لم يتم إدخال معايير تقييم لهذه الزيارة.</p>
              ) : (
                inspection.evaluations?.map((ev) => (
                  <div key={ev.idEvaluation} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800">{ev.critere}</p>
                      <p className="text-xs text-slate-500">{ev.commentaire || 'لا توجد تعليقات إضافية.'}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1 bg-white px-3.5 py-1.5 border border-slate-200 rounded-lg h-fit">
                      <span className="text-lg font-extrabold text-blue-600">{ev.note}</span>
                      <span className="text-slate-400 text-xs">/ 10</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Comments and General Remarks Editor */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 pb-3 border-b border-slate-100">الملاحظات والتوصيات العامة</h2>
            {isClosed ? (
              <p className="p-4 bg-slate-50 text-slate-700 rounded-xl whitespace-pre-wrap">{remarquesGenerales || 'لا توجد ملاحظات عامة مسجلة.'}</p>
            ) : (
              <div className="space-y-3">
                <textarea
                  rows="4"
                  value={remarquesGenerales}
                  onChange={(e) => setRemarquesGenerales(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition"
                  placeholder="أدخل التوصيات الإرشادية العامة..."
                />
                <button
                  type="button"
                  onClick={() => handleUpdate(null)}
                  className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl text-xs transition"
                >
                  حفظ التوصيات والملاحظات
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Attachments and Signatures (Takes 1/3 cols) */}
        <div className="space-y-6">
          {/* Status Controls */}
          {!isClosed && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-800 pb-2 border-b border-slate-100">التحكم في الحالة</h2>
              <div className="grid grid-cols-1 gap-3">
                {isOpen && (
                  <button
                    onClick={() => handleUpdate('en_cours')}
                    className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl text-sm transition"
                  >
                    بدء المعالجة (تحويل إلى قيد المعالجة)
                  </button>
                )}

                {signature ? (
                  <button
                    onClick={() => handleUpdate('cloturee')}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-green-100"
                  >
                    إغلاق التفقد نهائياً 🔒
                  </button>
                ) : (
                  <div className="p-3 bg-yellow-50 border border-yellow-100 text-yellow-800 text-xs rounded-xl text-center font-semibold">
                    يجب توفير توقيع المتفقد أولاً لتتمكن من إغلاق هذا السجل.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Signature Block */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            {isClosed ? (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-slate-800 pb-2 border-b border-slate-100">التوقيع المعتمد</h2>
                {signature ? (
                  <img src={signature} alt="Signature" className="max-h-24 mx-auto object-contain" />
                ) : (
                  <p className="text-slate-400 text-xs text-center italic">لم يتم إدراج توقيع.</p>
                )}
              </div>
            ) : (
              <SignatureCanvas
                onSave={(dataUrl) => setSignature(dataUrl)}
                currentSignature={signature}
              />
            )}
          </div>

          {/* Attachments Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 pb-3 border-b border-slate-100">الملفات المرفقة (Pièces jointes)</h2>

            {/* File upload input */}
            {!isClosed && (
              <div className="relative">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/20 py-4 px-2 rounded-xl cursor-pointer transition">
                  <Upload size={20} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-600 mt-1">رفع مستند أو صورة (أقصى حد 5MB)</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleUploadFile}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {uploading && <div className="text-center text-xs text-blue-600 font-semibold mt-1">جاري تحميل الملف...</div>}
              </div>
            )}

            {/* List of files */}
            <div className="space-y-2">
              {inspection.pieces?.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-2">لا توجد ملفات مرفقة حالياً.</p>
              ) : (
                inspection.pieces?.map((piece) => (
                  <div key={piece.idPiece} className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/50 transition">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="p-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-500 shrink-0">{piece.typeFichier}</span>
                      <span className="text-xs text-slate-700 truncate font-medium" title={piece.nomFichier}>{piece.nomFichier}</span>
                    </div>
                    <a
                      href={`/api/inspections/pieces/download/${piece.cheminFichier}`}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                      title="تحميل الملف"
                    >
                      <Download size={15} />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
