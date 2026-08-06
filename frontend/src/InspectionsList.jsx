import React, { useState } from 'react';
import {
  Search, Filter, PlusCircle, ArrowLeft, ArrowRight, UserPlus,
  MapPin, School, BookOpen, Star, Sparkles, ChevronRight
} from 'lucide-react';

export default function TeachersList({ onNavigate, teachers = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [institutionFilter, setInstitutionFilter] = useState('ALL');
  const [rankFilter, setRankFilter] = useState('ALL');
  const [academicYear, setAcademicYear] = useState('2026/2027');

  // Hardcoded or dynamic teachers list for visual representation (Screen 02)
  const defaultTeachers = [
    { id: 1, name: "صالح البكوش", school: "المدرسة الإعدادية بالرياض", region: "تونس 1", rank: "أستاذ أول", date: "2026-11-04", score: "3.2 / 4", status: "مستقر" },
    { id: 2, name: "سناء بن عمر", school: "معهد ابن شرف بقابس", region: "قابس", rank: "أستاذة أولى مميزة", date: "2026-11-05", score: "3.8 / 4", status: "متقدم" },
    { id: 3, name: "سليم الهرماسي", school: "الإعدادية النموذجية بصفاقس", region: "صفاقس", rank: "أستاذ أول", date: "2026-11-03", score: "2.5 / 4", status: "قيد المتابعة" },
    { id: 4, name: "ليلى المنصوري", school: "معهد المنزه السادس", region: "أريانة", rank: "أستاذة مبرزة", date: "2026-11-02", score: "1.8 / 4", status: "دعم عاجل" },
  ];

  const listToRender = teachers.length > 0 ? teachers.map((t, idx) => ({
    id: t.idEnseignant || idx + 1,
    name: `${t.prenom} ${t.nom}`,
    school: t.telephone ? "معهد المتفوقين الجهوي" : "مدرسة حكومية عامة",
    region: idx % 2 === 0 ? "تونس 1" : "قابس",
    rank: t.email ? "أستاذ أول" : "أستاذ مبرز",
    date: "2026-11-05",
    score: idx % 2 === 0 ? "3.2 / 4" : "3.8 / 4",
    status: idx % 2 === 0 ? "مستقر" : "متقدم"
  })) : defaultTeachers;

  const filtered = listToRender.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.school.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'ALL' || t.region === regionFilter;
    const matchesRank = rankFilter === 'ALL' || t.rank.includes(rankFilter);
    return matchesSearch && matchesRegion && matchesRank;
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* HEADER BAR (Screen 02) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">إدارة وشؤون الأساتذة</h1>
          <p className="text-xs text-slate-400 font-bold mt-1">عرض وتصفية وبحث شامل في كافة ملفات الأساتذة المسجلين تحت إشرافكم.</p>
        </div>

        <button
          onClick={() => alert('إضافة أستاذ جديد غير متاحة في النسخة التجريبية المحدودة.')}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-100 transition text-xs shrink-0"
        >
          <UserPlus size={16} />
          <span>إضافة أستاذ جديد (إدارة)</span>
        </button>
      </div>

      {/* FILTERING & SEARCH BAR (Screen 02) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search name or school */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="ابحث باسم الأستاذ، المدرسة، أو المادة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 text-xs transition font-semibold"
            />
          </div>

          {/* Academic Year Selector */}
          <div className="w-full md:w-48">
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 text-xs font-bold"
            >
              <option value="2026/2027">السنة الدراسية 2026/2027</option>
              <option value="2025/2026">السنة الدراسية 2025/2026</option>
            </select>
          </div>
        </div>

        {/* Dropdown Filters row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {/* Region */}
          <div>
            <label className="block text-slate-400 font-bold text-[10px] uppercase mb-1">الجهة / المندوبية</label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">جميع الجهات</option>
              <option value="تونس 1">تونس 1</option>
              <option value="قابس">قابس</option>
              <option value="صفاقس">صفاقس</option>
              <option value="أريانة">أريانة</option>
            </select>
          </div>

          {/* Institution */}
          <div>
            <label className="block text-slate-400 font-bold text-[10px] uppercase mb-1">المؤسسة التربوية</label>
            <select
              value={institutionFilter}
              onChange={(e) => setInstitutionFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">جميع المؤسسات</option>
              <option value="حكومي">مدرسة إعدادية</option>
              <option value="نموذجي">معهد ثانوي</option>
            </select>
          </div>

          {/* Rank */}
          <div>
            <label className="block text-slate-400 font-bold text-[10px] uppercase mb-1">الرتبة الأكاديمية</label>
            <select
              value={rankFilter}
              onChange={(e) => setRankFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">جميع الرتب</option>
              <option value="أستاذ أول">أستاذ أول</option>
              <option value="أستاذ مبرز">أستاذ مبرز</option>
            </select>
          </div>

          {/* Sort selection */}
          <div className="flex items-end">
            <span className="text-[11px] text-slate-400 font-bold pb-2">
              تصفية النتائج النشطة: {filtered.length} أساتذة
            </span>
          </div>
        </div>
      </div>

      {/* DATA TABLE (Screen 02) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold border-b border-slate-100">
                <th className="p-4">الأستاذ</th>
                <th className="p-4">المؤسسة التربوية / الجهة</th>
                <th className="p-4">تاريخ آخر زيارة تفقد</th>
                <th className="p-4">المعدل العام للكفايات</th>
                <th className="p-4">الحالة والمتابعة</th>
                <th className="p-4">الملف الشخصي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition">
                  {/* Name & Rank */}
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{t.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{t.rank}</div>
                  </td>

                  {/* School & Region */}
                  <td className="p-4">
                    <div className="font-semibold text-slate-700 flex items-center gap-1">
                      <School size={12} className="text-slate-400" />
                      <span>{t.school}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin size={10} />
                      <span>{t.region}</span>
                    </div>
                  </td>

                  {/* Date of visit */}
                  <td className="p-4 font-semibold text-slate-500">
                    {t.date}
                  </td>

                  {/* Overall Average */}
                  <td className="p-4">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 font-extrabold text-[11px]">
                      <Star size={10} className="fill-current" />
                      <span>{t.score}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      t.status === 'متقدم' ? 'bg-green-50 text-green-700 border border-green-200' :
                      t.status === 'مستقر' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      t.status === 'قيد المتابعة' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                      'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                    }`}>
                      {t.status}
                    </span>
                  </td>

                  {/* Profile action */}
                  <td className="p-4">
                    <button
                      onClick={() => onNavigate('teacher-profile', t)}
                      className="flex items-center gap-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl transition text-[11px]"
                    >
                      <span>عرض الملف</span>
                      <ChevronRight size={14} />
                    </button>
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
