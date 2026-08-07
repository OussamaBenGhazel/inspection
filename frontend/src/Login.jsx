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
      className="min-h-screen flex items-center justify-center bg-slate-950 font-sans relative overflow-hidden"
      dir="rtl"
    >
      {/* Inline custom CSS for eye-catching glowing animations */}
      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.96) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.25); }
        }
        .animate-entrance {
          animation: fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-glow {
          animation: pulseGlow 12s ease-in-out infinite;
        }
        .glow-button {
          position: relative;
          overflow: hidden;
        }
        .glow-button::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.13) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(45deg);
          transition: transform 0.5s ease;
        }
        .glow-button:hover::after {
          transform: translate(50%, 50%) rotate(45deg);
        }
      `}</style>

      {/* Modern abstract floating glass orbs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500/40 blur-[130px] animate-glow pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400/40 blur-[130px] animate-glow pointer-events-none" style={{ animationDelay: '-6s' }} />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-[100px] animate-pulse pointer-events-none" />

      {/* Abstract decorative grid pattern background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_60%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Floating Animated Glassmorphism Login Card */}
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.15)] border border-slate-800/80 hover:shadow-[0_0_60px_rgba(59,130,246,0.25)] hover:border-blue-500/30 transition-all duration-500 z-10 animate-entrance">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 text-blue-400 rounded-2xl mb-4 ring-8 ring-blue-500/10 flex items-center justify-center animate-pulse">
            <LogIn size={36} className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          </div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-2xl font-black text-white tracking-wide bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">منظومة التفقد الميداني</h2>
            <Sparkles size={16} className="text-blue-400 animate-spin-slow" />
          </div>
          <p className="text-slate-400 mt-2 font-medium text-xs">وزارة التربية • الجمهورية التونسية</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border-r-4 border-red-500 text-red-200 rounded-xl flex items-center gap-3 animate-bounce">
            <ShieldAlert className="shrink-0 text-red-400" size={20} />
            <span className="text-xs font-bold leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-300 font-extrabold mb-2 text-xs">اسم المستخدم</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500">
                <User size={18} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pr-11 pl-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-950/90 text-white placeholder-slate-600 transition font-bold text-xs"
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-extrabold mb-2 text-xs">كلمة المرور</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500">
                <Key size={18} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-11 pl-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-950/90 text-white placeholder-slate-600 transition font-bold text-xs"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glow-button w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg shadow-blue-950/50 hover:shadow-xl hover:shadow-blue-500/20 transition duration-150 disabled:opacity-50 text-xs tracking-wide flex items-center justify-center gap-2"
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
