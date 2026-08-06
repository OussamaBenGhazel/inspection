import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Award, Target, Settings } from 'lucide-react';

export default function ProfessionalGrowthIndicators({ onNavigate }) {
  // 10 qualitative growth indicators (Screen 08)
  const [indicators, setIndicators] = useState([
    { id: 1, text: "تطبيق التغذية الراجعة من الزيارات السابقة بفاعلية وعمق بيداغوجي", val: "نعم" },
    { id: 2, text: "ممارسة التأمل والتفكير النقدي الذاتي لتطوير الممارسات التدريسية", val: "جزئيا" },
    { id: 3, text: "توظيف أدوات التكنولوجيا والذكاء الاصطناعي بشكل ذكي ومستقر", val: "لا" },
    { id: 4, text: "المشاركة الإيجابية والمستمرة في ورشات وجلسات التطوير مع الزملاء", val: "نعم" },
    { id: 5, text: "تنويع أساليب التقويم الصفي ودعم الفروقات الفردية المتعثرة", val: "جزئيا" },
    { id: 6, text: "المشاركة في المبادرات والبحوث الإجرائية الميدانية بالمؤسسة", val: "نعم" },
    { id: 7, text: "الالتزام بأخلاقيات المهنة والقيم التربوية التوجيهية للوزارة", val: "نعم" },
    { id: 8, text: "إنتاج ومشاركة موارد ومحتويات تعليمية رقمية مع زملائه بالجهة", val: "لا" },
    { id: 9, text: "القدرة الفائقة على احتواء المشكلات وحل النزاعات الصفية بمرونة", val: "نعم" },
    { id: 10, text: "متابعة أثر التعلمات والتحصيل المعرفي للتلاميذ ومقارنته بالفصول الماضية", val: "جزئيا" }
  ]);

  const handleSelection = (id, choice) => {
    setIndicators(indicators.map(ind => ind.id === id ? { ...ind, val: choice } : ind));
  };

  const handleSave = () => {
    alert('تم حفظ مؤشرات النمو المهني بنجاح!');
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
            <h1 className="text-2xl font-extrabold text-slate-800">مؤشرات النمو المهني البيداغوجي</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">مصفوفة تقييم نوعية لرصد التزام وتفاعل الأستاذ مع معايير التطوير الأكاديمي.</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-100"
        >
          <CheckCircle size={15} />
          <span>حفظ التغييرات</span>
        </button>
      </div>

      {/* QUALITATIVE MATRIX LIST (Screen 08) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold border-b border-slate-100">
                <th className="p-4 w-12 text-center">الرقم</th>
                <th className="p-4">مؤشر النمو البيداغوجي النوعي</th>
                <th className="p-4 text-center w-64">خيارات التقييم والمطابقة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {indicators.map((ind, index) => (
                <tr key={ind.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4 text-center font-bold text-slate-400">{index + 1}</td>
                  <td className="p-4 font-bold text-slate-800">{ind.text}</td>
                  <td className="p-4 text-center">
                    {/* SCANNABLE RADIO OPTIONS YES/PARTIALLY/NO */}
                    <div className="flex items-center justify-center gap-6">
                      <label className="flex items-center gap-1.5 cursor-pointer font-extrabold">
                        <input
                          type="radio"
                          name={`ind-${ind.id}`}
                          checked={ind.val === 'نعم'}
                          onChange={() => handleSelection(ind.id, 'نعم')}
                          className="text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                        />
                        <span className="text-emerald-700">نعم</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer font-extrabold">
                        <input
                          type="radio"
                          name={`ind-${ind.id}`}
                          checked={ind.val === 'جزئيا'}
                          onChange={() => handleSelection(ind.id, 'جزئيا')}
                          className="text-amber-600 focus:ring-amber-500 h-4 w-4"
                        />
                        <span className="text-amber-700">جزئياً</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer font-extrabold">
                        <input
                          type="radio"
                          name={`ind-${ind.id}`}
                          checked={ind.val === 'لا'}
                          onChange={() => handleSelection(ind.id, 'لا')}
                          className="text-red-600 focus:ring-red-500 h-4 w-4"
                        />
                        <span className="text-red-700">لا</span>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
