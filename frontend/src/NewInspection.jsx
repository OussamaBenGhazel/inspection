import React, { useState } from 'react';
import {
  ArrowRight, FileText, Calendar, Clock, BookOpen, AlertCircle,
  ChevronLeft, ChevronRight, CheckCircle, Save, Paperclip, Award, FileSpreadsheet
} from 'lucide-react';

export default function FieldVisitRegistration({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Step 1: Visit Details
  const [visitType, setVisitType] = useState('تشخيصية');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [visitNumber, setVisitNumber] = useState('1');
  const [inspectorName, setInspectorName] = useState('أ. آمنة فرحات');
  const [overallRating, setOverallRating] = useState('3.2');
  const [uploadedFile, setUploadedFile] = useState(null);

  // Step 2: Notes & Evaluation
  const [lessonTopic, setLessonTopic] = useState('');
  const [strengths, setStrengths] = useState('');
  const [observations, setObservations] = useState('');

  // Step 3: Recommendations & Approval
  const [recommendations, setRecommendations] = useState('');
  const [hasAgreement, setHasAgreement] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSave = () => {
    alert('تم حفظ تسجيل الزيارة الميدانية كمسودة في النظام بنجاح!');
    onNavigate('dashboard');
  };

  const handleApprove = (e) => {
    e.preventDefault();
    if (!hasAgreement) {
      setError('يرجى تأكيد الالتزام وقبول شروط التوقيع والاعتماد البيداغوجي.');
      return;
    }
    alert('تم اعتماد وتثبيت الزيارة الميدانية بنجاح!');
    onNavigate('dashboard');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">
      {/* Header and Back */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition"
          >
            <ArrowRight size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">تسجيل زيارة ميدانية جديدة</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">نموذج تفاعلي لتوثيق وتوثيق كافة مجريات الحصة الميدانية بالتفصيل.</p>
          </div>
        </div>
      </div>

      {/* MULTI-STEP FORM HEADER */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4 text-xs font-bold text-center">
        <div className={`flex-1 py-3.5 rounded-xl border ${step === 1 ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
          <span>1. تفاصيل الزيارة الميدانية</span>
        </div>
        <div className={`flex-1 py-3.5 rounded-xl border ${step === 2 ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
          <span>2. الملاحظات والتقييم البيداغوجي</span>
        </div>
        <div className={`flex-1 py-3.5 rounded-xl border ${step === 3 ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
          <span>3. التوصيات والاعتماد والختم</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-r-4 border-red-500 text-red-700 rounded-xl flex items-center gap-3 text-xs font-bold">
          <AlertCircle className="shrink-0" size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: VISIT DETAILS */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">بيانات وجدولة الزيارة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
            <div>
              <label className="block text-slate-500 mb-2">نوع زيارة التفقد</label>
              <select
                value={visitType}
                onChange={(e) => setVisitType(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
              >
                <option value="تشخيصية">تشخيصية / أولية</option>
                <option value="تأطيرية">تأطيرية ومتابعة</option>
                <option value="تقييمية">تقييمية شاملة</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 mb-2">تاريخ الزيارة</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-2">رقم الزيارة في هذا الفصل</label>
              <input
                type="number"
                value={visitNumber}
                onChange={(e) => setVisitNumber(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-2">اسم المتفقد المتابع</label>
              <input
                type="text"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-2">التقييم الإجمالي المقترح (من 4 نقاط)</label>
              <input
                type="text"
                value={overallRating}
                onChange={(e) => setOverallRating(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-2">رفع صور الحصة أو المستندات المرجعية</label>
              <label className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 transition block relative">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      if (file.size > 5 * 1024 * 1024) {
                        alert('حجم الملف يتجاوز الحد الأقصى المسموح به وهو 5 ميغابايت.');
                        return;
                      }
                      setUploadedFile(file);
                    }
                  }}
                />
                <Paperclip className="mx-auto text-slate-400" size={18} />
                {uploadedFile ? (
                  <div className="mt-1">
                    <span className="text-[11px] text-emerald-600 font-bold block">تم اختيار: {uploadedFile.name}</span>
                    <span className="text-[9px] text-slate-400 font-bold">الحجم: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-500 font-bold block mt-1">اضغط هنا لاختيار صورة أو ملف PDF (الأقصى 5MB)</span>
                )}
              </label>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: OBSERVATIONS & EVALUATION */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">الملاحظات والتقييم البيداغوجي</h3>

          <div className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-500 mb-2">موضوع الدرس المشاهد</label>
              <input
                type="text"
                placeholder="أدخل عنوان الدرس البيداغوجي..."
                value={lessonTopic}
                onChange={(e) => setLessonTopic(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-2">نقاط القوة المرصودة</label>
              <textarea
                rows="3"
                placeholder="ما هي الجوانب المتميزة في أداء الأستاذ خلال هذه الحصة؟"
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-2">ملاحظات وفرص التطوير العام</label>
              <textarea
                rows="4"
                placeholder="تفاصيل مجريات الحصة والفرص المتاحة لرفع جودة التحصيل البيداغوجي..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: RECOMMENDATIONS & FINAL APPROVAL */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">التوصيات والاعتماد والختم</h3>

          <div className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-500 mb-2">التوصيات الإجرائية المحددة والواجبة الاتباع</label>
              <textarea
                rows="4"
                placeholder="مثال: الاستعانة بخرائط مفاهيمية، تفعيل المجموعات التفاعلية المصغرة..."
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
              />
            </div>

            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-3">
              <h4 className="font-bold text-blue-800">إقرار وتوقيع المتفقد المتابع</h4>
              <p className="text-[11px] text-slate-500">من خلال تأكيد هذا النموذج الميداني، تقر بأن البيانات الواردة تعبر بدقة عن أداء وملاحظات الزيارة الميدانية وسيتم إضافتها مباشرة لملف الأستاذ.</p>

              <label className="flex items-center gap-2.5 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={hasAgreement}
                  onChange={(e) => setHasAgreement(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-slate-700 font-bold">أوافق على بنود تقييم الزيارة وأطلب اعتمادها بصفة رسمية.</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ACTION CONTROLS */}
      <div className="flex items-center justify-between">
        <div>
          {step > 1 && (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              <ChevronRight size={16} />
              <span>السابق</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs transition"
          >
            <Save size={16} />
            <span>حفظ كمسودة</span>
          </button>

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-100"
            >
              <span>التالي</span>
              <ChevronLeft size={16} />
            </button>
          ) : (
            <button
              onClick={handleApprove}
              className="flex items-center gap-1.5 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-emerald-100"
            >
              <CheckCircle size={16} />
              <span>اعتماد وتثبيت الزيارة الميدانية</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
