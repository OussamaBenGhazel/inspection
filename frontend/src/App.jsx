import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Dashboard from './Dashboard';
import InspectionsList from './InspectionsList';
import NewInspection from './NewInspection';
import InspectionDetails from './InspectionDetails';
import { LayoutDashboard, ListFilter, PlusCircle, LogOut } from 'lucide-react';

function AppContent() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedInspectionId, setSelectedInspectionId] = useState(null);

  if (!user) {
    return <Login />;
  }

  const navigateTo = (view, extraId = null) => {
    if (extraId) {
      setSelectedInspectionId(extraId);
    }
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      {/* Arabic/RTL Navbar Header */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl">
              <LayoutDashboard size={20} />
            </div>
            <span className="font-extrabold text-slate-800 text-lg sm:text-xl">تطبيق متابعة التفقد الميداني</span>
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

      {/* Main Layout Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2 sticky top-24">
            <button
              onClick={() => navigateTo('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                currentView === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>لوحة التحكم الرئيسية</span>
            </button>

            <button
              onClick={() => navigateTo('inspections-list')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                currentView === 'inspections-list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ListFilter size={18} />
              <span>قائمة عمليات التفقد</span>
            </button>

            <button
              onClick={() => navigateTo('new-inspection')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                currentView === 'new-inspection' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <PlusCircle size={18} />
              <span>إنشاء تفقد جديد</span>
            </button>
          </nav>
        </aside>

        {/* Content Section */}
        <main className="flex-1 min-w-0">
          {currentView === 'dashboard' && <Dashboard onNavigate={navigateTo} />}
          {currentView === 'inspections-list' && <InspectionsList onNavigate={navigateTo} />}
          {currentView === 'new-inspection' && <NewInspection onNavigate={navigateTo} />}
          {currentView === 'inspection-details' && (
            <InspectionDetails idInspection={selectedInspectionId} onNavigate={navigateTo} />
          )}
        </main>
      </div>

      {/* Footer footer */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-xs">
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
