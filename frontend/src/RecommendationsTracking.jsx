import React from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Clock, Search, Filter } from 'lucide-react';

export default function RecommendationsTracking({ onNavigate }) {
  // Recommendations List Grid (Screen 07)
  const recommendationsList = [
    {
      title: "تفعيل تكنولوجيا الذكاء الاصطناعي والموارد الرقمية",
      desc: "استخدام منصات تفاعلية مثل Kahoot أو Google Classroom لتنشيط المتعلمين.",
      status: "not_completed",
      progress: 20,
      evidence: "لم يتم تطبيقها نظراً لضعف شبكة الإنترنت بالمؤسسة."
    },
    {
      title: "توظيف بطاقات التقييم السريع (Exit Tickets)",
      desc: "تخصيص الخمس دقائق الأخيرة من الحصة للتحقق السريع من استيعاب المفاهيم.",
      status: "fully_completed",
      progress: 100,
      evidence: "تم توظيفها بانتظام، وأبدى التلاميذ استجابة ممتازة."
    },
    {
      title: "بناء خطة علاجية مخصصة للطلاب المتعثرين",
      desc: "تصميم أنشطة داعمة تناسب الفروقات الفردية وتذليل الصعوبات المنهجية.",
      status: "partially_completed",
      progress: 60,
      evidence: "تم صياغة الأوراق الداعمة، بانتظار تطبيق الحصص التعويضية."
    }
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition"
        >
          <ArrowRight size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">سجل تتبع التوصيات البيداغوجية</h1>
          <p className="text-xs text-slate-400 font-bold mt-1">رصد ومتابعة دقيقة لمدى التزام وتطبيق الأساتذة بالتوصيات المقترحة في الزيارات السابقة.</p>
        </div>
      </div>

      {/* RECOMMENDATION CARDS GRID (Screen 07) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {recommendationsList.map((rec, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition">

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                  rec.status === 'fully_completed' ? 'bg-green-50 text-green-700' :
                  rec.status === 'partially_completed' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-red-50 text-red-700 animate-pulse'
                }`}>
                  {rec.status === 'fully_completed' ? 'منجزة بالكامل ✨' :
                   rec.status === 'partially_completed' ? 'منجزة جزئياً ⏳' : 'غير منجزة ❌'}
                </span>

                <span className="text-[10px] text-slate-400 font-bold">توصية رقم {idx+1}</span>
              </div>

              <h3 className="text-xs font-extrabold text-slate-800 leading-relaxed">{rec.title}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">{rec.desc}</p>
            </div>

            {/* Progress Bar & Evidence (Screen 07) */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-slate-400">نسبة التقدم والتطبيق:</span>
                <span className="text-blue-600">{rec.progress}%</span>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    rec.status === 'fully_completed' ? 'bg-green-500' :
                    rec.status === 'partially_completed' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${rec.progress}%` }}
                />
              </div>

              {/* Details & Evidence */}
              <div className="pt-2">
                <p className="text-[10px] text-slate-400 font-bold">القرائن وشواهد التطبيق (Evidence):</p>
                <p className="text-[10px] text-slate-600 mt-1 italic font-medium">{rec.evidence}</p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
