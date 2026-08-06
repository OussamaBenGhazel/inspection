import React, { useState, useEffect } from 'react';
import { ArrowRight, Key, Shield, User, History, RefreshCw } from 'lucide-react';
import { apiService } from './apiService';

export default function PermissionsAuditLog({ onNavigate }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Roles Breakdown
  const roles = [
    { title: "مدير النظام (System Admin)", count: "1 مستخدم نشط", desc: "كامل صلاحيات الإدارة والتهيئة، إضافة المؤسسات، والمستخدمين وسجل العمليات." },
    { title: "المتفقد التربوي (Inspectors)", count: "3 مستخدمين", desc: "صلاحيات تسجيل الزيارات الميدانية، تقييم كفايات الأساتذة، رسم التوقيع والتصدير." },
    { title: "الأستاذ (Teachers)", count: "124 مستخدم نشط", desc: "صلاحيات العرض فقط، قراءة التقارير المعتمدة وتحديث أهداف خطة النمو الشخصية." }
  ];

  // Active Users table
  const activeUsers = [
    { name: "أحمد العربي", role: "مدير النظام", status: "نشط 🟢", lastLogin: "اليوم 10:15" },
    { name: "آمنة فرحات", role: "متفقدة أولى", status: "نشط 🟢", lastLogin: "اليوم 13:40" },
    { name: "صالح البكوش", role: "أستاذ أول", status: "غير نشط ⚪", lastLogin: "أمس 18:22" }
  ];

  const fetchLogs = async () => {
    try {
      const data = await apiService.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition"
          >
            <ArrowRight size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">إدارة الصلاحيات وسجل التدقيق التدريجي</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">تتبع وحماية عمليات النظام ورصد الأنشطة في الوقت الفعلي لأمن وسرية التقييمات البيداغوجية.</p>
          </div>
        </div>
      </div>

      {/* USER ROLES PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
        {roles.map((role, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Shield size={18} />
              </span>
              <span className="text-[10px] text-slate-400 font-bold">{role.count}</span>
            </div>
            <h3 className="text-xs font-extrabold text-slate-800">{role.title}</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">{role.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs font-bold leading-relaxed">
        {/* Active Users Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="text-xs text-slate-800 border-b border-slate-100 pb-2">جدول المستخدمين النشطين</h3>
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 text-[11px]">
                <th className="pb-3">المستخدم</th>
                <th className="pb-3">الرتبة / الدور</th>
                <th className="pb-3">الحالة</th>
                <th className="pb-3">آخر تسجيل دخول</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {activeUsers.map((usr, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-extrabold">{usr.name}</td>
                  <td className="py-3 text-slate-500 font-semibold">{usr.role}</td>
                  <td className="py-3 font-extrabold">{usr.status}</td>
                  <td className="py-3 text-slate-400 font-semibold">{usr.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SYSTEM AUDIT LOG */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs text-slate-800 flex items-center gap-1.5">
              <History size={15} />
              <span>سجل العمليات والتدقيق التدريجي الحي</span>
            </h3>
            <button
              onClick={fetchLogs}
              className="p-1 bg-slate-50 hover:bg-slate-100 rounded text-slate-500"
              title="تحديث السجل"
            >
              <RefreshCw size={12} />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-slate-400 font-bold flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin text-blue-500" size={14} />
              <span>جاري تحميل سجل التدقيق...</span>
            </div>
          ) : (
            <div className="relative border-r border-slate-100 pr-4 space-y-4 text-[11px] max-h-80 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-bold">لا توجد عمليات مسجلة في السجل المالي والتدقيقي حتى الآن.</div>
              ) : (
                logs.map((item) => (
                  <div key={item.id} className="relative">
                    <span className="absolute -right-[20px] top-1 h-2 w-2 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                    <div className="space-y-0.5">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-extrabold text-slate-800 bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[9px]">
                          {item.actionName}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold">
                          {new Date(item.timestamp).toLocaleTimeString('ar-TN')}
                        </span>
                      </div>
                      <p className="text-slate-700 font-semibold mt-1">{item.message}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">المشرف: {item.username}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
