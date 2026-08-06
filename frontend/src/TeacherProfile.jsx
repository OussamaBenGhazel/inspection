import React, { useState } from 'react';
import {
  ArrowRight, School, Calendar, User, ShieldCheck, Star,
  Sparkles, Clipboard, BookOpen, Layers, Award, Milestone,
  MapPin, CheckCircle, TrendingUp, AlertTriangle, FileText
} from 'lucide-react';

export default function TeacherProfile({ teacher, onNavigate }) {
  const [activeTab, setActiveTab] = useState('basic');

  if (!teacher) {
    return (
      <div className="p-6 bg-yellow-50 text-yellow-800 rounded-2xl flex items-center gap-3" dir="rtl">
        <AlertTriangle size={20} />
        <span className="font-bold">يرجى اختيار أستاذ من القائمة لعرض ملفه الشخصي الشامل.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Back to list */}
      <button
        onClick={() => onNavigate('teachers-list')}
        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-bold transition"
      >
        <ArrowRight size={14} />
        <span>العودة لقائمة الأساتذة</span>
      </button>

      {/* PROFILE HEADER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-blue-100 border-2 border-blue-200 rounded-full flex items-center justify-center font-extrabold text-2xl text-blue-600 shadow-inner">
            {teacher.name ? teacher.name[0] : 'أ'}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-800">{teacher.name}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-bold">
              <span className="flex items-center gap-1">
                <School size={12} />
                <span>{teacher.school || 'المدرسة الإعدادية المعتمدة'} ({teacher.region || 'الجمهورية التونسية'})</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award size={12} />
                <span>الرتبة: {teacher.rank || 'أستاذ بيداغوجي أول'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                <span>الأقدمية: 12 عاماً في التدريس</span>
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Inspector Badge */}
        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-right shrink-0">
          <p className="text-[10px] text-slate-400 font-bold">المتفقد المتابع المعتمد</p>
          <p className="text-xs font-extrabold text-blue-800 mt-1 flex items-center gap-1">
            <ShieldCheck size={14} />
            <span>أ. آمنة فرحات</span>
          </p>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-5 py-3 font-bold text-xs transition border-b-2 whitespace-nowrap ${
            activeTab === 'basic' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          المعلومات الأساسية والمهنية
        </button>

        <button
          onClick={() => onNavigate('competencies-board')}
          className="px-5 py-3 font-bold text-xs transition border-b-2 border-transparent text-slate-500 hover:text-slate-800 whitespace-nowrap"
        >
          لوحة الكفايات الثمانية
        </button>

        <button
          onClick={() => onNavigate('recommendations-tracking')}
          className="px-5 py-3 font-bold text-xs transition border-b-2 border-transparent text-slate-500 hover:text-slate-800 whitespace-nowrap"
        >
          التوصيات والمتابعة الميدانية
        </button>

        <button
          onClick={() => onNavigate('growth-roadmap')}
          className="px-5 py-3 font-bold text-xs transition border-b-2 border-transparent text-slate-500 hover:text-slate-800 whitespace-nowrap"
        >
          خطة النمو الشخصية
        </button>

        <button
          onClick={() => onNavigate('reports-export')}
          className="px-5 py-3 font-bold text-xs transition border-b-2 border-transparent text-slate-500 hover:text-slate-800 whitespace-nowrap"
        >
          التقارير والتصدير
        </button>
      </div>

      {/* TAB CONTENT: BASIC INFO CARDS & TIMELINE */}
      {activeTab === 'basic' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Professional profile summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">بطاقة المعطيات المهنية والتأطير</h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <span className="text-slate-400">الاسم واللقب بالكامل:</span>
                  <p className="text-slate-800 mt-1">{teacher.name}</p>
                </div>
                <div>
                  <span className="text-slate-400">الرقم الوطني للمعرف:</span>
                  <p className="text-slate-800 mt-1">TUN-098715A</p>
                </div>
                <div>
                  <span className="text-slate-400">المؤسسة التربوية:</span>
                  <p className="text-slate-800 mt-1">{teacher.school || 'المدرسة الإعدادية بالرياض'}</p>
                </div>
                <div>
                  <span className="text-slate-400">المندوبية الجهوية للتربية:</span>
                  <p className="text-slate-800 mt-1">{teacher.region || 'تونس 1'}</p>
                </div>
                <div>
                  <span className="text-slate-400">البريد الإلكتروني للوزارة:</span>
                  <p className="text-slate-800 mt-1">{teacher.email || 'teacher.email@education.gov.tn'}</p>
                </div>
                <div>
                  <span className="text-slate-400">رقم هاتف الأستاذ:</span>
                  <p className="text-slate-800 mt-1">{teacher.telephone || '98 765 432'}</p>
                </div>
              </div>
            </div>

            {/* Performance Indicators Quick Summary */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">مؤشرات الأداء الأخيرة</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
                  <TrendingUp className="text-emerald-600 mx-auto" size={20} />
                  <p className="text-[10px] text-slate-400 font-bold mt-2">معدل نقاط القوة</p>
                  <p className="text-lg font-extrabold text-emerald-700 mt-1">5 نقاط</p>
                </div>
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-center">
                  <Star className="text-blue-600 mx-auto" size={20} />
                  <p className="text-[10px] text-slate-400 font-bold mt-2">تقييم الكفايات الإجمالي</p>
                  <p className="text-lg font-extrabold text-blue-700 mt-1">{teacher.score || '3.5 / 4'}</p>
                </div>
                <div className="p-4 bg-yellow-50/50 rounded-xl border border-yellow-100 text-center">
                  <AlertTriangle className="text-yellow-600 mx-auto" size={20} />
                  <p className="text-[10px] text-slate-400 font-bold mt-2">التوصيات قيد المتابعة</p>
                  <p className="text-lg font-extrabold text-yellow-700 mt-1">توصيتان (2)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Inspection timeline visit blocks */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">التسلسل الزمني للزيارات التفقدية</h3>
            <div className="relative border-r border-slate-100 pr-4 space-y-6 text-xs">

              {/* Visit 1: Diagnostic */}
              <div className="relative">
                <span className="absolute -right-[21px] top-1.5 h-3.5 w-3.5 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800">تفقد تشخيصي (زيارة أولى)</span>
                    <span className="text-[10px] text-slate-400 font-semibold">15 سبتمبر 2026</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">تم تشخيص الكفايات المعرفية الأساسية، وتوجيه المعلم للتركيز على مهارات التخطيط الصفي المتوازن.</p>
                </div>
              </div>

              {/* Visit 2: Follow-up */}
              <div className="relative">
                <span className="absolute -right-[21px] top-1.5 h-3.5 w-3.5 rounded-full bg-amber-500 ring-4 ring-amber-50" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800">زيارة تأطيرية ومتابعة</span>
                    <span className="text-[10px] text-slate-400 font-semibold">12 أكتوبر 2026</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">تم رصد استجابة جيدة جداً للتوصيات السابقة وتوظيف للوسائل الرقمية بشكل محدود.</p>
                </div>
              </div>

              {/* Visit 3: Evaluative */}
              <div className="relative">
                <span className="absolute -right-[21px] top-1.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800">تفقد تقييمي شامل (أخير)</span>
                    <span className="text-[10px] text-slate-400 font-semibold">05 نوفمبر 2026</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">تم تقييم المعلم بنسبة 3.2 من 4 وإصدار التقرير النهائي تمهيداً للإغلاق والاعتماد الرسمي.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
