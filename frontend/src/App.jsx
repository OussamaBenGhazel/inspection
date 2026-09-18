import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Dashboard from './Dashboard';
import InspectionsList from './InspectionsList';
import NewInspection from './NewInspection';
import InspectionDetails from './InspectionDetails';

// Screen 5 to 14 added imports
import CompetenciesBoard from './CompetenciesBoard';
import PerformanceEvolution from './PerformanceEvolution';
import RecommendationsTracking from './RecommendationsTracking';
import ProfessionalGrowthIndicators from './ProfessionalGrowthIndicators';
import GrowthRoadmap from './GrowthRoadmap';
import QuantitativeGrowthIndicators from './QuantitativeGrowthIndicators';
import FinalDiagnosis from './FinalDiagnosis';
import ReportsExport from './ReportsExport';
import NotificationsAlerts from './NotificationsAlerts';
import PermissionsAuditLog from './PermissionsAuditLog';
import TeacherProfile from './TeacherProfile';

import { apiService } from './apiService';
import {
  LayoutDashboard, ListFilter, PlusCircle, LogOut, Award, TrendingUp,
  CheckSquare, Target, Settings, Eye, HelpCircle, FileSpreadsheet, Bell, Shield
} from 'lucide-react';

function AppContent() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedInspectionId, setSelectedInspectionId] = useState(null);

  // Teachers and inspections state
  const [teachers, setTeachers] = useState([]);
  const [recentInspections, setRecentInspections] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const loadData = async () => {
    try {
      const tList = await apiService.getEnseignants();
      setTeachers(tList);
      const iList = await apiService.getRecentInspections();
      setRecentInspections(iList);
      const stats = await apiService.getDashboardStats();
      setDashboardStats(stats);
      try {
        const count = await apiService.getUnreadNotificationsCount();
        setUnreadNotificationsCount(count);
      } catch (e) {
        console.warn('Could not load unread count:', e);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  if (!user) {
    return <Login />;
  }

  const navigateTo = (view, extra = null) => {
    if (view === 'inspection-details' && extra) {
      setSelectedInspectionId(extra);
    }
    if (view === 'teacher-profile' && extra) {
      setSelectedTeacher(extra);
    }
    setCurrentView(view);
    if (view === 'dashboard') {
      loadData();
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-emerald-50/10 flex flex-col font-sans relative overflow-hidden"
      dir="rtl"
    >
      {/* Dynamic Ministry/Academic Elegant Background Shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/20 to-transparent rounded-full filter blur-3xl pointer-events-none" />

      {/* Beautiful Geometric Academic Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-35 pointer-events-none" />

      {/* Institutional Watermark Shield & Book SVGs floating gracefully in background */}
      <div className="absolute top-48 left-12 opacity-[0.02] text-blue-900 pointer-events-none hidden lg:block">
        <svg width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M12 8v4M12 16h.01"/>
        </svg>
      </div>
      <div className="absolute bottom-24 right-12 opacity-[0.02] text-emerald-900 pointer-events-none hidden lg:block">
        <svg width="280" height="280" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      </div>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl">
              <LayoutDashboard size={20} />
            </div>
            <span className="font-extrabold text-slate-800 text-lg sm:text-xl">التفقد الميداني</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-bold text-slate-800 text-sm">{user.prenom} {user.nom}</span>
              <span className="text-xs text-slate-400 capitalize">{user.role || 'متفقد'}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-100 text-slate-500 hover:text-red-600 rounded-xl transition"
              title="تسجيل الخروج"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      {/* Main Layout Container */}
      <div className="flex-1 max-w-[1480px] w-full mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 relative z-10">

        {/* Prototype Web Sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="web-sidebar shadow-xl sticky top-6">
            <div className="logo-block">
              <div className="logo-title">متابعة التطور المهني</div>
              <div className="logo-subtitle">أساتذة التربية المدنية</div>
            </div>
            <div className="text-xs text-[#eff8fb]/70 font-semibold mb-4 pr-1">السنة الدراسية 2026/2027</div>

            <nav className="space-y-2">
              {/* Screen 1 */}
              <div
                onClick={() => navigateTo('dashboard')}
                className={`menu-item ${currentView === 'dashboard' ? 'active' : ''}`}
              >
                <LayoutDashboard size={17} />
                <span>لوحة التحكم</span>
              </div>

              {/* Screen 2 & 3 */}
              <div
                onClick={() => navigateTo('teachers-list')}
                className={`menu-item ${currentView === 'teachers-list' || currentView === 'teacher-profile' ? 'active' : ''}`}
              >
                <ListFilter size={17} />
                <span>الأساتذة</span>
              </div>

              {/* Screen 4 */}
              <div
                onClick={() => navigateTo('new-inspection')}
                className={`menu-item ${currentView === 'new-inspection' ? 'active' : ''}`}
              >
                <PlusCircle size={17} />
                <span>الزيارات</span>
              </div>

              {/* Screen 5 */}
              <div
                onClick={() => navigateTo('competencies-board')}
                className={`menu-item ${currentView === 'competencies-board' ? 'active' : ''}`}
              >
                <Award size={17} />
                <span>التقييمات</span>
              </div>

              {/* Screen 7 */}
              <div
                onClick={() => navigateTo('recommendations-tracking')}
                className={`menu-item ${currentView === 'recommendations-tracking' ? 'active' : ''}`}
              >
                <CheckSquare size={17} />
                <span>التوصيات</span>
              </div>

              {/* Screen 12 */}
              <div
                onClick={() => navigateTo('reports-export')}
                className={`menu-item ${currentView === 'reports-export' ? 'active' : ''}`}
              >
                <FileSpreadsheet size={17} />
                <span>التقارير</span>
              </div>

              {/* Screen 14 */}
              <div
                onClick={() => navigateTo('permissions-audit')}
                className={`menu-item ${currentView === 'permissions-audit' ? 'active' : ''}`}
              >
                <Shield size={17} />
                <span>الإعدادات</span>
              </div>
            </nav>
          </div>
        </aside>

        {/* Content Section */}
        <main className="flex-1 min-w-0 bg-[#f7fbfc] p-6 rounded-[28px] border border-[var(--line)] shadow-sm">
          {currentView === 'dashboard' && (
            <Dashboard
              onNavigate={navigateTo}
              teachers={teachers}
              recentInspections={recentInspections}
              stats={dashboardStats}
              refreshStats={loadData}
              unreadNotificationsCount={unreadNotificationsCount}
            />
          )}
          {currentView === 'teachers-list' && (
            <InspectionsList onNavigate={navigateTo} teachers={teachers} />
          )}
          {currentView === 'teacher-profile' && (
            <TeacherProfile teacher={selectedTeacher} onNavigate={navigateTo} />
          )}
          {currentView === 'new-inspection' && (
            <NewInspection onNavigate={navigateTo} />
          )}
          {currentView === 'competencies-board' && (
            <CompetenciesBoard onNavigate={navigateTo} />
          )}
          {currentView === 'performance-evolution' && (
            <PerformanceEvolution onNavigate={navigateTo} />
          )}
          {currentView === 'recommendations-tracking' && (
            <RecommendationsTracking onNavigate={navigateTo} />
          )}
          {currentView === 'professional-indicators' && (
            <ProfessionalGrowthIndicators onNavigate={navigateTo} />
          )}
          {currentView === 'growth-roadmap' && (
            <GrowthRoadmap onNavigate={navigateTo} />
          )}
          {currentView === 'quantitative-indicators' && (
            <QuantitativeGrowthIndicators onNavigate={navigateTo} />
          )}
          {currentView === 'final-diagnosis' && (
            <FinalDiagnosis onNavigate={navigateTo} />
          )}
          {currentView === 'reports-export' && (
            <ReportsExport onNavigate={navigateTo} />
          )}
          {currentView === 'notifications-alerts' && (
            <NotificationsAlerts onNavigate={navigateTo} />
          )}
          {currentView === 'permissions-audit' && (
            <PermissionsAuditLog onNavigate={navigateTo} />
          )}
          {currentView === 'inspection-details' && (
            <InspectionDetails idInspection={selectedInspectionId} onNavigate={navigateTo} />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-xs font-bold">
          © {new Date().getFullYear()} منظومة متابعة التفقد الميداني بوزارة التربية. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
