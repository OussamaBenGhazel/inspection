import React, { useState, useEffect } from 'react';
import { Search, Bell, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { apiService } from './apiService';

export default function Dashboard({ onNavigate, unreadNotificationsCount: initialUnreadCount }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount || 0);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await apiService.getDashboardStats();
      setData(stats);
      try {
        const count = await apiService.getUnreadNotificationsCount();
        setUnreadCount(count);
      } catch (e) {
        // keep current unread count
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('تعذر تحميل بيانات لوحة المؤشرات من الخادم. يرجى التحقق من اتصال الخادم.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Loading Skeleton State
  if (loading && !data) {
    return (
      <div className="p-8 space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-slate-200/80 rounded-xl animate-pulse"></div>
          <div className="h-10 w-64 bg-slate-200/80 rounded-xl animate-pulse"></div>
        </div>
        <div className="kpi-row">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="kpi animate-pulse space-y-3">
              <div className="h-4 w-24 bg-slate-200 rounded"></div>
              <div className="h-8 w-16 bg-slate-300 rounded"></div>
              <div className="h-3 w-32 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-5">
          <div className="panel h-64 animate-pulse bg-slate-100/70"></div>
          <div className="panel h-64 animate-pulse bg-slate-100/70"></div>
        </div>
        <div className="flex items-center justify-center py-12 gap-3 text-[var(--accent)]">
          <Loader2 className="animate-spin" size={24} />
          <span className="font-bold text-sm">جاري تحميل المؤشرات الحية من قاعدة البيانات...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <div className="p-8" dir="rtl">
        <div className="panel bg-red-50/80 border-red-200 text-red-700 flex flex-col items-center justify-center py-12 gap-4">
          <AlertCircle size={36} className="text-red-500" />
          <p className="font-bold">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="btn primary flex items-center gap-2"
          >
            <RefreshCw size={16} />
            <span>إعادة المحاولة</span>
          </button>
        </div>
      </div>
    );
  }

  // Dynamic values
  const totalTeachers = data?.totalTeachers ?? 0;
  const completedVisits = data?.completedVisits ?? 0;
  const recommendationsRate = data?.recommendationsCompletionRate ?? 0;
  const overallAvg = data?.overallAvg ?? "0.0 / 4";
  const levelCounts = data?.levelCounts || { expert: 0, satisfactory: 0, developing: 0, needsSupport: 0 };
  const totalLevels = (levelCounts.expert + levelCounts.satisfactory + levelCounts.developing + levelCounts.needsSupport) || 1;

  // Dynamic conic-gradient for donut
  const pExpert = Math.round((levelCounts.expert / totalLevels) * 100);
  const pSat = Math.round((levelCounts.satisfactory / totalLevels) * 100);
  const pDev = Math.round((levelCounts.developing / totalLevels) * 100);
  const pSupp = Math.max(0, 100 - (pExpert + pSat + pDev));

  const deg1 = Math.round(pExpert * 3.6);
  const deg2 = Math.round((pExpert + pSat) * 3.6);
  const deg3 = Math.round((pExpert + pSat + pDev) * 3.6);

  const dynamicDonutStyle = {
    background: `conic-gradient(#0d6c7d 0deg ${deg1}deg, #2c9c6a ${deg1}deg ${deg2}deg, #e1a62f ${deg2}deg ${deg3}deg, #d85454 ${deg3}deg 360deg)`
  };

  // Dynamic SVG path for trend line
  const evolutionWeeks = data?.evolutionWeeks || [
    { label: "الأسبوع 1", value: 2.8 },
    { label: "الأسبوع 2", value: 3.0 },
    { label: "الأسبوع 3", value: 3.1 },
    { label: "الأسبوع 4", value: 3.2 }
  ];

  // Scale 4.0 to height 220px (y: 200 at val 1.0, y: 30 at val 4.0)
  const getY = (val) => Math.max(30, Math.min(190, 220 - ((val / 4.0) * 170)));
  const y0 = getY(evolutionWeeks[0]?.value || 2.8);
  const y1 = getY(evolutionWeeks[1]?.value || 3.0);
  const y2 = getY(evolutionWeeks[2]?.value || 3.1);
  const y3 = getY(evolutionWeeks[3]?.value || 3.2);

  const linePathD = `M0 ${y0} C40 ${y0 - 5}, 70 ${y1 + 10}, 105 ${y1} S175 ${y2 + 10}, 210 ${y2} S280 ${y3 + 10}, 315 ${y3} S380 ${y3 - 5}, 420 ${y3}`;
  const fillPathD = `${linePathD} L420 220 L0 220 Z`;

  // Filter activities by search term
  const activities = (data?.recentActivities || []).filter(act =>
    !searchTerm ||
    (act.title && act.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (act.desc && act.desc.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (act.region && act.region.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Dynamic Topbar */}
      <div className="topbar flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="eyebrow mb-1">واجهة المتفقد</div>
          <h2 className="text-2xl font-extrabold text-[var(--ink)] m-0">لوحة المؤشرات العامة</h2>
        </div>

        <div className="topbar-actions flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="search-box relative flex items-center min-w-[260px] bg-white/95 border border-[var(--line)] rounded-[18px] px-4 py-2.5 shadow-sm">
            <Search size={16} className="text-[var(--muted)] ml-2" />
            <input
              type="text"
              placeholder="بحث سريع عن أستاذ أو مؤسسة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-[var(--ink)] w-full placeholder:text-[var(--muted)]"
            />
          </div>

          <button
            onClick={() => onNavigate && onNavigate('notifications-alerts')}
            className="stat-chip hover:border-[var(--accent)] transition cursor-pointer flex items-center gap-2"
          >
            <Bell size={15} className="text-[var(--accent)]" />
            <span>إشعارات {unreadCount}</span>
          </button>

          <div className="stat-chip flex items-center gap-2 border-[var(--line)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--success)] inline-block"></span>
            <span>المتفقدة آمنة فرحات</span>
          </div>
        </div>
      </div>

      {/* 4 Dynamic KPI Cards */}
      <div className="kpi-row">
        <div
          onClick={() => onNavigate && onNavigate('teachers-list')}
          className="kpi cursor-pointer"
        >
          <div className="meta">عدد الأساتذة</div>
          <strong>{totalTeachers}</strong>
          <div className="meta text-[var(--success)] font-bold">بيانات حية من المنظومة</div>
        </div>

        <div
          onClick={() => onNavigate && onNavigate('new-inspection')}
          className="kpi cursor-pointer"
        >
          <div className="meta">الزيارات المنجزة</div>
          <strong>{completedVisits}</strong>
          <div className="meta">من أصل 60 زيارة مستهدفة</div>
        </div>

        <div
          onClick={() => onNavigate && onNavigate('recommendations-tracking')}
          className="kpi cursor-pointer"
        >
          <div className="meta">نسبة إنجاز التوصيات</div>
          <strong>{recommendationsRate}%</strong>
          <div className="meta text-[var(--success)] font-bold">محسوبة من التوصيات</div>
        </div>

        <div
          onClick={() => onNavigate && onNavigate('competencies-board')}
          className="kpi cursor-pointer"
        >
          <div className="meta">متوسط الأداء العام</div>
          <strong>{overallAvg}</strong>
          <div className="meta text-[var(--success)] font-bold">تقييم الكفايات الثمانية</div>
        </div>
      </div>

      {/* Dual Grid: Dynamic Donut & SVG Line Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-5">
        {/* Panel 1: Performance Levels Distribution with Dynamic Donut */}
        <div className="panel">
          <div className="panel-title">
            <span>توزيع مستويات الأداء</span>
            <span className="badge info">حي</span>
          </div>
          <div className="chart relative">
            <div className="donut" style={dynamicDonutStyle}></div>
            <div className="legend">
              <div className="legend-item"><span className="dot blue"></span> متقن ({pExpert}%)</div>
              <div className="legend-item"><span className="dot green"></span> مرض ({pSat}%)</div>
              <div className="legend-item"><span className="dot orange"></span> في طور التمكن ({pDev}%)</div>
              <div className="legend-item"><span className="dot red"></span> يحتاج دعما ({pSupp}%)</div>
            </div>
          </div>
        </div>

        {/* Panel 2: Term Trend Line Chart */}
        <div className="panel">
          <div className="panel-title">
            <span>اتجاهات التطور خلال الفصل</span>
            <span className="text-xs font-semibold text-[var(--muted)]">معدل / 4</span>
          </div>
          <div className="chart-line">
            <div className="line-path">
              <svg className="line-svg w-full h-full" viewBox="0 0 420 220" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineA" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#0d6c7d" />
                    <stop offset="100%" stopColor="#e67e22" />
                  </linearGradient>
                </defs>
                <path
                  d={linePathD}
                  fill="none"
                  stroke="url(#lineA)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d={fillPathD}
                  fill="rgba(13,108,125,0.10)"
                />
              </svg>
            </div>
            {/* Week Indicators at bottom */}
            <div className="absolute bottom-3 inset-x-5 flex justify-between text-[11px] font-bold text-[var(--muted)] pointer-events-none">
              {evolutionWeeks.map((w, idx) => (
                <span key={idx}>{w.label}: {w.value}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Panel 3: Dynamic Recent Activities from Backend */}
      <div className="panel mt-4">
        <div className="panel-title">
          <span>آخر الأنشطة والزيارات الميدانية</span>
          <button
            onClick={fetchDashboardData}
            className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1 font-bold"
          >
            <RefreshCw size={13} />
            <span>تحديث</span>
          </button>
        </div>
        {activities.length === 0 ? (
          <div className="text-center py-6 text-sm text-[var(--muted)] font-semibold">
            لا توجد أنشطة تطابق البحث حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activities.map((act, index) => (
              <div key={index} className="event">
                <strong>{act.type}</strong>
                <div className="meta font-semibold">{act.title}</div>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{act.desc}</p>
                <div className="flex gap-2">
                  <span className="small-tag">{act.time}</span>
                  <span className="small-tag">{act.region}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
