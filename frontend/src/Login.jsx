import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { apiService } from './apiService';
import { LogIn, Key, User, ShieldAlert, Sparkles, CircleDot } from 'lucide-react';

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
      className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-950 font-sans relative overflow-hidden selection:bg-blue-500 selection:text-white"
      dir="rtl"
    >
      {/* High Fidelity Interactive and Alive CSS Animations */}
      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.95) translateY(15px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes floatSlow1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.15); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes floatSlow2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-40px, 40px) scale(1.2); }
        }
        @keyframes floatSlow3 {
          0%, 100% { transform: translate(0px, 0px) scale(1.05); }
          50% { transform: translate(25px, -30px) scale(0.95); }
        }
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(5deg); }
        }
        @keyframes shimmerGlow {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes bgPulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.03); }
        }
        @keyframes floatingStar {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
        }

        .animate-entrance {
          animation: fadeInScale 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-float-slow-1 {
          animation: floatSlow1 16s ease-in-out infinite;
        }
        .animate-float-slow-2 {
          animation: floatSlow2 20s ease-in-out infinite;
        }
        .animate-float-slow-3 {
          animation: floatSlow3 18s ease-in-out infinite;
        }
        .animate-float-icon {
          animation: floatIcon 4s ease-in-out infinite;
        }
        .animate-bg-pulse {
          animation: bgPulse 8s ease-in-out infinite;
        }

        .btn-live {
          position: relative;
          background: linear-gradient(90deg, #2563eb, #3b82f6, #4f46e5, #2563eb);
          background-size: 300% 100%;
          transition: all 0.4s ease;
        }
        .btn-live:hover {
          animation: shimmerGlow 2s linear infinite;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
        }
        .btn-live:active {
          transform: translateY(1px);
        }
      `}</style>

      {/* Interactive, colorful pulsing gradient backdrops (Alive elements) */}
      <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-blue-600/30 via-indigo-500/20 to-transparent blur-[120px] pointer-events-none animate-float-slow-1" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[60%] rounded-full bg-gradient-to-bl from-cyan-500/25 via-emerald-500/15 to-transparent blur-[120px] pointer-events-none animate-float-slow-2" />
      <div className="absolute top-[40%] right-[20%] w-[35%] h-[35%] rounded-full bg-blue-500/10 blur-[90px] pointer-events-none animate-float-slow-3" />

      {/* Floating particles background to create high depth & liveness */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-blue-400 rounded-full"
            style={{
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatingStar ${Math.random() * 8 + 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Dynamic Digital Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none animate-bg-pulse" />

      {/* Beautiful Academic Watermark Shield */}
      <div className="absolute top-16 right-16 opacity-[0.025] text-blue-400 pointer-events-none hidden md:block animate-float-slow-3">
        <svg width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M12 8v4M12 16h.01"/>
        </svg>
      </div>

      {/* Dark & Vibrant Modern Glassmorphism Container */}
      <div className="max-w-md w-full mx-4 bg-slate-900/85 backdrop-blur-2xl p-9 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-slate-700/80 hover:border-blue-500/30 transition-all duration-500 z-10 animate-entrance relative overflow-hidden group">

        {/* Subtle decorative internal glow */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500" />

        {/* Header - Ministry & Application Identity */}
        <div className="flex flex-col items-center mb-10 relative">
          <div className="p-4 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white rounded-3xl mb-5 shadow-2xl shadow-blue-500/30 flex items-center justify-center animate-float-icon">
            <LogIn size={32} className="text-white drop-shadow-md" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white tracking-wide bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-200">
              منظومة التفقد الميداني
            </h1>
            <Sparkles size={20} className="text-blue-400 animate-pulse" />
          </div>
          {/* Subtitle "وزارة التربية • الجمهورية التونسية" successfully removed as requested */}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-500/30 text-red-300 rounded-2xl flex items-center gap-3 animate-headShake">
            <ShieldAlert className="shrink-0 text-red-400 animate-pulse" size={20} />
            <span className="text-sm font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div>
            <label className="block text-slate-300 font-bold mb-2 text-sm pr-1">اسم المستخدم</label>
            <div className="relative group/input">
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 group-focus-within/input:text-blue-400 transition-colors duration-300">
                <User size={20} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pr-12 pl-5 py-4 bg-slate-950/60 border border-slate-700/80 focus:border-blue-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:bg-slate-950 text-white placeholder-slate-500 transition-all duration-300 font-medium text-sm shadow-inner"
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-2 text-sm pr-1">كلمة المرور</label>
            <div className="relative group/input">
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 group-focus-within/input:text-blue-400 transition-colors duration-300">
                <Key size={20} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-12 pl-5 py-4 bg-slate-950/60 border border-slate-700/80 focus:border-blue-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:bg-slate-950 text-white placeholder-slate-500 transition-all duration-300 font-medium text-sm shadow-inner"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>
          </div>

          {/* Secure Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-live w-full py-4 text-white font-extrabold rounded-2xl shadow-xl transition-all duration-300 disabled:opacity-50 text-sm tracking-wide flex items-center justify-center gap-2.5 mt-8 border border-white/10"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري المصادقة الآمنة...</span>
              </span>
            ) : (
              <>
                <span>تسجيل الدخول الآمن</span>
                <LogIn size={16} className="text-white/90" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}