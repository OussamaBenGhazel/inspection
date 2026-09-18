import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2, RefreshCw, AlertCircle, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { apiService } from './apiService';

export default function TeacherProfile({ teacher, onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  const teacherId = teacher?.idEnseignant || teacher?.id;

  const loadProfile = async () => {
    if (!teacherId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getTeacherProfile(teacherId);
      setProfile(data);
    } catch (err) {
      console.error('Failed to load teacher profile:', err);
      setError('تعذر استرجاع الملف البيداغوجي للأستاذ من الخادم.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [teacherId]);

  if (!teacher) {
    return (
      <div className="p-8" dir="rtl">
        <div className="panel bg-amber-50 border-amber-200 text-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle size={24} className="text-amber-600" />
            <span className="font-bold text-sm">يرجى اختيار أستاذ من قائمة الأساتذة لعرض ملفه البيداغوجي الشامل.</span>
          </div>
          <button
            onClick={() => onNavigate('teachers-list')}
            className="btn primary text-xs flex items-center gap-1"
          >
            <span>الانتقال لقائمة الأساتذة</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // Initials for avatar
  const initials = profile?.nom && profile?.prenom
    ? `${profile.prenom[0]} ${profile.nom[0]}`
    : (teacher.prenom ? `${teacher.prenom[0]} ${teacher.nom[0]}` : 'أ ب');

  return (
    <div className="space-y-6" dir="rtl">
      {/* Topbar matching prototype */}
      <div className="topbar flex justify-between items-center mb-4">
        <div>
          <div className="eyebrow mb-1">عرض تفصيلي</div>
          <h2 className="text-2xl font-extrabold text-[var(--ink)] m-0">ملف الأستاذ</h2>
        </div>

        <button
          onClick={() => onNavigate('teachers-list')}
          className="btn secondary flex items-center gap-2 text-xs cursor-pointer hover:opacity-90"
        >
          <ArrowRight size={15} />
          <span>العودة لقائمة الأساتذة</span>
        </button>
      </div>

      {loading ? (
        <div className="panel flex flex-col items-center justify-center py-20 gap-3 text-[var(--accent)]">
          <Loader2 className="animate-spin" size={32} />
          <span className="text-xs font-bold">جاري تحميل الملف البيداغوجي والتقييمات الحية...</span>
        </div>
      ) : error ? (
        <div className="panel bg-red-50 text-red-700 flex flex-col items-center justify-center py-12 gap-3">
          <AlertCircle size={32} className="text-red-500" />
          <p className="font-bold text-sm">{error}</p>
          <button onClick={loadProfile} className="btn primary text-xs flex items-center gap-1.5">
            <RefreshCw size={14} />
            <span>إعادة المحاولة</span>
          </button>
        </div>
      ) : (
        <div className="panel space-y-6">
          {/* Profile Hero Header matching prototype */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[var(--line)]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-2)] text-white flex items-center justify-center text-xl font-extrabold shadow-md">
                {initials}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[var(--ink)] m-0">{profile?.fullName}</h3>
                <div className="text-xs text-[var(--muted)] font-semibold mt-1">
                  {profile?.etablissement} • {profile?.region}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="small-tag">رتبة: {profile?.statut || 'أستاذ أول'}</span>
              <span className="small-tag">أقدمية: {profile?.anciennete || 12} سنة</span>
              <span className="small-tag text-[var(--accent)] font-bold">{profile?.inspecteurNom || 'المتفقدة آمنة فرحات'}</span>
            </div>
          </div>

          {/* Tab Row matching prototype */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[var(--line)]">
            <button
              onClick={() => setActiveTab('basic')}
              className={`chip text-xs font-bold rounded-2xl cursor-pointer transition ${
                activeTab === 'basic' ? 'active' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              البيانات الأساسية والزيارات
            </button>
            <button
              onClick={() => setActiveTab('competencies')}
              className={`chip text-xs font-bold rounded-2xl cursor-pointer transition ${
                activeTab === 'competencies' ? 'active' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              الكفايات الثمانية
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`chip text-xs font-bold rounded-2xl cursor-pointer transition ${
                activeTab === 'recommendations' ? 'active' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              التوصيات والمتابعة
            </button>
            <button
              onClick={() => setActiveTab('growthPlan')}
              className={`chip text-xs font-bold rounded-2xl cursor-pointer transition ${
                activeTab === 'growthPlan' ? 'active' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              خطة النمو الشخصية
            </button>
          </div>

          {/* TAB 1: BASIC INFO & VISITS TIMELINE */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-5">
              {/* Personal & Professional Info Grid */}
              <div className="panel bg-white/70">
                <div className="panel-title">البيانات الشخصية والمهنية</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 border border-[var(--line)] bg-white/90 rounded-2xl">
                    <div className="text-[var(--muted)] font-bold mb-1">الاسم الكامل</div>
                    <strong className="text-[var(--ink)] text-sm">{profile?.fullName}</strong>
                  </div>

                  <div className="p-3 border border-[var(--line)] bg-white/90 rounded-2xl">
                    <div className="text-[var(--muted)] font-bold mb-1">المادة الدراسية</div>
                    <strong className="text-[var(--ink)] text-sm">{profile?.matiere || 'التربية المدنية'}</strong>
                  </div>

                  <div className="p-3 border border-[var(--line)] bg-white/90 rounded-2xl">
                    <div className="text-[var(--muted)] font-bold mb-1">المؤسسة التربوية</div>
                    <strong className="text-[var(--ink)] text-sm">{profile?.etablissement}</strong>
                  </div>

                  <div className="p-3 border border-[var(--line)] bg-white/90 rounded-2xl">
                    <div className="text-[var(--muted)] font-bold mb-1">المندوبية الجهوية</div>
                    <strong className="text-[var(--ink)] text-sm">{profile?.region}</strong>
                  </div>

                  <div className="p-3 border border-[var(--line)] bg-white/90 rounded-2xl">
                    <div className="text-[var(--muted)] font-bold mb-1">تاريخ الانتداب</div>
                    <strong className="text-[var(--ink)] text-sm">{profile?.dateRecrutement || '15 سبتمبر 2014'}</strong>
                  </div>

                  <div className="p-3 border border-[var(--line)] bg-white/90 rounded-2xl">
                    <div className="text-[var(--muted)] font-bold mb-1">سنوات الأقدمية</div>
                    <strong className="text-[var(--ink)] text-sm">{profile?.anciennete || 12} سنة</strong>
                  </div>

                  <div className="p-3 border border-[var(--line)] bg-white/90 rounded-2xl">
                    <div className="text-[var(--muted)] font-bold mb-1">البريد الإلكتروني</div>
                    <strong className="text-[var(--ink)] text-xs truncate block">{profile?.email || 'sana@education.tn'}</strong>
                  </div>

                  <div className="p-3 border border-[var(--line)] bg-white/90 rounded-2xl">
                    <div className="text-[var(--muted)] font-bold mb-1">رقم الهاتف</div>
                    <strong className="text-[var(--ink)] text-sm">{profile?.telephone || '22446688'}</strong>
                  </div>
                </div>
              </div>

              {/* Recent Visits Timeline matching prototype */}
              <div className="panel bg-white/70">
                <div className="panel-title">الزيارات الميدانية الأخيرة</div>
                <div className="space-y-3">
                  {(profile?.recentVisits || []).map((v, i) => (
                    <div key={i} className="p-3.5 border border-[var(--line)] bg-white/90 rounded-2xl relative">
                      <div className="w-10 h-1 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] mb-2"></div>
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-bold text-[var(--ink)]">{v.title}</strong>
                        <span className={`status ${v.badge || 'info'}`}>{v.status}</span>
                      </div>
                      <div className="text-[11px] text-[var(--muted)] font-semibold mt-1">{v.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPETENCIES */}
          {activeTab === 'competencies' && (
            <div className="panel bg-white/70">
              <div className="panel-title">تقييم الكفايات الثمانية للأستاذ</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(profile?.competencies || []).map((c, i) => (
                  <div key={i} className="p-4 border border-[var(--line)] bg-white/90 rounded-2xl">
                    <div className="text-xs text-[var(--muted)] font-bold">{c.label}</div>
                    <strong className="text-xl font-extrabold text-[var(--accent)] block mt-2">{c.score}/4</strong>
                    <div className="text-xs text-emerald-600 font-bold mt-1">{c.trend}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RECOMMENDATIONS */}
          {activeTab === 'recommendations' && (
            <div className="panel bg-white/70">
              <div className="panel-title">تتبع التوصيات البيداغوجية الصادرة</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(profile?.recommendations || []).map((r, i) => (
                  <div key={i} className="p-4 border border-[var(--line)] bg-white/90 rounded-2xl space-y-2">
                    <strong className="text-xs font-extrabold text-[var(--ink)] block">{r.title}</strong>
                    <span className={`status ${r.tone || 'info'}`}>{r.status} ({r.progress}%)</span>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]" style={{ width: `${r.progress}%` }}></div>
                    </div>
                    {r.bullets && r.bullets.length > 0 && (
                      <ul className="text-xs text-slate-500 list-disc pr-4 space-y-0.5 mt-2">
                        {r.bullets.map((b, idx) => (
                          <li key={idx}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GROWTH PLAN */}
          {activeTab === 'growthPlan' && (
            <div className="panel bg-white/70">
              <div className="panel-title">أهداف خطة النمو المهني الشخصية</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(profile?.growthPlan || []).map((p, i) => (
                  <div key={i} className="p-4 border border-[var(--line)] bg-white/90 rounded-2xl space-y-2">
                    <strong className="text-xs font-extrabold text-[var(--ink)] block">{p.goal}</strong>
                    {p.actions && (
                      <ul className="text-xs text-slate-500 list-disc pr-4 space-y-0.5">
                        {p.actions.map((act, aIdx) => (
                          <li key={aIdx}>{act}</li>
                        ))}
                      </ul>
                    )}
                    <div className="text-[11px] text-[var(--muted)]">{p.resources}</div>
                    <div className="flex gap-2 text-[10px] font-bold text-slate-600 mt-2">
                      <span className="small-tag">{p.date}</span>
                      <span className="small-tag">{p.success}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
