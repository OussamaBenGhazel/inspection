import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Dashboard from './Dashboard';
import InspectionsList from './InspectionsList';
import NewInspection from './NewInspection';
import InspectionDetails from './InspectionDetails';

// Screen 5 to 15 added imports
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
import MobilePreview from './MobilePreview';
import TeacherProfile from './TeacherProfile';

import { apiService } from './apiService';
import {
  LayoutDashboard, ListFilter, PlusCircle, LogOut, Award, TrendingUp,
  MapPin, CheckSquare, Target, Settings, Eye, HelpCircle, HardHat, FileSpreadsheet, Bell, Shield, Smartphone
} from 'lucide-react';

function AppContent() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedInspectionId, setSelectedInspectionId] = useState(null);

  // Teachers and inspections state
  const [teachers, setTeachers] = useState([]);
  const [recentInspections, setRecentInspections] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    if (user) {
      async function loadData() {
        try {
          const tList = await apiService.getEnseignants();
          setTeachers(tList);
          const iList = await apiService.getRecentInspections();
          setRecentInspections(iList);
        } catch (err) {
          console.error(err);
        }
      }
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
  };

  return (
    <div
      className="min-h-screen bg-slate-50 flex flex-col font-sans relative"
      dir="rtl"
      style={{
        backgroundImage: `radial-gradient(at 0% 0%, rgba(241, 245, 249, 0.6) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(219, 234, 254, 0.3) 0px, transparent 50%)`
      }}
    >
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

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
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 relative z-10">

        {/* Responsive, Complete Sidebar for All 15 Screens */}
        <aside className="w-full lg:w-72 shrink-0">
          <nav className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-sm space-y-1.5 sticky top-24 max-h-[85vh] overflow-y-auto">

            <div className="text-[10px] text-slate-400 font-extrabold uppercase px-4 pb-2 border-b border-slate-100 mb-2">القائمة والواجهات</div>

            {/* Screen 1 */}
            <button
              onClick={() => navigateTo('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-extrabold text-xs transition ${
                currentView === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>لوحة التحكم الرئيسية (S01)</span>
            </button>

            {/* Screen 2 */}
            <button
              onClick={() => navigateTo('teachers-list')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-extrabold text-xs transition ${
                currentView === 'teachers-list' || currentView === 'teacher-profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ListFilter size={16} />
              <span>قائمة الأساتذة (S02)</span>
            </button>

            {/* Screen 4 */}
            <button
              onClick={() => navigateTo('new-inspection')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-extrabold text-xs transition ${
                currentView === 'new-inspection' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <PlusCircle size={16} />
              <span>تسجيل زيارة ميدانية (S04)</span>
            </button>

            {/* Screen 5 */}
            <button
              onClick={() => navigateTo('competencies-board')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-extrabold text-xs transition ${
                currentView === 'competencies-board' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Award size={16} />
              <span>لوحة الكفايات الثمانية (S05)</span>
            </button>

            {/* Screen 6 */}
            <button
              onClick={() => navigateTo('performance-evolution')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-extrabold text-xs transition ${
                currentView === 'performance-evolution' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <TrendingUp size={16} />
              <span>تحليل تطور الأداء (S06)</span>
            </button>

            {/* Screen 7 */}
            <button
              onClick={() => navigateTo('recommendations-tracking')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-extrabold text-xs transition ${
                currentView === 'recommendations-tracking' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CheckSquare size={16} />
              <span>تتبع التوصيات البيداغوجية (S07)</span>
            </button>

            {/* Screen 8 */}
            <button
              onClick={() => navigateTo('professional-indicators')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-extrabold text-xs transition ${
                currentView === 'professional-indicators' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Target size={16} />
              <span>مؤشرات النمو المهني (S08)</span>
            </button>

            {/* Screen 9 */}
            <button
              onClick={() => navigateTo('growth-roadmap')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-extrabold text-xs transition ${
                currentView === 'growth-roadmap' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Settings size={16} />
              <span>خطة النمو الشخصية (S09)</span>
            </button>

            {/* Screen 10 */}
            <button
              onClick={() => navigateTo('quantitative-indicators')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-extrabold text-xs transition ${
                currentView === 'quantitative-indicators' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Eye size={16} />
              <span>المؤشرات الكمية للتطور (S10)</span>
            </button>

            {/* Screen 11 */}
            <button
              onClick={() => navigateTo('final-diagnosis')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-extrabold text-xs transition ${
                currentView === 'final-diagnosis' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <HelpCircle size={16} />
              <span>التشخيص الختامي (S11)</span>
            </button>

            {/* Screen 12 */}
            <button
              onClick={() => navigateTo('reports-export')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-extrabold text-xs transition ${
                currentView === 'reports-export' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileSpreadsheet size={16} />
              <span>التقارير والتصدير (S12)</span>
            </button>

            {/* Screen 13 */}
            <button
              onClick={() => navigateTo('notifications-alerts')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-extrabold text-xs transition ${
                currentView === 'notifications-alerts' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bell size={16} />
              <span>الإشعارات والتنبيهات (S13)</span>
            </button>

            {/* Screen 14 */}
            <button
              onClick={() => navigateTo('permissions-audit')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-extrabold text-xs transition ${
                currentView === 'permissions-audit' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Shield size={16} />
              <span>إدارة الصلاحيات والسجل (S14)</span>
            </button>

            {/* Screen 15 */}
            <button
              onClick={() => navigateTo('mobile-preview')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-extrabold text-xs transition ${
                currentView === 'mobile-preview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Smartphone size={16} />
              <span>المعاينة على الهاتف (S15)</span>
            </button>

          </nav>
        </aside>

        {/* Content Section */}
        <main className="flex-1 min-w-0">
          {currentView === 'dashboard' && (
            <Dashboard
              onNavigate={navigateTo}
              teachers={teachers}
              recentInspections={recentInspections}
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
          {currentView === 'mobile-preview' && (
            <MobilePreview onNavigate={navigateTo} />
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
