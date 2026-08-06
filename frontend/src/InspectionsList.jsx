import React, { useState, useEffect } from 'react';
import {
  Search, PlusCircle, ArrowRight, UserPlus,
  MapPin, School, BookOpen, Star, RefreshCw, Trash2, Edit3, X, Save
} from 'lucide-react';
import { apiService } from './apiService';

export default function TeachersList({ onNavigate }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form states
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [matiere, setMatiere] = useState('');
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
    setMatiere('');
    setEmail('');
    setTelephone('');
    setShowModal(true);
  };

  const handleOpenEdit = (t) => {
    setIsEditMode(true);
    setCurrentId(t.idEnseignant);
    setNom(t.nom || '');
    setPrenom(t.prenom || '');
    setMatiere(t.matiere || '');
    setEmail(t.email || '');
    setTelephone(t.telephone || '');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الأستاذ نهائياً من قاعدة البيانات؟')) {
      try {
        await apiService.deleteEnseignant(id);
        alert('تم حذف الأستاذ بنجاح!');
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
        alert('تم تحديث بيانات الأستاذ بنجاح!');
      } else {
        await apiService.createEnseignant(payload);
        alert('تمت إضافة الأستاذ الجديد بنجاح في قاعدة البيانات!');
      }
      setShowModal(false);
      fetchTeachers();
    } catch (err) {
      alert('فشل في إرسال البيانات للخادم.');
    }
  };

  const filtered = teachers.filter(t => {
    const fullName = `${t.prenom} ${t.nom}`.toLowerCase();
    const searchVal = searchTerm.toLowerCase();
    return fullName.includes(searchVal) ||
           (t.matiere && t.matiere.toLowerCase().includes(searchVal)) ||
           (t.school && t.school.toLowerCase().includes(searchVal));
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">إدارة وشؤون الأساتذة</h1>
          <p className="text-xs text-slate-400 font-bold mt-1">عرض وتعديل وإضافة شاملة في كافة ملفات الأساتذة المسجلين في قاعدة البيانات.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-100 transition text-xs shrink-0"
        >
          <UserPlus size={16} />
          <span>إضافة أستاذ جديد</span>
        </button>
      </div>

      {/* FILTERING & SEARCH BAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative">
          <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="ابحث باسم الأستاذ، المادة، أو البريد الإلكتروني..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 text-xs transition font-semibold"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-100">
          <RefreshCw className="animate-spin text-blue-600 mr-2" />
          <span className="text-xs font-bold text-slate-500">جاري تحميل قائمة الأساتذة الحية...</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold border-b border-slate-100">
                  <th className="p-4">الأستاذ</th>
                  <th className="p-4">المادة البيداغوجية</th>
                  <th className="p-4">البريد الإلكتروني</th>
                  <th className="p-4">الهاتف</th>
                  <th className="p-4 text-center">الإجراءات والعمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400 font-bold">لا توجد سجلات مطابقة للبحث.</td>
                  </tr>
                ) : (
                  filtered.map((t) => (
                    <tr key={t.idEnseignant} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-800">
                        {t.prenom} {t.nom}
                      </td>
                      <td className="p-4 text-slate-600 font-semibold">
                        {t.matiere}
                      </td>
                      <td className="p-4 text-slate-500 font-semibold">
                        {t.email || 'غير متوفر'}
                      </td>
                      <td className="p-4 text-slate-500 font-semibold">
                        {t.telephone || 'غير متوفر'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(t)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition text-[10px] font-bold"
                          >
                            <Edit3 size={12} />
                            <span>تعديل</span>
                          </button>
                          <button
                            onClick={() => handleDelete(t.idEnseignant)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition text-[10px] font-bold"
                          >
                            <Trash2 size={12} />
                            <span>حذف</span>
                          </button>
                          <button
                            onClick={() => onNavigate('teacher-profile', { id: t.idEnseignant, name: `${t.prenom} ${t.nom}`, school: 'المدرسة الإعدادية الحكومية', region: 'الجمهورية التونسية', rank: 'أستاذ أول للمادة', score: '3.5 / 4' })}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition text-[10px] font-bold"
                          >
                            <span>ملف الكفايات</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD/EDIT DYNAMIC MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                {isEditMode ? 'تعديل بيانات الأستاذ' : 'إضافة أستاذ جديد'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-semibold text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">الاسم الأول *</label>
                  <input
                    type="text"
                    required
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    placeholder="أدخل الاسم الأول..."
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">اللقب / اسم العائلة *</label>
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    placeholder="أدخل اسم العائلة..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">المادة المدرسة / الاختصاص البيداغوجي *</label>
                <input
                  type="text"
                  required
                  value={matiere}
                  onChange={(e) => setMatiere(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  placeholder="مثال: الرياضيات، الفيزياء، العربية..."
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  placeholder="username@domain.com"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">رقم الهاتف الجوال</label>
                <input
                  type="text"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  placeholder="أدخل رقم الهاتف..."
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  <Save size={14} />
                  <span>{isEditMode ? 'حفظ التعديلات' : 'إضافة إلى القائمة'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
