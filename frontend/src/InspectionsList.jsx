import React, { useState, useEffect } from 'react';
import {
  Search, PlusCircle, UserPlus, RefreshCw, Trash2, Edit3,
  X, Save, Loader2, ArrowLeft, Eye
} from 'lucide-react';
import { apiService } from './apiService';

export default function TeachersList({ onNavigate }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('الكل');
  const [selectedEtablissement, setSelectedEtablissement] = useState('الكل');
  const [selectedStatus, setSelectedStatus] = useState('الكل');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form states
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [matiere, setMatiere] = useState('التربية المدنية');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const data = await apiService.getEnseignants();
      setTeachers(data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setNom('');
    setPrenom('');
    setMatiere('التربية المدنية');
    setEmail('');
    setTelephone('');
    setShowModal(true);
  };

  const handleOpenEdit = (t) => {
    setIsEditMode(true);
    setCurrentId(t.idEnseignant);
    setNom(t.nom || '');
    setPrenom(t.prenom || '');
    setMatiere(t.matiere || 'التربية المدنية');
    setEmail(t.email || '');
    setTelephone(t.telephone || '');
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`هل أنت متأكد من رغبتك في حذف الأستاذ ${name} نهائياً من قاعدة البيانات؟`)) {
      try {
        await apiService.deleteEnseignant(id);
        fetchTeachers();
      } catch (err) {
        alert('حدث خطأ أثناء محاولة الحذف.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom || !prenom || !matiere) {
      alert('يرجى ملء الحقول الإجبارية (الاسم، اللقب، والمادة).');
      return;
    }

    const payload = { nom, prenom, matiere, email, telephone };

    try {
      if (isEditMode) {
        await apiService.updateEnseignant(currentId, payload);
      } else {
        await apiService.createEnseignant(payload);
      }
      setShowModal(false);
      fetchTeachers();
    } catch (err) {
      alert('فشل في إرسال البيانات للخادم.');
    }
  };

  // Dynamic filter dropdown options extracted from live data
  const regions = ['الكل', ...new Set(teachers.map(t => t.region).filter(Boolean))];
  const etablissements = ['الكل', ...new Set(teachers.map(t => t.etablissement).filter(Boolean))];
  const statuses = ['الكل', 'متقدم', 'مستقر', 'متابعة', 'دعم عاجل'];

  const filteredTeachers = teachers.filter(t => {
    const fullName = (t.fullName || `${t.prenom} ${t.nom}`).toLowerCase();
    const searchVal = searchTerm.toLowerCase();
    const matchesSearch = fullName.includes(searchVal) ||
      (t.etablissement && t.etablissement.toLowerCase().includes(searchVal)) ||
      (t.matiere && t.matiere.toLowerCase().includes(searchVal));

    const matchesRegion = selectedRegion === 'الكل' || t.region === selectedRegion;
    const matchesEtab = selectedEtablissement === 'الكل' || t.etablissement === selectedEtablissement;
    const matchesStatus = selectedStatus === 'الكل' || t.status === selectedStatus;

    return matchesSearch && matchesRegion && matchesEtab && matchesStatus;
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* Topbar matching prototype */}
      <div className="topbar flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <div className="eyebrow mb-1">إدارة الملفات</div>
          <h2 className="text-2xl font-extrabold text-[var(--ink)] m-0">قائمة الأساتذة</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchTeachers}
            className="stat-chip flex items-center gap-2 hover:border-[var(--accent)] transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>تحديث القائمة</span>
          </button>
        </div>
      </div>

      {/* Filter Row Panel matching prototype */}
      <div className="panel">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_repeat(3,1fr)_auto] gap-3 items-center">
          <div className="relative flex items-center bg-white border border-[var(--line)] rounded-[16px] px-3 py-2.5">
            <Search size={16} className="text-[var(--muted)] ml-2" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو المؤسسة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-[var(--ink)] w-full placeholder:text-[var(--muted)]"
            />
          </div>

          <div className="flex items-center gap-2 bg-white border border-[var(--line)] rounded-[16px] px-3 py-2 text-xs">
            <span className="text-[var(--muted)] shrink-0">المندوبية:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent border-none outline-none text-[var(--ink)] font-bold w-full cursor-pointer"
            >
              {regions.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white border border-[var(--line)] rounded-[16px] px-3 py-2 text-xs">
            <span className="text-[var(--muted)] shrink-0">المؤسسة:</span>
            <select
              value={selectedEtablissement}
              onChange={(e) => setSelectedEtablissement(e.target.value)}
              className="bg-transparent border-none outline-none text-[var(--ink)] font-bold w-full cursor-pointer"
            >
              {etablissements.map((e, i) => (
                <option key={i} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white border border-[var(--line)] rounded-[16px] px-3 py-2 text-xs">
            <span className="text-[var(--muted)] shrink-0">الحالة:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent border-none outline-none text-[var(--ink)] font-bold w-full cursor-pointer"
            >
              {statuses.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOpenAdd}
            className="btn accent flex items-center justify-center gap-2 px-5 py-2.5 text-xs whitespace-nowrap cursor-pointer hover:opacity-90 transition"
          >
            <PlusCircle size={16} />
            <span>إضافة أستاذ</span>
          </button>
        </div>
      </div>

      {/* Teachers Table Panel matching prototype */}
      <div className="panel">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-[var(--accent)]">
            <Loader2 className="animate-spin" size={28} />
            <span className="text-xs font-bold">جاري استرجاع قائمة الأساتذة الحية من الخادم...</span>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="text-center py-12 text-sm text-[var(--muted)] font-semibold">
            لم يتم العثور على أي أستاذ يطابق معايير البحث والتصفية المحددة.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-[var(--line)] text-xs text-[var(--ink)] bg-[rgba(13,108,125,0.08)]">
                  <th className="p-3.5 rounded-r-xl font-extrabold">الأستاذ</th>
                  <th className="p-3.5 font-extrabold">المؤسسة والمندوبية</th>
                  <th className="p-3.5 font-extrabold">آخر زيارة</th>
                  <th className="p-3.5 font-extrabold">المعدل</th>
                  <th className="p-3.5 font-extrabold">الحالة</th>
                  <th className="p-3.5 rounded-l-xl font-extrabold text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)] text-xs font-medium">
                {filteredTeachers.map((teacher) => (
                  <tr
                    key={teacher.idEnseignant}
                    className="hover:bg-white/60 transition group cursor-pointer"
                    onClick={() => onNavigate && onNavigate('teacher-profile', teacher)}
                  >
                    <td className="p-3.5">
                      <strong className="text-[var(--ink)] block font-extrabold text-sm">{teacher.fullName || `${teacher.prenom} ${teacher.nom}`}</strong>
                      <span className="text-[var(--muted)] text-[11px] font-semibold">{teacher.matiere || 'أستاذ تربية مدنية'}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-[var(--ink)]">{teacher.etablissement || 'إعدادية ابن رشد'}</span>
                      <span className="text-[var(--muted)] text-[11px] block">{teacher.region || 'قابس'}</span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-700">{teacher.lastVisitDate || '20 ماي 2027'}</td>
                    <td className="p-3.5 font-extrabold text-[var(--accent)] text-sm">{teacher.score ? `${teacher.score}/4` : '3.2/4'}</td>
                    <td className="p-3.5">
                      <span className={`status ${teacher.tone || 'info'}`}>
                        {teacher.status || 'مستقر'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onNavigate && onNavigate('teacher-profile', teacher)}
                          className="p-1.5 text-[var(--accent)] hover:bg-[rgba(13,108,125,0.1)] rounded-lg transition"
                          title="عرض الملف البيداغوجي"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(teacher)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                          title="تعديل البيانات"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.idEnseignant, teacher.fullName)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="حذف الأستاذ"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] shadow-2xl border border-[var(--line)] max-w-lg w-full p-6 animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--line)] mb-4">
              <h3 className="font-extrabold text-base text-[var(--ink)]">
                {isEditMode ? 'تعديل بيانات الأستاذ' : 'إضافة أستاذ جديد'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">الاسم *</label>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-xl text-xs outline-none focus:border-[var(--accent)]"
                    placeholder="الاسم"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">اللقب *</label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-xl text-xs outline-none focus:border-[var(--accent)]"
                    placeholder="اللقب"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">المادة الدراسية *</label>
                <input
                  type="text"
                  value={matiere}
                  onChange={(e) => setMatiere(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[var(--line)] rounded-xl text-xs outline-none focus:border-[var(--accent)]"
                  placeholder="المادة الدراسية"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-xl text-xs outline-none focus:border-[var(--accent)]"
                    placeholder="name@education.tn"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-xl text-xs outline-none focus:border-[var(--accent)]"
                    placeholder="8 أرقام"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[var(--line)] mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn secondary text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn primary text-xs flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>{isEditMode ? 'حفظ التعديلات' : 'إضافة الآن'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
