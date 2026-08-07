import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { apiService } from './apiService';
import { LogIn, Key, User, ShieldAlert, Sparkles } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiService.login(username, password);
      login(data.inspecteur, data.token);
    } catch (err) {
      setError(err.message || 'خطأ في اسم المستخدم أو كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 font-sans relative overflow-hidden"
      dir="rtl"
    >
      {/* Inline custom CSS for subtle modern entrance and float animations */}
      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.97) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes softFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        .animate-entrance {
          animation: fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-float-slow {
          animation: softFloat 10s ease-in-out infinite;
        }
        .btn-shine {
          position: relative;
          overflow: hidden;
        }
        .btn-shine::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(45deg);
          transition: transform 0.6s ease;
        }
        .btn-shine:hover::after {
          transform: translate(50%, 50%) rotate(45deg);
        }
      `}</style>

      {/* Floating background gradient blobs matching application theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-blue-200/30 to-indigo-100/20 blur-[100px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-emerald-100/30 to-teal-100/20 blur-[100px] pointer-events-none animate-float-slow" style={{ animationDelay: '-5s' }} />

      {/* Beautiful Academic Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40 pointer-events-none" />

      {/* Floating Academic Watermark Shield */}
      <div className="absolute top-20 right-20 opacity-[0.03] text-blue-900 pointer-events-none hidden md:block">
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M12 8v4M12 16h.01"/>
        </svg>
      </div>

      {/* Clean & Professional Light-Theme Glassmorphism Card */}
      <div className="max-w-md w-full bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(30,41,59,0.06)] border border-slate-200/60 hover:shadow-[0_15px_50px_rgba(30,41,59,0.1)] transition-all duration-500 z-10 animate-entrance">

        {/* Header - Ministry & Application Identity */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl mb-4 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <LogIn size={28} className="text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-wide">منظومة التفقد الميداني</h2>
            <Sparkles size={16} className="text-blue-500" />
          </div>
          <p className="text-slate-400 mt-1 font-bold text-xs">وزارة التربية • الجمهورية التونسية</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 text-red-700 rounded-xl flex items-center gap-3 animate-pulse">
            <ShieldAlert className="shrink-0 text-red-500" size={20} />
            <span className="text-xs font-bold leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-700 font-extrabold mb-2 text-xs">اسم المستخدم</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
                <User size={18} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pr-11 pl-4 py-3.5 bg-slate-50/80 border border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-slate-800 placeholder-slate-400 transition font-bold text-xs"
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-extrabold mb-2 text-xs">كلمة المرور</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
                <Key size={18} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-11 pl-4 py-3.5 bg-slate-50/80 border border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-slate-800 placeholder-slate-400 transition font-bold text-xs"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>
          </div>

          {/* Secure Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-shine w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/25 transition duration-150 disabled:opacity-50 text-xs tracking-wide flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري المصادقة الآمنة...</span>
              </span>
            ) : (
              <>
                <span>تسجيل الدخول الآمن</span>
                <LogIn size={14} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
