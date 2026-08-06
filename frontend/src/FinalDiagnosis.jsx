import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, FileText, LayoutList } from 'lucide-react';

export default function FinalDiagnosis({ onNavigate }) {
  // Support Type Selectors state
  const [supportTypes, setSupportTypes] = useState({
    training: true,
    fieldSupport: true,
    experienceSharing: false,
    actionResearch: false
  });

  const handleCheckboxChange = (key) => {
    setSupportTypes({ ...supportTypes, [key]: !supportTypes[key] });
  };

  const handleSave = () => {
    alert('تم حفظ واعتماد التشخيص الختامي بنجاح في النظام!');
    onNavigate('dashboard');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">
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
            <h1 className="text-2xl font-extrabold text-slate-800">التشخيص الختامي والتقييم النهائي</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">صياغة بيداغوجية سردية مفصلة تحدد خلاصة الأداء والتوصيات الإستراتيجية للأستاذ.</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-100"
        >
          <CheckCircle2 size={16} />
          <span>اعتماد التشخيص الختامي</span>
        </button>
      </div>

      {/* SUMMARY CARDS LAYOUT (Screen 11) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">

        {/* Block 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <label className="block text-slate-500 font-bold">جوانب النمو والتطور المهني المحققة</label>
          <textarea
            rows="3"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed focus:outline-none"
            defaultValue="سجل المعلم تقدماً ممتازاً في توظيف التعلم التعاوني وتنسيق الأنشطة الجماعية، مع التزام تام بالتحضير البيداغوجي المسبق وتكامل عناصر الدرس."
          />
        </div>

        {/* Block 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <label className="block text-slate-500 font-bold">المجالات والتحديات التي تتطلب دعماً مستمراً</label>
          <textarea
            rows="3"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed focus:outline-none"
            defaultValue="يحتاج المعلم لتنويع أساليب التقويم الصفي وصياغة وضعيات علاجية خاصة بالفروقات الفردية وتنشيط الوسائط التكنولوجية."
          />
        </div>

        {/* Block 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <label className="block text-slate-500 font-bold">أثر التغذية الراجعة والتوجيهات السابقة</label>
          <textarea
            rows="3"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed focus:outline-none"
            defaultValue="استجابة الأستاذ سريعة وواضحة جداً، حيث انعكست النصائح السابقة مباشرة على جودة الإلقاء وتنظيم زمن التدريس في الفصل."
          />
        </div>

        {/* Block 4 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <label className="block text-slate-500 font-bold">الأولويات التنموية للمرحلة القادمة</label>
          <textarea
            rows="3"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed focus:outline-none"
            defaultValue="1. التدرب على بناء المحتوى الرقمي.\n2. استخدام أدوات التقييم الذاتي والتأمل المهني بانتظام."
          />
        </div>

      </div>

      {/* SUPPORT TYPE SELECTORS (Screen 11) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-xs font-extrabold text-slate-800 border-b border-slate-100 pb-2">نوع التدخل التأطيري والمتابعة المقترحة (Support Type)</h3>

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
    </div>
  );
}
